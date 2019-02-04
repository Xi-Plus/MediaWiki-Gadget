javascript:
(function() {

	var newtitle = prompt("title");
	if (newtitle === null) return;
	var m;
	if ((m = wpTextbox1.value.match(/<s>\[\[(.+?)]]<\/s>→\[\[(.+?)]]/)) !== null) {
		var oldtitle = m[1];
		newtitle = m[2];
	} else {
		var oldtitle = wpTextbox1.value.match(/== *(.+?) *==/)[1];
	}
	wpTextbox1.value = wpTextbox1.value.replace(/== *(.+?) *== *\n?/, "==[[" + newtitle + "]]==\n{{formerly|[[" + oldtitle + "]]}}\n");
	wpSummary.value = "/* " + newtitle + " */ 替換標題[[" + oldtitle + "]]→[[" + newtitle + "]]";
	wpMinoredit.click();
	if (confirm("Save?")) wpSave.click();

})();
