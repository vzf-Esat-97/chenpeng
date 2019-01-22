import Vue from 'vue'
import Router from 'vue-router'
    
import login from '@/components/login'
import company from '@/components/company' //企业管理员
import comchild from '@/components/comchild' //企业子组件
import comchild1 from '@/components/comchild1' //企业子组件
import comchild2 from '@/components/comchild2' //企业子组件
import comchild3 from '@/components/comchild3' //企业子组件
import management from '@/components/management' //考勤管理
import Approval from '@/components/Approval' //考勤管理
    
        
Vue.use(Router)

export default new Router({
	routes: [
        {
            path: '/', 
            name:'login',
            component:login
        },
        {
            path: '/login', 
            name:'login',
            component:login
        },
        {
            path: '/company', 
            name:'company',
            component:company,
            children:[
                {
                    path: '/', 
                    name:'comchild',
                    component:comchild
                },
                {
                    path: '/comchild', 
                    name:'comchild',
                    component:comchild
                },
                {
                    path: '/comchild1', 
                    name:'comchild1',
                    component:comchild1
                },
                {
                    path: '/comchild2', 
                    name:'comchild2',
                    component:comchild2
                },
                {
                    path: '/comchild3', 
                    name:'comchild3',
                    component:comchild3
                },
                {
                    path: '/management', 
                    name:'management',
                    component:management 
                },
                {
                    path: '/Approval', 
                    name:'Approval',
                    component:Approval
                },
            ]
        },
    ]
})