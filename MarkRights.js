/**
 * 修改自
 * https://zh.wikipedia.org/w/index.php?title=MediaWiki:Gadget-MarkRights.js&oldid=50678903
 * https://zh.wikipedia.org/w/index.php?title=Draft:MediaWiki:Gadget-MarkRights.js/50678903&oldid=52825311
 */

/**
 * 取自 oldid=46135902
 * MediaWiki:Gadget-MarkRights.js
 *
 * 在最近修改、监视列表、条目历史记录等位置以特殊格式显示有特殊权限的用户
 *
 */

$(function() {
    var groups = {
        // 全站管理型权限
        bureaucrat: { list: [], class: "markrights-bureaucrat" },
        checkuser: { list: [], class: "markrights-checkuser" },
        oversight: { list: [], class: "markrights-oversight" },
        sysop: { list: [], class: "markrights-sysop" },
        'interface-admin': { list: [], class: "markrights-interface-admin" },
        // 页面管理型权限
        patroller: { list: [], class: "markrights-patroller" },
        rollbacker: { list: [], class: "markrights-rollbacker" },
        autoreviewer: { list: [], class: "markrights-autoreviewer" },
        // 大量操作型权限
        accountcreator: { list: [], class: "markrights-accountcreator" },
        'massmessage-sender': { list: [], class: "markrights-massmessage-sender" },
        // 确认权限
        confirmed: { list: [], class: "markrights-confirmed" },
        // 机器权限
        bot: { list: [], class: "markrights-bot" },
        flood: { list: [], class: "markrights-flood" },
        // IPBE
        'ipblock-exempt': { list: [], class: "markrights-ipblock-exempt" },
    };
    var markUG = function() {
        var $users = $('a.mw-userlink:not(.mw-anonuserlink)');
        var users = {};
        $users.each(function(index, link) {
            users[link.textContent] = true;
        });

        var queue1 = [];
        var queue2 = [];
        var i = 0, n = 0;
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

        var done = function() {
            var group, j;
            for (group in groups) {
                if (Object.hasOwnProperty.call(groups, group)) {
                    for (j = 0; j < groups[group].list.length; j++) {
                        $('a.mw-userlink[title="User:' + groups[group].list[j] + '"]').append('<sup class="' + groups[group].class + '"></sup>');
                    }
                }
            }
        };

        var process = function(data) {
            var users, group;
            if (data.query && data.query.users) {
                users = data.query.users;
            } else {
                users = [];
            }
            for (var i = 0; i < users.length; i++) {
                var user = users[i];
                if (user.groups) {
                    for (group in groups) {
                        if (Object.hasOwnProperty.call(groups, group) && user.groups.indexOf(group) > -1) {
                            groups[group].list.push(user.name);
                        }
                    }
                }
            }
            n--;
            if (n <= 0) {
                done();
            }
        };
        var api = new mw.Api();
        for (var j = 0; j < queue2.length; j++) {
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