const mongoose = require('mongoose')
const xlsx = require('xlsx')
const {
  request,
  summary,
  body,
  tags,
  middlewares,
  path,
  description,
  query,
  deprecated,
  tagsAll,
  middlewaresAll,
  queryAll,
  deprecatedAll
} = require('koa-swagger-decorator')
const { uplader } = require('../../lib/util')
const auth = require('../../middleware/auth')

@tagsAll(['Account'])
class AccountRouter {
  @request('POST', '/account/login')
  @summary('login')
  @description('login')
  @body({
    code: {
      type: 'string',
      required: true,
      description: 'code',
      example: '001BTkYc1ohFgz01n5Zc181qYc1BTkY1'
    }
  })
  @path({})
  static async login(ctx) {
    console.log(1111)
    const { app } = ctx
    const { code, userInfo } = ctx.validatedBody
    const openid = await app.lib.util.getOpenId(code)
    let sessionKey = ''
    if (openid) {
      sessionKey = await app.service.user.login({
        ctx,
        openId: openid,
        userInfo
      })
      console.log(sessionKey)
    } else {
      ctx.throw(400, '登陆失败')
    }
    ctx.body = sessionKey
    ctx.status = 200
  }
  @request('GET', '/account/user')
  @middlewares([auth])
  static async getUserInfo(ctx) {
    ctx.body = ctx.state.user
    ctx.status = 200
  }
}
export default AccountRouter
