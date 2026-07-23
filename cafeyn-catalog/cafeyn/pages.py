#!/usr/bin/env python3
"""Cafeyn B2B demo — ca-* pages on saas-dev via the Landing-Page Factory workflow.

Phases:
  python3 pages.py tags                 # create flat /tags/ca-* tags
  python3 pages.py pages [Name ...]     # delete+recreate page records (default: all)
  python3 pages.py build [Name ...]     # shop build for pages
  python3 pages.py publish              # publish all ca-* tags against last build
  python3 pages.py verify               # GET /api/pages for each + live URL status
"""
import copy, json, sys, time, uuid
import catalog  # reuse auth + job helpers

S = catalog.SCRATCH + "/recon"

def tpl(fname):
    d = json.load(open(f"{S}/{fname}"))
    return copy.deepcopy(d["items"][0]["data"])

LOGO = "https://cdn.cafeyn.co/Public/Cafeyn/images/logo/cafeyn_primary_horizontal.svg"

FONTS = '@import url("https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400..600&family=Source+Sans+3:wght@400;600&display=swap");'

PAGESTYLE = FONTS + """
html, body { background: #FFFDF9; margin: 0; }
body, p, span, label, input, select, textarea, td, th, li { font-family: "Source Sans 3", "Source Sans Pro", sans-serif; color: #211712; }
h1, h2, h3, h4 { font-family: "Newsreader", Georgia, serif; font-weight: 500; color: #211712; }
a { color: #885F46; }
.MuiButton-containedPrimary, .btn-primary, button[type="submit"].limio-checkout-button {
  background-color: #211712 !important;
  color: #FFFDF9 !important;
  font-family: "Source Sans 3", sans-serif !important;
  font-weight: 600 !important;
  border-radius: 8px !important;
  box-shadow: none !important;
  text-transform: none !important;
}
.MuiButton-containedPrimary:hover, .btn-primary:hover { background-color: #3A2B22 !important; }
.btn-primary { border-color: #211712 !important; }
.btn-outline-primary, .MuiButton-outlined {
  color: #211712 !important;
  border-color: #211712 !important;
  border-radius: 8px !important;
  font-family: "Source Sans 3", sans-serif !important;
  text-transform: none !important;
}
.card, .MuiPaper-root { border-radius: 16px !important; }
"""

ACCOUNT_PAGESTYLE = PAGESTYLE + """
/* --- CA Account: wider layout, bigger buttons, cleaner alignment --- */
#subscriptions-summary-limio { max-width: 60rem !important; padding: 1rem 1.5rem 4rem !important; }
#subscriptions-summary-limio h4 { font-size: 1.9rem !important; line-height: 1.2 !important; }
#subscriptions-summary-limio .MuiCard-root { padding: 0.5rem 0.75rem !important; border-color: #E7DBC9 !important; box-shadow: 0 1px 2px rgba(33,23,18,0.05) !important; }
/* Section heading + top action on one tidy row */
#subscriptions-summary-limio .MuiPaper-root, #subscriptions-summary-limio .MuiCard-root { background: #FFFDF9 !important; }

/* All action buttons: bigger, consistent Cafeyn look */
#subscriptions-summary-limio .MuiButton-root {
  font-size: 1rem !important;
  padding: 0.7rem 1.4rem !important;
  border-radius: 10px !important;
  min-height: 48px !important;
  text-transform: none !important;
  font-weight: 600 !important;
  letter-spacing: 0 !important;
}
#subscriptions-summary-limio .MuiButton-startIcon .MuiSvgIcon-root { font-size: 1.35rem !important; }
/* Invert icons to light on the dark (contained) buttons + dark accent chips */
#subscriptions-summary-limio .MuiButton-containedPrimary .MuiSvgIcon-root { color: #FFFDF9 !important; }
#subscriptions-summary-limio .MuiChip-root:has([data-testid="CalendarTodayIcon"]) .MuiChip-label,
#subscriptions-summary-limio .MuiChip-root:has([data-testid="CalendarTodayIcon"]) .MuiSvgIcon-root { color: #FFFDF9 !important; }

/* Primary actions -> solid Cafeyn dark */
#subscriptions-summary-limio .MuiButton-containedPrimary {
  background-color: #211712 !important; color: #FFFDF9 !important; box-shadow: none !important;
}
#subscriptions-summary-limio .MuiButton-containedPrimary:hover { background-color: #3A2B22 !important; }
/* Cancel -> outlined, muted brown */
#subscriptions-summary-limio .MuiButton-outlinedPrimary,
#subscriptions-summary-limio .btn-cancel {
  color: #885F46 !important; border-color: #C9B79D !important; background: transparent !important;
}
#subscriptions-summary-limio .btn-cancel:hover { background: #F2ECE2 !important; }

/* Action button row: even spacing, wraps neatly, aligned left */
#subscriptions-summary-limio .MuiStack-root { gap: 0.75rem !important; }
#subscriptions-summary-limio .MuiCardContent-root + .MuiDivider-root + .MuiStack-root,
#subscriptions-summary-limio .MuiCard-root .MuiStack-root:last-child {
  flex-wrap: wrap !important; align-items: stretch !important;
}
/* Detail table: roomier rows */
#subscriptions-summary-limio .subscription-details-table td { padding: 0.6rem 0.75rem !important; font-size: 0.95rem !important; }
#subscriptions-summary-limio .label-cell { color: #6B5B4E !important; }
#subscriptions-summary-limio .value-cell { color: #211712 !important; font-weight: 600 !important; }

@media (max-width: 700px){
  #subscriptions-summary-limio .MuiCard-root .MuiStack-root:last-child .MuiButton-root { flex: 1 1 100% !important; }
}
"""

