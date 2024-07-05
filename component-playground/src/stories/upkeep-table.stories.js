import { fn } from '@storybook/test';
import UpkeepTable from './../../../components/upkeep-table';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
    title: 'Components/Upkeep Table',
    component: UpkeepTable,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'fullscreen',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {
     
    },
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
    args: {
    
    }
};
