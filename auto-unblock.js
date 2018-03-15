javascript:
(function(){

if (mw.config.get('wgCanonicalSpecialPageName') === 'Block') {
	document.forms[0].onsubmit = function(event) {
		var expiry = $("[name=wpExpiry]").val();
		if (expiry !== 'other') return;
		expiry = $("[name=wpExpiry-other]").val();
		if (expiry.match(/^\s*\d+\s*$/) !== null) return;
		if (new Date(expiry) > new Date()) return;

		var reason = $("[name=wpReason]").val();
		if (reason !== 'other') return;
		reason = $("[name=wpReason-other]").val();

		var user = $("[name=wpTarget]").val();

		if (confirm("您的封鎖期限比現在時間還早，您是否要進行解封，選擇確認以自動進行解封，選擇取消以原先的表單進行。")) {
			new mw.Api().postWithToken( 'csrf', {
				action: 'unblock',
				user: user,
				reason: reason
			} ).done( function() {
				document.location = mw.config.get('wgScript')+"?title=Special:Log&page="+encodeURIComponent("User:"+user)+"&type=block";
			} ).fail( function() {
				document.forms[0].submit();
			} );
			event.preventDefault();
		}
	};
}

})();
