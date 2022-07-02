import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { EditMode } from 'src/app/shared/models/actionType';
import { ActionModel } from '../../models/action-model';
import { CopilotModel, OperatorGroupModel } from '../../models/copilot-model';
import { OperatorModel } from '../../models/operator-model';
import { moveItemInArray, CdkDragDrop } from "@angular/cdk/drag-drop";
import { CopilotService } from '../../services/copilot.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-copilot-detail',
  templateUrl: './copilot-detail.component.html',
  styleUrls: ['./copilot-detail.component.css']
})
export class CopilotDetailComponent {

  public currentEdit: EditMode = EditMode.Operator;
  public editList: any[];
  public currentOperator = new OperatorModel();
  public currentAction = new ActionModel();
  public currentGroup = new OperatorGroupModel();
  public operatorEditIndex = -1
  public actionEditIndex = -1
  public groupEditIndex = -1
  public userRole: string = '';
  public homework: CopilotModel = new CopilotModel();
  public id = 0;

  constructor(
    public dialogRef: MatDialogRef<CopilotDetailComponent>,
    private messageService: ToastrService,
    public service: CopilotService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

    this.homework = data.homework;
    this.userRole = data.role;
    this.id = data.id;
    this.currentEdit = EditMode.Operator;
    this.editList = [
      { "name": "修改干员", "id": 1 },
      { "name": "修改群组", "id": 2 },
    ]
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onDrop(type: string, event: CdkDragDrop<string[]>) {
    if (type == "operator") moveItemInArray(this.homework.opers, event.previousIndex, event.currentIndex);
    else if (type == "action") moveItemInArray(this.homework.actions, event.previousIndex, event.currentIndex);
  }
  itemDelete(type: string, index: any) {
    if (type == "action") { this.homework.actions.splice(index, 1); this.actionEditIndex = -1; }
    if (type == "operator") { this.homework.opers.splice(index, 1); this.operatorEditIndex = -1; }
    if (type == "group") { this.homework.groups.splice(index, 1); this.groupEditIndex = -1; }
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
    if (type == "group") {
      this.currentGroup = this.copy(this.homework.groups[index]);
      this.groupEditIndex = index;
    }
  }
  clear() {
    this.homework = new CopilotModel();
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
    else if (objectType == "group") {
      if (event == -1) {
        this.homework.groups.push(this.currentGroup)
      }
      else {
        this.homework.groups[this.groupEditIndex] = this.copy(this.currentGroup);
        this.groupEditIndex = -1;
      }
      this.currentGroup = new OperatorGroupModel()
    }

  }
  copy(data: any) {
    return JSON.parse(JSON.stringify(data))
  }
  copyID(): void {
    this.messageService.success("神秘代码已经复制到剪切板，请粘贴到MAA自动战斗界面载入");
    navigator.clipboard.writeText("maa://" + this.id + "");
  }
  onFileChange(evt: any) {
    let file = evt.target.files[0];
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.homework.load(JSON.parse(fileReader.result as string, (key, value) => {
        if (key == "actions") {
          (value as any[]).forEach(e => {
            if (!e.location) e.location = [null, null];
          });
          return value;
        }
        else return value;
      }));
      this.operatorEditIndex = -1
      this.actionEditIndex = -1
      this.groupEditIndex = -1
      this.currentOperator = new OperatorModel();
      this.currentAction = new ActionModel();
      this.currentGroup = new OperatorGroupModel();
    }
    fileReader.readAsText(file);
  }
  download() {
    this.homework.cleanUP();
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
    this.homework.cleanUP();
    if (this.userRole && this.userRole != "User") {
      if (this.id && this.id > 0) {
        this.service.upload({ content: JSON.stringify(this.homework), id: this.id }).subscribe(res => {
          if (res.status_code == 200) {
            this.messageService.success(`更新成功`, "", { timeOut: 10000 })
          }
          else {
            this.messageService.error(res.message, "", { timeOut: 5000 })
          }
        })
      }
      else {
        this.service.upload({ content: JSON.stringify(this.homework) }).subscribe(res => {
          if (res.data && res.status_code == 200) {
            this.messageService.success(`上传成功，请妥善保管神秘代码：maa://${res.data.id}`, "", { timeOut: 10000 })
          }
          else {
            this.messageService.error(res.message, "", { timeOut: 5000 })
          }
        })
      }
    }
    else this.messageService.warning("抱歉您没有权限上传作业至服务器")
  }
}