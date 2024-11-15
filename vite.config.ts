/*
 * @Author: Chris
 * @Date: 2023-08-25 18:28:07
 * @LastEditors: Chris
 * @LastEditTime: 2023-08-30 15:44:42
 * @FilePath: \PagTest\vite.config.ts
 * @Description: 
 * 
 * Copyright (c) 2023 by aiyiyun, All Rights Reserved. 
 */
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
  },
  plugins: [
    vue(),
    vueJsx(),
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/libpag/lib/libpag.wasm',
          dest: '/'
        },
        {
          src: 'src/static/*',
          dest: '/'
        }
      ]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
