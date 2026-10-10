#!/data/data/com.termux/files/usr/bin/bash

for f in $(find app components -name "*.tsx" -type f); do
  # Dashboard
  sed -i "s/PDF upload karo — AI 15 sec me analyze karega/Upload PDF — AI analyzes in 15 seconds/g" "$f"
  sed -i "s/Live Tenders fetch karo/Fetch Live Tenders/g" "$f"
  
  # Tender detail
  sed -i "s/Eligibility details tender document me hain. AI analysis run karo./Eligibility details are in the tender document. Run AI analysis./g" "$f"
  sed -i "s/Eligibility details tender document me hain. AI analysis run karo/Eligibility details in tender document. Run AI analysis/g" "$f"
  
  # Contracts
  sed -i "s/Bids me jaake 'Awarded' mark karo/Mark as 'Awarded' in Bids/g" "$f"
  sed -i "s/Bids me jaake .*Awarded. mark karo/Mark as 'Awarded' in Bids/g" "$f"
  sed -i "s/Upar diye gaye 4 buttons se Workforce, Tasks, Invoices aur Documents manage karo./Manage Workforce, Tasks, Invoices and Documents from the 4 tabs above./g" "$f"
  sed -i "s/Team & attendance manage karo/Manage team & attendance/g" "$f"
  sed -i "s/Pehle employees add karo/Add employees first/g" "$f"
  
  # Upload
  sed -i "s/AI analysis ko verify karo original tender se. Final decision tender authority ka hai./Verify AI analysis with original tender. Final decision rests with tender authority./g" "$f"
  
  # Signup
  sed -i "s/Account ban gaya! Ab login karo./Account created! Please login./g" "$f"
  
  # Settings
  sed -i "s/Naya password set karo/Set new password/g" "$f"
  
  # Notifications
  sed -i "s/Tenders watch karo — updates yahan aayenge/Watch tenders — updates will appear here/g" "$f"
  
  # Reset password
  sed -i "s/Reset link invalid or expired. Dobara try karo./Reset link invalid or expired. Try again./g" "$f"
  
  # Help page
  sed -i "s/Aapke Company Profile aur uploaded Documents ko Tender requirements se compare karke AI match score deta hai — kaunsi requirement match ho rahi hai, kaunsi missing hai, sab clear dikhata hai./AI compares your Company Profile and uploaded Documents against tender requirements to give a match score — showing what matches and what is missing./g" "$f"
  sed -i "s/Kitne documents upload kar sakte hain?/How many documents can I upload?/g" "$f"
  sed -i "s/Free plan me 10 documents, paid plans me unlimited. GST, PAN, Licenses, Experience Certificates — sab upload karo, AI automatically use karega./Free plan: 10 documents, paid plans: unlimited. GST, PAN, Licenses, Experience Certificates — upload all, AI uses them automatically./g" "$f"
  sed -i "s/Nahi. BidWell aapko bid prepare karne me madad karta hai, par final submission aap khud portal par karte hain. AI ko legal decision lene ka adhikar nahi hai./No. BidWell helps prepare your bid, but final submission is done by you on the portal. AI is not authorized to make legal decisions./g" "$f"
  sed -i "s/Pehle Company Profile complete karo — AI zyada accurate results dega./Complete Company Profile first — AI will give more accurate results./g" "$f"
  
  # Generic
  sed -i "s/Karo/Kar/g" "$f"
  sed -i "s/karo/do/g" "$f"
  sed -i "s/Dikhao/Show/g" "$f"
  sed -i "s/Dekho/View/g" "$f"
  sed -i "s/Nahi/No/g" "$f"
  sed -i "s/nahi/no/g" "$f"
  sed -i "s/Aapke/Your/g" "$f"
  sed -i "s/aapke/your/g" "$f"
  sed -i "s/Mera/My/g" "$f"
  sed -i "s/mera/my/g" "$f"
  sed -i "s/Aaj ke/Today's/g" "$f"
  sed -i "s/Ab login/Login now/g" "$f"
  
done

echo "✅ All English fixes applied"
