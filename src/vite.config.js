import { defineConfig } from 'vite'
import ghPages from 'vite-plugin-gh-pages'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [ghPages()],
  base: '/YOUR_REPO_NAME/', // ⚠️ include trailing slash
})
