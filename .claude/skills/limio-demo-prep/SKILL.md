---
name: limio-demo-prep
description: Build a full, credible Limio sales demo end-to-end (catalog, branded pricing page, self-service pages) from a prospect domain + discovery call, then autonomously place and verify a new order AND a plan-change/upgrade on saas-dev. Use when preparing a Limio demo for a named prospect ("demo with <Prospect>, here's their site + the discovery call").
---

# Limio Demo Prep

Stand up a complete, credible Limio demo for a prospect on the `saas-dev` tenant,
then prove it works by transacting against it — a new order **and** a
plan-change/upgrade — before demo day.

**The canonical, step-by-step procedure is [`DEMO-BUILDER-PLAYBOOK.md`](../../../DEMO-BUILDER-PLAYBOOK.md)
in the repo root. Read it and follow it.** (From a normal checkout it's at the
repo root: `DEMO-BUILDER-PLAYBOOK.md`.) It contains the exact CLI commands,
field-level catalog details, and the hard-won sequencing gotchas. This file is
just the entry point.

## Procedure (summary — the playbook is authoritative)

1. **Gather inputs (§0).** Prospect **domain**, the **Granola discovery call**
   (pull it with the Granola tools if not pasted), and answer the clarifying
   questions — pricing model, tiers, billing frequency, currency/geo, payment
   methods, self-serve vs sales-assisted vs B2C→B2B, add-ons, upgrade story,
   language, **and whether LFS (Limio for Salesforce) is in scope**. Produce a
   short blueprint and **confirm it with the operator before building.**
2. **Brand (§1).** Extract palette/typography/voice from the domain →
   `<SLUG>-DESIGN-LANGUAGE.md`; mirror their real `/pricing`.
3. **Catalog (§2).** Products → offers (tier × frequency, **`invoice` payment
   enabled**) → labels (flat, ASCII, no drift) → cross-sell add-ons →
   upsell/downgrade/upgrade wiring → sales/enterprise → promo. In-place
   `limio catalog put --set` only; never delete+recreate.
4. **Pages (§3).** **Custom components for the PRICING page only**; **stock
   Limio components + in-app `pageStyle`** for every other page. Pricing stays
   public; all self-service pages get the tenant's **Anonymous Auth** provider.
5. **Build & publish (§4).** One page at a time; merge any component PR first;
   verify with `limio doctor` + `/api/offers/v2`; allow for CloudFront cache.
6. **Verify (§5).** Autonomously place a **new order** and a **plan change** (via
   the admin API and/or the browser self-service flow with invoice + anonymous
   auth + native-click), and confirm each `process_event` is
   `processed` / `criticalPluginErrors: []`.
7. **Script (§7).** Emit `<SLUG>-DEMO-SCRIPT.md` (acts mapped to the prospect's
   pains, click-counts, URLs, runbook).

## Guardrails

- **Use the Limio CLI for everything** (`limio docs` first). First-time:
  `limio env list` → `limio login <env>` → `limio whoami`.
- `saas-dev` is **production** — pass `--allow-prod` only with the operator's
  explicit approval for that specific change. **Ask before any write.**
- Never handle or paste raw tokens / client-secrets — the CLI manages auth.
- A UI-green order can still fail downstream — always check the `process_event`.
