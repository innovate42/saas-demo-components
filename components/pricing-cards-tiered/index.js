// @flow
import React, { useEffect, useMemo, useState } from "react";
import { useCampaign, useBasket } from "@limio/sdk";
import * as R from "ramda";
import "./fonts.css";
import "./index.css";

type Props = {
  heading: string,
  subheading: string,
  componentId: string,
  showFeatures: boolean,
  defaultBillingPeriod: string,
  tierOrder: Array<{ id: string, label: string }>,
  billingLabels: Array<{ id: string, label: string, description: string }>,
  topLevelLabels: Array<{ id: string, label: string }>,
  themeColor: string,
};

// ============================================================================
// STATIC CONTENT
// ============================================================================

// Image URLs (WordPress hosted)
const IMAGES = {
  laptop: "https://www.jazzhr.com/wp-content/uploads/2026/01/laptop-floating.png",
  tablet: "https://www.jazzhr.com/wp-content/uploads/2026/01/tablet-floating.png",
  iphone: "https://www.jazzhr.com/wp-content/uploads/2026/01/iphone-floating-2.png",
  texting: "https://www.jazzhr.com/wp-content/uploads/2026/01/texting-image.png",
  demo: "https://www.jazzhr.com/wp-content/uploads/2026/01/demo-section-image.png",
  brandGraphic04: "https://www.jazzhr.com/wp-content/uploads/2026/01/brand-graphic-04.svg",
  brandGraphic05: "https://www.jazzhr.com/wp-content/uploads/2026/01/brand-graphic-05.svg",
  brandGraphic03: "https://www.jazzhr.com/wp-content/uploads/2026/01/brand-graphic-03.svg",
  brandGraphic08: "https://www.jazzhr.com/wp-content/uploads/2026/01/brand-graphic-08.svg",
  dividerTop: "https://www.jazzhr.com/wp-content/uploads/2026/01/divider-top.svg",
  dividerBottom: "https://www.jazzhr.com/wp-content/uploads/2026/01/divider-bottom.svg",
  chevronDown: "https://www.jazzhr.com/wp-content/uploads/2026/01/chevron-down.svg",
  chevronUp: "https://www.jazzhr.com/wp-content/uploads/2026/01/chevron-up.svg",
  chatBubble: "https://www.jazzhr.com/wp-content/uploads/2026/01/chat-bubble.svg",
  customerSupport: "https://www.jazzhr.com/wp-content/uploads/2024/12/jazzhr-contact-customer.png.webp",
  jobSeeker: "https://www.jazzhr.com/wp-content/uploads/2024/12/jazzhr-contact-job-seeker.png.webp",
  pressInquiries: "https://www.jazzhr.com/wp-content/uploads/2024/12/jazzhr-contact-press.png.webp",
};

// Calendly URLs with UTM params
const CALENDLY_URLS = {
  proCard: "https://calendly.com/jazzhrdemo/jazzhr-ssdemo?utm_source=pricingPageProPlan",
  addOn: "https://calendly.com/jazzhrdemo/jazzhr-ssdemo?utm_source=pricingPageAddOn",
  demo: "https://calendly.com/jazzhrdemo/jazzhr-ssdemo?utm_source=pricingPageDemo",
};

// Static features by tier (fallback when offer_features__limio is empty)
const TIER_FEATURES = {
  hero: [
    "3 active jobs to start, add more jobs for just $9 per job per month",
    "Job posting & syndication",
    "Applicant tracking",
  ],
  plus: [
    "Up to 200 active jobs at a time*",
    "AI-powered candidate matching",
    "Task automation and workflow helpers",
    "Reporting",
  ],
  pro: [
    "Up to 200 active jobs at a time*",
    "Offer letter generator & eSignature integration",
    "Custom reports builder",
    "Visual reporting",
  ],
};

// PRO plan static content
const proCardContent = {
  title: "Pro Plan",
  priceText: "Get Your Quote",
  features: TIER_FEATURES.pro,
  buttonText: "Get a Quote",
};

