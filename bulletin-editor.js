/* eslint-disable no-console */
/* global Morebits */
(function() {
	// $(mw.util.addPortletLink('p-cactions', '#', '一条龙服务')).click(function(e) {
	var api = new mw.Api();
	api.get({
		"action": "query",
		"format": "json",
		"prop": "revisions",
		"titles": "Template:Bulletin",
		"utf8": 1,
		"rvprop": "content",
		"rvslots": "main"
	}).done(function(res) {
		var text = Object.values(res.query.pages)[0].revisions[0].slots.main['*'];
		var re = /{{\s*Bulletin\/item\s*\|/gi;
		var m = re.exec(text);
		var $wrapper = $('<div>');

		var moveToArchive = function(event) {
			console.log(event);
			window.temp = $(event.target).parent();
			$('#be-archiveul').append($(event.target).parent());
		}

		var $table = $('<table>').addClass('wikitable').appendTo($wrapper);
		$(`<tr>
			<th style="width: 30px;">type</th>
			<th style="width: 100%;">items</th>
		</tr>`).appendTo($table);
		while (m) {
			var $tr = $('<tr>').appendTo($table);
			console.log(m);
			var tem = Morebits.wikitext.parseTemplate(text, m.index);

			// td 1
			var $type = $('<td>').addClass('be-typecol').appendTo($tr);
			$('<input>').addClass('be-typeinput').val(tem.parameters[1]).appendTo($type);

			// td 2
			var $itmes = $('<td>').addClass('be-itemcol').appendTo($tr);

			var $type = $('<span>').text('Prefix: ').appendTo($itmes);
			$('<input>').addClass('be-iteminput').val(tem.parameters.prefix).appendTo($itmes);

			$('<br>').appendTo($itmes);
			$('<span>').text('Items: ').appendTo($itmes);

			var $ul = $('<ul>').addClass('be-items').appendTo($itmes);
			for (let i = 2; ; i++) {
				if (tem.parameters.hasOwnProperty(i)) {
					var $li = $('<li>').appendTo($ul);
					$('<img>').attr({
						'src': 'https://upload.wikimedia.org/wikipedia/commons/c/ca/OOjs_UI_icon_move.svg',
						'title': '調整順序或移動到其他項目',
					}).appendTo($li);
					$('<input>').addClass('be-typeinput').val(tem.parameters[1]).appendTo($li);
					$('<input>').addClass('be-iteminput').val(tem.parameters[i])
						.attr('placeholder', '空的項目將在保存時自動被忽略')
						.appendTo($li);
					$('<img>').addClass('be-archivebtn').attr({
						'src': 'https://upload.wikimedia.org/wikipedia/commons/7/72/OOjs_UI_icon_tray.svg',
						'title': '存檔',
					}).appendTo($li).on('click', moveToArchive);
				} else {
					break;
				}
			}

			$('<span>').text('Suffix: ').appendTo($itmes);
			$('<input>').addClass('be-iteminput').val(tem.parameters.suffix).appendTo($itmes);

			console.log(tem);
			m = re.exec(text);
		}

		var $archivezone = $('<div>').attr('id', 'be-archivezone').appendTo($wrapper);
		$('<span>').text('存檔區').appendTo($archivezone);
		var $ul = $('<ul>').attr('id', 'be-archiveul').addClass('be-items').appendTo($archivezone);

		$('#content').html($wrapper);
		$('<style>').html(`
			.be-items {
				list-style-type: none;
				background: #ffffbb;
				min-height: 30px;
			}
			.be-typeinput {
				width: 30px;
			}
			.be-itemcol .be-typeinput {
				display: none;
			}
			.be-iteminput {
				width: 90%;
			}
			#be-archivezone .be-archivebtn {
				display: none;
			}
		`).insertBefore($wrapper);
		// $('ul.be-items li').css('display', 'inline');


		$(function() {
			var oldList, newList, item;
			$('.be-items').sortable({
				start: function(event, ui) {
					// console.log('start', ui);
					item = ui.item;
					oldList = ui.item.parent().parent();
					newList = ui.item.parent().parent();
				},
				stop: function(_event, ui) {
					// console.log('stop', ui);
					// console.log("Moved ", item.text(), " from ", oldList, " to ", newList);
					if ($('#be-archivezone').has(ui.item).length) {
						ui.item.find('.be-typeinput').val(oldList.parent().find('.be-typecol .be-typeinput').val());
					}
				},
				change: function(event, ui) {
					// console.log('change', ui);
					// if (ui.sender) newList = ui.placeholder.parent().parent();
				},
				connectWith: ".be-items"
			}).disableSelection();
		});
	}).fail(function(e) {
		mw.notify('載入內容時發生錯誤：' + e, { type: 'error' });
	});
})();
