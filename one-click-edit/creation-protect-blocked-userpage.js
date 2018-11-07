javascript: (function() {

    if (mw.config.get('wgRelevantUserName') === null) {
        mw.notify('未能找到對應用戶');
        return;
    }

    var userpage = 'User:' + mw.config.get('wgRelevantUserName');

    if (!confirm('白紙保護 ' + userpage + ' ？')) {
        mw.notify('已取消執行保護');
        return;
    }

    new mw.Api().postWithEditToken({
        action: 'protect',
        title: userpage,
        protections: 'create=sysop',
        expiry: "infinite",
        reason: "被永久封禁的用戶頁"
    }).then(function(e) {
        mw.notify('成功保護');
    }, function(e) {
        mw.notify('未知錯誤：' + e);
    });

}
)();
