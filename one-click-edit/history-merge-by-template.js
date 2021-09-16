javascript: (function() {

    var pagename = decodeURIComponent($("#history-merge-source").text());
    var targetname = mw.config.get('wgPageName');

    if (pagename) {
        var content = null;

        new mw.Api().get({
            action: 'query',
            prop: 'revisions',
            rvprop: ['content'],
            titles: targetname,
            formatversion: '2',
        }).done(function(data) {
            content = data.query.pages[0].revisions[0].content;

            new mw.Api().postWithEditToken({
                action: 'delete',
                title: targetname,
                reason: '刪除以便移動',
            }).then(function() {
                mw.notify('刪除成功');

                new mw.Api().postWithEditToken({
                    action: 'move',
                    from: pagename,
                    to: targetname,
                    movetalk: 1,
                    noredirect: 1,
                    reason: '合併歷史',
                }).then(function() {
                    mw.notify('移動成功');

                    new mw.Api().postWithEditToken({
                        action: 'undelete',
                        title: targetname,
                        reason: '合併歷史',
                    }).then(function() {
                        mw.notify('還原成功');

                        new mw.Api().edit(targetname, function() {
                            content = content.replace(/\{\{\s*(Histmerge|History[ _]merge)\s*(\|(?:\{\{[^{}]*\}\}|[^{}])*)?\}\}\s*/ig, "");
                            return {
                                text: content,
                                summary: '合併歷史',
                                minor: true,
                            };
                        }).then(function() {
                            mw.notify('編輯成功');

                        }, function(e) {
                            mw.notify('編輯錯誤：' + e);
                        })

                    }, function(e) {
                        mw.notify('還原錯誤：' + e);
                    });

                }, function(e) {
                    mw.notify('移動錯誤：' + e);
                });

            }, function(e) {
                mw.notify('刪除錯誤：' + e);
            });

        });

    } else {
        mw.notify('無法取得來源頁面');
    }

}
)();
