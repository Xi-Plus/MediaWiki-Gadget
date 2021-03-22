/* global Morebits */
(function() {
	function main() {
		var api = new mw.Api();
		var date = new Morebits.date();
		var bulletinTitle = 'Template:Bulletin';
		var archiveTitle = 'Wikipedia:公告欄/存檔/' + date.format('YYYY年');
		var summarySuffix = ' via [[User:Xiplus/js/bulletin-editor|bulletin-editor]]';

		api.get({
			action: 'query',
			format: 'json',
			prop: 'revisions',
			titles: bulletinTitle,
			rvprop: ['content', 'timestamp'],
			formatversion: '2',
			curtimestamp: true,
		}).done(function(data) {
			var revision = data.query.pages[0].revisions[0];
			var basetimestamp = revision.timestamp;
			var curtimestamp = data.curtimestamp;
			var bulletinText = revision.content;
			var flagStart = '<!-- manual start -->';
			var flagEnd = '<!-- manual end -->';
			var idxStart = bulletinText.indexOf(flagStart);
			var idxEnd = bulletinText.indexOf(flagEnd);
			if (idxStart === -1 || idxEnd === -1) {
				mw.notify('無法從文本解析公告位置', { type: 'error' });
				return;
			}
			var mainText = bulletinText.substring(idxStart + flagStart.length, idxEnd);
			var re = /{{\s*Bulletin\/item\s*\|/gi;
			var m = re.exec(mainText);
			$('#be-editor').remove();
			var $wrapper = $('<div>').attr('id', 'be-editor');

			function copyDataFromParent(item, row) {
				item.find('.be-item-type').val(row.find('.be-row-type').val());
				item.find('.be-item-prefix').val(row.find('.be-row-prefix').val());
				item.find('.be-item-suffix').val(row.find('.be-row-suffix').val());
			}

			function moveToArchive(event) {
				var item = $(event.target).parent();
				copyDataFromParent(item, item.parents('.be-row'));
				$('#be-archiveul').append(item);
			}

			function generateText() {
				var newText = '';

				$.each($('.be-row'), function(_idx, row) {
					row = $(row);

					var itemsText = row.find('.be-item-main')
						.map(function(idx, item) {
							return $(item).val().trim()
						})
						.filter(function(idx, item) {
							return item.length > 0
						});

					if (itemsText.length === 0) {
						return;
					}

					var tempText = '{{bulletin/item|';

					tempText += row.find('.be-row-type').val().trim();

					var prefix = row.find('.be-row-prefix').val().trim();
					var suffix = row.find('.be-row-suffix').val().trim();

					if (!prefix && !suffix && itemsText.length == 1) {
						// No prefix, suffix, and only 1 item
						tempText += '|' + itemsText[0]
					} else {
						if (prefix) {
							tempText += '|prefix=' + prefix;
						}

						tempText += '\n';
						tempText += itemsText.map((_idx, item) => { return '|' + item + '\n' }).get().join('');
						tempText

						if (suffix) {
							tempText += '|suffix=' + suffix;
						}
					}

					tempText += '}}\n';

					newText += tempText;
				});

				return newText;
			}

			function mergeMainText() {
				return bulletinText.substring(0, idxStart + flagStart.length) + '\n' + generateText() + bulletinText.substring(idxEnd);
			}

			function generateArchiveText() {
				var itemsText = $('#be-archive-zone .be-item')
					.filter(function(idx, item) {
						return $(item).find('.be-item-main').val().trim().length > 0;
					})
					.map(function(idx, item) {
						var tempText = '{{bulletin/item|';
						tempText += $(item).find('.be-item-type').val().trim();
						tempText += '|';
						tempText += $(item).find('.be-item-prefix').val().trim();
						tempText += $(item).find('.be-item-main').val().trim();
						tempText += $(item).find('.be-item-suffix').val().trim();
						tempText += '}}~~~~~';

						return tempText;
					});

				return itemsText.get().join('\n');
			}

			function mergeArchiveText(oldtext) {
				var archiveText = generateArchiveText();
				if (archiveText === '') {
					return oldtext;
				}

				var header = date.monthHeaderRegex().exec(oldtext);
				if (header !== null) {
					var idx = oldtext.indexOf(header[0]) + header[0].length;
					return oldtext.substring(0, idx) + '\n' + archiveText + oldtext.substring(idx);
				} else {
					var idx = oldtext.indexOf('\n==');
					if (idx === -1) {
						idx = 0;
					}
					return oldtext.substring(0, idx) + date.monthHeader() + '\n' + archiveText + oldtext.substring(idx);
				}
			}

			function previewPage() {
				api.parse(mergeMainText(), {
					title: bulletinTitle,
					prop: 'text',
				}).done(function(data) {
					$('#be-preview-box').html(data);
				}).fail(function(error) {
					mw.notify('產生預覽時發生錯誤：' + error);
				});
			}

			function diffPage() {
				api.post({
					action: 'query',
					prop: 'revisions',
					titles: bulletinTitle,
					rvdifftotext: mergeMainText(),
					formatversion: '2',
				}).done(function(data) {
					var diff = data.query.pages[0].revisions[0].diff.body;
					if (diff == '') {
						$('#be-preview-box').html('公告欄無變更');
					} else {
						$('#be-preview-box').html(diff);
					}
				}).fail(function(error) {
					mw.notify('產生差異時發生錯誤：' + error, { type: 'error' });
				});
			}

			function diffArchive() {
				api.get({
					action: 'query',
					prop: 'revisions',
					rvprop: ['content'],
					titles: archiveTitle,
					formatversion: '2'
				}).done(function(data) {
					var page, text = '';
					page = data.query.pages[0];
					if (!page.missing) {
						text = page.revisions[0].content;
					}

					api.post({
						action: 'query',
						prop: 'revisions',
						titles: archiveTitle,
						rvdifftotext: mergeArchiveText(text),
						formatversion: '2',
					}).done(function(data) {
						var diff = data.query.pages[0].revisions[0].diff.body;
						if (diff == '') {
							$('#be-preview-box').html('存檔頁無變更');
						} else {
							$('#be-preview-box').html(diff);
						}
					}).fail(function(error) {
						mw.notify('產生差異時發生錯誤：' + error, { type: 'error' });
					});
				}).fail(function(error) {
					mw.notify('產生差異時發生錯誤：' + error, { type: 'error' });
				});
			}

			function savePage() {
				if (!confirm('確認發布變更？')) {
					mw.notify('已取消操作');
					return;
				}
				api.edit(bulletinTitle, function() {
					return {
						text: mergeMainText(),
						summary: $('#be-summary').val() + summarySuffix,
						basetimestamp: basetimestamp,
						starttimestamp: curtimestamp,
					};
				}).done(function() {
					mw.notify('成功儲存公告欄');

					api.edit(archiveTitle, function(revision) {
						return {
							text: mergeArchiveText(revision.content),
							summary: '存檔' + summarySuffix,
						};
					}).done(function() {
						mw.notify('成功儲存存檔頁');
					}).fail(function(error) {
						mw.notify('儲存存檔頁時發生錯誤：' + error, { type: 'error' });
					});
				}).fail(function(error) {
					mw.notify('儲存公告欄時發生錯誤：' + error, { type: 'error' });
				});
			}

			var $table = $('<table>').attr('id', 'be-active-zone').addClass('wikitable').appendTo($wrapper);
			$(`<tr>
			<th style="width: 30px;">type</th>
			<th style="width: 100%;">items</th>
		</tr>`).appendTo($table);
			while (m) {
				var $tr = $('<tr>').addClass('be-row').appendTo($table);
				var tem = Morebits.wikitext.parseTemplate(mainText, m.index);

				// td 1
				var $type = $('<td>').addClass('be-type-col').appendTo($tr);
				$('<input>').addClass('be-type-text be-row-type').val(tem.parameters[1]).appendTo($type);

				// td 2
				var $itmes = $('<td>').addClass('be-item-col').appendTo($tr);

				var $type = $('<span>').text('Prefix: ').appendTo($itmes);
				$('<input>').addClass('be-item-text be-row-prefix').val(tem.parameters.prefix).appendTo($itmes);

				$('<br>').appendTo($itmes);
				$('<span>').text('Items: ').appendTo($itmes);

				var $ul = $('<ul>').addClass('be-items').appendTo($itmes);
				for (let i = 2; ; i++) {
					if (tem.parameters.hasOwnProperty(i)) {
						var $li = $('<li>').addClass('be-item').appendTo($ul);
						$('<img>').attr({
							'src': 'https://upload.wikimedia.org/wikipedia/commons/c/ca/OOjs_UI_icon_move.svg',
							'title': '調整順序或移動到其他項目',
						}).appendTo($li);

						// hidden type input
						$('<input>').addClass('be-type-text be-item-type').val(tem.parameters[1]).appendTo($li);

						// hidden prefix input
						$('<input>').addClass('be-item-text be-item-prefix').appendTo($li);

						// item input
						$('<input>').addClass('be-item-text be-item-main').val(tem.parameters[i])
							.attr('placeholder', '空的項目將在儲存時自動被忽略')
							.appendTo($li);

						// hidden suffix input
						$('<input>').addClass('be-item-text be-item-suffix').appendTo($li);

						// archive button
						$('<img>').addClass('be-archive-btn').attr({
							'src': 'https://upload.wikimedia.org/wikipedia/commons/7/72/OOjs_UI_icon_tray.svg',
							'title': '存檔',
						}).appendTo($li).on('click', moveToArchive);
					} else {
						break;
					}
				}

				$('<span>').text('Suffix: ').appendTo($itmes);
				$('<input>').addClass('be-item-text be-row-suffix').val(tem.parameters.suffix).appendTo($itmes);

				m = re.exec(mainText);
			}

			var $archiveZone = $('<div>').attr('id', 'be-archive-zone').appendTo($wrapper);
			$('<span>').text('存檔區（儲存時會自動合併Prefix、Suffix）').appendTo($archiveZone);
			var $ul = $('<ul>').attr('id', 'be-archiveul').addClass('be-items').appendTo($archiveZone);

			$('<span>').text('編輯摘要：').appendTo($wrapper);
			$('<input>').attr('id', 'be-summary').appendTo($wrapper);
			$('<br>').appendTo($wrapper);

			$('<button>').addClass('be-button').attr('id', 'be-preview').text('公告欄預覽').appendTo($wrapper)
				.on('click', previewPage);
			$('<button>').addClass('be-button').attr('id', 'be-diff-page').text('公告欄差異').appendTo($wrapper)
				.on('click', diffPage);
			$('<button>').addClass('be-button').attr('id', 'be-diff-archive').text('存檔差異').appendTo($wrapper)
				.on('click', diffArchive);
			$('<button>').addClass('be-button be-publish').attr('id', 'be-diff-archive').text('發布變更').appendTo($wrapper)
				.on('click', savePage);

			$('<div>').attr('id', 'be-preview-box').appendTo($wrapper);

			$('<style>').html(`
			.be-items {
				list-style-type: none;
				background: #ffffbb;
				min-height: 30px;
			}
			.be-type-text {
				width: 30px;
			}
			.be-item-col .be-item-type,
			.be-item-col .be-item-prefix,
			.be-item-col .be-item-suffix {
				display: none;
			}
			.be-moving .be-item-type,
			.be-moving .be-item-prefix,
			.be-moving .be-item-suffix {
				display: none;
			}
			.be-item-text {
				width: 90%;
			}
			#be-archive-zone .be-archive-btn {
				display: none;
			}
			#be-archive-zone {
				margin-bottom: 16px;
			}
			#be-editor {
				margin-bottom: 16px;
			}
			#be-preview-box {
				margin-top: 16px;
				border: 1px solid;
			}
			#be-summary {
				width: 50%;
			}
			.be-button {
				margin-right: 3px;
			}
			.be-publish {
				color: #fff;
				background-color: #36c;
				border-color: #36c;
			}
		`).appendTo($wrapper);

			$('#content').html($wrapper);

			$(function() {
				var oldList;
				$('.be-items').sortable({
					start: function(_event, ui) {
						oldList = ui.item.parent();
						ui.item.addClass('be-moving');
					},
					stop: function(_event, ui) {
						if ($('#be-active-zone').has(oldList).length && $('#be-archive-zone').has(ui.item).length) {
							copyDataFromParent(ui.item, oldList.parents('.be-row'));
						}
						ui.item.removeClass('be-moving');
					},
					change: function(_event, _ui) {
					},
					connectWith: ".be-items"
				}).disableSelection();
			});
		}).fail(function(e) {
			mw.notify('載入內容時發生錯誤：' + e, { type: 'error' });
		});
	}

	if (mw.config.get('wgPageName') === 'Template:Bulletin') {
		mw.util.addPortletLink('p-cactions', '#', '公告欄編輯器').on('click', main);
	}

})();
