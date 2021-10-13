/* global Morebits */
(function() {
	function main() {
		var summarySuffix = ' via [[User:Xiplus/js/bulletin-editor|bulletin-editor]]';
		var flagStart = '请在此行下方编辑 -->';
		var flagEnd = '<!-- 请在此行上方编辑';

		var api = new mw.Api();
		var date = new Morebits.date();
		var bulletinTitle = 'Template:Bulletin';
		var archiveTitle = 'Wikipedia:公告欄/存檔/' + date.format('YYYY年');

		$('#firstHeading').text('公告欄編輯器');

		$('#be-editor').remove();
		var $wrapper = $('<div>').attr('id', 'be-editor');
		$('#bodyContent').html($wrapper);

		if (mw.config.get('wgUserGroups').indexOf('autoconfirmed') === -1) {
			$wrapper.append(
				$('<div>').addClass('errorbox')
					.append('您沒有權限使用公告欄編輯器。')
			);
			return;
		}

		var params = {
			action: 'query',
			format: 'json',
			prop: 'revisions',
			titles: bulletinTitle,
			rvprop: ['content', 'timestamp'],
			formatversion: '2',
			curtimestamp: true,
		};

		if (mw.config.get('wgPageName') === 'Template:Bulletin' && mw.config.get('wgRevisionId') !== mw.config.get('wgCurRevisionId')) {
			params.rvstartid = mw.config.get('wgRevisionId');

			$wrapper.append(
				$('<div>').addClass('warningbox')
					.append($('<b>').text('警告：'))
					.append('您正在編輯的是本頁的舊版本。如果您保存它的話，在本版本之後的任何修改都會丟失。')
			);
		}

		api.get(params).done(function(data) {
			var revision = data.query.pages[0].revisions[0];
			var basetimestamp = revision.timestamp;
			var curtimestamp = data.curtimestamp;
			var bulletinText = revision.content;
			var idxStart = bulletinText.indexOf(flagStart);
			var idxEnd = bulletinText.indexOf(flagEnd);
			if (idxStart === -1 || idxEnd === -1) {
				mw.notify('無法從文本解析公告位置', { type: 'error' });
				return;
			}
			var mainText = bulletinText.substring(idxStart + flagStart.length, idxEnd);
			var re = /{{\s*Bulletin\/item\s*\|/gi;
			var m = re.exec(mainText);

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
					return oldtext.substring(0, idx) + '\n' + date.monthHeader() + '\n' + archiveText + '\n' + oldtext.substring(idx);
				}
			}

			function previewPage() {
				api.post({
					action: 'parse',
					contentmodel: 'wikitext',
					text: mergeMainText(),
					title: bulletinTitle,
					summary: $('#be-summary').val() + summarySuffix,
					prop: 'text',
					formatversion: '2',
				}).done(function(data) {
					$('.be-preview-boxes').hide();
					$('#be-summary-box').show();
					$('#be-summary-body').html(data.parse.parsedsummary);
					$('#be-preview-box').show();
					$('#be-preview-body').html(data.parse.text);
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
					$('.be-preview-boxes').hide();
					$('#be-diff-box').show();
					var diff = data.query.pages[0].revisions[0].diff.body;
					if (diff == '') {
						$('#be-diff-nochange').text('公告欄無變更').show();
						$('#be-diff-body').hide();
					} else {
						$('#be-diff-nochange').hide();
						$('#be-diff-body').html(diff).show();
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
					formatversion: '2',
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
						$('.be-preview-boxes').hide();
						$('#be-diff-box').show();
						var diff = data.query.pages[0].revisions[0].diff.body;
						if (diff == '') {
							$('#be-diff-nochange').text('存檔頁無變更').show();
							$('#be-diff-body').hide();
						} else {
							$('#be-diff-nochange').hide();
							$('#be-diff-body').html(diff).show();
						}
					}).fail(function(error) {
						mw.notify('產生差異時發生錯誤：' + error, { type: 'error' });
					});
				}).fail(function(error) {
					mw.notify('產生差異時發生錯誤：' + error, { type: 'error' });
				});
			}

			function showEditConflict() {
				$('.be-preview-boxes').hide();
				$('#be-conflict-box').show();
				$('#be-conflict-main').val(mergeMainText());
				$('#be-conflict-archive').val(generateArchiveText());
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

					if (generateArchiveText() === '') {
						mw.notify('沒有東西要存檔，即將重新載入頁面...');
						setTimeout(function() { location.reload(); }, 1000);
						return;
					}

					api.edit(archiveTitle, function(revision) {
						return {
							text: mergeArchiveText(revision.content),
							summary: '存檔' + summarySuffix,
						};
					}).done(function() {
						mw.notify('成功儲存存檔頁，即將重新載入頁面...');
						setTimeout(function() { location.reload(); }, 1000);
					}).fail(function(error) {
						mw.notify('儲存存檔頁時發生錯誤：' + error, { type: 'error' });
					});
				}).fail(function(error) {
					if (error === 'editconflict') {
						showEditConflict();
						mw.notify('儲存公告欄時發生編輯衝突，請從下方複製您的版本並使用傳統編輯框解決衝突', { type: 'error' });
					} else {
						mw.notify('儲存公告欄時發生錯誤：' + error, { type: 'error' });
					}
				});
			}

			var $tbody = $('<tbody>').attr('id', 'be-active-tbody');
			$wrapper.append(
				$('<table>').attr('id', 'be-active-zone').addClass('wikitable')
					.append($('<thead>')
						.append($('<tr>')
							.append($('<th>').css('width', '30px').text('類別')
								.append($('<img>').attr({
									'src': 'https://upload.wikimedia.org/wikipedia/commons/0/06/OOjs_UI_icon_add.svg',
									'title': '增加一個公告類別',
								}).on('click', function() {
									var $row = createRow().prependTo($tbody);
									createItem().appendTo($row.find('.be-items'));
								})))
							.append($('<th>').css('width', '100%').text('公告內容'))
						)
					).append($tbody)
			);

			function createRow(type, prefix, suffix) {
				type = type || '公告';
				prefix = prefix || '';
				suffix = suffix || '';

				var $tr = $('<tr>').addClass('be-row').appendTo($tbody);

				// td 1
				var $type = $('<td>').addClass('be-type-col').appendTo($tr);
				$type.append($('<img>').addClass('be-sortable-row-handle').attr({
					'src': 'https://upload.wikimedia.org/wikipedia/commons/c/ca/OOjs_UI_icon_move.svg',
					'title': '調整公告類別順序',
				}));
				$type.append($('<br>'));
				$type.append($('<input>').addClass('be-type-text be-row-type').val(type));

				// td 2
				var $items = $('<td>').addClass('be-item-col').appendTo($tr);

				$items.append($('<span>').text('Prefix: '));
				$items.append($('<input>').addClass('be-item-text be-row-prefix').val(prefix));

				$items.append($('<br>'));
				$items.append($('<span>').text('Items: '));
				$items.append($('<img>').attr({
					'src': 'https://upload.wikimedia.org/wikipedia/commons/0/06/OOjs_UI_icon_add.svg',
					'title': '增加一個公告項目',
				}).on('click', function(event) {
					createItem().prependTo($(event.target).parents('.be-item-col').find('.be-items'));
				}));

				$('<ul>').addClass('be-items').appendTo($items);

				$items.append($('<span>').text('Suffix: '));
				$items.append($('<input>').addClass('be-item-text be-row-suffix').val(suffix));

				return $tr;
			}

			function createItem(text) {
				text = text || '';

				var $li = $('<li>').addClass('be-item').appendTo($ul);
				$li.append($('<img>').addClass('be-sortable-item-handle').attr({
					'src': 'https://upload.wikimedia.org/wikipedia/commons/c/ca/OOjs_UI_icon_move.svg',
					'title': '調整公告項目順序或移動到其他公告類別',
				}));

				// hidden type input
				$li.append($('<input>').addClass('be-type-text be-item-type'));

				// hidden prefix input
				$li.append($('<input>').addClass('be-item-text be-item-prefix'));

				// item input
				$li.append($('<input>').addClass('be-item-text be-item-main').val(text)
					.attr('placeholder', '空的項目將在發布變更時自動被忽略')
				);

				// hidden suffix input
				$li.append($('<input>').addClass('be-item-text be-item-suffix'));

				// archive button
				$li.append($('<img>').addClass('be-archive-btn').attr({
					'src': 'https://upload.wikimedia.org/wikipedia/commons/7/72/OOjs_UI_icon_tray.svg',
					'title': '存檔',
				}).on('click', moveToArchive));

				return $li;
			}

			while (m) {
				var tem = Morebits.wikitext.parseTemplate(mainText, m.index);
				var row = createRow(
					tem.parameters[1],
					tem.parameters.prefix,
					tem.parameters.suffix
				).appendTo($tbody);

				var $ul = row.find('.be-items');
				for (let i = 2; ; i++) {
					if (Object.hasOwnProperty.call(tem.parameters, i)) {
						createItem(tem.parameters[i]).appendTo($ul);
					} else {
						break;
					}
				}

				m = re.exec(mainText);
			}

			var $archiveZone = $('<div>').attr('id', 'be-archive-zone').appendTo($wrapper);
			$archiveZone.append(document.createTextNode('存檔至'));
			$archiveZone.append($('<a>').attr({
				href: mw.util.getUrl(archiveTitle),
				target: '_blank',
			}).text(archiveTitle));
			$archiveZone.append(document.createTextNode('（發布變更時會自動合併Prefix、Suffix）'));
			$archiveZone.append($('<ul>').attr('id', 'be-archiveul').addClass('be-items'));

			$wrapper.append($('<span>').text('公告欄編輯摘要：'));
			$wrapper.append($('<input>').attr('id', 'be-summary'));
			$wrapper.append($('<br>'));

			$wrapper.append($('<button>').addClass('be-button').attr('id', 'be-preview').text('公告欄預覽').on('click', previewPage));
			$wrapper.append($('<button>').addClass('be-button').attr('id', 'be-diff-page').text('公告欄差異').on('click', diffPage));
			$wrapper.append($('<button>').addClass('be-button').attr('id', 'be-diff-archive').text('存檔差異').on('click', diffArchive));
			$wrapper.append($('<button>').addClass('be-button').attr('id', 'be-publish').text('發布變更').on('click', savePage));

			$wrapper.append($('<span>').text('警告：本工具未經測試，您需要複查您的編輯並對於負起完整責任。').css('color', 'red'));

			var $conflictBox = $('<div>').attr('id', 'be-conflict-box').addClass('be-preview-boxes').hide().appendTo($wrapper);
			$conflictBox.append($('<span>').attr('id', 'be-conflict-label').text('發生了編輯衝突！請從下方複製您的版本並使用傳統編輯框來完成您的編輯，或是重新載入公告欄編輯器（您之前的變更將遺失）。'));
			$conflictBox.append($('<br>'))
			$conflictBox.append($('<span>').text('公告欄文字'))
			$conflictBox.append($(document.createTextNode('（')))
			$conflictBox.append($('<a>').attr({
				href: mw.util.getUrl(bulletinTitle, { action: 'edit' }),
				target: '_blank',
			}).text('編輯'))
			$conflictBox.append($(document.createTextNode('）')))
			$conflictBox.append($('<textarea>').attr({ id: 'be-conflict-main', rows: 10 }))
			$conflictBox.append($('<span>').text('存檔頁文字'))
			$conflictBox.append($(document.createTextNode('（')))
			$conflictBox.append($('<a>').attr({
				href: mw.util.getUrl(archiveTitle, { action: 'edit' }),
				target: '_blank',
			}).text('編輯'))
			$conflictBox.append($(document.createTextNode('）')))
			$conflictBox.append($('<textarea>').attr({ id: 'be-conflict-archive', rows: 5 }))

			var $summaryBox = $('<div>').attr('id', 'be-summary-box').addClass('be-preview-boxes').hide().appendTo($wrapper);
			$summaryBox.append($('<span>').text('公告欄編輯摘要預覽：'));
			$summaryBox.append($('<span>').attr('id', 'be-summary-body'));

			var $previewBox = $('<div>').attr('id', 'be-preview-box').addClass('be-preview-boxes').hide().appendTo($wrapper);
			$previewBox.append($('<span>').attr('id', 'be-preview-body'));

			var $diffBox = $(`<div>`).attr('id', 'be-diff-box').addClass('be-preview-boxes').hide().appendTo($wrapper);
			$diffBox.append($('<span>').attr('id', 'be-diff-nochange').hide());
			$diffBox.append($(`<table class="diff">
			<colgroup>
				<col class="diff-marker">
				<col class="diff-content">
				<col class="diff-marker">
				<col class="diff-content">
			</colgroup>
			<tbody id="be-diff-body">
			</tbody>
			</table>`));

			$wrapper.append($('<style>').html(`
			.be-item-col {
				min-width: 600px;
			}
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
			#be-conflict-box,
			#be-summary-box,
			#be-preview-box,
			#be-diff-box {
				margin-top: 16px;
				border: 1px solid;
			}
			#be-conflict-box {
				background: #fcc;
			}
			#be-conflict-label {
				font-weight: bold;
			}
			#be-summary {
				width: 50%;
			}
			.be-button {
				margin-right: 3px;
			}
			#be-publish {
				color: #fff;
				background-color: #36c;
				border-color: #36c;
			}
			`));

			$(function() {
				var oldList;
				$('.be-items').sortable({
					handle: '.be-sortable-item-handle',
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
					connectWith: '.be-items',
				}).disableSelection();
			});
			$('#be-active-tbody').sortable({
				handle: '.be-sortable-row-handle',
			});
		}).fail(function(e) {
			mw.notify('載入內容時發生錯誤：' + e, { type: 'error' });
		});
	}

	mw.loader.using(['ext.gadget.morebits', 'mediawiki.api', 'mediawiki.diff.styles'], function() {
		if (mw.config.get('wgPageName') === 'Template:Bulletin') {
			var link = mw.util.addPortletLink(
				'p-views', '#', '視覺化編輯', 'ca-bulletin-editor',
				'使用公告欄編輯器編輯此頁面',
				null, '#ca-history'
			);
			$(link).addClass('collapsible');
			$(link).on('click', main);
		}
		if (mw.config.get('wgCanonicalSpecialPageName') === 'Blankpage' && /\/bulletin-editor$/.test(mw.config.get('wgPageName'))) {
			main();
		}
	});

})();
