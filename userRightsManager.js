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
		'Wikipedia:權限申請/申請模板編輯權': 'templateeditor',
	}

	var pageName = mw.config.get('wgPageName');
	var permission = pagePermissions[pageName];

	if (!permission) {
		return;
	}

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
		permaLink, userName, dialog, permissionNames;

	mw.loader.using(['oojs-ui', 'mediawiki.api', 'mediawiki.widgets.SelectWithInputWidget', 'mediawiki.widgets.expiry', 'ext.gadget.morebits', 'ext.gadget.site-lib'], function() {
		permissionNames = {
			'ipblock-exempt': wgULS('IP封禁豁免', 'IP封鎖例外'),
			'patroller': wgULS('巡查员', '巡查員'),
			'rollbacker': wgULS('回退员', '回退員'),
			'autoreviewer': '巡查豁免者',
			'confirmed': wgULS('已确认的用户', '已確認的使用者'),
			'massmessage-sender': wgULS('大量消息发送者', '大量訊息傳送者'),
			'accountcreator': wgULS('大量账户创建者', '大量帳號建立者'),
			'filemover': wgULS('文件移动员', '檔案移動員'),
			'transwiki': wgULS('跨维基导入者', '跨維基匯入者'),
			'templateeditor': wgULS('模板编辑员', '模板編輯員'),
		};

		api = new mw.Api();
		$('.perm-assign-permissions a').on('click', function(e) {
			if (permission === 'AutoWikiBrowser') return true;
			e.preventDefault();
			userName = mw.util.getParamValue('user', $(this).attr('href'));
			showDialog();
		});
	});

	function showDialog() {
		var Dialog = function(config) {
			Dialog.super.call(this, config);
		};
		OO.inheritClass(Dialog, OO.ui.ProcessDialog);
		Dialog.static.name = 'user-rights-manager';
		Dialog.static.title = '授予' + permissionNames[permission] + wgULS('给', '給') + userName;
		Dialog.static.actions = [
			{ action: 'submit', label: wgULS('授权', '授權'), flags: ['primary', 'progressive'] },
			{ label: '取消', flags: 'safe' },
		];
		Dialog.prototype.getApiManager = function() {
			return this.apiManager;
		};
		Dialog.prototype.getBodyHeight = function() {
			return 255;
		};
		Dialog.prototype.initialize = function() {
			Dialog.super.prototype.initialize.call(this);
			this.editPanel = new OO.ui.PanelLayout({
				expanded: false,
			});

			var rightLogWapper = $('<span>');
			var url = mw.util.getUrl('Special:Log/rights', { type: 'rights', page: 'User:' + userName });
			$('<a>').text(wgULS('最近权限日志', '最近權限日誌')).attr({ 'href': url, 'target': '_blank' }).appendTo(rightLogWapper);
			rightLogWapper.append('：');
			var rightLogText = $('<span>').text(wgULS('获取中', '取得中')).appendTo(rightLogWapper);
			this.rightLog = new OO.ui.LabelWidget({
				label: rightLogWapper,
			});
			this.editPanel.$element.append(this.rightLog.$element);

			api.get({
				action: 'query',
				format: 'json',
				list: 'logevents',
				leaction: 'rights/rights',
				letitle: 'User:' + userName,
				lelimit: '1',
			}).done(function(data) {
				var logs = data.query.logevents;
				if (logs.length === 0) {
					rightLogText.text(wgULS('没有任何日志', '沒有任何日誌'));
				} else {
					var timestamp = new Morebits.date(logs[0].timestamp).calendar();
					var rights = logs[0].params.newgroups.join('、') || wgULS('（无）', '（無）');
					rightLogText.text(timestamp + ' ' + logs[0].user + wgULS('将用户组改为', '將使用者群組改為') + rights);
				}
			});

			this.editFieldset = new OO.ui.FieldsetLayout({
				classes: ['container'],
			});
			this.editPanel.$element.append(this.editFieldset.$element);

			this.rightsChangeSummaryInput = new OO.ui.TextInputWidget({
				value: '',
				placeholder: '可留空',
			});
			this.expiryInput = new mw.widgets.ExpiryWidget({
				$overlay: $('.oo-ui-window'),
				RelativeInputClass: mw.widgets.SelectWithInputWidget,
				relativeInput: {
					or: true,
					dropdowninput: {
						options: [
							{ data: '1 day', label: '1天' },
							{ data: '1 week', label: wgULS('1周', '1週') },
							{ data: '1 month', label: wgULS('1个月', '1個月') },
							{ data: '3 months', label: wgULS('3个月', '3個月') },
							{ data: '6 months', label: wgULS('6个月', '6個月') },
							{ data: '1 year', label: '1年' },
							{ data: 'infinite', label: wgULS('没有期限', '沒有期限') },
							{ data: 'other', label: wgULS('其他时间', '其他時間') },
						],
						value: 'infinite',
					},
					textinput: {
						required: true,
					},
				},
			});
			this.closingRemarksInput = new OO.ui.TextInputWidget({
				value: '{{done}}--~~~~',
			});
			this.watchTalkPageCheckbox = new OO.ui.CheckboxInputWidget({
				selected: false,
			});
			var formElements = [
				new OO.ui.FieldLayout(this.rightsChangeSummaryInput, {
					label: wgULS('授权原因', '授權原因'),
				}),
				new OO.ui.FieldLayout(this.expiryInput, {
					label: wgULS('结束时间', '結束時間'),
				}),
				new OO.ui.FieldLayout(this.closingRemarksInput, {
					label: wgULS('关闭请求留言', '關閉請求留言'),
				}),
			];
			if (!!templates[permission]) {
				formElements.push(
					new OO.ui.FieldLayout(this.watchTalkPageCheckbox, {
						label: wgULS('监视用户讨论页', '監視使用者討論頁'),
					})
				);
			}
			this.editFieldset.addItems(formElements);
			this.submitPanel = new OO.ui.PanelLayout({
				$: this.$,
				expanded: false,
			});
			this.submitFieldset = new OO.ui.FieldsetLayout({
				classes: ['container'],
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
				padded: true,
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
							.text(wgULS('错误：', '錯誤：') + obj.error.info)
							.prop('style', 'position:relative; top:0.5em; color: #cc0000; font-weight: bold')
						);
					} else {
						field.$field.append($('<span>')
							.text(wgULS('发生未知错误。', '發生未知錯誤。'))
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

			self.markAsDoneProgressField.setLabel(wgULS('标记请求为已完成...', '標記請求為已完成...'));
			self.submitFieldset.addItems([self.markAsDoneProgressField]);
			self.changeRightsProgressField.setLabel(wgULS('授予权限...', '授予權限...'));
			self.submitFieldset.addItems([self.changeRightsProgressField]);

			if (!!templates[permission]) {
				self.issueTemplateProgressField.setLabel(wgULS('发送通知...', '發送通知...'));
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
			size: 'medium',
		});

		var windowManager = new OO.ui.WindowManager();
		$('body').append(windowManager.$element);
		windowManager.addWindows([dialog]);
		windowManager.openWindow(dialog);
	}

	function assignPermission(summary, revId, expiry) {
		permaLink = '[[Special:PermaLink/' + revId + '#User:' + userName + '|' + wgULS('权限申请', '權限申請') + ']]';
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
			expiry: expiry === '' ? 'infinity' : expiry,
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
			curtimestamp: true,
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
				content = content.replace(/:{{(Status)(\|.*?)?}}/i, ':{{$1|+}}');
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
					nocreate: true,
				});
			});
	}

	function issueTemplate(watch) {
		var talkPage = 'User talk:' + userName.replace(/ /g, '_');
		var message = '{{subst:' + templates[permission] + '}}';

		return api.get({
			action: 'query',
			prop: 'info',
			titles: talkPage,
		}).then(function(data) {
			var page = Object.values(data.query.pages)[0];
			if (page.missing !== undefined) {
				return api.create(
					talkPage,
					{
						summary: wgULS('根据', '根據') + permaLink + '授予' + permissionNames[permission] + tagLine,
						watchlist: watch ? 'watch' : 'unwatch',
					},
					message
				);
			} else if (page.contentmodel == 'flow-board') {
				return api.postWithEditToken({
					action: 'flow',
					page: talkPage,
					submodule: 'new-topic',
					nttopic: wgULS('根据', '根據') + permaLink + '授予' + permissionNames[permission],
					ntcontent: message,
					ntformat: 'wikitext',
				});
			} else {
				return api.edit(talkPage, function(revision) {
					return {
						text: (revision.content + '\n\n' + message).trim(),
						summary: wgULS('根据', '根據') + permaLink + '授予' + permissionNames[permission] + tagLine,
						watchlist: watch ? 'watch' : 'unwatch',
					};
				});
			}
		});
	}
})();
// </nowiki>
