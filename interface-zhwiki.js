/* 頂欄 */

/* 側欄 */
/* sidebar link */
document.all["n-mainpage-description"].hidden = true;
document.all["n-indexpage"].hidden = true;
document.all["n-Featured_content"].hidden = true;
document.all["n-currentevents"].hidden = true;
document.all["n-help"].hidden = true;
document.all["n-portal"].hidden = true;
document.all["n-Information_desk"].hidden = true;
document.all["n-contact"].hidden = true;
document.all["n-about"].hidden = true;
document.all["n-sitesupport"].hidden = true;
document.all["p-electronPdfService-sidebar-portlet-heading"].hidden = true;
document.all["t-upload"].hidden = true;
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
