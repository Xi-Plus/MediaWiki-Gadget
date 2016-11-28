javascript:
(function(){

var myPrefix = wpTextbox1.value.substring(0, wpTextbox1.selectionStart);
var mySuffix = wpTextbox1.value.substring(wpTextbox1.selectionEnd);
var type = prompt("Type", "半");
if (type !== "" && type !== null) {
	var length = prompt("Length", "一週");
	var admin = prompt("Admin");
	wpTextbox1.value = myPrefix + "*{{RFPP|" + type + (length!==""&&length!==null?"|"+length:"") + (admin!==""&&admin!==null?"|by="+admin:"") + "}}--~~~~" + mySuffix;
	wpSummary.value += "標記{{RFPP|" + type + (length!==""&&length!==null?"|"+length:"") + (admin!==""&&admin!==null?"|by="+admin:"") + "}}";
	wpMinoredit.click();
	wpSave.click();
}

})();
