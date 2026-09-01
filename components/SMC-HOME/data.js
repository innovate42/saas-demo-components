// Static page content for the SMC-HOME landing page mockup.
// Assets are referenced from the source site's CDN so the mockup renders
// pixel-identical without shipping binaries through the Limio build.

const CDN = "https://sendmarc.com/home-assets/wp-content/uploads/"

export const ASSETS = {
    logo: CDN + "sendmarc-logo-dark.svg",
    logoMark: CDN + "2024/04/favicon.svg",
    footerLogo: CDN + "Sendmarc-Footer-Logo.svg",
    heroBackground: CDN + "Sendmarc-Home-Hero-Desktop.webp",
    heroBackgroundMobile: CDN + "2024/04/Sendmarc-Home-Page-Hero-Mobile.webp",
    videoThumbnail: "https://i.ytimg.com/vi/23L103zilzo/maxresdefault.jpg",
    bimi: CDN + "Home-BIMI-Example-White-1024x845.png",
    partnerInterface: CDN + "2024/04/Senmarc-Opportunities-Example-Interface-Desktop.png",
    officesMap: CDN + "Regional-Map-labelled-light-EN.png"
}

export const UTILITY_LINKS = ["English", "Contact", "Support"]

export const NAV_LINKS = [
    { label: "Products", hasMenu: true },
    { label: "Free Tools", hasMenu: true },
    { label: "Solutions", hasMenu: false },
    { label: "Pricing", hasMenu: false },
    { label: "Resources", hasMenu: true },
    { label: "MSPs & Partners", hasMenu: false },
    { label: "Company", hasMenu: true },
    { label: "Blog", hasMenu: false }
]

export const G2_BADGES = [
    { src: CDN + "DMARC_MomentumLeader_Leader-200w.webp", alt: "G2 Review Momentum Leader Badge Winter 2026" },
    { src: CDN + "DMARC_EasiestAdmin_Mid-Market_EaseOfAdmin-200w.webp", alt: "G2 Review Easiest Admin Badge Winter 2026" },
    { src: CDN + "DMARC_BestEstimatedROI_Mid-Market_Roi-200w.webp", alt: "G2 Review Best Est. Roi Badge Winter 2026" },
    { src: CDN + "DMARC_Leader_Leader-200w.webp", alt: "G2 Review Leader Badge Spring 2026" },
    { src: CDN + "DMARC_HighestUserAdoption_Mid-Market_Adoption-200w.webp", alt: "G2 Review Highest User Adoption Badge Spring 2026" },
    { src: CDN + "DMARC_EasiestToUse_Mid-Market_EaseOfUse-200w.webp", alt: "G2 Review Easiest To Use Badge Spring 2026" },
    { src: CDN + "DMARC_EasiestSetup_Mid-Market_EaseOfSetup-200w.webp", alt: "G2 Review Easiest Setup Spring 2026" },
    { src: CDN + "DMARC_BestSupport_Mid-Market_QualityOfSupport-200w.webp", alt: "G2 Review Best Support Badge Spring 2026" }
]

export const TRUST_LOGOS = [
    { src: CDN + "Altron-Logo-1-300x169.webp", alt: "Altron" },
    { src: CDN + "Bidvest-Logo-1-300x169.webp", alt: "Bidvest" },
    { src: CDN + "Daily-Maverick-Logo-1-300x169.webp", alt: "Daily Maverick" },
    { src: CDN + "iKhokha-Logo-1-300x169.webp", alt: "iKhokha" },
    { src: CDN + "King-Price-Logo-1-300x169.webp", alt: "King Price" },
    { src: CDN + "Luno-Logo-1-300x169.webp", alt: "Luno" },
    { src: CDN + "Orbvest-Logo-1-300x169.webp", alt: "Orbvest" },
    { src: CDN + "Ozow-Logo-1-300x169.webp", alt: "Ozow" },
    { src: CDN + "Prudential-Logo-1-300x169.webp", alt: "Prudential" },
    { src: CDN + "Rain-Logo-1-300x169.webp", alt: "Rain" }
]

