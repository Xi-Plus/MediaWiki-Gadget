javascript: (function() {

    if (mw.config.get('wgRelevantUserName') === null) {
        mw.notify("未能找到對應用戶");
        return;
    }

    var usertalk = 'User talk:' + mw.config.get('wgRelevantUserName');

    new mw.Api().get({
        action: 'query',
        prop: 'info',
        titles: usertalk
    }).done(function(data) {

        if (Object.values(data.query.pages)[0].contentmodel == 'flow-board') {
            new mw.Api().postWithEditToken({
                action: 'flow',
                page: usertalk,
                submodule: 'new-topic',
                nttopic: '授予IP封禁例外權通知',
                ntcontent: '{{subst:Ipexemptgranted|temp=1}}',
                ntformat: 'wikitext',
            }).then(function(e) {
                mw.notify('成功發送授予IP封禁例外權通知');
            }, function(e) {
                mw.notify('未知錯誤：' + e);
            });
        } else {
            new mw.Api().newSection(usertalk,
                "",
                "{{subst:Ipexemptgranted|temp=1}}"
            ).then(function(e) {
                mw.notify('成功發送授予IP封禁例外權通知');
            }, function(e) {
                mw.notify('未知錯誤：' + e);
            });
        }

    });
}
)();
