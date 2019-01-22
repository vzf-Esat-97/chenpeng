<template>
    <div>
            <div id="loginheight" class="login">
            <div class="langtongyun"></div>
            <div class="logn-box">
                <!--登陆-->
                    <div :class="{logins:isLoginss}" class="Logins">
                    <div class="login-status">
                        <div v-for="(item,index) in msg" class="msg-login">{{item.name}}</div>
                    </div>
                    
                    <!--企业管理员登录-->
                    <div class="phoshow">
                        <div class="Pho-num">
                            <input v-model="pwdPhonum" type="text" placeholder='请输入账号'>
                        </div>
                        <div class="Pho-num">
                            <div class="auth-code-input pwdinput">
                                <input v-model="password" type='password' placeholder="请输入密码">
                            </div>
                        </div>
                        <div @click="gohomgpage()" class="lgo-btn">登陆</div>
                    </div>
                </div>   
            </div>
        </div>        
        <router-view></router-view>
    </div>
</template>

<script>   
export default {
  name: 'login',
  data () {
    return {
        msg:[
            {"name":"企业管理员登录"}
        ],
        Phonum:"",
        checked:true,
        isActive:0,
        isLoginss:true,
        regPhonum:"",
        msgCode:"",
        pwdPhonum:"",
        password:"",
        States:'',
        domainurl:domain.domainUrl, //公共域名
    }
  },
    
    watch:{
        '$route':"changeReg"
    },
    
    //获取浏览器窗口高度
    mounted:function(){
        const heiht = document.documentElement.clientHeight
        console.log(heiht)
        document.getElementById('loginheight').style.height = heiht+`px`
        console.log(document.getElementById('loginheight'))
    },
    
    //进入登录页面判断
    created(){
        this.changeReg()   
    },
    methods:{
        
        //变化登录注册
        changeReg(){
            const states = this.$route.query.State
            this.States = states
        },
        
        //电信管理员登录
        logon(){
            if(this.Phonum!=''&&this.msgCode!=''){
                const dxgldata = JSON.stringify({"loginName":this.Phonum,"password":this.msgCode})
                this.$http.post(this.domainurl+`/api/base/mlogin`,dxgldata,{emulateJSON:true})
                .then((response)=>{
                    console.log(response)
                    var data = JSON.parse(response.bodyText); 
                    if(data.suc==true){
                        localStorage.setItem("token",response.data.token)
                        localStorage.setItem("name",response.data.organization.name)
                        localStorage.setItem("oldpwd",this.msgCode)
                        if(response.data.organization.id=='-ct-gx'){
                            this.$router.push({
                                path:'/starter',
                                name:'starter'
                            })
                        }else{
                            this.$message({
                              message: '请输入正确的账号',
                              type: 'warning'
                            });
                        }
                    }if(data.suc==false){
                        this.$message({
                          message:data.reason,
                          type: 'warning'
                        });
                    }
                })
            }else{
                this.$message({
                  message: '请输入账号密码',
                  type: 'warning'
                });
            }
        },
        
        //企业管理员登录
        gohomgpage(){
            if(this.pwdPhonum!=''&&this.password!=''){
                const dxgldata = JSON.stringify({"loginName":this.pwdPhonum,"password":this.password})
                this.$http.post(this.domainurl+`/api/base/mlogin`,dxgldata,{emulateJSON:true})
                .then((response)=>{
                    console.log(response)
                    var data = JSON.parse(response.bodyText); 
                    if(data.suc==true){
                        localStorage.setItem("name",response.data.organization.name)
                        localStorage.setItem("token",response.data.token)
                        localStorage.setItem("orgId",response.data.organization.id)
                        localStorage.setItem("oldpwd",this.password)
                        if(response.data.organization.id != '-ct-gx'){
                            this.$router.push({
                                path:'/company',
                                name:'company'
                            })
                        }else{
                            this.$message({
                              message: '请输入正确的账号',
                              type: 'warning'
                            });
                        }
                    }else{
                        this.$message({
                          message:data.reason,
                          type: 'warning'
                        });
                    }
                })
            }else{
                this.$message({
                  message: '请输入账号密码',
                  type: 'warning'
                });
            }
        }
    }
}
</script>
<!--登录/注册-->
<style scoped>
    *{
    margin: 0;
    padding: 0;
}


input::-webkit-input-placeholder, textarea::-webkit-input-placeholder { 
 /* WebKit browsers */ 
color: #d6d6d6; 
} 
input:-moz-placeholder, textarea:-moz-placeholder { 
/* Mozilla Firefox 4 to 18 */ 
color: #d6d6d6; 
} 
input::-moz-placeholder, textarea::-moz-placeholder { 
 /* Mozilla Firefox 19+ */ 
color: #d6d6d6; 
} 
input:-ms-input-placeholder, textarea:-ms-input-placeholder { 
 /* Internet Explorer 10+ */ 
color: #d6d6d6; 
}    

@media screen and ( max-width: 1920px ){
    .login{
        width: 100%;
        background: url(../assets/images/gxdxkhdbg.jpg) no-repeat center;
    }
    .content{
        width: 1200px;
        height: 100%;
        border: 0;
        margin: auto;
    }
    .loginBox{
        width: 100%;
        height: 10%;
    }
    .langtongyun{
        width: 146px;
        height: 70px;
    /*    margin:5% auto;*/
        margin-bottom: 40px;
    }
    .logn-box{
        width: 440px;
        height: 300px;
        background-color: #ffffff;
        border-radius: 4px;
        margin: auto;
    }
    .Logins{
        width: 360px;
        height: 247px;
        margin: auto;
        padding-top: 40px;
        display: none;
    }
    .login-status{
        width: 360px;
        height: 31px;
        margin-bottom: 20px;
    }
    .msg-login{
        width: 360px;
        height: 31px;
        float: left;
        font-size: 16px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 31px;
        letter-spacing: 0px;
        text-align: center;
        color: #888888;
    }
    .active1{
        transition: all 0.1s;
        color: #333333;
    }

    /*短信登录*/
    .msgLgo{
        width: 360px;
        height: 214px;
    }
    .phoshow{
        width: 360px;
        height: 214px;
    }
    .Pho-num{
        width: 360px;
        height: 44px;
        background-color: #ffffff;
        border: solid 1px #d6d6d6;
        border-radius: 6px;
        margin-bottom: 12px;
    }
    .Pho-num input{
        width: 358px;
        height: 42px;
        padding-left: 10px;
        border: none;
        border-radius: 6px;
    }
    .auth-code-input input{
        width: 358px;
        height: 42px;
        padding-left: 10px;
        border: none;
        border-radius: 6px;
    }

    .lgo-btn{
        width: 360px;
        height: 44px;
        background-color: #34a1fb;
        text-align: center;
        line-height: 44px;
        margin-top: 24px;
        cursor: pointer;
        font-size: 16px;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #ffffff;
        border-radius: 6px;
    }
    /*密码登录改变信息*/
    .pwdinput{
        width:360px;
        height: 44px;
    }
    .reg-msg{
        width: 64px;
        height: 31px;
        cursor: pointer;
        float: left;
        font-size: 16px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 31px;
        letter-spacing: 0px;
        color: #333333;
        margin-right: 40px;
        border-bottom: 2px solid #333333;
    }

    /*注册登录跳转*/
    .logins{
        display: block;
    }
}    
</style>