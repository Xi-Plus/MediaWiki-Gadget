javascript: (function() {

    new mw.Api().get({
        "action": "query",
        "format": "json",
        "list": "categorymembers",
        "cmtitle": mw.config.get('wgPageName'),
        "cmprop": "title",
        "cmlimit": "max",
    }).done(function(data) {
        var result = "";

        data.query.categorymembers.forEach(function(page) {
            result += page.title + "<br>";
        });

        var win = window.open("", "Result");
        win.document.body.innerHTML = result;
    });

}
)();
