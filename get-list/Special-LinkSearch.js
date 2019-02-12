javascript: (function() {

    var text = "";
    $("ol.special>li>a:not(.external)").each(function(i, e) {
        if (text.indexOf(e.innerText) === -1) {
            text += e.innerText + "<br>";
        }
    });

    var win = window.open("");
    win.document.body.innerHTML = text;

}
)();
