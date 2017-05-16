var backlog = mw.util.addPortletLink(
	'p-personal',
	'#',
	'adminbacklog',
	'pt-backlog',
	'adminbacklog',
	'',
	'#pt-userpage'
);
var path = mw.config.get('wgArticlePath');
backlog.innerHTML =
	'<a id="adminbacklog-csd" href="' + path.replace('$1', 'Category:快速删除候选') + '">CSD 未取得</a> ' +
	'<a id="adminbacklog-ep" href="' + path.replace('$1', 'Category:維基百科編輯被保護頁面請求') + '">EP 未取得</a> ' +
	'<a id="adminbacklog-ub" href="' + path.replace('$1', 'Category:封禁申诉') + '">UB 未取得</a> ';

var api = new mw.Api();
function getCSD() {
	api.get({
		action: "query",
		format: "json",
		prop: "categoryinfo",
		titles: "Category:快速删除候选"
		}).done( function ( data ) {
			$.each( data.query.pages, function( i, item ) {
				document.all["adminbacklog-csd"].innerHTML = 'CSD ' + item.categoryinfo.size;
			});
		});
	console.log("update CSD");
}
function getEP() {
	api.get({
		action: "query",
		format: "json",
		prop: "categoryinfo",
		titles: "Category:維基百科編輯被保護頁面請求"
		}).done( function ( data ) {
			$.each( data.query.pages, function( i, item ) {
				document.all["adminbacklog-ep"].innerHTML = 'EP ' + item.categoryinfo.pages;
			});
		});
	console.log("update EP");
}
function getUB() {
	api.get({
		action: "query",
		format: "json",
		prop: "categoryinfo",
		titles: "Category:封禁申诉"
		}).done( function ( data ) {
			$.each( data.query.pages, function( i, item ) {
				document.all["adminbacklog-ub"].innerHTML = 'UB ' + item.categoryinfo.pages;
			});
		});
	console.log("update EP");
}
setInterval(getCSD, 10*1000);
getCSD();
setInterval(getEP, 60*1000);
getEP();
setInterval(getUB, 5*60*1000);
getUB();
