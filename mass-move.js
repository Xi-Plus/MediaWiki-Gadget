var PAGES = [
	['User:Xiplus/Twinkle/modules/friendlyshared.js', 'Mediawiki:Gadget-friendlyshared.js'],
	['User:Xiplus/Twinkle/modules/friendlytag.js', 'Mediawiki:Gadget-friendlytag.js'],
	['User:Xiplus/Twinkle/modules/friendlytalkback.js', 'Mediawiki:Gadget-friendlytalkback.js'],
	['User:Xiplus/Twinkle/modules/twinklearv.js', 'Mediawiki:Gadget-twinklearv.js'],
	['User:Xiplus/Twinkle/modules/twinklebatchdelete.js', 'Mediawiki:Gadget-twinklebatchdelete.js'],
	['User:Xiplus/Twinkle/modules/twinklebatchundelete.js', 'Mediawiki:Gadget-twinklebatchundelete.js'],
	['User:Xiplus/Twinkle/modules/twinkleblock.js', 'Mediawiki:Gadget-twinkleblock.js'],
	['User:Xiplus/Twinkle/modules/twinkleclose.js', 'Mediawiki:Gadget-twinkleclose.js'],
	['User:Xiplus/Twinkle/modules/twinkleconfig.js', 'Mediawiki:Gadget-twinkleconfig.js'],
	['User:Xiplus/Twinkle/modules/twinklecopyvio.js', 'Mediawiki:Gadget-twinklecopyvio.js'],
	['User:Xiplus/Twinkle/modules/twinkledelimages.js', 'Mediawiki:Gadget-twinkledelimages.js'],
	['User:Xiplus/Twinkle/modules/twinklediff.js', 'Mediawiki:Gadget-twinklediff.js'],
	['User:Xiplus/Twinkle/modules/twinklefluff.js', 'Mediawiki:Gadget-twinklefluff.js'],
	['User:Xiplus/Twinkle/modules/twinkleimage.js', 'Mediawiki:Gadget-twinkleimage.js'],
	['User:Xiplus/Twinkle/modules/twinkleprotect.js', 'Mediawiki:Gadget-twinkleprotect.js'],
	['User:Xiplus/Twinkle/modules/twinklespeedy.js', 'Mediawiki:Gadget-twinklespeedy.js'],
	['User:Xiplus/Twinkle/modules/twinkleunlink.js', 'Mediawiki:Gadget-twinkleunlink.js'],
	['User:Xiplus/Twinkle/modules/twinklewarn.js', 'Mediawiki:Gadget-twinklewarn.js'],
	['User:Xiplus/Twinkle/modules/twinklexfd.js', 'Mediawiki:Gadget-twinklexfd.js'],
	['User:Xiplus/Twinkle/morebits.css', 'MediaWiki:Gadget-morebits.css'],
	['User:Xiplus/Twinkle/morebits.js', 'MediaWiki:Gadget-morebits.js'],
	['User:Xiplus/Twinkle/twinkle.js', 'MediaWiki:Gadget-Twinkle.js'],
];
var REASON = '轉為全站小工具';

PAGES.forEach(page => {
	console.log(page);
	var api = new mw.Api();
	api.postWithEditToken({
		action: 'move',
		from: page[0],
		to: page[1],
		reason: REASON,
		noredirect: '',
	});
});