// Add-on section content
const addOnContent = {
  title: "Popular add-on solution",
  cardTitle: "Candidate texting",
  cardDescription: "Text candidates wherever, whenever—add SMS to speed up your search",
  buttonText: "Book a free demo",
};

// FAQ content (8 items)
const faqContent = [
  {
    question: "Why should my business use an ATS?",
    answer: "Businesses can use applicant tracking software to track and filter job applications efficiently. An ATS provides a central location to collect and store applications versus traditional, disjointed recruiting methods that result in siloed data across multiple platforms. A recruitment tracking system also provides one central location to collect and store applications versus traditional, disjointed recruiting methods, resulting in siloing data across multiple sites.",
  },
  {
    question: "How do I transition from other recruiting software to JazzHR?",
    answer: "Data migration from your current ATS into JazzHR is included in select plans. With successful migrations from major applicant tracking systems, our team works with you to ensure that the transition is as seamless as possible.",
  },
  {
    question: "How do I get traffic to my job openings?",
    answer: "We integrate with over a dozen free job boards. But if you want to increase visibility for your jobs, you can also post to premium job boards all from the same, easy-to-use interface.",
  },
  {
    question: "Can I change my plan at any time?",
    answer: "Yes, you can upgrade your service at any time.",
  },
  {
    question: "Does JazzHR have an app?",
    answer: "JazzHR is primarily accessed through your desktop or laptop computer but you can screen candidates and provide interview feedback from any mobile device.",
  },
  {
    question: "What other HR technologies do you integrate with?",
    answer: "JazzHR integrates with many leading HR technologies. Learn more.",
  },
  {
    question: 'What does "consumption-based pricing" mean for JazzHR features?',
    answer: "Consumption-based pricing means that certain add-on features or functionalities within JazzHR are billed based on how much you use them. For example, features like text messaging or email sends may incur additional charges depending on the volume of usage.",
  },
  {
    question: "How can I monitor my usage and avoid unexpected charges?",
    answer: "JazzHR provides tools to track your consumption directly within the platform. You can review your usage at any time under the billing or feature settings tabs. Additionally, we recommend setting alerts or limits (if available) to help manage costs effectively.",
  },
];

// Support cards content (3 cards)
const supportCardsContent = [
  {
    title: "Customer Support",
    icon: IMAGES.customerSupport,
    link: "https://help.jazzhr.com/s/",
    linkText: "Learn More",
  },
  {
    title: "Job Seeker",
    icon: IMAGES.jobSeeker,
    link: "https://info.jazzhr.com/job-seeker-information.html",
    linkText: "Learn More",
  },
  {
    title: "Press Inquiries",
    icon: IMAGES.pressInquiries,
    link: "https://www.jazzhr.com/media-and-press-inquiries/",
    linkText: "Learn More",
  },
];

// Demo section content
const demoContent = {
  title: "Book a",
  titleBold: "FREE",
  titleEnd: "Demo",
  description: "See how JazzHR can help you quickly find and hire the best talent.",
  buttonText: "Book Time Now",
  applyText: "Are you trying to apply for a job?",
  applyLinkText: "Click here",
  applyLink: "#",
};

// Pricing disclaimer
const pricingDisclaimer = "*Job posting and syndication availability is subject to eligibility criteria at JazzHR's sole discretion and may be limited by third-party job board partner restrictions, feed eligibility requirements, and applicable usage limits.";

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Load Calendly script with callback when ready
const loadCalendlyScript = (onReady) => {
  if (typeof window === "undefined") return;

  // If Calendly is already loaded, call callback immediately
  if (window.Calendly) {
    if (onReady) onReady();
    return;
  }

  // Check if script is already being loaded
  const existingScript = document.querySelector('script[src*="calendly.com/assets/external/widget.js"]');
  if (existingScript) {
    const checkReady = setInterval(() => {
      if (window.Calendly) {
        clearInterval(checkReady);
        if (onReady) onReady();
      }
    }, 100);
    return;
  }

  // Load CSS
  const link = document.createElement("link");
  link.href = "https://assets.calendly.com/assets/external/widget.css";
  link.rel = "stylesheet";
  document.head.appendChild(link);

  // Load JS with onload callback
  const script = document.createElement("script");
  script.src = "https://assets.calendly.com/assets/external/widget.js";
  script.async = true;
  script.onload = () => {
    if (onReady) onReady();
  };
  script.onerror = () => {
    console.error("Failed to load Calendly widget script");
  };
  document.head.appendChild(script);
};

