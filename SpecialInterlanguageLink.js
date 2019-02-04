/*
 * 使用說明請見 https://zh.wikipedia.org/wiki/User:Xiplus/js/SpecialInterlanguageLink
 */
/* globals SpecialInterlanguageLink:true */

(function() {

	if (typeof (SpecialInterlanguageLink) == 'undefined')
		SpecialInterlanguageLink = {};

	if (typeof (SpecialInterlanguageLink.lang) == 'undefined') {
		SpecialInterlanguageLink.lang = { "en": "English" };
	}

	if (typeof (SpecialInterlanguageLink.namespace) == 'undefined') {
		SpecialInterlanguageLink.namespace = [-1, 2, 3, 8];
	}

	function createLinks(pagename) {
		for (var lang in SpecialInterlanguageLink.lang) {
			var name = SpecialInterlanguageLink.lang[lang];
			var interlink = lang + ":" + pagename;
			var link = mw.config.get('wgServer') + mw.config.get('wgArticlePath').replace("$1", interlink);
			var content = `<li class="interlanguage-link interwiki-${lang}">
			<a href="${link}" title="${interlink}" lang="${lang}" hreflang="${lang}" class="interlanguage-link-target">${name}</a>
		</li>`;

			$('#p-lang>div>ul').append(content);
		}
	}

	if ($.inArray(mw.config.get('wgNamespaceNumber'), SpecialInterlanguageLink.namespace) !== -1) {
		if (mw.config.get('wgNamespaceNumber') === -1) {
			if (mw.config.get('wgCanonicalSpecialPageName') !== false) {
				var names = mw.config.get('wgPageName').split("/");
				names[0] = "Special:" + mw.config.get('wgCanonicalSpecialPageName');
				createLinks(names.join("/"));
			}
		} else {
			createLinks(mw.config.get('wgCanonicalNamespace') + ":" + mw.config.get('wgTitle'));
		}
	}

})();
