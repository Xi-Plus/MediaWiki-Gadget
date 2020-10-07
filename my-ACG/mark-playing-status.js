(function() {

	function markCore(value) {
		var api = new mw.Api();
		var api = new mw.Api();
		api.get({
			'action': 'wbgetclaims',
			'format': 'json',
			'entity': mw.config.get('wgTitle'),
			'property': 'P31'
		}).then(function(data) {
			var guid = data['claims']['P31'][0]['id'];

			api.postWithEditToken({
				'action': 'wbsetclaimvalue',
				'format': 'json',
				'claim': guid,
				'value': JSON.stringify({
					'entity-type': 'item',
					'numeric-id': value
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

	function markEnd() {
		if (!confirm('標記為完結？')) {
			mw.notify('已取消');
			return;
		}
		markCore(58);
	}

	function markPlaying() {
		if (!confirm('標記為放送中？')) {
			mw.notify('已取消');
			return;
		}
		markCore(56);
	}

	if ($('#P31 .wikibase-statementview-mainsnak .wikibase-snakview-value a').attr('title') === 'Item:Q56') {
		$('<button style="margin-left: 10px;">完結</button>')
			.on('click', markEnd)
			.appendTo($('div#P31 div.wikibase-statementview-mainsnak div.wikibase-snakview-body'));

	}
	if ($('#P31 .wikibase-statementview-mainsnak .wikibase-snakview-value a').attr('title') === 'Item:Q57') {
		$('<button style="margin-left: 10px;">放送中</button>')
			.on('click', markPlaying)
			.appendTo($('div#P31 div.wikibase-statementview-mainsnak div.wikibase-snakview-body'));

	}

}
)();
