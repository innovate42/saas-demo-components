// Static page content for the IRMI-HOME landing page mockup.
// Assets are referenced from irmi.com's own CDN so the mockup renders
// pixel-identical without shipping binaries through the Limio build.

const IMG = "https://www.irmi.com/cdn-cgi/image/"
const ICON = (name) => `${IMG}width=60,height=60,quality=100,format=auto/Images/Icons/${name}`

export const ASSETS = {
    logo: `${IMG}width=150,height=50,quality=100,format=auto/Images/Logos-Internal/IRMI_Logo_scaled.png`,
    heroBackground: `${IMG}width=1200,height=800,quality=75/Images/Marketing/PageTops/membership-landing-page.jpg`,
    cardCareer: `${IMG}width=600,height=400,quality=100,format=auto/Images/Marketing/Stock-Photos/young-business-professionals.jpg`,
    cardPlus: `${IMG}width=600,height=400,quality=100,format=auto/Images/Marketing/IRMI%20Plus%20-%20Icon.png`,
    cardWebinar: `${IMG}width=600,height=400,quality=100,format=auto/Images/Marketing/Stock-Photos/woman-attending-webinar.jpg`,
    promoBackground: `${IMG}width=1500,height=1000,quality=100,format=auto/Images/Marketing/PageTops/bright-orange-shield-among-many-blue-shields.jpg`,
    promoCard: `${IMG}width=600,height=400,quality=100,format=auto/Images/Marketing/iStock/product-recommendations.png`,
    certificationBadges: "https://www.irmi.com/Images/Promos/Certifications/IRMI-Certification-Badges.png",
    videoIQ: "https://embed-ssl.wistia.com/deliveries/0f8bc60e4dbc25347b948ce7e32c701e.jpg",
    videoWhyIRMI: "https://embed-ssl.wistia.com/deliveries/3a6114e1634b05643e7edacdf9906ec1.jpg"
}

export const NAV_LINKS = [
    {
        label: "Category Focus",
        items: [
            "Claims, Case Law, Legal", "Commercial Auto", "Commercial Liability",
            "Commercial Property", "COVID-19", "MultiLine",
            "Personal Lines and Small Business", "Risk Financing and Captives",
            "Risk Management", "Specialty Lines", "Workers Compensation",
            "White Papers", "Free Articles", "Videos"
        ]
    },
    {
        label: "Industry Focus",
        items: [
            "Agribusiness Industry", "Construction Industry", "Energy Industry",
            "Transportation Industry", "Insurance Industry"
        ]
    },
    {
        label: "Conferences",
        items: [
            "Agribusiness Conference", "Construction Risk Conference",
            "Energy Risk and Insurance Conference", "Transportation Risk Conference",
            "Sessions On Demand"
        ]
    },
    {
        label: "Insurance Education",
        items: [
            "Certifications", "Agribusiness and Farm Insurance Specialist",
            "Construction Risk and Insurance Specialist",
            "Energy Risk and Insurance Specialist",
            "Management Liability Insurance Specialist",
            "Manufacturing Risk and Insurance Specialist",
            "Transportation Risk and Insurance Professional",
            "Continuing Education", "Insurance Industry Training", "IRMI Webinars"
        ]
    },
    {
        label: "Subscribe",
        items: [
            "NEW! IRMI IQ Chatbot", "Plans and Pricing", "Catalog", "Request a Demo",
            "IRMI Tutorials", "Product Updates", "Enterprise Subscriptions",
            "Product Recommendations", "Free Newsletters", "White Papers",
            "Product Tour", "Podcast", "How-To Videos"
        ]
    },
    {
        label: "About IRMI",
        items: [
            "Our Mission", "Our Story", "Our Team", "Our Brands", "Press Releases",
            "Careers", "Contact Us", "Advertise"
        ]
    },
    { label: "Glossary", items: ["Terms", "Acronyms"] },
    {
        label: "Membership",
        items: [
            "IRMI Plus Membership", "IRMI Webinars", "Newsletters", "White Papers",
            "Join for Free"
        ]
    }
]

