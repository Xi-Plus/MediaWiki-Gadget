javascript:
(function(){

mw.loader.using(["mediawiki.util", "mediawiki.notify"]).done(function(){

var getp = mw.util.getParamValue;

var link = "";
if (getp("diff") === "prev" && getp("oldid")) {
	link = "Special:Diff/" + getp("oldid");
} else if (getp("diff") === "next") {
	mw.notify("Cannot get link");
	return;
} else if (!getp("diff") && getp("oldid")) {
	link = "Special:PermaLink/" + getp("oldid");
} else if (getp("diff")) {
	link = "Special:Diff/" + getp("diff");
} else {
	mw.notify("Cannot get link");
	return;
}

link += decodeURIComponent(location.hash);

prompt("wikitext", "[[" + link + "]]");

})();

})();
