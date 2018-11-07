javascript: (function() {

    if (mw.config.get('wgRelevantUserName') === null) {
        mw.notify('未能找到對應用戶');
        return;
    }

    var url = prompt(mw.config.get('wgRelevantUserName') + ' 授權IPBE備案\nURL:');
    if (url === null) {
        return;
    }

    new mw.Api().newSection('Wikipedia:權限申請/申請IP封禁例外權',
        '',
        '{{subst:rfp|' + mw.config.get('wgRelevantUserName') + '|2=[' + url + ' unblock-zh]|status=+}}--~~~~'
    ).then(function(e) {
        mw.notify('成功備案IPBE授權');
    }, function(e) {
        mw.notify('未知錯誤：' + e);
    });

}
)();
