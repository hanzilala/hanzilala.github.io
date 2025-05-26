import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    template: './src/index.html',
  },
  dev: {
    assetPrefix: '/',
  },
  output: {
    assetPrefix: process.env.NODE_ENV === 'production' ? '/hanzii-lala/' : '/',
  },
});
