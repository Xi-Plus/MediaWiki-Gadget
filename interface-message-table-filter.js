for (let index = 0; index < $("#interface-message-table")[0].children[0].children.length; index++) {
	const element = $("#interface-message-table")[0].children[0].children[index];
	const link = $(element.children[0]).find('a');
	if (link.length && !link[0].classList.contains('new')) {
		$(element).css('display', 'none');
	}
}
