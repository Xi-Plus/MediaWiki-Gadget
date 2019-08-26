javascript:
(function() {

    var myPrefix = wpTextbox1.value.substring(0, wpTextbox1.selectionStart);
    var Selected = wpTextbox1.value.substring(wpTextbox1.selectionStart, wpTextbox1.selectionEnd);
    var mySuffix = wpTextbox1.value.substring(wpTextbox1.selectionEnd);

    wpTextbox1.value = myPrefix + '<translate>' + Selected + '</translate>' + mySuffix;

})();
