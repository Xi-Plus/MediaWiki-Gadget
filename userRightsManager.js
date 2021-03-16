/* global Morebits */
/* eslint-disable no-extra-boolean-cast */
// <nowiki>
// Some UI code adapted from [[User:Mr. Stradivarius/gadgets/Draftify.js]]
// Adapted from https://en.wikipedia.org/wiki/User:MusikAnimal/userRightsManager.js
(function() {
	var pagePermissions = {
		'Wikipedia:權限申請/申請IP封禁例外權': 'ipblock-exempt',
		'Wikipedia:權限申請/申請巡查權': 'patroller',
		'Wikipedia:權限申請/申請回退權': 'rollbacker',
		'Wikipedia:權限申請/申請巡查豁免權': 'autoreviewer',
		'Wikipedia:權限申請/申請確認用戶權': 'confirmed',
		'Wikipedia:權限申請/申請大量訊息發送權': 'massmessage-sender',
		'Wikipedia:權限申請/申請大量帳號建立權': 'accountcreator',
		'Wikipedia:權限申請/申請檔案移動權': 'filemover',
		'Wikipedia:權限申請/申請跨維基導入權': 'transwiki',
		'Wikipedia:權限申請/申請模板編輯員': 'templateeditor',
	}

	var pageName = mw.config.get('wgPageName');
	var permission = pagePermissions[pageName];

	if (!permission) {
		return;
	}

	var permissionNames = {
		'ipblock-exempt': wgULS('IP封禁豁免', 'IP封鎖例外'),
		'patroller': '巡查員',
		'rollbacker': '回退員',
		'autoreviewer': '巡查豁免者',
		'confirmed': '已確認的使用者',
		'massmessage-sender': '大量訊息傳送者',
		'accountcreator': '大量帳號建立者',
		'filemover': '檔案移動員',
		'transwiki': '跨維基匯入者',
		'templateeditor': '模板編輯員',
	};

	var templates = {
		'ipblock-exempt': 'Ipexemptgranted',
		'patroller': 'Patrolgranted',
		'rollbacker': 'Rollbackgranted',
		'autoreviewer': 'Autopatrolgranted',
		'massmessage-sender': 'MMSgranted',
		'templateeditor': 'Template editor granted',
	};

	var api,
		tagLine = '（使用[[User:Xiplus/js/userRightsManager|userRightsManager]]）',
		permaLink, userName, dialog;

	mw.loader.using(['oojs-ui', 'mediawiki.api', 'mediawiki.widgets.SelectWithInputWidget', 'mediawiki.widgets.expiry', 'ext.gadget.morebits'], function() {
		api = new mw.Api();
		$('.perm-assign-permissions a').on('click', function(e) {
			if (permission === 'AutoWikiBrowser') return true;
			e.preventDefault();
			userName = mw.util.getParamValue('user', $(this).attr('href'));
			showDialog();
		});
	});

	/* 修改自 https://zh.wikipedia.org/w/index.php?title=MediaWiki:Gadget-site-lib.js&oldid=36816755 */
	function wgULS(hans, hant, cn, tw, hk, sg, zh, mo, my) {
		var wg = mw.config.get('wgUserLanguage');
		var ret = {
			'zh': zh || hans || hant || cn || tw || hk || sg || mo || my,
			'zh-hans': hans || cn || sg || my,
			'zh-hant': hant || tw || hk || mo,
			'zh-cn': cn || hans || sg || my,
			'zh-sg': sg || hans || cn || my,
			'zh-tw': tw || hant || hk || mo,
			'zh-hk': hk || hant || mo || tw,
			'zh-mo': mo || hant || hk || tw
		}
		return ret[wg] || zh || hans || hant || cn || tw || hk || sg || mo || my;
	}

	function showDialog() {
		var Dialog = function(config) {
			Dialog.super.call(this, config);
		};
		OO.inheritClass(Dialog, OO.ui.ProcessDialog);
		Dialog.static.name = 'user-rights-manager';
		Dialog.static.title = '授予' + permissionNames[permission] + wgULS('给', '給') + userName;
		Dialog.static.actions = [
			{ action: 'submit', label: wgULS('授权', '授權'), flags: ['primary', 'progressive'] },
			{ label: '取消', flags: 'safe' }
		];
		Dialog.prototype.getApiManager = function() {
			return this.apiManager;
		};
		Dialog.prototype.getBodyHeight = function() {
			return 208;
		};
		Dialog.prototype.initialize = function() {
			Dialog.super.prototype.initialize.call(this);
			this.editFieldset = new OO.ui.FieldsetLayout({
				classes: ['container']
			});
			this.editPanel = new OO.ui.PanelLayout({
				expanded: false
			});
			this.editPanel.$element.append(this.editFieldset.$element);

			var rightLogWapper = $('<span>');
			var url = mw.util.getUrl('Special:Log/rights', { type: 'rights', page: 'User:' + userName });
			$('<a>').text('最近權限日誌').attr({ 'href': url, 'target': '_blank' }).appendTo(rightLogWapper);
			rightLogWapper.append('：');
			var rightLogText = $('<span>').text('取得中').appendTo(rightLogWapper);
			this.rightLog = new OO.ui.LabelWidget({
				label: rightLogWapper
			});

			api.get({
				action: 'query',
				format: 'json',
				list: 'logevents',
				leaction: 'rights/rights',
				letitle: 'User:' + userName,
				lelimit: '1'
			}).done(function(data) {
				var logs = data.query.logevents;
				if (logs.length === 0) {
					rightLogText.text('沒有任何日誌');
				} else {
					var timestamp = new Morebits.date(logs[0].timestamp).calendar();
					var rights = logs[0].params.newgroups.join('、') || '（無）';
					rightLogText.text(timestamp + ' ' + logs[0].user + '將使用者群組改為' + rights);
				}
			});

			this.rightsChangeSummaryInput = new OO.ui.TextInputWidget({
				value: '',
				placeholder: '可留空'
			});
			this.expiryInput = new mw.widgets.ExpiryWidget({
				$overlay: $('.oo-ui-window'),
				RelativeInputClass: mw.widgets.SelectWithInputWidget,
				relativeInput: {
					or: true,
					dropdowninput: {
						options: [
							{ data: '1 day', label: '1天' },
							{ data: '1 week', label: '1週' },
							{ data: '1 month', label: '1個月' },
							{ data: '3 months', label: '3個月' },
							{ data: '6 months', label: '6個月' },
							{ data: '1 year', label: '1年' },
							{ data: 'infinite', label: '沒有期限' },
							{ data: 'other', label: '其他時間' },
						],
						value: 'infinite',
					},
					textinput: {
						required: true,
					}
				}
			});
			this.closingRemarksInput = new OO.ui.TextInputWidget({
				value: '{{done}} ~~~~'
			});
			this.watchTalkPageCheckbox = new OO.ui.CheckboxInputWidget({
				selected: false
			});
			this.editFieldset.addItems(this.rightLog);
			var formElements = [
				new OO.ui.FieldLayout(this.rightsChangeSummaryInput, {
					label: wgULS('授权原因', '授權原因')
				}),
				new OO.ui.FieldLayout(this.expiryInput, {
					label: wgULS('结束时间', '結束時間')
				}),
				new OO.ui.FieldLayout(this.closingRemarksInput, {
					label: wgULS('关闭请求留言', '關閉請求留言')
				})
			];
			if (!!templates[permission]) {
				formElements.push(
					new OO.ui.FieldLayout(this.watchTalkPageCheckbox, {
						label: wgULS('监视用户讨论页', '監視使用者討論頁')
					})
				);
			}
			this.editFieldset.addItems(formElements);
			this.submitPanel = new OO.ui.PanelLayout({
				$: this.$,
				expanded: false
			});
			this.submitFieldset = new OO.ui.FieldsetLayout({
				classes: ['container']
			});
			this.submitPanel.$element.append(this.submitFieldset.$element);
			this.changeRightsProgressLabel = new OO.ui.LabelWidget();
			this.changeRightsProgressField = new OO.ui.FieldLayout(this.changeRightsProgressLabel);
			this.markAsDoneProgressLabel = new OO.ui.LabelWidget();
			this.markAsDoneProgressField = new OO.ui.FieldLayout(this.markAsDoneProgressLabel);
			this.issueTemplateProgressLabel = new OO.ui.LabelWidget();
			this.issueTemplateProgressField = new OO.ui.FieldLayout(this.issueTemplateProgressLabel);
			this.stackLayout = new OO.ui.StackLayout({
				items: [this.editPanel, this.submitPanel],
				padded: true
			});
			this.$body.append(this.stackLayout.$element);
		};

		Dialog.prototype.onSubmit = function() {
			var self = this, promiseCount = !!templates[permission] ? 3 : 2;

			self.actions.setAbilities({ submit: false });

			var addPromise = function(field, promise) {
				self.pushPending();
				promise.done(function() {
					field.$field.append($('<span>')
						.text('完成！')
						.prop('style', 'position:relative; top:0.5em; color: #009000; font-weight: bold')
					);
				}).fail(function(obj) {
					if (obj && obj.error && obj.error.info) {
						field.$field.append($('<span>')
							.text('錯誤：' + obj.error.info)
							.prop('style', 'position:relative; top:0.5em; color: #cc0000; font-weight: bold')
						);
					} else {
						field.$field.append($('<span>')
							.text('發生未知錯誤。')
							.prop('style', 'position:relative; top:0.5em; color: #cc0000; font-weight: bold')
						);
					}
				}).always(function() {
					promiseCount--; // FIXME: maybe we could use a self.isPending() or something
					self.popPending();

					if (promiseCount === 0) {
						setTimeout(function() {
							location.reload(true);
						}, 1000);
					}
				});

				return promise;
			};

			self.markAsDoneProgressField.setLabel('標記請求為已完成...');
			self.submitFieldset.addItems([self.markAsDoneProgressField]);
			self.changeRightsProgressField.setLabel('授予權限...');
			self.submitFieldset.addItems([self.changeRightsProgressField]);

			if (!!templates[permission]) {
				self.issueTemplateProgressField.setLabel('發送通知...');
				self.submitFieldset.addItems([self.issueTemplateProgressField]);
			}

			addPromise(
				self.markAsDoneProgressField,
				markAsDone('\n:' + this.closingRemarksInput.getValue())
			).then(function(data) {
				addPromise(
					self.changeRightsProgressField,
					assignPermission(
						this.rightsChangeSummaryInput.getValue(),
						data.edit.newrevid,
						this.expiryInput.getValue()
					)
				).then(function() {
					if (!!templates[permission]) {
						addPromise(
							self.issueTemplateProgressField,
							issueTemplate(this.watchTalkPageCheckbox.isSelected())
						);
					}
				}.bind(this));
			}.bind(this));

			self.stackLayout.setItem(self.submitPanel);
		};

		Dialog.prototype.getActionProcess = function(action) {
			return Dialog.super.prototype.getActionProcess.call(this, action).next(function() {
				if (action === 'submit') {
					return this.onSubmit();
				} else {
					return Dialog.super.prototype.getActionProcess.call(this, action);
				}
			}, this);
		};

		dialog = new Dialog({
			size: 'medium'
		});

		var windowManager = new OO.ui.WindowManager();
		$('body').append(windowManager.$element);
		windowManager.addWindows([dialog]);
		windowManager.openWindow(dialog);
	}

	function assignPermission(summary, revId, expiry) {
		permaLink = '[[Special:PermaLink/' + revId + '#User:' + userName + '|權限申請]]';
		var fullSummary = '+' + permissionNames[permission] + '；' + permaLink;
		if (summary !== '') {
			fullSummary += '；' + summary;
		}
		fullSummary += tagLine;

		return api.postWithToken('userrights', {
			action: 'userrights',
			format: 'json',
			user: userName.replace(/ /g, '_'),
			add: permission,
			reason: fullSummary,
			expiry: expiry === '' ? 'infinity' : expiry
		});
	}

	function markAsDone(closingRemarks) {
		var sectionNode = document.getElementById('User:' + userName.replace(/"/g, '.22').replace(/ /g, '_')),
			sectionNumber = $(sectionNode).siblings('.mw-editsection').find("a:not('.mw-editsection-visualeditor')").prop('href').match(/section=(\d+)/)[1];

		var basetimestamp, curtimestamp, page, revision, content;

		return api.get({
			action: 'query',
			prop: 'revisions',
			rvprop: ['content', 'timestamp'],
			titles: [pageName],
			rvsection: sectionNumber,
			formatversion: '2',
			curtimestamp: true
		})
			.then(function(data) {
				if (!data.query || !data.query.pages) {
					return $.Deferred().reject('unknown');
				}
				page = data.query.pages[0];
				if (!page || page.invalid) {
					return $.Deferred().reject('invalidtitle');
				}
				if (page.missing) {
					return $.Deferred().reject('nocreate-missing');
				}
				revision = page.revisions[0];
				basetimestamp = revision.timestamp;
				curtimestamp = data.curtimestamp;
				content = revision.content;
			})
			.then(function() {
				content = content.trim();
				content = content.replace(/:{{rfp\/status\|(.+?)}}/, ':{{rfp/status|+}}');
				content += closingRemarks;

				return api.postWithEditToken({
					action: 'edit',
					title: pageName,
					section: sectionNumber,
					text: content,
					summary: '/* User:' + userName + ' */ 完成' + tagLine,
					formatversion: '2',

					assert: mw.config.get('wgUserName') ? 'user' : undefined,
					basetimestamp: basetimestamp,
					starttimestamp: curtimestamp,
					nocreate: true
				});
			});
	}

	function issueTemplate(watch) {
		var talkPage = 'User talk:' + userName.replace(/ /g, '_');
		return api.postWithToken('edit', {
			format: 'json',
			action: 'edit',
			title: talkPage,
			summary: '根據' + permaLink + '授予' + permissionNames[permission] + tagLine,
			appendtext: '\n\n{{subst:' + templates[permission] + '}}',
			watchlist: watch ? 'watch' : 'unwatch'
		});
	}
})();
// </nowiki>
