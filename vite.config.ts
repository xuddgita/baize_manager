import { defineConfig } from 'vite';
import { resolve } from 'path';
// vite插件
import VueDevTools from 'vite-plugin-vue-devtools';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import unocss from '@unocss/vite';
import htmlTemplate from 'vite-plugin-html-template';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import setupExtend from 'unplugin-vue-setup-extend-plus/vite';
import Layouts from 'vite-plugin-vue-meta-layouts';
import Pages from 'vite-plugin-pages';
import compression from 'vite-plugin-compression';

const plugins = [
  AutoImport({
    include: [/\.[tj]sx?$/, /\.vue\?vue/, /\.md$/],
    imports: ['vue', 'vue-router', 'pinia'],
    resolvers: [],
    dts: 'src/types/auto-imports.d.ts'
  }),
  Components({
    include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
    resolvers: [],
    dts: 'src/types/components.d.ts'
  }),
  VueDevTools(),
  vue(),
  vueJsx(),
  htmlTemplate({
    data: {
      title: '唐僧叨叨后台管理'
    }
  }),
  unocss(),
  setupExtend({}),
  Layouts({
    defaultLayout: 'index'
  }),
  Pages({
    dirs: 'src/pages',
    exclude: ['**/components/*.vue']
  }),
  compression({
    ext: '.gz',
    deleteOriginFile: false
  })
];

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
    }
  },
  define: {
    'process.env': {
      APP_ENV: process.env.APP_ENV
    }
  },
  plugins,
  css: {
    postcss: {
      plugins: [
        {
          postcssPlugin: 'internal:charset-removal',
          AtRule: {
            charset: atRule => {
              if (atRule.name === 'charset') {
                atRule.remove();
              }
            }
          }
        }
      ]
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/var.scss";`
      }
    }
  },
  server: {
    host: '0.0.0.0'
  },
  build: {
    cssCodeSplit: false,
    sourcemap: false,
    emptyOutDir: true,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          // 分包配置，配置完成自动按需加载
          vue: ['vue', 'vue-router', 'pinia', 'vue-i18n', 'element-plus'],
          echarts: ['echarts']
        }
      }
    }
  }
});