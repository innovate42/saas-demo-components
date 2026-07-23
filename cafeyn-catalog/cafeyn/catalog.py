#!/usr/bin/env python3
"""Cafeyn B2B demo — catalog creation on saas-dev (idempotent: delete + recreate).

Phases:
  python3 catalog.py create      # pass 1: add-ons + offers (no cross-refs)
  python3 catalog.py ids         # print ids/versions of created items
  python3 catalog.py wire        # pass 2: cross-reference wiring via update
  python3 catalog.py promo       # create CAFEYN20 promo code
"""
import json, os, sys, time, urllib.parse, urllib.request

TENANT = "https://saas-dev.prod.limio.com"
# SCRATCH resolves to the cafeyn-catalog/ dir (parent of this cafeyn/ dir); the code
# uses SCRATCH + "/cafeyn" (scripts) and SCRATCH + "/recon" (page templates).
SCRATCH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# OAuth client credentials (gitignored, never committed). Override with LIMIO_CREDS
# env var; default assumes the repo checkout's root .limio.json.
_CREDS_PATH = os.environ.get(
    "LIMIO_CREDS",
    os.path.join(os.path.dirname(SCRATCH), ".limio.json"),
)
CREDS = json.load(open(_CREDS_PATH))

_tok = {"value": None, "expires": 0}

def token():
    if _tok["value"] and time.time() < _tok["expires"] - 60:
        return _tok["value"]
    body = urllib.parse.urlencode({
        "grant_type": "client_credentials",
        "client_id": CREDS["clientId"],
        "client_secret": CREDS["clientSecret"],
    }).encode()
    r = urllib.request.Request(TENANT + "/oauth2/token", method="POST",
        headers={"Content-Type": "application/x-www-form-urlencoded"}, data=body)
    with urllib.request.urlopen(r) as resp:
        d = json.loads(resp.read().decode())
    _tok["value"] = d["access_token"]
    _tok["expires"] = time.time() + d.get("expires_in", 3600)
    return _tok["value"]

def req(method, path, body=None):
    r = urllib.request.Request(TENANT + path, method=method,
        headers={"Authorization": f"Bearer {token()}", "Content-Type": "application/json"},
        data=json.dumps(body).encode() if body is not None else None)
    try:
        with urllib.request.urlopen(r) as resp:
            txt = resp.read().decode()
            return resp.status, json.loads(txt) if txt else {}
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()[:500]

def job(body):
    st, res = req("POST", "/limio/jobs", body)
    assert st in (200, 201, 202), f"job submit failed {st}: {res}"
    jid = res.get("id") or res.get("jobId")
    for _ in range(120):
        time.sleep(0.5)
        st, s = req("GET", f"/limio/jobs/{jid}")
        if isinstance(s, dict):
            if s.get("state") == "completed":
                return s
            if s.get("state") == "failed":
                raise RuntimeError(f"job failed: {s.get('failedReason')}")
    raise RuntimeError("job timed out")

def delete_item(path):
    st, res = req("DELETE", "/limio/catalogs/1/items/" + urllib.parse.quote(path.lstrip("/")))
    return st

def get_item(path):
    st, res = req("GET", "/limio/catalogs/1/items/" + urllib.parse.quote(path.lstrip("/")))
    return (res if isinstance(res, dict) else {}).get("item") if st == 200 else None

# ---------------------------------------------------------------- shared bits
COUNTRIES = ["AT","BE","CH","DE","DK","ES","FI","FR","GB","IE","IT","LI","LU","NL","NO","PT","SE","US","CA"]
PAY = ["zuora_card"]
TERM_M = {"renewal_type": "TERMED", "length": 1, "renewal_trigger": "EXTERNAL", "type": "months"}
TERM_Y = {"renewal_type": "TERMED", "length": 1, "renewal_trigger": "EXTERNAL", "type": "years"}
QTY_10 = {"quantity": 1, "minimum_quantity": 1, "maximum_quantity": 10, "increment": 1}

