export default function(app) {
  const { $axios, redirect } = app
  $axios.onRequest(config => {
    console.log(
      `Making ${config.method} request to ${config.baseURL}${config.url}`
    )
    switch (config.method) {
      case 'get':
        console.log(config.params)
        break
      case 'post':
        console.log(config.data)
        break
      default:
        break
    }
  })
  $axios.onResponse(response => {
    console.log(`response data`)
    console.log(response.data)
  })
  $axios.onError(error => {
    const response = error.response
    const status = response.status
    switch (status) {
      case 401:
        alert(`权限异常`)
        break
      case 400:
        console.log(response.data.msg)
        alert(`参数异常`)
        break
      default:
        alert(`服务器异常`)
        break
    }
  })
}