export const BANNER_CARDS = [
    {
        title: "Kickstart Your Career",
        image: ASSETS.cardCareer,
        body: "Power up your expertise with free access to webinars, newsletters, in-depth reports, and more—all vetted for you by IRMI experts.",
        cta: "Join Now"
    },
    {
        title: "Stay a Step Ahead",
        image: ASSETS.cardPlus,
        body: "Get an additional edge with an IRMI Plus membership that includes access to IRMI Insurance Coverage Essentials and the IRMI IQ chatbot.",
        cta: "Start Your Plus Membership"
    },
    {
        title: "Attend a Free Webinar",
        image: ASSETS.cardWebinar,
        body: "These members-only sessions led by industry experts will take you on a deep dive into hot-button topics and emerging trends.",
        cta: "Browse Webinars"
    }
]

export const TOPIC_CARDS = [
    { title: "Claims, Case Law, Legal", icon: ICON("legal_orange.png") },
    { title: "Commercial Auto", icon: ICON("commercialAuto_orange.png") },
    { title: "Commercial Liability", icon: ICON("commercialLiability_orange.png") },
    { title: "Commercial Property", icon: ICON("commercialProperty_orange.png") },
    { title: "Specialty Lines", icon: ICON("professionalLiability_orange.png") },
    { title: "Personal Lines & Small Business", icon: ICON("personalLines_orange.png") },
    { title: "Risk Financing and Captives", icon: ICON("riskFinanace_orange.png") },
    { title: "Risk Management", icon: ICON("riskManagement_orange.png") },
    { title: "Workers Compensation", icon: ICON("workersComp_orange.png") }
]

export const INDUSTRY_CARDS = [
    { title: "Agribusiness", icon: ICON("agriculture_orange.png") },
    { title: "Construction", icon: ICON("construction_orange.png") },
    { title: "Energy", icon: ICON("oilRig_orange.png") },
    { title: "Transportation", icon: ICON("transportationTruck_orange.png") }
]

export const PATH_CARDS = [
    {
        title: "Content",
        body: "IRMI subscription resources can help you make smarter risk management and insurance placement decisions.",
        cta: "Explore"
    },
    {
        title: "Conferences",
        body: "Attend one-of-a-kind events that bring together producers, insurers, and insurance buyers to learn from each other.",
        cta: "Find Events"
    },
    {
        title: "Certifications",
        body: "IRMI certifications enable you to showcase your specialized expertise and distinguish yourself from the competition.",
        cta: "Get Certified"
    },
    {
        title: "Continuing Education",
        body: "Need CE? IRMI has partnered with WebCE to bring you courses that are informative, economical, and convenient.",
        cta: "Find a CE Course"
    }
]

export const TESTIMONIALS = [
    {
        quote: "Nothing has ever compared to IRMI in terms of accuracy, timeliness, and insight.",
        name: "Steven Davis",
        title: "Director, Senior Vice President, McGriff, Seibels & Williams, Inc."
    },
    {
        quote: "It’s been a great tool for us in onboarding any new person to the department.",
        name: "Stephanie Fisher",
        title: "Director, Risk Management and Insurance, Quanta Services, Inc."
    },
    {
        quote: "Over the years, I’ve found IRMI reference materials to be indispensable tools....",
        name: "Bill Wilson",
        title: "Founder and CEO , Insurance Commentary.com"
    },
    {
        quote: "When you see something on the IRMI website, it’s been through extensive peer review, both internally and externally, and that’s why it’s viewed as an expert source.",
        name: "Charles “Buddy” Gillenwater",
        title: "Risk Manager, City of Mesquite, Texas"
    },
    {
        quote: "[IRMI] is my ‘Google’ when it comes to insurance-related items…when it comes to waivers of subrogation or language I’m looking at … it’s become my go to.",
        name: "Soledad Torres",
        title: "Risk and Insurance Manager, Pankow Builders"
    }
]

export const FOOTER_COLUMNS = [
    {
        heading: "Quick Links",
        links: [
            "Conferences", "Certifications", "Continuing Education", "Pay My Invoice",
            "Product Updates", "Help", "Contact Us"
        ]
    },
    {
        heading: "Privacy Rights",
        links: [
            "Privacy", "California Privacy Rights Notice", "Texas Privacy Rights Notice",
            "Do Not Sell or Share My Personal Information", "Request My Data", "Delete My Data"
        ]
    },
    {
        heading: "Legal",
        links: [
            "Terms of Use", "Certifications Terms and Conditions", "Accessibility",
            "Business Continuity"
        ]
    },
    {
        heading: "Connect with Us",
        links: ["Membership", "Conferences", "Free Newsletters"],
        social: true
    }
]
