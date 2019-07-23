javascript: (function() {

	var minDate = new Date('2099/12/31');
	var maxDate = new Date('1970/01/01');
	var text = '';
	var preDate = null;

	function zeroPad(num) {
		if (num < 10) num = '0' + num;
		return num;
	}

	var text2 = '';
	$($('ul#pagehistory>li').get().reverse()).each(function(i, el) {
		var datestr = $(el).find('a.mw-changeslist-date').text();
		var cnt = $(el).find('span.comment').text().replace(/^.+中的(\d+)个积压投票$/, '$1');
		if (cnt.match(/^\d+$/) === null) {
			return;
		}
		var m = datestr.match(/(\d+)年(\d+)月(\d+)日/);
		var year = m[1];
		var month = m[2];
		var date = m[3];
		var dat = new Date(year + '/' + month + '/' + date);
		if (dat < minDate) {
			minDate = dat;
		}
		if (dat > maxDate) {
			maxDate = dat;
		}
		if (preDate == null) {
			preDate = dat;
			return;
		}
		var html = '&nbsp;&nbsp;from:' + zeroPad(preDate.getDate()) + '/' + zeroPad(preDate.getMonth() + 1) + '/' + preDate.getFullYear() + ' till:' + zeroPad(date) + '/' + zeroPad(month) + '/' + year + ' atpos:' + Math.round(cnt / 2) + ' color:red';
		text2 += html + '<br>';
		preDate = dat;
	});

	var text = '{{NOINDEX}}__NOTOC__<br>';
	text += '&lt;timeline&gt;<br>';
	text += 'ImageSize  = width:900 height:500<br>';
	text += 'PlotArea   = left:35 right:10 top:10 bottom:20 <br>';
	text += 'TimeAxis   = orientation:horizontal<br>';
	text += 'AlignBars  = justify<br>';
	text += 'Colors =<br>';
	text += '&nbsp; id:gray1 value:gray(0.3) <br>';
	text += '&nbsp; id:gray2 value:gray(0.5) <br>';
	text += '&nbsp; id:gray3 value:gray(0.7) <br>';
	text += '&nbsp; id:major       value:black<br>';
	text += '&nbsp; id:minor       value:rgb(0.8,0.8,0.8)<br>';
	text += 'Dateformat = dd/mm/yyyy<br>';
	text += 'Period = from:' + zeroPad(minDate.getDate()) + '/' + zeroPad(minDate.getMonth() + 1) + '/' + minDate.getFullYear() + ' till:' + zeroPad(maxDate.getDate()) + '/' + zeroPad(maxDate.getMonth() + 1) + '/' + maxDate.getFullYear() + '<br>';
	text += 'ScaleMajor = grid:major unit:day increment:7 start:' + zeroPad(minDate.getDate()) + '/' + zeroPad(minDate.getMonth() + 1) + '/' + minDate.getFullYear() + '<br>';
	text += 'ScaleMinor = grid:minor unit:day increment:1 start:' + zeroPad(minDate.getDate()) + '/' + zeroPad(minDate.getMonth() + 1) + '/' + minDate.getFullYear() + '<br>';
	text += 'PlotData =<br>';
	text += '&nbsp; bar:1000 color:gray2 width:1<br>';
	text += '&nbsp; from:start till:end<br>';
	text += '&nbsp; bar:900 color:gray2<br>';
	text += '&nbsp; from:start till:end <br>';
	text += '&nbsp; bar:800 color:gray2<br>';
	text += '&nbsp; from:start till:end <br>';
	text += '&nbsp; bar:700 color:gray2<br>';
	text += '&nbsp; from:start till:end <br>';
	text += '&nbsp; bar:600 color:gray2<br>';
	text += '&nbsp; from:start till:end <br>';
	text += '&nbsp; bar:500 color:gray2<br>';
	text += '&nbsp; from:start till:end <br>';
	text += '&nbsp; bar:400 color:gray2<br>';
	text += '&nbsp; from:start till:end <br>';
	text += '&nbsp; bar:300 color:gray2<br>';
	text += '&nbsp; from:start till:end <br>';
	text += '&nbsp; bar:200 color:gray2<br>';
	text += '&nbsp; from:start till:end<br>';
	text += '&nbsp; bar:100 color:gray2<br>';
	text += '&nbsp; from:start till:end <br>';
	text += '&nbsp; bar:0 color:gray2<br>';
	text += '&nbsp; from:start till:end<br>';
	text += 'LineData =<br>';
	text += text2;
	text += '&lt;/timeline&gt;<br>';

	var win = window.open("");
	win.document.body.innerHTML = text;

}
)();
