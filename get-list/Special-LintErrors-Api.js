javascript: (function() {

    if (mw.config.get('wgPageName').indexOf('Special:LintErrors/') !== 0) {
        mw.notify('未能檢測Lint錯誤類別');
    }

    var type = mw.config.get('wgPageName').substr(19);

    new mw.Api().get({
        "action": "query",
        "format": "json",
        "list": "linterrors",
        "lntcategories": type,
        "lntlimit": "max"
    }).done(function(data) {
        var result = "";

        data.query.linterrors.forEach(function(page) {
            result += page.title + "<br>";
        });

        var win = window.open("", "Result");
        win.document.body.innerHTML = result;
    });

}
)();
