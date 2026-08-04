import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
//
// `base` controls the public path the app is served from.
//   - Vercel / Render (custom domain or root deploy): base "/"
//   - GitHub Pages project site (https://user.github.io/repo-name/): base "/repo-name/"
//
// We read it from an env var so the SAME config works everywhere:
// set VITE_BASE_PATH="/repo-name/" only when building for GitHub Pages,
// e.g. in package.json: "build:ghpages": "VITE_BASE_PATH=/repo-name/ vite build"
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/',
  server: {
    port: 5173,
  },
})
