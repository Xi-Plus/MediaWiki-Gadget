// <nowiki>
(function() {

    if (typeof(CloseMove) == 'undefined')
        CloseMove = {};

    if (typeof(CloseMove.summary) == 'undefined') {
        CloseMove.summary = ['已完成移動', '未完成移動，未提出理由', '未完成移動，根據討論頁意見', '未完成移動，未有共識'];
    }

    if ($('.ambox-move').length === 0) {
        return;
    }

    function showCloseButton() {
    	var button = document.createElement('a');
    	button.innerText = '移除模板';
    	button.setAttribute('style', 'font-size: small');
    	$(button).click(function() {
            processClose();
            return false;
        });
		$('.ambox-move').find("td.mbox-text").children('span').children('small').after(button);
    }

    function processClose(key, title) {
        mw.loader.using(['jquery.ui.dialog'], function() {
            var html = '<div>';
            html += '編輯摘要<br>';
            html += '<select id="summary">';
            for (var i = 0; i < CloseMove.summary.length; i++) {
                html += '<option value="' + CloseMove.summary[i] + '">' + CloseMove.summary[i] + '</option>'
            }
            html += '</select>';
            html += '<br>';
            html += '附加理由<br>';
            html += '<input type="text" id="summary2" size="40">';
            html += '</div>';
            $(html).dialog({
                title: '移除移動請求模板',
                minWidth: 515,
                minHeight: 150,
                buttons: [{
                    text: '確定',
                    click: function() {
                        processEdit($(this).find('#summary').val(), $(this).find('#summary2').val());
                        $(this).dialog('close');
                    }
                }, {
                    text: '取消',
                    click: function() {
                        $(this).dialog('close');
                    }
                }]
            });
        });
    }

    function processEdit(reason, reason2) {
        new mw.Api().edit(mw.config.get('wgPageName'), function(revision) {
            content = revision.content;
            content = content.replace(/\{\{\s*Requested move\s*(\|(?:\{\{[^{}]*\}\}|[^{}])*)?\}\}\s*/i, '');
            if (reason2.trim() !== '') {
                reason += '：' + reason2;
            }
            return {
                text: content,
                basetimestamp: revision.timestamp,
                summary: reason,
                minor: false
            };
        }).then(function(e) {
            mw.notify('已移除移動請求模板');
        }, function(e) {
            if (e == 'editconflict') {
                mw.notify('移除移動請求模板時發生編輯衝突');
            } else {
                mw.notify('移除移動請求模板時發生未知錯誤：' + e);
            }
        });
    }

    showCloseButton();

}
)();
// </nowiki>
