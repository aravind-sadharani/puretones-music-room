const path = require('path');

exports.onCreateWebpackConfig = ({
    actions,
}) => {
    actions.setWebpackConfig({
        resolve: {
            modules: [path.resolve(__dirname, "src"), "node_modules"],
        },
        module: {
            rules: [
                { test: /\.dsp$/, use: 'raw-loader' },
                { test: /\.prt$/, use: 'raw-loader' },
                { test: /\.pkb$/, use: 'raw-loader' },
            ],
        }
    })
}