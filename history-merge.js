/*global jQuery, mediaWiki, OO*/
/*
 * 修改自 https://www.wikidata.org/w/index.php?title=MediaWiki:Gadget-Merge.js&oldid=835856716
 */

mw.loader.using(['mediawiki.api', 'mediawiki.util', 'mediawiki.language', 'oojs-ui-windows', 'mediawiki.storage']).done(function() {

    if (!mw.config.get('wgIsProbablyEditable')) {
        return;
    }

    (function($, mw, OO) {
        'use strict';
        var messages, targetPageName = mw.config.get('wgPageName'), api = new mw.Api();

        messages = (function() {
            var translations = {
                'zh-hant': {
                    copyTargetContent: '複製目標頁內容至來源頁……',
                    deleteTarget: '刪除目標頁面……',
                    errorWhile: '"$1"時出錯：',
                    leaveRedirect: '留下重新導向',
                    loadMergeDestination: '成功時載入目標頁',
                    loadingMergeDestination: '正在載入目標頁……',
                    merge: '合併',
                    mergeKeepTargetContent: '以目標頁面內容當作最新版本',
                    mergePendingNotification: 'history-merge.js已經運行，請前往其他需要合併的頁面。',
                    mergeProcess: '開始合併',
                    mergeSummary: '編輯摘要：',
                    mergeThisPage: '這個頁面是要合併歷史的目標頁面。',
                    mergeWithInput: '要和此頁合併的頁面（來源頁面）：',
                    mergeWithProgress: '合併歷史至此頁',
                    mergeWizard: '合併頁面歷史',
                    moveSource: '移動來源頁面……',
                    moveTalk: '移動討論頁',
                    postpone: '和其他頁合併',
                    postponeTitle: '儲存此頁名稱以和其他頁合併',
                    selectForMerging: '合併歷史至他頁',
                    selectForMergingTitle: '這個頁面是要合併歷史的來源頁面。',
                    undeleteTarget: '還原來源頁面……',
                }
            },
                chain = mw.language.getFallbackLanguageChain(),
                len = chain.length,
                ret = {},
                i = len - 1;
            while (i >= 0) {
                if (translations.hasOwnProperty(chain[i])) {
                    $.extend(ret, translations[chain[i]]);
                }
                i = i - 1;
            }
            return ret;
        }());

        /**
         * Set a Storage to postpone merge and deletion
         */
        function mergePending(pageName) {
            mw.storage.set('history-merge-pending-pagename', pageName);
            mw.notify($.parseHTML(messages.mergePendingNotification));
        }

        /**
         * ...and reset this Storage
         */
        function removePending() {
            mw.storage.remove('history-merge-pending-pagename');
        }

        /**
         * Copy target page content to source page
         */
        function copyTarget(from, to) {
            return api.edit(from, function() {
                return {
                    text: '{{subst:msgnw:' + to + '}}',
                    summary: '準備進行合併歷史',
                    nocreate: true,
                    minor: true
                };
            });
        }

        /**
         * Delete target page
         */
        function deleteTarget(to) {
            return api.postWithEditToken({
                action: 'delete',
                title: to,
                reason: '刪除以便移動'
            });
        }

        /**
         * Move source page to target page
         */
        function moveSource(from, to, summary, movetalk, redirect) {
            var data = {
                action: 'move',
                from: from,
                to: to,
                reason: summary
            };
            if (movetalk) {
                data.movetalk = 1;
            }
            if (!redirect) {
                data.noredirect = 1;
            }
            return api.postWithEditToken(data);
        }

        /**
         * Undelete target page
         */
        function undeleteTarget(to, revids) {
            return api.postWithEditToken({
                action: 'undelete',
                title: to,
                timestamps: revids,
                reason: '合併歷史'
            });
        }

        /**
         * @class Merger
         * @mixins OO.EventEmitter
         *
         * @constructor
         */
        function Merger(mergeSourcePagename, mergeSummary, mergeLeaveRedirect, mergeKeepTargetContent, loadMergeDestination) {
            OO.EventEmitter.call(this);
            this.mergeSourcePagename = mergeSourcePagename;
            this.mergeSummary = mergeSummary;
            if (/^\w/.test(this.mergeSummary)) {
                this.mergeSummary = ' ' + this.mergeSummary;
            }
            this.mergeLeaveRedirect = mergeLeaveRedirect;
            this.mergeKeepTargetContent = mergeKeepTargetContent;
            this.loadMergeDestination = loadMergeDestination;
        }
        OO.mixinClass(Merger, OO.EventEmitter);

        /**
         * Merge process
         */
        Merger.prototype.merger = function(from, to) {
            var self = this;

            self.emit('progress', messages.mergeWithInput + ' ' + from);

            var revids = '';
            var deferred = api.get({
                action: 'query',
                prop: 'revisions',
                rvprop: ['timestamps'],
                rvlimit: 'max',
                titles: to,
                formatversion: '2'
            }).then(function(data) {
                revids = $.map(data.query.pages[0].revisions, function(e, _) {
                    return e.revid;
                }).join("|");
                return $.Deferred().resolve();
            });

            if (self.mergeKeepTargetContent) {
                deferred = deferred.then(function() {
                    self.emit('progress', messages.copyTargetContent);
                    return copyTarget(from, to);
                });
            }

            deferred = deferred.then(function() {
                self.emit('progress', messages.deleteTarget);
                return deleteTarget(to);
            });

            deferred = deferred.then(function() {
                self.emit('progress', messages.moveSource);
                return moveSource(from, to, self.mergeSummary, self.moveTalk, self.leaveRedirect);
            });

            deferred = deferred.then(function() {
                self.emit('progress', messages.undeleteTarget);
                return undeleteTarget(to, revids);
            });

            deferred.then(function() {
                if (self.loadMergeDestination) {
                    self.emit('progress', messages.loadingMergeDestination);
                    window.location = mw.util.getUrl(to);
                } else {
                    self.emit('success');
                }
            }, function(code, result) {
                self.emit('error', result.error.extradata[0] || result.error.info);
            });
        };

        /**
         * Merge button action, pre-merge checks
         */
        Merger.prototype.merge = function() {
            var self = this;

            self.merger(self.mergeSourcePagename, targetPageName);
        };

        /**
         * @class MergeDialog
         * @extends OO.ui.ProcessDialog
         *
         * @constructor
         * @param {Object} config Configuration options
         * @cfg {string} sourcePageName Page name
         */
        function MergeDialog(config) {
            MergeDialog.parent.call(this, config);
            this.sourcePageName = config.sourcePageName;
        }
        OO.inheritClass(MergeDialog, OO.ui.ProcessDialog);

        MergeDialog.static.name = 'mergeDialog';
        MergeDialog.static.title = messages.mergeWizard;
        MergeDialog.static.size = 'medium';
        MergeDialog.static.actions = [
            {
                action: 'postpone',
                label: messages.postpone,
                title: messages.postponeTitle,
                flags: 'progressive'
            },
            {
                action: 'merge',
                label: messages.merge,
                title: messages.mergeProcess,
                flags: ['primary', 'constructive']
            },
            {
                action: 'cancel',
                label: mw.msg('ooui-dialog-message-reject'),
                flags: 'safe'
            }
        ];

        /**
         * @inheritdoc
         */
        MergeDialog.prototype.initialize = function() {
            MergeDialog.parent.prototype.initialize.apply(this, arguments);
            var fieldset = new OO.ui.FieldsetLayout({});
            this.mergeSourcePagename = new OO.ui.TextInputWidget({
                value: this.sourcePageName
            });
            fieldset.addItems([
                new OO.ui.FieldLayout(
                    this.mergeSourcePagename,
                    {
                        align: 'left',
                        label: messages.mergeWithInput
                    }
                )
            ]);
            fieldset.$element.append($('<span>', {
                id: 'history-merge-input-validation-message',
                style: 'color: red;'
            }));
            this.mergeSummary = new OO.ui.TextInputWidget({
                value: mw.storage.get('history-merge-summary')
            });
            fieldset.addItems([
                new OO.ui.FieldLayout(
                    this.mergeSummary,
                    {
                        align: 'left',
                        label: messages.mergeSummary
                    }
                )
            ]);
            this.mergeKeepTargetContent = new OO.ui.CheckboxInputWidget({
                selected: mw.storage.get('history-merge-keep-target-content') === 'true'
            });
            fieldset.addItems([
                new OO.ui.FieldLayout(
                    this.mergeKeepTargetContent,
                    {
                        align: 'inline',
                        label: messages.mergeKeepTargetContent
                    }
                )
            ]);
            this.mergeMoveTalk = new OO.ui.CheckboxInputWidget({
                selected: mw.storage.get('history-merge-move-talk') === 'true'
            });
            fieldset.addItems([
                new OO.ui.FieldLayout(
                    this.mergeMoveTalk,
                    {
                        align: 'inline',
                        label: messages.moveTalk
                    }
                )
            ]);
            this.mergeLeaveRedirect = new OO.ui.CheckboxInputWidget({
                selected: mw.storage.get('history-merge-leave-redirect') === 'true'
            });
            fieldset.addItems([
                new OO.ui.FieldLayout(
                    this.mergeLeaveRedirect,
                    {
                        align: 'inline',
                        label: messages.leaveRedirect
                    }
                )
            ]);
            this.loadMergeDestination = new OO.ui.CheckboxInputWidget({
                selected: mw.storage.get('history-merge-load-destination') === 'true'
            });
            fieldset.addItems([
                new OO.ui.FieldLayout(
                    this.loadMergeDestination,
                    {
                        align: 'inline',
                        label: messages.loadMergeDestination
                    }
                )
            ]);
            var content = new OO.ui.PanelLayout({
                padded: true,
                expanded: false
            });
            content.$element.append(fieldset.$element);
            this.$body.append(content.$element);
            var self = this;
            this.actions.once('add', function() {
                self.actions.setAbilities({ postpone: self.sourcePageName === '' });
            });
            this.$element.prop('lang', $('html').prop('lang'));
        };

        /**
         * @inheritdoc
         */
        MergeDialog.prototype.getReadyProcess = function(data) {
            return MergeDialog.parent.prototype.getReadyProcess.call(this, data)
                .next(function() {
                    // focus "Merge with" field:
                    // https://www.wikidata.org/wiki/?oldid=333747825#Request:_Improvements_for_keyboard_navigation
                    this.mergeSourcePagename.focus();
                }, this);
        };

        /**
         * Save options in storage
         */
        MergeDialog.prototype.saveOptions = function() {
            mw.storage.set('history-merge-summary', this.mergeSummary.getValue());
            mw.storage.set('history-merge-keep-target-content', this.mergeKeepTargetContent.isSelected());
            mw.storage.set('history-merge-move-talk', this.mergeMoveTalk.isSelected());
            mw.storage.set('history-merge-leave-redirect', this.mergeLeaveRedirect.isSelected());
            mw.storage.set('history-merge-load-destination', this.loadMergeDestination.isSelected());
        };

        MergeDialog.prototype.merge = function() {
            var self = this;
            this.saveOptions();
            removePending();
            var merger = new Merger(
                this.mergeSourcePagename.getValue(),
                this.mergeSummary.getValue(),
                this.mergeLeaveRedirect.isSelected(),
                this.mergeKeepTargetContent.isSelected(),
                this.loadMergeDestination.isSelected()
            );
            merger.on('progress', function() {
                self.displayProgress.apply(self, arguments);
            });
            merger.on('error', function() {
                self.displayError.apply(self, arguments);
            });
            merger.on('success', function() {
                self.close();
                $('#ca-merge-queue-process, #ca-merge, #ca-merge-select').remove();
            });
            merger.merge();
        };

        MergeDialog.prototype.postpone = function() {
            this.saveOptions();
            mergePending(targetPageName);
            this.close();
        };

        MergeDialog.prototype.cancel = function() {
            this.saveOptions();
            removePending();
            this.close();
        };

        /**
         * @inheritdoc
         */
        MergeDialog.prototype.getActionProcess = function(action) {
            if (action === 'merge') {
                return new OO.ui.Process(this.merge, this);
            }
            if (action === 'postpone') {
                return new OO.ui.Process(this.postpone, this);
            }
            if (action === 'cancel') {
                return new OO.ui.Process(this.cancel, this);
            }
            return MergeDialog.parent.prototype.getActionProcess.call(this, action);
        };

        /**
         * Display progress on form dialog
         */
        MergeDialog.prototype.displayProgress = function(message) {
            if (this.$progressMessage) {
                this.$progressMessage.text(message);
                this.updateSize();
                return;
            }
            this.$body.children().hide();
            this.actions.forEach(null, function(action) {
                action.setDisabled(true); // disable buttons
            });
            this.$progressMessage = $('<span>').text(message);
            this.pushPending();
            $('<div>').css({
                'text-align': 'center',
                'margin': '3em 0',
                'font-size': '120%'
            }).append(
                this.$progressMessage
            ).appendTo(this.$body);
            this.updateSize();
        };

        /**
         * Display error on form dialog
         */
        MergeDialog.prototype.displayError = function(error, hideReportLink) {
            var reportLink;
            this.$body.children().hide();
            while (this.isPending()) {
                this.popPending();
            }
            this.actions.forEach(null, function(action) {
                // reenable 'cancel' button, disable all other buttons
                // https://www.wikidata.org/wiki/?oldid=323115101#Close.2FCancel
                action.setDisabled(action.getAction() !== 'cancel');
            });
            if (hideReportLink === true) {
                reportLink = '';
            } else {
                reportLink = '<p>' + messages.reportError.replace(/\[\[(.*)\]\]/, '<a href="//www.wikidata.org/w/index.php?title=MediaWiki_talk:Gadget-Merge.js&action=edit&section=new" target="_blank">$1</a>') + '</p>';
            }
            this.$body.append($('<div>', {
                style: 'color: #990000; margin-top: 0.4em;',
                html: '<p>' + messages.errorWhile.replace(/\$1/, this.$progressMessage.text()) + ' ' + error + '</p>' + reportLink
            }));
            this.updateSize();
        };

        /**
         * Dialog creator and launcher
         */
        function launchDialog(sourcePageName) {
            if (typeof sourcePageName !== 'string') {
                sourcePageName = '';
            }
            var dialog = new MergeDialog({
                sourcePageName: sourcePageName
            });
            var windowManager = new OO.ui.WindowManager();
            $('body').append(windowManager.$element);
            windowManager.addWindows([dialog]);
            windowManager.openWindow(dialog);
        }

        // Initialization
        if (targetPageName !== null && mw.config.get('wgAction') === 'view') {
            $(window).on('focus storage', function() {
                $('#ca-merge-queue-process').remove();
                if (mw.storage.get('history-merge-pending-pagename') !== null &&
                    mw.storage.get('history-merge-pending-pagename') !== '' &&
                    mw.storage.get('history-merge-pending-pagename') !== targetPageName) {
                    $('#p-views ul')[$(document).prop('dir') === 'rtl' ? 'append' : 'prepend']($('<li>', {
                        id: 'ca-merge-queue-process'
                    }).append($('<a>', {
                        href: '#',
                        title: 'process the postponed merge'
                    }).append($('<img>', {
                        src: '//upload.wikimedia.org/wikipedia/commons/thumb/1/10/Pictogram_voting_merge.svg/26px-Pictogram_voting_merge.svg.png',
                        alt: 'merge icon'
                    }))).click(function(event) {
                        event.preventDefault();
                        launchDialog(mw.storage.get('history-merge-pending-pagename'));
                    }));
                }
            });
            $(function() {
                $('#ca-merge-queue-process, #ca-merge, #ca-merge-select').remove();
                $(mw.util.addPortletLink(
                    'p-tb',
                    '#',
                    messages.mergeWithProgress,
                    'ca-merge',
                    messages.mergeThisPage
                )).click(function(event) {
                    event.preventDefault();
                    launchDialog();
                });

                $(mw.util.addPortletLink(
                    'p-tb',
                    '#',
                    messages.selectForMerging,
                    'ca-merge-select',
                    messages.selectForMergingTitle
                )).click(function(event) {
                    event.preventDefault();
                    mergePending(targetPageName);
                });
            });
        }
    }(jQuery, mediaWiki, OO));

});
