#!/usr/bin/env python3
"""Reprice the Trading Grid Foundation annual offers for the Business Central
pilot (adapter and kits included, invoice only) on saas-dev.

Each offer is read live and changed in place with `limio catalog put`.

    python3 update-foundation-offers.py [--dry-run]
"""
import json
import subprocess
import sys
import tempfile

ENV = "saas-dev"
SYMBOL = {"USD": "$", "GBP": "£", "EUR": "€"}
TIERS = {
    5: {"USD": 5988, "GBP": 4790, "EUR": 5390},
    10: {"USD": 10788, "GBP": 8630, "EUR": 9710},
}


def money(n, cur):
    return "%s%s" % (SYMBOL[cur], format(n, ",.0f"))


def attrs_for(tier, cur, live):
    year = TIERS[tier][cur]
    month = round(year / 12)
    word = "five" if tier == 5 else "ten"
    features = (
        "<ul>"
        "<li><strong>Dynamics 365 Business Central adapter</strong> included, instant setup</li>"
        "<li><strong>%d trading partner kits</strong>: maps, connection and test plan per partner</li>"
        "<li>Self-service setup, live in as little as 9 days</li>"
        "<li>24x5 support</li>"
        "<li>Add partner packs of 5, up to 50 partners</li>"
        "</ul>" % tier
    )
    desc = "<p>Business Central connected to the OpenText Trading Grid, with %s trading partner kits.</p>" % word
    price = [dict(live["price__limio"][0], value="%.2f" % year)]
    return {
        "price__limio": price,
        "display_price__limio": "<p><strong>%s</strong>/month</p>" % money(month, cur),
        "detailed_display_price__limio": "<p>%d trading partner kits &middot; %s billed annually &middot; invoice, net 30</p>" % (tier, money(year, cur)),
        "offer_features__limio": features,
        "display_description__limio": desc,
        "checkout_description__limio": desc,
        "upsell_display_name__limio": "<p>Trading Grid Foundation %d &middot; %d trading partner kits</p>" % (tier, tier),
        "upsell_display_description__limio": desc,
        "payment_types__limio": ["invoice"],
    }


def run(cmd):
    out = subprocess.run(cmd, capture_output=True, text=True)
    return out.returncode, out.stdout + out.stderr


def main():
    dry = "--dry-run" in sys.argv
    failed = 0
    for tier in (5, 10):
        for cur in ("USD", "GBP", "EUR"):
            path = "/offers2/OT Trading Grid Foundation %d Annual %s" % (tier, cur)
            got = subprocess.run(["limio", "catalog", "get", path, "-e", ENV], capture_output=True, text=True).stdout
            live = json.loads(got[got.index("{"):])["data"]["attributes"]
            new = attrs_for(tier, cur, live)
            cmd = ["limio", "catalog", "put", path, "-e", ENV, "--allow-prod"]
            for k, v in new.items():
                f = tempfile.NamedTemporaryFile("w", suffix=".json", delete=False)
                json.dump(v, f)
                f.close()
                cmd += ["--set", "data.attributes.%s=@%s" % (k, f.name)]
            if dry:
                cmd.append("--dry-run")
            code, out = run(cmd)
            ok = code == 0
            failed += 0 if ok else 1
            print(("OK  " if ok else "FAIL"), path, "" if ok else out[-400:])
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
