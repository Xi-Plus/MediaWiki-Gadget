javascript: (function() {
    wpTextbox1.value = wpTextbox1.value.replace(/-{zh-hans:.+?;zh-hant:(.+?);}-/g, '$1');
    wpTextbox1.value = wpTextbox1.value.replace(/-{zh-hant:(.+?);zh-hans:.+?;}-/g, '$1');
    wpSummary.value = wpSummary.value + ' 請將轉換語法放在[[Module:CGroup/IT]]';
    wpDiff.click();
}
)();
