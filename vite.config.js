import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr({
      svgrOptions: {
        exportType: 'named',
        ref: true,
        svgo: false,
        titleProp: true,
      },
    })
  ],
  server: {
    port: 5173,
    open: true,
    // Enable HMR for better development experience
    hmr: {
      overlay: true
    }
  },
  build: {
    // Optimize build output
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Disable sourcemaps in production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        // Optimize chunk splitting
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          charts: ['chart.js', 'react-chartjs-2'],
          icons: ['react-icons'],
          i18n: ['i18next', 'react-i18next', 'i18next-http-backend']
        }
      }
    }
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-i18next',
      'i18next',
      'chart.js',
      'react-chartjs-2'
    ]
  },
  // Define environment variables
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development')
  }
})
