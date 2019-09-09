javascript: (function() {

    var text = '';
    $('.diff-deletedline').each(function(i, e) {
        text += e.innerText.replace(/</g, '&lt;') + '\n';
    });

    var win = window.open('');
    win.document.body.innerHTML = '<pre>' + text + '</pre>';

}
)();
