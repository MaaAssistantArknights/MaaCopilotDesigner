function RateRenderer() { }

RateRenderer.prototype.init = function (params) {
    this.eGui = document.createElement('div');
    let html = '';
    if (params.data) {
        if (params.data.rating_type == null || params.data.rating_type == "None") html = `<button class="action-button Like" data-action="Like">赞</button><button class="action-button Dislike" data-action="Dislike">踩</button>`
        if (params.data.rating_type == "Like") html = `<button class="action-button Like" style="background-color: aquamarine;" data-action="Like">赞</button><button class="action-button Dislike" data-action="Dislike">踩</button>`
        if (params.data.rating_type == "Dislike") html = `<button class="action-button Like" data-action="Like">赞</button><button class="action-button Dislike" data-action="Dislike" style="background-color: crimson;">踩</button>`

    }
    this.eGui.innerHTML = html;
    this.eLink = this.eGui.querySelectorAll('.action-button');
}
RateRenderer.prototype.getGui = function () {
    return this.eGui;

}
RateRenderer.prototype.destroy = function () {
    if (this.eLink) {
        this.eLink.forEach(e => e.removeEventListener('click', this.eventListener));
    }

}