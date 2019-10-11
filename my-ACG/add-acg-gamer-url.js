javascript: (function() {

    var api = new mw.Api();
    api.get({
        'action': 'wbgetclaims',
        'format': 'json',
        'entity': mw.config.get('wgTitle'),
        'property': 'P1'
    }).then(function(data) {
        if (data['claims']['P1'] !== undefined) {
            mw.notify('已存在資料');
            return;
        }

        var url = prompt('URL');
        if (!url) {
            mw.notify('已取消');
            return;
        }

        api.postWithEditToken({
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
    }, function(e) {
        mw.notify('未知錯誤：' + e);
    });

}
)();
