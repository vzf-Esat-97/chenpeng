// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'//引入vue
import Vuex from 'vuex'
import VueResource from 'vue-resource'
//import Layer from 'vue-layer'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/base.css'
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store/store'
import App from './App'
import router from './router'
import VueAwesomeSwiper from 'vue-awesome-swiper'//引入swiper
import 'bootstrap'  //引入bootstrap
import 'bootstrap/dist/css/bootstrap.css'
import 'font-awesome/css/font-awesome.css' //引入awesome样式
import 'admin-lte'
import 'admin-lte/dist/css/AdminLTE.min.css'
import 'admin-lte/dist/css/skins/_all-skins.min.css'

import domain from '@/domain.js'  //引入公共链接  
import { runInNewContext } from 'vm';
global.domain = domain



Vue.config.productionTip = false
//Vue.prototype.$Layer = Layer(Vue);
Vue.use(Vuex)
Vue.use(VueAwesomeSwiper)
Vue.use(VueResource)
Vue.use(ElementUI)
Vue.use(CollapseTransition)
Vue.prototype.$axios = axios
axios.defaults.baseURL = 'http://api.tyyydbg.com'

//请求拦截
// axios.defaults.timeout = 5000
// var loadinginstace
axios.interceptors.request.use(config => {
    // element ui Loading方法
    // loadinginstace = Loading.service({ fullscreen: true })
    return config
}, error => {
    // loadinginstace.close()
    Message.error({
        message: '加载超时'
    })
    return Promise.reject(error)
}) 

// axios.interceptors.response.use(data => {
//     if(data.status === 401){
//         router.replace({
//             path: '/',
//         });
//         console.log(12312315313232)
//     }
//     return data
// }, error => {
//     Message.error({
//         message: '加载失败'
//     })
//     return Promise.reject(error)
// })

//http response 拦截器
axios.interceptors.response.use(
    res => {
        switch (res.status) {
            case 500:
                Message.error({
                    message: '加载失败'
                })
                break;
            case 401:
                router.replace({
                    path: '/',
                });
                break;
            case 200:
                console.log(123132213)
                break;
            default: break;
        }
        return res
    },
    error => {
        return Promise.reject(error)
    }
)


Vue.filter('date', (date, fmt) => {
    if (typeof date === 'string') date = new Date(date)
    if (!fmt) fmt = 'yyyy-MM-dd hh:mm:ss'
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    }
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + ''
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : ('00' + str).substr(str.length))
        }
    }
    return fmt
})

new Vue({
    el: '#app',
    router,
    VueResource,
    ElementUI,
    store,
    CollapseTransition,
    template: '<App/>',
    components: { App }
})
