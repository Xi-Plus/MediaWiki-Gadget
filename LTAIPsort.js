javascript:
(function() {

	var hash = Math.random().toString(36).substring(2);
	var text = wpTextbox1.value.replace(/^(\*{{IPvandal)/gm, hash + "$1");
	text = text.split(hash);
	var newtext = text[0];
	text = text.slice(1);
	function cmpip(a, b) {
		a = a.split(".");
		b = b.split(".");
		for (var i = 0; i < 4; i++) {
			if (parseInt(a[i]) < parseInt(b[i])) {
				return -1;
			} else if (parseInt(a[i]) > parseInt(b[i])) {
				return 1;
			}
		}
		return 0;
	}
	text.sort(function(a, b) {
		a = a.match(/\*{{IPvandal\|([^}/]+)/)[1];
		b = b.match(/\*{{IPvandal\|([^}/]+)/)[1];
		return cmpip(a, b);
	});
	for (var i = 0; i < text.length; i++) {
		var t = text[i].trim().split("\n");
		newtext += t[0] + "\n";
		t = t.slice(1);
		if (t.length == 0) {
			continue;
		}
		t.sort(function(a, b) {
			a = a.match(/\*\*{{IPvandal\|([^}]+)}}/)[1];
			b = b.match(/\*\*{{IPvandal\|([^}]+)}}/)[1];
			return cmpip(a, b);
		});
		newtext += t.join("\n") + "\n";
	}
	wpTextbox1.value = newtext;

})();