CANCEL_PAGESTYLE = PAGESTYLE + """
/* --- CA Cancel: floating card, like the checkout --- */
#limio-view-layout, #body { background: #FFFDF9 !important; }
#body .container { max-width: 780px !important; margin: 2.5rem auto 0 !important; padding: 0 1.25rem !important; }
#body .contentWrapper {
  background: #FFFFFF !important; border: 1px solid #E7DBC9 !important; border-radius: 18px !important;
  box-shadow: 0 10px 30px rgba(33,23,18,0.08) !important; padding: 2.25rem 2.25rem 1.75rem !important;
  display: flex !important; gap: 2rem !important; box-sizing: border-box !important;
}
#body .contentWrapperLeft { flex: 1 1 auto !important; min-width: 0 !important; }
#body .heading { font-size: 1.9rem !important; line-height: 1.15 !important; margin: 0 0 .4rem !important; }
#body .paragraph { color: #6B5B4E !important; margin: 0 0 1.5rem !important; font-size: 1.05rem !important; }
#body .reasonListHeading { font-family: "Source Sans 3", sans-serif !important; font-size: 1rem !important; font-weight: 600 !important; margin: 0 0 .75rem !important; }
#body .reasonList { display: flex !important; flex-direction: column !important; gap: .6rem !important; }
#body .reasonListItem {
  display: flex !important; align-items: center !important; gap: .75rem !important;
  border: 1px solid #E7DBC9 !important; border-radius: 12px !important; padding: .85rem 1rem !important;
  background: #FFFDF9 !important; cursor: pointer !important; transition: border-color .15s ease, background .15s ease !important;
}
#body .reasonListItem:hover { border-color: #211712 !important; background: #F2ECE2 !important; }
#body .reasonListItemLabel { margin: 0 !important; cursor: pointer !important; font-size: 1rem !important; }
#body .textboxLabel { display: block !important; margin: 1.25rem 0 .4rem !important; font-weight: 600 !important; }
#body .textbox { width: 100% !important; border: 1px solid #E7DBC9 !important; border-radius: 12px !important; padding: .75rem 1rem !important; min-height: 92px !important; font-family: "Source Sans 3", sans-serif !important; box-sizing: border-box !important; }
#body .divider { display: none !important; }
#body .list { display: flex !important; justify-content: flex-end !important; gap: .75rem !important; max-width: 780px !important; margin: 1.25rem auto 4rem !important; padding: 0 1.25rem !important; box-sizing: border-box !important; }
#body .listItem { flex: 0 0 auto !important; margin: 0 !important; }
#body .list .listItem button, #body .list .listItem .btn {
  border-radius: 10px !important; padding: .7rem 1.5rem !important; font-weight: 600 !important;
  font-size: 1rem !important; min-height: 48px !important; text-transform: none !important; box-shadow: none !important;
  font-family: "Source Sans 3", sans-serif !important;
}
#body .list .listItem:first-child button, #body .list .listItem:first-child .btn {
  background: transparent !important; color: #885F46 !important; border: 1px solid #C9B79D !important;
}
#body .list .listItem:first-child button:hover { background: #F2ECE2 !important; }
#body .list .listItem:last-child button, #body .list .listItem:last-child .btn {
  background: #211712 !important; color: #FFFDF9 !important; border: 1px solid #211712 !important;
}
#body .list .listItem:last-child button:hover { background: #3A2B22 !important; }
@media (max-width: 700px){
  #body .contentWrapper { flex-direction: column !important; padding: 1.5rem !important; }
  #body .list { flex-direction: column-reverse !important; }
  #body .list .listItem button, #body .list .listItem .btn { width: 100% !important; }
}
"""

CHECKOUT_PAGESTYLE = PAGESTYLE + """
#limio-view-layout { max-width: 76rem !important; margin: 0 auto !important; padding: 2.5rem 2rem 4rem !important; box-sizing: border-box !important; column-gap: 3rem !important; }
#body { padding-right: 1.5rem !important; }
.limio-content, #limio-view-layout > div { box-sizing: border-box; }
.lmo .row { margin-right: 0 !important; margin-left: 0 !important; }
.lmo .form-group { margin-bottom: 0.25rem; }\n#zuora_payment { min-height: 0 !important; }\n.payment-details { min-height: 0 !important; }
@media (max-width: 1024px){ #limio-view-layout { padding: 1.5rem 1.25rem 3rem !important; } #body { padding-right: 0 !important; } }
"""

def aid():
    return str(uuid.uuid4())

def fresh_ids(assets):
    for a in assets:
        a["id"] = aid()
        props = a.get("props") or {}
        for sc in props.get("subcomponentMetadata", []) or []:
            sc["id"] = aid()
    return assets

def custom(name, position, props):
    return {
        "path": f"/custom-components-2/{name}", "id": aid(), "position": position,
        "asset": {"contentType": "text/javascript", "url": f"/public/{name}"},
        "contentType": "text/javascript", "url": f"/public/{name}", "props": props,
    }

def native_from(template_assets, path, position=None):
    """Copy a native /assets/components entry (asset url shape) from a template."""
    for a in template_assets:
        if a["path"] == path and (position is None or a.get("position") == position):
            c = copy.deepcopy(a)
            c["id"] = aid()
            return c
    raise KeyError(f"{path} not in template")

