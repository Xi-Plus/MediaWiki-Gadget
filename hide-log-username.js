(function() {

    if (mw.config.get('wgRelevantUserName') === null) {
        return;
    }

    mw.loader.using(['mediawiki.util', 'mediawiki.api', 'jquery.ui.dialog'], function() {

        if (mw.util.isIPAddress(mw.config.get('wgRelevantUserName'))) {
            return;
        }

        function main() {
            var html = '<div>';
            html += '常見刪除原因<br>';
            html += '<select id="block" onchange="$(this.parentElement).find(\'#comment\')[0].value += this.value; this.value = \'\';">';
            html += '<option value="">選擇</option>';
            html += '<option value="[[Project:RD1|RD1]]：明显侵犯版权">RD1：明显侵犯版权</option>';
            html += '<option value="[[Project:RD2|RD2]]：针对个人、团体或组织的严重侮辱、贬低或攻击性材料">RD2：针对个人、团体或组织的严重侮辱、贬低或攻击性材料</option>';
            html += '<option value="[[Project:RD3|RD3]]：纯粹的扰乱性内容">RD3：纯粹的扰乱性内容</option>';
            html += '<option value="[[Project:RD4|RD4]]：非公开的私人信息">RD4：非公开的私人信息</option>';
            html += '<option value="[[Project:RD5|RD5]]：删除守则下的有效删除，使用RevisionDelete执行">RD5：删除守则下的有效删除，使用RevisionDelete执行</option>';
            html += '<option value="[[Project:RD6|RD6]]：版本删除校正">RD6：版本删除校正</option>';
            html += '</select><br>';
            html += '刪除摘要<br>';
            html += '<input type="text" id="comment" size="75">';
            html += '</div>';
            var dialog = $(html).dialog({ // eslint-disable-line no-unused-vars
                title: '批量版本刪除',
                minWidth: 515,
                minHeight: 150,
                buttons: [{
                    text: '確定',
                    click: function() {
                        if ($(this).find('#comment').val().trim() !== '') {
                            process($(this).find('#comment').val());
                        } else {
                            mw.notify('動作已取消');
                        }
                        $(this).dialog('close');
                    }
                }, {
                    text: '取消',
                    click: function() {
                        $(this).dialog('close');
                    }
                }]
            });
        }

        function process(comment) {
            var badname = mw.config.get('wgRelevantUserName');
            var api = new mw.Api();

            api.get({
                "action": "query",
                "format": "json",
                "list": "logevents",
                "leprop": "ids",
                "leuser": badname,
                "lelimit": "max",
            }).then(function(data) {
                var logids = $.map(data.query.logevents, function(e) {
                    return e.logid;
                }).join('|');

                api.postWithEditToken({
                    action: 'revisiondelete',
                    type: 'logging',
                    ids: logids,
                    hide: 'user',
                    reason: comment
                }).then(function() {
                    mw.notify('成功刪除日誌中的 ' + data.query.logevents.length + ' 個操作者');
                }, function(e) {
                    mw.notify('未知錯誤：' + e);
                });
            });

            api.get({
                "action": "query",
                "format": "json",
                "list": "logevents",
                "leprop": "ids",
                "letitle": "User:" + badname,
                "lelimit": "max"
            }).then(function(data) {
                var logids = $.map(data.query.logevents, function(e) {
                    return e.logid;
                }).join('|');

                api.postWithEditToken({
                    action: 'revisiondelete',
                    type: 'logging',
                    ids: logids,
                    hide: 'content',
                    reason: comment
                }).then(function() {
                    mw.notify('成功刪除日誌中的 ' + data.query.logevents.length + ' 個目標');
                }, function(e) {
                    mw.notify('未知錯誤：' + e);
                });
            });
        }

        $(mw.util.addPortletLink('p-cactions', '#', '日誌隱藏用戶名')).click(main);

    });

}
)();
