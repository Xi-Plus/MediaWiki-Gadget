// <nowiki>
(function() {

    if (typeof(CloseAffp) == 'undefined')
        CloseAffp = {};

    if (typeof(CloseAffp.summary) == 'undefined') {
        CloseAffp.summary = '關閉報告';
    }

    if (mw.config.get('wgPageName') !== 'Wikipedia:防滥用过滤器/错误报告' || mw.config.get('wgAction') !== 'view') {
        return;
    }

    var getPageContent = new Promise(function(resolve, reject) {
        new mw.Api().get({
            action: 'query',
            prop: 'revisions',
            rvprop: ['content', 'timestamp'],
            titles: 'Wikipedia:防滥用过滤器/错误报告',
            formatversion: '2',
            curtimestamp: true
        }).then(function(data) {
            var page, revision;
            if (!data.query || !data.query.pages) {
                mw.notify('未能抓取頁面內容（unknown）');
                reject('unknown');
            }
            page = data.query.pages[0];
            if (!page || page.invalid) {
                mw.notify('未能抓取頁面內容（invalidtitle）');
                reject('invalidtitle');
            }
            if (page.missing) {
                mw.notify('未能抓取頁面內容（nocreate-missing）');
                reject('nocreate-missing');
            }
            revision = page.revisions[0];
            content = revision.content;
            basetimestamp = revision.timestamp;
            curtimestamp = data.curtimestamp;
            resolve({
                content: content,
                basetimestamp: basetimestamp,
                curtimestamp: curtimestamp
            });
        })
    }
    );

    function showCloseButton() {
        var titles = $('#bodyContent').find('h3');

        var spanTag = function(color, content) {
            var span = document.createElement('span');
            span.style.color = color;
            span.appendChild(document.createTextNode(content));
            return span;
        };
        var delNode = document.createElement('strong');
        var delLink = document.createElement('a');
        delLink.appendChild(spanTag('Black', '['));
        delLink.appendChild(spanTag('Red', wgULS('关闭', '關閉')));
        delLink.appendChild(spanTag('Black', ']'));
        delNode.setAttribute('class', 'CloseAffpBtn');
        delNode.appendChild(delLink);

        titles.each(function(key, current) {
            var node = current.getElementsByClassName('mw-headline')[0];
            var title = $(current).find('.mw-headline')[0].id;
            if (title.match(/^（过滤器日志）/)) {
            	title = '（無標題）';
            } else {
            	title = title.replace(/（过滤器日志）.*/, '');
            }

            var tmpNode = delNode.cloneNode(true);
            $(tmpNode.firstChild).click(function() {
                processClose(key + 1, title);
                return false;
            });
            node.appendChild(tmpNode)
        });
    }

    function processClose(key, title) {
        mw.loader.using(['jquery.ui.dialog'], function() {
            var html = '<div>';
            html += '狀態<br>';
            html += '<select id="status">';
            html += '<option value="cls">關閉</option>';
            html += '<option value="res">已解決</option>';
            html += '<option value="con">確認</option>';
            html += '<option value="fdb">需要反饋</option>';
            html += '<option value="reo">重開</option>';
            html += '<option value="ack">認知</option>';
            html += '<option value="ass">指定</option>';
            html += '<option value="new">新近</option>';
            html += '</select><br>';
            html += '狀態<br>';
            html += '<select id="res">';
            html += '<option value="inv">無效</option>';
            html += '<option value="res">已解決</option>';
            html += '<option value="wnf">未修復</option>';
            html += '<option value="fix">已修復</option>';
            html += '<option value="">無</option>';
            html += '<option value="lat">待後</option>';
            html += '<option value="wfm">無法重現</option>';
            html += '<option value="dup">重複</option>';
            html += '</select><br>';
            html += '留言<br>';
            html += '<input type="text" id="comment" size="40" value="::">';
            html += '</div>';
            $(html).dialog({
                title: '關閉過濾器錯誤報告 - ' + title,
                minWidth: 515,
                minHeight: 150,
                buttons: [{
                    text: '確定',
                    click: function() {
                        processEdit(key, title, $(this).find('#status').val(), $(this).find('#res').val(), $(this).find('#comment').val());
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

    function processEdit(key, title, status, res, comment) {
        new mw.Api().edit('Wikipedia:防滥用过滤器/错误报告', function(revision) {
            content = revision.content;
            splittoken = 'CLOSE_RRD_SPLIT_TOKEN';
            content = content.replace(/^===/gm, splittoken + '===');
            contents = content.split(splittoken);
            contents[key] = contents[key].trim();
            contents[key] = contents[key].replace(/{{bugstatus\|status=([^|\n}]*?)\|res=([^|\n}]*?)}}/, '{{bugstatus|status=' + status + '|res=' + res + '}}');
            if (comment.replace(/[\s:*]/g, '') !== '') {
                contents[key] += '\n' + comment.trim() + '。--~~~~';
            }
            contents[key] += '\n\n';
            content = contents.join("");
            $($('#bodyContent').find('h3')[key - 1]).find('.CloseAffpBtn span').css('color', 'grey');
            return {
                text: content,
                basetimestamp: revision.timestamp,
                summary: CloseAffp.summary,
                minor: true
            };
        }).then(function(e) {
            mw.notify('已關閉 ' + title);
        }, function(e) {
            if (e == 'editconflict') {
                mw.notify('關閉 ' + title + ' 時發生編輯衝突');
            } else {
                mw.notify('關閉 ' + title + ' 時發生未知錯誤：' + e);
            }
        });
    }

    getPageContent.then(function(result) {
        window.content = result.content;
        var lenintext = result.content.split(/^===/gm).length - 1;
        if ($('#bodyContent').find('h3').length !== lenintext) {
            mw.notify('抓取章節錯誤，在HTML找到 ' + $('#bodyContent').find('h3').length + ' 個章節，在原始碼找到 ' + lenintext + ' 個章節');
        } else {
            showCloseButton();
        }
    });

}
)();
// </nowiki>
