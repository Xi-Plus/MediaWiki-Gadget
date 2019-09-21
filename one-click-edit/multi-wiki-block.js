var wikis = [
    ['zhwiktionary', 'https://zh.wiktionary.org/w/api.php'],
    ['zhwikinews', 'https://zh.wikinews.org/w/api.php'],
    ['zhwikivoyage', 'https://zh.wikivoyage.org/w/api.php'],
];
var apis = {};
wikis.forEach(function(wiki) {
    if (mw.config.get('wgDBname') === wiki[0]) {
        apis[wiki[0]] = new mw.Api();
    } else {
        apis[wiki[0]] = new mw.ForeignApi(wiki[1]);
    }
});

function multiWikiBlock(user, additionalParams) { // eslint-disable-line no-unused-vars
    wikis.forEach(function(wiki) {
        apis[wiki[0]].postWithEditToken($.extend({
            action: 'block',
            user: user,
            expiry: mw.util.isIPAddress(user, true) ? '1 weeks' : 'infinite',
            reason: '確認為傀儡',
            nocreate: 1,
            autoblock: 1,
        }, additionalParams)).then(function() {
            mw.notify('成功封鎖' + user + '@' + wiki[0]);
        }, function(e) {
            mw.notify('封鎖' + user + '@' + wiki[0] + '失敗：' + e);
        });
    });
}

/**
 * multiWikiBlock('1.2.3.4', {expiry: '6 months', reason: '{{range block}}<!-- xwiki vandal -->'});
 */
