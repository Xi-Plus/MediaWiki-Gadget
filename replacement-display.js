/* globals ReplacementDisplay:true */
(function() {

    if (mw.config.get('wgAction') !== 'view' && mw.config.get('wgArticleId') !== 0) {
        return;
    }

    if (typeof (ReplacementDisplay) == 'undefined')
        ReplacementDisplay = {};

    if (typeof (ReplacementDisplay.replace) != 'function') {
        ReplacementDisplay.replace = function(string) {
            return string;
        };
    }

    /* if (typeof (ReplacementDisplay.activePage) != 'function') {
        ReplacementDisplay.activePage = function() {
            if (mw.config.get('wgIsArticle')) {
                return true;
            }
            return false;
        };
    }*/

    var content = $('#mw-content-text', mw.util.$content);

    new mw.Api().get({
        action: 'query',
        prop: 'revisions',
        rvprop: ['content'],
        titles: [mw.config.get('wgPageName')],
        formatversion: '2',
    }).done(function(data) {
        new mw.Api().post({
            action: 'parse',
            title: [mw.config.get('wgPageName')],
            text: ReplacementDisplay.replace(data.query.pages[0].revisions[0].content),
            prop: 'text',
        }).done(function(data) {
            content.html(data.parse.text['*']);
        });
    });

})();
