javascript: (function() {

    new mw.Api().edit(mw.config.get('wgPageName'), function(revision) {
        return {
            text: revision.content,
            summary: 'Null edit',
            minor: true
        };
    }).then(function() {
        mw.notify('成功');
    }, function(e) {
        if (e == 'nocreate-missing') {
            mw.notify('頁面不存在');
        } else {
            mw.notify('未知錯誤：' + e);
        }
    });

}
)();
