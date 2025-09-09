import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 3000,
    historyApiFallback: true,
    proxy: {
      '/merchant': {
        target: 'http://jxgs-newos-merchantmanage.zhihuiyouzhan.com:81',
        changeOrigin: true,
        logLevel: 'debug',
      },
      '/microservice-station': {
        target: 'http://jxgs-newos-station.zhihuiyouzhan.com:81',
        changeOrigin: true,
        logLevel: 'debug',
      },
      '/oil/api': {
        target: 'http://jxgs-newos-oil.zhihuiyouzhan.com:81',
        changeOrigin: true,
        logLevel: 'debug',
      },
    },
  },
  build: {
    outDir: 'build',
  },
  resolve: {
    alias: {
      '@': '/src',
    },
    // 添加此项配置，允许省略.jsx扩展名
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  // 添加esbuild配置，处理.js文件中的JSX
  esbuild: {
    jsx: 'preserve',
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
  },
});