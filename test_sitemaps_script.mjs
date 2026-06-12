import http from 'http';

function checkSitemaps() {
    const domains = [
        'bornerechargeparis.fr',
        'bornerechargeannecy.fr',
        'bornerechargemarseille.fr',
        'bornerechargelyon.fr'
    ];

    domains.forEach(domain => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/sitemap.xml',
            method: 'GET',
            headers: {
                'Host': domain
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const count = (data.match(/<url>/g) || []).length;
                console.log(`[${domain}] Status: ${res.statusCode} | URLs: ${count}`);
                if (res.statusCode !== 200) {
                    console.log(data.substring(0, 200) + '...');
                }
            });
        });

        req.on('error', err => {
            console.error(`Error querying ${domain}:`, err.message);
        });

        req.end();
    });
}

checkSitemaps();
