javascript: (function() {

    if (/^Wikipedia:頁面存廢討論\/記錄\/\d+\/\d+\/\d+$/.test(mw.config.get('wgPageName'))) {
        var list = $(".mw-headline a");
        for (var i = 0; i < list.length; i++) {
            if (list[i].getAttribute("href").indexOf("/") === 0) {
                var node = document.createElement("a");
                node.href = "/wiki/Special:日志?page=" + list[i].innerText;
                node.innerText = "(日誌)";
                list[i].parentElement.parentElement.appendChild(node);
            }
        }
    }

}
)();
