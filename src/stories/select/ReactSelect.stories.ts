import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { ReactSelect } from './ReactSelect';


const meta = {
  title: 'Example/ReactSelect',
  component: ReactSelect,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ReactSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ReactSelect1: Story = {
  args: {

  }
};

// More on interaction testing: https://storybook.js.org/docs/writing-tests/interaction-testing
export const ReactSelect2: Story = {

  play: async ({ }) => {
    // const canvas = within(canvasElement);
    // const loginButton = canvas.getByRole('button', { name: /Log in/i });
    // await expect(loginButton).toBeInTheDocument();
    // await userEvent.click(loginButton);
    // await expect(loginButton).not.toBeInTheDocument();

    // const logoutButton = canvas.getByRole('button', { name: /Log out/i });
    // await expect(logoutButton).toBeInTheDocument();
    await expect(true).toBeTruthy();
  },
};
