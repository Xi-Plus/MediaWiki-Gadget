// <nowiki>
(function() {

    function patrol() { // eslint-disable-line no-unused-vars
        let btnid = this.getAttribute('data-btnid');
        let revid = this.getAttribute('data-revid');
        $.ajax({
            type: 'POST',
            url: location.protocol + mw.config.get('wgServer') + mw.config.get('wgScriptPath') + '/api.php',
            data: {
                'action': 'patrol',
                'format': 'json',
                'revid': revid,
                'token': mw.user.tokens.get('patrolToken'),
            },
            success: function success(data) {
                if (data.error !== undefined) {
                    document.all["patrol_" + btnid].innerHTML = "API失敗：" + data.error.info;
                    document.all["patrol_" + btnid].style.color = "#F00";
                } else {
                    document.all["patrol_" + btnid].innerHTML = "已巡查";
                    document.all["patrol_" + btnid].style["pointer-events"] = "none";
                    document.all["patrol_" + btnid].style.color = "#888";
                }
            },
            error: function error() {
                document.all["patrol_" + btnid].innerHTML = "Ajax失敗";
                document.all["patrol_" + btnid].style.color = "#F00";
            },
        });
    }

    function partolall() { // eslint-disable-line no-unused-vars
        if (!confirm("確定巡查全部" + document.getElementsByClassName("not-patrolled").length + "個？"))
            return;
        for (var i = 0; i < document.getElementsByClassName("not-patrolled").length; i++) {
            if (document.all["patrol_" + i].style["pointer-events"] != "none") {
                document.all["patrol_" + i].click();
            }
        }
    }

    if (mw.config.get('wgCanonicalSpecialPageName') === "Newpages") {
        for (var i = 0; i < document.getElementsByClassName("not-patrolled").length; i++) {
            let patrolbtn = $('<a id="patrol_' + i + '" data-btnid="' + i + '" data-revid="' + document.getElementsByClassName("not-patrolled")[i].children[0].href.match(/oldid=(\d+)/)[1] + '">巡查</a>');
            patrolbtn.on('click', patrol);
            patrolbtn.appendTo(document.getElementsByClassName("not-patrolled")[i]);
        }
        for (var i = 0; ; i++) {
            if (document.all["mw-content-text"].children[i] === undefined) {
                break;
            } else if (document.all["mw-content-text"].children[i].tagName === "UL") {
                let patrolbtn = $('<li><a id="patrol_all">巡查全部</a></li>');
                patrolbtn.on('click', partolall);
                patrolbtn.appendTo(document.all["mw-content-text"].children[i]);
            }
        }
    }

}
)();
// </nowiki>
