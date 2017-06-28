javascript:
(function(){

if (decodeURI(location.search).match(/\?title=Wikipedia:頁面存廢討論\/記錄\/\d+\/\d+\/\d+&action=edit&section=/) !== null) {
	var text = prompt("Result","r");
	if (text == "" || text == null) text = "r";
	var msg = prompt("Message","已處理");
	if (msg == null) msg = "已處理";
	var backlog = true;
	if (wpTextbox1.value.match("<section end=backlog />") === null) {
		backlog = false;
	}
	wpTextbox1.value = wpTextbox1.value.replace(/(==.+==)/, "$1\n{{delh|"+text+"}}").replace(/<section end=backlog \/>\n?/, "")+"----\n:"+msg+"。—~~~~\n{{delf}}\n";
	if (backlog) {
		wpTextbox1.value += "<section end=backlog />"
	}
	var text = prompt("Summary","關閉，理由："+text+" / "+msg);
	if (text == null) text = "關閉";
	wpSummary.value = wpSummary.value+text;
	if(confirm("Save?")) wpSave.click();
} else if (location.search.match(/\?title=.+&action=edit/) !== null) {
	var arr = wpTextbox1.value.match(/{{[ACVT]fd\|.*?date=(\d+)[\/-](\d+)[\/-](\d+).*?}}/i);
	wpTextbox1.value = wpTextbox1.value.replace(/{{[ACVT]fd.*?}}\n?/i,"").replace(/<noinclude> *<\/noinclude>\n?/i,"");
	if(arr!=null) wpSummary.value = "關閉[[Wikipedia:頁面存廢討論/記錄/"+arr[1]+"/"+arr[2]+"/"+arr[3]+"]]";
	else wpSummary.value = "關閉[[Wikipedia:頁面存廢討論]]";
	if(confirm("Save?")) wpSave.click();
} else {
	alert("Wrong page");
}

})();