def price(value, interval_type):
    return [{"name": "charge_1", "label": "Charge 1", "value": str(value), "currencyCode": "EUR",
             "type": "recurring", "trigger": "order_date", "use_external_price": False,
             "repeat_interval": 1, "repeat_interval_type": interval_type, "repeat_count": 1,
             "delay_interval": None, "delay_interval_type": interval_type,
             "subscription_start_day": "asap", "attributes": []}]

def bundle(rate_plan):
    return [{"product_path": "/products/Demo Product", "revenue_split": "100", "rate_plan": rate_plan}]

def offer(name, attrs, rate_plan):
    return {"name": name, "record_type": "offer", "path": f"/offers2/{name}",
            "baseTemplate": "/config/templates/offers/default",
            "products": ["/products/Demo Product"],
            "productBundles": bundle(rate_plan), "attributes": attrs}

def addon(name, attrs, rate_plan):
    # Add-ons need a product + rate plan to be a valid, orderable, publishable catalog
    # item — without it the shop build drops them and cross-sell resolution 404s
    # ("data_not_found: add_on-... version: published").
    return {"name": name, "record_type": "add_on", "path": f"/add_ons/{name}",
            "baseTemplate": "/config/templates/add_ons/default",
            "products": ["/products/Demo Product"],
            "productBundles": bundle(rate_plan), "attributes": attrs}

def base_attrs(term, group, qty=None):
    a = {"term__limio": term, "initial_term__limio": term, "autoRenew__limio": True,
         "offer_type__limio": "standard", "sales_channel__limio": ["Online", "Salesforce"],
         "payment_types__limio": PAY, "allowed_countries__limio": COUNTRIES,
         "group__limio": group, "push_to_checkout__limio": True,
         "checkout__limio": {"checkout_type": "external", "external_url": "/ca-checkout"},
         "update_configuration__limio": "/ca-direct-update",
         "is_gift__limio": False, "is_redeem_gift__limio": False}
    if qty:
        a["allow_multibuy__limio"] = True
        a["default_quantity_options__limio"] = qty
    return a

FEAT_TEAM = ("<ul><li>Über 2.500 Zeitungen &amp; Magazine</li>"
             "<li>Bis zu 10 Lizenzen</li>"
             "<li>Offline lesen auf allen Geräten</li>"
             "<li>Smart Reader Artikelansicht</li></ul>")
FEAT_BIZ = ("<ul><li><strong>Alles aus Team +</strong></li>"
            "<li>Audio-Artikel &amp; Podcasts</li>"
            "<li>Lese-Analysen für Ihr Team</li>"
            "<li>Priorisierter Support</li></ul>")
FEAT_PREMIUM = ("<ul><li>Über 2.500 Zeitungen &amp; Magazine</li>"
                "<li>1 Nutzer, bis zu 5 Profile</li>"
                "<li>Offline lesen &amp; Audio-Artikel</li></ul>")

