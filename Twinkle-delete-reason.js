if (document.all["delete-reason"] !== undefined) {
	var reason = decodeURIComponent(document.all["delete-reason"].innerText);
	console.log(reason);
	reason = reason.replace("孤立页面，比如没有主页面的[[WP:TALK|讨论页]]、指向空页面的[[WP:R|重定向]]等；*</strong>", "");
	reason = reason.replace("；*如该页为讨论页存档，请加入&#123;&#123;[[Template:talkarchive|talkarchive]]&#125;&#125;以彰显", "");
	reason = reason.replace(/；\*\*请考虑复查\[\[Special:WhatLinksHere\/.+?\|链入页面]]/, "");
	reason = reason.replace("；*</strong>请复查历史", "");
	reason = reason.replace("；**模板无链入页面；**请考虑应否移至其他名称", "");
	reason = reason.replace("曾经根据[[WP:AFD|頁面存廢討論]]、[[WP:CV|侵權審核]]或[[WP:FFD|檔案存廢討論]]結果删除後又重新創建的内容，而有關內容與已刪除版本''相同或非常相似''，無論標題是否相同", "曾经根据頁面存廢討論、侵權審核或檔案存廢討論結果删除後又重新創建的内容");
	reason = reason.replace("條目建立時之內容即與其他現有條目內容''完全''相同，且名稱不適合做為其他條目之[[WP:R|重定向]]（不包括拆分、合併、重組後產生之條目，或是引用相關資料之條目）", "條目建立時之內容即與其他現有條目內容完全相同");
	reason = reason.replace(/会在提交5日后刪除；\*<\/strong>致管理员：根据\[\[Wikipedia:非自由内容使用准则\|非自由内容使用准则]]，请于'''\d+年\d+月\d+日'''后删除本文件/, "");
	reason = reason.replace("格式錯誤，或明显笔误的[[WP:R|重定向]]；标题繁简混用", "标题繁简混用");
	reason = reason.replace("格式錯誤，或明显笔误的[[WP:R|重定向]]；消歧义使用的括号或空格错误", "消歧义使用的括号或空格错误");
	reason = reason.replace("（对條目内容无实际修改的除外；提請須出於善意，及附有合理原因）", "");
	reason = reason.replace("（没有条目也没有子类别）", "");
	reason = reason.replace("[[WP:CSD|CSD]]:+", "");
	document.all["delete-reason"].innerText = encodeURIComponent(reason);
	console.log("repalced delete-reason");
}
