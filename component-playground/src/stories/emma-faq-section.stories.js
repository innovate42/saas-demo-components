import { fn } from '@storybook/test';
import EmmaFaqSection from './../../../components/emma-faq-section';

export default {
    title: 'Emma/FAQ Section',
    component: EmmaFaqSection,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    argTypes: {
        faqHeading: { control: 'text' },
        ctaHeading: { control: 'text' },
        ctaDescription: { control: 'text' },
        ctaButtonText: { control: 'text' },
        ctaButtonLink: { control: 'text' },
        primaryColor__limio_color: { control: 'color' },
    },
};

export const Primary = {
    args: {
        faqHeading: 'Frequently Asked Questions',
        faqItems: [
            {
                question: 'Who is eligible for these plans?',
                answer: '<p>These plans are available for new customers purchasing from July 21, 2022. Existing customers can contact their account manager for migration options.</p>',
            },
            {
                question: 'What if I have more than 10,000 contacts?',
                answer: '<p>If you have more than 10,000 contacts, please contact us for a custom quote tailored to your needs. We offer flexible pricing for larger contact lists.</p>',
            },
            {
                question: 'Can I change plans later?',
                answer: '<p>Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.</p>',
            },
            {
                question: 'Is there a free trial available?',
                answer: '<p>We offer personalized demos so you can see exactly how Emma works for your business. Request a demo to get started.</p>',
            },
        ],
        ctaHeading: 'Get expert help when you need it',
        ctaDescription: 'Our Professional Services team can help you build long-term brand loyalty, maximize marketing success, and drive optimal business results.',
        ctaButtonText: "Let's chat",
        ctaButtonLink: '/contact',
        primaryColor__limio_color: '#053A5E',
        componentId: 'emma-faq-section',
    }
};