NAV_ACCOUNT_ITEMS = [
    {"login__limio_boolean": False, "button__limio_boolean": True, "label": "Abonnement", "href": "/ca-account"},
    {"login__limio_boolean": False, "button__limio_boolean": False, "label": "Rechnungen", "href": "/ca-invoices"},
    {"login__limio_boolean": False, "button__limio_boolean": False, "label": "Zahlungsmethoden", "href": "/ca-payment-methods"},
]

def nav_props(items=None, logo_href="/ca-pricing"):
    return {"logo": LOGO, "logoHref": logo_href, "shadow": True, "fixedTop": False,
            "showProfile": False, "items": items if items is not None else []}

REQUIRED_DE = "Dieses Feld ist erforderlich"

def limio_field(label, name, ftype="input", col=6, required=False, disabled=False,
                select_options=None, checkbox_options=None, tooltip=""):
    return {
        "path": "/limio-components/field", "component": "LimioField", "conditionProps": [],
        "name": "Field", "id": aid(),
        "componentProps": {
            "col": str(col), "minlength": "", "invalidMessage": REQUIRED_DE, "hidden": False,
            "max": "", "maxlength": "", "radioOptions": [], "selectOptions": select_options or [],
            "toolTipMessage": tooltip, "phoneNumberPicklist": False, "label": label,
            "type": ftype, "maxDaysFuture": None, "required": required, "fieldClassName": "",
            "regex": "", "min": "", "name": name, "disabled": disabled, "minDaysFuture": None,
            "checkboxOptions": checkbox_options or [],
        },
    }

def form_text(html, col=12):
    return {"path": "/limio-components/display-text", "component": "LimioFormText",
            "conditionProps": [], "name": "Display Text", "id": aid(),
            "componentProps": {"fieldClassName": "", "col": col, "text": html}}

def name_email_fields(disabled):
    out = []
    for comp, path, label in [("LimioFirstNameField", "first-name-field", "Vorname"),
                              ("LimioLastNameField", "last-name-field", "Nachname"),
                              ("LimioEmailField", "email-field", "E-Mail")]:
        out.append({"path": f"/limio-components/{path}", "component": comp, "conditionProps": [],
                    "name": label, "id": aid(),
                    "componentProps": {"fieldClassName": "", "col": "6", "minlength": "", "regex": "",
                                       "invalidMessage": REQUIRED_DE, "maxlength": "", "toolTipMessage": "",
                                       "disabled": disabled, "label": label}})
    return out

def address_fields_de(template_assets):
    """Copy the AddressFields subcomponent from the AL form and Germanize."""
    for a in template_assets:
        for sc in (a.get("props") or {}).get("subcomponentMetadata", []) or []:
            if sc["component"] == "AddressFields":
                c = copy.deepcopy(sc)
                c["id"] = aid()
                cp = c["componentProps"]
                cp["addressFieldsIncluded"] = ["address1", "city", "postalCode", "country"]
                cp.update({
                    "heading": "", "address1Label": "Adresszeile 1",
                    "address2Label": "Adresszeile 2 (optional)", "streetNameLabel": "Straße",
                    "cityLabel": "Stadt", "postalCodeLabel": "PLZ", "stateLabel": "Bundesland",
                    "countryLabel": "Land", "companyLabel": "Firma",
                    "invalidAddressMessage": "Adresse ist erforderlich",
                    "invalidCityMessage": "Stadt ist erforderlich",
                    "invalidPostalCodeMessage": "PLZ ist erforderlich",
                    "invalidStateMessage": "Bundesland ist erforderlich",
                    "invalidCountryMessage": "Land ist erforderlich",
                    "compactAddressPlaceholderText": "Adresse eingeben ...",
                    "compactAddressFormLabel": "Straße oder PLZ",
                    "sameAddressCheckboxLabel": "Rechnungsadresse entspricht Lieferadresse",
                })
                return c
    raise KeyError("AddressFields not found")

def payment_subcomponents(template_assets):
    out = []
    for a in template_assets:
        for sc in (a.get("props") or {}).get("subcomponentMetadata", []) or []:
            if sc["component"] in ("LimioPaymentMethodSelectorField", "LimioPaymentManagerField"):
                c = copy.deepcopy(sc)
                c["id"] = aid()
                if c["component"] == "LimioPaymentManagerField":
                    c["componentProps"]["invalidPaymentMethodMessage"] = (
                        "Hoppla! Etwas ist schiefgelaufen. Bitte versuchen Sie es gleich noch einmal.")
                out.append(c)
    return out

def terms_checkbox():
    return limio_field(" ", "customerDetails.terms", ftype="checkbox", col=12, required=True,
                       checkbox_options=[{
                           "id": "agb", "required": True,
                           "invalidMessage": "Bitte akzeptieren Sie die AGB",
                           "toolTipMessage": "",
                           "value": "<p>Ich akzeptiere die AGB und die Datenschutzerklärung von Cafeyn.</p>",
                       }])

SECTOR_OPTIONS = [
    {"name": "", "id": "none"},
    {"name": "Medien & Verlage", "id": "medien"},
    {"name": "Bibliothek", "id": "bibliothek"},
    {"name": "Hochschule", "id": "hochschule"},
    {"name": "Hotellerie", "id": "hotellerie"},
    {"name": "Sonstiges", "id": "sonstiges"},
]

# ------------------------------------------------------------------ pages

_offer_ref_cache = {}

def resolve_offers(paths):
    out = []
    for p in paths:
        if p not in _offer_ref_cache:
            it = catalog.get_item(p)
            _offer_ref_cache[p] = {"path": p, "id": it["id"], "version": it.get("version")}
        out.append(_offer_ref_cache[p])
    return out

