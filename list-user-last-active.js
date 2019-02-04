/*
 * 於[[Special:Listusers]]顯示使用者最後編輯時間
 *
 * 修改自 https://zh.wikipedia.org/w/index.php?title=MediaWiki:Gadget-CommentsinLocalTime.js&oldid=48314651
 */


(function() {


	if (mw.config.get('wgCanonicalSpecialPageName') !== "Listusers") {
		return;
	}

	function wgULS(hans, hant, cn, tw, hk, sg, zh, mo, my)
/* 修改自 https://zh.wikipedia.org/w/index.php?title=MediaWiki:Gadget-site-lib.js&oldid=36816755 */ {
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

	function add_leading_zero(number) {
		if (number < 10)
			number = '0' + number;
		return number;
	}

	function adjust_time(time) {
		var today = new Date(), yesterday = new Date(), tomorrow = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		tomorrow.setDate(tomorrow.getDate() + 1);

		// determine the time offset
		var utc_offset = -1 * time.getTimezoneOffset() / 60;
		if (utc_offset >= 0)
			utc_offset = '+' + utc_offset;
		else
			utc_offset = '−' + Math.abs(utc_offset);

		// set the date bits to output
		var year = time.getFullYear(), month = add_leading_zero(time.getMonth() + 1);
		var day = time.getDate();
		var hour = parseInt(time.getHours()), minute = add_leading_zero(time.getMinutes());

		// output am or pm depending on the date and user config settings
		var ampm = hour <= 11 ? ' am' : ' pm';
		if (hour > 12) {
			hour -= 12;
		} else if (hour === 0) {
			hour = 12;
		}

		// return 'today' or 'yesterday' if that is the case
		if (year == today.getFullYear() && month == add_leading_zero(today.getMonth() + 1) && day == today.getDate())
			var date = '今天';
		else if (year == yesterday.getFullYear() && month == add_leading_zero(yesterday.getMonth() + 1) && day == yesterday.getDate())
			var date = '昨天';
		else if (year == tomorrow.getFullYear() && month == add_leading_zero(tomorrow.getMonth() + 1) && day == tomorrow.getDate())
			var date = '明天';
		else {
			// calculate day of week
			var day_names = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
			var day_of_the_week = day_names[time.getDay()];

			// calculate time difference from today and the timestamp
			today = new Date(today.getYear(), today.getMonth(), today.getDate());
			time = new Date(time.getYear(), time.getMonth(), time.getDate());

			var milliseconds_ago = today.getTime() - time.getTime();
			var days_ago = Math.round(milliseconds_ago / 1000 / 60 / 60 / 24);

			var difference, difference_word = '', last = '';
			if (today.valueOf() >= time.valueOf()) {
				difference = new Date(today.valueOf() - time.valueOf());
				difference_word = '前';
				if (days_ago <= 7)
					last = '';
			}
			else {
				difference = new Date(time.valueOf() - today.valueOf());
				difference_word = wgULS('后', '後');
				if (days_ago >= -7)
					last = '下';
			}
			var descriptive_difference = [];

			if (difference.getYear() - 70 > 0) {
				var years_ago = (difference.getYear() - 70) + '年';
				descriptive_difference.push(years_ago);
			}
			if (difference.getMonth() > 0) {
				var months_ago = difference.getMonth() + wgULS('个月', '個月');
				descriptive_difference.push(months_ago);
			}
			if (difference.getDate() > 0) {
				var new_days_ago = difference.getDate() - 1 + '日';
				descriptive_difference.push(new_days_ago);
			}

			descriptive_difference = ' (' + descriptive_difference.join('') + difference_word + ')';

			// format the date according to user preferences
			var formatted_date = '', month_name = convert_number_to_month(time.getMonth()), month = time.getMonth() + 1; // eslint-disable-line no-unused-vars

			formatted_date = year + '年' + add_leading_zero(month) + '月' + add_leading_zero(day) + '日';

			var date = formatted_date + ', ' + last + day_of_the_week + descriptive_difference;
		}

		var time = add_leading_zero(hour) + ':' + minute + ' ' + ampm;

		var return_date = date + ', ' + time + ' (UTC' + utc_offset + ')';

		return return_date;
	}

	function convert_number_to_month(number) {
		var month = new Array('一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月');
		return month[number];
	}

	function check_last_active(name, el) {
		var api = new mw.Api();
		api.get({
			"action": "query",
			"format": "json",
			"list": "usercontribs",
			"uclimit": "1",
			"ucuser": name,
			"ucdir": "older",
			"ucprop": "timestamp"
		}).done(function(data) {
			var message;
			if (data.query.usercontribs[0] === undefined) {
				message = "（從未編輯）";
			} else {
				var date = new Date(data.query.usercontribs[0].timestamp);
				message = "（最後編輯於 " + adjust_time(date) + "）";
			}
			$(el).append(message);
		});
	}

	mw.loader.using(['mediawiki.api'], function() {
		$("#mw-content-text>ul>li").each(function(i, e) {
			check_last_active($(e).find('.mw-userlink>bdi').text(), e);
		});
	});


})();
