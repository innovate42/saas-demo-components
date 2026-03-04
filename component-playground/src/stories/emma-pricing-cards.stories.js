import { fn } from '@storybook/test';
import EmmaPricingCards from './../../../components/emma-pricing-cards';

export default {
    title: 'Emma/Pricing Cards',
    component: EmmaPricingCards,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    argTypes: {
        heading: { control: 'text' },
        subheading: { control: 'text' },
        primaryColor__limio_color: { control: 'color' },
        ctaColor__limio_color: { control: 'color' },
    },
};

export const Primary = {
    args: {
        heading: 'Flexible plans for teams of all sizes.',
        subheading: 'Prices starting at $99/month.',
        primaryColor__limio_color: '#053A5E',
        ctaColor__limio_color: '#053A5E',
        componentId: 'emma-pricing-cards',
    }
};
