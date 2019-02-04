javascript:
(function() {

	if (mw.config.get('wgAction') === "edit") {
		if (mw.config.get('wgNamespaceNumber') === 0) {
			var newname = prompt("New name");
			if (newname !== null) {
				wpTextbox1.innerHTML = "{{subst:Move/auto" + (newname !== "" ? "|" + newname : "") + "}}" + wpTextbox1.innerHTML;
				wpSummary.value = "提出移動請求至" + (newname !== "" ? "[[" + newname + "]]" : "新名稱");
				wpSave.click();
			}
		} else if (mw.config.get('wgNamespaceNumber') === 1) {
			var reason = prompt("reason");
			if (reason !== "" && newname !== null) {
				var newname = prompt("New name");
				if (newname !== null) {
					wpTextbox1.innerHTML += "{{subst:RM|" + reason + (newname !== "" ? "|" + newname : "") + "}}";
					wpSummary.value = "提出移動請求至" + (newname !== "" ? "[[" + newname + "]]" : "新名稱");
					wpSave.click();
				}
			}
		}
	}

})();