B2B_OFFERS = ["/offers2/Cafeyn Team Monthly EUR", "/offers2/Cafeyn Team Annual EUR",
              "/offers2/Cafeyn Business Monthly EUR", "/offers2/Cafeyn Business Annual EUR"]
SALES_OFFERS = ["/offers2/Cafeyn Business 25 Seats Negotiated EUR", "/offers2/Cafeyn CSE Jahreslizenz EUR"]
SAVE_OFFERS = ["/offers2/Cafeyn Treueangebot 20 EUR"]

def page_record(name, tag, assets, page_style=PAGESTYLE, referenced_label=None,
                meta_title=None, extra_attributes=None, offer_paths=None,
                base_template="/config/templates/pages/default",
                authenticated=False, auth_provider=""):
    attrs = {"meta_title__limio": meta_title or f"{name} – Cafeyn", "label__limio": ["cafeyn"]}
    if extra_attributes:
        attrs.update(extra_attributes)
    rec = {
        "name": name, "record_type": "page", "path": f"/pages2/{name}",
        "baseTemplate": base_template,
        "tags": [f"/tags/{tag}"], "isAuthenticated": authenticated,
        "pageAuthProvider": auth_provider,
        "offers": resolve_offers(offer_paths) if offer_paths else [],
        "attributes": attrs, "pageStyle": page_style, "assets": assets,
    }
    if referenced_label:
        rec["referencedLabel"] = referenced_label
    return rec

def build_ca_pricing():
    saas = tpl("page-Saas_Pricing_Page.json")
    nav = native_from(saas["assets"], "/assets/components/nav-header")
    nav["props"] = nav_props(items=[
        {"login__limio_boolean": False, "button__limio_boolean": False, "label": "Mein Konto", "href": "/ca-account"},
    ])
    assets = [
        nav,
        custom("cafeyn-hero", "body", {}),
        custom("cafeyn-offers", "body", {}),
        custom("cafeyn-covers-band", "body", {}),
        custom("faq-accordion", "body", {
            "headline": "Häufige Fragen",
            "items": [
                {"question": "Wie funktioniert die Abrechnung pro Nutzer?",
                 "answer__limio_richtext": "<p>Sie zahlen pro Lizenz. Lizenzen können Sie jederzeit im Self-Service-Bereich hinzufügen oder reduzieren.</p>"},
                {"question": "Können wir monatlich kündigen?",
                 "answer__limio_richtext": "<p>Ja — der monatliche Plan ist jederzeit kündbar. Der Jahresplan spart 17\u00a0% und läuft 12 Monate.</p>"},
                {"question": "Welche Titel sind enthalten?",
                 "answer__limio_richtext": "<p>Über 2.500 Zeitungen und Magazine von mehr als 500 Verlagen — von DER SPIEGEL bis Le Monde.</p>"},
                {"question": "Gibt es Rechnungskauf?",
                 "answer__limio_richtext": "<p>Ja, Zahlung per Kreditkarte oder auf Rechnung. Alle Rechnungen finden Sie in Ihrem Kundenkonto.</p>"},
                {"question": "Was gilt für mehr als 10 Lizenzen?",
                 "answer__limio_richtext": "<p>Ab 50 Lizenzen erstellen wir Ihnen ein individuelles Angebot — mit SSO, individuellem Katalog und Account Manager.</p>"},
            ],
        }),
        custom("cta-banner", "body", {
            "headline": "Bereit für die ganze Presse?",
            "description__limio_richtext": "<p>Starten Sie in wenigen Minuten — ohne Vertrieb, ohne Wartezeit.</p>",
            "ctaText": "Jetzt starten",
            "ctaUrl": "/ca-pricing#plaene",
            "backgroundColor__limio_color": "#211712",
            "textColor__limio_color": "#FFFDF9",
            "ctaBackgroundColor__limio_color": "#FFFDF9",
            "ctaTextColor__limio_color": "#211712",
        }),
    ]
    return page_record("CA Pricing", "ca-pricing", assets,
                       referenced_label="cafeyn-b2b", offer_paths=B2B_OFFERS,
                       meta_title="Cafeyn for Business – Preise")

def checkout_form_subcomponents(al_assets, sales_assisted):
    subs = [form_text("<h2>Ihre Angaben</h2>")]
    subs += name_email_fields(disabled=sales_assisted)
    subs.append(limio_field("Firmenname", "customerDetails.companyName", col=6,
                            required=not sales_assisted, disabled=sales_assisted))
    if sales_assisted:
        subs.append(limio_field("Unternehmensgröße", "customFields.companySize",
                                ftype="input", col=6, disabled=True))
        subs.append(limio_field("Branche", "customFields.sector", ftype="input", col=6, disabled=True))
        subs.append(limio_field("Bereits Cafeyn-Nutzer?", "customFields.existingCafeynUser",
                                ftype="input", col=6, disabled=True))
    else:
        subs.append(limio_field("USt-IdNr. (optional)", "customFields.vatId", col=6,
                                tooltip="Umsatzsteuer-Identifikationsnummer, z. B. DE123456789"))
        subs.append(limio_field("Branche", "customFields.sector", ftype="select", col=6,
                                select_options=SECTOR_OPTIONS))
    subs.append(form_text("<h2>Ihre Adresse</h2>"))
    subs.append(address_fields_de(al_assets))
    subs.append(form_text("<h2>Zahlung</h2>"))
    subs += payment_subcomponents(al_assets)
    subs.append(terms_checkbox())
    return subs

