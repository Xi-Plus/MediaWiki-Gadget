if (mw.config.get('wgPageName') === "Special:最新页面") {
	var patroltoken = "";
	$.ajax({
		type: 'GET',
		url: location.protocol + mw.config.get('wgServer') + mw.config.get('wgScriptPath') + '/api.php',
		data: {
			'action': 'query',
			'format': 'json',
			'meta': 'tokens',
			'type': 'patrol'
		},
		success: function success(data) {
			console.log("get token Success");
			console.log(data.query.tokens.patroltoken);
			patroltoken = data.query.tokens.patroltoken;
		},
		error: function error(e) {
			alert("get token Error!");
		}
	});
	function patrol(id, revid) {
		$.ajax({
			type: 'POST',
			url: location.protocol + mw.config.get('wgServer') + mw.config.get('wgScriptPath') + '/api.php',
			data: {
				'action': 'patrol',
				'format': 'json',
				'revid': revid,
				'token': patroltoken
			},
			success: function success(data) {
				console.log("patrol Success");
				console.log(data);
				if (data.error !== undefined) {
					document.all["patrol_"+id].innerHTML = "API失敗：" + data.error.info;
				} else {
					document.all["patrol_"+id].innerHTML = "已巡查";
				}
			},
			error: function error(e) {
				document.all["patrol_"+id].innerHTML = "Ajax失敗";
			}
		});

	}
	for (var i = 0; i < document.getElementsByClassName("not-patrolled").length; i++) {
		document.getElementsByClassName("not-patrolled")[i].innerHTML+='<a id="patrol_'+i+'" onclick="patrol('+i+','+document.getElementsByClassName("not-patrolled")[i].children[0].href.match(/oldid=(\d+)/)[1]+')">巡查</a>';
	}
}
