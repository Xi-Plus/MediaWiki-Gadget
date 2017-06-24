function APIedit (pagename, summary, editfunc, minoredit = false, finish) {
	content = "";
	revisions = "";
	if (finish === undefined) {
		finish = function(){};
	} else if (finish === false) {
		finish = function(){location.reload()};
	}
    function getPageContent() {
		$.ajax({
			type: 'GET',
			url: mw.config.get("wgServer")+mw.config.get("wgArticlePath").replace("$1", pagename)+'?action=raw',
			success: function success(data) {
				content = data;
				console.log(data);
				console.log("getPageContent Success");
				getPageRevision();
			},
			error: function error(e) {
				content = "";
				revisions = "";
				console.log("getPageContent Error!");
				editPage();
			}
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
				'titles': pagename
			},
			success: function success(data) {
				console.log("getPageRevision Success");
				console.log(data);
				var info = data.query.pages;
				for (var key in info) {
					revisions = info[key].revisions[0].timestamp;
					break;
				}
				editPage();
			},
			error: function error(e) {
				alert("getPageRevision Error!");
			}
		});
	}
	function editPage() {
		content = editfunc(content);
		temp = {
			type: 'POST',
			url: mw.config.get('wgServer') + mw.config.get('wgScriptPath') + '/api.php',
			data: {
				'action': 'edit',
				'format': 'json',
				'title': pagename,
				'summary': summary,
				'basetimestamp': revisions,
				'text': content,
				'token': mw.user.tokens.get('editToken')
			},
			success: function success(data) {
				console.log(data);
				console.log("editPage Success");
				finish();
			},
			error: function error(e) {
				alert("editPage Error!");
			}
		};
		if (minoredit) {
			temp.data.minor = "";
		}
		$.ajax(temp);
	}
	getPageContent();
}
