javascript: (function() {

    if (mw.config.get('wgPageName').indexOf('Special:LintErrors/') !== 0) {
        mw.notify('未能檢測Lint錯誤類別');
    }

    var template = prompt('通過模板？');

    var type = mw.config.get('wgPageName').substr(19);

    var qdata = {
        "action": "query",
        "format": "json",
        "list": "linterrors",
        "lntcategories": type,
        "lntlimit": "max"
    };
    if (mw.util.getParamValue('namespace')) {
        qdata['lntnamespace'] = mw.util.getParamValue('namespace');
    }

    new mw.Api().get(qdata).done(function(data) {
        var result = "";

        data.query.linterrors.forEach(function(page) {
            if (template && page.templateInfo.name != template) {
                return;
            }
            result += page.title + "<br>";
        });

        var win = window.open("", "Result");
        win.document.body.innerHTML = result;
    });

}
)();
