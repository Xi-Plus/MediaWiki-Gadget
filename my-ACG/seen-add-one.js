(function() {

    function seenAddOne() {
        var api = new mw.Api();
        api.get({
            'action': 'wbgetclaims',
            'format': 'json',
            'entity': mw.config.get('wgTitle'),
            'property': 'P28'
        }).then(function(data) {
            var guid = data['claims']['P28'][0]['id'];
            var oldvalue = parseInt(data['claims']['P28'][0]['mainsnak']['datavalue']['value']['amount']);
            var newvalue = oldvalue + 1;

            if (!confirm('已看集數從 ' + oldvalue + ' 改為 ' + newvalue)) {
                mw.notify('已取消');
                return;
            }

            api.postWithEditToken({
                'action': 'wbsetclaimvalue',
                'format': 'json',
                'claim': guid,
                'value': JSON.stringify({
                    'amount': '+' + newvalue,
                    'unit': '1'
                }),
                'snaktype': 'value',
            }).then(function() {
                mw.notify('成功更新');
                location.reload();
            }, function(e) {
                mw.notify('未知錯誤：' + e);
            });

        }, function(e) {
            mw.notify('未知錯誤：' + e);
        });

    }

    if ($('#P28 .wikibase-statementview-mainsnak .wikibase-snakview-value').text() != $('#P27 .wikibase-statementview-mainsnak .wikibase-snakview-value').text()) {
        $('<button style="margin-left: 10px;">+1</button>')
            .on('click', seenAddOne)
            .appendTo($('div#P28 div.wikibase-statementview-mainsnak div.wikibase-snakview-body'));

    }

}
)();
