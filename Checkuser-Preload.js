javascript:
(function(){
var user = "";
while (user === "") {
	user = prompt("User");
}
wpTextbox1.innerHTML = wpTextbox1.innerHTML.replace("&lt;!-- 这里填写傀儡的操纵者 --&gt;", user);
wpSummary.value = "標記用戶頁，[[User:"+user+"]]的傀儡，根據[[WP:RFCU]]";
document.all["mw-editpage-watch"].click();
if (confirm("Save?")) wpSave.click();
})();
