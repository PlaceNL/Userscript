const {Compilation, DefinePlugin} = require('webpack');
const {ConcatSource} = require('webpack-sources');
const fs = require('node:fs');

const commit = require('node:child_process')
    .execSync('git rev-parse HEAD')
    .toString().trim();

const HEADER = fs.readFileSync(`${__dirname}/src/USERSCRIPT_HEADER.txt`, 'utf-8').replace(/___GIT_HASH___/g, commit);
const UserScriptHeaderAppender = function () {
    this.apply = function (compiler) {
        compiler.hooks.compilation.tap('userscript-header', (compilation) => {
            compilation.hooks.afterProcessAssets.tap({
                name: 'userscript-header',
                stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
            }, () => {
                for (const chunk of compilation.chunks) {
                    for (const file of chunk.files) {
                        compilation.updateAsset(file, (old) => {
                            return new ConcatSource(HEADER, '\n', old)
                        });
                    }
                }
            });
        });
    };
}

module.exports = {
    plugins: [
        new DefinePlugin({
            ___GIT_HASH___: JSON.stringify(commit)
        }),
        new UserScriptHeaderAppender()
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['css-loader']
            }
        ]
    },
    output: {
        filename: 'placenl-userscript.user.js'
    }
};


