import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { OperatorModel } from '../../models/operator-model';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { moveItemInArray, CdkDragDrop } from "@angular/cdk/drag-drop";

declare const charName: any[];

@Component({
  selector: 'operator',
  templateUrl: './operator.component.html',
  styleUrls: ['./operator.component.css']
})
export class OperatorComponent implements OnInit {

  myControl = new FormControl('');
  @Input() operators!: OperatorModel[];
  @Input() index: number;

  @Output() OnSaveClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() OnEditClick: EventEmitter<number> = new EventEmitter<number>();
  @Output() OnDeleteClick: EventEmitter<number> = new EventEmitter<number>();

  @Input() operator = new OperatorModel();


  filteredOptions: Observable<string[]>;

  public operatorList: any[];
  constructor() {
    this.operatorList = charName;
    this.index = -1;
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        this.operator.name = value;
        return this.filter(value || '');

      }),
    );

  }

  ngOnInit(): void {
    if (!this.operator) this.operators = [] as OperatorModel[]
  }
  ngOnChanges(changes: SimpleChanges) {
    this.myControl.setValue(this.operator.name)
  }

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.operatorList.filter(option => option.toLowerCase().includes(filterValue));
  }
  public save() {
    this.OnSaveClick.emit(this.index);
  }
  public edit(i: number) {
    this.OnEditClick.emit(i);
  }
  public delete(i: number) {
    this.OnDeleteClick.emit(i);
  }
  onDrop(type: string, event: CdkDragDrop<string[]>) {
    moveItemInArray(this.operators, event.previousIndex, event.currentIndex);
  }

}
