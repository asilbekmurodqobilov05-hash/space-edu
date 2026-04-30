import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      // .jsx and .js take priority — old .tsx/.ts files become orphaned as we migrate
      extensions: ['.mjs', '.js', '.jsx', '.json', '.ts', '.tsx'],
      alias: {
        '@': resolve(process.cwd(), 'src'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      // cosmic-silk-road.html va boshqa statik sahifalar shu origin orqali /api/v1 chaqiradi (CORSsiz)
      proxy: {
        '/api/v1': {
          target: env.VITE_API_PROXY_TARGET || 'http://127.0.0.1:8000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    preview: {
      proxy: {
        '/api/v1': {
          target: env.VITE_API_PROXY_TARGET || 'http://127.0.0.1:8000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      target: 'es2020',
      minify: 'esbuild',
      cssMinify: true,
      sourcemap: false,
      assetsInlineLimit: 4096,
      rollupOptions: {
        output: {
          manualChunks: {
            three: ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
          },
        },
      },
    },
  };
});
