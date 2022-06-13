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


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public homework: CopilotModel;
  public currentEdit: EditMode;
  public currentOperator = new OperatorModel();
  public currentAction = new ActionModel();
  public operatorEditIndex = -1
  public actionEditIndex = -1
  public isLogin: any;



  constructor(public dialog: MatDialog, public service: CopilotService, private messageService: ToastrService, private authService: AuthService,
    private router: Router) {
    this.homework = new CopilotModel();
    this.currentEdit = EditMode.Operator;
  }


  ngOnInit(): void {
    this.isLogin = this.authService.isLoggedIn();

  }
  handelOperatorAction(event: any) {
    if (event == ActionType[1]) {
      this.homework.opers.push(this.currentOperator)
      this.currentOperator = new OperatorModel()
    }
  }
  

  onDrop(type: string, event: CdkDragDrop<string[]>) {
    if (type == "operator") moveItemInArray(this.homework.opers, event.previousIndex, event.currentIndex);
    else if (type == "action") moveItemInArray(this.homework.actions, event.previousIndex, event.currentIndex);
  }
  itemDelete(type: string, index: any) {
    if (type == "action") this.homework.actions.splice(index, 1);
    if (type == "operator") this.homework.opers.splice(index, 1);
  }
  itemEdit(type: string, index: any) {
    if (type == "action") {
      this.currentAction = this.copy(this.homework.actions[index]);
      this.actionEditIndex = index;
    }
    if (type == "operator") {
      this.currentOperator = this.copy(this.homework.opers[index]);
      this.operatorEditIndex = index;
    }
  }
  itemSave(event: any, objectType: any) {

    if (objectType == "operator") {
      if (event == -1) {
        this.homework.opers.push(this.currentOperator)
      }
      else {
        this.homework.opers[this.operatorEditIndex] = this.copy(this.currentOperator);

        this.operatorEditIndex = -1;
      }
      this.currentOperator = new OperatorModel()
    }
    else if (objectType == "action") {
      if (event == -1) {
        this.homework.actions.push(this.currentAction)
      }
      else {
        this.homework.actions[this.actionEditIndex] = this.copy(this.currentAction);
        this.actionEditIndex = -1;
      }
      this.currentAction = new ActionModel()
    }

  }
  copy(data: any) {
    return JSON.parse(JSON.stringify(data))
  }
  onFileChange(evt: any) {
    let file = evt.target.files[0];
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.homework = JSON.parse(fileReader.result as string, (key, value) => {
        if (key == "actions") {
          (value as any[]).forEach(e => {
            if (!e.location) e.location = [null, null];
          });
          return value;
        }
        else return value;

      });
    }
    fileReader.readAsText(file);
  }
  download() {
    var jsonString = JSON.stringify(this.homework);
    var jsonPretty = JSON.stringify(JSON.parse(jsonString), null, 4);
    var file = new Blob([jsonPretty], { type: 'text/plain' });
    var fileName = this.homework.stage_name + '_' + this.homework.opers.map(o => o.name).join('+') + '.json';
    const url = window.URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
  }
  upload() {
    // if(this.authService.isRole("Ad"))
    this.service.upload(JSON.stringify(this.homework)).subscribe(res => {
      if (res.data && res.status_code == 200) {
        this.messageService.success(`上传成功，请妥善保管神秘代码：${res.data.id}`, "", { timeOut: 10000 })
      }
    })
  }
  login() {
    this.router.navigateByUrl('/login');
  }
  logout() {
    this.authService.logout()
    this.isLogin = false;
  }
}



export class CopilogDetailDialog {
  constructor(
    public dialogRef: MatDialogRef<CopilogDetailDialog>,
    @Inject(MAT_DIALOG_DATA) public data: CopilotModel,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
enum EditMode {
  Operator = 1,
  Group = 2
}
enum ActionType {
  新增 = 1,
  更新 = 2
}
