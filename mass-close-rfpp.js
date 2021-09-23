javascript: (function() {
    /* eslint semi: ["error", "always"] */

    if (mw.config.get('wgPageName') !== 'Wikipedia:请求保护页面'
        || mw.config.get('wgAction') !== 'edit') {
        return;
    }

    var levelMap = {
        autoconfirmed: 'semi',
        extendedconfirmed: 'ecp',
        templateeditor: 'temp',
        sysop: 'full',
        move: 'move',
        create: 'salt',
    };

    var oldtext = $('#wpTextbox1').val();
    const splittoken = 'CLOSE_SPLIT_TOKEN';
    oldtext = oldtext.replace(/^(==)/gm, splittoken + '$1');
    var sections = oldtext.split(splittoken);

    var remainingTask = 0;

    var runSection = function(sectionId, pagename) {
        new mw.Api().get({
            'action': 'query',
            'format': 'json',
            'list': 'logevents',
            'leprop': 'type|user|timestamp|details',
            'letype': 'protect',
            'letitle': pagename,
            'lelimit': '1',
        }).then(function(res) {
            if (res.query.logevents.length === 0) {
                updateText();
                return;
            }
            var logevent = res.query.logevents[0];
            if (!['protect', 'modify'].includes(logevent.action)) {
                updateText();
                return;
            }
            var protectTime = new Morebits.date(logevent.timestamp);
            var expiry = logevent.params.details[0].expiry;
            var protectType = logevent.params.details[0].type;
            var level = logevent.params.details[0].level;
            var admin = logevent.user;

            var rfppType;
            if (['move', 'create'].includes(protectType)) {
                rfppType = levelMap[protectType];
            } else {
                rfppType = levelMap[level];
            }

            var duration;
            if (expiry === 'infinite') {
                duration = 'indef';
            } else {
                expiry = new Morebits.date(expiry);
                var days = Math.round((expiry.getTime() - protectTime.getTime()) / 86400 / 1000);
                var months = Math.round(days / 30);
                var years = Math.round(days / 365);
                if (years > 0) {
                    duration = years + '年';
                    months = Math.round((days - years * 365) / 30);
                    if (months > 0) {
                        duration += months + '個月';
                    }
                } else if (months > 0) {
                    duration = months + '個月';
                    if (days - months * 30 >= 4) {
                        duration += (days - months * 30) + '天';
                    }
                } else {
                    duration = days + '天';
                }
            }

            var allTextTime = [...sections[sectionId].matchAll(/\d{4}年\d{1,2}月\d{1,2}日 \(.\) \d{2}:\d{2} \(UTC\)/g)];
            var reqTime = new Morebits.date();
            for (let j = 0; j < allTextTime.length; j++) {
                var temptime = new Morebits.date(allTextTime[j][0]);
                if (temptime.isBefore(reqTime)) {
                    reqTime = temptime;
                }
            }

            if (protectTime.isAfter(reqTime)) {
                var comment = ':{{RFPP|' + rfppType + '|' + duration;
                if (admin !== mw.config.get('wgUserName')) {
                    comment += '|by=' + admin;
                }
                comment += '}}。--~~~~';
                sections[sectionId] = sections[sectionId].trimRight();
                sections[sectionId] += '\n' + comment + '\n\n';
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

    for (let i = 1; i < sections.length; i++) {
        const content = sections[i];

        if (!/{{RFPP\|/.test(content)) {
            var m = content.match(/===\s*\[\[:?([^\]]+?)]]\s*===/i);
            if (m) {
                var pagename = m[1];
                remainingTask++;
                runSection(i, pagename);
            }
        }
    }

}
)();
