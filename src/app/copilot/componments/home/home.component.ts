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

  @ViewChild('searchGrid', { read: ElementRef }) mySearchGrid: ElementRef | undefined;
  gridApi: any;
  gridColumnApi: any;
  public rowData!: any;
  public pageSize = 10;
  public pageIndex = 1;

  constructor(public dialog: MatDialog, public service: CopilotService, private messageService: ToastrService, private authService: AuthService, public gridService: SearchGridService) {
    this.homework = new CopilotModel();
    this.currentEdit = EditMode.Operator;
  }


  ngOnInit(): void {
    this.rowData = { data: [], page: 1, total: 0 };
    this.setUserInfo();
    this.initializedGrid();
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
      paginationPageSize: this.pageSize
    }
  }
  onGridReady(params: any) {
    this.gridService.api = params.api;
    this.gridService.columnApi = params.columnApi;
    this.gridService.get(``).subscribe((data) => {
      this.rowData = data.data;
    });
    this.gridService.api.sizeColumnsToFit()
  }
  onChangePage($event: any) {
    this.pageIndex = $event.pageIndex + 1;
    this.pageSize = $event.pageSize;
    this.search();
  }
  changepass() {
    const dialogRef = this.dialog.open(ChangePassComponent, {
      data: {},
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.changePassword(result.original_password, result.new_password).subscribe(res => {
          if (res.status_code == 200) {
            this.messageService.success("密码修改成功")
          }
          else this.messageService.error(`${res.message}`)
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
        this.authService.login(result.email, result.password).then(res => {
          if (res.data) {
            this.messageService.success("登录成功")
            this.setUserInfo()
            this.gridService.api.refreshCells({ force: true });
          }
          else this.messageService.error(`登录失败：${res.message}`)
        })
      }
    });
  }
  createUser() {
    const dialogRef = this.dialog.open(LoginComponent, {
      data: { role: this.role },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.createUser(result).subscribe(res => {
          if (res.status_code == 200) {
            this.messageService.success("新建用户成功")
          }
          else this.messageService.error(`新建失败${res.message}`)
        })
      }
    });
  }
  logout() {
    this.authService.logout();
    this.messageService.success("用户登出成功")
    this.setUserInfo()
    this.gridService.api.refreshCells({ force: true });
  }
  copyID(id: any): void {
    this.messageService.success("神秘代码已经复制到剪切板，请粘贴到MAA自动战斗界面载入");
    navigator.clipboard.writeText("maa://" + id);
  }
  deleteHomework(id: any): void {
    this.service.delete(id).subscribe(res => {
      if (res.status_code == 200) {
        this.messageService.success("删除作业成功")
        this.search();
      }
      else this.messageService.error(`删除失败${res.message}`)
    })
  }
  openHomeworkDialog(data: any): void {
    if (data && data.id) {
      this.service.getByID(data.id).subscribe(res => {

        if (res.status_code == "200") {
          let homeworkData = new CopilotModel();
          homeworkData.load(JSON.parse(res.data.content) as CopilotModel);
          const dialogRef = this.dialog.open(CopilotDetailComponent, {
            width: '90%',
            height: '85%',
            data: { homework: homeworkData, role: this.authService.getRole(), id: data.id },
          });
          dialogRef.afterClosed().subscribe(result => {
            this.search();
          });
        } else {
          this.messageService.error("数据读取失败")
        }
      })
    }
    else {
      const dialogRef = this.dialog.open(CopilotDetailComponent, {
        width: '90%',
        height: '85%',
        data: { homework: new CopilotModel(), role: this.authService.getRole() },
      });
      dialogRef.afterClosed().subscribe(result => {
        this.search();
      });
    }
  }
  search(reset: boolean = false) {
    if (reset) this.pageIndex = 1;
    var url = `?page=${this.pageIndex}&limit=${this.pageSize}`;
    if (this.searchDTO.stage_name && this.searchDTO.stage_name.trim() != '') url += `&stage_name=${this.searchDTO.stage_name}`
    this.gridService.get(url).subscribe((data) => {
      this.rowData = data.data;
    });
  }
}
