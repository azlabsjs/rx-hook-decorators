import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';
import babel from '@rollup/plugin-babel';

// this override is needed because Module format cjs does not support top-level await
// eslint-disable-next-line @typescript-eslint/no-var-requires
import packageJson from './package.json' assert { type: 'json' };

const globals = {
    ...packageJson.devDependencies,
};

export default {
    input: 'src/index.ts',
    output: [
        {
            file: packageJson.main,
            format: 'cjs', // commonJS
            sourcemap: true
        },
        {
            file: packageJson.module,
            format: 'esm', // ES Modules
            sourcemap: true
        },
    ],
    plugins: [
        typescript({
            useTsconfigDeclarationDir: true,
            tsconfig: "tsconfig.json",
            tsconfigOverride: {
                exclude: ['**/*.stories.*'],
            },
        }),
        peerDepsExternal(),
        json(),
        resolve(),
        commonjs(),
        commonjs({
            exclude: 'node_modules',
            ignoreGlobal: true,
        }),
        babel({babelHelpers: 'bundled'}),
        terser(),

    ],
    external: Object.keys(globals),
};
