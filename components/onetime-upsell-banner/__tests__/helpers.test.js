import { isOneTimeOffer, countOnetimeOnlySubs, hasAnyRecurringSub } from "../index"

// Avoid loading MUI / @limio/sdk during these pure-helper tests by mocking them.
jest.mock("@limio/sdk", () => ({
  useUser: () => ({ loginStatus: "logged_in", loaded: true }),
  useSubscriptions: () => ({ subscriptions: [] }),
  useComponentProps: (d) => d,
  getPropsFromPackageJson: () => ({}),
  sanitiseHTML: (h) => h || "",
  useLimioContext: () => ({ isInPageBuilder: false }),
}))
jest.mock(
  "@mui/material/styles",
  () => ({
    createTheme: () => ({}),
    ThemeProvider: ({ children }) => children,
    StyledEngineProvider: ({ children }) => children,
  }),
  { virtual: true }
)
jest.mock(
  "@mui/material",
  () => ({
    CssBaseline: () => null,
    Button: () => null,
    Box: () => null,
    Typography: () => null,
  }),
  { virtual: true }
)
jest.mock("../fonts.css", () => ({}), { virtual: true })
jest.mock("../index.css", () => ({}), { virtual: true })
jest.mock("@fontsource/inter/400.css", () => ({}), { virtual: true })
jest.mock("@fontsource/inter/500.css", () => ({}), { virtual: true })
jest.mock("@fontsource/inter/600.css", () => ({}), { virtual: true })
jest.mock("@fontsource/inter/700.css", () => ({}), { virtual: true })

// --- Fixtures -------------------------------------------------------

const oneTimeAttrs = {
  price__limio: [{ type: "onetime", value: "99.00", currencyCode: "USD" }],
  autoRenew__limio: false,
}
const recurringAttrs = {
  price__limio: [{ type: "recurring", value: "20.00", currencyCode: "USD" }],
  autoRenew__limio: true,
}

const subWith = (attrs, opts = {}) => ({
  id: opts.id || "sub-x",
  status: opts.status || "active",
  offers: [
    {
      data: {
        record_subtype: opts.record_subtype || "base",
        offer: { data: { attributes: attrs } },
      },
    },
  ],
})

// --- isOneTimeOffer -------------------------------------------------

describe("isOneTimeOffer", () => {
  test("returns true when all prices are onetime", () => {
    expect(isOneTimeOffer({ price__limio: [{ type: "onetime" }] })).toBe(true)
  })

  test("returns false when any price is recurring", () => {
    expect(isOneTimeOffer({ price__limio: [{ type: "recurring" }] })).toBe(false)
    expect(
      isOneTimeOffer({ price__limio: [{ type: "onetime" }, { type: "recurring" }] })
    ).toBe(false)
  })

  test("returns true when autoRenew__limio is explicitly false", () => {
    expect(isOneTimeOffer({ autoRenew__limio: false })).toBe(true)
  })

  test("returns false on empty / unknown shape", () => {
    expect(isOneTimeOffer({})).toBe(false)
    expect(isOneTimeOffer(undefined)).toBe(false)
  })
})

// --- countOnetimeOnlySubs -------------------------------------------

describe("countOnetimeOnlySubs", () => {
  test("counts only active one-time subscriptions", () => {
    const subs = [
      subWith(oneTimeAttrs, { id: "a" }),
      subWith(oneTimeAttrs, { id: "b" }),
      subWith(recurringAttrs, { id: "c" }),
      subWith(oneTimeAttrs, { id: "d", status: "cancelled" }),
    ]
    expect(countOnetimeOnlySubs(subs)).toBe(2)
  })

  test("ignores discount sub-offers when determining current offer", () => {
    const sub = {
      id: "sub-discount-first",
      status: "active",
      offers: [
        {
          data: {
            record_subtype: "discount",
            offer: { data: { attributes: recurringAttrs } },
          },
        },
        {
          data: {
            record_subtype: "base",
            offer: { data: { attributes: oneTimeAttrs } },
          },
        },
      ],
    }
    expect(countOnetimeOnlySubs([sub])).toBe(1)
  })

  test("returns 0 for empty / non-array input", () => {
    expect(countOnetimeOnlySubs([])).toBe(0)
    expect(countOnetimeOnlySubs(undefined)).toBe(0)
  })
})

// --- hasAnyRecurringSub --------------------------------------------

describe("hasAnyRecurringSub", () => {
  test("true when at least one active sub is recurring", () => {
    expect(
      hasAnyRecurringSub([
        subWith(oneTimeAttrs),
        subWith(recurringAttrs),
      ])
    ).toBe(true)
  })

  test("false when all subs are one-time", () => {
    expect(hasAnyRecurringSub([subWith(oneTimeAttrs), subWith(oneTimeAttrs)])).toBe(false)
  })

  test("ignores cancelled subscriptions", () => {
    expect(
      hasAnyRecurringSub([
        subWith(oneTimeAttrs),
        subWith(recurringAttrs, { status: "cancelled" }),
      ])
    ).toBe(false)
  })
})
