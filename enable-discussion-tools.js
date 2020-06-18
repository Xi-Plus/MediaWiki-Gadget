/* eslint-disable no-console */
// <nowiki>
(function() {

    $('a').each(function(i, e) {
        try {
            var url = new URL(e.href);
            if (url.host.match(/\.(wikipedia|wiktionary|wikiquote|wikisource|wikinews|wikivoyage|wikibooks|wikiversity|wikimedia|mediawiki|wikidata)\.org$/)) {
                url.searchParams.set('dtenable', '1');
                e.href = url.href;
            }
        } catch (err) {
            console.log(e.href);
        }
    });

}
)();
// </nowiki>
