export default async ctx => {
  const { redirect, route, store, $axios } = ctx
  const redirectUri = encodeURIComponent(
    `http://${process.env.HTTP_URL}:${
      process.env.HTTP_PORT
    }${route.fullPath.replace(/token=[^&]*(&)?/g, '')}`
  )
  if (!store.state.token) {
    return redirect(
      `http://ksat.luxshare-ict.com/passport/login?appid=Lux.MES&redirect_uri=${redirectUri}`
    )
  }
}
