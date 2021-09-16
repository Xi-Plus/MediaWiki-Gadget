javascript: (function() {

    var pagename = mw.config.get('wgPageName');
    var m = pagename.match(/^Category:自(.+?)带有失效链接的条目$/);
    if (m) {
        var date = m[1];
        var d = new Date(date);
        date = d.getFullYear() + '年' + (d.getMonth() + 1) + '月';
        var newpagename = mw.config.get('wgPageName').replace(/^(Category:自).+?(带有失效链接的条目)$/, '$1' + date + '$2');

        new mw.Api().postWithEditToken({
            action: 'move',
            from: pagename,
            to: newpagename,
            movetalk: 1,
            noredirect: 1,
            reason: '移動到正確日期格式',
        }).then(function() {
            mw.notify('成功');
            location.reload();
        }, function(e) {
            mw.notify('未知錯誤：' + e);
        });
    } else {
        mw.notify('無法解析名稱');
    }

}
)();
