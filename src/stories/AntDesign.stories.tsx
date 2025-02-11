// src/stories/AntDesign.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import AntDesign from "./AntDesign";

const meta = {
  title: "Example/AntDesign",
  component: AntDesign,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof AntDesign>;

export default meta;
type Story = StoryObj<typeof meta>;

// Ubah label menjadi  "DatePicker"
export const DatePicker: Story = {};
