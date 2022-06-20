import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { moveItemInArray, CdkDragDrop } from "@angular/cdk/drag-drop";
import { OperatorGroupModel } from '../../models/copilot-model';
import { OperatorModel } from '../../models/operator-model';


@Component({
  selector: 'operator-group',
  templateUrl: './operator-group.component.html',
  styleUrls: ['./operator-group.component.css']
})
export class OperatorGroupComponent implements OnInit {

  @Input() groups!: OperatorGroupModel[];
  @Input() index: number;
  @Input() group = new OperatorGroupModel();
  @Output() OnSaveClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() OnEditClick: EventEmitter<number> = new EventEmitter<number>();
  @Output() OnDeleteClick: EventEmitter<number> = new EventEmitter<number>();

  public currentOperator = new OperatorModel();
  public operatorEditIndex = -1;  

  constructor() {
    this.index = -1;
  }

  ngOnInit(): void {
    this.index = -1;
    if (!this.groups) this.groups = [] as OperatorGroupModel[]
    if (!this.group) this.group = new OperatorGroupModel();
  }
  public save() {
    this.currentOperator = new OperatorModel();
    this.OnSaveClick.emit(this.index);
  }
  public edit(i: number) {
    this.currentOperator =  new OperatorModel();    
    this.OnEditClick.emit(i);
  }
  public delete(i: number) {
    this.OnDeleteClick.emit(i);
  }
  onDrop(type: string, event: CdkDragDrop<string[]>) {
    moveItemInArray(this.groups, event.previousIndex, event.currentIndex);
  }

  itemDelete(index: any) {
    this.group.opers.splice(index, 1);
  }
  itemEdit(index: any) {
    this.currentOperator = this.copy(this.group.opers[index]);
    this.operatorEditIndex = index;
  }
  itemSave(index: any) {
    if (index == -1) {
      this.group.opers.push(this.currentOperator)
    }
    else {
      this.group.opers[this.operatorEditIndex] = this.copy(this.currentOperator);
      this.operatorEditIndex = -1;
    }
    this.currentOperator = new OperatorModel()
  }
  copy(data: any) {
    return JSON.parse(JSON.stringify(data))
  }

}
