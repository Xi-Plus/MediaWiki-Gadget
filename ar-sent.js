javascript: (function () {
	wpTextbox1.value = wpTextbox1.value.replaceAll('{{ARstatus|new|', '{{ARstatus|+|');
	wpTextbox1.value = wpTextbox1.value += ':: {{sent}} --~~~~';
	wpSummary.value += '已發送郵件';
	if (confirm('Save?')) {
		wpSave.click();
	}
})();