def build_ca_checkout(sales_assisted=False):
    al = tpl("page-AL_Plus_Checkout.json")
    cart = tpl("page-Leemeeo_Cart.json")
    name = "CA Quote Checkout" if sales_assisted else "CA Checkout"
    tag = "ca-quote-checkout" if sales_assisted else "ca-checkout"

    nav = native_from(al["assets"], "/assets/components/nav-header")
    nav["props"] = nav_props()

    form = native_from(al["assets"], "/assets/components/form")
    form["props"] = {
        "orderCompleteURL": "/ca-confirm",
        "requiredLabel": "*",
        "submitLabel": "Jetzt zahlungspflichtig bestellen",
        "subcomponentMetadata": checkout_form_subcomponents(al["assets"], sales_assisted),
    }

    head = native_from(al["assets"], "/assets/components/text", "body")
    head["props"] = {"content": "<h2>Kasse</h2>"}
    sep_body = native_from(al["assets"], "/assets/components/separator", "body")

    rn_text = native_from(al["assets"], "/assets/components/text", "right-nav")
    rn_text["props"] = {"content": "<h2>Ihre Bestellung</h2>"}
    rn_sep = native_from(al["assets"], "/assets/components/separator", "right-nav")
    cart_items = native_from(al["assets"], "/assets/components/cart-items", "right-nav")
    cart_items["props"] = {
        "showIcons": True,
        "displayUpsellOffers": True,
        "offerInformation": "<p>{{data.attributes.detailed_display_price__limio}}</p>",
        "addOnInformation": "<p>{{data.attributes.description__limio}}</p>",
        "perUnitLabel": "pro Lizenz",
    }
    cross_sell = native_from(cart["assets"], "/assets/components/cross-sell")
    cross_sell["position"] = "right-nav"
    promo = native_from(cart["assets"], "/assets/components/component-promo-code-redeem")
    promo["position"] = "right-nav"
    summary = native_from(al["assets"], "/assets/components/cart-summary", "right-nav")
    billing = native_from(cart["assets"], "/assets/components/billing-details")
    billing["position"] = "right-nav"
    billing["props"] = {"recurringPaymentLabel": "Wiederkehrende Zahlung",
                        "firstPaymentLabel": "Heute fällig",
                        "recurringPaymentDetails": "<p><br></p>"}

    assets = [nav, head, sep_body, form, rn_text, rn_sep, cart_items, cross_sell, promo, summary, billing]
    return page_record(
        name, tag, assets,
        offer_paths=SALES_OFFERS if sales_assisted else B2B_OFFERS,
        meta_title="Kasse – Cafeyn for Business",
        extra_attributes={"push_to_checkout__limio": False},
        base_template="/config/templates/pages/RightSideNav",
        page_style=CHECKOUT_PAGESTYLE,
        authenticated=(not sales_assisted),
        auth_provider=("" if sales_assisted else "auth0-saas-dev-shop.prod.limio.com"),
    )

def build_ca_confirm():
    leemeeo = tpl("page-Leemeeo_Complete.json")
    nav = native_from(leemeeo["assets"], "/assets/components/nav-header")
    nav["props"] = nav_props(items=NAV_ACCOUNT_ITEMS, logo_href="/ca-account")
    assets = [nav, custom("cafeyn-order-confirmation", "body", {})]
    return page_record("CA Complete", "ca-confirm", assets,
                       referenced_label="cafeyn-b2b",
                       meta_title="Bestellbestätigung – Cafeyn for Business",
                       authenticated=True, auth_provider="auth0-saas-dev-shop.prod.limio.com")

def build_ca_account():
    av = tpl("page-Avalara%20Billing.json")
    nav = native_from(av["assets"], "/assets/components/nav-header")
    nav["props"] = nav_props(items=NAV_ACCOUNT_ITEMS, logo_href="/ca-account")
    table = native_from(av["assets"], "/custom-components-2/subscription-summary-table")
    table["props"] = {
        "pageTitle": "Abonnements",
        "pageSubtitle": "Verwalten Sie hier Ihre aktiven Abonnements.",
        "subscriptionIdLabel": "Abo-Nummer",
        "renewalDateLabel": "Verlängerung am",
        "unitPriceColumnLabel": "Preis pro Lizenz",
        "existingQuantityColumnLabel": "Lizenzen",
        "billingPlanColumnLabel": "Abrechnung",
        "billThroughDateColumnLabel": "Abgerechnet bis",
        "updateButtonText": "Plan ändern",
        "updateButtonLink": "/ca-direct-update-sub",
        "editAddOnsButtonText": "Add-ons verwalten",
        "editAddOnsLink": "/ca-direct-update",
        "cancelButtonText": "Kündigen",
        "cancelButtonLink": "/ca-cancel",
        "addNewSubscriptionButtonText": "Neues Abo hinzufügen",
        "addNewSubscriptionLink": "/ca-pricing",
        "notFoundText__limio_richtext": "<p>Wir konnten keine Abo-Informationen finden. Bitte kontaktieren Sie uns, falls das Problem bestehen bleibt.</p>",
        "insufficientNoticeModalTitle": "Kündigungsfrist",
        "insufficientNoticeModalBody": "Ihre Kündigungsfrist liegt unter dem erforderlichen Minimum. Bitte kontaktieren Sie uns, um fortzufahren.",
        "insufficientNoticeConfirmText": "Anfrage senden",
        "insufficientNoticeCancelText": "Zurück",
        "cancellationErrorMessage": "Ihre Anfrage konnte nicht verarbeitet werden. Bitte kontaktieren Sie den Support.",
        "offerRowColor": "#DED0B9",
        "offerChipColor": "#211712",
        "addOnRowColor": "#F2ECE2",
        "addOnChipColor": "#885F46",
        "primaryTextColor": "#211712",
    }
    return page_record("CA Account", "ca-account", [nav, table],
                       page_style=ACCOUNT_PAGESTYLE,
                       meta_title="Mein Konto – Cafeyn for Business", authenticated=True, auth_provider="auth0-saas-dev-shop.prod.limio.com")

