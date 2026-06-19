import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  // Setting base to './' ensures all asset paths are relative.
  // This is critical for GitHub Pages where the app might be hosted in a subdirectory (e.g. username.github.io/repo-name/)
  base: './',
});
