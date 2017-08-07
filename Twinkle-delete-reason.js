if (document.all["delete-reason"] !== undefined) {
	var reason = decodeURIComponent(document.all["delete-reason"].innerText);
	switch(reason) {
		case "[[WP:CSD#G15|G15]]:+孤立页面，比如没有主页面的[[WP:TALK|讨论页]]、指向空页面的[[WP:R|重定向]]等；*</strong>指向不存在页面的重定向。":
			reason = "[[WP:CSD#G15|G15]]:+指向不存在页面的重定向。";
			break;
		case "[[WP:CSD#G15|G15]]:+孤立页面，比如没有主页面的[[WP:TALK|讨论页]]、指向空页面的[[WP:R|重定向]]等；*</strong>没有对应内容页面的讨论页；*如该页为讨论页存档，请加入&#123;&#123;[[Template:talkarchive|talkarchive]]&#125;&#125;以彰显。":
			reason = "[[WP:CSD#G15|G15]]:+没有对应内容页面的讨论页。";
			break;
	}
	reason = reason.replace("[[WP:CSD|CSD]]:+", "");
	document.all["delete-reason"].innerText = encodeURIComponent(reason);
	console.log("repalced delete-reason");
}
