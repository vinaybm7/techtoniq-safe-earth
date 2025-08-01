import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';



// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables based on the current mode
  const env = loadEnv(mode, process.cwd(), '');
  
  const isProduction = mode === 'production';
  const apiUrl = '/api'; // Use /api for both development (proxy) and production (serverless)

  return {
    define: {
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(apiUrl),
      'process.env.NODE_ENV': JSON.stringify(mode === 'production' ? 'production' : 'development'),
    },
    server: {
      host: '::',
      port: 3000,
      strictPort: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
          enabled: true
        },
        manifest: {
          name: 'Techtoniq - Earthquake Safety Platform',
          short_name: 'Techtoniq',
          description: 'AI-powered earthquake prediction and safety platform',
          theme_color: '#ffffff',
          background_color: '#ffffff',
          display: 'standalone',
          icons: [
            {
              src: '/app_images/android/android-launchericon-192-192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/app_images/android/android-launchericon-512-512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: '/app_images/android/android-launchericon-512-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'apple touch icon'
            }
          ]
        }
      })
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src")
      }
    }
  };
});