// Open Calendly popup or fallback to new tab
const openCalendly = (url) => {
  if (typeof window !== "undefined" && window.Calendly) {
    window.Calendly.showPopupWidget(url);
  } else {
    window.open(url, "_blank", "noopener,noreferrer");
  }
};

// Group offers by tier (hero, plus, pro)
function groupOffersByTier(offers, tierOrder) {
  const groups = R.groupBy((offer) => {
    const tierAttr = R.path(["data", "attributes", "tier__limio"], offer);
    if (tierAttr) return tierAttr.toLowerCase();
    const displayName = R.path(["data", "attributes", "display_name__limio"], offer) || "";
    const tierMatch = displayName.toLowerCase().match(/^(hero|plus|pro)/);
    return tierMatch ? tierMatch[1] : "other";
  }, offers);

  const orderedTiers = tierOrder
    .map((tier) => {
      const tierOffers = groups[tier.id] || [];
      if (tierOffers.length === 0) return null;
      return {
        id: tier.id,
        label: tier.label,
        offers: tierOffers,
      };
    })
    .filter(Boolean);

  return orderedTiers;
}

// Organize offers by billing group (monthly, annual-monthly, annual-upfront)
function organizeOffersByGroup(offers) {
  const result = {
    monthly: [],
    annual: [],
    "annual-monthly": [],
    "annual-upfront": [],
  };

  offers.forEach((offer) => {
    const group = R.path(["data", "attributes", "group__limio"], offer) || "other";
    const displayName = R.path(["data", "attributes", "display_name__limio"], offer) || "";
    const isAnnualBillMonthly = displayName.toLowerCase().includes("bill monthly");

    if (group === "monthly") {
      result.monthly.push(offer);
    } else if (isAnnualBillMonthly) {
      result["annual-monthly"].push(offer);
      result.annual.push(offer);
    } else if (group === "annual") {
      result["annual-upfront"].push(offer);
      result.annual.push(offer);
    }
  });

  return result;
}

// Organize billing options for a tier
function organizeBillingOptions(tierOffers) {
  const billingOptions = {};
  tierOffers.forEach((offer) => {
    const group = R.path(["data", "attributes", "group__limio"], offer) || "other";
    const displayName = R.path(["data", "attributes", "display_name__limio"], offer) || "";
    const isAnnualBillMonthly = displayName.toLowerCase().includes("bill monthly");

    if (isAnnualBillMonthly) {
      billingOptions["annual-monthly"] = offer;
    } else if (group === "annual") {
      billingOptions["annual-upfront"] = offer;
    } else if (group === "monthly") {
      billingOptions["monthly"] = offer;
    } else {
      billingOptions[group] = offer;
    }
  });
  return billingOptions;
}

// Get savings percentage from offer attributes
function getSavingsText(offer) {
  const savings = R.path(["data", "attributes", "savings_text__limio"], offer);
  return savings || null;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

// Main Billing Toggle (Monthly / Annual slider)
const BillingToggle = ({ isAnnual, onChange }) => {
  return (
    <div className="billing-toggle-wrapper">
      <span className="billing-toggle-label">{isAnnual ? "1 Year Plans" : "Monthly"}</span>
      <div
        className={`billing-toggle ${isAnnual ? "annual" : ""}`}
        onClick={() => onChange(!isAnnual)}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => e.key === "Enter" && onChange(!isAnnual)}
        aria-label={`Switch to ${isAnnual ? "monthly" : "annual"} billing`}
      >
        <div className="billing-toggle-knob" />
      </div>
    </div>
  );
};

