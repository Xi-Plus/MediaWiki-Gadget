javascript:
(function(){

mw.loader.using(['mediawiki.api']).done(function(){

var patroll = mw.util.addPortletLink(
	'p-personal',
	'#',
	'patrollcount',
	'pt-mypatroll',
	'patrollcount',
	'',
	'#pt-mycontris'
);
var path = mw.config.get('wgArticlePath');
patroll.innerHTML =
	'(T <a id="unpatrollTalk" href="' + path.replace('$1', 'Special:最新页面?hidepatrolled=1&namespace=1') + '">?</a>)' +
	'(U <a id="unpatrollUser" href="' + path.replace('$1', 'Special:最新页面?hidepatrolled=1&namespace=2') + '">?</a>)' +
	'(UT <a id="unpatrollUsertalk" href="' + path.replace('$1', 'Special:最新页面?hidepatrolled=1&namespace=3') + '">?</a>)';

var api = new mw.Api();
function getPatrollCount() {
	api.get({
		action: "query",
		format: "json",
		list: "recentchanges",
		rcnamespace: "1",
		rcshow: "!patrolled",
		rclimit: "max",
		rctype: "new"
		}).done( function ( data ) {
			unpatrollTalk.innerHTML = data.query.recentchanges.length;
		});
	api.get({
		action: "query",
		format: "json",
		list: "recentchanges",
		rcnamespace: "2",
		rcshow: "!patrolled",
		rclimit: "max",
		rctype: "new"
		}).done( function ( data ) {
			unpatrollUser.innerHTML = data.query.recentchanges.length;
		});
	api.get({
		action: "query",
		format: "json",
		list: "recentchanges",
		rcnamespace: "3",
		rcshow: "!patrolled",
		rclimit: "max",
		rctype: "new"
		}).done( function ( data ) {
			unpatrollUsertalk.innerHTML = data.query.recentchanges.length;
		});
}
if (typeof window.PatrollCountInterval === "number") {
	setInterval(getPatrollCount, PatrollCountInterval);
}
getPatrollCount();

});

})();
