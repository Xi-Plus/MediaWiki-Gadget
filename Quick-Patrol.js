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
					document.all["patrol_"+id].style.color="#F00";
				} else {
					document.all["patrol_"+id].innerHTML = "已巡查";
					document.all["patrol_"+id].style["pointer-events"]="none";
					document.all["patrol_"+id].style.color="#888";
				}
			},
			error: function error(e) {
				document.all["patrol_"+id].innerHTML = "Ajax失敗";
				document.all["patrol_"+id].style.color="#F00";
			}
		});

	}
	function partolall() {
		if (! confirm("確定巡查全部"+document.getElementsByClassName("not-patrolled").length+"個？")) return;
		for (var i = 0; i < document.getElementsByClassName("not-patrolled").length; i++) {
			document.all["patrol_"+i].click();
		}
	}
	for (var i = 0; i < document.getElementsByClassName("not-patrolled").length; i++) {
		document.getElementsByClassName("not-patrolled")[i].innerHTML+='<a id="patrol_'+i+'" onclick="patrol('+i+','+document.getElementsByClassName("not-patrolled")[i].children[0].href.match(/oldid=(\d+)/)[1]+')">巡查</a>';
	}
	for (var i = 0;; i++) {
		if (document.all["mw-content-text"].children[i] === undefined) {
			console.log("無法插入全部巡查按鈕");
			break;
		} else if (document.all["mw-content-text"].children[i].tagName === "UL") {
			document.all["mw-content-text"].children[i].innerHTML+='<li><a onclick="partolall();">巡查全部</a></li>';
			break;
		}
	}
}
