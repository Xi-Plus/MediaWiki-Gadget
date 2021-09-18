javascript: (function() {
    /* eslint semi: ["error", "always"]*/

    var api = new mw.Api();
    var expiry = prompt('watch time', '1 day');
    if (!expiry) {
        return;
    }

    api.watch(mw.config.get('wgPageName'), expiry)
        .done(function(data) {
            if (data.expiry) {
                mw.notify('監視成功，至 ' + data.expiry);
            } else {
                mw.notify('監視失敗', { type: 'error' });
            }
        })
        .fail(function(err) {
            mw.notify('監視失敗', { type: 'error' });
            console.error(err);
        });
}
)();
