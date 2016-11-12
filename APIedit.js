function APIedit (pagename, summary, editfunc) {
	content = "";
	revisions = "";
    function getPageContent() {
		$.ajax({
			type: 'GET',
			url: 'https://zh.wikipedia.org/w/index.php?title='+pagename+'&action=raw',
			success: function success(data) {
				content = data;
				console.log(data);
				console.log("getPageContent Success");
				getPageRevision();
			},
			error: function error(e) {
				alert("getPageContent Error!");
			}
		});
	}
	function getPageRevision() {
		$.ajax({
			type: 'POST',
			url: location.protocol + mw.config.get('wgServer') + mw.config.get('wgScriptPath') + '/api.php',
			data: {
				'action': 'query',
				'format': 'json',
				'prop': 'revisions',
				'rvprop': 'timestamp',
				'titles': pagename
			},
			success: function success(data) {
				console.log("getPageRevision Success");
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
		$.ajax({
			type: 'POST',
			url: location.protocol + mw.config.get('wgServer') + mw.config.get('wgScriptPath') + '/api.php',
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
				// location.reload();
			},
			error: function error(e) {
				alert("editPage Error!");
			}
		});
	}
	getPageContent();
}
function edit(content){
	return "{{用戶沙盒|plain=yes}}\n" + content;
}
pagename = mw.config.get('wgPageName');
APIedit(pagename, "加上[[T:用戶沙盒]]", edit)
