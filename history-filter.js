/*
 * 修改自 https://zh.wikipedia.org/w/index.php?title=User:WhitePhosphorus/js/rrd.js&oldid=48433837
 */

(function(){

if (mw.config.get('wgAction') !== "history") {
	return;
}

var dialog = null,
	config = {'username': '', 'comment': ''};

function saveconfig(){
	config.username = $('#filterUsername').val();
	config.comment = $('#filterComment').val();
}

function main(){
	var html =
	'<div>' +
	'使用者名稱<br>' +
	'<input type="text" name="username" id="filterUsername" size="40"><br>' +
	'<br>' +
	'編輯摘要<br>' +
	'<input type="text" name="comment" id="filterComment" size="40"><br>' +
	'</div>';
	if (dialog) {
		dialog.html(html).dialog("open");
		$('#filterUsername').val(config.username);
		$('#filterComment').val(config.comment);
		return null;
	}
	dialog = $(html).dialog({
		title: '篩選編輯歷史',
		minWidth: 515,
		minHeight: 150,
		close: saveconfig,
		buttons: [
			{
				text: '篩選',
				click: function() {
					$(this).dialog('close');
					saveconfig();
					filter();
				}
			},
			{
				text: '取消',
				click: function() {
					saveconfig();
					$(this).dialog('close');
				}
			}
		]
	});
}

function filter(){
	var regexUsername = null,
		regexComment = null;
	if (config.username !== '') {
		regexUsername = new RegExp(config.username);
	}
	if (config.comment !== '') {
		regexComment = new RegExp(config.comment);
	}
	$('#pagehistory>li').each(function(i, e){
		if (regexUsername && !$(e).find('.mw-userlink').text().match(regexUsername)) {
			$(e).hide();
			return;
		}
		if (regexComment && !$(e).find('.comment').text().match(regexComment)) {
			$(e).hide();
			return;
		}
		$(e).show();
	});
}

var $filter = $('<button />', {
	'type': 'button',
	'title': '對編輯歷史進行篩選',
	'text': '篩選編輯歷史'
});
$filter.on('click', main);
$(".historysubmit.mw-history-compareselectedversions-button").after($filter);

})();
