import { fn } from '@storybook/test';
import EmmaFeatureComparison from './../../../components/emma-feature-comparison';

export default {
    title: 'Emma/Feature Comparison',
    component: EmmaFeatureComparison,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    argTypes: {
        heading: { control: 'text' },
    },
};

export const Primary = {
    args: {
        heading: 'Compare plans',
        componentId: 'emma-feature-comparison',
    }
};
