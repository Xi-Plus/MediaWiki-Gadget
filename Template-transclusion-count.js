if (mw.config.get('wgNamespaceNumber') == 10) {
	$.ajax({
		type: 'GET',
		url: "https://xiplus.twbbs.org/Xiplus-zhWP/Template-transclusion-count.php?title="+mw.config.get('wgTitle'),
		success: function success(data) {
			data = JSON.parse(data);
			if (data.status) {
				document.getElementsByClassName("mw-indicators mw-body-content")[0].innerHTML+="使用量:"+data.result;
			} else {
				if (data.result == "fetch") {
					document.getElementsByClassName("mw-indicators mw-body-content")[0].innerHTML+="抓取使用量錯誤2";
				} else if (data.result == "match") {
					document.getElementsByClassName("mw-indicators mw-body-content")[0].innerHTML+="分析使用量錯誤";
				} else {
					document.getElementsByClassName("mw-indicators mw-body-content")[0].innerHTML+="未知錯誤";
				}
			}
		},
		error: function error(e) {
			document.getElementsByClassName("mw-indicators mw-body-content")[0].innerHTML+="抓取使用量錯誤1";
		}
	});
}