export const TESTIMONIALS = [
    {
        id: "mrprice",
        logo: CDN + "Mr-Price-Group-Limited-Logo.png",
        logoAlt: "Mr Price Group Limited",
        headline: "Sendmarc’s DMARC solution was a game-changer",
        quote: "“As a major retailer with an e-commerce presence, the integrity of our customer communication is paramount. The implementation of Sendmarc’s DMARC solution was a game-changer, giving us the visibility and control needed to move swiftly to enforcement, blocking volumes of malicious phishing and spoofing emails that threatened our brand reputation and operations. This has led to a noticeable decrease in fraudulent emails, thereby safeguarding our customers, while also enhancing the deliverability of legitimate marketing and transactional emails, which is a critical factor in driving better conversion rates. Sendmarc provides an essential security layer that protects our brand and reinforces customer trust in our business.”",
        name: "Kim Sim",
        role: "Chief Information Officer at Mr Price Group"
    },
    {
        id: "growthpoint",
        logo: CDN + "Growthpoint_Properties_Logo.png",
        logoAlt: "Growthpoint Properties Logo",
        headline: "The Sendmarc team simplified a complex process",
        quote: "“Partnering with Sendmarc gave us clear visibility and control over our email domains. We moved from monitoring to DMARC enforcement with confidence, significantly reducing spoofing and the risk of fraudulent emails impersonating Growthpoint. The Sendmarc team simplified a complex process and provided the expertise we needed to implement DMARC correctly across multiple domains.”",
        name: "Nishlen Moodley",
        role: "IT Manager at Growthpoint Properties"
    },
    {
        id: "cancercouncil",
        logo: CDN + "Cancerl-Council-Logo.png",
        logoAlt: "Cancer Council Logo",
        headline: "Exceptional one-on-one support",
        quote: "“Centralizing compliance controls within the IT infrastructure has effectively reduced shadow IT instances while streamlining configurations. This has alleviated the burden on security specialists, allowing them to focus on core responsibilities. Furthermore, Sendmarc has provided exceptional one-on-one support, ensuring a seamless experience.”",
        name: "Ashlen Naicker",
        role: "Former Head of Digital and ICT"
    },
    {
        id: "wayforward",
        logo: CDN + "2024/06/The-Way-Forward-Logo-LRG.png",
        logoAlt: "The Way Forward Information Technology Logo",
        headline: "Sendmarc has been an invaluable partner on our journey to securing our email communications",
        quote: "“Their advanced DMARC solution has shielded our business from phishing attacks and email fraud while also providing us with unparalleled insights into our email traffic. Sendmarc’s powerful platform has ensured that only legitimate emails are sent on our behalf. Their user-friendly interface and expert support have made DMARC implementation seamless, even for our non-technical team members. The peace of mind Sendmarc provides is immeasurable, as we now know that our clients and stakeholders can trust the authenticity of our emails.”",
        name: "Derek Middleton",
        role: "Systems Engineer at the Way Forward IT"
    },
    {
        id: "enerds",
        logo: CDN + "eNerds-Logo-2.webp",
        logoAlt: "eNerds Logo",
        headline: "Sophisticated & flexible platform",
        quote: "“Sophisticated platform, knowledgeable staff, flexibility to adjust and tweak as needed.”",
        name: "Tristan Warner",
        role: "Co-Founder & Chief Innovation Officer at eNerds"
    },
    {
        id: "chmvuwani",
        logo: CDN + "2024/05/CHM-Vuwani-Logo-1.png",
        logoAlt: "CHM Vuwani Logo",
        headline: "Passionate & great team to work with",
        quote: "“They live and breathe their mission to make the internet safer. Simple and feature-rich solution that’s easily understandable.”",
        name: "Shailendra Harri",
        role: "Business Development Manager at CHM Vuwani"
    },
    {
        id: "turrito",
        logo: CDN + "2024/05/Turrito-Logo.png",
        logoAlt: "Turrito Logo",
        headline: "Phenomenal product & team",
        quote: "“Sendmarc offers very powerful and simple solutions to very real problems our customers face. Their technology is excellent and their team is among the best in the industry.”",
        name: "Brian Timperley",
        role: "Co-Founder and CEO at Turrito Networks"
    },
    {
        id: "dataeco",
        logo: CDN + "2024/05/DataEco-Logo.png",
        logoAlt: "DataEco Logo",
        headline: "World-class technology, even better team",
        quote: "“Sendmarc solves a real business problem and is an easy sale. They’re passionate about their mission to make the internet a safer place. The platform’s easy to use, and implementation is simple. The team manages the entire solution to ensure 100% success and has a 90-day guarantee to get your domain to 5 out of 5.”",
        name: "Brian Tarr",
        role: "CEO at Data Eco"
    },
    {
        id: "icbf",
        logo: CDN + "ICBF-Logo.png",
        logoAlt: "ICBF Logo",
        headline: "It’s efficient and reliable",
        quote: "“It gives us real peace of mind. At any moment, I can log into the Sendmarc dashboard and see exactly what’s happening. If anything suspicious comes up, it’s addressed immediately. It’s efficient, reliable, and doesn’t need constant supervision.”",
        name: "Jonathan Flack",
        role: "Snr IT Admin at Irish Cattle Breeding Federation"
    },
    {
        id: "blacktip",
        logo: CDN + "2024/04/Blacktip-Logo.png",
        logoAlt: "Blacktip Logo",
        headline: "Sendmarc cares about us",
        quote: "“We’ve had the privilege of working with the Sendmarc team for a few months. They are highly responsive and truly curious. They want to make sure things are right and they care about us as a partner.”",
        name: "Matthew Bookspan",
        role: "CEO at Blacktip IT Services"
    },
    {
        id: "mangosuthu",
        logo: CDN + "Mangosuthu-University-Logo.svg",
        logoAlt: "Mangosuthu University Logo",
        headline: "Reduced attacks and reliable inbox delivery",
        quote: "“We’ve seen a dramatic reduction in spoofing and impersonation attacks, and our legitimate emails now reach their intended recipients more reliably. This has restored confidence in our digital communications and ensures we’re protecting both our staff and students from email-based threats.”",
        name: "Dr. Marlo De Swardt",
        role: "CIO at Mangosuthu University of Technology"
    }
]

