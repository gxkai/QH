const {
  request,
  summary,
  body,
  tags,
  middlewares,
  path,
  description
} = require('koa-swagger-decorator')
const { getFile } = require('../../lib/util')

const tag = tags(['Auth'])

class IconRouter {
  @request('GET', '/icon')
  @summary('获取图标')
  @description('获取图标')
  @tag
  static async getIcon(ctx) {
    const iconList = await getFile('assets/fonts/iconfont.css')
    console.log(iconList)
    ctx.body = iconList
    ctx.status = 200
  }
}
export default IconRouter
