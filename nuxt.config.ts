import { NuxtConfig } from '@nuxt/types'
import { NuxtOptionsModule } from '@nuxt/types/config/module'
import { NuxtOptionsPlugin } from '@nuxt/types/config/plugin'
import dotenv from 'dotenv'
// const colors = require('vuetify/es5/util/colors').default
// import colors from 'vuetify/es5/util/colors'
// 設定読み込み
const stage = process.env.STAGE || 'local'
process.env.STAGE = stage
dotenv.config({ path: `./config/.env.me` })
dotenv.config({ path: `./config/.${stage}.env` })
dotenv.config({ path: `./config/.env` })
console.log('process.env.API_URL', process.env.API_URL)

// サイト情報
const siteTitle = 'ようこそ'
const siteDescription = 'createdByYuichi'

// モジュール
const modules: NuxtOptionsModule[] = [
    '@nuxtjs/axios',
    '@nuxtjs/google-analytics',
    '@nuxtjs/style-resources',
    ['cookie-universal-nuxt', { alias: 'cookies' }],
    'nuxt-basic-auth-module',
    ['@nuxtjs/dotenv', { filename: `../config/.env.me` }],
    ['@nuxtjs/dotenv', { filename: `../config/.${stage}.env` }],
    ['@nuxtjs/dotenv', { filename: `../config/.env` }],
]
// build modules
const buildModules: NuxtOptionsModule[] = ['@nuxtjs/vuetify', '@nuxt/typescript-build', '@nuxtjs/eslint-module']

// プラグイン
const plugins: NuxtOptionsPlugin[] = ['~/plugins/axios', '~/plugins/filter', '~/plugins/dompurify', '~/plugins/datetime', '~/plugins/mixins']

// basic auth
const basic = {
    name: process.env.BASIC_NAME,
    pass: process.env.BASIC_PASS,
    enabled: process.env.STAGE === 'dev',
}

const config: NuxtConfig = {
    mode: 'universal',
    srcDir: 'app',
    // Application environments
    env: {
        STAGE: process.env.STAGE || 'local',
    },
    // Headers of the page
    head: {
        title: siteTitle,
        titleTemplate: `%s | ${siteTitle}`,
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: siteDescription },
        ],
        link: [
            // { rel: 'icon', type: 'image/png', href: '/img/favicon.png' },
            { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' },
            { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Lato:400,700|Noto+Sans+JP:400,700' },
        ],
    },
    loading: { color: '#3B8070' },
    // Modules
    modules,
    // Plugins
    plugins,
    // Router
    router: {
        base: process.env.ROUTER_BASE,
        middleware: ['auth'],
    },
    // Render
    render: {
        compressor: (_req, _res, next) => {
            next()
        },
    },
    // Axios module configuration
    axios: {
        baseURL: process.env.API_URL,
        // CORSでのリクエストのため
        // proxy: true,
    },
    // proxy: {
    //     '/api/': {
    //         target: process.env.API_URL,
    //     },
    // },
    // Google analytics configuration
    'google-analytics': {
        id: process.env.GOOGLE_ANALYTICS,
    },
    // basic auth
    basic,
    // Global CSS
    // css: ['~assets/style/app.styl'],
    // StyleResource configuration
    styleResources: {
        stylus: ['./assets/style/variables.styl', './assets/style/mixins.styl'],
    },
    // vuetify: {
    //   customVariables: ['~/assets/variables.scss'],
    //   theme: {
    //     dark: true,
    //     themes: {
    //       dark: {
    //         primary: colors.blue.darken2,
    //         accent: colors.grey.darken3,
    //         secondary: colors.amber.darken3,
    //         info: colors.teal.lighten1,
    //         warning: colors.amber.base,
    //         error: colors.deepOrange.accent4,
    //         success: colors.green.accent3
    //       }
    //     }
    //   }
    // },
    // Build settings
    build: {
        extend(config, { isDev }) {
            if (isDev && process.isClient) {
                if (!config.module) {
                    return
                }
                config.module.rules.push({
                    enforce: 'pre',
                    test: /\.(js|vue)$/,
                    loader: 'eslint-loader',
                    exclude: /(node_modules)/,
                })
            }
        },
        // hardSource: true,
    },
    buildModules,
}

export default config
