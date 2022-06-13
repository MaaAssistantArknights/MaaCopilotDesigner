import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ActionModel } from '../../models/action-model';

declare const charName: any[];

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css']
})
export class ActionComponent implements OnInit {

  myControl = new FormControl('');
  @Input() action = new ActionModel();
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
        this.action.name = value;
        return this.filter(value || '');

      }),
    );

  }

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges) {
    this.myControl.setValue(this.action.name)
  }

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.operatorList.filter(option => option.toLowerCase().includes(filterValue));
  }
  public save() {    
    this.OnSaveClick.emit(this.index);
  }
}
