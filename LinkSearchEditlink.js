javascript:
(function(){

$('.mw-spcontent a[href^="/wiki"]').each(function(_, e){
	$(document.createTextNode(")")).insertAfter(e);
	$('<a href="'+e.href+'?action=edit">編輯</a>').insertAfter(e);
	$(document.createTextNode(" (")).insertAfter(e);
});

})();
