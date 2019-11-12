javascript: (function() {

    var text = "";
    $('.mw-flow-contribution a[href^="/wiki/Topic:"]').each(function(i, e) {
        var topic = $(e).attr('href').substr(6);
        if (text.indexOf(topic) === -1) {
            text += topic + "<br>";
        }
    });

    var win = window.open("");
    win.document.body.innerHTML = text;

}
)();
