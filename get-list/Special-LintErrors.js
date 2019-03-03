javascript: (function() {

    var text = "";
    $(".TablePager_col_title>:first-child").each(function(i, e) {
        if (text.indexOf(e.innerText) === -1) {
            text += e.innerText + "<br>";
        }
    });

    var win = window.open("", "Result");
    win.document.body.innerHTML = text;

}
)();
