const pkg = require('./package')
module.exports = {
  srcDir: 'client/',
  mode: 'universal',

  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },

  /*
   ** Global CSS
   */
  css: [
    'normalize.css/normalize.css',
    '~/assets/css/tailwind.css',
    { src: '@/assets/styles/main.scss', lang: 'scss' }
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/i18n',
    '@/plugins/axios',
    { src: '@/plugins/lux-component', ssr: false },
    '@/plugins/moment',
    '@/plugins/lodash',
    '@/plugins/error-handler.client',
    { src: '@/plugins/element-ui', ssr: false }
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    ['@nuxtjs/dotenv', { filename: `.env.${process.env.NODE_ENV}`, path: './' }]
  ],
  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    proxy: true
  },
  proxy: {
    '/api': {
      target: `http://${process.env.HTTP_URL}:${process.env.HTTP_PORT}/api/v1`,
      pathRewrite: {
        '^/api': '/'
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    babel: {
      plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }]
      ]
    },
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  /*
   ** Server
   *  弃用
   *  现从.env中获取
   */
  server: {
    port: 3000, // default: 3000
    host: '0.0.0.0' // default: localhost
  },
  /*
   **  Router
   */
  router: {
    middleware: ['auth'],
    routeNameSplitter: '-',
    extendRoutes(routes, resolve) {}
  }
}
