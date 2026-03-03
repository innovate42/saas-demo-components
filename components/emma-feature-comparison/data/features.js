// @flow

export const defaultPlans = ["Emma Lite", "Emma Essentials", "Emma for Teams", "Emma Corporate"];

export const defaultCategories = [
  {
    name: "Account Management",
    features: [
      { name: "Tiered account structure", values: ["2 subaccounts", "2 subaccounts", "5+ subaccounts", "10+ subaccounts"] },
      { name: "Users", values: ["5", "10", "25", "Unlimited"] },
      { name: "User role types", values: ["2", "5", "6", "6"] },
      { name: "Unlimited email sending", values: [true, true, true, true] },
      { name: "Custom user permissions", values: [false, false, true, true] },
      { name: "Approvals dashboard", values: [false, true, true, true] },
      { name: "Activity dashboard", values: [false, true, true, true] },
      { name: "Subaccount categories", values: [false, false, true, true] },
      { name: "Private branding", values: [false, true, true, true] },
    ],
  },
  {
    name: "Marketing Channels & Tools",
    features: [
      { name: "Email", values: [true, true, true, true] },
      { name: "Email scheduling", values: [true, true, true, true] },
      { name: "Smart send", values: [true, true, true, true], isNew: true },
      { name: "Marketing calendar", values: [false, true, true, true] },
      { name: "Signup forms", values: [true, true, true, true] },
      { name: "Landing pages", values: [false, true, true, true] },
      { name: "SMS", values: [false, true, true, true] },
    ],
  },
  {
    name: "Brand Manager",
    features: [
      { name: "Style Guide", values: [false, "Limited", true, true] },
      { name: "Template & campaign sharing", values: [false, false, true, true] },
      { name: "Subject and Preheader Locking", values: [false, false, true, true] },
      { name: "Asset sharing", values: [false, false, true, true] },
      { name: "Template folder sharing", values: [false, false, true, true] },
    ],
  },
  {
    name: "Design",
    features: [
      { name: "Drag & drop email editor", values: [true, true, true, true] },
      { name: "Save Email Rows", values: [false, false, true, true] },
      { name: "AI Assistant", values: [true, true, true, true] },
      { name: "Email template gallery", values: [true, true, true, true] },
      { name: "Code your own emails", values: [false, true, true, true] },
      { name: "Asset library", values: [true, true, true, true] },
    ],
  },
  {
    name: "Automation",
    features: [
      { name: "Automation builder", values: ["1 journey", "Unlimited", "Unlimited", "Unlimited"] },
      { name: "Multiple starting points", values: [false, true, true, true] },
      { name: "Branching points", values: [false, true, true, true] },
      { name: "Custom event-driven automations", values: [false, true, true, true] },
    ],
  },
  {
    name: "Audience",
    features: [
      { name: "Segmentation", values: [true, true, true, true] },
      { name: "Smart segment", values: [true, true, true, true], isNew: true },
      { name: "Dynamic content", values: [true, true, true, true] },
      { name: "Subscription management", values: [true, true, true, true] },
      { name: "Contact view across subaccounts", values: [false, false, false, true], isNew: true },
      { name: "Audience sharing", values: [false, false, false, true] },
    ],
  },
  {
    name: "Insights & Optimization",
    features: [
      { name: "Real-time reporting", values: [true, true, true, true] },
      { name: "Comparative reporting", values: [false, true, true, true] },
      { name: "Trends reporting", values: [false, false, true, true] },
      { name: "Pre-send email testing", values: [true, true, true, true] },
      { name: "A/B subject line split testing", values: [true, true, true, true] },
      { name: "A/B content split testing", values: [false, true, true, true] },
      { name: "Integrations", values: [true, true, true, true] },
      { name: "API access", values: [true, true, true, true] },
    ],
  },
  {
    name: "Help & Support",
    features: [
      { name: "In-app support", values: [true, true, true, true] },
      { name: "Email support", values: [true, true, true, true] },
      { name: "Phone support", values: [true, true, true, true] },
      { name: "Priority support", values: [false, false, false, true] },
      { name: "Deliverability support", values: [true, true, true, true] },
      { name: "Help center", values: [true, true, true, true] },
      { name: "Training videos", values: [true, true, true, true] },
      { name: "Single sign-on", values: [false, false, true, true] },
    ],
  },
];
