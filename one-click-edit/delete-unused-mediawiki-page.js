javascript: (function() {

    if (mw.config.get('wgNamespaceNumber') !== 8) {
        mw.notify('非Mediawiki命名空間');
        return;
    }

    if (mw.config.get('wgArticleId') == 0) {
        mw.notify('頁面不存在');
        return;
    }

    var pagename = mw.config.get('wgPageName');

    if (pagename === null) {
        mw.notify('無法取得頁面名稱');
        return;
    }

    var reason;
    switch (mw.config.get('wgDBname')) {
        case 'zhwiki':
            reason = "[[WP:CSD#G8|G8]]: 管理员因技术原因删除页面；無用頁面";
            break;
        case 'zhwiktionary':
            reason = "[[Wiktionary:CSD|G8]]: 管理员因技术原因删除页面；無用頁面";
            break;
        default:
            mw.notify('不支援在此Wiki上執行');
            return;
    }

    if (!confirm('刪除 ' + pagename + ' ？\n原因：' + reason)) {
        mw.notify('已取消執行刪除');
        return;
    }

    new mw.Api().postWithEditToken({
        action: "delete",
        title: pagename,
        reason: reason
    }).then(function() {
        mw.notify('成功刪除');
    }, function(e) {
        mw.notify('未知錯誤：' + e);
    });

}
)();
