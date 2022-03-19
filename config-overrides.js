const {
  override,
  addWebpackAlias,
  addPostcssPlugins,
  addWebpackExternals
} = require('customize-cra')
const path = require('path')
const px2viewport = require('postcss-px-to-viewport')
const resolve = (dir) => path.join(__dirname, '.', dir)

const obj =
  process.env.NODE_ENV === 'production'
    ? {
        react: 'React'
      }
    : {}
const externals = addWebpackExternals(obj)
module.exports = override(
  externals,
  addWebpackAlias({
    ['@']: resolve('src')
  }),
  addPostcssPlugins([
    // 移动端布局 viewport 适配方案
    px2viewport({
      // 视口宽度：可以设置为设计稿的宽度
      viewportWidth: 375
      // 白名单：不需对其中的 px 单位转成 vw 的样式类类名
      // selectorBlackList: ['.ignore', '.hairlines']
    })
  ])
)
