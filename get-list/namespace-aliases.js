var api = new mw.Api();
api.get({
	"action": "query",
	"format": "json",
	"meta": "siteinfo",
	"siprop": "namespacealiases"
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
		if (result.hasOwnProperty(key)) {
			text += '* ' + key + '（{{ns:' + key + '}}）：&lt;nowiki&gt;' + result[key].join(', ') + '&lt;/nowiki&gt;<br>';
		}
	}

	var win = window.open("");
	win.document.body.innerHTML = text;
});
