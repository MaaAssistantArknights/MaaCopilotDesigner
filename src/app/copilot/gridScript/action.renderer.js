function ActionRenderer() { }

ActionRenderer.prototype.init = function (params) {
    this.eGui = document.createElement('div');
    let html = '';
    if (params.data) {
        html = `<button class="action-button detail" data-action="detail">查看</button><button class="action-button copy" data-action="copy">复制</button>`
        if (params.data.uploader == params.context.componmentParent.currentUser || (params.context.componmentParent.role && (params.context.componmentParent.role == "Admin" || params.context.componmentParent.role == "SuperAdmin"))) {

            html += `<button class="action-button detail" data-action="delete">删除</button>`
        }
        this.eGui.innerHTML = html;
        this.eLink = this.eGui.querySelectorAll('.action-button');
    }
}
ActionRenderer.prototype.getGui = function () {
    return this.eGui;

}
ActionRenderer.prototype.destroy = function () {
    if (this.eLink) {
        this.eLink.forEach(e => e.removeEventListener('click', this.eventListener));
    }

}