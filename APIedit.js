function APIedit(pagename, summary, editfunc, minoredit = false, finish, testmode = false) { // eslint-disable-line no-unused-vars
	var content = "";
	var revisions = "";
	if (finish === undefined) {
		finish = function() { location.reload() };
	} else if (finish === false) {
		finish = function() { };
	}
	function getPageContent() {
		$.ajax({
			type: 'GET',
			url: mw.config.get("wgServer") + mw.config.get("wgScriptPath") + '/index.php?title=' + encodeURIComponent(pagename) + '&action=raw',
			success: function success(data) {
				content = data;
				getPageRevision();
			},
			error: function error() {
				content = "";
				revisions = "";
				editPage();
			},
		});
	}
	function getPageRevision() {
		$.ajax({
			type: 'POST',
			url: mw.config.get('wgServer') + mw.config.get('wgScriptPath') + '/api.php',
			data: {
				'action': 'query',
				'format': 'json',
				'prop': 'revisions',
				'rvprop': 'timestamp',
				'titles': pagename,
			},
			success: function success(data) {
				var info = data.query.pages;
				for (var key in info) {
					revisions = info[key].revisions[0].timestamp;
					break;
				}
				editPage();
			},
			error: function error() {
				alert("getPageRevision Error!");
			},
		});
	}
	function editPage() {
		content = editfunc(content);
		if (testmode) {
			return;
		}
		var temp = {
			type: 'POST',
			url: mw.config.get('wgServer') + mw.config.get('wgScriptPath') + '/api.php',
			data: {
				'action': 'edit',
				'format': 'json',
				'title': pagename,
				'summary': summary,
				'basetimestamp': revisions,
				'text': content,
				'token': mw.user.tokens.get('csrfToken'),
			},
			success: function success() {
				finish();
			},
			error: function error() {
				alert("editPage Error!");
			},
		};
		if (minoredit) {
			temp.data.minor = "";
		}
		$.ajax(temp);
	}
	getPageContent();
}
