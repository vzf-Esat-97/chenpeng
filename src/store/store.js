import Vue from 'vue' //引入vue
import Vuex from 'vuex' //引入vuex
    
Vue.use(Vuex) //注册vuex

const store = new Vuex.Store({
    state:{
        author:"",
        url:''
    },
    mutations:{
            newAuther(state,msg){
                state.auther = msg
        },
        GetUrls(state,msg){
                state.url=msg
                console.log(state.url=msg)
        }
    }
})







export default store