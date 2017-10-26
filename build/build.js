const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const uglify = require('rollup-plugin-uglify');
const npm = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const fs = require('fs');

const version = process.env.VERSION || require('../package.json').version;
const name = require('../package.json').name;
const banner =
    '/*!\n' +
    ' * ' + name + '.js v' + version + '\n' +
    ' * (c) ' + new Date().getFullYear() + ' Myron Liu\n' +
    ' * Released under the MIT License.\n' +
    ' */';

rollup.rollup({
    input: 'src/main.js',
    plugins: [
        npm({ jsnext: true, main: true }),
        babel({
            babelrc: false,
            exclude: 'node_modules/**',
            presets: ['es2015-rollup', 'stage-2']
        }),
        commonjs()
    ]
}).then(function (bundle) {
    bundle.write({
        format: 'cjs',
        banner: banner,
        dest: 'dist/' + name + '-common.js'
    });
}).catch(function (err) {
    console.log(err);
});
