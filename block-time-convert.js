javascript:
(function() {
	function converttime() {
		var timenode = document.getElementsByName("wpExpiry-other")[0];
		var time = timenode.value;
		time = time.replace(/(\d+)年(\d+)月(\d+)日 \(.\) (\d+):(\d+)/, "$1/$2/$3 $4:$5");
		time = time.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1/$2/$3 $4:$5");
		time = time.replace(/(\d{4})(\d{2})(\d{2})(\d{2})/, "$1/$2/$3 $4:00");
		time = time.replace(/(\d{4})(\d{2})(\d{2})/, "$1/$2/$3");
		time = time.replace(/(\d{4})(\d{2})/, "$1/$2");
		time = new Date(Date.parse(time)).toUTCString();
		timenode.value = time;
	}

	function displayconvertbutton() {
		document.getElementById("timeconvertbtn").hidden = (document.getElementsByName("wpExpiry")[0].value !== "other");
	}

	if (mw.config.get('wgCanonicalNamespace') === "Special" && mw.config.get('wgCanonicalSpecialPageName') === "Block") {

		var node = document.createElement("input");
		node.id = "timeconvertbtn";
		node.type = "button";
		node.value = "轉換";
		document.getElementsByName("wpExpiry-other")[0].parentNode.parentNode.appendChild(node);
		document.getElementById("timeconvertbtn").addEventListener("click", converttime);
		document.getElementsByName("wpExpiry")[0].addEventListener("change", displayconvertbutton);
	}

})();
