import re
import json

# Comprehensive Cyber Cafe & Document Requirement Database with Official Links
CYBER_DOC_REPOSITORY = {
    "MSME / Udyam": {
        "importance": "Crucial for EMD & Tender Fee Exemption",
        "official_portal": "https://udyamregistration.gov.in",
        "time_required": "Instant (5-10 Mins)",
        "cost": "Free of Cost"
    },
    "Class-3 DSC": {
        "importance": "Mandatory for signing digital bids on GeM/CPPP",
        "official_portal": "https://cca.gov.in",
        "time_required": "1-2 Working Days",
        "cost": "Nominal Fee via Licensed Providers (eMudhra/nCode)"
    },
    "GST Registration": {
        "importance": "Mandatory for commercial works & tax credit",
        "official_portal": "https://www.gst.gov.in",
        "time_required": "3-7 Working Days",
        "cost": "Government Portal is Free (CA/Agent fees may apply)"
    },
    "Solvency Certificate": {
        "importance": "Proves financial capability for high-value tenders",
        "official_portal": "Your Bank Branch Manager",
        "time_required": "3-5 Working Days",
        "cost": "Bank Charges Apply"
    }
}

def analyze_tender_and_suggest_missing_docs(vendor_uploaded_docs, tender_required_criteria):
    """
    Scans tender criteria against vendor's uploaded documents.
    If something is missing, gives pro-active AI suggestions with exact official government links.
    """
    report = {
        "eligibility_status": "Eligible with Gaps",
        "missing_items": [],
        "ai_proactive_suggestions": [],
        "cost_saving_tips": []
    }
    
    for criteria in tender_required_criteria:
        doc_name = criteria.get("name")
        if doc_name not in vendor_uploaded_docs or not vendor_uploaded_docs[doc_name].get("available", False):
            doc_info = CYBER_DOC_REPOSITORY.get(doc_name, {
                "importance": "Required as per tender NIT",
                "official_portal": "https://eprocure.gov.in",
                "time_required": "As per department norms",
                "cost": "Varies"
            })
            
            report["missing_items"].append({
                "document": doc_name,
                "reason": criteria.get("reason", "Mandatory eligibility condition"),
                "how_to_get": doc_info
            })
            
    # Proactive AI Cyber Suggestions
    if any(item["document"] == "MSME / Udyam" for item in report["missing_items"]):
        report["cost_saving_tips"].append(
            "💡 AI Suggestion: You are missing an MSME/Udyam certificate! Register for free on udyamregistration.gov.in before applying to save 100% of your EMD amount."
        )
        
    if len(report["missing_items"]) == 0:
        report["eligibility_status"] = "100% Ready to Bid"
        report["ai_proactive_suggestions"].append("🎉 Great news! All required documents are available in your Vault. You can generate the final bid package now.")
    else:
        report["ai_proactive_suggestions"].append(f"⚠️ Action Required: You have {len(report['missing_items'])} missing document(s). Please check the official links below to arrange them immediately.")
        
    return report

if __name__ == "__main__":
    print("✅ Cyber AI & Document Scanner Engine Ready.")
