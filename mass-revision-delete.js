(function() {

    if (mw.config.get('wgCanonicalSpecialPageName') !== "Contributions") {
        return;
    }

    mw.loader.using(['mediawiki.util', 'mediawiki.api', 'jquery.ui.dialog']).then(function() {

        function main() {
            var html = '<div>';
            html += '設定顯示限制<br>';
            html += '<table><tbody>';
            html += '<tr><th>（不作變更）</th><th>顯示</th><th>隱藏</th><th></th></tr>';
            html += '<tr><td><input name="HidePrimary" type="radio" checked="checked"></td><td><input name="HidePrimary" class="mrd-show" type="radio" value="content"></td><td><input name="HidePrimary" class="mrd-hide" type="radio" value="content"></td><td>修訂文字</td></tr>';
            html += '<tr><td><input name="HideComment" type="radio" checked="checked"></td><td><input name="HideComment" class="mrd-show" type="radio" value="comment"></td><td><input name="HideComment" class="mrd-hide" type="radio" value="comment"></td><td>編輯摘要</td></tr>';
            html += '<tr><td><input name="HideUser" type="radio" checked="checked"></td><td><input name="HideUser" class="mrd-show" type="radio" value="user"></td><td><input name="HideUser" class="mrd-hide" type="radio" value="user"></td><td>編輯者的使用者名稱/IP 位址</td></tr>';
            html += '</tbody></table>';
            html += '常見刪除原因<br>';
            html += '<select id="block" onchange="$(this.parentElement).find(\'#comment\')[0].value += this.value; this.value = \'\';">';
            html += '<option value="">選擇</option>';
            html += '<option value="[[Project:RD1|RD1]]：明显侵犯版权">RD1：明显侵犯版权</option>';
            html += '<option value="[[Project:RD2|RD2]]：针对个人、团体或组织的严重侮辱、贬低或攻击性材料">RD2：针对个人、团体或组织的严重侮辱、贬低或攻击性材料</option>';
            html += '<option value="[[Project:RD3|RD3]]：纯粹的扰乱性内容">RD3：纯粹的扰乱性内容</option>';
            html += '<option value="[[Project:RD4|RD4]]：非公开的私人信息">RD4：非公开的私人信息</option>';
            html += '<option value="[[Project:RD5|RD5]]：删除守则下的有效删除，使用RevisionDelete执行">RD5：删除守则下的有效删除，使用RevisionDelete执行</option>';
            html += '<option value="[[Project:RD6|RD6]]：版本删除校正">RD6：版本删除校正</option>';
            html += '<option value="[[Project:OS|OS1]]：移除未公开私人资料">OS1：移除未公开私人资料</option>';
            html += '<option value="[[Project:OS|OS2]]：移除疑诽谤内容：维基媒体基金会要求">OS2：移除疑诽谤内容：维基媒体基金会要求</option>';
            html += '<option value="[[Project:OS|OS2]]：移除疑诽谤内容：事实清楚而且没有保留需要">OS2：移除疑诽谤内容：事实清楚而且没有保留需要</option>';
            html += '<option value="[[Project:OS|OS3]]：移除侵犯版权内容：维基媒体基金会要求">OS3：移除侵犯版权内容：维基媒体基金会要求</option>';
            html += '<option value="[[Project:OS|OS4]]：攻击性用户名">OS4：攻击性用户名</option>';
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
                            process($(this).find('#comment').val(), $.map($(".mrd-hide:checked"), function(e, i) { // eslint-disable-line no-unused-vars
                                return e.value
                            }).join("|"), $.map($(".mrd-show:checked"), function(e, i) { // eslint-disable-line no-unused-vars
                                return e.value
                            }).join("|"));
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

        function process(comment, hide, show) {
            var ids = {};
            $(".mass-revision-delete-checkbox:checked").each(function(i, e) {
                var target = $(e).attr("data-target");
                var id = $(e).attr("data-id");
                if (ids[target] === undefined) {
                    ids[target] = [];
                }
                ids[target].push(id);
            });

            for (var target in ids) {
                processDelete(ids[target].join("|"), hide, show, comment, target, ids[target].length);
            }
        }

        function processDelete(ids, hide, show, comment, target, count) {
            new mw.Api().postWithEditToken({
                action: 'revisiondelete',
                type: 'revision',
                ids: ids,
                hide: hide,
                show: show,
                reason: comment
            }).then(function() {
                mw.notify('成功刪除 ' + target + ' 的 ' + count + ' 個版本');
            }, function(e) {
                mw.notify('未知錯誤：' + e);
            });
        }

        $(".mw-revdelundel-link").each(function(i, e) {
            var url = $(e).find("a").attr("href");

            var type = mw.util.getParamValue("type", url);
            if (type != 'revision') return;

            var target = mw.util.getParamValue("target", url);
            var id = mw.util.getParamValue("ids", url);
            var $filter = $('<input />', {
                'type': 'checkbox',
                'class': 'mass-revision-delete-checkbox',
                'data-target': target,
                'data-id': id,
                'name': 'ids[' + id + ']'
            });
            $(e).after($filter);
        });

        mw.loader.getScript('https://meta.wikimedia.org/w/index.php?title=User:Xiplus/js/checkboxShiftClick.js&action=raw&ctype=text/javascript').then(function() {
            $('.mass-revision-delete-checkbox').checkboxShiftClick();
        });

        var $filter = $('<button />', {
            'type': 'button',
            'title': '批量版本刪除',
            'text': '批量版本刪除'
        });
        $filter.on('click', main);
        $filter.appendTo($('.mw-contributions-list').prev());

    });

}
)();
