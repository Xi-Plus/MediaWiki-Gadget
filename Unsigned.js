javascript:
(function(){

var myPrefix = wpTextbox1.value.substring(0, wpTextbox1.selectionStart);
var mySuffix = wpTextbox1.value.substring(wpTextbox1.selectionEnd);
var username = prompt("Username");
if (username !== "" && username !== null) {
	wpTextbox1.value = myPrefix + "{{subst:unsigned|" + username + "}}" + mySuffix;
	wpSummary.value = "[[T:unsigned|補簽名]] [[User:"+username+"|"+username+"]]（[[User talk:"+username+"|對話]]｜[[Special:Contributions/"+username+"|貢獻]]）";
	wpMinoredit.click();
	wpSave.click();
}

})();
