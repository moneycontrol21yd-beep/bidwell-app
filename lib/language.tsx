"use client";
import { createContext, useContext, useEffect, useState } from "react";

export type Lang = "en" | "hi" | "mr" | "gu" | "bn" | "ta" | "te" | "kn" | "ml" | "pa" | "or" | "as" | "ur";

export const LANGUAGES = [
  { code: "en" as Lang, name: "English" },
  { code: "hi" as Lang, name: "Hindi" },
  { code: "mr" as Lang, name: "Marathi" },
  { code: "gu" as Lang, name: "Gujarati" },
  { code: "bn" as Lang, name: "Bengali" },
  { code: "ta" as Lang, name: "Tamil" },
  { code: "te" as Lang, name: "Telugu" },
  { code: "kn" as Lang, name: "Kannada" },
  { code: "ml" as Lang, name: "Malayalam" },
  { code: "pa" as Lang, name: "Punjabi" },
  { code: "or" as Lang, name: "Odia" },
  { code: "as" as Lang, name: "Assamese" },
  { code: "ur" as Lang, name: "Urdu" },
];

const T: any = {
  en: { home: "Home", tenders: "Tenders", bids: "Bids", contracts: "Contracts", money: "Money", dashboard: "Dashboard", settings: "Settings", language: "Language", theme: "Theme", profile: "Profile", logout: "Logout", save: "Save", cancel: "Cancel", uploadTender: "Upload Tender", selectPdf: "Tap to select PDF", analyzeBtn: "ANALYZE WITH BIDWELL", analyzing: "BidWell is analyzing...", pleaseWait: "10-20 seconds", analysisComplete: "Analysis Complete", saveTenders: "SAVE TO MY TENDERS", saving: "SAVING...", detectedLang: "Detected Language", auditLog: "Audit Log", bidwellWatch: "BidWell Watch" },
  hi: { home: "होम", tenders: "टेंडर", bids: "बिड्स", contracts: "कॉन्ट्रैक्ट", money: "पैसा", dashboard: "डैशबोर्ड", settings: "सेटिंग", language: "भाषा", theme: "थीम", profile: "प्रोफ़ाइल", logout: "लॉग आउट", save: "सेव", cancel: "रद्द", uploadTender: "टेंडर अपलोड करें", selectPdf: "PDF चुनने के लिए टैप करें", analyzeBtn: "BIDWELL से विश्लेषण करें", analyzing: "BidWell विश्लेषण कर रहा है...", pleaseWait: "10-20 सेकंड", analysisComplete: "विश्लेषण पूरा", saveTenders: "मेरे टेंडर में सेव करें", saving: "सेव हो रहा...", detectedLang: "टेंडर की भाषा", auditLog: "ऑडिट लॉग", bidwellWatch: "BidWell वॉच" },
  mr: { home: "होम", tenders: "निविदा", bids: "बोली", contracts: "करार", money: "पैसे", dashboard: "डॅशबोर्ड", settings: "सेटिंग्ज", language: "भाषा", theme: "थीम", profile: "प्रोफाइल", logout: "लॉग आउट", save: "जतन", cancel: "रद्द", uploadTender: "निविदा अपलोड करा", selectPdf: "PDF निवडण्यासाठी टॅप करा", analyzeBtn: "BIDWELL ने विश्लेषण करा", analyzing: "BidWell विश्लेषण करत आहे...", pleaseWait: "10-20 सेकंद", analysisComplete: "विश्लेषण पूर्ण", saveTenders: "माझ्या निविदांमध्ये जतन करा", saving: "जतन करत आहे...", detectedLang: "निविदेची भाषा", auditLog: "ऑडिट लॉग", bidwellWatch: "BidWell वॉच" },
  gu: { home: "હોમ", tenders: "ટેન્ડર", bids: "બિડ", contracts: "કરાર", money: "પૈસા", dashboard: "ડેશબોર્ડ", settings: "સેટિંગ્સ", language: "ભાષા", theme: "થીમ", profile: "પ્રોફાઇલ", logout: "લોગ આઉટ", save: "સાચવો", cancel: "રદ", uploadTender: "ટેન્ડર અપલોડ કરો", selectPdf: "PDF પસંદ કરવા ટેપ કરો", analyzeBtn: "BIDWELL થી વિશ્લેષણ", analyzing: "BidWell વિશ્લેષણ કરી રહ્યું છે...", pleaseWait: "10-20 સેકન્ડ", analysisComplete: "વિશ્લેષણ પૂર્ણ", saveTenders: "મારા ટેન્ડરમાં સાચવો", saving: "સાચવી રહ્યું...", detectedLang: "ટેન્ડરની ભાષા", auditLog: "ઓડિટ લોગ", bidwellWatch: "BidWell વોચ" },
  bn: { home: "হোম", tenders: "টেন্ডার", bids: "বিড", contracts: "চুক্তি", money: "টাকা", dashboard: "ড্যাশবোর্ড", settings: "সেটিংস", language: "ভাষা", theme: "থিম", profile: "প্রোফাইল", logout: "লগ আউট", save: "সংরক্ষণ", cancel: "বাতিল", uploadTender: "টেন্ডার আপলোড করুন", selectPdf: "PDF নির্বাচন করতে ট্যাপ করুন", analyzeBtn: "BIDWELL দিয়ে বিশ্লেষণ", analyzing: "BidWell বিশ্লেষণ করছে...", pleaseWait: "10-20 সেকেন্ড", analysisComplete: "বিশ্লেষণ সম্পূর্ণ", saveTenders: "আমার টেন্ডারে সংরক্ষণ করুন", saving: "সংরক্ষণ...", detectedLang: "টেন্ডারের ভাষা", auditLog: "অডিট লগ", bidwellWatch: "BidWell ওয়াচ" },
  ta: { home: "முகப்பு", tenders: "டெண்டர்", bids: "ஏலம்", contracts: "ஒப்பந்தம்", money: "பணம்", dashboard: "டாஷ்போர்டு", settings: "அமைப்புகள்", language: "மொழி", theme: "தீம்", profile: "சுயவிவரம்", logout: "வெளியேறு", save: "சேமி", cancel: "ரத்து", uploadTender: "டெண்டர் பதிவேற்று", selectPdf: "PDF தேர்ந்தெடுக்க தட்டவும்", analyzeBtn: "BIDWELL மூலம் பகுப்பாய்வு", analyzing: "BidWell பகுப்பாய்வு செய்கிறது...", pleaseWait: "10-20 விநாடிகள்", analysisComplete: "பகுப்பாய்வு முடிந்தது", saveTenders: "எனது டெண்டர்களில் சேமி", saving: "சேமிக்கிறது...", detectedLang: "டெண்டர் மொழி", auditLog: "தணிக்கை பதிவு", bidwellWatch: "BidWell வாட்ச்" },
  te: { home: "హోమ్", tenders: "టెండర్లు", bids: "బిడ్లు", contracts: "ఒప్పందాలు", money: "డబ్బు", dashboard: "డాష్‌బోర్డ్", settings: "సెట్టింగ్‌లు", language: "భాష", theme: "థీమ్", profile: "ప్రొఫైల్", logout: "లాగ్ అవుట్", save: "సేవ్", cancel: "రద్దు", uploadTender: "టెండర్ అప్‌లోడ్", selectPdf: "PDF ఎంచుకోవడానికి ట్యాప్ చేయండి", analyzeBtn: "BIDWELL తో విశ్లేషించండి", analyzing: "BidWell విశ్లేషిస్తోంది...", pleaseWait: "10-20 సెకన్లు", analysisComplete: "విశ్లేషణ పూర్తయింది", saveTenders: "నా టెండర్లలో సేవ్ చేయండి", saving: "సేవ్ చేస్తోంది...", detectedLang: "టెండర్ భాష", auditLog: "ఆడిట్ లాగ్", bidwellWatch: "BidWell వాచ్" },
  kn: { home: "ಮುಖಪುಟ", tenders: "ಟೆಂಡರ್", bids: "ಬಿಡ್", contracts: "ಒಪ್ಪಂದ", money: "ಹಣ", dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು", language: "ಭಾಷೆ", theme: "ಥೀಮ್", profile: "ಪ್ರೊಫೈಲ್", logout: "ಲಾಗ್ ಔಟ್", save: "ಉಳಿಸಿ", cancel: "ರದ್ದು", uploadTender: "ಟೆಂಡರ್ ಅಪ್‌ಲೋಡ್", selectPdf: "PDF ಆಯ್ಕೆಗೆ ಟ್ಯಾಪ್ ಮಾಡಿ", analyzeBtn: "BIDWELL ನಿಂದ ವಿಶ್ಲೇಷಿಸಿ", analyzing: "BidWell ವಿಶ್ಲೇಷಿಸುತ್ತಿದೆ...", pleaseWait: "10-20 ಸೆಕೆಂಡ್", analysisComplete: "ವಿಶ್ಲೇಷಣೆ ಪೂರ್ಣ", saveTenders: "ನನ್ನ ಟೆಂಡರ್‌ಗಳಲ್ಲಿ ಉಳಿಸಿ", saving: "ಉಳಿಸುತ್ತಿದೆ...", detectedLang: "ಟೆಂಡರ್ ಭಾಷೆ", auditLog: "ಆಡಿಟ್ ಲಾಗ್", bidwellWatch: "BidWell ವಾಚ್" },
  ml: { home: "ഹോം", tenders: "ടെൻഡർ", bids: "ബിഡ്", contracts: "കരാർ", money: "പണം", dashboard: "ഡാഷ്ബോർഡ്", settings: "ക്രമീകരണങ്ങൾ", language: "ഭാഷ", theme: "തീം", profile: "പ്രൊഫൈൽ", logout: "ലോഗ് ഔട്ട്", save: "സേവ്", cancel: "റദ്ദാക്കുക", uploadTender: "ടെൻഡർ അപ്‌ലോഡ്", selectPdf: "PDF തിരഞ്ഞെടുക്കാൻ ടാപ്പ് ചെയ്യുക", analyzeBtn: "BIDWELL ഉപയോഗിച്ച് വിശകലനം", analyzing: "BidWell വിശകലനം ചെയ്യുന്നു...", pleaseWait: "10-20 സെക്കൻഡ്", analysisComplete: "വിശകലനം പൂർത്തിയായി", saveTenders: "എന്റെ ടെൻഡറുകളിൽ സേവ്", saving: "സേവ് ചെയ്യുന്നു...", detectedLang: "ടെൻഡർ ഭാഷ", auditLog: "ഓഡിറ്റ് ലോഗ്", bidwellWatch: "BidWell വാച്ച്" },
  pa: { home: "ਹੋਮ", tenders: "ਟੈਂਡਰ", bids: "ਬੋਲੀ", contracts: "ਸਮਝੌਤਾ", money: "ਪੈਸਾ", dashboard: "ਡੈਸ਼ਬੋਰਡ", settings: "ਸੈਟਿੰਗਾਂ", language: "ਭਾਸ਼ਾ", theme: "ਥੀਮ", profile: "ਪ੍ਰੋਫ਼ਾਈਲ", logout: "ਲੌਗ ਆਊਟ", save: "ਸੇਵ", cancel: "ਰੱਦ", uploadTender: "ਟੈਂਡਰ ਅੱਪਲੋਡ", selectPdf: "PDF ਚੁਣਨ ਲਈ ਟੈਪ ਕਰੋ", analyzeBtn: "BIDWELL ਨਾਲ ਵਿਸ਼ਲੇਸ਼ਣ", analyzing: "BidWell ਵਿਸ਼ਲੇਸ਼ਣ ਕਰ ਰਿਹਾ ਹੈ...", pleaseWait: "10-20 ਸਕਿੰਟ", analysisComplete: "ਵਿਸ਼ਲੇਸ਼ਣ ਪੂਰਾ", saveTenders: "ਮੇਰੇ ਟੈਂਡਰਾਂ ਵਿੱਚ ਸੇਵ", saving: "ਸੇਵ ਕਰ ਰਿਹਾ...", detectedLang: "ਟੈਂਡਰ ਦੀ ਭਾਸ਼ਾ", auditLog: "ਆਡਿਟ ਲੌਗ", bidwellWatch: "BidWell ਵਾਚ" },
  or: { home: "ହୋମ", tenders: "ଟେଣ୍ଡର", bids: "ବିଡ", contracts: "ଚୁକ୍ତି", money: "ଟଙ୍କା", dashboard: "ଡ୍ୟାସବୋର୍ଡ", settings: "ସେଟିଂସ", language: "ଭାଷା", theme: "ଥିମ", profile: "ପ୍ରୋଫାଇଲ", logout: "ଲଗ ଆଉଟ", save: "ସେଭ", cancel: "ବାତିଲ", uploadTender: "ଟେଣ୍ଡର ଅପଲୋଡ", selectPdf: "PDF ଚୟନ ପାଇଁ ଟ୍ୟାପ", analyzeBtn: "BIDWELL ସହ ବିଶ୍ଳେଷଣ", analyzing: "BidWell ବିଶ୍ଳେଷଣ କରୁଛି...", pleaseWait: "10-20 ସେକେଣ୍ଡ", analysisComplete: "ବିଶ୍ଳେଷଣ ସମ୍ପୂର୍ଣ୍ଣ", saveTenders: "ମୋ ଟେଣ୍ଡରରେ ସେଭ", saving: "ସେଭ ହେଉଛି...", detectedLang: "ଟେଣ୍ଡର ଭାଷା", auditLog: "ଅଡିଟ ଲଗ", bidwellWatch: "BidWell ୱାଚ" },
  as: { home: "হোম", tenders: "টেণ্ডাৰ", bids: "বিড", contracts: "চুক্তি", money: "টকা", dashboard: "ডেশবৰ্ড", settings: "ছেটিংছ", language: "ভাষা", theme: "থীম", profile: "প্ৰফাইল", logout: "লগ আউট", save: "ছেভ", cancel: "বাতিল", uploadTender: "টেণ্ডাৰ আপলোড", selectPdf: "PDF বাছনিৰ বাবে টেপ", analyzeBtn: "BIDWELL ৰ সৈতে বিশ্লেষণ", analyzing: "BidWell বিশ্লেষণ কৰি আছে...", pleaseWait: "10-20 ছেকেণ্ড", analysisComplete: "বিশ্লেষণ সম্পূৰ্ণ", saveTenders: "মোৰ টেণ্ডাৰত ছেভ", saving: "ছেভ কৰি আছে...", detectedLang: "টেণ্ডাৰৰ ভাষা", auditLog: "অডিট লগ", bidwellWatch: "BidWell ৱাচ" },
  ur: { home: "ہوم", tenders: "ٹینڈر", bids: "بولی", contracts: "معاہدہ", money: "پیسہ", dashboard: "ڈیش بورڈ", settings: "سیٹنگز", language: "زبان", theme: "تھیم", profile: "پروفائل", logout: "لاگ آؤٹ", save: "محفوظ", cancel: "منسوخ", uploadTender: "ٹینڈر اپ لوڈ", selectPdf: "PDF منتخب کرنے کے لیے ٹیپ", analyzeBtn: "BIDWELL سے تجزیہ", analyzing: "BidWell تجزیہ کر رہا ہے...", pleaseWait: "10-20 سیکنڈ", analysisComplete: "تجزیہ مکمل", saveTenders: "میرے ٹینڈرز میں محفوظ", saving: "محفوظ ہو رہا...", detectedLang: "ٹینڈر کی زبان", auditLog: "آڈٹ لاگ", bidwellWatch: "BidWell واچ" },
};

const LangContext = createContext<any>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  useEffect(() => {
    const saved = localStorage.getItem("bidwell_lang") as Lang;
    if (saved && T[saved]) setLang(saved);
  }, []);
  const change = (l: Lang) => { setLang(l); localStorage.setItem("bidwell_lang", l); };
  const t = (key: string) => (T[lang] && T[lang][key]) || T.en[key] || key;
  const currentLanguage = LANGUAGES.find((l) => l.code === lang);
  return <LangContext.Provider value={{ lang, change, t, currentLanguage }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