export const FOOTER_COLUMNS = [
    {
        heading: "Platform & Services",
        links: [
            "Start free trial", "DMARC", "DMARC Platform for MSPs", "DMARC Enterprise",
            "Breach Detection", "Lookalike Domain Defense", "BIMI", "Solutions", "Support"
        ]
    },
    {
        heading: "Company",
        links: ["Pricing", "Partners", "Testimonials", "About us", "Contact us", "Legal"]
    },
    {
        heading: "Resources",
        links: [
            "Blog", "Product documentation", "Implementation instructions",
            "Free tools", "Case studies", "PAIA manual", "Whistleblower"
        ]
    }
]

export const FOOTER_BADGES = [
    { src: CDN + "SOC-2-Type-II-150x150.webp", alt: "SOC 2 Type II", modifier: "square" },
    { src: CDN + "ISO-27001-1-150x150.webp", alt: "ISO 27001", modifier: "square" },
    { src: CDN + "DMARC-Certified-Shield-Light-150w.webp", alt: "DMARC Certified", modifier: "shield" },
    { src: CDN + "users-love-us.svg", alt: "Sendmarc G2 Review award - Users love us", modifier: "wide" }
]

export const LEGAL_LINKS = ["Website terms", "Privacy policy", "Terms of service", "Security"]
