// <nowiki>
/* globals AEFA:true */
(function() {

	if (mw.config.get('wgCanonicalSpecialPageName') !== "AbuseLog" || mw.config.get('wgPageName').indexOf("/") === -1) {
		return;
	}

	if (typeof (AEFA) == 'undefined') {
		AEFA = {};
	}
	if (typeof (AEFA.summary) != 'string') {
		AEFA.summary = ' via [[User:Xiplus/js/apply-edit-from-abuselog.js|AEFA]]';
	}

	function applyEdit(type) {
		mw.loader.using(['mediawiki.util']).done(function() {
			var actionname = {
				"edit": "編輯",
				"move": "移動",
			};

			var url;
			if (type === "edit") {
				url = "/w/index.php?title=" + encodeURIComponent(mw.config.get("wgAbuseFilterVariables")["page_prefixedtitle"]) + "&action=submit&editintro=Template:XSS-editnotice"
			} else if (type === "move") {
				url = "/w/index.php?title=Special:MovePage/" + encodeURIComponent(mw.config.get("wgAbuseFilterVariables")["moved_from_prefixedtitle"])
			}
			var form = $("<form target='_blank' method='POST' style='display:none;'></form>").attr({
				action: url
			}).appendTo(document.body);

			if (type === "edit") {
				$('<input name="wpAntispam" value="" type="hidden" />').appendTo(form);
				$('<input name="wpUnicodeCheck" value="ℳ𝒲♥𝓊𝓃𝒾𝒸ℴ𝒹ℯ" type="hidden" />').appendTo(form);
				$('<input name="wpSection" value="" type="hidden" />').appendTo(form);
				$('<input name="wpStarttime" value="1" type="hidden" />').appendTo(form);
				$('<input name="wpAutoSummary" value="d41d8cd98f00b204e9800998ecf8427e" type="hidden" />').appendTo(form);
				$('<input name="wpDiff" value="Show changes" type="hidden" />').appendTo(form);
				$('<input name="wpUltimateParam" value="1" type="hidden" />').appendTo(form);
				$('<input name="wpRecreate" value="" type="hidden" />').appendTo(form);

				$('<input type="hidden" />').attr({
					name: "wpTextbox1",
					value: mw.config.get("wgAbuseFilterVariables")["new_wikitext"]
				}
				).appendTo(form);

				var d = new Date();
				var edittime = "" + d.getFullYear() + ("0" + (d.getMonth() + 1)).substr(-2) + ("0" + d.getDate()).substr(-2) + d.getHours() + d.getMinutes() + d.getSeconds();
				$('<input type="hidden" />').attr({
					name: "wpEdittime",
					value: edittime
				}).appendTo(form);
			} else if (type === "move") {
				$('<input type="hidden" />').attr({
					name: "wpNewTitle",
					value: mw.config.get("wgAbuseFilterVariables")["moved_to_prefixedtitle"]
				}).appendTo(form);

				$('<input type="hidden" />').attr({
					name: "wpLeaveRedirect",
					value: "1"
				}).appendTo(form);
			}

			$('<input type="hidden" />').attr({
				name: "wpEditToken",
				value: mw.user.tokens.get('csrfToken')
			}).appendTo(form);

			var summary = "套用";
			if (mw.util.isIPAddress(mw.config.get("wgAbuseFilterVariables")["user_name"])) {
				summary += "[[Special:Contributions/" + mw.config.get("wgAbuseFilterVariables")["user_name"] + "|" + mw.config.get("wgAbuseFilterVariables")["user_name"] + "]]";
			} else {
				summary += "[[User:" + mw.config.get("wgAbuseFilterVariables")["user_name"] + "|" + mw.config.get("wgAbuseFilterVariables")["user_name"] + "]]";
			}

			function timestamp2mwtime(timestamp) {
				var day = "日一二三四五六";
				var d = new Date(timestamp * 1000);
				var res = "";
				res += d.getUTCFullYear() + "年";
				res += (d.getUTCMonth() + 1) + "月";
				res += d.getUTCDate() + "日";
				res += " (" + day[d.getUTCDay()] + ") ";
				res += ("0" + d.getUTCHours()).substr(-2) + ":";
				res += ("0" + d.getUTCMinutes()).substr(-2) + " (UTC)";
				return res;
			}

			summary += "於" + timestamp2mwtime(mw.config.get("wgAbuseFilterVariables")["timestamp"]) + "[[" + mw.config.get('wgPageName') + "|嘗試做出的" + actionname[type] + "]]";
			if (mw.config.get("wgAbuseFilterVariables")["summary"]) {
				summary += "，" + actionname[type] + "摘要為：" + mw.config.get("wgAbuseFilterVariables")["summary"]
			} else {
				summary += "，無" + actionname[type] + "摘要";
			}

			summary += AEFA.summary;

			if (type === "edit") {
				$('<input type="hidden" />').attr({ name: "wpSummary", value: summary }).appendTo(form);
			} else {
				$('<input type="hidden" />').attr({ name: "wpReason", value: summary }).appendTo(form);
			}

			form.submit();
			form.remove();
		});
	}

	if (mw.config.get("wgAbuseFilterVariables")["action"] === "edit") {
		var btn = $('<a href="#">套用編輯</a>').insertAfter($("#mw-content-text>fieldset>p>span>a").last()).before(" | ");
		btn.on("click", function() { applyEdit("edit"); });
	} else if (mw.config.get("wgAbuseFilterVariables")["action"] === "move") {
		var btn = $('<a href="#">套用移動</a>').insertAfter($("#mw-content-text>fieldset>p>span>a").last()).before(" | ");
		btn.on("click", function() { applyEdit("move"); });
	}

})();

// </nowiki>
