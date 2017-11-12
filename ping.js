javascript:
(function(){

var myPrefix = wpTextbox1.value.substring(0, wpTextbox1.selectionStart);
var mySuffix = wpTextbox1.value.substring(wpTextbox1.selectionEnd);
var list = myPrefix.match(/\[\[(User|User talk|User_talk|用戶|用户|用戶討論|用户讨论):[^|\]#\/]+[^\]]*\]\]/gi);
if (list === null) {
	wpTextbox1.value = myPrefix + "{{ping|}}" + mySuffix;
	return;
}
var username = "";
for (var i = list.length - 1; i >= 0; i--) {
	var temp = list[i].match(/\[\[(?:User|User talk|User_talk|用戶|用户|用戶討論|用户讨论):([^|\]#\/]+)[^\]]*\]\]/i);
	if (temp !== null && temp[1] != "A2093064") {
		username = temp[1];
		break;
	}
}
var indent = myPrefix.match(/^([\:*]+)/mg);
if (indent === null) {
	indent = ":";
} else {
	indent = indent[indent.length-1][0]+indent[indent.length-1];
}
wpTextbox1.value = myPrefix + indent+ "{{ping|"+username+"}}" + mySuffix;

})();
