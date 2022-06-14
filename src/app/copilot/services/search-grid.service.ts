import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CopilotService } from './copilot.service';

@Injectable({
  providedIn: 'root'
})
export class SearchGridService {
  options: BehaviorSubject<any> = new BehaviorSubject({});
  gridOptions: any;
  query: string = '';

  constructor(private service: CopilotService) {

    

  }
  get(path: string): Observable<any> {
    return this.service.search(path);
  }
  getOptions() {
    return this.options.asObservable();
  }
  setOptions(options: any) {
    return this.options.next(options);
  }
  getColumnDef() {
    return [{
      headerName: '关卡名', width: 150, colId: 'stage_name', field: 'stage_name', editable: false
    },
    {
      headerName: '下载次数', width: 150, colId: 'downloads', field: 'downloads', editable: false
    },
    {
      headerName: '标题', width: 150, colId: 'title', field: 'title', editable: false
    },
    {
      headerName: '描述', width: 150, colId: 'detail', field: 'detail', editable: false
    },
    // {
    //   headerName: '干员', width: 150, colId: 'content', field: 'content', editable: false,
    // },
    {
      headerName: '上传者', width: 150, colId: 'uploader', field: 'uploader', editable: false
    },
    {
      headerName: '操作', width: 150, colId: 'id', field: 'id', editable: false,floatingFilterComponentParams: {suppressFilterButton:true}, cellRenderer: function (params: any) {
        var div = document.createElement('div');
        if (params.data.id) {          
          var a = document.createElement('button');
          a.innerText = "查看详细";
          a.addEventListener('click', function (event: any) { params.context.componmentParent.openHomeworkDialog({ id: params.data.id }) })
          div.append(a)
        }
        return div;
      }
    }];
  }
}
