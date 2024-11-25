'use strict'
const path = require('path')
const IOCCopyRightPlugin = require('ioc-webpack-tools')

function resolve(dir) {
    return path.join(__dirname, dir)
}

const port = process.env.port || process.env.npm_config_port || 9528 // dev port

module.exports = {
    publicPath: './',
    outputDir: 'dist',
    assetsDir: 'static',
    lintOnSave: process.env.NODE_ENV === 'development',
    productionSourceMap: false,
    devServer: {
        disableHostCheck: true,
        allowedHosts: [
            'host.com', // 允许访问的域名地址，即花生壳内网穿透的地址
            '.host.com'   // .是二级域名的通配符
        ],
        port: port,
        open: true,
        overlay: {
            warnings: false,
            errors: true
        },
        proxy: {
            '/api': {
                target: 'http://47.100.84.225:9031/',
                pathRewrite: {
                    '^/api': ''
                }
            },
            '/user': {
                target: 'http://47.100.84.225:9031/',
                pathRewrite: {
                    '^/user': '/user'
                }
            },
        }
    },
    configureWebpack: {
        resolve: {
            alias: {
                '@': resolve('src')
            }
        },
        plugins: [new IOCCopyRightPlugin('社会治理一张图')]
    },
    chainWebpack(config) {
        config.plugin('preload').tap(() => [
            {
                rel: 'preload',
                fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
                include: 'initial'
            }
        ])

        config.plugins.delete('prefetch')

        config.module.rule('svg').exclude.add(resolve('src/icons')).end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end()

        config.when(process.env.NODE_ENV !== 'development', config => {
            config
                .plugin('ScriptExtHtmlWebpackPlugin')
                .after('html')
                .use('script-ext-html-webpack-plugin', [
                    {
                        inline: /runtime\..*\.js$/
                    }
                ])
                .end()
            config.optimization.splitChunks({
                chunks: 'all',
                cacheGroups: {
                    libs: {
                        name: 'chunk-libs',
                        test: /[\\/]node_modules[\\/]/,
                        priority: 10,
                        chunks: 'initial' // only package third parties that are initially dependent
                    },
                    CESTCIOCUI: {
                        name: 'chunk-cestcIocUI', // split cestcIocUI into a single package
                        priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                        test: /[\\/]node_modules[\\/]_?cestc-ioc-ui(.*)/ // in order to adapt to cnpm
                    },
                    commons: {
                        name: 'chunk-commons',
                        test: resolve('src/components'), // can customize your rules
                        minChunks: 3, //  minimum common number
                        priority: 5,
                        reuseExistingChunk: true
                    }
                }
            })
            // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
            config.optimization.runtimeChunk('single')
        })
    }
}
