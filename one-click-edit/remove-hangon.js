javascript: (function() {

    new mw.Api().edit(mw.config.get('wgPageName'), function(revision) {
        var content = revision.content;
        content.replace(/{{hang ?on\|.+?}}\n*/, "");
        return {
            text: content,
            summary: '移除hangon',
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
