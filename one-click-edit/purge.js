javascript: (function() {

    new mw.Api().post({ action: 'purge', titles: mw.config.get('wgPageName'), forcelinkupdate: 1 }).then(function() {
        mw.notify('Purge successed');
        location.reload();
    }, function() {
        mw.notify('Purge failed', { type: 'error' });
    });

}
)();
