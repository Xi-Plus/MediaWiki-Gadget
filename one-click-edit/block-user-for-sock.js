// 1 week
javascript: (function() {

    var user = mw.config.get('wgRelevantUserName');
    if (user === null) {
        mw.notify('未能找到對應用戶');
        return;
    }
    var reason = '確認為傀儡';
    var expiry = '1infinite';
    if (!confirm('封鎖 ' + user + ' ？\n理由：' + reason + '\n期限：' + expiry)) {
        return;
    }
    new mw.Api().postWithEditToken({
        action: 'block',
        user: user,
        expiry: expiry,
        reason: reason,
        anononly: 1,
        nocreate: 1,
        allowusertalk: 1,
    }).then(function() {
        mw.notify('成功封鎖');
    }, function(e) {
        mw.notify('未知錯誤：' + e);
    });

}
)();


// 1 week, notalk
javascript: (function() {
    var user = mw.config.get('wgRelevantUserName');
    if (user === null) {
        mw.notify('未能找到對應用戶');
        return;
    }
    var reason = '確認為傀儡';
    var expiry = '1 week';
    if (!confirm('封鎖 ' + user + ' ？\n理由：' + reason + '\n期限：' + expiry)) {
        return;
    }
    new mw.Api().postWithEditToken({
        action: 'block',
        user: user,
        expiry: expiry,
        reason: reason,
        anononly: 1,
        nocreate: 1,
    }).then(function() {
        mw.notify('成功封鎖');
    }, function(e) {
        mw.notify('未知錯誤：' + e);
    });
}
)();


// 1 week, notalk
javascript: (function() {
    var user = mw.config.get('wgRelevantUserName');
    if (user === null) {
        mw.notify('未能找到對應用戶');
        return;
    }
    var reason = '確認為傀儡';
    var expiry = 'infinite';
    if (!confirm('封鎖 ' + user + ' ？\n理由：' + reason + '\n期限：' + expiry)) {
        return;
    }
    new mw.Api().postWithEditToken({
        action: 'block',
        user: user,
        expiry: expiry,
        reason: reason,
        nocreate: 1,
        noemail: 1,
        autoblock: 1,
    }).then(function() {
        mw.notify('成功封鎖');
    }, function(e) {
        mw.notify('未知錯誤：' + e);
    });
}
)();
