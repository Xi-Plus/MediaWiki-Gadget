var api = new mw.Api();
api.get({
	"action": "query",
	"format": "json",
	"meta": "siteinfo",
	"siprop": "namespacealiases",
}).then(function(data) {
	var result = {};
	data['query']['namespacealiases'].forEach(ns => {
		if (result[ns['id']] === undefined) {
			result[ns['id']] = [];
		}
		result[ns['id']].push(ns['*'])
	});
	var text = '';
	for (const key in result) {
		if (Object.hasOwnProperty.call(result, key)) {
			text += '* ' + key + '（{{ns:' + key + '}}）：' + result[key].map(function(v) { return '&lt;code&gt;' + v + '&lt;/code&gt;' }).join('、') + '<br>';
		}
	}

	var win = window.open("");
	win.document.body.innerHTML = text;
});
