import type { Preview } from "@storybook/react";
import "antd/dist/reset.css"; // Pastikan CSS Ant Design dimuat

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
