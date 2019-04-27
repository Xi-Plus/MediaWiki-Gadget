javascript: (function() {

    var user = mw.config.get('wgRelevantUserName');
    if (user === null) {
        mw.notify('未能找到對應用戶');
        return;
    }

    if (!mw.util.isIPAddress(user)) {
        mw.notify('不是匿名用戶');
        return;
    }

    var reason = '{{blocked proxy}}';
    var expiry = '2 years';
    if (!confirm('封鎖 ' + user + ' ？\n理由：' + reason + '\n期限：' + expiry)) {
        return;
    }

    new mw.Api().postWithEditToken({
        action: 'block',
        user: user,
        expiry: expiry,
        reason: reason,
        nocreate: 1,
        allowusertalk: 1,
        reblock: 1,
    }).then(function() {
        mw.notify('成功封鎖');
    }, function(e) {
        mw.notify('未知錯誤：' + e);
    });

}
)();
