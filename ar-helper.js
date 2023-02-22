// <nowiki>
(function() {

    function findUsername(node) {
        var $links = node.find('a');
        var username = null;
        $links.each((_, link) => {
            var m = link.href.match(/\/wiki\/(?:(?:User|User_talk):|Special:%E7%94%A8%E6%88%B7%E8%B4%A1%E7%8C%AE\/)([^/]+)$/);
            if (m) {
                username = decodeURI(m[1]);
                return false;
            }
        });
        return username;
    }

    function onArPage() {
        mw.util.addCSS(`
        a.ar-helper-email {
            font-weight: bold;
        }
        `)

        var $templates = $('.template-artool');
        $templates.each((_, template) => {
            var $section = $(template).parents('ul').first();
            if ($section.length === 0) {
                return;
            }
            var page = mw.util.getParamValue('page', $(template).find('a')[2].href);
            var username = findUsername($section);
            if (page && username) {
                var divider = document.createElement('span');
                divider.appendChild(document.createTextNode('－'));
                template.appendChild(divider);
                var url = mw.util.getUrl('Special:电邮联系/' + username, {
                    subject: '已刪除內容查詢：' + page,
                    arpage: page,
                });
                $('<a>').attr('href', url).addClass('ar-helper-email').appendTo(template).text('Email');
            }
        });
    }

    function onEmailuser() {
        var subject = mw.util.getParamValue('subject')
        if (subject) {
            document.getElementsByName('wpSubject')[0].value = subject;
        }
        var arpage = mw.util.getParamValue('arpage');
        if (arpage) {
            var api = new mw.Api();
            api.get({
                action: 'query',
                titles: arpage,
                prop: 'deletedrevisions',
                drvprop: 'content',
                drvslots: 'main',
                drvlimit: 1,
                format: 'json',
                formatversion: 2,
            }).done(function(data) {
                var content = data.query.pages[0].deletedrevisions[0].slots.main.content;
                document.getElementsByName('wpText')[0].value = content;
            });
        }
        document.getElementsByName('wpCCMe')[0].checked = false;
    }

    if (mw.config.get('wgPageName') === 'Wikipedia:已删除内容查询'
        && mw.config.get('wgAction') === 'view'
        && mw.config.get('wgRevisionId') === mw.config.get('wgCurRevisionId')) {
        onArPage();
    }

    if (mw.config.get('wgCanonicalSpecialPageName') === 'Emailuser') {
        onEmailuser();
    }

}
)();
// </nowiki>
