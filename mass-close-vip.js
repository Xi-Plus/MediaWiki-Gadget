javascript: (function() {
    /* eslint semi: ["error", "always"]*/

    if (mw.config.get('wgPageName') !== 'Wikipedia:当前的破坏'
        || mw.config.get('wgAction') !== 'edit') {
        return;
    }

    var oldtext = $('#wpTextbox1').val();
    const splittoken = 'CLOSE_SPLIT_TOKEN';
    oldtext = oldtext.replace(/^(===[^=])/gm, splittoken + '$1');
    var sections = oldtext.split(splittoken);

    var remainingTask = 0;

    var runSection = function(sectionId, username) {
        new mw.Api().get({
            'action': 'query',
            'format': 'json',
            'list': 'logevents',
            'leprop': 'type|user|timestamp|details',
            'letype': 'block',
            'letitle': 'User:' + username,
            'lelimit': '1',
        }).then(function(res) {
            if (res.query.logevents.length === 0) {
                updateText();
                return;
            }
            var logevent = res.query.logevents[0];
            if (!['block', 'reblock'].includes(logevent.action)) {
                updateText();
                return;
            }
            var duration = logevent.params.duration;
            var blocktime = new Morebits.date(logevent.timestamp);
            var admin = logevent.user;

            var alltexttime = [...sections[sectionId].matchAll(/\d{4}年\d{1,2}月\d{1,2}日 \(.\) \d{2}:\d{2} \(UTC\)/g)];
            var reqtime = new Morebits.date();
            for (let j = 0; j < alltexttime.length; j++) {
                var temptime = new Morebits.date(alltexttime[j][0]);
                if (temptime.isBefore(reqtime)) {
                    reqtime = temptime;
                }
            }

            if (Morebits.string.isInfinity(duration)) {
                duration = 'indef';
            } else {
                duration = Morebits.string.formatTime(duration);
            }

            if (blocktime.isAfter(reqtime)) {
                var comment = '{{Blocked|' + duration;
                if (admin !== mw.config.get('wgUserName')) {
                    comment += '|ad=' + admin;
                }
                comment += '}}。--~~~~';
                sections[sectionId] = sections[sectionId].replace(/(\* 处理：)(?:<!-- 非管理員僅可標記已執行的封禁，針對提報的意見請放在下一行 -->)?/, '$1' + comment);
            }

            updateText();
        });
    };

    var updateText = function() {
        remainingTask--;
        if (remainingTask > 0) {
            return;
        }
        $('#wpTextbox1').val(sections.join(''));
        $('#wpSummary').val('標記已處理提報');
        $('#wpDiff').click();
    };

    console.log(sections);

    for (let i = 1; i < sections.length; i++) {
        const content = sections[i];

        if (/\* 处理：(<!-- 非管理員僅可標記已執行的封禁，針對提報的意見請放在下一行 -->)?(\n|$)/.test(content)) {
            var m = content.match(/===\s*{{vandal\|(?:1=)?([^|]+?)(?:\||}})/i);
            if (m) {
                var username = m[1];
                remainingTask++;
                runSection(i, username);
            }
        }
    }

}
)();
