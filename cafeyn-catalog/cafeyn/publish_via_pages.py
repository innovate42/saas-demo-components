#!/usr/bin/env python3
"""Publish add-ons + sales offers via the SHOP-BUILD path (expands products →
indexer-safe), bypassing the manual/direct-publish bug (LI-11523).
Creates two dummy landing pages that embed the items in page.offers[] +
referencedLabel, builds each, publishes each, then re-runs the indexer."""
import json, subprocess, sys, time
import catalog, pages

ADDONS = [
    "/add_ons/Cafeyn International Press Monthly EUR",
    "/add_ons/Cafeyn International Press Annual EUR",
    "/add_ons/Cafeyn Audio Podcasts Monthly EUR",
    "/add_ons/Cafeyn Audio Podcasts Annual EUR",
]

def normalise_25seats_label():
    p = "/offers2/Cafeyn Business 25 Seats Negotiated EUR"
    cur = catalog.get_item(p)["data"]
    if cur["attributes"].get("label__limio") == ["cafeyn-sales"]:
        print("25 Seats label already cafeyn-sales"); return
    attrs = dict(cur["attributes"]); attrs["label__limio"] = ["cafeyn-sales"]
    rec = {"name": cur["name"], "record_type": "offer", "path": p,
           "baseTemplate": "/config/templates/offers/default", "attributes": attrs,
           "products": ["/products/For Demo Product"],
           "productBundles": cur.get("productBundles")}
    catalog.delete_item(p)
    catalog.job({"jobType": "creation", "updatePath": "/limio/catalogs/1/tree/offers2", "itemData": rec})
    print("25 Seats relabelled -> cafeyn-sales")

def ensure_tag(t):
    if not catalog.get_item(f"/tags/{t}"):
        catalog.job({"jobType": "creation", "updatePath": "/limio/catalogs/1/tree/tags",
                     "itemData": {"name": t, "record_type": "tag", "path": f"/tags/{t}",
                                  "baseTemplate": "/config/templates/tags/default",
                                  "attributes": {"display_name__limio": t}}})
        print("tag created:", t)

_saas = pages.tpl("page-Saas_Pricing_Page.json")
def mkpage(name, tag, offer_paths, label):
    nav = pages.native_from(_saas["assets"], "/assets/components/nav-header")
    nav["props"] = pages.nav_props(items=[{"login__limio_boolean": False, "button__limio_boolean": False,
                                           "label": "Mein Konto", "href": "/ca-account"}])
    assets = [nav, pages.custom("cafeyn-offers", "body", {})]
    return pages.page_record(name, tag, assets, referenced_label=label,
                             offer_paths=offer_paths, meta_title=name)

def build_publish(name, tag):
    out = subprocess.run([sys.executable, "pages.py", "build", name], capture_output=True, text=True).stdout
    bid = json.loads(out.split("build: 200 ")[1])["id"]
    print(name, "build", bid, flush=True)
    for _ in range(30):
        r = catalog.req("POST", "/api/publish", {"tags": [f"/tags/{tag}"], "buildId": bid, "name": f"pub {tag}"})[1]
        bad = r.get("ommitedWithError", {}).get("pages", {}) if isinstance(r, dict) else {"x": 1}
        if f"/{tag}/" not in bad:
            print(name, "PUBLISHED", flush=True); return
        time.sleep(20)
    print(name, "OMITTED/FAILED", flush=True)

if __name__ == "__main__":
    normalise_25seats_label()
    for t in ["ca-sales", "ca-addons-to-publish"]:
        ensure_tag(t)
    for name, tag, paths, label in [
        ("CA Sales", "ca-sales", pages.SALES_OFFERS, "cafeyn-sales"),
        ("CA Addons To Publish", "ca-addons-to-publish", ADDONS, "cafeynaddons"),
    ]:
        pg = mkpage(name, tag, paths, label)
        catalog.delete_item(pg["path"])
        catalog.job({"jobType": "creation", "updatePath": "/limio/catalogs/1/tree/pages", "itemData": pg})
        print("page created:", pg["path"], flush=True)
        build_publish(name, tag)
    # re-run indexer
    print("\n--- reindex ---", flush=True)
    st, res = catalog.req("POST", "/limio/jobs", {"jobType": "indexer", "indexerType": "published_items"})
    jid = res.get("id")
    s = None
    for _ in range(120):
        time.sleep(2); s = catalog.req("GET", f"/limio/jobs/{jid}")[1]
        if isinstance(s, dict) and s.get("state") in ("completed", "failed"): break
    print("indexer:", s.get("state") if isinstance(s, dict) else s, flush=True)
    if isinstance(s, dict) and s.get("state") == "failed":
        try:
            j = json.loads(s.get("failedReason", "").split("Bulk indexing failed", 1)[1])
            print("summary:", j.get("results", {}).get("summary"), flush=True)
        except Exception:
            print(s.get("failedReason", "")[:200], flush=True)
    time.sleep(3)
    r = catalog.req("GET", "/api/offers")[1]
    caf = [it for it in r.get("items", []) if "Cafeyn" in str(it["data"].get("name"))]
    print("commit:", r.get("commitId"), "| Cafeyn offers indexed:", len(caf), flush=True)
    for c in caf:
        print("   OFFER", c["data"].get("name"), "|", c["data"].get("attributes", {}).get("label__limio"), flush=True)
    ra = catalog.req("GET", "/api/add_ons")[1]
    cafa = [it for it in ra.get("items", []) if "Cafeyn" in str(it["data"].get("name"))]
    print("Cafeyn add-ons indexed:", len(cafa), flush=True)
    for c in cafa:
        print("   ADDON", c["data"].get("name"), flush=True)
    print("=== done ===", flush=True)
