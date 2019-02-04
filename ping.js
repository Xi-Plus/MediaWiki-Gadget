javascript:
(function() {

	var template = "noping";
	var myusername = mw.config.get('wgUserName');
	var myPrefix = wpTextbox1.value.substring(0, wpTextbox1.selectionStart);
	var mySuffix = wpTextbox1.value.substring(wpTextbox1.selectionEnd);
	var list = myPrefix.match(/\[\[((U|UT|User|User talk|User_talk|用戶|使用者|用户|用戶討論|用户讨论):|(Special|特殊):(Contributions|用户贡献|使用者貢獻|用戶貢獻)\/)[^|\]#/]+[^\]]*\]\]/gi);
	if (list === null) {
		wpTextbox1.value = myPrefix + "{{" + template + "|}}" + mySuffix;
		return;
	}
	var username = "";
	for (var i = list.length - 1; i >= 0; i--) {
		var temp = list[i].match(/\[\[(?:(?:U|UT|User|User talk|User_talk|用戶|使用者|用户|用戶討論|用户讨论):|(?:Special|特殊):(?:Contributions|用户贡献|使用者貢獻|用戶貢獻)\/)([^|\]#/]+)[^\]]*\]\]/i);
		if (temp !== null && temp[1][0].toUpperCase() + temp[1].substr(1) != myusername) {
			username = temp[1];
			break;
		}
	}
	var indent = myPrefix.match(/^([:*]+)/mg);
	if (indent === null) {
		indent = ":";
	} else {
		indent = indent[indent.length - 1][0] + indent[indent.length - 1];
	}
	wpTextbox1.value = myPrefix + indent + "{{" + template + "|" + username + "}}" + mySuffix;

})();
