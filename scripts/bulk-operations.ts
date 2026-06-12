import { CITIES } from "../src/lib/db";
import fs from "fs";

// Configuration
const PROJECT_NAME = "taxifrance"; // Remplacer par le nom exact du projet Vercel
const VERCEL_IP = "76.76.21.21";
const CNAME_TARGET = "cname.vercel-dns.com.";

// 1. Generate Shell Script for Vercel CLI
let shContent = `#!/bin/bash\n# Script de déploiement de masse pour Vercel\n\n`;

Object.values(CITIES).forEach(city => {
    shContent += `echo "Attaching: ${city.domain}"\n`;
    shContent += `npx -y vercel domains add ${city.domain} --force\n`;
    if (city.aliases) {
        city.aliases.forEach(alias => {
            shContent += `npx -y vercel domains add ${alias} --force\n`;
        });
    }
});

fs.writeFileSync("scripts/deploy-domains.sh", shContent);
console.log("✅ Generated scripts/deploy-domains.sh");

// 2. Generate BIND Zone File (Standard Format for OVH/Many Registrars)
// This is a generic template that can be applied to any domain.
let bindContent = `$TTL 3600\n`;
bindContent += `@    IN A     ${VERCEL_IP}\n`;
bindContent += `www  IN CNAME ${CNAME_TARGET}\n`;

fs.writeFileSync("scripts/ovh-zone-template.txt", bindContent);
console.log("✅ Generated scripts/ovh-zone-template.txt (Standard BIND format for OVH Import)");

// 3. Generate CSV Summary (for manual verification)
let csvContent = `Domain,Type,Host,Value\n`;

Object.values(CITIES).forEach(city => {
    csvContent += `${city.domain},A,@,${VERCEL_IP}\n`;
    csvContent += `${city.domain},CNAME,www,${CNAME_TARGET}\n`;
    if (city.aliases) {
        city.aliases.forEach(alias => {
            csvContent += `${alias},A,@,${VERCEL_IP}\n`;
            csvContent += `${alias},CNAME,www,${CNAME_TARGET}\n`;
        });
    }
});

fs.writeFileSync("scripts/dns-summary.csv", csvContent);
console.log("✅ Generated scripts/dns-summary.csv");

console.log("\nNext Steps:");
console.log("1. Run 'chmod +x scripts/deploy-domains.sh'");
console.log("2. Run './scripts/deploy-domains.sh' (Make sure you are logged in 'vercel login')");
console.log("3. For OVH: Use 'scripts/ovh-zone-template.txt' to apply a Zone Template to your domains, or configure them manually using 'scripts/dns-summary.csv' as reference.");
