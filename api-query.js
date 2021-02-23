(function() {

    var query = {
        action: 'query',
        formatversion: '2',
        format: 'jsonfm',
    };
    var buildUrl = function(params) {
        return mw.util.wikiScript('api') + '?' + $.param($.extend(query, params));
    }

    var $dom = $('<div>');

    var buildBotton = function(btnlabel, query) {
        var btn = new OO.ui.ButtonWidget({ label: btnlabel }).$element;
        $(btn).on('click', function() {
            window.open(buildUrl(query));
        });
        $dom.append(btn);
    };

    if (mw.config.get('wgDiffNewId')) {
        buildBotton('New revision', {
            prop: 'revisions',
            rvprop: 'comment|content|contentmodel|flags|ids|parsedcomment|roles|sha1|size|slotsha1|slotsize|tags|timestamp|user|userid',
            titles: mw.config.get('wgPageName'),
            rvstartid: mw.config.get('wgDiffNewId'),
            rvendid: mw.config.get('wgDiffNewId'),
            rvslots: 'main',
        });
    }
    if (mw.config.get('wgRevisionId')) {
        buildBotton('Current revision', {
            prop: 'revisions',
            rvprop: 'comment|content|contentmodel|flags|ids|parsedcomment|roles|sha1|size|slotsha1|slotsize|tags|timestamp|user|userid',
            titles: mw.config.get('wgPageName'),
            rvstartid: mw.config.get('wgRevisionId'),
            rvendid: mw.config.get('wgRevisionId'),
            rvslots: 'main',
        });
    }

    if ($dom.children().length === 0) {
        $dom.append($('<span>Nothing</span>'));
    }

    var mainBtn = mw.util.addPortletLink(
        'p-tb',
        '#',
        'API Query',
        't-api-query',
        'Get API query url'
    );
    $(mainBtn).on('click', function() {
        OO.ui.alert($dom);
    });

})();
