javascript:
(function(){

var list = [];
if (/^Wikipedia:頁面存廢討論\/記錄\/\d+\/\d+\/\d+$/.test(mw.config.get('wgPageName'))) {
	list = list.concat( $(".mw-headline .mw-redirect").toArray() );
}
if (mw.config.get('wgPageName') === "Category:快速删除候选") {
	list = list.concat( $(".redirect-in-category .mw-redirect").toArray() );
}
list = list.concat( $(".shortcutbox .mw-redirect").toArray() );
for (var i = list.length - 1; i >= 0; i--) {
	list[i].href += "?redirect=no";
}

})();
