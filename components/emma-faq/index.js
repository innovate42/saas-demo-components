import React, { useState } from "react"
import { useStaticProps } from "./componentStaticProps"
import FaqItem from "./components/FaqItem"
import "./index.css"

const EmmaFaq = () => {
    const props = useStaticProps() || {}
    const {
        faqHeading = "Frequently Asked Questions",
        faqItems = [],
        ctaHeading = "All the tools you need to master email marketing.",
        ctaDescription = "Emma makes it easier than ever for your team to drive conversions and revenue with email.",
        ctaButtonText = "Get a demo",
        ctaButtonLink = "/demo",
        showCtaBanner = true,
        servicesHeading = "Get expert help when you need it",
        servicesDescription = "From Custom Design to Success Management and more, our Professional Services are like an extension of your marketing team.",
        servicesButtonText = "Learn more",
        servicesButtonLink = "/services",
        showServices = true,
        primaryColor__limio_color = "#053A5E",
    } = props

    const [openIndex, setOpenIndex] = useState(null)

    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    return (
        <section
            className="ef-faq"
            style={{ "--ef-primary": primaryColor__limio_color }}
        >
            <div className="ef-container">
                {faqHeading && <h2 className="ef-heading">{faqHeading}</h2>}

                {faqItems.length > 0 && (
                    <div className="ef-accordion">
                        {faqItems.map((item, i) => (
                            <FaqItem
                                key={`faq-${i}`}
                                question={item.question}
                                answer={item.answer}
                                isOpen={openIndex === i}
                                onToggle={() => handleToggle(i)}
                            />
                        ))}
                    </div>
                )}

                {showServices && (
                    <div className="ef-services">
                        <h3 className="ef-services-heading">{servicesHeading}</h3>
                        <p className="ef-services-description">{servicesDescription}</p>
                        <a href={servicesButtonLink} className="ef-services-cta">
                            {servicesButtonText}
                        </a>
                    </div>
                )}

                {showCtaBanner && (
                    <div className="ef-cta-banner">
                        <h3 className="ef-cta-heading">{ctaHeading}</h3>
                        <p className="ef-cta-description">{ctaDescription}</p>
                        <a href={ctaButtonLink} className="ef-cta-button">
                            {ctaButtonText}
                        </a>
                    </div>
                )}
            </div>
        </section>
    )
}

export default EmmaFaq