OFFERS = [
    offer("Cafeyn Team Monthly EUR", {**base_attrs(TERM_M, "monthly", QTY_10),
        "label__limio": ["cafeyn-b2b"],
        "display_name__limio": "Team",
        "display_price__limio": "<p><strong>12&nbsp;€</strong> pro Nutzer/Monat</p>",
        "detailed_display_price__limio": "<p>Monatliche Abrechnung · jederzeit kündbar</p>",
        "offer_features__limio": FEAT_TEAM,
        "display_description__limio": "<p>Die ganze Presse für Ihr Team.</p>",
        "cta_text__limio": "Mit Team starten", "best_value__limio": False}, "Monthly"),
    offer("Cafeyn Team Annual EUR", {**base_attrs(TERM_Y, "yearly", QTY_10),
        "label__limio": ["cafeyn-b2b"],
        "display_name__limio": "Team",
        "display_price__limio": "<p><strong>10&nbsp;€</strong> pro Nutzer/Monat</p>",
        "detailed_display_price__limio": "<p>120&nbsp;€ pro Nutzer/Jahr · jährliche Abrechnung</p>",
        "offer_features__limio": FEAT_TEAM,
        "display_description__limio": "<p>Die ganze Presse für Ihr Team.</p>",
        "cta_text__limio": "Mit Team starten", "best_value__limio": False}, "1-Year Plan"),
    offer("Cafeyn Business Monthly EUR", {**base_attrs(TERM_M, "monthly", QTY_10),
        "label__limio": ["cafeyn-b2b"],
        "display_name__limio": "Business",
        "display_price__limio": "<p><strong>18&nbsp;€</strong> pro Nutzer/Monat</p>",
        "detailed_display_price__limio": "<p>Monatliche Abrechnung · jederzeit kündbar</p>",
        "offer_features__limio": FEAT_BIZ,
        "display_description__limio": "<p>Beliebteste Wahl</p>",
        "cta_text__limio": "Business wählen", "best_value__limio": True}, "Monthly"),
    offer("Cafeyn Business Annual EUR", {**base_attrs(TERM_Y, "yearly", QTY_10),
        "label__limio": ["cafeyn-b2b"],
        "display_name__limio": "Business",
        "display_price__limio": "<p><strong>15&nbsp;€</strong> pro Nutzer/Monat</p>",
        "detailed_display_price__limio": "<p>180&nbsp;€ pro Nutzer/Jahr · jährliche Abrechnung</p>",
        "offer_features__limio": FEAT_BIZ,
        "display_description__limio": "<p>Beliebteste Wahl</p>",
        "cta_text__limio": "Business wählen", "best_value__limio": True}, "1-Year Plan"),
    offer("Cafeyn Premium Monthly EUR", {**base_attrs(TERM_M, "monthly"),
        "label__limio": ["cafeyn-b2c"],
        "display_name__limio": "Cafeyn Premium",
        "display_price__limio": "<p><strong>12,99&nbsp;€</strong> pro Monat</p>",
        "detailed_display_price__limio": "<p>Monatliche Abrechnung · jederzeit kündbar</p>",
        "offer_features__limio": FEAT_PREMIUM,
        "display_description__limio": "<p>Für Privatkunden.</p>",
        "cta_text__limio": "Premium abonnieren", "best_value__limio": False}, "Monthly"),
    offer("Cafeyn Business 25 Seats Negotiated EUR", {**base_attrs(TERM_Y, "yearly",
        {"quantity": 25, "minimum_quantity": 25, "maximum_quantity": 25, "increment": 1}),
        "label__limio": ["cafeyn-sales"],
        "sales_channel__limio": ["Salesforce"],
        "display_name__limio": "Business — 25 Lizenzen (Sonderkonditionen)",
        "display_price__limio": "<p><strong>10&nbsp;€</strong> pro Nutzer/Monat</p>",
        "detailed_display_price__limio": "<p>120&nbsp;€ pro Nutzer/Jahr · 25 Lizenzen · jährliche Abrechnung</p>",
        "offer_features__limio": FEAT_BIZ,
        "display_description__limio": "<p>Ihr verhandeltes Angebot — bereitgestellt von Ihrem Cafeyn-Ansprechpartner.</p>",
        "cta_text__limio": "Jetzt abschließen", "best_value__limio": False}, "1-Year Plan"),
    offer("Cafeyn CSE Jahreslizenz EUR", {**base_attrs(TERM_Y, "yearly"),
        "label__limio": ["cafeyn-sales"],
        "sales_channel__limio": ["Salesforce"],
        "display_name__limio": "CSE Jahreslizenz — unbegrenzter Zugang",
        "display_price__limio": "<p><strong>2.500&nbsp;€</strong> pro Jahr</p>",
        "detailed_display_price__limio": "<p>Unbegrenzte Nutzer · vom Arbeitgeber finanziert · 12 Monate</p>",
        "offer_features__limio": ("<ul><li>Unbegrenzter Zugang für alle Mitarbeitenden</li>"
                                  "<li>Über 2.500 Titel</li><li>Persönlicher Account Manager</li></ul>"),
        "display_description__limio": "<p>Für Betriebsräte, Bibliotheken und Hochschulen.</p>",
        "cta_text__limio": "Jetzt abschließen", "best_value__limio": False}, "1-Year Plan"),
]

