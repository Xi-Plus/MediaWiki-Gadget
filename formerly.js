javascript:
(function() {

	var newtitle = prompt('title');
	if (newtitle === null) {
		return;
	}
	var oldtitle = wpTextbox1.value.match(/==+ *(.+?) *==+/)[1];
	wpTextbox1.value = wpTextbox1.value.replace(
		new RegExp('(==+) *' + mw.util.escapeRegExp(oldtitle) + ' *(==+)')
		, '$1 ' + newtitle + ' $2\n{{formerly|' + oldtitle + '}}'
	);
	wpSummary.value = '/* ' + newtitle + ' */ 更改標題，原標題為：' + oldtitle;
	wpMinoredit.click();
	if (confirm('Save?')) {
		wpSave.click();
	}

})();
