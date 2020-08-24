// <nowiki>
/* globals CloseRrd:true */
(function() {

    if (typeof CloseRrd == 'undefined')
        CloseRrd = {};

    if (typeof CloseRrd.summary == 'undefined') {
        CloseRrd.summary = '關閉請求 via [[User:Xiplus/js/close-rrd.js|close-rrd]]';
    }

    if (typeof CloseRrd.presetcomment == 'undefined') {
        CloseRrd.presetcomment = [
            '刪除。',
            '部份刪除。',
            '未刪除。',
            '未刪除，未達RD2準則。',
            '未刪除，未達RD3準則。',
            '未刪除，頁面已被傳統刪除。'
        ];
    }

    if (mw.config.get('wgPageName') !== 'Wikipedia:修订版本删除请求'
        || mw.config.get('wgAction') !== 'view'
        || mw.config.get('wgRevisionId') !== mw.config.get('wgCurRevisionId')) {
        return;
    }

    var getPageContent = new Promise(function(resolve, reject) {
        new mw.Api().get({
            action: 'query',
            prop: 'revisions',
            rvprop: ['content', 'timestamp'],
            titles: 'Wikipedia:修订版本删除请求',
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
            var content = revision.content;
            var basetimestamp = revision.timestamp;
            var curtimestamp = data.curtimestamp;
            resolve({
                content: content,
                basetimestamp: basetimestamp,
                curtimestamp: curtimestamp
            });
        })
    }
    );

    function showCloseButton() {
        var titles = $('div.mw-parser-output>div.plainlinks');

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
        delNode.setAttribute('class', 'closeRrdBtn');
        delNode.appendChild(delLink);

        titles.each(function(key, current) {
            var node = current.children[0].children[0];
            var title = current.id;

            var tmpNode = delNode.cloneNode(true);
            $(tmpNode.firstChild).click(function() {
                processClose(key + 1, title);
                return false;
            });
            node.insertBefore(tmpNode, node.lastChild)

        });
    }

    function processClose(key, title) {
        mw.loader.using(['jquery.ui'], function() {
            var html = '<div>';
            html += '狀態<br>';
            html += '<select id="status">';
            html += '<option value="+">+</option>';
            html += '<option value="-">-</option>';
            html += '<option value="OH">OH</option>';
            html += '<option value="新申請">新申請</option>';
            html += '</select>';
            html += '<br>';
            html += '留言<br>';
            html += '<select id="presetcomment" onchange="$(this.parentElement).find(\'#comment\')[0].value += this.value; this.value = \'\';">';
            html += '<option value="">選擇</option>';
            for (var i = 0; i < CloseRrd.presetcomment.length; i++) {
                html += '<option value="' + CloseRrd.presetcomment[i] + '">' + CloseRrd.presetcomment[i] + '</option>'
            }
            html += '</select><br>';
            html += '<input type="text" id="comment" size="70" value=":">';
            html += '</div>';
            $(html).dialog({
                title: '關閉修訂版本刪除請求 - ' + title,
                minWidth: 515,
                minHeight: 150,
                buttons: [{
                    text: '確定',
                    click: function() {
                        processEdit(key, title, $(this).find('#status').val(), $(this).find('#comment').val());
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

    function processEdit(key, title, status, comment) {
        new mw.Api().edit('Wikipedia:修订版本删除请求', function(revision) {
            var content = revision.content;
            const splittoken = 'CLOSE_RRD_SPLIT_TOKEN';
            content = content.replace(/{{Revdel/g, splittoken + '{{Revdel');
            var contents = content.split(splittoken);
            contents[key] = contents[key].trim();
            contents[key] = contents[key].replace(/^(\|\s*status\s*=[ \t]*)(.*)$/m, '$1' + status);
            if (comment.replace(/[\s:*]/g, '') !== '') {
                comment = comment.trim();
                if (comment.search(/[.?!;。？！；]$/) === -1) {
                    comment += '。';
                }
                contents[key] += '\n' + comment + '--~~~~';
            }
            contents[key] += '\n\n';
            content = contents.join("");
            $($('div.mw-parser-output>div.plainlinks')[key - 1]).find('.closeRrdBtn span').css('color', 'grey');
            return {
                text: content,
                basetimestamp: revision.timestamp,
                summary: CloseRrd.summary,
                minor: true
            };
        }).then(function() {
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
        var lenintext = result.content.split("{{Revdel").length - 1;
        if ($('div.mw-parser-output>div.plainlinks').length !== lenintext) {
            mw.notify('抓取章節錯誤，在HTML找到 ' + $('div.mw-parser-output>div.plainlinks').length + ' 個章節，在原始碼找到 ' + lenintext + ' 個章節');
        } else {
            showCloseButton();
        }
    });

}
)();
// </nowiki>
