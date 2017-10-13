javascript:
(function(){


$.ajax({
	type: 'GET',
	url: mw.config.get("wgServer")+mw.config.get("wgScriptPath")+'/index.php?title='+encodeURIComponent(mw.config.get("wgPageName").split("/")[0])+'&action=raw',
	success: function success(data) {
		wpTextbox1.value = data;
	},
	error: function error(e) {
		alert("get fail!");
	}
});

})();
