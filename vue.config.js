const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const webpack = require('webpack')

function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: true,
  productionSourceMap: false,
  devServer: {
    hot: true,
    port: 9999,
    open: true
  },
  chainWebpack(config) {
    if (process.env.NODE_ENV === 'production') {
      config.plugin('compressionPlugin').use(
        new CompressionPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: /\.js$|\.html$|.\css/,
          threshold: 10240,
          deleteOriginalAssets: false,
        })
      )
    }
    config.module.rule('svg').exclude.add(resolve('src/icons')).end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      })
      .end()
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap((options) => {
        // 修改 url-loader 配置
        options.limit = 8192 // 小于 8kb 的图片转为 base64 编码
        return options
      })
    config.plugin('html').tap((args) => {
      args[0].title = process.env.VUE_APP_TITLE_ZH
      return args
    })
    config.module
      .rule('mjs')
      .test({
        test: /\.mjs$/,
      })
      .use('babel-loader')
      .loader('babel-loader')
      .options({
        presets: ['@babel/preset-env'],
        plugins: [
          '@babel/plugin-proposal-optional-chaining',
          '@babel/plugin-proposal-nullish-coalescing-operator',
        ],
      })
      .end()
    // 配置代码分割
    config.optimization.splitChunks({
      chunks: 'all',
    })
    // 移除 console 日志
    config.optimization.minimizer('terser').tap((args) => {
      args[0].terserOptions.compress.drop_console = true
      return args
    })
    // 使用 thread-loader
    config.module
      .rule('js')
      .use('thread-loader')
      .loader('thread-loader')
      .options({
        // 设置 worker 的数量，可以根据 CPU 核心数进行调整
        workers: require('os').cpus().length - 1,
      })
      .end()
    config.module.rules.delete('eslint')
    config.cache(true)
  },
  configureWebpack: {
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true,
            },
          },
        }),
      ],
    },
    resolve: {
      alias: {
        vue$: 'vue/dist/vue.esm.js',
      },
    },
    plugins: [
      new webpack.ProvidePlugin({
        Cookies: 'js-cookie',
        dayjs: 'dayjs',
      }),
    ],
  },
}
