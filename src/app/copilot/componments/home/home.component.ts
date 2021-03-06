import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, } from '@angular/material/dialog';
import { CopilotModel } from '../../models/copilot-model';
import { OperatorModel } from '../../models/operator-model';
import { ActionModel } from '../../models/action-model';
import { CopilotService } from '../../services/copilot.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SearchGridService } from '../../services/search-grid.service';
import { ActionType, EditMode } from 'src/app/shared/models/actionType';
import { CopilotDetailComponent } from '../copilot-detail/copilot-detail.component';
import { SearchModel } from '../../models/search-model';
import { LoginComponent } from 'src/app/auth/componments/login/login.component';
import { ChangePassComponent } from 'src/app/auth/componments/change-pass/change-pass.component';
import { userRoleEnum } from 'src/app/shared/userRoleEnum';
import { EmailValidator } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

declare var RateRenderer: any;
declare var ActionRenderer: any;


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public homework: CopilotModel;

  public searchDTO: SearchModel = new SearchModel();

  public currentEdit: EditMode;
  public currentOperator = new OperatorModel();
  public currentAction = new ActionModel();
  public operatorEditIndex = -1
  public actionEditIndex = -1
  public isLogin: any;
  public role: string = '';
  public currentUser: string = '';
  public hasEditPermission: boolean = false;

  @ViewChild('searchGrid', { read: ElementRef }) mySearchGrid: ElementRef | undefined;
  gridApi: any;
  gridColumnApi: any;
  public rowData!: any;
  public pageSize = 50;
  public pageIndex = 1;
  components = {
    'raterenderer': RateRenderer,
    'actionrenderer': ActionRenderer
  };

  constructor(public dialog: MatDialog, public service: CopilotService, private messageService: ToastrService, private authService: AuthService,
    public gridService: SearchGridService, private route: ActivatedRoute, private router: Router) {
    this.homework = new CopilotModel();
    this.currentEdit = EditMode.Operator;
  }


  ngOnInit(): void {
    this.rowData = { data: [], page: 1, total: 0 };
    this.setUserInfo();
    this.initializedGrid();
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.get('activeToken')) {
        this.authService.active(params.get('activeToken') + '').subscribe(res => {
          if (res.status_code == 200) {
            this.messageService.success("??????????????????????????????????????????")
          }
          else this.messageService.error(`${res.message}`)
          this.router.navigateByUrl('/')
        })
      }
    })

  }
  AfterViewInit(): void {
    this.setUserInfo();
  }
  setUserInfo(): void {
    this.isLogin = this.authService.isLoggedIn();
    this.role = this.authService.getRole();
    this.currentUser = this.authService.getUserName();
  }
  handelOperatorAction(event: any) {
    if (event == ActionType[1]) {
      this.homework.opers.push(this.currentOperator)
      this.currentOperator = new OperatorModel()
    }
  }
  initializedGrid() {
    this.gridService.gridOptions = {
      defaultColDef: {
        sortable: false,
        resizeable: true,
        filter: true,
        menuTabs: ['generalMenuTab', 'columnsMenuTab'],
        minWidth: 100,
        flex: 1
      },
      columnDefs: this.gridService.getColumnDef(),
      context: {
        componmentParent: this,
        gridDiv: this.mySearchGrid?.nativeElement
      },
      paginationPageSize: this.pageSize,
      onCellClicked: this.onCellClicked.bind(this)
    }
  }
  onGridReady(params: any) {
    this.gridService.api = params.api;
    this.gridService.columnApi = params.columnApi;
    this.gridService.get(`?desc=true&limit=${this.pageSize}`).subscribe((data) => {
      this.rowData = data.data;
    });
    this.gridService.api.sizeColumnsToFit()
  }
  onCellClicked(params: any) {
    let id = params.data.id;
    let action = params.event.target.dataset.action;
    if (params.column.colId === "action") {

      if (action == 'detail') {
        this.openHomeworkDialog({ id })
      }
      else if (action == 'copy') {
        this.copyID(id);
      }
      else if (action == 'delete') {
        this.deleteHomework(id);
      }
    }
    else if (params.column.colId === "rate") {
      if (!this.isLogin) this.messageService.error(`????????????????????????????????????!`)
      else {
        this.service.rate(action, params.data.id).subscribe(res => {
          if (res.status_code == 200) {
            this.messageService.success("????????????")
            this.search();
          }
          else this.messageService.error(`${res.message}`)
        })
      }
    }
  }
  onChangePage($event: any) {
    this.pageIndex = $event.pageIndex + 1;
    this.pageSize = $event.pageSize;
    this.search();
  }
  changepass() {
    const dialogRef = this.dialog.open(ChangePassComponent, {
      data: { type: "name" },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let value = result.value;
        if (result.changePass) {
          this.authService.changePassword(value.original_password, value.new_password).subscribe(res => {
            if (res.status_code == 200) {
              this.messageService.success("??????????????????")
            }
            else this.messageService.error(`${res.message}`)
          })
        }
        else {
          var obj = { email: value.email, user_name: value.user_name };
          if (obj.email == "") obj.email = null;
          if (obj.user_name == "") obj.user_name = null;
          this.authService.updateInfo(obj).subscribe(res => {
            if (res.status_code == 200) {
              this.messageService.success("????????????????????????")
              if (obj.email) this.authService.setData("email", value.email)
              if (obj.user_name) this.authService.setData("username", value.user_name)
              this.search();
            }
            else this.messageService.error(`${res.message}`)
          })
        }
      }
    });
  }
  register() {
    const dialogRef = this.dialog.open(LoginComponent, {
      data: { type: 'register' },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.registerUser(result.value).subscribe(res => {
          if (res.status_code == 200) {
            this.messageService.success("????????????????????????????????????")
          }
          else this.messageService.error(`?????????????????????${res.message}`)
        })
      }
    });
  }
  login() {
    const dialogRef = this.dialog.open(LoginComponent, {
      data: {},
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let value = result.value
        if (result.type != 'forgetpass') {
          this.authService.login(value.email, value.password).then(res => {
            if (res.data) {
              this.messageService.success("????????????")
              this.setUserInfo()
              this.gridService.api.refreshCells({ force: true });
            }
            else this.messageService.error(`???????????????${res.message}`)
          })
        }
        else {
          if (value.email == '') this.messageService.error(`??????????????????`)
          else {
            this.authService.forgetPass(value.email).subscribe(res => {
              if (res.data) {
                this.messageService.success("????????????????????????????????????")
              }
              else this.messageService.error(`?????????????????????${res.message}`)
            })
          }
        }
      }
    });
  }
  createUser() {
    const dialogRef = this.dialog.open(LoginComponent, {
      data: { type: 'addUser' },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.createUser(result.value).subscribe(res => {
          if (res.status_code == 200) {
            this.messageService.success("??????????????????")
          }
          else this.messageService.error(`????????????${res.message}`)
        })
      }
    });
  }
  logout() {
    this.authService.logout();
    this.messageService.success("??????????????????")
    this.setUserInfo()
    this.gridService.api.refreshCells({ force: true });
  }
  copyID(id: any): void {
    this.messageService.success("???????????????????????????????????????????????????MAA????????????????????????");
    navigator.clipboard.writeText("maa://" + id);
  }
  deleteHomework(id: any): void {
    this.service.delete(id).subscribe(res => {
      if (res.status_code == 200) {
        this.messageService.success("??????????????????")
        this.search();
      }
      else this.messageService.error(`????????????${res.message}`)
    })
  }
  openHomeworkDialog(data: any): void {
    if (data && data.id) {
      this.service.getByID(data.id).subscribe(res => {

        if (res.status_code == "200") {
          let homeworkData = new CopilotModel();
          homeworkData.load(JSON.parse(res.data.content) as CopilotModel);
          const dialogRef = this.dialog.open(CopilotDetailComponent, {
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%',
            data: { homework: homeworkData, role: this.authService.getRole(), id: data.id },
          });
          dialogRef.afterClosed().subscribe(result => {
            this.search();
          });
        } else {
          this.messageService.error("??????????????????")
        }
      })
    }
    else {
      const dialogRef = this.dialog.open(CopilotDetailComponent, {
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%',
        data: { homework: new CopilotModel(), role: this.authService.getRole() },
      });
      dialogRef.afterClosed().subscribe(result => {
        this.search();
      });
    }
  }
  search(reset: boolean = false) {
    if (reset) this.pageIndex = 1;
    var url = `?page=${this.pageIndex}&limit=${this.pageSize}&desc=true`;
    if (this.searchDTO.stage_name && this.searchDTO.stage_name.trim() != '') url += `&stage_name=${this.searchDTO.stage_name}`
    this.gridService.get(url).subscribe((data) => {
      this.rowData = data.data;
    });
  }
}
