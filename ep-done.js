javascript: (function() {
    wpTextbox1.value = wpTextbox1.value.replace(/<!-- 在下一行填写你的理由\/在下一行填寫你的理由 -->\n?/, "").replace(/<!-- 以下文字请勿变更\/以下文字請勿變更 -->\n?/, "");
    if (confirm("Done?")) {
        wpTextbox1.value = wpTextbox1.value.replace(/\n*{{((?:Editprotected|EP)(?:\|.*?)?)}}\s*/i, "\n{{$1|ok=1|sign=--~~~~}}\n\n");
        wpSummary.value = wpSummary.value + " EP done";
    } else {
        wpTextbox1.value = wpTextbox1.value.replace(/\n*{{((?:Editprotected|EP)(?:\|.*?)?)}}\s*/i, "\n{{$1|no=1|sign=--~~~~}}\n\n");
        wpSummary.value = wpSummary.value + " EP not done";
    }
    if (confirm("Save?")) {
        wpSave.click();
    }
}
)();
