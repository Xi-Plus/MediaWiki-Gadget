javascript:
(function(){

var myPrefix = wpTextbox1.value.substring(0, wpTextbox1.selectionStart);
var mySuffix = wpTextbox1.value.substring(wpTextbox1.selectionEnd);
var length = prompt("Length");
if (length !== "" && length !== null) {
	var admin = prompt("Admin");
	if (admin !== "" && admin !== null) {
		wpTextbox1.value = myPrefix + "{{Blocked|" + length + "||" + admin + "}}--~~~~" + mySuffix;
		wpSummary.value += "標記[[T:Blocked]] 已由管理員" + admin + "執行封禁" + length;
		wpMinoredit.click();
		wpSave.click();
	}
}

})();