def build_ca_invoices():
    lm = tpl("page-Leemeeo_Invoices.json")
    nav = native_from(lm["assets"], "/assets/components/nav-header")
    nav["props"] = nav_props(items=[
        NAV_ACCOUNT_ITEMS[0],
        {**NAV_ACCOUNT_ITEMS[1], "button__limio_boolean": True},
        NAV_ACCOUNT_ITEMS[2],
    ], logo_href="/ca-account")
    heads = native_from(lm["assets"], "/assets/components/headings")
    heads["props"] = {"heading": "Rechnungen",
                      "subheading": "Hier finden Sie alle Rechnungen und Ihren Zahlungsverlauf — jederzeit zum Herunterladen."}
    table = native_from(lm["assets"], "/assets/components/invoices-table")
    table["props"] = {"invoiceHeader": "", "showTotalPrice": True, "allowPay": True,
                      "allowPartialPayment": True,
                      "noDefaultButtonURL": "/ca-add-payment-method",
                      "changePayURL": "/ca-add-payment-method"}
    return page_record("CA Invoices", "ca-invoices", [nav, heads, table],
                       meta_title="Rechnungen – Cafeyn for Business", authenticated=True, auth_provider="auth0-saas-dev-shop.prod.limio.com")

def build_ca_cancel():
    lm = tpl("page-Leemeeo_Cancel_Confirm.json")
    nav = native_from(lm["assets"], "/assets/components/nav-header")
    nav["props"] = nav_props(logo_href="/ca-account")
    crumbs = native_from(lm["assets"], "/assets/components/breadcrumbs")
    crumbs["props"] = {"header": "", "breadcrumbs": [
        {"text": "Abonnement", "url": "/ca-account"},
        {"text": "Kündigung", "url": "/ca-cancel"},
    ]}
    survey = custom("cancel-survey-radio-button-create-basket", "body", {
        "title": "Schade, dass Sie gehen möchten",
        "subtitle": "Bevor Sie kündigen — vielleicht finden wir gemeinsam eine bessere Lösung.",
        "reasonsHeading": "<p>Warum möchten Sie kündigen?</p>",
        "reasons": [
            {"label": "Zu teuer", "value": "expensive", "url": "/ca-cancel-save", "createBasket__limio_boolean": False},
            {"label": "Wir nutzen nicht alle Funktionen", "value": "features", "url": "/ca-direct-update-sub", "createBasket__limio_boolean": True},
            {"label": "Wir brauchen die Add-ons nicht mehr", "value": "add-ons", "url": "/ca-direct-update", "createBasket__limio_boolean": True},
            {"label": "Technische Probleme", "value": "technical", "url": "/ca-cancel-save", "createBasket__limio_boolean": False},
        ],
        "showOtherReason": True,
        "otherReasonLabel": "Ich möchte es nicht sagen",
        "otherReasonValue": "other",
        "otherReasonUrl": "/ca-cancel-save",
        "captureOtherReasonText": True,
        "otherReasonCaptureTextLabel": "Möchten Sie uns noch etwas mitteilen? (optional)",
        "showImage": False,
        "cancelButtonText": "Trotzdem kündigen",
        "keepSubscriptionButtonText": "Abo behalten",
        "keepSubscriptionUrl": "/ca-account",
    })
    return page_record("CA Cancel", "ca-cancel", [nav, crumbs, survey],
                       page_style=CANCEL_PAGESTYLE,
                       meta_title="Kündigung – Cafeyn for Business",
                       authenticated=True, auth_provider="auth0-saas-dev-shop.prod.limio.com")

def build_ca_cancel_save():
    lm = tpl("page-Leemeeo%20Cancel%20Save%20Discount.json")
    offer_comp = native_from(lm["assets"], "/custom-components-2/cancel-save-offer-custom")
    offer_comp["props"] = {
        "heading": "Bleiben Sie bei Cafeyn",
        "subheading__limio_richtext": "<p>Bevor Sie gehen: Sichern Sie sich <strong>20&nbsp;% Rabatt für 12 Monate</strong> auf Ihren aktuellen Plan.</p>",
        "showAdditionalButtons": False,
        "processChangeSub": "onPageNoModal",
        "redirectUrl": "/ca-cancel",
        "redirectToConfirmationUrl": "/ca-account",
    }
    return page_record("CA Cancel Save", "ca-cancel-save", [offer_comp],
                       referenced_label="cafeyn-save", offer_paths=SAVE_OFFERS,
                       meta_title="Ihr Angebot – Cafeyn for Business", authenticated=True, auth_provider="auth0-saas-dev-shop.prod.limio.com")

