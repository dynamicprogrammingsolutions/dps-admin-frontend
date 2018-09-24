const path = require('path')
const merge = require('webpack-merge')
const glob = require('glob');

const PATHS = {
    root: path.join(__dirname),
    src: path.join(__dirname, 'src'),
    build: path.join(__dirname, 'build'),
    out: path.join(__dirname, 'dist'),
}

/*var components = glob.sync('src/controllers/**.js');
var entryObject = components.reduce((acc, item) => {
    const name = item.replace('.js', '').replace('src/','');
    acc[name] = "./" + item;
    return acc;
}, {});
*/

var entryObject = {};
entryObject.main = "./src/main.js";
//entryObject.controllers = "./src/controllers.js";

var config = {
    entry: entryObject,
    plugins: [

    ],
    optimization: {
        runtimeChunk: "single",
        splitChunks: {
            chunks: "all",
            name(module) {
                return module.id;
            },
            cacheGroups: {
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
                controller: {
                    test: /[\\/]controllers[\\/]/,
                    priority: 0,
                    reuseExistingChunk: true,
                    minSize: 20000,
                    name(module) {
                        var res = /[\\/]controllers[\\/]([A-Za-z0-9\-_]+)/.exec(module.resource);
                        if (res && res[1]) {
                            return "controllers/" + res[1];
                        }
                        return module.id;
                    },

                },
                node_modules: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: 0,
                    name(module) {
                        var res = /[\\/]node_modules[\\/]([A-Za-z0-9\-_]+)[\\/]/.exec(module.resource);
                        if (res && res[1]) {
                            return "node_modules/" + res[1];
                        }
                        return module.id;
                    },
                    reuseExistingChunk: true,
                }
            },
            maxAsyncRequests: 100,
            maxInitialRequests: 100,
        }
    },
    module: {

    },
};

var production = {
    output: {
        filename: 'scripts/[name].js',
        path: PATHS.root,
        chunkFilename: "scripts/[name].js",
        sourceMapFilename: "scripts/[file].map",
    },
}

var development = {
    output: {
        filename: 'scripts-dev/[name].js',
        path: PATHS.root,
        chunkFilename: "scripts-dev/[name].js",
        sourceMapFilename: "scripts-dev/[file].map",
    },
}

module.exports = (env) => {
    config.mode = env;
    var envConfig = {};
    if (env === "production") {
        envConfig = production;
    } else if (env === "development") {
        envConfig = development;
    }
    return merge(config,envConfig,{
        mode: env,
    });
}