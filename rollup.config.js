import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
import bundleSize from 'rollup-plugin-bundle-size';
import replace from '@rollup/plugin-replace';
import svgr from '@svgr/rollup';
import typescript from 'rollup-plugin-typescript2';
import alias from '@rollup/plugin-alias';

import pkg from './package.json';

const isProd = process.env.NODE_ENV === 'production';
const processEnv = isProd ? 'production' : 'development';

export default [
  {
    input: 'src/index.ts',
    external: ['react', 'react-dom', /@babel\/runtime/],
    onwarn(warning, rollupWarn) {
      if (warning.code !== 'CIRCULAR_DEPENDENCY') {
        rollupWarn(warning);
      }
    },
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
      },
      {
        file: pkg.module,
        format: 'esm',
        sourcemap: true,
        exports: 'named',
      },
    ],
    plugins: [
      alias({
        resolve: ['.tsx', '.ts', '.scss', '.js', '.css'],
        entries: {
          '@': 'src',
        }
      }),
      replace({
        __ENV__: JSON.stringify(processEnv),
        __REACT_FLOW_VERSION__: JSON.stringify(pkg.version),
      }),
      bundleSize(),
      postcss({
        minimize: isProd,
      }),
      babel({
        exclude: 'node_modules/**',
        babelHelpers: 'runtime',
      }),

      svgr(),
      typescript({
        clean: true,
      }),
      resolve(),
      commonjs({
        include: 'node_modules/**',
      }),
    ],
  },
];
