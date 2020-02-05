let version = require('../package.json').version;

let path = require('path');
let tool = require('../helper/tool');
tool.write('./src/version.js', 'export default \'' + version + '\';');

module.exports = {
    entry: path.resolve('./', 'src/index.js'),
    output: {
        path: path.resolve('./', 'dist'),
        filename: 'easy-editor.' + version + '.min.js',
        library: 'EasyEditor',
        libraryTarget: 'umd',
        libraryExport: 'default',
    },
    module: {
        rules: [{
            test: /(.js)$/,
            use: [{
                loader: 'babel-loader',
            }]
        },
        {
            test: /(.js)$/,
            use: [{
                loader: path.resolve('./', 'helper/zipCssInJs.js')
            }]
        }]
    }
};