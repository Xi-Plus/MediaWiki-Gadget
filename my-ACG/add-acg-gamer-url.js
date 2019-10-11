javascript: (function() {

    var url = prompt('URL');
    if (!url) {
        mw.notify('已取消');
        return;
    }

    new mw.Api().postWithEditToken({
        'action': 'wbcreateclaim',
        'format': 'json',
        'entity': mw.config.get('wgTitle'),
        'snaktype': 'value',
        'property': 'P1',
        'value': '"' + url + '"',
    }).then(function() {
        mw.notify('成功新增');
        location.reload();
    }, function(e) {
        mw.notify('未知錯誤：' + e);
    });

}
)();