def build_ca_add_payment_method():
    lm = tpl("page-Leemeeo_Add_Payment_Method.json")
    nav = native_from(lm["assets"], "/assets/components/nav-header")
    nav["props"] = nav_props(items=[
        {"login__limio_boolean": False, "button__limio_boolean": False, "label": "Zurück", "href": "/ca-account"},
    ], logo_href="/ca-account")
    title = native_from(lm["assets"], "/assets/components/text", "left-nav")
    title["props"] = {"content": "<h3>Zahlungsmethode hinzufügen</h3>"}
    sep = native_from(lm["assets"], "/assets/components/separator", "left-nav")
    form = native_from(lm["assets"], "/assets/components/self-service-form")
    # Germanize the existing form config in place
    form["props"]["redirectUrl"] = "/ca-account"
    for sc in form["props"]["subcomponentMetadata"]:
        cp = sc.get("componentProps", {})
        sc["id"] = aid()
        if sc["component"] == "LimioFormText":
            if "Billing" in str(cp.get("text")):
                cp["text"] = "<h3>Rechnungsdetails</h3>"
            elif "Payment" in str(cp.get("text")):
                cp["text"] = "<h3>Zahlungsdetails</h3>"
        elif sc["component"] == "LimioFirstNameField":
            cp.update({"label": "Vorname", "invalidMessage": REQUIRED_DE})
        elif sc["component"] == "LimioLastNameField":
            cp.update({"label": "Nachname", "invalidMessage": REQUIRED_DE})
        elif sc["component"] == "AddressFields":
            cp.update({
                "heading": "Rechnungsadresse", "address1Label": "Adresszeile 1",
                "address2Label": "Adresszeile 2 (optional)", "cityLabel": "Stadt",
                "postalCodeLabel": "PLZ", "stateLabel": "Bundesland", "countryLabel": "Land",
                "invalidAddressMessage": "Adresse ist erforderlich",
                "invalidCityMessage": "Stadt ist erforderlich",
                "invalidPostalCodeMessage": "PLZ ist erforderlich",
                "invalidStateMessage": "Bundesland ist erforderlich",
                "invalidCountryMessage": "Land ist erforderlich",
            })
        elif sc["component"] == "LimioField" and cp.get("name") == "paymentType":
            cp["label"] = "Zahlungsart wählen"
            cp["radioOptions"] = [{"id": "zuora_card", "value": "<p>Kreditkarte</p>"}]
        elif sc["component"] == "LimioPaymentManagerField":
            cp["invalidPaymentMethodMessage"] = "Hoppla! Etwas ist schiefgelaufen. Bitte versuchen Sie es gleich noch einmal."
    rn_title = native_from(lm["assets"], "/assets/components/text", "right-nav")
    rn_title["props"] = {"content": "<h3>Ihre Daten, immer aktuell</h3>"}
    rn_sep = native_from(lm["assets"], "/assets/components/separator", "right-nav")
    rn_body = copy.deepcopy(rn_title)
    rn_body["id"] = aid()
    rn_body["props"] = {"content": "<p>Aktualisieren Sie Ihre Zahlungsmethode, damit Ihr Team unterbrechungsfrei liest. Zahlungen werden sicher verarbeitet; gespeicherte Zahlungsmittel können Sie jederzeit ändern oder löschen.</p>"}
    assets = [nav, title, sep, form, rn_title, rn_sep, rn_body]
    return page_record("CA Add Payment Method", "ca-add-payment-method", assets,
                       meta_title="Zahlungsmethode – Cafeyn for Business",
                       base_template="/config/templates/pages/6040", authenticated=True, auth_provider="auth0-saas-dev-shop.prod.limio.com")

def build_ca_direct_update():
    lm = tpl("page-Leemeeo_Direct_Update_Details.json")
    nav = native_from(lm["assets"], "/assets/components/nav-header")
    nav["props"] = nav_props(logo_href="/ca-account")
    ln_text = native_from(lm["assets"], "/assets/components/text", "left-nav")
    ln_text["props"] = {"content": "<h2>Ihr neuer Warenkorb</h2>"}
    upd = native_from(lm["assets"], "/assets/components/update-cart-items")
    upd["props"] = {"offerInformation": "<p>{{data.attributes.detailed_display_price__limio}}</p>",
                    "addOnInformation": "<p>{{data.attributes.description__limio}}</p>"}
    addons = native_from(lm["assets"], "/assets/components/compatible-add-ons")
    rn_text = native_from(lm["assets"], "/assets/components/text", "right-nav")
    rn_text["props"] = {"content": "<h2>Ihre Änderungen</h2>"}
    rn_sep = native_from(lm["assets"], "/assets/components/separator", "right-nav")
    change = native_from(lm["assets"], "/assets/components/change-summary", "right-nav")
    summary = native_from(lm["assets"], "/assets/components/cart-summary", "right-nav")
    billing = native_from(lm["assets"], "/assets/components/billing-details", "right-nav")
    ssf = native_from(lm["assets"], "/assets/components/self-service-form", "right-nav")
    ssf["props"] = {"redirectUrl": "/ca-account"}
    assets = [nav, ln_text, upd, addons, rn_text, rn_sep, change, summary, billing, ssf]
    return page_record("CA Direct Update", "ca-direct-update", assets,
                       meta_title="Abo anpassen – Cafeyn for Business",
                       base_template="/config/templates/pages/6040", authenticated=True, auth_provider="auth0-saas-dev-shop.prod.limio.com")

