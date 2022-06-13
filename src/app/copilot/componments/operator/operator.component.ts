import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { OperatorModel } from '../../models/operator-model';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

declare const charName: any[];

type NewType = Observable<string[]>;

@Component({
  selector: 'operator',
  templateUrl: './operator.component.html',
  styleUrls: ['./operator.component.css']
})
export class OperatorComponent implements OnInit {

  myControl = new FormControl('');
  @Input() operator = new OperatorModel();
  @Input() index: number;
  @Output() OnSaveClick: EventEmitter<any> = new EventEmitter<any>();
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

}
