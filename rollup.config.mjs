import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';
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
        copy({
            targets: [
                // TypeScript requires 2 distinct files for ESM and CJS types. See:
                // https://devblogs.microsoft.com/typescript/announcing-typescript-4-7/
                // https://github.com/gxmari007/vite-plugin-eslint/pull/60
                // Copy for ESM types is made in CJS bundle to ensure the declaration file generated in
                // the previous bundle exists.
                {
                    src: "dist/types/index.d.ts",
                    dest: "dist/types/",
                    rename: "index.d.mts",
                },
            ],
            verbose: true,
            copyOnce: true,
            copySync: true,
            hook: 'writeBundle'
        })
    ],
    external: Object.keys(globals),
};
