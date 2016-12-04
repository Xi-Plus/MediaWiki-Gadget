javascript:
(function(){

var myPrefix = wpTextbox1.value.substring(0, wpTextbox1.selectionStart);
var Selected = wpTextbox1.value.substring(wpTextbox1.selectionStart, wpTextbox1.selectionEnd);
var mySuffix = wpTextbox1.value.substring(wpTextbox1.selectionEnd);

var admin = prompt("Admin");
if (admin !== "" && admin !== null) {
	var article = Selected.match(/\|article = (.+)/)[1];
	Selected = Selected.replace(/\|status = .+/, "|status = +");
	wpTextbox1.value = myPrefix + Selected + "::已由管理員[[User:" + admin + "|" + admin + "]]處理--~~~~\n" + mySuffix;
	wpSummary.value = "標記[[" + article + "]]已由管理員[[User:" + admin + "|" + admin + "]]處理";
	wpMinoredit.click();
	wpSave.click();
}

})();
