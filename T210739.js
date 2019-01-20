(function() {

mw.loader.using(['oojs-ui', 'mediawiki.api', 'mediawiki.notify'], function() {

if (document.getElementsByName("wpDeleteAndMove").length < 1) {
	return;
}

var button = new OO.ui.ButtonWidget( {
	flags: [ 'primary', 'destructive' ],
    label: '使用API刪除目標頁',
    icon: 'trash',
    title: '使用API刪除目標頁'
} ).on('click', function () {
	var target = mw.config.get('wgFormattedNamespaces')[document.getElementsByName('wpNewTitleNs')[0].value];
	if (target != '') {
		target += ':';
	}
	target += document.getElementsByName('wpNewTitleMain')[0].value;

    new mw.Api().postWithEditToken({
        action: 'delete',
        title: target,
        reason: '[[WP:CSD#G8|G8]]: 删除以便移动'
    }).then(function(e) {
        mw.notify('成功刪除 ' +  target);
    }, function(e) {
        mw.notify('刪除時發生錯誤：' + e);
    });
});
$(document.getElementsByName('wpMove')[0].parentElement.parentElement).append( button.$element );

});

})();
