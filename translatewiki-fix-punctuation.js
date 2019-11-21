javascript: (function() {
    wpTextbox1.value = wpTextbox1.value.replace(/ ?\((.+?)\) ?/gi, "（$1）");
    wpTextbox1.value = wpTextbox1.value.replace(/ ?"(.+?)" ?/gi, "「$1」");
    wpTextbox1.value = wpTextbox1.value.replace(/ ?“(.+?)” ?/gi, "「$1」");
    wpTextbox1.value = wpTextbox1.value.replace(/ ?(\$\d+) ?/gi, "$1");
    wpTextbox1.value = wpTextbox1.value.replace(/ ?(\[\[.+?]]) ?/gi, "$1");
    wpSummary.value = "修正標點符號";
}
)();
