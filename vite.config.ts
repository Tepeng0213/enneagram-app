import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import pwaManifest from './public/manifest.json';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const gasUrl = env.VITE_SHEET_WEBAPP_URL || '';
  const isProd = mode === 'production';

  let proxy: Record<string, object> | undefined;
  if (gasUrl.includes('script.google.com/macros/s/')) {
    try {
      const u = new URL(gasUrl);
      const base = u.origin + u.pathname.replace(/\/exec\/?$/, '');
      proxy = {
        '/gas-proxy': {
          target: base,
          changeOrigin: true,
          secure: true,
          rewrite: () => '/exec',
        },
      };
    } catch {
      /* ignore */
    }
  }

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        devOptions: {
          enabled: false,
        },
        includeAssets: [
          'favicon.ico',
          'apple-touch-icon.png',
          'icon-192.png',
          'icon-512.png',
          'manifest.json',
        ],
        manifest: {
          ...pwaManifest,
          icons: pwaManifest.icons.map((icon) => ({
            ...icon,
            src: icon.src.replace(/^\//, ''),
          })),
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,woff,woff2}'],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/script\.google\.com\/macros\/.*/i,
              handler: 'NetworkOnly',
            },
          ],
        },
        disable: !isProd,
      }),
    ],
    server: proxy ? { proxy } : undefined,
  };
});
