javascript: (function() {

    new mw.Api().edit(mw.config.get('wgPageName'), function() {
        return {
            text: "#REDIRECT [[" + mw.config.get('wgPageName').substring(0, mw.config.get('wgPageName').length - 1) + "]]",
            summary: '[[Special:PermaLink/5553226|刪除請求]]'
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
