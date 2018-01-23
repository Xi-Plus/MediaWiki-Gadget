/* 頂欄 */
document.all["pt-betafeatures"].hidden = true;
document.all["pt-logout"].hidden = true;

/* CentralAuth */
function showCentralAuth(username) {
	mw.loader.using(['mediawiki.util']).done(function(){
		mw.util.addPortletLink(
			'p-cactions',
			mw.config.get('wgServer')+mw.config.get('wgArticlePath').replace('$1', 'Special:CentralAuth/'+username),
			'CentralAuth'
		);
	});
}
if (mw.config.get('wgNamespaceNumber') === 2 || mw.config.get('wgNamespaceNumber') === 3) {
	showCentralAuth(mw.config.get('wgTitle').replace(/^([^/]+).*$/, '$1'));
}
if (mw.config.get('wgCanonicalSpecialPageName') === 'Contributions') {
	showCentralAuth(mw.config.get('wgRelevantUserName'));
}

/* 側欄 */
/* mediawiki.util start */
mw.loader.using(['mediawiki.util']).done(function () {

mw.util.addPortletLink(
	'p-tb',
	'/wiki/Special:PrefixIndex/'+mw.config.get('wgPageName'),
	'前綴索引',
	't-prefixindex',
	'',
	'',
	$('#t-specialpages')
);

});
/* mediawiki.util end */
