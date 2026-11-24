# OpenText trading partner kits (Business Central pilot demo)

`kits.json` is the placeholder kit list: one kit per partner in the ot-buy
directory, ID `TPK-<PARTNER>-<COUNTRY>`. Swap in Anatoly's pilot list here.

To roll a new list out:
1. Zuora: one zero-priced annual rate plan per kit ID on "OT Business Network
   Add-ons" (fed14bdfef2c4f6cbabfb402aba4b534), named exactly the kit ID.
2. `python3 sync-kits.py`: creates `/add_ons/OT Kit <ID> <USD|GBP|EUR>` (label
   otaddons/ottg/otall, `kit_id__limio`) and the Extra Partner Pack add-ons.
   Existing items are skipped.
3. Regenerate `components/ot-buy/kits.js` (partner name → kit ID) from the JSON.
4. Republish OT Addons To Publish, OT Trading Grid and OT Checkout.

`update-foundation-offers.py` reprices the Foundation 5/10 annual offers
(adapter and kits included, invoice only).
