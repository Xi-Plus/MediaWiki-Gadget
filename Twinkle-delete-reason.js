if (document.all["delete-reason"] !== undefined) {
	var reason = decodeURIComponent(document.all["delete-reason"].innerText);
	console.log(reason);
	reason = reason.replace("孤立页面，比如没有主页面的[[WP:TALK|讨论页]]、指向空页面的[[WP:R|重定向]]等；*</strong>", "");
	reason = reason.replace("；*如该页为讨论页存档，请加入&#123;&#123;[[Template:talkarchive|talkarchive]]&#125;&#125;以彰显", "");
	reason = reason.replace("；**请考虑复查[[Special:WhatLinksHere/Portal:Animals/Categories|链入页面]]", "");
	reason = reason.replace("曾经根据[[WP:AFD|頁面存廢討論]]、[[WP:CV|侵權審核]]或[[WP:FFD|檔案存廢討論]]結果删除後又重新創建的内容，而有關內容與已刪除版本''相同或非常相似''，無論標題是否相同", "曾经根据頁面存廢討論、侵權審核或檔案存廢討論結果删除後又重新創建的内容");
	reason = reason.replace("條目建立時之內容即與其他現有條目內容''完全''相同，且名稱不適合做為其他條目之[[WP:R|重定向]]（不包括拆分、合併、重組後產生之條目，或是引用相關資料之條目）", "條目建立時之內容即與其他現有條目內容完全相同");
	reason = reason.replace("[[WP:CSD|CSD]]:+", "");
	document.all["delete-reason"].innerText = encodeURIComponent(reason);
	console.log("repalced delete-reason");
}
