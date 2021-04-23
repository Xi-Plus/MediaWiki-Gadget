/**
 * 修改自中文維基百科連結翻譯器 https://zh.wikipedia.org/w/index.php?title=MediaWiki%3AGadget-link-ts.js&oldid=63948978
 */
/* globals wikitextEditor:true */

mw.loader.using(['jquery.ui']).then(function() {
    'use strict';

    var LTUI;
    switch (mw.config.get('wgUserLanguage')) {
        default:
            LTUI = {
                Translate: '翻譯',
                TranslateHelper: '翻譯助手',
                TLTitle: '自動翻譯來自其他語言維基詞典文本',
                Done: '完成',
                NoVE: '翻譯助手不支援視覺化模式，請切換到原始碼模式。',
                EditMessage: 'via 翻譯助手',

                // OPTION
                SelectedTextOnly: '只處理選中文本',
            };
    }

    var LTConf = {
        SelectedTextOnly: 'checked',
    };

    var TEXT = {
        "english": "英語",
        "abbreviation": "縮寫",
        "acronym": "首字母縮略詞",
        "adjective": "形容詞",
        "adverb": "副詞",
        "affix": "綴詞",
        "article": "冠詞",
        "circumfix": "環綴",
        "classifier": "量詞",
        "conjunction": "連詞",
        "counter": "量詞",
        "determiner": "限定詞",
        "diacritical mark": "附加符號",
        "Han character": "漢字",
        "Han tu": "漢字",
        "hanzi": "漢字",
        "hanja": "漢字",
        "idiom": "熟語",
        "infix": "中綴",
        "interfix": "間綴",
        "initialism": "首字母縮略詞",
        "interjection": "感嘆詞",
        "kanji": "漢字",
        "letter": "字母",
        "ligature": "合字",
        "morpheme": "詞素",
        "noun": "名詞",
        "number": "數字",
        "numeral symbol": "數字符號",
        "numeral": "數詞",
        "particle": "助詞",
        "phrase": "短語",
        "postposition": "後置詞",
        "predicative": "表語",
        "prefix": "前綴",
        "preposition": "介詞",
        "prepositional phrase": "介詞短語",
        "pronoun": "代詞",
        "proverb": "諺語",
        "proper noun": "專有名詞",
        "punctuation mark": "標點符號",
        "root": "詞根",
        "stem": "詞幹",
        "suffix": "後綴",
        "syllable": "音節",
        "symbol": "符號",
        "verb": "動詞",
    };

    // variables
    var EXEConf;

    /**
     * 开始进行处理
     */
    var processLinks = function() {
        EXEConf = {
            SelectedTextOnly: $('#linktranslator-selected-text').prop('checked'),
        };

        var wikitext = wikitextEditor.text;
        if (EXEConf.SelectedTextOnly) {
            wikitext = wikitextEditor.selectionText;
        }

        $('#linktranslator').dialog('option', 'position', { my: 'top', at: 'top' });
        $('#linktranslator').html('<div id="linktranslator-progressbar"></div>');
        $('#linktranslator-progressbar').progressbar();

        var newtext = wikitext;
        for (const oldvalue in TEXT) {
            if (Object.hasOwnProperty.call(TEXT, oldvalue)) {
                const newvalue = TEXT[oldvalue];
                newtext = newtext.replace(new RegExp(mw.util.escapeRegExp(oldvalue), 'gi'), newvalue);
            }
        }

        //$('#linktranslator-progressbar').progressbar('value', respcount * 100 / links.length);
        $('#linktranslator-progressbar').progressbar('value', 100);
        $('#linktranslator').prepend('<div id="linktranlator-done"><strong>' + LTUI.Done + '</strong></div>');

        if (EXEConf.SelectedTextOnly) {
            wikitextEditor.selectionText = newtext;
        } else {
            wikitextEditor.text = newtext;
        }
        if (!wikitextEditor.summary) {
            wikitextEditor.summary = LTUI.EditMessage;
        }

        // 針對VE進行Hack
        wikitextEditor.keepSelection = false;
    };

    // clear previous button
    $('#wpLinktranslator').remove();

    var callDialog = function(event) {
        if (event && event.preventDefault) {
            event.preventDefault();
        }
        $('#linktranslator').remove();

        if (wikitextEditor.mode === 'visual') {
            alert(LTUI.NoVE);
            return;
        }

        // 針對VE進行Hack
        wikitextEditor.keepSelection = true;

        if (wikitextEditor.selectionText.length > 0) {
            LTConf.SelectedTextOnly = 'checked';
        } else {
            LTConf.SelectedTextOnly = '';
        }

        $('<div id="linktranslator" title="' + LTUI.TranslateHelper + '">' +
            '<input type="checkbox" id="linktranslator-selected-text" ' + LTConf.SelectedTextOnly + '/> '+
            '<label for="linktranslator-selected-text">' + LTUI.SelectedTextOnly + '</label>'
        ).dialog({
            modal: false,
            close: function() {
            },
            width: 500,
            buttons: [
                {
                    text: LTUI.Translate,
                    click: function() {
                        $('#linktranslator').dialog('option', 'buttons', []);
                        processLinks();
                    }
                }
            ]
        });
    };


    // 設法支援各路編輯器
    mw.hook('editorapi.ready').add(function() {
        if (['wikitext', 'wikEd', 'codemirror'].indexOf(wikitextEditor.mode) !== -1) {
            $('#wpLinktranslator').remove();
            $('#wpLinktranslatorFUCK').remove();
            var FUCKYOU = $('#wpDiffWidget').length > 0;
            if (FUCKYOU) {
                $('#wpDiffWidget').after('<span id="wpLinktranslatorFUCK" aria-disabled="false" class="oo-ui-widget oo-ui-widget-enabled oo-ui-inputWidget oo-ui-buttonElement oo-ui-buttonElement-framed oo-ui-labelElement oo-ui-buttonInputWidget"><input id="wpLinktranslator" value="' + LTUI.TranslateHelper + '" title="' + LTUI.TLTitle + '" type="button" class="oo-ui-inputWidget-input oo-ui-buttonElement-button"/></span>');
            } else {
                $('#wpDiff').after('\n<input id="wpLinktranslator" value="' + LTUI.TranslateHelper + '" title="' + LTUI.TLTitle + '" type="button"/>');
            }
            $('#wpLinktranslator').click(callDialog);
        }
        $('#p-link-ts').remove();
        $(mw.util.addPortletLink('p-cactions', '#', LTUI.TranslateHelper, 'p-link-ts')).click(callDialog);

        try {
            $('#linktranslator').dialog('close');
        } catch (ex) {
            //
        }
    });
    mw.loader.load('https://zh.wikipedia.org/w/index.php?title=MediaWiki:Gadget-EditorAPIs.js&action=raw&ctype=text/javascript');
});
