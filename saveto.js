javascript:
(function() {

    var page = prompt('page');
    if (page == '' || page == null) return;
    page = page.replace(/_/g, ' ');
    var pages = page.split('|');
    wpTextbox1.value = wpTextbox1.value.replace(/(==.+==) *\n\n?/, '$1\n{{存檔至|' + page + '}}\n');
    wpSummary.value = wpSummary.value + ' 存檔至[[' + pages.join(']]、[[') + ']]';
    wpMinoredit.click();
    if (confirm('Save?')) wpSave.click();

})();
