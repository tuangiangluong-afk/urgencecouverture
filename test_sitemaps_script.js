import http from 'http';

function checkSitemaps() {
    const urls = [
        'http://bornerechargeparis.fr:3000/sitemap.xml',
        'http://bornerechargeannecy.fr:3000/sitemap.xml',
        'http://bornerechargemarseille.fr:3000/sitemap.xml',
    ];

    urls.forEach(url => {
        http.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const count = (data.match(/<url>/g) || []).length;
                console.log(`[${url}] Status: ${res.statusCode} | URLs: ${count}`);
                if (res.statusCode !== 200) {
                    console.log(data);
                }
            });
        }).on('error', err => {
            console.error(`Error querying ${url}:`, err.message);
        });
    });
}

checkSitemaps();
