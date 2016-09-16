if (location.search.match(/\?title=Wikipedia:%E9%A0%81%E9%9D%A2%E5%AD%98%E5%BB%A2%E8%A8%8E%E8%AB%96\/%E8%A8%98%E9%8C%84\/\d+\/\d+\/\d+&action=edit&section=/) !== null) {
	var text = prompt("Result","r");
	if (text == "") text = "r";
	wpTextbox1.innerHTML = wpTextbox1.innerHTML.replace(/(==\[\[.+\]\]==)/, "$1\n{{delh|"+text+"}}")+"----\n:已處理。—~~~~\n{{delf}}\n";
	var text = prompt("Summary","關閉");
	wpSummary.value = wpSummary.value+text;
	if(confirm("Save?")) wpSave.click();
} else if (location.search.match(/\?title=.+&action=edit/) !== null) {
	var arr = wpTextbox1.innerHTML.match(/{{[av]fd\|.*date=(\d+)[\/-](\d+)[\/-](\d+).*}}/i)
	wpTextbox1.innerHTML = wpTextbox1.innerHTML.replace(/{{[av]fd.+}}/,"");
	wpSummary.value = "關閉[[Wikipedia:頁面存廢討論/記錄/"+arr[1]+"/"+arr[2]+"/"+arr[3]+"]]";
	if(confirm("Save?")) wpSave.click();
} else {
	alert("Wrong page");
}
