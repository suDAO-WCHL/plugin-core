import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dts from 'vite-plugin-dts'
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import { extname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { glob } from 'glob'

const rollupInputs = Object.fromEntries(glob.sync(['lib/**/*.{ts,tsx}'], {
  ignore: ['lib/**/*.d.ts'],
}).map(file => [
  relative('lib', file.slice(0, file.length - extname(file).length)),
  fileURLToPath(new URL(file, import.meta.url)),
]));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), libInjectCss(), dts({
    tsconfigPath: 'tsconfig.lib.json',
  })],
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, 'lib/index.ts'),
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      input: rollupInputs,
      output: {
        assetFileNames: 'assets/[name][extname]',
        entryFileNames: '[name].js',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'react/jsx-runtime',
        }
      }
    }
  },
})
