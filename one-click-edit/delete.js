javascript: (function() {

    new mw.Api().edit(mw.config.get('wgPageName'), function(_revision) {
        return {
            text: '{{delete|Vandalism}}',
            summary: '+delete',
        };
    }).then(function() {
        mw.notify('成功');
        location.reload();
    }, function(e) {
        if (e == 'nocreate-missing') {
            mw.notify('頁面不存在');
        } else {
            mw.notify('未知錯誤：' + e);
        }
    });

}
)();
