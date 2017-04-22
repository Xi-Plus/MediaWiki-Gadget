javascript:
(function(){

function edit(content){
	return content + "\n==請在討論頁簽名==\n{{subst:Uw-tilde|"+mw.config.get('wgPageName')+"}}--~~~~";
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
	if(confirm("Uw-tilde?")) APIedit("User_talk:"+username, "單層級通知：沒有在討論頁上簽名，於[["+mw.config.get('wgPageName')+"]]", edit, true, finish);
	else finish();
}

})();
