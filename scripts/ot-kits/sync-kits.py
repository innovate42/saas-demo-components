#!/usr/bin/env python3
"""Create the Limio add-ons for the OpenText trading partner kits (and the
Extra Partner Pack) on saas-dev, from kits.json.

Each kit is a zero-priced, annual add-on per currency that points at the Zuora
rate plan named after its kit ID (on "OT Business Network Add-ons"), and carries
the kit ID in kit_id__limio so it reaches Zuora, Salesforce and provisioning.

Create the Zuora rate plans first (one per kit ID). Existing add-ons are left
alone, so the script can be re-run after Anatoly's list replaces kits.json.

    python3 sync-kits.py [--dry-run] [--only TPK-WALMART-US]
"""
import argparse
import json
import os
import subprocess
import sys
import tempfile
import time

HERE = os.path.dirname(os.path.abspath(__file__))
ENV = "saas-dev"
PRODUCT = "/products/OT Business Network Add-ons"
LABELS = ["otaddons", "ottg", "otall"]
SYMBOL = {"USD": "$", "GBP": "£", "EUR": "€"}

# Extra Partner Pack: +5 kits, billed annually
PACK = {"USD": "4200.00", "GBP": "3360.00", "EUR": "3780.00"}


def limio(*args, data=None):
    cmd = ["limio", *args, "-e", ENV]
    if data is not None:
        with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False) as f:
            json.dump(data, f)
        cmd += ["--data", "@" + f.name, "--allow-prod"]
    out = subprocess.run(cmd, capture_output=True, text=True)
    return out.returncode, (out.stdout + out.stderr).replace("limio 0.5.2 is available (you have 0.4.0). Update: limio install\n", "")


def exists(path, tries=1):
    # a new item takes a few seconds to become readable
    for i in range(tries):
        code, out = limio("catalog", "get", path)
        if code == 0 and '"path"' in out:
            return True
        if i + 1 < tries:
            time.sleep(3)
    return False


def price(value, currency):
    return [{
        "name": "charge_1", "label": "Charge 1", "value": value, "currencyCode": currency,
        "type": "recurring", "trigger": "order_date", "use_external_price": False,
        "repeat_interval": 1, "repeat_interval_type": "years", "repeat_count": 1,
        "delay_interval": None, "delay_interval_type": "months", "subscription_start_day": "asap",
        "attributes": [],
    }]


def item(name, rate_plan, attributes):
    return {
        "name": name,
        "record_type": "add_on",
        "baseTemplate": "/config/templates/add_ons/default",
        "path": "/add_ons/" + name,
        "products": [PRODUCT],
        "productBundles": [{"product_path": PRODUCT, "revenue_split": "100", "rate_plan": rate_plan}],
        "attributes": attributes,
    }


def kit_item(kit, currency):
    name = "OT Kit %s %s" % (kit["kitId"], currency)
    desc = "<p>Pre-built %s trading partner kit: document maps, connection and test plan.</p>" % kit["partner"]
    return item(name, kit["kitId"], {
        "display_name__limio": "%s trading partner kit" % kit["partner"],
        "type__limio": "standard",
        "price__limio": price("0.00", currency),
        "display_external_price": "<p>Included</p>",
        "description__limio": desc,
        "label__limio": LABELS,
        "sales_channel__limio": ["Online", "Salesforce"],
        "group__limio": "yearly",
        "default_quantity_options__limio": {},
        "allow_multibuy__limio": False,
        "addon_key__limio": "kit_" + kit["kitId"].lower().replace("-", "_"),
        "kit_id__limio": kit["kitId"],
        "kit_partner__limio": kit["partner"],
        "kit_region__limio": kit["region"],
    })


def pack_item(currency):
    v = PACK[currency]
    monthly = int(float(v) / 12)
    return item("OT Extra Partner Pack Annual %s" % currency, "Extra Partner Pack Annual", {
        "display_name__limio": "Extra partner pack",
        "type__limio": "standard",
        "price__limio": price(v, currency),
        "display_external_price": "<p>%s%s/month, billed annually</p>" % (SYMBOL[currency], monthly),
        "description__limio": "<p>Five more trading partner kits, up to 50 partners in total.</p>",
        "crosssell_display_name__limio": "<p>Extra partner pack</p>",
        "crosssell_display_description__limio": "<p>Five more trading partner kits, up to 50 partners in total.</p>",
        "label__limio": LABELS,
        "sales_channel__limio": ["Online", "Salesforce"],
        "group__limio": "yearly",
        "default_quantity_options__limio": {},
        "allow_multibuy__limio": True,
        "addon_key__limio": "partner_pack",
    })


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--only", help="a kit ID, or PACK")
    args = ap.parse_args()

    kits = json.load(open(os.path.join(HERE, "kits.json")))["kits"]
    items = []
    if not args.only or args.only == "PACK":
        items += [pack_item(c) for c in ("USD", "GBP", "EUR")]
    for k in kits:
        if args.only and args.only != k["kitId"]:
            continue
        items += [kit_item(k, c) for c in ("USD", "GBP", "EUR")]

    created, skipped, failed = 0, 0, []
    for it in items:
        if exists(it["path"]):
            skipped += 1
            continue
        if args.dry_run:
            print("would create", it["path"])
            continue
        code, out = limio("catalog", "create", it["path"], data=it)
        if code == 0 and exists(it["path"], tries=5):
            created += 1
            print("created", it["path"])
        else:
            failed.append((it["path"], out.strip()[:300]))
            print("FAILED", it["path"], out.strip()[:300], file=sys.stderr)
    print("created %d, already there %d, failed %d" % (created, skipped, len(failed)))
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
