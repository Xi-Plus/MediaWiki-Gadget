javascript: (function() {
    wpTextbox1.value = wpTextbox1.value.replace(/(%[A-F0-9]{2}.+\.jpg)/g,
        function(e) {
            return decodeURIComponent(e);
        }
    );
    wpSummary.value = wpSummary.value + " 修復檔案名稱編碼";
    wpDiff.click();
}
)();
