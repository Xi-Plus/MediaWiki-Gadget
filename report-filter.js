/*global jQuery, mediaWiki, OO*/
/*
 * 在提報頁進行篩選
 */

mw.loader.using(['mediawiki.api', 'mediawiki.util', 'mediawiki.language', 'oojs-ui', 'mediawiki.widgets.UsersMultiselectWidget', 'mediawiki.storage']).done(function() {

    (function($, mw, OO) {
        'use strict';
        var api = new mw.Api();

        /**
         * @class Filter
         * @mixins OO.EventEmitter
         *
         * @constructor
         */
        function Filter() {
            OO.EventEmitter.call(this);

            this.userjskey = 'reportfilter';

            switch (mw.config.get('wgPageName')) {
                case 'Wikipedia:修订版本删除请求':
                    this.page = 'rrd';
                    break;

                case 'Wikipedia:请求保护页面':
                    this.page = 'rfpp';
                    break;

                default:
                    this.page = null;
                    break;
            }
            if (this.page !== null) {
                this.filtertypekey = 'userjs-' + this.userjskey + '-' + this.page + '-filtertype';
                this.usernamekey = 'userjs-' + this.userjskey + '-' + this.page + '-username';

                this.filtertype = mw.user.options.get(this.filtertypekey) || 'off';
                this.username = JSON.parse(mw.user.options.get(this.usernamekey)) || [];

                this.requesterclassdefault = this.userjskey + '-requester-default';
                this.requesterclassuser = this.userjskey + '-requester-';

                this.markClass = false;
                this.cssRule = mw.util.addCSS('');

                this.filter();
            }
        }
        OO.mixinClass(Filter, OO.EventEmitter);

        /**
         * Run filter
         */
        Filter.prototype.filter = function() {
            var self = this;
            if (this.page === null) {
                return;
            }
            if (!this.markClass) {
                switch (this.page) {
                    case 'rrd':
                        this.filteRrd();
                        break;
                    case 'rfpp':
                        this.filteRfpp();
                        break;
                }
                this.markClass = true;
            }
            this.cssRule.disabled = true;
            var rule = '';
            switch (this.filtertype) {
                case 'show':
                    rule += '.' + this.requesterclassdefault + '{display: none;}';
                    this.username.forEach(function(username) {
                        rule += '.' + self.requesterclassuser + username.replace(/ /g, '_') + '{display: inherit;}';
                    });
                    break;

                case 'hide':
                    this.username.forEach(function(username) {
                        rule += '.' + self.requesterclassuser + username.replace(/ /g, '_') + '{display: none;}';
                    });
                    break;
            }
            this.cssRule = mw.util.addCSS(rule);
        };

        /**
         * Filter in RRD
         */
        Filter.prototype.filteRrd = function() {
            var self = this;

            $('.mw-parser-output>div').filter(function(_, el) {
                return $(el).find('a[href*="action=revisiondelete"]').length > 0;
            }).each(function(_, el) {
                var username = null, m;
                $(el).next().find('a').each(function(_, link) {
                    if ((m = link.href.match(/(index\.php\?title=|\/wiki\/)(User:|User_talk:|Special:%E7%94%A8%E6%88%B7%E8%B4%A1%E7%8C%AE\/)([^/&]+?)(&|$)/)) !== null) {
                        username = decodeURIComponent(m[3]);
                        return false;
                    }
                });
                if (username === null) {
                    return;
                }

                var requesterclassuser = self.requesterclassuser + username.replace(/ /g, '_');

                el.classList.add(self.requesterclassdefault);
                el.classList.add(requesterclassuser);
                let now = $(el).next()[0];
                while (now !== undefined && now.tagName !== 'DIV') {
                    now.classList.add(self.requesterclassdefault);
                    now.classList.add(requesterclassuser);
                    now = $(now).next()[0];
                }
            });
        }

        /**
         * Filter in RFPP
         */
        Filter.prototype.filteRfpp = function() {
            var self = this;

            $('.mw-parser-output>h3').each(function(_, el) {
                var username = null, m;
                $($(el).next().find('a').get().reverse()).each(function(_, link) {
                    if ((m = link.href.match(/(index\.php\?title=|\/wiki\/)(User:|User_talk:|Special:%E7%94%A8%E6%88%B7%E8%B4%A1%E7%8C%AE\/)([^/&]+?)(&|$)/)) !== null) {
                        username = decodeURIComponent(m[3]);
                        return false;
                    }
                });
                if (username === null) {
                    return;
                }

                var requesterclassuser = self.requesterclassuser + username.replace(/ /g, '_');

                el.classList.add(self.requesterclassdefault);
                el.classList.add(requesterclassuser);
                let now = $(el).next()[0];
                while (now !== undefined && $.inArray(now.tagName, ['H2', 'H3']) === -1) {
                    now.classList.add(self.requesterclassdefault);
                    now.classList.add(requesterclassuser);
                    now = $(now).next()[0];
                }
            });
        }

        /**
         * @class FilterDialog
         * @extends OO.ui.ProcessDialog
         *
         * @constructor
         * @param Filter filter
         */
        function FilterDialog(filter) {
            FilterDialog.parent.call(this);
            this.filter = filter;
        }
        OO.inheritClass(FilterDialog, OO.ui.ProcessDialog);

        FilterDialog.static.name = 'FilterDialog';
        FilterDialog.static.title = '篩選提報';
        FilterDialog.static.size = 'medium';
        FilterDialog.static.actions = [
            {
                action: 'save',
                label: '篩選',
                title: '篩選',
                flags: ['primary', 'constructive']
            },
        ];

        /**
         * @inheritdoc
         */
        FilterDialog.prototype.initialize = function() {
            FilterDialog.parent.prototype.initialize.apply(this, arguments);
            var fieldset = new OO.ui.FieldsetLayout({});

            this.filtertypeWidget = new OO.ui.RadioSelectWidget({
                items: [
                    new OO.ui.RadioOptionWidget({
                        data: 'off',
                        label: '不啟用'
                    }),
                    new OO.ui.RadioOptionWidget({
                        data: 'show',
                        label: '僅顯示'
                    }),
                    new OO.ui.RadioOptionWidget({
                        data: 'hide',
                        label: '隱藏'
                    })
                ]
            })
            this.filtertypeWidget.selectItemByData(filter.filtertype);
            fieldset.addItems([
                new OO.ui.FieldLayout(
                    this.filtertypeWidget,
                    {
                        align: 'top',
                        label: '顯示選項'
                    }
                )
            ]);

            this.usernameWidget = new mw.widgets.UsersMultiselectWidget({
                selected: filter.username
            });
            fieldset.addItems([
                new OO.ui.FieldLayout(
                    this.usernameWidget,
                    {
                        align: 'top',
                        label: '用戶名'
                    }
                )
            ]);

            var content = new OO.ui.PanelLayout({
                padded: true,
                expanded: false
            });
            content.$element.append(fieldset.$element);
            this.$body.append(content.$element);
            this.$element.prop('lang', $('html').prop('lang'));
        };

        /**
         * @inheritdoc
         */
        FilterDialog.prototype.getReadyProcess = function(data) {
            return FilterDialog.parent.prototype.getReadyProcess.call(this, data);
        };

        /**
         * Save options in user options
         */
        FilterDialog.prototype.saveOptions = function() {
            var options = {};

            options[this.filter.filtertypekey] = this.filtertypeWidget.findSelectedItem().getData();
            this.filter.filtertype = this.filtertypeWidget.findSelectedItem().getData();

            options[this.filter.usernamekey] = JSON.stringify(this.usernameWidget.getValue());
            this.filter.username = this.usernameWidget.getValue();

            api.saveOptions(options);
        };

        FilterDialog.prototype.save = function() {
            this.saveOptions();

            this.filter.filter();
            this.close();
        };

        /**
         * @inheritdoc
         */
        FilterDialog.prototype.getActionProcess = function(action) {
            if (action === 'save') {
                return new OO.ui.Process(this.save, this);
            }
            return FilterDialog.parent.prototype.getActionProcess.call(this, action);
        };

        /**
         * Dialog creator and launcher
         */
        function launchDialog(filter) {
            var dialog = new FilterDialog(filter);
            var windowManager = new OO.ui.WindowManager();
            $('body').append(windowManager.$element);
            windowManager.addWindows([dialog]);
            windowManager.openWindow(dialog);
        }

        // Initialization
        if (mw.config.get('wgAction') === 'view') {
            var filter = new Filter();

            if (filter.page !== null) {
                $(mw.util.addPortletLink(
                    'p-cactions',
                    '#',
                    '篩選提報',
                    'rf-filter',
                    '點擊以篩選提報'
                )).click(function(event) {
                    event.preventDefault();
                    launchDialog(filter);
                });
            }
        }

    }(jQuery, mediaWiki, OO));

});
