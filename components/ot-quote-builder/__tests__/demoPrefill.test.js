import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// USD prices as published on saas-dev (/pages2/OT Quote Builder, label ottg), 2026-11-10.
const offer = (path, attributes) => ({
  path,
  name: path.split("/").pop(),
  data: { attributes },
});
const price = (value, type = "recurring") => [
  { value: value.toFixed(2), currencyCode: "USD", type },
];
const mockOffers = [
  offer("/offers2/OT Trading Grid Foundation 10 Annual USD", {
    display_name__limio: "Trading Grid Foundation 10",
    group__limio: "yearly",
    product_family__limio: "tradinggrid",
    tier_rank__limio: 4,
    trading_partners__limio: 10,
    price__limio: price(8990),
  }),
  offer("/offers2/OT Trading Grid Foundation 5 Annual USD", {
    display_name__limio: "Trading Grid Foundation 5",
    group__limio: "yearly",
    product_family__limio: "tradinggrid",
    tier_rank__limio: 3,
    trading_partners__limio: 5,
    price__limio: price(4990),
  }),
];
const mockAddOns = [
  offer("/add_ons/OT ERP Adapter Annual USD", {
    display_name__limio: "ERP Adapter",
    group__limio: "yearly",
    addon_key__limio: "erp_adapter",
    price__limio: price(1490),
  }),
  offer("/add_ons/OT Extra Trading Partner Annual USD", {
    display_name__limio: "Additional trading partner",
    group__limio: "yearly",
    addon_key__limio: "extra_trading_partner",
    price__limio: price(790),
  }),
  offer("/add_ons/OT Guided Onboarding USD", {
    display_name__limio: "Guided onboarding",
    group__limio: "onetime",
    addon_key__limio: "guided_onboarding",
    price__limio: price(1500, "onetime"),
  }),
  offer("/add_ons/OT Premium Support Annual USD", {
    display_name__limio: "Premium Support",
    group__limio: "yearly",
    addon_key__limio: "premium_support",
    price__limio: price(1990),
  }),
];

const mockSendOrder = jest.fn();
jest.mock("@limio/sdk", () => ({
  ErrorBoundary: ({ children }) => children,
  useCampaign: () => ({ offers: mockOffers, addOns: mockAddOns }),
  useLimioContext: () => ({ isInPageBuilder: false }),
  sanitiseHTML: (h) => h || "",
  useComponentProps: (d) => d,
  getPropsFromPackageJson: (pkg) =>
    Object.fromEntries(pkg.limioProps.map((p) => [p.id, p.default])),
}));
jest.mock(
  "@limio/shop/src/shop/helpers/postRequests.ts",
  () => ({
    sendOrder: (...a) => mockSendOrder(...a),
    getRecaptchaToken: jest.fn(),
  }),
  {
    virtual: true,
  }
);
jest.mock("../index.css", () => ({}), { virtual: true });

const { default: OtQuoteBuilder, demoValues } = require("../index");

const open = (search) => {
  window.localStorage.clear();
  window.history.replaceState(null, "", `/ot-quote${search}`);
  return render(<OtQuoteBuilder />);
};
const aside = () => within(document.querySelector(".ot-qb__aside"));
const field = (label) =>
  screen.getByLabelText(
    new RegExp(`^${label.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&")}`)
  );

afterEach(() => mockSendOrder.mockReset());

test("without ?demo the form starts empty", () => {
  open("?region=NA");
  expect(field("First name").value).toBe("");
  expect(field("Company name").value).toBe("");
  expect(field("Number of trading partners").value).toBe("25");
});

test("?demo=1 fills every section, prices it as the demo script, and hides the param", () => {
  open("?basket=basket-50af8d27&demo=1&region=NA");

  expect(field("First name").value).toBe("Jordan");
  expect(field("Last name").value).toBe("Reyes");
  expect(field("Work email").value).toMatch(/^amaury\+q\d{12}@limio\.com$/);
  expect(field("Company name").value).toMatch(
    /^Harbor Foods Distribution [A-Z2-9]{3}$/
  );
  expect(field("Industry").value).toBe("Distribution & logistics");
  expect(field("Employees").value).toBe("1,000 – 4,999");
  expect(field("Country").value).toBe("US");
  expect(field("Main ERP").value).toBe("Oracle NetSuite");
  expect(field("Number of trading partners").value).toBe("40");
  expect(field("Document volume").value).toBe("100,000 – 500,000");
  expect(field("Key trading partners").value).toBe(
    "Walmart, Kroger, Costco, Sysco"
  );
  expect(
    screen
      .getByRole("button", { name: "North America" })
      .getAttribute("aria-pressed")
  ).toBe("true");
  expect(field("Commitment").value).toBe("3");
  expect(field("Preferred start date").value).toMatch(/^\d{4}-\d{2}-01$/);
  expect(field("Premium support").checked).toBe(true);
  expect(field("Guided onboarding").checked).toBe(true);
  expect(field("Billing address").value).toContain("Harbor Point");
  expect(field("City").value).toBe("Chicago");
  expect(field("ZIP / postcode").value).toBe("60601");
  expect(field("Technical contact name").value).toBe("Sam Okafor");
  expect(field("Technical contact email").value).toMatch(
    /^amaury\+q\d{12}it@limio\.com$/
  );
  expect(field("PO number").value).toMatch(/^HFD-PO-/);

  expect(aside().getByText("Annual subscription").nextSibling.textContent).toBe(
    "$36,170"
  );
  expect(aside().getByText("One-off onboarding").nextSibling.textContent).toBe(
    "$1,500"
  );
  expect(aside().getByText("Total over 3 years").nextSibling.textContent).toBe(
    "$110,010"
  );

  expect(window.location.search).toBe("?basket=basket-50af8d27&region=NA");
  expect(mockSendOrder).not.toHaveBeenCalled();
});

test("the filled form stays editable and reprices live", async () => {
  open("?demo=1&region=NA");
  const partners = field("Number of trading partners");
  await userEvent.clear(partners);
  await userEvent.type(partners, "50");
  // +10 partners × $790
  expect(aside().getByText("Annual subscription").nextSibling.textContent).toBe(
    "$44,070"
  );
  expect(mockSendOrder).not.toHaveBeenCalled();
});

test("each run gets a fresh email and company, always on Amaury's own address", () => {
  const a = demoValues(new Date(2026, 10, 10, 14, 5, 9), () => 0.1);
  const b = demoValues(new Date(2026, 10, 10, 14, 5, 40), () => 0.9);
  expect(a.email).toBe("amaury+q261110140509@limio.com");
  expect(a.email).not.toBe(b.email);
  expect(a.company).not.toBe(b.company);
  for (const v of [a, b]) {
    expect(v.email).toMatch(/^amaury(\+[a-z0-9]+)?@limio\.com$/);
    expect(v.techEmail).toMatch(/^amaury(\+[a-z0-9]+)?@limio\.com$/);
  }
  expect(a.startDate).toBe("2027-01-01");
});
