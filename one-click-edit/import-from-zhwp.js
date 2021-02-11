javascript: (function() {

    var interwikipage = mw.config.get('wgCanonicalNamespace') + ':' + mw.config.get('wgTitle');
    if (interwikipage === null) {
        mw.notify('未能抓取頁面名稱');
        return;
    }

    var namespace = mw.config.get('wgNamespaceNumber');
    if (namespace === null) {
        mw.notify('未能抓取頁面命名空間');
        return;
    }

    var interwikisource = 'w';

    if (!confirm('要匯入 ' + interwikisource + ':' + interwikipage + ' 至本頁（ns=' + namespace + '）？')) {
        return;
    }

    new mw.Api().postWithEditToken({
        action: 'import',
        interwikisource: interwikisource,
        interwikipage: interwikipage,
        namespace: namespace,
        fullhistory: false,
        templates: false,
        assignknownusers: false,
    }).then(function(e) {
        if (e.import.length === 0) {
            mw.notify('沒有匯入任何頁面');
        } else {
            for (var i = 0; i < e.import.length; i++) {
                mw.notify('成功匯入 ' + e.import[i].title + ' ' + e.import[i].revisions + ' 個版本');
            }
        }
    }, function(e) {
        mw.notify('未知錯誤：' + e);
    });

}
)();