def build_ca_direct_update_sub():
    lm = tpl("page-Leemeeo_Direct_Update_Sub.json")
    nav = native_from(lm["assets"], "/assets/components/nav-header")
    nav["props"] = nav_props(logo_href="/ca-account")
    heads = native_from(lm["assets"], "/assets/components/headings")
    heads["props"] = {"heading": "Wählen Sie Ihren neuen Plan",
                      "subheading": "Upgrade, Downgrade oder Laufzeitwechsel — die Differenz wird anteilig verrechnet."}
    offers = native_from(lm["assets"], "/assets/components/update-subscription-offers")
    return page_record("CA Direct Update Sub", "ca-direct-update-sub", [nav, heads, offers],
                       referenced_label="cafeyn-b2b", offer_paths=B2B_OFFERS,
                       meta_title="Plan wechseln – Cafeyn for Business", authenticated=True, auth_provider="auth0-saas-dev-shop.prod.limio.com")

def build_ca_payment_methods():
    """Amaury created /pages2/CA Payment Methods by cloning a payment-methods page.
    Reuse its assembled components verbatim; only patch the Cafeyn header, German
    headings, tag, auth + page style, and normalise the (cloned) name/path."""
    live = catalog.get_item("/pages2/CA Payment Methods")
    if not live:
        raise RuntimeError("CA Payment Methods page not found — create it in the catalog first")
    rec = copy.deepcopy(live["data"])
    rec["name"] = "CA Payment Methods"
    rec["path"] = "/pages2/CA Payment Methods"
    rec["baseTemplate"] = "/config/templates/pages/default"
    rec["tags"] = ["/tags/ca-payment-methods"]
    rec["isAuthenticated"] = True
    rec["pageAuthProvider"] = "auth0-saas-dev-shop.prod.limio.com"
    rec["pageStyle"] = ACCOUNT_PAGESTYLE
    attrs = rec.setdefault("attributes", {})
    attrs["meta_title__limio"] = "Zahlungsmethoden – Cafeyn for Business"
    attrs.setdefault("label__limio", ["cafeyn"])
    for a in rec.get("assets", []):
        p = a.get("path", "")
        if "nav-header" in p:
            a["props"] = nav_props(items=NAV_ACCOUNT_ITEMS, logo_href="/ca-account")
        elif "headings" in p:
            a["props"] = {"heading": "Zahlungsmethoden",
                          "subheading": "Verwalten Sie hier Ihre hinterlegten Zahlungsmethoden."}
    return rec

BUILDERS = {
    "CA Pricing": build_ca_pricing,
    "CA Checkout": lambda: build_ca_checkout(False),
    "CA Quote Checkout": lambda: build_ca_checkout(True),
    "CA Complete": build_ca_confirm,
    "CA Account": build_ca_account,
    "CA Invoices": build_ca_invoices,
    "CA Cancel": build_ca_cancel,
    # "CA Cancel Save": MANUAL — managed by Amaury (50discount label), do not recreate
    "CA Add Payment Method": build_ca_add_payment_method,
    "CA Payment Methods": build_ca_payment_methods,
    "CA Direct Update": build_ca_direct_update,
    "CA Direct Update Sub": build_ca_direct_update_sub,
}

TAGS = ["ca-pricing", "ca-checkout", "ca-quote-checkout", "ca-confirm", "ca-account",
        "ca-invoices", "ca-cancel", "ca-cancel-save", "ca-add-payment-method",
        "ca-payment-methods", "ca-direct-update", "ca-direct-update-sub"]

def make_tags():
    for t in TAGS:
        it = catalog.get_item(f"/tags/{t}")
        if it:
            print("tag exists:", t)
            continue
        catalog.job({"jobType": "creation", "updatePath": "/limio/catalogs/1/tree/tags",
                     "itemData": {"name": t, "record_type": "tag", "path": f"/tags/{t}",
                                  "baseTemplate": "/config/templates/tags/default",
                                  "attributes": {"display_name__limio": t}}})
        print("tag created:", t)

def make_pages(names):
    for name in names:
        rec = BUILDERS[name]()
        catalog.delete_item(rec["path"])
        catalog.job({"jobType": "creation", "updatePath": "/limio/catalogs/1/tree/pages",
                     "itemData": rec})
        print("page created:", rec["path"])

def build(names):
    items = [f"/pages2/{n}" for n in names]
    st, res = catalog.req("POST", "/api/shop/builds", {"items": items})
    print("build:", st, json.dumps(res, default=str)[:400])
    if isinstance(res, dict) and res.get("id"):
        open(f"{catalog.SCRATCH}/cafeyn/last-build.txt", "w").write(res["id"])

def publish():
    build_id = open(f"{catalog.SCRATCH}/cafeyn/last-build.txt").read().strip()
    st, res = catalog.req("POST", "/api/publish",
                          {"tags": [f"/tags/{t}" for t in TAGS], "buildId": build_id,
                           "name": "Cafeyn B2B Demo"})
    if not isinstance(res, dict):
        print("publish failed:", st, res); return
    ok = res.get("publishedData", {}).get("pages", {})
    bad = res.get("ommitedWithError", {}).get("pages", {})
    print("published:", list(ok.keys()))
    print("OMITTED (need Page Builder bulk publish):", list(bad.keys()))

def verify():
    for t in TAGS:
        st, res = catalog.req("GET", f"/api/pages?tags=/tags/{t}")
        hits = res.get("hits", {}).get("value") if isinstance(res, dict) else "?"
        print(f"{t}: indexed={hits}")

if __name__ == "__main__":
    cmd = sys.argv[1]
    names = sys.argv[2:] or list(BUILDERS)
    if cmd == "tags": make_tags()
    elif cmd == "pages": make_pages(names)
    elif cmd == "build": build(names)
    elif cmd == "publish": publish()
    elif cmd == "verify": verify()