// Payment Toggle (Pay Monthly / Pay Upfront - inside cards for annual)
const PaymentToggle = ({ selectedPayment, onChange, visible }) => {
  if (!visible) return null;

  return (
    <div className={`payment-toggle ${visible ? "visible" : ""}`}>
      <button
        className={`payment-toggle-btn ${selectedPayment === "monthly" ? "active" : ""}`}
        onClick={() => onChange("monthly")}
        type="button"
      >
        Pay Monthly
      </button>
      <button
        className={`payment-toggle-btn ${selectedPayment === "upfront" ? "active" : ""}`}
        onClick={() => onChange("upfront")}
        type="button"
      >
        Pay Upfront
      </button>
    </div>
  );
};

// Unified Pricing Card (Hero, Plus)
const PricingCard = ({
  offer,
  tierId,
  tierLabel,
  isAnnual,
  isPopular,
  showPaymentToggle,
  selectedPayment,
  onPaymentChange,
  savingsText,
}) => {
  const { initiateCheckout, navigateToCheckout, pageOptions, basketLoading } = useBasket();

  if (!offer) return null;

  const {
    display_price__limio,
    offer_features__limio,
  } = offer.data.attributes;

  const handleSubscribe = async () => {
    try {
      await initiateCheckout({
        order: {
          orderItems: [{ offer, quantity: 1 }],
        },
      });
      if (pageOptions?.pushToCheckout) {
        await navigateToCheckout();
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  // Parse features HTML to list items
  const parseFeatures = (featuresHtml) => {
    if (!featuresHtml) return [];
    // Simple parsing - extract text from list items
    const matches = featuresHtml.match(/<li[^>]*>([^<]+)<\/li>/gi);
    if (!matches) return [];
    return matches.map((item) => item.replace(/<[^>]+>/g, "").trim());
  };

  // Get features from offer or use static fallback
  const parsedFeatures = parseFeatures(offer_features__limio);
  const features = parsedFeatures.length > 0 ? parsedFeatures : (TIER_FEATURES[tierId] || []);

  return (
    <div className={`pricing-card-wrapper ${isPopular ? "highlighted" : ""}`}>
      {isPopular && (
        <div className="most-popular-badge">
          <span>Most popular</span>
        </div>
      )}
      <div className="pricing-card">
        <span className="plan-label">{isAnnual ? "1 YEAR" : "MONTHLY"}</span>
        <h2 className="plan-name">{tierLabel}</h2>

        {showPaymentToggle && (
          <PaymentToggle
            selectedPayment={selectedPayment}
            onChange={onPaymentChange}
            visible={showPaymentToggle}
          />
        )}

        <ul className="card-features">
          {features.map((feature, idx) => (
            <li key={idx}>{feature}</li>
          ))}
        </ul>

        <div className="price-wrapper">
          <h3
            className="price-title"
            dangerouslySetInnerHTML={{ __html: display_price__limio || "" }}
          />
          {savingsText && (
            <span className="savings-badge visible">{savingsText}</span>
          )}
        </div>

        <button
          className="btn btn-purple card-btn"
          onClick={handleSubscribe}
          disabled={basketLoading}
          type="button"
        >
          {basketLoading ? "Loading..." : "Subscribe"}
        </button>
      </div>
    </div>
  );
};

// Static PRO card component (uses Calendly for booking)
const ProCard = ({ isAnnual }) => {
  const [calendlyReady, setCalendlyReady] = useState(false);

  useEffect(() => {
    loadCalendlyScript(() => setCalendlyReady(true));
  }, []);

  const handleGetQuote = () => {
    openCalendly(CALENDLY_URLS.proCard);
  };

  return (
    <div className="pricing-card-wrapper">
      <div className="pricing-card">
        <span className="plan-label">{isAnnual ? "1 YEAR" : "MONTHLY"}</span>
        <h2 className="plan-name">{proCardContent.title}</h2>

        <ul className="card-features">
          {proCardContent.features.map((feature, idx) => (
            <li key={idx}>{feature}</li>
          ))}
        </ul>

        <div className="price-wrapper">
          <h3 className="price-title">{proCardContent.priceText}</h3>
        </div>

        <button
          className="btn btn-purple card-btn"
          onClick={handleGetQuote}
          type="button"
        >
          {proCardContent.buttonText}
        </button>
      </div>
    </div>
  );
};

// Floating Devices (decorative images)
const FloatingDevices = () => {
  return (
    <>
      <img src={IMAGES.laptop} alt="JazzHR on laptop" className="laptop-floating" />
      <img src={IMAGES.tablet} alt="JazzHR on tablet" className="tablet-floating" />
      <img src={IMAGES.iphone} alt="JazzHR on iPhone" className="iphone-floating" />
    </>
  );
};

// FAQ Item (accordion item)
const FAQItem = ({ question, answer, isOpen, onClick, index }) => {
  return (
    <div className={`faq-item ${isOpen ? "open" : ""}`}>
      <div className="faq-question" onClick={onClick} role="button" tabIndex={0} onKeyPress={(e) => e.key === "Enter" && onClick()}>
        <h4>{question}</h4>
        <div className="faq-icons">
          <img
            src={isOpen ? IMAGES.chevronUp : IMAGES.chevronDown}
            alt=""
            className="faq-chevron"
          />
          <div className="faq-badge">
            <img src={IMAGES.chatBubble} alt="" />
            <span>{isOpen ? "A" : "Q"}</span>
          </div>
        </div>
      </div>
      <div className="faq-answer">
        <p>{answer}</p>
      </div>
    </div>
  );
};

// Support Card
const SupportCard = ({ title, icon, link, linkText }) => {
  return (
    <a href={link} className="support-card" target="_blank" rel="noopener noreferrer">
      <img src={icon} alt={title} className="card-icon" />
      <h3>{title}</h3>
      <span className="card-link">{linkText}</span>
    </a>
  );
};

// ============================================================================
// SECTION COMPONENTS
// ============================================================================

// Pricing Section
const PricingSection = ({
  isAnnual,
  onBillingChange,
  monthlyTiers,
  annualTiers,
  billingSelections,
  onCardBillingChange,
  billingLabels,
  defaultBillingPeriod,
}) => {
  // Determine which tiers to show based on billing period
  const tiersToShow = isAnnual ? annualTiers : monthlyTiers;

  return (
    <section className="pricing-section">
      <img src={IMAGES.brandGraphic04} alt="" className="pricing-bg-graphic" aria-hidden="true" />

      <div className="pricing-content">
        <FloatingDevices />

        {/* Billing Toggle */}
        <BillingToggle isAnnual={isAnnual} onChange={onBillingChange} />

        {/* Pricing Cards */}
        <div id="pricing-cards" className="pricing-cards-container">
          {tiersToShow.map((tier, index) => {
            // PRO tier uses static ProCard
            if (tier.id === "pro") {
              return <ProCard key={tier.id} isAnnual={isAnnual} />;
            }

            // Get billing options for this tier
            const billingOptions = organizeBillingOptions(tier.offers);
            const selectedBilling = billingSelections[tier.id] || defaultBillingPeriod;

            // Determine which offer to show
            let selectedOffer;
            if (isAnnual) {
              // For annual, check if user selected monthly or upfront payment
              const paymentType = selectedBilling === "annual-upfront" ? "annual-upfront" : "annual-monthly";
              selectedOffer = billingOptions[paymentType] || billingOptions["annual-monthly"] || billingOptions["annual-upfront"];
            } else {
              selectedOffer = billingOptions.monthly;
            }

            // Check if this tier has both annual payment options
            const hasPaymentToggle = isAnnual && billingOptions["annual-monthly"] && billingOptions["annual-upfront"];

            // Get savings text
            const savingsText = isAnnual ? getSavingsText(selectedOffer) : null;

            // Determine payment selection (monthly or upfront)
            const selectedPayment = selectedBilling === "annual-upfront" ? "upfront" : "monthly";

            return (
              <PricingCard
                key={tier.id}
                offer={selectedOffer}
                tierId={tier.id}
                tierLabel={tier.label}
                isAnnual={isAnnual}
                isPopular={index === 1}
                showPaymentToggle={hasPaymentToggle}
                selectedPayment={selectedPayment}
                onPaymentChange={(payment) => {
                  const newBilling = payment === "upfront" ? "annual-upfront" : "annual-monthly";
                  onCardBillingChange(tier.id, newBilling);
                }}
                savingsText={savingsText}
              />
            );
          })}

          {/* Always show PRO card even if no PRO offers exist */}
          {!tiersToShow.find((t) => t.id === "pro") && <ProCard key="pro-static" isAnnual={isAnnual} />}
        </div>

        {/* Disclaimer */}
        <p className="pricing-disclaimer">{pricingDisclaimer}</p>
      </div>
    </section>
  );
};

// Add-on Section
const AddOnSection = () => {
  const [calendlyReady, setCalendlyReady] = useState(false);

  useEffect(() => {
    loadCalendlyScript(() => setCalendlyReady(true));
  }, []);

  const handleBookDemo = () => {
    openCalendly(CALENDLY_URLS.addOn);
  };

  return (
    <section className="addon-section">
      <div className="addon-content">
        <img src={IMAGES.brandGraphic05} alt="" className="addon-bg-graphic" aria-hidden="true" />
        <h2 className="addon-title">{addOnContent.title}</h2>

        <div className="addon-card">
          <div className="addon-card-text">
            <h3>{addOnContent.cardTitle}</h3>
            <p>{addOnContent.cardDescription}</p>
          </div>

          <div className="addon-image-wrapper">
            <img src={IMAGES.texting} alt="Person texting on phone" />
          </div>
        </div>

        <button className="btn btn-purple-large" onClick={handleBookDemo} type="button">
          {addOnContent.buttonText}
        </button>
      </div>
    </section>
  );
};

// FAQ Section
const FAQSection = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(0); // First FAQ open by default

  const handleFaqClick = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? -1 : index);
  };

  return (
    <section className="faq-section">
      <img src={IMAGES.dividerTop} alt="" className="faq-divider-top" aria-hidden="true" />

      <div className="faq-content">
        <div className="faq-header">
          <h2 className="faq-title">JazzHR Pricing FAQs: Plans, Costs, and Features Explained</h2>
          <img src={IMAGES.brandGraphic03} alt="" className="faq-brand-graphic" aria-hidden="true" />
        </div>

        {faqContent.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            isOpen={openFaqIndex === index}
            onClick={() => handleFaqClick(index)}
            index={index}
          />
        ))}
      </div>

      <img src={IMAGES.dividerBottom} alt="" className="faq-divider-bottom" aria-hidden="true" />
    </section>
  );
};

