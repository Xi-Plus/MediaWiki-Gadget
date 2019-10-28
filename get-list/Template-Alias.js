javascript: (async () => {

    let api = new mw.Api();
    let titles = [];
    let result = '';

    await api.get({
        'action': 'query',
        'format': 'json',
        'prop': 'redirects',
        'titles': mw.config.get('wgPageName')
    }).then(async data => {
        let pageids = mw.config.get('wgArticleId') + '|' + $.map(data.query.pages[mw.config.get('wgArticleId')].redirects, redirect => redirect.pageid).join('|');

        await api.get({
            'action': 'query',
            'format': 'json',
            'prop': 'info',
            'pageids': pageids,
            'inprop': 'varianttitles'
        }).then(data => {
            for (const pageid in data.query.pages) {
                const page = data.query.pages[pageid];
                for (const variant in page.varianttitles) {
                    const title = page.varianttitles[variant].replace(/^[^:]+?:/, '');
                    if (titles.indexOf(title) === -1) {
                        titles.push(title);
                        result += title + '<br>';
                    }
                }
            }
        });
    });

    let regex = '(' + $.map(titles, title => {
        if (title.match(/^[A-Z]/)) {
            title = '[' + title[0] + title[0].toLowerCase() + ']' + title.substr(1);
        }
        title = title.replace(/ /, '[ _]');
        return title;
    }).join('|') + ')';

    let regexci = '(' + $.map(titles, title => {
        title = title.replace(/ /, '[ _]');
        return title;
    }).join('|') + ')';

    result += '<br>Regex:<br>' + regex;
    result += '<br>Regex (case insensitive):<br>' + regexci;

    var win = window.open('');
    win.document.body.innerHTML = result;

}
)();
