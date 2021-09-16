/**
 * If you want to use this gadget as a user script, you need to load these modules: 'oojs-ui', 'mediawiki.api'.
 * It's just like https://en.wikipedia.org/wiki/User:JJMC89/T210739.js
 *
 * And localize the following message.
 */
(function() {

    var msg_button_label = '使用API刪除目標頁';
    var msg_button_title = '使用API刪除目標頁';
    var msg_delete_reason = '[[WP:CSD#G8|G8]]: 删除以便移动';
    var msg_delete_success = '成功刪除 ';
    var msg_delete_fail = '刪除時發生錯誤：';

    if (document.getElementsByName("wpDeleteAndMove").length < 1) {
        return;
    }

    var button = new OO.ui.ButtonWidget({
        flags: ['primary', 'destructive'],
        label: msg_button_label,
        icon: 'trash',
        title: msg_button_title,
    }).on('click', function() {
        var target = mw.config.get('wgFormattedNamespaces')[document.getElementsByName('wpNewTitleNs')[0].value];
        if (target !== '') {
            target += ':';
        }
        target += document.getElementsByName('wpNewTitleMain')[0].value;

        new mw.Api().postWithEditToken({
            action: 'delete',
            title: target,
            reason: msg_delete_reason,
        }).then(function() {
            mw.notify(msg_delete_success + target);
        }, function(e) {
            mw.notify(msg_delete_fail + e);
        });
    });
    $(document.getElementsByName('wpMove')[0].parentElement.parentElement).append(button.$element);

})();
