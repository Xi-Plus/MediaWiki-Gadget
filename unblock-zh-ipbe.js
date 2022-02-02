// <nowiki>
/* globals UnblockZhIpbe:true */
/**
 * 使用方法：
 * 1. 前往[[Special:Userrights/使用者名稱]]
 * 2. 在右上角「更多」選單中選取「處理Unblock-zh的IPBE請求」
 * 3. 按照提示操作
 */
(function() {

    if (typeof (UnblockZhIpbe) == 'undefined') {
        UnblockZhIpbe = {};
    }

    if (typeof (UnblockZhIpbe.enableOn) != 'function') {
        UnblockZhIpbe.enableOn = function() {
            if (mw.config.get('wgCanonicalSpecialPageName') == 'Userrights') {
                return true;
            }
            return false;
        }
    }

    if (typeof (UnblockZhIpbe.summarySuffix) != 'string') {
        UnblockZhIpbe.summarySuffix = ' via [[User:Xiplus/js/unblock-zh-ipbe.js|unblock-zh-ipbe]]';
    }

    if (typeof (UnblockZhIpbe.duration) != 'object') {
        UnblockZhIpbe.duration = ['3 months', '6 months'];
    }
    if (UnblockZhIpbe.duration.indexOf('infinite') === -1) {
        UnblockZhIpbe.duration.push('infinite');
    }

    function AskUnblockZhUrl() {
        var url;
        var msgprefix = '';
        while (true) { /* eslint-disable-line no-constant-condition */
            url = prompt(msgprefix + wgULS('请输入 unblock-zh 邮件网址\n形如', '請輸入 unblock-zh 郵件網址\n形如') + ' https://lists.wikimedia.org/hyperkitty/list/unblock-zh@lists.wikimedia.org/message/AAAAA/');
            if (url === null) {
                return false;
            }
            var m;
            if ((m = url.match(/^\s*(https?:\/\/lists.wikimedia.org\/hyperkitty\/list\/unblock-zh@lists.wikimedia.org\/(?:message|thread)\/(.+)\/?)\s*$/)) !== null) {
                return { 'long': m[1], 'short': m[2] };
            }
            msgprefix = wgULS('格式错误！请重新输入\n', '格式錯誤！請重新輸入\n');
        }
    }

    function AskDuration() {
        var duration;
        var msgprefix = '';
        var msg = wgULS('授权期限？', '授權期限？');
        for (var i = 0; i < UnblockZhIpbe.duration.length; i++) {
            msg += '\n' + (i + 1) + '. ' + UnblockZhIpbe.duration[i];
        }
        while (true) { /* eslint-disable-line no-constant-condition */
            duration = prompt(msgprefix + msg, '3');
            if (duration === null) {
                return false;
            }
            duration = duration.trim() - 1;
            if (UnblockZhIpbe.duration[duration] !== undefined) {
                return UnblockZhIpbe.duration[duration];
            }
            msgprefix = wgULS('输入不在列表内，请重新输入\n', '輸入不在列表內，請重新輸入\n');
        }
    }

    function GrantIpbe(username, duration, url) {
        new mw.Api().postWithToken('userrights', {
            action: 'userrights',
            user: username,
            add: 'ipblock-exempt',
            expiry: duration,
            reason: url + UnblockZhIpbe.summarySuffix,
        }).then(function() {
            mw.notify(wgULS('成功授予“', '成功授予「') + username + wgULS('”IPBE，期限为“', '」IPBE，期限為「') + duration + wgULS('”', '」'));
        }, function(e) {
            mw.notify(wgULS('未知错误：', '未知錯誤：') + e);
        });
    }

    function NotifyUser(username, duration) {
        var message = '{{subst:Ipexemptgranted|temp=1}}';
        if (duration == 'infinite') {
            message = '{{subst:Ipexemptgranted}}';
        }

        var usertalk = 'User talk:' + username;
        new mw.Api().get({
            action: 'query',
            prop: 'info',
            titles: usertalk,
        }).done(function(data) {
            var page = Object.values(data.query.pages)[0];
            if (page.missing !== undefined) {
                new mw.Api().create(
                    usertalk,
                    { summary: wgULS('授予IP封禁豁免权通知', '授予IP封鎖例外權通知') + UnblockZhIpbe.summarySuffix },
                    message
                ).then(function() {
                    mw.notify(wgULS('成功发送通知给“', '成功發送通知給「') + username + wgULS('”', '」'));
                }, function(e) {
                    mw.notify(wgULS('未知错误：', '未知錯誤：') + e);
                });
            } else if (page.contentmodel == 'flow-board') {
                new mw.Api().postWithEditToken({
                    action: 'flow',
                    page: usertalk,
                    submodule: 'new-topic',
                    nttopic: wgULS('授予IP封禁豁免权通知', '授予IP封鎖例外權通知'),
                    ntcontent: message,
                    ntformat: 'wikitext',
                }).then(function() {
                    mw.notify(wgULS('成功发送通知给“', '成功發送通知給「') + username + wgULS('”', '」'));
                }, function(e) {
                    mw.notify(wgULS('未知错误：', '未知錯誤：') + e);
                });
            } else {
                new mw.Api().edit(usertalk, function(revision) {
                    return {
                        text: (revision.content + '\n\n' + message).trim(),
                        summary: wgULS('授予IP封禁豁免权通知', '授予IP封鎖例外權通知') + UnblockZhIpbe.summarySuffix,
                    };
                }).then(function() {
                    mw.notify(wgULS('成功发送通知给“', '成功發送通知給「') + username + wgULS('”', '」'));
                }, function(e) {
                    mw.notify(wgULS('未知错误：', '未知錯誤：') + e);
                });
            }
        });
    }

    function Report(username, url) {
        new mw.Api().edit('Wikipedia:權限申請/申請IP封禁例外權', function(revision) {
            var content = '{{subst:rfp|' + username + '|2=' + wgULS('经由', '經由') + '[' + url + ' unblock-zh]' + wgULS('申请的授权备案', '申請的授權備案') + '。|status=+}}--~~~~';
            var summary = '[[Special:UserRights/' + username + '|' + '授予' + username + wgULS('IP封禁豁免权', 'IP封鎖例外權') + ']]' + wgULS('备案', '備案');
            return {
                text: revision.content + '\n\n' + content,
                summary: summary + UnblockZhIpbe.summarySuffix,
            };
        }).then(function() {
            mw.notify(wgULS('成功为“', '成功為「') + username + wgULS('”备案', '」備案'));
        }, function(e) {
            mw.notify(wgULS('未知错误：', '未知錯誤：') + e);
        });
    }

    function main() {
        var clickLink = mw.util.addPortletLink(
            'p-cactions',
            '#',
            wgULS('处理Unblock-zh的IPBE请求', '處理Unblock-zh的IPBE請求')
        );

        $(clickLink).on('click', function() {
            var user = mw.config.get('wgRelevantUserName');
            if (user === null) {
                user = prompt(wgULS('要处理的用户？', '要處理的用戶？'));
                if (user === null) {
                    mw.notify(wgULS('动作已取消', '動作已取消'));
                    return;
                }
                user = user.trim();
                if (user == '') {
                    mw.notify(wgULS('动作已取消', '動作已取消'));
                    return;
                }
            }

            var action = prompt(wgULS('要处理的动作？\n1. 授权\n2. 发送通知\n3. 在WP:RFIPBE备案\n若要全部执行请输入 123', '要處理的動作？\n1. 授權\n2. 發送通知\n3. 在WP:RFIPBE備案\n若要全部執行請輸入 123'), '123');
            if (action === null) {
                mw.notify(wgULS('动作已取消', '動作已取消'));
                return;
            }
            var act1 = (action.indexOf('1') !== -1)
                , act2 = (action.indexOf('2') !== -1)
                , act3 = (action.indexOf('3') !== -1);

            if (act1 || act3) {
                var url = AskUnblockZhUrl();
                if (url === false) {
                    mw.notify(wgULS('动作已取消', '動作已取消'));
                    return;
                }
            }

            if (act1) {
                var duration = AskDuration();
                if (duration === false) {
                    mw.notify(wgULS('动作已取消', '動作已取消'));
                    return;
                }
            } else if (act2) {
                var duration = confirm(wgULS('是永久权限吗？', '是永久權限嗎？'));
                if (duration) {
                    duration = 'infinite';
                } else {
                    duration = 'not infinite';
                }
            }

            if (action.indexOf('1') !== -1) {
                GrantIpbe(user, duration, url.long);
            }
            if (action.indexOf('2') !== -1) {
                NotifyUser(user, duration);
            }
            if (action.indexOf('3') !== -1) {
                Report(user, url.long);
            }
        });
    }

    if (UnblockZhIpbe.enableOn()) {
        mw.loader.using(['ext.gadget.site-lib', 'mediawiki.api']).then(function() {
            main();
        });
    }

})();
// </nowiki>
