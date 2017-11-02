javascript:
(function(){

/* 本工具需配合 https://github.com/Xi-Plus/Xiplus-zhWP/blob/master/APIedit.js 使用 */

function edit(content){
	return content + "\n==您忘了簽名==\n{{subst:Uw-tilde|"+mw.config.get('wgPageName')+"}}--~~~~";
}

var myPrefix = wpTextbox1.value.substring(0, wpTextbox1.selectionStart);
var mySuffix = wpTextbox1.value.substring(wpTextbox1.selectionEnd);
var username = prompt("Username");
if (username !== "" && username !== null) {
	wpTextbox1.value = myPrefix + "{{subst:unsigned|" + username + "}}" + mySuffix;
	wpSummary.value = "[[T:unsigned|補簽名]] [[User:"+username+"|"+username+"]]（[[User talk:"+username+"|對話]]｜[[Special:Contributions/"+username+"|貢獻]]）";
	wpMinoredit.click();
	finish = function(){
		if(confirm("Save?")) wpSave.click();
	};
	if(confirm("Uw-tilde?")) APIedit("User_talk:"+username, "單層級通知：沒有在討論頁上簽名，於[["+mw.config.get('wgPageName')+"]]", edit, false, finish);
	else finish();
}

})();
