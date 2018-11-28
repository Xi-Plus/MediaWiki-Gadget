// <nowiki>
(function() {

    if (typeof(CloseRfpp) == 'undefined')
        CloseRfpp = {};

    if (typeof(CloseRfpp.summary) == 'undefined') {
        CloseRfpp.summary = '關閉請求';
    }

    if (mw.config.get('wgPageName') !== 'Wikipedia:请求保护页面'
        || mw.config.get('wgAction') !== 'view'
        || mw.config.get('wgRevisionId') !== mw.config.get('wgCurRevisionId')) {
        return;
    }

    var getPageContent = new Promise(function(resolve, reject) {
        new mw.Api().get({
            action: 'query',
            prop: 'revisions',
            rvprop: ['content', 'timestamp'],
            titles: 'Wikipedia:请求保护页面',
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
        var titles = $('#bodyContent').find('h2:has(.mw-headline), h3:has(.mw-headline)');

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
        delNode.setAttribute('class', 'CloseRfppBtn');
        delNode.appendChild(delLink);

        titles.each(function(key, current) {
            if (current.nodeName != 'H3') {
                return;
            }
            var node = current.getElementsByClassName('mw-headline')[0];
            var title = $(current).find('.mw-headline')[0].id;

            var tmpNode = delNode.cloneNode(true);
            $(tmpNode.firstChild).click(function() {
                processClose(key, title);
                return false;
            });
            node.appendChild(tmpNode)
        });
    }

    function processClose(key, title) {
        mw.loader.using(['jquery.ui.dialog'], function() {
            var html = '<div>';
            html += '{{RFPP}}<br>';
            html += '<select id="rfpp" onchange="$(this.parentElement).find(\'#comment\')[0].value += this.value; this.value = \'\';">';
            html += '<option value="">選擇</option>';
            html += '<option value="{{RFPP|ch}}">正在檢查以確定是否需要保護</option>';
			html += '<option value="{{RFPP|s|X}}">半保護X，X過後系統會自動解除此頁保護</option>';
			html += '<option value="{{RFPP|p|X}}">全保護X，X過後系統會自動解除此頁保護</option>';
			html += '<option value="{{RFPP|m|X}}">移動保護X，X過後系統會自動解除此頁保護</option>';
			html += '<option value="{{RFPP|t|X}}">白紙保護X ，X過後系統會自動解除此頁保護</option>';
			html += '<option value="{{RFPP|do}}">完成</option>';
			html += '<option value="{{RFPP|no}}">未完成</option>';
			html += '<option value="{{RFPP|d}}">拒絕</option>';
			html += '<option value="{{RFPP|pf}}">拒絕，暫時不需要改變目前的保護等級</option>';
			html += '<option value="{{RFPP|nea}}">拒絕，近期沒有足夠的擾亂性行為使該頁被保護</option>';
			html += '<option value="{{RFPP|co}}">拒絕，此請求保護可能會額外影響一些正在改善此頁的用戶</option>';
			html += '<option value="{{RFPP|aiv}}">拒絕，請恰當地警告用戶，如繼續請將用戶報告至當前的破壞</option>';
			html += '<option value="{{RFPP|np}}">拒絕，不會做出預見性的保護</option>';
			html += '<option value="{{RFPP|nhr}}">拒絕，模板未有足夠的使用量以使其成為高風險模板</option>';
			html += '<option value="{{RFPP|dr}}">拒絕，內容爭議。請使用條目的討論頁或以其他形式解決爭論</option>';
			html += '<option value="{{RFPP|ut}}">拒絕，除非遇到了嚴重或持續的破壞，否則用戶討論頁不會被保護</option>';
			html += '<option value="{{RFPP|bot}}">拒絕，實際情況可能並非如此（僅用於拒絕機器人的過度提報）</option>';
			html += '<option value="{{RFPP|b}}">用戶已被封禁</option>';
			html += '<option value="{{RFPP|tb}}">用戶已被重新封禁，並禁止其編輯自己的討論頁</option>';
			html += '<option value="{{RFPP|u}}">已解除</option>';
			html += '<option value="{{RFPP|nu}}">未解除保護</option>';
			html += '<option value="{{RFPP|cr}}">未解除保護，請在草稿頁創建條目有可靠來源的版本，完成後請重新提交請求或尋求管理員幫助</option>';
			html += '<option value="{{RFPP|er}}">未解除保護，請在編輯請求以請求對受保護頁面進行特定的更改</option>';
			html += '<option value="{{RFPP|au}}">已解除保護</option>';
			html += '<option value="{{RFPP|ap}}">已保護</option>';
			html += '<option value="{{RFPP|ad}}">已完成</option>';
			html += '<option value="{{RFPP|q}}">問題</option>';
			html += '<option value="{{RFPP|n}}">備註：</option>';
			html += '<option value="{{RFPP|w}}">請求者取消</option>';
			html += '<option value="{{RFPP|ew}}">考慮舉報3RR，這可能是一兩個用戶間的編輯戰</option>';
            html += '</select><br>';
            html += '留言<br>';
            html += '<input type="text" id="comment" size="40">';
            html += '</div>';
            $(html).dialog({
                title: '關閉報告 - ' + title,
                minWidth: 590,
                minHeight: 150,
                buttons: [{
                    text: '確定',
                    click: function() {
                        if ($(this).find('#comment').val().trim() !== '') {
                            processEdit(key, title, $(this).find('#comment').val());
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

    function processEdit(key, title, comment) {
        new mw.Api().edit('Wikipedia:请求保护页面', function(revision) {
            content = revision.content;
            splittoken = 'CLOSE_SPLIT_TOKEN';
            content = content.replace(/^==/gm, splittoken + '==');
            contents = content.split(splittoken);
            contents[key] = contents[key].trim();
            if (comment.trim() !== '') {
                contents[key] += '\n* ' + comment + '。--~~~~';
            }
            contents[key] += '\n\n';
            content = contents.join("");
            $($('#bodyContent').find('h2:has(.mw-headline), h3:has(.mw-headline)')[key - 1]).find('.CloseRfppBtn span').css('color', 'grey');
            return {
                text: content,
                basetimestamp: revision.timestamp,
                summary: CloseRfpp.summary,
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
        var lenintext = result.content.split(/^==/gm).length - 2;
        var leninhtml = $('#bodyContent').find('h2:has(.mw-headline), h3:has(.mw-headline)').length -2;
        if (leninhtml !== lenintext) {
            mw.notify('抓取章節錯誤，在HTML找到 ' + leninhtml + ' 個章節，在原始碼找到 ' + lenintext + ' 個章節');
        } else {
            showCloseButton();
        }
    });

}
)();
// </nowiki>
