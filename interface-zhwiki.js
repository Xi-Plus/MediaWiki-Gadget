/* 頂欄 */

/* 側欄 */
/* sidebar link */
var hidelist = ["n-mainpage-description", "n-indexpage", "n-Featured_content", "n-currentevents", "n-help", "n-portal", "n-Information_desk", "n-contact", "n-about", "n-sitesupport", "p-electronPdfService-sidebar-portlet-heading", "t-upload"];
for (var i = 0; i < hidelist.length; i++) {
	if (hidelist[i] !== undefined) {
		hidelist[i].hidden = true;
	}
}
/* AFD link */
var today = new Date();
var yesterday = new Date();
var tdby = new Date();
yesterday.setUTCDate(today.getUTCDate()-1);
tdby.setUTCDate(today.getUTCDate()-2);
document.getElementById("p-navigation").children[1].children[0].innerHTML +=
	'<li>'+
		'<a href="/wiki/Wikipedia:頁面存廢討論">AFD</a> '+
		'<a href="/wiki/Wikipedia:頁面存廢討論/積壓投票">積壓</a> '+
		'<a href="/wiki/Wikipedia:頁面存廢討論/記錄">本週</a> '+
		'<a href="/wiki/Wikipedia:頁面存廢討論/記錄/'+tdby.getUTCFullYear()+'/'+(tdby.getUTCMonth()+1<10?'0':'')+(tdby.getUTCMonth()+1)+'/'+(tdby.getUTCDate()<10?'0':'')+tdby.getUTCDate()+'">前</a> '+
		'<a href="/wiki/Wikipedia:頁面存廢討論/記錄/'+yesterday.getUTCFullYear()+'/'+(yesterday.getUTCMonth()+1<10?'0':'')+(yesterday.getUTCMonth()+1)+'/'+(yesterday.getUTCDate()<10?'0':'')+yesterday.getUTCDate()+'">昨</a> '+
		'<a href="/wiki/Wikipedia:頁面存廢討論/記錄/'+today.getUTCFullYear()+'/'+(today.getUTCMonth()+1<10?'0':'')+(today.getUTCMonth()+1)+'/'+(today.getUTCDate()<10?'0':'')+today.getUTCDate()+'">今</a>'+
	'</li><li>'+
		'<a href="/wiki/Wikipedia:当前的破坏">VIP</a> '+
		'<a href="/wiki/Wikipedia:请求保护页面">PT</a> '+
		'<a href="/wiki/Wikipedia:需要管理員注意的用戶名">UAA</a> '+
		'<a href="/wiki/Wikipedia:用戶查核請求">RFCU</a>'+
	'</li>';
