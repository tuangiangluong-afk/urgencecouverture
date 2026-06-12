#!/bin/bash
domains=(
  "bornerechargeparis.fr"
  "bornerechargemarseille.fr"
  "bornerechargeneuilly.fr"
  "bornerechargelyon.fr"
  "bornerechargeboulogne.fr"
  "bornerechargebordeaux.fr"
  "bornerechargetoulouse.fr"
  "bornerechargeannecy.fr"
  "bornerechargestgermain.fr"
  "bornerechargenice.fr"
  "bornerechargenantes.fr"
  "bornerechargeaix.fr"
  "bornerechargestrasbourg.fr"
  "bornerechargelille.fr"
  "bornerechargemontpellier.fr"
  "bornerechargeversailles.fr"
  "bornerechargestmaur.fr"
  "bornerechargelevallois.fr"
  "bornerechargerennes.fr"
  "bornerechargecannes.fr"
  "bornerechargebiarritz.fr"
)

printf "%-30s %-10s %-10s\n" "Domain" "Root" "WWW"
for domain in "${domains[@]}"; do
  if ! ping -c 1 "$domain" > /dev/null 2>&1; then
    root="DNS FAIL"
  else
    root=$(curl -m 10 -s -L -o /dev/null -w "%{http_code}" "http://$domain")
  fi
  
  if ! ping -c 1 "www.$domain" > /dev/null 2>&1; then
    www="DNS FAIL"
  else
    www=$(curl -m 10 -s -L -o /dev/null -w "%{http_code}" "http://www.$domain")
  fi
  
  printf "%-30s %-10s %-10s\n" "$domain" "$root" "$www"
done
