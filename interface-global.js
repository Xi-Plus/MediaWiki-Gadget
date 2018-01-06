/* 頂欄 */
document.all["pt-betafeatures"].hidden = true;
document.all["pt-logout"].hidden = true;

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
