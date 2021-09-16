javascript: (function() {

    new mw.Api().edit(mw.config.get('wgPageName'), function(revision) {
        var text = revision.content;
        text = text.replace(/^#(?:REDIRECT|重定向) \[\[Wikipedia:(?:典範條目|典范条目|特色條目|特色条目)\/(.+?)]][\s\S]*$/i, '{{Wikipedia:典范条目/$1}}');
        text = text.replace(/{{(Wikipedia|维基百科|維基百科):(?:典範條目|特色條目|特色条目)\//,
            '{{Wikipedia:典范条目/');
        return {
            text: text,
            summary: '[[Special:PermaLink/53078964#優良條目和典范条目子頁面繁簡皆有的問題|統一子頁面繁簡]]',
            minor: true,
        };
    }).then(function() {
        mw.notify('成功');
        location.reload();
        /* document.location = mw.config.get('wgArticlePath').replace('$1', mw.config.get('wgPageName')) + "?diff=cur&oldid=prev";*/
    }, function(e) {
        if (e == 'nocreate-missing') {
            mw.notify('頁面不存在');
        } else {
            mw.notify('未知錯誤：' + e);
        }
    });

}
)();
