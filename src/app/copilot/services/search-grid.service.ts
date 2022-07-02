import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { userRoleEnum } from 'src/app/shared/userRoleEnum';
import { CopilotService } from './copilot.service';

@Injectable({
  providedIn: 'root'
})
export class SearchGridService {
  options: BehaviorSubject<any> = new BehaviorSubject({});
  gridOptions: any;
  query: string = '';
  api: any;
  columnApi: any;

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
      headerName: '关卡名', maxWidth: 125, colId: 'stage_name', field: 'stage_name', editable: false, resizable: true, suppressSizeToFit: true
    },
    {
      headerName: '浏览次数', maxWidth: 150, colId: 'views', field: 'views', editable: false, resizable: true
    },
    {
      headerName: '点赞', maxWidth: 100, colId: 'rate', field: 'rate', editable: false, resizable: true, suppressSizeToFit: true, floatingFilterComponentParams: { suppressFilterButton: true }, cellRenderer: 'raterenderer'
    }
      ,
    {
      headerName: '好评率', maxWidth: 100, colId: 'rating_ratio', field: 'rating_ratio', editable: false, resizable: true, cellRenderer: function (params: any) {
        if (params.data && params.data.rating_ratio) {
          if (params.data.rating_ratio == -1) return '无记录'
          else return params.data.rating_ratio * 100 + '%'
        }
        return '无记录'
      }
    },
    {
      headerName: '标题', width: 150, colId: 'title', field: 'title', editable: false, resizable: true
    },
    {
      headerName: '描述', width: 150, colId: 'detail', field: 'detail', editable: false, resizable: true
    },
    {
      headerName: '干员', width: 150, colId: 'operators', field: 'operators', editable: false, resizable: true, cellRenderer: function (params: any) {
        if (params.data.operators) return params.data.operators.join(',')
        else return ''
      }
    },
    {
      headerName: '上传者', maxWidth: 100, colId: 'uploader', field: 'uploader', editable: false, resizable: true
    },
    {
      headerName: '操作', minWidth: 200, colId: 'action', field: 'action', editable: false, resizable: true, suppressSizeToFit: true, floatingFilterComponentParams: { suppressFilterButton: true }, cellRenderer: 'actionrenderer'
    }];
  }
}
