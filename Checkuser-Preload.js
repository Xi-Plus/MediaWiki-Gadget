javascript:
(function(){
var user = "";
while (user === "") {
	user = prompt("User");
}
wpTextbox1.innerHTML = "{{sockpuppetproven|"+user+"|evidence=[[Wikipedia:用戶查核請求|Checkuser]]}}";
wpSummary.value = "標記用戶頁，[[User:"+user+"]]的傀儡，根據[[WP:RFCU]]";
document.all["mw-editpage-watch"].click();
if (confirm("Save?")) wpSave.click();
})();
