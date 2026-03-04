import { fn } from '@storybook/test';
import EmmaPricingHero from './../../../components/emma-pricing-hero';

export default {
    title: 'Emma/Pricing Hero',
    component: EmmaPricingHero,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    argTypes: {
        heading: { control: 'text' },
        subheading: { control: 'text' },
    },
};

export const Primary = {
    args: {
        heading: 'Flexible plans for teams of all sizes.',
        subheading: 'Prices starting at $99/month.',
        componentId: 'emma-pricing-hero',
    }
};