// Demo Section
const DemoSection = () => {
  const [calendlyReady, setCalendlyReady] = useState(false);

  useEffect(() => {
    loadCalendlyScript(() => setCalendlyReady(true));
  }, []);

  const handleBookDemo = () => {
    openCalendly(CALENDLY_URLS.demo);
  };

  return (
    <section className="demo-section">
      <img src={IMAGES.brandGraphic08} alt="" className="demo-brand-graphic" aria-hidden="true" />

      <div className="demo-content">
        <div className="demo-image-wrapper">
          <img src={IMAGES.demo} alt="Business meeting" className="demo-image" />
        </div>

        <div className="demo-text">
          <h2>
            {demoContent.title} <span>{demoContent.titleBold}</span> {demoContent.titleEnd}
          </h2>
          <p>{demoContent.description}</p>
          <button className="btn btn-white" onClick={handleBookDemo} type="button">
            {demoContent.buttonText}
          </button>

          <div className="demo-apply-link">
            <p>{demoContent.applyText}</p>
            <a href={demoContent.applyLink}>{demoContent.applyLinkText}</a>
          </div>
        </div>
      </div>
    </section>
  );
};

// Support Section
const SupportSection = () => {
  return (
    <section className="support-section">
      <h2>Not Needing a Demo?</h2>
      <p>Get in touch based on what you need.</p>

      <div className="support-cards">
        {supportCardsContent.map((card, index) => (
          <SupportCard
            key={index}
            title={card.title}
            icon={card.icon}
            link={card.link}
            linkText={card.linkText}
          />
        ))}
      </div>
    </section>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const PricingCardsTiered = ({
  heading = "Click, subscribe, start hiring.",
  subheading = "Join today for instant access to JazzHR.",
  componentId = "pricing-cards-tiered",
  showFeatures = true,
  defaultBillingPeriod = "annual-monthly",
  tierOrder = [
    { id: "hero", label: "Hero Plan" },
    { id: "plus", label: "Plus Plan" },
    { id: "pro", label: "Pro Plan" },
  ],
  billingLabels = [
    { id: "annual-monthly", label: "Pay Monthly", description: "Annual commitment, billed monthly" },
    { id: "annual-upfront", label: "Pay Upfront", description: "Annual commitment, save more" },
  ],
  topLevelLabels = [
    { id: "monthly", label: "Monthly Plans" },
    { id: "annual", label: "1 Year Plans" },
  ],
  themeColor = "jazzHR",
}: Props) => {
  const { offers } = useCampaign();

  // Top-level toggle state (Monthly / Annual) - default to annual
  const [selectedTopLevel, setSelectedTopLevel] = useState("annual");
  const isAnnual = selectedTopLevel === "annual";

  // Per-card billing selections for annual view
  const [billingSelections, setBillingSelections] = useState({});

  // Organize offers by group
  const offersByGroup = useMemo(() => {
    return organizeOffersByGroup(offers);
  }, [offers]);

  // Get monthly offers grouped by tier
  const monthlyTiers = useMemo(() => {
    return groupOffersByTier(offersByGroup.monthly, tierOrder);
  }, [offersByGroup.monthly, tierOrder]);

  // Get annual offers grouped by tier
  const annualTiers = useMemo(() => {
    return groupOffersByTier(offersByGroup.annual, tierOrder);
  }, [offersByGroup.annual, tierOrder]);

  // Initialize billing selections for annual tiers
  useEffect(() => {
    const initialSelections = {};
    annualTiers.forEach((tier) => {
      initialSelections[tier.id] = defaultBillingPeriod;
    });
    setBillingSelections(initialSelections);
  }, [annualTiers, defaultBillingPeriod]);

  // Handle per-card billing change
  const handleCardBillingChange = (tierId, billingPeriod) => {
    setBillingSelections((prev) => ({
      ...prev,
      [tierId]: billingPeriod,
    }));
  };

  // Handle main billing toggle change
  const handleBillingToggleChange = (newIsAnnual) => {
    setSelectedTopLevel(newIsAnnual ? "annual" : "monthly");
  };

  useEffect(() => {
    typeof performance !== "undefined" && performance?.mark?.("pricing-cards-tiered-init");
  }, []);

  return (
    <div id={componentId} className="jazzhr-pricing-page">
      {/* Pricing Section */}
      <PricingSection
        isAnnual={isAnnual}
        onBillingChange={handleBillingToggleChange}
        monthlyTiers={monthlyTiers}
        annualTiers={annualTiers}
        billingSelections={billingSelections}
        onCardBillingChange={handleCardBillingChange}
        billingLabels={billingLabels}
        defaultBillingPeriod={defaultBillingPeriod}
      />

      {/* Add-on Section */}
      <AddOnSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Demo Section */}
      <DemoSection />

      {/* Support Section */}
      <SupportSection />
    </div>
  );
};

export default PricingCardsTiered;