def addon_attrs(display, desc, disp_price, value, interval_type, label):
    return {"display_name__limio": display, "description__limio": desc,
            "display_price__limio": disp_price,
            "label__limio": [label], "price__limio": price(value, interval_type),
            "default_quantity_options__limio": {"quantity": 1, "minimum_quantity": 1, "maximum_quantity": 10, "increment": 1}}

ADDONS = [
    addon("Cafeyn International Press Monthly EUR", addon_attrs(
        "Internationale Presse", "<p>Readly-Katalog: Titel aus UK, Frankreich &amp; mehr</p>",
        "<p>+3&nbsp;€ pro Nutzer/Monat</p>", 3, "months", "cafeyn-addons-monthly"), "Monthly"),
    addon("Cafeyn International Press Annual EUR", addon_attrs(
        "Internationale Presse", "<p>Readly-Katalog: Titel aus UK, Frankreich &amp; mehr</p>",
        "<p>+36&nbsp;€ pro Nutzer/Jahr</p>", 36, "years", "cafeyn-addons-annual"), "1-Year Plan"),
    addon("Cafeyn Audio Podcasts Monthly EUR", addon_attrs(
        "Audio &amp; Podcasts", "<p>Artikel anhören — unterwegs und offline</p>",
        "<p>+2&nbsp;€ pro Nutzer/Monat</p>", 2, "months", "cafeyn-addons-monthly"), "Monthly"),
    addon("Cafeyn Audio Podcasts Annual EUR", addon_attrs(
        "Audio &amp; Podcasts", "<p>Artikel anhören — unterwegs und offline</p>",
        "<p>+24&nbsp;€ pro Nutzer/Jahr</p>", 24, "years", "cafeyn-addons-annual"), "1-Year Plan"),
]
# price on offers lives inside attributes too (Leemeeo convention)
PRICE_BY_OFFER = {
    "Cafeyn Team Monthly EUR": (12, "months"), "Cafeyn Team Annual EUR": (120, "years"),
    "Cafeyn Business Monthly EUR": (18, "months"), "Cafeyn Business Annual EUR": (180, "years"),
    "Cafeyn Premium Monthly EUR": (12.99, "months"),
    "Cafeyn Business 25 Seats Negotiated EUR": (120, "years"),
    "Cafeyn CSE Jahreslizenz EUR": (2500, "years"),
}
for o in OFFERS:
    v, t = PRICE_BY_OFFER[o["name"]]
    o["attributes"]["price__limio"] = price(v, t)

ALL = [(a, "/limio/catalogs/1/tree/add_ons") for a in ADDONS] + \
      [(o, "/limio/catalogs/1/tree/offers") for o in OFFERS]

def create():
    for item, tree in ALL:
        delete_item(item["path"])
        job({"jobType": "creation", "updatePath": tree, "itemData": item})
        print("created", item["path"])

def ids():
    out = {}
    for item, _ in ALL:
        it = get_item(item["path"])
        if it:
            out[item["path"]] = {"id": it.get("data", {}).get("id") or it.get("id"),
                                 "version": it.get("version") or it.get("data", {}).get("version")}
        else:
            out[item["path"]] = None
    print(json.dumps(out, indent=1))
    json.dump(out, open(f"{SCRATCH}/cafeyn/ids.json", "w"), indent=1)

def _ref(ids_map, path):
    return {"path": path, "id": ids_map[path]["id"], "label": path.split("/")[-1]}

def _addon_items(ids_map, paths):
    return [{"path": p, "id": ids_map[p]["id"]} for p in paths]

