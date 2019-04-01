javascript: (function() {

    var text = "";
    $("ol.special>li>:first-child").each(function(i, e) {
        text += e.innerText + "<br>";
    });

    var win = window.open("");
    win.document.body.innerHTML = text;

}
)();
