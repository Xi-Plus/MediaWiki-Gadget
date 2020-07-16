// <nowiki>
/* globals CloseVip:true */
(function() {

    if (typeof CloseVip == 'undefined')
        CloseVip = {};

    if (typeof CloseVip.summary == 'undefined') {
        CloseVip.summary = '關閉報告 via [[User:Xiplus/js/close-vip.js|close-vip]]';
    }

    if (mw.config.get('wgPageName') !== 'Wikipedia:当前的破坏'
        || mw.config.get('wgAction') !== 'view'
        || mw.config.get('wgRevisionId') !== mw.config.get('wgCurRevisionId')) {
        return;
    }

    var getPageContent = new Promise(function(resolve, reject) {
        new mw.Api().get({
            action: 'query',
            prop: 'revisions',
            rvprop: ['content', 'timestamp'],
            titles: 'Wikipedia:当前的破坏',
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
        delNode.setAttribute('class', 'CloseVipBtn');
        delNode.appendChild(delLink);

        titles.each(function(key, current) {
            if (key == 0) {
                return;
            }
            var node = current.getElementsByClassName('mw-headline')[0];
            var headlineChildren = $(current).find('.mw-headline').children();
            if (headlineChildren.length === 0) {
                return;
            }
            var title = headlineChildren[0].id;
            title = title.replace(/{{vandal\|(.*?)}}/, '$1');
            var sectionid = mw.util.getParamValue('section', $(current).find('.mw-editsection a')[0].href);

            var tmpNode = delNode.cloneNode(true);
            $(tmpNode.firstChild).click(function() {
                processClose(key, sectionid, title);
                return false;
            });
            node.appendChild(tmpNode)
        });
    }

    function processClose(key, sectionid, title) {
        mw.loader.using(['jquery.ui'], function() {
            var html = '<div>';
            html += '{{VIP}}<br>';
            html += '<select id="vip" onchange="$(this.parentElement).find(\'#comment\')[0].value += this.value; this.value = \'\';">';
            html += '<option value="">選擇</option>';
            html += '<option value="{{VIP|chk}}">檢查中</option>';
            html += '<option value="{{VIP|m}}">將關注此用戶</option>';
            html += '<option value="{{VIP|w}}">用戶已獲警告</option>';
            html += '<option value="{{VIP|i}}">近期編輯未足以用於判斷是否封禁用戶</option>';
            html += '<option value="{{VIP|f}}">最後警告後無編輯。如用戶繼續進行破壞，請回報</option>';
            html += '<option value="{{VIP|nesw}}">警告後無編輯。如用戶在獲充分警告後繼續進行破壞，請回報</option>';
            html += '<option value="{{VIP|4im}}">最近警告不當，4im層級僅適用於嚴重破壞</option>';
            html += '<option value="{{VIP|ns}}">未獲充分警告。如用戶已獲充分警告並繼續進行破壞，請回報</option>';
            html += '<option value="{{VIP|dc}}">拒絕</option>';
            html += '<option value="{{VIP|nv}}">編輯並非破壞。請確保其最近編輯構成破壞後再重新提報</option>';
            html += '<option value="{{VIP|b}}">拒絕，實際情況可能並非如此（機器人）</option>';
            html += '<option value="{{VIP|fp}}">錯誤提報，編輯並非破壞（機器人）</option>';
            html += '<option value="{{VIP|c}}">編輯爭議。請考慮解決爭議，或提報至EWIP</option>';
            html += '<option value="{{VIP|np}}">封禁乃用以預防破壞而非懲罰</option>';
            html += '<option value="{{VIP|p}}">已保護頁面</option>';
            html += '<option value="{{VIP|d}}">已刪除頁面</option>';
            html += '<option value="{{VIP|n}}">注意</option>';
            html += '<option value="{{VIP|s}}">疑似共享IP，由多人共用</option>';
            html += '<option value="{{VIP|in}}">注意：IP位址不適宜實施永久封禁，請參閱封禁方針</option>';
            html += '<option value="{{VIP|ew}}">此頁僅處理破壞，請轉此處提報編輯戰</option>';
            html += '<option value="{{VIP|a}}">此頁僅處理破壞，請轉此處提報爭議</option>';
            html += '<option value="{{VIP|u}}">此頁僅處理破壞，請轉此處提報不當用戶名</option>';
            html += '<option value="{{VIP|r}}">此頁僅處理破壞，請轉此處提報保護頁面</option>';
            html += '<option value="{{VIP|sp}}">此頁僅處理破壞，請轉此處提報用戶核查</option>';
            html += '<option value="{{VIP|e|X}}">陳舊報告，用戶已停止編輯/用戶近期已沒有編輯X</option>';
            html += '<option value="{{VIP|sn|X}}">報告即時但現已陳舊，用戶最後破壞距今已有X。如用戶再次進行破壞，請回報</option>';
            html += '<option value="{{VIP|ow|Y}}">陳舊警告，最近警告於Y以前發出</option>';
            html += '<option value="{{VIP|q}}">問題</option>';
            html += '</select><br>';
            html += '{{Block}}<br>';
            html += '<select id="block" onchange="$(this.parentElement).find(\'#comment\')[0].value += this.value; this.value = \'\';">';
            html += '<option value="">選擇</option>';
            html += '<option value="{{Blocked|1天}}">1天</option>';
            html += '<option value="{{Blocked|1週}}">1週</option>';
            html += '<option value="{{Blocked|1個月}}">1個月</option>';
            html += '<option value="{{Blocked|1年}}">1年</option>';
            html += '<option value="{{Blocked|indef}}">不限期封禁</option>';
            html += '<option value="{{Blocked|ad=Example|1年}}">已由管理員Example執行封禁1年</option>';
            html += '</select><br>';
            html += '留言<br>';
            html += '<input type="text" id="comment" size="40">';
            html += '</div>';
            $(html).dialog({
                title: '關閉報告 - ' + title,
                minWidth: 515,
                minHeight: 150,
                buttons: [{
                    text: '確定',
                    click: function() {
                        if ($(this).find('#comment').val().trim() !== '') {
                            processEdit(key, sectionid, title, $(this).find('#comment').val());
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
        });
    }

    function processEdit(key, sectionid, title, comment) {
        new mw.Api().edit('Wikipedia:当前的破坏', function(revision) {
            var content = revision.content;
            const splittoken = 'CLOSE_SPLIT_TOKEN';
            content = content.replace(/^(===[^=])/gm, splittoken + '$1');
            var contents = content.split(splittoken);
            var newtext = contents[key];
            newtext = newtext.trim();
            comment = comment.trim();
            if (comment !== '') {
                if (comment.search(/[.?!;。？！；]$/) === -1) {
                    comment += '。';
                }
                if (newtext.match(/^\*\s*处理：[ \t]*(<!-- 非管理員僅可標記已執行的封禁，針對提報的意見請放在下一行 -->)?[ \t]*$/m)) {
                    newtext = newtext.replace(/^(\*\s*处理：)[ \t]*(<!-- 非管理員僅可標記已執行的封禁，針對提報的意見請放在下一行 -->)?[ \t]*$/m, '$1' + comment + '--~~~~');

                } else {
                    newtext += '\n* 处理：' + comment + '--~~~~';
                }
            }
            $($('#bodyContent').find('h3')[key]).find('.CloseVipBtn span').css('color', 'grey');
            return {
                text: newtext,
                section: sectionid,
                basetimestamp: revision.timestamp,
                summary: CloseVip.summary,
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
        var lenintext = result.content.split(/^===[^=]/gm).length - 1;
        var leninhtml = $('#bodyContent').find('h3').length - 1;
        if (leninhtml !== lenintext) {
            mw.notify('抓取章節錯誤，在HTML找到 ' + leninhtml + ' 個章節，在原始碼找到 ' + lenintext + ' 個章節');
        } else {
            showCloseButton();
        }
    });

}
)();
// </nowiki>
