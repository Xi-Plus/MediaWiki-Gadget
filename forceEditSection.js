javascript:
(function() {

	function CreateEditSection(section) {
		var ec = document.createElement("span");
		ec.classList.add("mw-editsection");
		ec.appendChild(document.createElement("span"));
		ec.appendChild(document.createElement("a"));
		ec.appendChild(document.createElement("span"));
		ec.children[0].classList.add("mw-editsection-bracket");
		ec.children[0].appendChild(document.createTextNode("["));
		ec.children[1].href = mw.config.get("wgScriptPath") + '/index.php?title=' + encodeURIComponent(mw.config.get('wgPageName')) + '&action=edit&section=' + section;
		ec.children[1].appendChild(document.createTextNode("編輯"));
		ec.children[2].classList.add("mw-editsection-bracket");
		ec.children[2].appendChild(document.createTextNode("]"));
		return ec;
	}

	if ($(".mw-editsection").length === 0 && $(".mw-headline").length !== 0) {
		$("#firstHeading")[0].appendChild(CreateEditSection(0));
		$(".mw-headline").each(function(i, e) {
			e.appendChild(CreateEditSection(i + 1))
		});
	}

})();
