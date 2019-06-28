const {
  request,
  summary,
  body,
  tags,
  middlewares,
  path,
  description
} = require('koa-swagger-decorator')

const tag = tags(['Auth'])

class AuthRouter {
  @request('POST', '/auth/logout')
  @summary('退出登录')
  @description('退出登录')
  @tag
  static async logout(ctx) {
    ctx.session.token = null
    ctx.status = 200
  }
  @request('GET', '/auth/menus')
  @summary('退出登录')
  @description('退出登录')
  @tag
  static async menus(ctx) {
    const data = [
      {
        id: '1',
        name: 'index',
        path: '/'
      },
      {
        id: '2',
        name: 'line',
        children: [
          // {
          //   id: '2-1',
          //   name: 'line-company',
          //   path: '/line/company'
          // },
          // {
          //   id: '2-2',
          //   name: 'line-factory',
          //   path: '/line/factory'
          // },
          // {
          //   id: '2-3',
          //   name: 'line-workshop',
          //   path: '/line/workshop'
          // },
          {
            id: '2-4',
            name: 'line-line',
            path: '/line/line'
          }
        ]
      },
      // {
      //   id: '4',
      //   name: 'tool',
      //   children: [
      //     {
      //       id: '4-1',
      //       name: 'tool-tool',
      //       path: '/tool/tool'
      //     }
      //   ]
      // },
      {
        id: '6',
        name: 'task',
        children: [
          {
            id: '6-1',
            name: 'task-workorder',
            path: '/task/workorder'
          }
        ]
      },
      // {
      //   id: '7',
      //   name: 'goods',
      //   children: [
      //     {
      //       id: '7-1',
      //       name: 'goods-goods',
      //       path: '/goods/goods'
      //     }
      //   ]
      // },
      // {
      //   id: '8',
      //   name: 'inventory',
      //   children: [
      //     {
      //       id: '8-1',
      //       name: 'inventory-inventory',
      //       path: '/inventory/inventory'
      //     },
      //     {
      //       id: '8-2',
      //       name: 'inventory-supplier',
      //       path: '/inventory/supplier'
      //     }
      //   ]
      // },
      {
        id: '9',
        name: 'bom',
        children: [
          {
            id: '9-1',
            name: 'bom-bom',
            path: '/bom/bom'
          }
        ]
      },
      {
        id: '10',
        name: 'productionInfo',
        children: [
          {
            id: '10-1',
            name: 'production-Log',
            path: '/record'
          }
        ]
      }
    ]
    ctx.body = data
    ctx.status = 200
  }
}
export default AuthRouter
