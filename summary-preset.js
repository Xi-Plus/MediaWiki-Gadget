/*
 * 使用說明請見 https://zh.wikipedia.org/wiki/User:Xiplus/js/summary-preset
 */

(function(){

if (mw.config.get('wgAction') !== "edit") {
	return;
}

if (typeof(SummaryPreset) == 'undefined')
	SummaryPreset = {};

if (typeof(SummaryPreset.add) == 'undefined') {
	SummaryPreset.add = [];
}

if (typeof(SummaryPreset.remove) == 'undefined') {
	SummaryPreset.remove = [];
}

if (typeof(SummaryPreset.clear) == 'undefined') {
	SummaryPreset.clear = false;
}

function AddSummaryPreset(summary, display) {
	if (display === undefined) {
		$('.mw-summary-preset').append('<span class="mw-summary-preset-item"><a href="#.">' + summary + '</a></span>')
	} else {
		$('.mw-summary-preset').append('<span class="mw-summary-preset-item" title="' + summary + '"><a href="#.">' + display + '</a></span>')
	}
}

function RemoveSummaryPreset(summary) {
	$('.mw-summary-preset-item').each(function(i, e){
		if ($(e).attr('title') == summary) {
			$(e).remove();
		} else if ($(e).attr('title') === undefined && $(e).children("a").text() == summary) {
			$(e).remove();
		}
	});
}

if (SummaryPreset.clear) {
	$('.mw-summary-preset-item').empty()
}

for (var i = 0; i < SummaryPreset.add.length; i++) {
	if (typeof SummaryPreset.add[i] == 'string') {
		AddSummaryPreset(SummaryPreset.add[i]);
	} else if (typeof SummaryPreset.add[i] == 'object') {
		if (SummaryPreset.add[i].length == 1) {
			AddSummaryPreset(SummaryPreset.add[i][0]);
		} else if (SummaryPreset.add[i].length >= 2) {
			AddSummaryPreset(SummaryPreset.add[i][0], SummaryPreset.add[i][1]);
		}
	}
}

for (var i = 0; i < SummaryPreset.remove.length; i++) {
	RemoveSummaryPreset(SummaryPreset.remove[i]);
}

})();
