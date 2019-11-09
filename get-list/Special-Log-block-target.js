javascript: (function() {

    var text = "";
    $('li[data-mw-logaction="block/block"]').each(function(i, e) {
        text += $(e).find('a.mw-userlink').eq(1).text() + "<br>";
    });

    var win = window.open("");
    win.document.body.innerHTML = text;

}
)();
