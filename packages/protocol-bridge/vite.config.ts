import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';

const { name } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    dts({
      // 包含的源文件
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      // 排除的文件
      exclude: ['src/**/*.test.ts', 'src/**/*.stories.ts'],
      // 输出目录
      outDir: 'dist',
      // 在 package.json 中插入 types 入口
      insertTypesEntry: true,
      // 使用 rollup 打包类型
      rollupTypes: true,
      // 压缩类型声明
      // compilerOptions: {
      //   declarationMap: true
      // }
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name,
      fileName: format => `index.${format}.js`,
      formats: ['es', 'umd', 'cjs'],
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: [],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {},
      },
    },
  },
});
