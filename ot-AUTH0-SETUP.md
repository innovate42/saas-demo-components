# OpenText Business Network — branded login (Auth0) setup

> **Status, 3 Nov 2026: ready to apply, not applied.** The OT portal pages run on saas-dev's
> Anonymous Auth (`saas-dev-shop.prod.limio.com`) so the demo works today. This adds an
> OpenText-branded sign-in ("My OpenText") for the self-service portal, following the
> `limio-media-auth0` recipe on stripe-demo (itself cloned from `brentford-auth0`).
> Two steps need a person: editing the **shared** Auth0 login page, and pasting the client
> secret into Limio. About 20 minutes.

Pages that should require login: `OT Account`, `OT Direct Update`, `OT Direct Update Sub`,
`OT Invoices`, `OT Payment Methods`, `OT Cancel`. **Store, buying pages, checkout and confirm stay on
Anonymous Auth** (guest checkout, like buy.webroot.com), so the purchase never stops at a login wall.

## 1. Auth0: create the app

Tenant `limio` (https://manage.auth0.com/dashboard/us/limio/) → Applications → Create Application →
**OpenText Business Network** (Regular Web Application).

| Setting | Value |
|---|---|
| Application Login URI | `https://saas-dev-shop.prod.limio.com/api/sf` |
| Allowed Callback URLs | `https://saas-dev-shop.prod.limio.com/api/sf`, `https://saas-dev-shop.prod.limio.com`, `https://saas-dev-shop.prod.limio.com/api/sf/auth/opentext-auth0/callback` |
| Allowed Logout URLs | `https://saas-dev-shop.prod.limio.com/api/sf/logout` |
| Allowed Web Origins | `https://saas-dev-shop.prod.limio.com` |
| Connections | Username-Password-Authentication (sign-up on), google-oauth2. Turn the others off. |

Copy the **Client ID**; keep the secret for step 3.

## 2. Auth0: theme the login page

Branding → Universal Login → Advanced Options → Login → Customize Login Page. **Back up the page
first** (it is shared by every brand) and re-check Brentford after saving.

**CSS**, next to the other `.theme-…` blocks:

```css
.theme-opentext { --primary: #0066FF; --primary-hover: #024CBB; --primary-soft: rgba(0, 102, 255, 0.12); --primary-shadow: rgba(0, 102, 255, 0.18); --primary-shadow-hover: rgba(0, 102, 255, 0.35); --accent: #0066FF; --bg-page: #FFFFFF; --bg-panel: #F6F7F7; --header-bg: #FFFFFF; --header-fg: #101C2F; --brand-font: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; }
.theme-opentext .top-bar { display: flex; border-bottom: 1px solid #E7EAEF; }
.theme-opentext .page { min-height: calc(100vh - 61px); }
.theme-opentext .brand-panel { background: linear-gradient(135deg, #024CBB 11%, #000066 48%); color: #FFFFFF; justify-content: center; gap: 36px; }
.theme-opentext .brand-eyebrow, .theme-opentext .brand-headline, .theme-opentext .brand-sub, .theme-opentext .brand-features { color: #FFFFFF; }
.theme-opentext .brand-eyebrow::before { background: #A9C6FF; }
.theme-opentext .brand-headline { font-weight: 800; letter-spacing: -0.02em; }
.theme-opentext .brand-headline .accent { color: #A9C6FF; }
.theme-opentext .auth0-lock.auth0-lock .auth0-lock-widget { border-radius: 16px !important; box-shadow: 0 12px 40px rgba(16, 28, 47, 0.14) !important; }
.theme-opentext .auth0-lock.auth0-lock .auth0-lock-submit { border-radius: 16px !important; }
```

**JS**, a new entry in `CLIENT_THEMES` (replace `<OT_CLIENT_ID>`):

```js
      // ─── OpenText Business Network (saas-dev demo) ───
      '<OT_CLIENT_ID>': {
        themeClass: 'theme-opentext',
        pageTitle: 'Sign in to OpenText Business Network',
        topBar: {
          metaHtml: '<a href="https://saas-dev-shop.prod.limio.com/ot-store">Back to the store</a>'
        },
        brand: {
          eyebrow: 'OpenText Business Network · My account',
          headline: 'Your trading partners, <span class="accent">one sign-in</span>',
          sub: 'Manage your Trading Grid and B2B Integration Essentials subscriptions, add partners, and download invoices.',
          features: [
            'Add trading partners in a click',
            'Change plan or billing term any time',
            'Invoices and payment methods, self-serve'
          ],
          featureIconColor: '#FFFFFF'
        },
        support: { href: 'https://www.opentext.com/about/contact-us', label: 'Contact us', preLabel: 'Need help signing in?' },
        lock: {
          type: 'standard',
          primaryColor: '#0066FF',
          allowSignUp: true,
          languageDictionary: { title: 'My OpenText', loginLabel: 'Sign in', signUpLabel: 'Create account' }
        }
      },
```

## 3. Limio: add the auth provider

saas-dev admin → Developer Settings → Authentication Providers → add an OpenID Connect provider
named **`opentext-auth0`**. Copy every field from an existing Auth0 provider; only the client changes:

| Field | Value |
|---|---|
| issuer | `https://limio.us.auth0.com/` (keep the trailing slash) |
| authorization_endpoint | `https://limio.us.auth0.com/authorize` |
| token_endpoint | `https://limio.us.auth0.com/oauth/token` |
| jwks_uri | `https://limio.us.auth0.com/.well-known/jwks.json` |
| client_id / client_secret | from step 1 (secret pasted by hand) |
| scope | `openid profile email` |
| token_endpoint_type | `POST` |

Check it with `limio api GET /api/connect/authprovider -e saas-dev` (it should list `opentext-auth0`
with `record_variant: "openid_connect"`).

**CSP**: add `https://limio.us.auth0.com` under Developer → Allowed Hosts (it feeds the shop CSP
`frame-src`, used by Auth0 silent auth). Propagates in about 10 minutes; no rebuild.

## 4. Switch the portal pages and republish

```bash
for p in "OT Account" "OT Direct Update" "OT Direct Update Sub" "OT Invoices" "OT Payment Methods" "OT Cancel"; do
  limio catalog put "pages2/$p" --set 'data.pageAuthProvider="opentext-auth0"' -e saas-dev
  limio publish "$p" -e saas-dev
done
```

Auth is baked in at build time: republish, then hard-reload. To roll back to guest access set
`data.pageAuthProvider="saas-dev-shop.prod.limio.com"` and republish.

Known limits (from Brentford): custom claims don't reach the page even with *Expose in Shop Token*.
Untested here: whether a guest order shows in the account after signing in with the same email. If it
doesn't, place the dry-run order while signed in (put Checkout on `opentext-auth0` too).
