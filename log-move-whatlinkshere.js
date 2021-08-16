javascript:
(function() {

    if (mw.config.get('wgCanonicalSpecialPageName') !== 'Log') {
        return;
    }

    mw.loader.using(['mediawiki.util']).done(function() {

        $('li.mw-logline-move>a.new:not(.mw-userlink)').each(function(_, e) {
            $(document.createTextNode(")")).insertAfter(e);
            var url = mw.config.get('wgScript') + '?' + $.param({
                title: 'Special:WhatLinksHere',
                target: mw.util.getParamValue('title', e.href),
            })
            $('<a href="' + url + '">連入</a>').insertAfter(e);
            $(document.createTextNode(" (")).insertAfter(e);
        });

    });

}
)();
