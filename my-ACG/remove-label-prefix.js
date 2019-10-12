javascript: (function() {

    var api = new mw.Api();
    api.get({
        'action': 'wbgetentities',
        'format': 'json',
        'ids': mw.config.get('wgTitle'),
        'props': 'labels',
        'languages': 'zh-tw'
    }).then(function(data) {
        var oldvalue = data['entities'][mw.config.get('wgTitle')]['labels']['zh-tw']['value'];
        var newvalue = oldvalue.replace(/^物語系列\d+ /, '');

        if (!confirm('標籤從 ' + oldvalue + ' 改為 ' + newvalue)) {
            mw.notify('已取消');
            return;
        }

        api.postWithEditToken({
            'action': 'wbsetlabel',
            'format': 'json',
            'id': mw.config.get('wgTitle'),
            'language': 'zh-tw',
            'value': newvalue
        }).then(function() {
            mw.notify('成功更新');
            location.reload();
        }, function(e) {
            mw.notify('未知錯誤：' + e);
        });

    }, function(e) {
        mw.notify('未知錯誤：' + e);
    });

}
)();
