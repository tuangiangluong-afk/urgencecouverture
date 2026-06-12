#!/bin/bash

domains=(
  "expertbornerecharge.com"
  "bornerechargeparis.fr"
  "bornerechargemarseille.fr"
  "bornerechargelyon.fr"
  "bornerechargebordeaux.fr"
  "bornerechargeannecy.fr"
)

echo "Testing Local Sitemaps..."

# Assumes next server is running on 3000
for domain in "${domains[@]}"; do
  echo "--- Testing: $domain ---"
  curl -s -H "Host: $domain:3000" http://localhost:3000/sitemap.xml | head -n 10
  echo ""
done
