import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    // rollupOptions: {
    //   input: './packages/index.ts',
    //   output: [
    //     {
    //       format: 'cjs',
    //       file: 'lib/fun-vue.cjs.js',
    //     },
    //     {
    //       format: 'esm',
    //       file: 'lib/fun-vue.esm.js'
    //     }
    //   ]
    // }
    lib: {
      entry: './packages/vue/src/index.ts',
      // input: './packages/index.ts',
      formats: ['cjs', 'esm'],
      fileName: 'fun-vue',
      // output: [
      //   {
      //     format: "cjs",
      //     file: "lib/fun-vue.cjs.js",
      //   },
      //   {
      //     format: "esm",
      //     file: "lib/fun-vue.esm.js",
      //   },
      // ],
    },
    minify: false,
  },
})
