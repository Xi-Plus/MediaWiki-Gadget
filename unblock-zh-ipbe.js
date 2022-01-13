// <nowiki>
/* globals UnblockZhIpbe:true */
/**
 * 使用方法：
 * 1. 前往[[Special:Userrights/使用者名稱]]
 * 2. 在右上角「更多」選單中選取「處理Unblock-zh的IPBE請求」
 * 3. 按照提示操作
 */
(function() {

    if (typeof (UnblockZhIpbe) == 'undefined')
        UnblockZhIpbe = {};

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
            url = prompt(msgprefix + '請輸入 unblock-zh 郵件網址\n形如 https://lists.wikimedia.org/hyperkitty/list/unblock-zh@lists.wikimedia.org/message/AAAAA/');
            if (url === null) {
                return false;
            }
            var m;
            if ((m = url.match(/^\s*(https?:\/\/lists.wikimedia.org\/hyperkitty\/list\/unblock-zh@lists.wikimedia.org\/(?:message|thread)\/(.+)\/?)\s*$/)) !== null) {
                return { 'long': m[1], 'short': m[2] };
            }
            msgprefix = '格式錯誤！請重新輸入\n';
        }
    }

    function AskDuration() {
        var duration;
        var msgprefix = '';
        var msg = '授權期限？';
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
            msgprefix = '輸入不在列表內，請重新輸入';
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
            mw.notify('成功授予 ' + username + ' IPBE ' + duration);
        }, function(e) {
            mw.notify('未知錯誤：' + e);
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
                    { summary: '授予IP封禁例外權通知' + UnblockZhIpbe.summarySuffix },
                    message
                ).then(function() {
                    mw.notify('成功發送通知給 ' + username);
                }, function(e) {
                    mw.notify('未知錯誤：' + e);
                });
            } else if (page.contentmodel == 'flow-board') {
                new mw.Api().postWithEditToken({
                    action: 'flow',
                    page: usertalk,
                    submodule: 'new-topic',
                    nttopic: '授予IP封禁例外權通知',
                    ntcontent: message,
                    ntformat: 'wikitext',
                }).then(function() {
                    mw.notify('成功發送通知給 ' + username);
                }, function(e) {
                    mw.notify('未知錯誤：' + e);
                });
            } else {
                new mw.Api().edit(usertalk, function(revision) {
                    return {
                        text: (revision.content + '\n\n' + message).trim(),
                        summary: '授予IP封禁例外權通知' + UnblockZhIpbe.summarySuffix,
                    };
                }).then(function() {
                    mw.notify('成功發送通知給 ' + username);
                }, function(e) {
                    mw.notify('未知錯誤：' + e);
                });
            }
        });
    }

    function Report(username, url) {
        new mw.Api().edit('Wikipedia:權限申請/申請IP封禁例外權', function(revision) {
            return {
                text: revision.content + '\n\n{{subst:rfp|' + username + '|2=[' + url + ' unblock-zh]|status=+}}--~~~~',
                summary: '授予 ' + username + ' IP封禁例外權備案' + UnblockZhIpbe.summarySuffix,
            };
        }).then(function() {
            mw.notify('成功為 ' + username + ' 備案');
        }, function(e) {
            mw.notify('未知錯誤：' + e);
        });
    }

    if (UnblockZhIpbe.enableOn()) {
        var clickLink = mw.util.addPortletLink(
            'p-cactions',
            '#',
            '處理Unblock-zh的IPBE請求'
        );

        $(clickLink).on('click', function() {
            var user = mw.config.get('wgRelevantUserName');
            if (user === null) {
                user = prompt('要處理的用戶？');
                if (user === null) {
                    mw.notify('動作已取消');
                    return;
                }
                user = user.trim();
                if (user == '') {
                    mw.notify('動作已取消');
                    return;
                }
            }

            var action = prompt('要處理的動作？\n1. 授權\n2. 發送通知\n3. 在WP:RFIPBE備案\n若要全部執行請輸入 123', '123');
            if (action === null) {
                mw.notify('動作已取消');
                return;
            }
            var act1 = (action.indexOf('1') !== -1)
                , act2 = (action.indexOf('2') !== -1)
                , act3 = (action.indexOf('3') !== -1);

            if (act1 || act3) {
                var url = AskUnblockZhUrl();
                if (url === false) {
                    mw.notify('動作已取消');
                    return;
                }
            }

            if (act1) {
                var duration = AskDuration();
                if (duration === false) {
                    mw.notify('動作已取消');
                    return;
                }
            } else if (act2) {
                var duration = confirm('是永久權限嗎？');
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

})();
// </nowiki>
