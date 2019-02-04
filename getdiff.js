javascript:
(function() {

	mw.loader.using(["mediawiki.notify"]).done(function() {

		var link = "";
		if (mw.config.get("wgDiffNewId")) {
			if ($(".diff-multi").length > 0) {
				link = "Special:Diff/" + mw.config.get("wgDiffOldId") + "/" + mw.config.get("wgDiffNewId");
			} else {
				link = "Special:Diff/" + mw.config.get("wgDiffNewId");
			}
		} else if (mw.config.get("wgRevisionId")) {
			link = "Special:PermaLink/" + mw.config.get("wgRevisionId");
		} else {
			mw.notify("Cannot get link");
			return;
		}

		link += decodeURIComponent(location.hash);

		prompt("wikitext", "[[" + link + "]]");

	})();

})();
