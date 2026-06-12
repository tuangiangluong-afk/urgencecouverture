#!/bin/bash

# Configuration script to add all domains to Vercel
# Usage: ./add-domains.sh

echo "🚀 Adding Expert Borne Recharge domains to Vercel..."

# Main Hub
npx vercel domains add expertbornerecharge.com

# Local Sites
npx vercel domains add bornerechargeparis.fr
npx vercel domains add bornerechargeneuilly.fr
npx vercel domains add bornerechargelyon.fr
npx vercel domains add bornerechargeboulogne.fr
npx vercel domains add bornerechargebordeaux.fr
npx vercel domains add bornerechargetoulouse.fr
npx vercel domains add bornerechargeannecy.fr
npx vercel domains add bornerechargestgermain.fr
npx vercel domains add bornerechargenice.fr
npx vercel domains add bornerechargenantes.fr
npx vercel domains add bornerechargeaix.fr
npx vercel domains add bornerechargestrasbourg.fr
npx vercel domains add bornerechargelille.fr
npx vercel domains add bornerechargemontpellier.fr
npx vercel domains add bornerechargeversailles.fr
npx vercel domains add bornerechargestmaur.fr
npx vercel domains add bornerechargelevallois.fr
npx vercel domains add bornerechargerennes.fr
npx vercel domains add bornerechargecannes.fr
npx vercel domains add bornerechargebiarritz.fr
npx vercel domains add bornerechargemarseille.fr

echo "✅ All domains added!"
echo "👉 Make sure to configure DNS records (A record @ to 76.76.21.21) for each domain at your registrar."
