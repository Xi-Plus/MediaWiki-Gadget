javascript:
(function(){

var myPrefix = wpTextbox1.value.substring(0, wpTextbox1.selectionStart);
var mySuffix = wpTextbox1.value.substring(wpTextbox1.selectionEnd);
var type = prompt("Type", "半");
if (type !== "" && type !== null) {
	var length = prompt("Length", "一週");
	if (length !== "" && length !== null) {
		var admin = prompt("Admin");
		if (admin !== "" && admin !== null) {
			wpTextbox1.value = myPrefix + "*{{RFPP|" + type + "|" + length + "|by=" + admin + "}}--~~~~" + mySuffix;
			wpSummary.value += "標記[[T:RFPP]] 已被" + admin + " " + type + "保護" + length;
			wpMinoredit.click();
			wpSave.click();
		}
	}
}

})();
