#!/data/data/com.termux/files/usr/bin/bash

# Common Hinglish → English replacements
fix() {
  local file=$1
  sed -i 's/Kuch bhi poocho — tenders, contracts, documents/Search tenders, contracts, and documents/g' "$file"
  sed -i 's/Kuch nahi mila/No results found for/g' "$file"
  sed -i 's/Try These/Try These/g' "$file"
  sed -i 's/Aaj ke naye tenders/Today'"'"'s new tenders/g' "$file"
  sed -i 's/Mera ISO certificate/My ISO certificate/g' "$file"
  sed -i 's/Pending invoices/Pending invoices/g' "$file"
  sed -i 's/Security tenders/Security tenders/g' "$file"
  sed -i 's/Housekeeping contract/Housekeeping contract/g' "$file"
  sed -i 's/Naya Document Add Karo/Add New Document/g' "$file"
  sed -i 's/Company documents add karo — ye hamesha kaam aayenge/Add company documents — they always come in handy/g' "$file"
  sed -i 's/Ek baar bharo, hamesha kaam aayega/Fill once, use forever/g' "$file"
  sed -i 's/AI Eligibility Match kaise kaam karta hai?/How does AI Eligibility Match work?/g' "$file"
  sed -i 's/Tender automatically submit hota hai kya?/Does BidWell auto-submit tenders?/g' "$file"
  sed -i 's/Aapke profile se match nahi hua/No match found for your profile/g' "$file"
  sed -i 's/Koi tender nahi/No tenders yet/g' "$file"
  sed -i 's/Apne bids manage karo/Manage your bids/g' "$file"
  sed -i 's/Apne team ko add karo/Add your team/g' "$file"
  sed -i 's/Tenders, Bids, Contracts manage karne ke liye/To manage tenders, bids, contracts/g' "$file"
  sed -i 's/Abhi koi team member nahi hai/No team members yet/g' "$file"
  sed -i 's/Abhi koi tender watch nahi kar rahe/No tenders being watched/g' "$file"
  sed -i 's/Tenders page par .* button daba kar watch karo/Go to Tenders and tap the eye button/g' "$file"
  sed -i 's/Sab track par hai/All on track/g' "$file"
  sed -i 's/Contract expire ho gaya/Contract expired/g' "$file"
  sed -i 's/receivable pending/payment pending/g' "$file"
  sed -i 's/Koi bid nahi/No bids yet/g' "$file"
  sed -i 's/Aaj ke tenders/Today'"'"'s tenders/g' "$file"
  sed -i 's/Aapke liye/For you/g' "$file"
  sed -i 's/Dekho/View/g' "$file"
  sed -i 's/Dikhao/Show/g' "$file"
}

# Fix all .tsx files
for file in $(find app components -name "*.tsx" -type f); do
  fix "$file"
  echo "✅ Fixed: $file"
done

echo ""
echo "🎉 All files processed!"
