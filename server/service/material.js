const axios = require('axios')
module.exports = {
  GetListMaterial: async ctx => {
    const token = ctx.session.token
    const Value = {
      pageSize: 15,
      pageIndex: 1
    }
    let result = await axios.post(
      'http://ksat.luxshare-ict.com:9812/gateway/v1?f=/v2/asset/ListMaterial',
      {
        Version: 1,
        SequenceID: 1,
        BasePath: 'ksat',
        ServantName: 'pms.assetsmanager',
        Method: 0,
        FuncName: '/v2/asset/ListMaterial',
        Oauth: token,
        Value: JSON.stringify(Value)
      }
    )
    console.log(result)
    return JSON.parse(result.data.Value)
  }
}
