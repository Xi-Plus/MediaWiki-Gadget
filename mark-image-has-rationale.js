(function() {

    mw.loader.using(['jquery', 'oojs-ui', 'mediawiki.util', 'mediawiki.api'], function() {

        if ($.inArray('合理使用理據待檢查影像', mw.config.get('wgCategories')) === -1) {
            return;
        }

        function mark() {

            var templates = [
                'Euro coin copyright tag',
                'Non-free album cover', 'Albumcover',
                'Non-free architectural work',
                'Non-free biog-pic', 'Dead', 'NFBP',
                'Non-free Canadian Crown Copyright',
                'Non-free Crown copyright', 'Ir-Crown-UK',
                'Non-free currency-EU coin national',
                'Non-free historic image', 'HistoricImageRationale', 'Historicphoto',
                'Non-free logo', 'Tv-logo', 'Gamelogo', 'Logo',
                'Non-free Old-50',
                'Non-free Old-70',
                'Non-free Philippines government',
                'Non-free poster', 'Movie poster', 'Posters', 'Politicalposter', 'Movieposter', 'Poster', 'Non-free movie poster',
                'Non-free product cover',
                'Non-free school logo',
                'Non-free Scout logo', 'Non-Free Scout Logo', 'Non-Free Scout logo',
                'Non-free seal',
                'Non-free sheet music',
                'Non-free software cover',
                'Non-free title-card', 'Titlecard',
                'Non-free video game cover', 'Non-free game cover', 'Gamecover',
                'Non-free video game screenshot', 'Non-free game screenshot', 'Game-screenshot',
                'Non-free video screenshot',
                'Non-free web screenshot', 'Web-screenshot',
                'Software-screenshot', 'Mac-software-screenshot', 'Windows-software-screenshot', 'Non-free software screenshot',
                'Symbol', 'Coatofarms', 'Non-free flag', 'Seal', 'Non-free symbol',
                '非自由奥林匹克媒体', 'Non-free Olympics media',
                '音訊樣本', 'Music sample', 'Non-free audio sample',
            ];

            var temregex = $(templates).map(function() {
                var temp = this;
                temp = temp.replace(/[ _]/g, '[ _]');
                if (temp[0].toUpperCase() != temp[0].toLowerCase()) {
                    temp = '[' + temp[0].toUpperCase() + temp[0].toLowerCase() + ']' + temp.substr(1)
                }
                return temp;
            }).get().join('|');

            new mw.Api().edit(mw.config.get('wgPageName'), function(revision) {
                var content = revision.content;

                var regex = new RegExp('{{\\s*(' + temregex + ')\\s*(?:\\|.+?)?}}', 'g');
                var m;
                var cnt = 0;
                while ((m = regex.exec(content)) !== null) {
                    mw.notify('在頁面上找到 ' + m[1])
                    cnt += 1;
                }
                if (cnt == 0) {
                    mw.notify('在頁面上找不到任何合理使用模板');
                    return $.Deferred().reject('fail');
                }

                regex = new RegExp('({{\\s*(?:' + temregex + ')\\s*(?:\\|.+?)?)}}', 'g');
                content = content.replace(regex, '$1|image has rationale=yes}}');

                regex = new RegExp('({{\\s*(?:' + temregex + ')\\s*[^{}]*?)\\|image[ _]has[ _]rationale=[^|{}]*([^{}]*?\\|image has rationale=yes}})', 'g');
                content = content.replace(regex, '$1$2');

                if (content == revision.content) {
                    mw.notify('標記時發生錯誤');
                    return $.Deferred().reject('fail');
                }

                return {
                    text: content,
                    basetimestamp: revision.timestamp,
                    summary: '標記 image has rationale',
                    minor: true
                };
            }).then(function() {
                mw.notify('已標記 image has rationale');
                window.location = mw.util.wikiScript("index") + "?" + $.param({
                    'title': mw.config.get('wgPageName'),
                    'diff': 'cur',
                    'oldid': 'prev'
                });
            }, function(e) {
                if (e == 'editconflict') {
                    mw.notify('標記時發生編輯衝突');
                } else if (e == 'fail') {
                    //
                } else if (e == 'cancel') {
                    mw.notify('已取消');
                } else {
                    mw.notify('標記時發生未知錯誤：' + e);
                }
            });
        }

        $("code:contains('image has rationale')").parent().append('<center><a class="mark_image_has_rationale" href="#"><span class="mw-ui-button mw-ui-progressive">標記 image has rationale</span></a></center>');

        $('.mark_image_has_rationale').click(function() {
            mark();
            return false;
        });

    });

})();
