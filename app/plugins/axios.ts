export default ({ app, $axios }) => {
    $axios.onRequest((config) => {
        if (process.server) {
            config.headers.common = {
                Accept: 'application/json',
                cookie: config.headers.common.cookie || '',
                'user-agent': 'NuxtServerlessClient/1.0',
                'x-forwarded-for': config.headers.common['x-forwarded-for'] || '',
            }
        }
        const credential = app.$cookies.get('__cred__')
        if (credential) {
            config.headers['X-Authorization'] = 'Bearer ' + credential
        }
    })
}
