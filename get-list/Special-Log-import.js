javascript: (function() {

    var text = "";
    $('li[data-mw-logaction="import/interwiki"]').each(function(i, e) {
        if ($(e).find('a.extiw').next().prop("classList").contains("mw-redirect")) {
            return;
        }
        text += $(e).find('a.extiw').text().replace(/^[a-z]+:/, '') + "," + $(e).find('a.extiw').next().text() + "<br>";
    });

    var win = window.open("");
    win.document.body.innerHTML = text;

}
)();
