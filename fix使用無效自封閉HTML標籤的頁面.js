javascript:
(function() {
    wpTextbox1.value = wpTextbox1.value.replace(/<br *\/>/g, "<br>").replace(/<([^>]+)\/>/g, "</$1>").replace(/<\/ref( *name[^>]+)>/g, "<ref$1/>").replace(/< *([^>]+?) *>/g, "<$1>");
    wpSummary.value = "半自動編輯，修復[[:Category:使用无效自封闭HTML标签的页面]]";
    wpMinoredit.click();
    wpDiff.click();
})();