def wire():
    ids_map = json.load(open(f"{SCRATCH}/cafeyn/ids.json"))
    TM = "/offers2/Cafeyn Team Monthly EUR"
    TA = "/offers2/Cafeyn Team Annual EUR"
    BM = "/offers2/Cafeyn Business Monthly EUR"
    BA = "/offers2/Cafeyn Business Annual EUR"
    PR = "/offers2/Cafeyn Premium Monthly EUR"
    IPM = "/add_ons/Cafeyn International Press Monthly EUR"
    IPA = "/add_ons/Cafeyn International Press Annual EUR"
    AUM = "/add_ons/Cafeyn Audio Podcasts Monthly EUR"
    AUA = "/add_ons/Cafeyn Audio Podcasts Annual EUR"

    CROSS_M = {"item_label": "cafeyn-addons-monthly", "item_type": "add_on", "items": _addon_items(ids_map, [IPM, AUM])}
    CROSS_A = {"item_label": "cafeyn-addons-annual", "item_type": "add_on", "items": _addon_items(ids_map, [IPA, AUA])}

    WIRING = {
        TM: {"upgrade_offers__limio": [_ref(ids_map, BM), _ref(ids_map, TA)],
             "cross_sell_addons__limio": CROSS_M,
             "upsell_display_name__limio": "<p>Upgrade auf Business</p>",
             "upsell_display_description__limio": "<p>Audio-Artikel &amp; Lese-Analysen für 6&nbsp;€ mehr pro Nutzer und Monat.</p>",
             "upgrade_cta__limio": "Jetzt upgraden"},
        TA: {"upgrade_offers__limio": [_ref(ids_map, BA)],
             "cross_sell_addons__limio": CROSS_A,
             "upsell_display_name__limio": "<p>Upgrade auf Business</p>",
             "upsell_display_description__limio": "<p>Audio-Artikel &amp; Lese-Analysen für 5&nbsp;€ mehr pro Nutzer und Monat.</p>",
             "upgrade_cta__limio": "Jetzt upgraden"},
        BM: {"upgrade_offers__limio": [_ref(ids_map, BA)],
             "downgrade_offers__limio": [_ref(ids_map, TM)],
             "cross_sell_addons__limio": CROSS_M,
             "upsell_display_name__limio": "<p>Jährlich zahlen und sparen</p>",
             "upsell_display_description__limio": "<p>Mit jährlicher Abrechnung sparen Sie 17&nbsp;%.</p>",
             "upgrade_cta__limio": "Jetzt upgraden",
             "downgrade_cta__limio": "Zu Team wechseln"},
        BA: {"downgrade_offers__limio": [_ref(ids_map, TA)],
             "cross_sell_addons__limio": CROSS_A,
             "downgrade_cta__limio": "Zu Team wechseln"},
        PR: {"upgrade_offers__limio": [_ref(ids_map, TM), _ref(ids_map, TA)],
             "upsell_display_name__limio": "<p>Für Ihr Unternehmen: Cafeyn for Business</p>",
             "upsell_display_description__limio": "<p>Die ganze Presse für Ihr Team — pro Nutzer abgerechnet, jederzeit anpassbar.</p>",
             "upgrade_cta__limio": "Auf Team upgraden"},
    }

    by_path = {o["path"]: o for o in OFFERS}
    for path, extra in WIRING.items():
        item = by_path[path]
        item["attributes"].update(extra)
        delete_item(path)
        job({"jobType": "creation", "updatePath": "/limio/catalogs/1/tree/offers", "itemData": item})
        # verify id unchanged
        it = get_item(path)
        assert it["id"] == ids_map[path]["id"], f"id changed for {path}!"
        print("wired", path)

def promo():
    body = {
        "name": "CAFEYN20",
        "id": "promo_code_v2-CAFEYN20",
        "data": {
            "applicationLevel": "selectedItems",
            "referencedOfferLabel": "cafeyn-b2b",
            "description": "20 % Rabatt im ersten Jahr - DACH Launch (Cafeyn B2B Demo)",
            "promoCode": "CAFEYN20",
            "status": True,
            "discount": {
                "discountType": "DiscountPercentage",
                "percentageDiscount": 20,
                "durationLength": 1,
                "durationType": "Years",
            },
            "productDetails": {
                "product": {"path": "/products/Discount"},
                "ratePlan": {"path": "Discount 20%"},
            },
            "usage": {"availableQuantity": None},
        },
    }
    st, res = req("POST", "/api/objects/limio/promo_codes_v2", body)
    print("promo:", st, str(res)[:300])

if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "create"
    {"create": create, "ids": ids, "wire": wire, "promo": promo}[cmd]()
