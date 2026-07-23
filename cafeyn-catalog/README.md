# Cafeyn B2B demo — catalog & page factory (saas-dev)

Scripts that build the Cafeyn demo's offer catalog and `ca-*` landing/self-service
pages on **saas-dev.prod.limio.com** via the Limio REST API. Committed so the work
survives a machine reboot (the working copies lived in a scratchpad).

## Layout
- `cafeyn/catalog.py` — offers/add-ons/promo creation (OAuth, jobs API, delete+recreate).
- `cafeyn/pages.py` — `ca-*` page factory (build/publish landing + self-service pages).
- `cafeyn/publish_via_pages.py` — publishes add-ons + sales offers via the **shop-build**
  path (which expands `products`), then re-runs the `published_items` indexer.
- `recon/*.json` — page/offer templates cloned from existing saas-dev tenants (needed by
  `pages.py` `tpl()`).

## Prerequisites
- **`.limio.json`** at the repo root (gitignored) with `{clientId, clientSecret}` — the
  OAuth client-credentials. Or set `LIMIO_CREDS=/path/to/.limio.json`.
- Python 3 (stdlib only).

## Common commands
```bash
cd cafeyn-catalog/cafeyn
python3 catalog.py create        # create offers + add-ons
python3 pages.py tags            # create /tags/ca-* routing tags
python3 pages.py pages           # delete+recreate all ca-* page records
python3 pages.py build "CA Pricing"   # shop build for one/more pages
python3 pages.py publish         # publish built pages against last build
python3 publish_via_pages.py     # publish add-ons + sales offers via build path + reindex
```

## Known env issue (2026-07-23) — why offers may not appear in `/api/offers`
The `published_items` search index (what Salesforce/LFS reads) was blocked by a chain of
**environment** bugs, not the Cafeyn build:
1. Shared ES cluster `dev-limio-com-cat` hit its 2000-shard ceiling → indexer couldn't
   create the index. (Fixed by platform.)
2. A poison doc (`/offers2/Harnessing AI in Health and Medical Communication`, null
   product) failed the all-or-nothing indexer run → deleted (snapshot kept).
3. **LI-11523**: the manual/direct "Publish" button stores `data.products` as raw path
   **strings**; the `published_items` index requires expanded **objects**, so those docs
   throw `mapper_parsing_exception`. The **shop-build/page publish** path expands products
   (safe); the button does not. The indexer is all-or-nothing, so any string-state doc
   blocks promotion of everything.

**Clean fix:** deploy **PR #14832** (`innovate42-service-template`) to saas-dev — maps
`data.products` as `{type: object, enabled: false}` so unexpanded strings no longer fail
the indexer. Then everything already published promotes; no page-publish dance needed.

**Manual fallback:** re-publish *every* Cafeyn offer + add-on via the shop-build pages
(CA Pricing + CA Sales + CA Addons To Publish), ensuring none is left in the manual-
published string state, then re-run the indexer. Note: on saas-dev this did not reliably
re-expand every item (CSE + add-ons still failed after a build publish), so #14832 is
preferred.
