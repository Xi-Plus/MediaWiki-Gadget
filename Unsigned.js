javascript:
(function(){

var myPrefix = wpTextbox1.value.substring(0, wpTextbox1.selectionStart);
var mySuffix = wpTextbox1.value.substring(wpTextbox1.selectionEnd);
var username = prompt("Username");
if (username !== "") {
	wpTextbox1.value = myPrefix + "{{subst:unsigned|" + username + "}}" + mySuffix;
	wpSummary.value = "掛上[[T:unsigned]] ([[User:" + username + "]])";
	wpMinoredit.click();
	wpSave.click();
}

})();
