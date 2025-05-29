import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    favicon: './src/assets/icon.png',
    template: './src/index.html',
  },
  dev: {
    assetPrefix: '/',
  },
  output: {
    assetPrefix: '/',
  },
  source: {
    define: {
      'process.env.GOOGLE_CLIENT_ID': JSON.stringify(process.env.GOOGLE_CLIENT_ID),
    },
  },
});
