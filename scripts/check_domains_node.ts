import dns from 'dns/promises';

const domains = [
  "bornerechargeparis.fr",
  "bornerechargemarseille.fr",
  "bornerechargeneuilly.fr",
  "bornerechargelyon.fr",
  "bornerechargeboulogne.fr",
  "bornerechargebordeaux.fr",
  "bornerechargetoulouse.fr",
  "bornerechargeannecy.fr",
  "bornerechargestgermain.fr",
  "bornerechargenice.fr",
  "bornerechargenantes.fr",
  "bornerechargeaix.fr",
  "bornerechargestrasbourg.fr",
  "bornerechargelille.fr",
  "bornerechargemontpellier.fr",
  "bornerechargeversailles.fr",
  "bornerechargestmaur.fr",
  "bornerechargelevallois.fr",
  "bornerechargerennes.fr",
  "bornerechargecannes.fr",
  "bornerechargebiarritz.fr"
];

async function checkDomain(domain: string) {
    try {
        const aRecords = await dns.resolve4(domain);
        let cname: string[] = [];
        try {
           cname = await dns.resolveCname(`www.${domain}`);
        } catch(e) { /* ignore */ }
        
        const aOk = aRecords.includes('76.76.21.21') ? '✅' : `❌ (${aRecords.join(',')})`;
        
        let cnameOk = '❌';
        if (cname.length > 0) {
           cnameOk = cname[0].includes('vercel') ? '✅' : `❌ (${cname[0]})`;
        } else {
           // Maybe they put A record for www too
           try {
               const wwwA = await dns.resolve4(`www.${domain}`);
               if (wwwA.includes('76.76.21.21')) cnameOk = '✅ (A Record)';
           } catch(e) { }
        }

        console.log(`${domain.padEnd(30)} | A: ${aOk.padEnd(20)} | WWW: ${cnameOk}`);

    } catch(err: any) {
        console.log(`${domain.padEnd(30)} | 🔴 DNS Error: ${err.message}`);
    }
}

async function main() {
    console.log("Checking domains...");
    const promises = domains.map(d => checkDomain(d));
    await Promise.all(promises);
}

main();
