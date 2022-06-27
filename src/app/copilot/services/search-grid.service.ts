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
      headerName: '浏览次数', maxWidth: 100, colId: 'views', field: 'views', editable: false, resizable: true
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
      headerName: '操作', maxWidth: 250, colId: 'id', field: 'id', editable: false, resizable: true, suppressSizeToFit: true, floatingFilterComponentParams: { suppressFilterButton: true }, cellRenderer: function (params: any) {
        var div = document.createElement('div');
        if (params.data.id) {
          var detailBtn = document.createElement('button');
          detailBtn.innerText = "查看详细";
          detailBtn.addEventListener('click', function (event: any) { params.context.componmentParent.openHomeworkDialog({ id: params.data.id }) })
          var copyBtn = document.createElement('button');
          copyBtn.innerText = "复制神秘代码";
          copyBtn.addEventListener('click', function (event: any) { params.context.componmentParent.copyID(params.data.id) })
          div.append(detailBtn)
          div.append(copyBtn)
          if (params.data.uploader == params.context.componmentParent.currentUser || (params.context.componmentParent.role && parseInt(userRoleEnum[params.context.componmentParent.role]) >= 50)) {
            var deleteBtn = document.createElement('button');
            deleteBtn.innerText = "删除作业";
            deleteBtn.addEventListener('click', function (event: any) { params.context.componmentParent.deleteHomework(params.data.id) })
            div.append(deleteBtn)
          }
        }
        return div;
      }
    }];
  }
}
