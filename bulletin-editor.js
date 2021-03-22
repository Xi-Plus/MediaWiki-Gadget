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

		var $table = $('<table>').addClass('wikitable').appendTo($wrapper);
		$(`<tr>
			<th style="width: 30px;">type</th>
			<th style="width: 100%;">items</th>
		</tr>`).appendTo($table);
		while(m) {
			var $tr = $('<tr>').appendTo($table);
			console.log(m);
			var tem = Morebits.wikitext.parseTemplate(text, m.index);

			// td 1
			var $type = $('<td>').appendTo($tr);
			$('<input>').addClass('bp-typeinput').val(tem.parameters[1]).appendTo($type);

			// td 2
			var $itmes = $('<td>').appendTo($tr);

			var $type = $('<span>').text('Prefix: ').appendTo($itmes);
			$('<input>').addClass('be-iteminput').val(tem.parameters.prefix).appendTo($itmes);

			$('<br>').appendTo($itmes);
			$('<span>').text('Items: ').appendTo($itmes);

			var $ul = $('<ul>').addClass('be-items').appendTo($itmes);
			for (let i = 2; ; i++) {
				if (tem.parameters.hasOwnProperty(i)) {
					var $li = $('<li>').appendTo($ul);
					$('<img>').attr('src', 'https://upload.wikimedia.org/wikipedia/commons/c/ca/OOjs_UI_icon_move.svg').appendTo($li);
					$('<input>').addClass('be-iteminput').val(tem.parameters[i]).appendTo($li);
				} else {
					break;
				}
			}

			$('<span>').text('Suffix: ').appendTo($itmes);
			$('<input>').addClass('be-iteminput').val(tem.parameters.suffix).appendTo($itmes);

			console.log(tem);
			m = re.exec(text);
		}
		$('#content').html($wrapper);
		$('<style>').html(`
			ul.be-items {
				list-style-type: none;
				background: #ffffbb;
				min-height: 30px;
			}
			input.bp-typeinput {
				width: 30px;
			}
			input.be-iteminput {
				width: 90%;
			}
		`).insertBefore($wrapper);
		// $('ul.be-items li').css('display', 'inline');


		$(function() {
			var oldList, newList, item;
			$('.be-items').sortable({
				start: function(event, ui) {
					item = ui.item;
					newList = oldList = ui.item.parent().parent();
				},
				stop: function(_event, _ui) {
					// alert("Moved " + item.text() + " from " + oldList.attr('id') + " to " + newList.attr('id'));
				},
				change: function(event, ui) {
					if (ui.sender) newList = ui.placeholder.parent().parent();
				},
				connectWith: ".be-items"
			}).disableSelection();
		});
	}).fail(function(e) {
		mw.notify('載入內容時發生錯誤：' + e, { type: 'error' });
	});
})();
