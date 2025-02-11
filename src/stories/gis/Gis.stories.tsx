import type { Meta, StoryObj } from "@storybook/react";
import { GisGoogleMap, GisMaplibre } from "./Gis";

const meta = {
    title: "Example/GIS",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

// Story React Google Maps
export const ReactGoogleMap: Story = {
    render: () => <GisGoogleMap />,
};

// Story MapLibre
export const ReactMapLibre: Story = {
    render: () => <GisMaplibre />,
};
