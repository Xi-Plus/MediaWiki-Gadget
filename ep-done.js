javascript: (function() {
    wpTextbox1.value = wpTextbox1.value.replace(/<!-- 在下一行填写你的理由\/在下一行填寫你的理由 -->\n?/, "").replace(/<!-- 以下文字请勿变更\/以下文字請勿變更 -->\n?/, "");
    var repalcement = "\n{{$1";
    if (confirm("Done?")) {
        repalcement += "|ok=1";
        wpSummary.value = wpSummary.value + " EP done";
    } else {
        repalcement += "|no=1";
        wpSummary.value = wpSummary.value + " EP not done";
    }
    if (confirm("Sign?")) {
        repalcement += "|sign=--~~~~";
    }
    repalcement += "}}\n\n";
    wpTextbox1.value = wpTextbox1.value.replace(/\n*{{((?:Editprotected|EP)(?:\|.*?)?)}}\s*/i, repalcement);
    if (confirm("Save?")) {
        wpSave.click();
    }
}
)();
