/**
 * 修改自 https://zh.wikipedia.org/w/index.php?title=MediaWiki:Gadget-MarkRights.js&oldid=50678903
 */

/**
 * 取自 oldid=46135902
 * MediaWiki:Gadget-MarkRights.js
 *
 * 在最近修改、监视列表、条目历史记录等位置以特殊格式显示有特殊权限的用户
 *
 */

$(function () {
    var markUG = function () {
        var $users = $('a.mw-userlink:not(.mw-anonuserlink)');
        var users = {};
        $users.each(function (index, link) {
            users[link.textContent] = true;
        });

        var queue1 = [];
        var queue2 = [];
        var i=0, n=0;
        for (var user in users) {
            queue1.push(user);
            i++;
            if (i === 50) {
                queue2.push(queue1);
                queue1 = [];
                n++;
                i = 0;
            }
        }
        if (queue1.length > 0) {
            queue2.push(queue1);
            n++;
        }

        var sysoplist = [];
        var interfaceadminlist = [];
        var bureaucratlist = [];
        var culist = [];
        var oslist = [];
        var plist = [];
        var rlist = [];
        var alist = [];
        var ipbelist = [];
        var comlist = [];
        var acclist = [];
        var floodlist = [];
        var mmslist = [];
        var botlist = [];

        var done = function () {
            var j;
            // 全站管理型权限
            for (j=0; j<bureaucratlist.length; j++) {
                $('a.mw-userlink[title="User:' + bureaucratlist[j] + '"]').append('<sup class="markrights-bureaucrat"></sup>');
            }
            for (j=0; j<culist.length; j++) {
                $('a.mw-userlink[title="User:' + culist[j] + '"]').append('<sup class="markrights-checkuser"></sup>');
             }
            for (j=0; j<oslist.length; j++) {
                $('a.mw-userlink[title="User:' + oslist[j] + '"]').append('<sup class="markrights-oversight"></sup>');
            }
            for (j=0; j<sysoplist.length; j++) {
                $('a.mw-userlink[title="User:' + sysoplist[j] + '"]').append('<sup class="markrights-sysop"></sup>');
            }
            for (j=0; j<interfaceadminlist.length; j++) {
                $('a.mw-userlink[title="User:' + interfaceadminlist[j] + '"]').append('<sup class="markrights-interface-admin"></sup>');
            }
            // 页面管理型权限
            for (j=0; j<plist.length; j++) {
                $('a.mw-userlink[title="User:' + plist[j] + '"]').append('<sup class="markrights-patroller"></sup>');
            }
            for (j=0; j<rlist.length; j++) {
                $('a.mw-userlink[title="User:' + rlist[j] + '"]').append('<sup class="markrights-rollbacker"></sup>');
            }
            for (j=0; j<alist.length; j++) {
                $('a.mw-userlink[title="User:' + alist[j] + '"]').append('<sup class="markrights-autoreviewer"></sup>');
            }
            // 大量操作型权限
            for (j=0; j<acclist.length; j++) {
                $('a.mw-userlink[title="User:' + acclist[j] + '"]').append('<sup class="markrights-accountcreator"></sup>');
            }
            for (j=0; j<mmslist.length; j++) {
                $('a.mw-userlink[title="User:' + mmslist[j] + '"]').append('<sup class="markrights-massmessage-sender"></sup>');
            }
            // 确认权限
            for (j=0; j<comlist.length; j++) {
                $('a.mw-userlink[title="User:' + comlist[j] + '"]').append('<sup class="markrights-confirmed"></sup>');
            }
            // 机器权限
            for (j=0; j<botlist.length; j++) {
                $('a.mw-userlink[title="User:' + botlist[j] + '"]').append('<sup class="markrights-bot"></sup>');
            }
            for (j=0; j<floodlist.length; j++) {
                $('a.mw-userlink[title="User:' + floodlist[j] + '"]').append('<sup class="markrights-flood"></sup>');
            }
            // IPBE
            for (j=0; j<ipbelist.length; j++) {
                $('a.mw-userlink[title="User:' + ipbelist[j] + '"]').append('<sup class="markrights-ipblock-exempt"></sup>');
            }
        };

        var process = function (data) {
            var users;
            if (data.query && data.query.users) {
                users = data.query.users;
            } else {
                users = [];
            }
            for (var i=0; i<users.length; i++) {
                var user = users[i];
                if (user.groups) {
                    if (user.groups.indexOf('bureaucrat') > -1) {
                        bureaucratlist.push(user.name);
                    }
                    // Due to Office Actions
                    if (user.groups.indexOf('checkuser') > -1) {
                        culist.push(user.name);
                    }
                    if (user.groups.indexOf('oversight') > -1) {
                        oslist.push(user.name);
                    }
                    if (user.groups.indexOf('sysop') > -1) {
                        sysoplist.push(user.name);
                    }
                    if (user.groups.indexOf('interface-admin') > -1) {
                        interfaceadminlist.push(user.name);
                    }
                    if (user.groups.indexOf('patroller') > -1) {
                        plist.push(user.name);
                    }
                    if (user.groups.indexOf('rollbacker') > -1) {
                        rlist.push(user.name);
                    }
                    if (user.groups.indexOf('autoreviewer') > -1) {
                        alist.push(user.name);
                    }
                    if (user.groups.indexOf('accountcreator') > -1) {
                        acclist.push(user.name);
                    }
                    if (user.groups.indexOf('massmessage-sender') > -1) {
                        mmslist.push(user.name);
                    }
                    if (user.groups.indexOf('confirmed') > -1) {
                        comlist.push(user.name);
                    }
                    if (user.groups.indexOf('bot') > -1) {
                        botlist.push(user.name);
                    }
                    if (user.groups.indexOf('flood') > -1) {
                        floodlist.push(user.name);
                    }
                    if (user.groups.indexOf('ipblock-exempt') > -1) {
                        ipbelist.push(user.name);
                    }
                }
            }
            n--;
            if (n <= 0) {
                done();
            }
        };
        var api = new mw.Api();
        for (var j=0; j<queue2.length; j++) {
            api.get({
                format: 'json',
                action: 'query',
                list: 'users',
                usprop: 'groups',
                ususers: queue2[j].join('|')
            }).done(process);
        }
    };
    markUG();
});