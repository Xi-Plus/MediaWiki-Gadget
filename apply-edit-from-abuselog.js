javascript:
(function(){

if (mw.config.get('wgCanonicalSpecialPageName') !== "AbuseLog" || mw.config.get('wgPageName').indexOf("/") === -1 || mw.config.get("wgAbuseFilterVariables")["action"] !== "edit") {
	return;
}

function applyEdit(){
mw.loader.using(['mediawiki.util']).done(function(){
	var form = $("<form target='_blank' method='POST' style='display:none;'></form>").attr({
	    action: "/w/index.php?title=" + encodeURIComponent(mw.config.get("wgAbuseFilterVariables")["article_prefixedtext"]) + "&action=submit&editintro=Template:XSS-editnotice"
	}).appendTo(document.body);

	$('<input type="hidden" />').attr({
		name: "wpTextbox1",
		value: mw.config.get("wgAbuseFilterVariables")["new_wikitext"]}
		).appendTo(form);

	$('<input type="hidden" />').attr({
		name: "wpDiff", value: "1"
		}).appendTo(form);

	$('<input type="hidden" />').attr({
		name: "wpStarttime",
		value: "0"
		}).appendTo(form);

	var d = new Date();
	var edittime = "" + d.getFullYear() + ("0" + (d.getMonth() + 1)).substr(-2) + ("0" + d.getDate()).substr(-2) + d.getHours() + d.getMinutes() + d.getSeconds();
	$('<input type="hidden" />').attr({
		name: "wpEdittime",
		value: edittime
		}).appendTo(form);

	$('<input type="hidden" />').attr({
		name: "wpEditToken",
		value: mw.user.tokens.get('editToken')
		}).appendTo(form);

	var summary = "套用";
	if (mw.util.isIPAddress(mw.config.get("wgAbuseFilterVariables")["user_name"])) {
		summary += "[[Special:Contributions/" + mw.config.get("wgAbuseFilterVariables")["user_name"] + "|" + mw.config.get("wgAbuseFilterVariables")["user_name"] + "]]";
	} else {
		summary += "[[User:" + mw.config.get("wgAbuseFilterVariables")["user_name"] + "|" + mw.config.get("wgAbuseFilterVariables")["user_name"] + "]]";
	}

	function timestamp2mwtime(timestamp) {
		var day = "日一二三四五六";
		var d = new Date(timestamp*1000);
		var res = "";
		res += d.getUTCFullYear() + "年";
		res += (d.getUTCMonth() + 1) + "月";
		res += d.getUTCDate() + "日";
		res += " (" + day[d.getUTCDay()] + ") ";
		res += ("0" + d.getUTCHours()).substr(-2) + ":";
		res += ("0" + d.getUTCMinutes()).substr(-2) + " (UTC)";
		return res;
	}

	summary += "於" + timestamp2mwtime(mw.config.get("wgAbuseFilterVariables")["timestamp"]) + "[[" + mw.config.get('wgPageName') + "|嘗試做出的編輯]]";
	if (mw.config.get("wgAbuseFilterVariables")["summary"]) {
		summary += "，編輯摘要為：" + mw.config.get("wgAbuseFilterVariables")["summary"]
	} else {
		summary += "，無編輯摘要";
	}
	$('<input type="hidden" />').attr({name: "wpSummary", value: summary}).appendTo(form);

	form.submit();
	form.remove();
});
}

var btn = $('<a href="#">套用編輯</a>').insertAfter($("#mw-content-text>fieldset>p>span>a").last()).before(" | ");
btn.on("click", applyEdit);

})();
