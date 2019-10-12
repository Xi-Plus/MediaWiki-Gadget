javascript: (function() {

    var api = new mw.Api();
    api.get({
        'action': 'wbgetclaims',
        'format': 'json',
        'entity': mw.config.get('wgTitle'),
        'property': 'P25'
    }).then(function(data) {
        if (data['claims']['P25'] !== undefined) {
            mw.notify('已存在資料');
            return;
        }

        var minutes = prompt('長度', '24');
        if (!minutes) {
            mw.notify('已取消');
            return;
        }

        api.postWithEditToken({
            'action': 'wbcreateclaim',
            'format': 'json',
            'entity': mw.config.get('wgTitle'),
            'snaktype': 'value',
            'property': 'P25',
            'value': JSON.stringify({
                'amount': '+' + minutes,
                'unit': 'https://xiplus.ddns.net/entity/Q54'
            }),
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
