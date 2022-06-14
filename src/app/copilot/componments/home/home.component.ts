import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CopilotModel } from '../../models/copilot-model';
import { moveItemInArray, CdkDragDrop } from "@angular/cdk/drag-drop";
import { OperatorModel } from '../../models/operator-model';
import { ActionModel } from '../../models/action-model';
import { CopilotService } from '../../services/copilot.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Router } from '@angular/router';
import { SearchGridService } from '../../services/search-grid.service';
// import { environment } from 'src/environments/environment';
// import { IServerSideDatasource } from 'ag-grid-community';

// import 'ag-grid-community/dist/styles/ag-grid.css';
// import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { ActionType, EditMode } from 'src/app/shared/models/actionType';
import { CopilotDetailComponent } from '../copilot-detail/copilot-detail.component';
import { SearchModel } from '../../models/search-model';
import { LoginComponent } from 'src/app/auth/componments/login/login.component';

declare var SearchServer: any;


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

  @ViewChild('searchGrid', { read: ElementRef }) mySearchGrid: ElementRef | undefined;
  // public itemsPerPage = 10;
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
    this.isLogin = this.authService.isLoggedIn();
    this.rowData = { data: [], page: 1, total: 0 };
    this.initializedGrid();
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
      // onCellClicked: this.onCellClicked.bind(this)
    }
  }
  onGridReady(params: any) {
    this.gridService.get(``).subscribe((data) => {
      this.rowData = data.data;
    });
  }
  onChangePage($event: any) {
    this.pageIndex = $event.pageIndex + 1;
    this.pageSize = $event.pageSize;

    this.search();
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
            this.isLogin = true;
          }
          else this.messageService.error(`登录失败：${res.message}`)
        })
      }
    });
  }
  logout() {
    this.authService.logout();
    this.messageService.success("用户登出成功")
    this.isLogin = false;
  }
  openHomeworkDialog(data: any): void {
    if (data && data.id) {
      this.service.getByID(data.id).subscribe(res => {

        if (res.status_code == "200") {
          const dialogRef = this.dialog.open(CopilotDetailComponent, {
            width: '90%',
            height: '85%',
            data: { homework: JSON.parse(res.data.content), role: this.authService.getRole(), id: data.id },
          });
          dialogRef.afterClosed().subscribe(result => {
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
      });
    }
  }
  search() {
    var url = `?page=${this.pageIndex}&limit=${this.pageSize}`;
    if (this.searchDTO.stage_name && this.searchDTO.stage_name.trim() != '') url += `&stage_name=${this.searchDTO.stage_name}`
    this.gridService.get(url).subscribe((data) => {
      this.rowData = data.data;
    });
  }
}
