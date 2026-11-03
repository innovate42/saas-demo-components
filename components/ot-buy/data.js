// Demo reference data for the guided buying flow. In production this would come
// from OpenText's partner directory / catalog exchange (Rich's "catalog
// exchange" ask); here it is a curated, representative slice.

export const ERPS = [
    { id: "netsuite", name: "Oracle NetSuite", short: "NS", color: "#1B3D6E", adapter: true },
    { id: "sap-b1", name: "SAP Business One", short: "B1", color: "#0A6ED1", adapter: true },
    { id: "sap-s4", name: "SAP S/4HANA", short: "S4", color: "#0057B8", adapter: true },
    { id: "d365-bc", name: "Dynamics 365 Business Central", short: "BC", color: "#00A4EF", adapter: true },
    { id: "d365-fo", name: "Dynamics 365 Finance & Operations", short: "FO", color: "#0078D4", adapter: true },
    { id: "quickbooks", name: "QuickBooks Online", short: "QB", color: "#2CA01C", adapter: true },
    { id: "sage-intacct", name: "Sage Intacct", short: "SI", color: "#00A651", adapter: true },
    { id: "acumatica", name: "Acumatica", short: "AC", color: "#2B6AB3", adapter: true },
    { id: "epicor", name: "Epicor Kinetic", short: "EP", color: "#E31937", adapter: true },
    { id: "infor", name: "Infor CloudSuite", short: "IN", color: "#C8102E", adapter: true },
    { id: "odoo", name: "Odoo", short: "OD", color: "#714B67", adapter: false },
    { id: "other", name: "Other / not sure yet", short: "?", color: "#3F4D62", adapter: false },
]

export const INDUSTRIES = ["Retail", "Grocery", "Home & DIY", "Automotive", "Health & Pharmacy", "Marketplace", "Distribution"]

const X12_RETAIL = ["850 PO", "855 PO Ack", "856 ASN", "810 Invoice"]
const X12_RETAIL_INV = [...X12_RETAIL, "846 Inventory"]
const X12_AUTO = ["830 Forecast", "862 Ship Schedule", "856 ASN", "810 Invoice"]
const EDIFACT = ["ORDERS", "ORDRSP", "DESADV", "INVOIC"]
const TRADACOMS = ["ORDHDR", "DLCHDR", "INVFIL"]

export const PARTNERS = [
    // North America
    { name: "Walmart", industry: "Retail", region: "NA", docs: X12_RETAIL_INV, popular: true },
    { name: "Target", industry: "Retail", region: "NA", docs: X12_RETAIL_INV, popular: true },
    { name: "Costco", industry: "Retail", region: "NA", docs: X12_RETAIL, popular: true },
    { name: "Amazon Vendor Central", industry: "Marketplace", region: "NA", docs: X12_RETAIL_INV, popular: true },
    { name: "The Home Depot", industry: "Home & DIY", region: "NA", docs: X12_RETAIL_INV, popular: true },
    { name: "Lowe's", industry: "Home & DIY", region: "NA", docs: X12_RETAIL_INV },
    { name: "Kroger", industry: "Grocery", region: "NA", docs: X12_RETAIL },
    { name: "Albertsons", industry: "Grocery", region: "NA", docs: X12_RETAIL },
    { name: "Publix", industry: "Grocery", region: "NA", docs: X12_RETAIL },
    { name: "CVS Health", industry: "Health & Pharmacy", region: "NA", docs: X12_RETAIL },
    { name: "Walgreens", industry: "Health & Pharmacy", region: "NA", docs: X12_RETAIL },
    { name: "McKesson", industry: "Distribution", region: "NA", docs: X12_RETAIL },
    { name: "Best Buy", industry: "Retail", region: "NA", docs: X12_RETAIL_INV },
    { name: "Nordstrom", industry: "Retail", region: "NA", docs: X12_RETAIL },
    { name: "Macy's", industry: "Retail", region: "NA", docs: X12_RETAIL },
    { name: "Dollar General", industry: "Retail", region: "NA", docs: X12_RETAIL },
    { name: "Tractor Supply", industry: "Home & DIY", region: "NA", docs: X12_RETAIL },
    { name: "Ace Hardware", industry: "Home & DIY", region: "NA", docs: X12_RETAIL },
    { name: "Wayfair", industry: "Marketplace", region: "NA", docs: X12_RETAIL_INV },
    { name: "Sysco", industry: "Distribution", region: "NA", docs: X12_RETAIL },
    { name: "AutoZone", industry: "Automotive", region: "NA", docs: X12_RETAIL_INV },
    { name: "O'Reilly Auto Parts", industry: "Automotive", region: "NA", docs: X12_RETAIL_INV },
    { name: "Advance Auto Parts", industry: "Automotive", region: "NA", docs: X12_RETAIL_INV },
    { name: "NAPA (Genuine Parts)", industry: "Automotive", region: "NA", docs: X12_RETAIL },
    { name: "General Motors", industry: "Automotive", region: "NA", docs: X12_AUTO },
    { name: "Ford Motor Company", industry: "Automotive", region: "NA", docs: X12_AUTO },
    // UK & Europe
    { name: "Tesco", industry: "Grocery", region: "EMEA", docs: TRADACOMS, popular: true },
    { name: "Sainsbury's", industry: "Grocery", region: "EMEA", docs: TRADACOMS },
    { name: "Asda", industry: "Grocery", region: "EMEA", docs: TRADACOMS },
    { name: "Marks & Spencer", industry: "Retail", region: "EMEA", docs: EDIFACT },
    { name: "Boots", industry: "Health & Pharmacy", region: "EMEA", docs: EDIFACT },
    { name: "B&Q (Kingfisher)", industry: "Home & DIY", region: "EMEA", docs: EDIFACT },
    { name: "Screwfix", industry: "Home & DIY", region: "EMEA", docs: EDIFACT },
    { name: "Carrefour", industry: "Grocery", region: "EMEA", docs: EDIFACT, popular: true },
    { name: "Metro AG", industry: "Distribution", region: "EMEA", docs: EDIFACT },
    { name: "Lidl", industry: "Grocery", region: "EMEA", docs: EDIFACT },
    { name: "Ahold Delhaize", industry: "Grocery", region: "EMEA", docs: EDIFACT },
    { name: "Zalando", industry: "Marketplace", region: "EMEA", docs: EDIFACT },
    { name: "Amazon EU", industry: "Marketplace", region: "EMEA", docs: EDIFACT },
    { name: "Volkswagen Group", industry: "Automotive", region: "EMEA", docs: ["DELFOR", "DESADV", "INVOIC"] },
    // Asia-Pacific
    { name: "Woolworths Group", industry: "Grocery", region: "APAC", docs: EDIFACT, popular: true },
    { name: "Coles", industry: "Grocery", region: "APAC", docs: EDIFACT },
    { name: "Bunnings", industry: "Home & DIY", region: "APAC", docs: EDIFACT },
    { name: "AEON", industry: "Retail", region: "APAC", docs: EDIFACT },
    { name: "Toyota", industry: "Automotive", region: "APAC", docs: ["DELFOR", "DESADV", "INVOIC"] },
    { name: "Lazada", industry: "Marketplace", region: "APAC", docs: EDIFACT },
]
