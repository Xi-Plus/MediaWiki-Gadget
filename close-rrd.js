// <nowiki>
(function() {

    if (typeof(CloseRrd) == 'undefined')
        CloseRrd = {};

    if (typeof(CloseRrd.summary) == 'undefined') {
        CloseRrd.summary = '關閉請求';
    }

    if (typeof(CloseRrd.reason) == 'undefined') {
        CloseRrd.reason = ['刪除', '部份刪除', '未刪除', '未刪除，未達RD2準則', '未刪除，未達RD3準則'];
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
        mw.loader.using(['jquery.ui.dialog'], function() {
            var html = '<div>';
            html += '處理結果<br>';
            html += '<select id="status">';
            html += '<option value="+">+</option>';
            html += '<option value="-">-</option>';
            html += '<option value="OH">OH</option>';
            html += '</select>';
            html += '<br>';
            html += '理由<br>';
            html += '<select id="reason">';
            for (var i = 0; i < CloseRrd.reason.length; i++) {
                html += '<option value="' + CloseRrd.reason[i] + '">' + CloseRrd.reason[i] + '</option>'
            }
            html += '</select>';
            html += '<br>';
            html += '附加理由<br>';
            html += '<input type="text" id="reason2" size="40">';
            html += '</div>';
            $(html).dialog({
                title: '關閉修訂版本刪除請求 - ' + title,
                minWidth: 515,
                minHeight: 150,
                buttons: [{
                    text: '確定',
                    click: function() {
                        processEdit(key, title, $(this).find('#status').val(), $(this).find('#reason').val(), $(this).find('#reason2').val());
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

    function processEdit(key, title, status, reason, reason2) {
        new mw.Api().edit('Wikipedia:修订版本删除请求', function(revision) {
            content = revision.content;
            splittoken = 'CLOSE_RRD_SPLIT_TOKEN';
            content = content.replace(/{{Revdel/g, splittoken + '{{Revdel');
            contents = content.split(splittoken);
            contents[key] = contents[key].trim();
            contents[key] = contents[key].replace(/^(\|\s*status\s*=[ \t]*)(.*)$/m, '$1' + status);
            contents[key] += '\n:' + reason;
            if (reason2.trim() !== '') {
                contents[key] += '：' + reason2;
            }
            contents[key] += '。--~~~~\n\n';
            content = contents.join("");
            $($('div.mw-parser-output>div.plainlinks')[key - 1]).find('.closeRrdBtn span').css('color', 'grey');
            return {
                text: content,
                basetimestamp: revision.timestamp,
                summary: CloseRrd.summary,
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
