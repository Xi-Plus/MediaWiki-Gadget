javascript: (function() {
    wpTextbox1.value = wpTextbox1.value.replace(/ ?\((.+?)\) ?/i, "（$1）");
    wpTextbox1.value = wpTextbox1.value.replace(/ ?"(.+?)" ?/i, "「$1」");
    wpSummary.value = "修正標點符號";
}
)();
