javascript:
(function(){

var page = prompt("page");
if (page == "" || page == null) return;
pages = page.split("|");
wpTextbox1.value = wpTextbox1.value.replace(/(==.+==)\n\n?/, "$1\n{{saveto|"+page+"}}\n");
wpSummary.value = wpSummary.value+" saveto [["+pages.join("]]、[[")+"]]";
wpMinoredit.click();
if(confirm("Save?")) wpSave.click();

})();
