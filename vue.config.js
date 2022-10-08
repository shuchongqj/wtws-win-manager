const createThemeColorReplacerPlugin = require("./config/plugin.config")
const buildConfig = require("./config/vue.build.config")
const path = require("path")

function resolve(dir) {
  return path.join(__dirname, dir)
}

const VueConfig = {
  publicPath: "./",
  assetsDir: "static",
  productionSourceMap: false,
  chainWebpack: config => {
    config.plugin("html").tap(args => {
      args[0].title = "川金诺 | 称重后台管理系统"
      return args
    })
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            // "primary-color": "#52c41a"
            // "link-color": "#52c41a",
            "border-radius-base": "2px"
          },
          javascriptEnabled: true
        }
      },
      sass: {
        prependData: `@import "~@/assets/css/global.scss";`
      }
    }
  },
  configureWebpack: {
    plugins: [createThemeColorReplacerPlugin()],
    resolve: {
      alias: {
        "@crud": resolve("src/components/Crud")
      }
    },
    externals: {
      AMap: "AMap",
      AMapUI: "AMapUI"
    }
  },
  ...buildConfig
}

module.exports = VueConfig
