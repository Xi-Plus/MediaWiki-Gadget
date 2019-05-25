javascript: (function() {

    var text = '';
    $('table.mw-protectedpages tbody tr').each(function(i, e) {
        text += $(e).find('.TablePager_col_log_timestamp').text() + ',';
        text += $(e).find('.TablePager_col_pr_page>a').text() + ',';
        text += $(e).find('.mw-protectedpages-length').text().replace(/,/g, '') + ',';
        text += $(e).find('.TablePager_col_pr_expiry').text() + ',';
        text += $(e).find('.TablePager_col_log_user').text().replace('（對話 | 貢獻 | 封鎖）', '') + ',';
        text += $(e).find('.TablePager_col_pr_params').text() + ',';
        text += $(e).find('.TablePager_col_log_comment').text();
        text += '<br>';
    });

    var win = window.open('');
    win.document.body.innerHTML = text;

}
)();
