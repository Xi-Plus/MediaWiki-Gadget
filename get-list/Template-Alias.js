javascript: (async () => {

    let api = new mw.Api();
    let titles = [];
    let result = '';

    await api.get({
        'action': 'query',
        'format': 'json',
        'prop': 'redirects',
        'titles': mw.config.get('wgPageName'),
        'rdlimit': 'max',
        'formatversion': '2',
    }).then(async data => {
        let redirects = mw.config.get('wgPageName') + '|' + $.map(data.query.pages[0].redirects || [], redirect => redirect.title).join('|');
        redirects = redirects.replace(/\|$/, '');

        await api.get({
            'action': 'query',
            'format': 'json',
            'prop': 'info',
            'titles': redirects,
            'inprop': 'varianttitles',
            'formatversion': '2',
        }).then(data => {
            data.query.pages.forEach(page => {
                for (const variant in page.varianttitles) {
                    const title = page.varianttitles[variant].replace(/^[^:]+?:/, '');
                    if (titles.indexOf(title) === -1) {
                        titles.push(title);
                        result += title + '<br>';
                    }
                }
            });
        });
    });

    let regex = '(' + $.map(titles, title => {
        if (title.match(/^[A-Z]/)) {
            title = '[' + title[0] + title[0].toLowerCase() + ']' + title.substr(1);
        }
        title = title.replace(/ /, '[ _]+');
        return title;
    }).join('|') + ')';

    let regexcilist = [];
    let checkdup = [];
    titles.forEach(title => {
        if (checkdup.indexOf(title.toLowerCase()) !== -1) {
            return;
        }
        checkdup.push(title.toLowerCase());
        regexcilist.push(title.replace(/ /, '[ _]+'));
    });

    let regexci = '(' + regexcilist.join('|') + ')';
    let compre = '{{[\\s_]*';
    let templateprefix = '(Template|T|样板|模板|樣板)?[\\s_]*:?[\\s_]*';

    result += '<br>Simple Regex:<br>' + regexci + '<br>';
    result += '<br>Simple Regex (case sensitive):<br>' + regex + '<br>';

    result += '<br>Regex:<br>' + compre + regexci + '<br>';
    result += '<br>Regex (case sensitive):<br>' + compre + regex + '<br>';

    result += '<br>Regex with namespace:<br>' + compre + templateprefix + regexci + '<br>';
    result += '<br>Regex with namespace (case sensitive):<br>' + compre + templateprefix + regex + '<br>';

    var win = window.open('');
    win.document.body.innerHTML = result;

}
)();
