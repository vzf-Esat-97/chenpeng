<template>
<div class="wrapper">

		<header class="main-header">
			<a href="#" class="logo">
				<span class="logo-mini">后台</span>
				<span class="logo-lg">企业管理员</span>
			</a>
			<nav class="navbar navbar-static-top" role="navigation">
				<a href="javascript:" class="sidebar-toggle" data-toggle="offcanvas" role="button">
					<span class="sr-only">切换</span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				</a>

				<div class="navbar-custom-menu">
					<ul class="nav navbar-nav">
						<!-- 通知 -->
						<li class="dropdown notifications-menu">
							<a href="javascript:" class="dropdown-toggle" data-toggle="dropdown">
                                <span @click='amendanswer' class="hidden-xs">修改密码</span>
<!--
								<i class="fa fa-bell-o"></i>
								<span class="label label-warning">1</span>
-->
							</a>
						</li>
						<li class="dropdown user user-menu">
							<a href="javascript:" class="dropdown-toggle" data-toggle="dropdown">
								<img src="http://www.fengqiaoju.com/Public/home/images/noavatar.png" class="user-image" alt="User Image">
								<span class="hidden-xs">{{comname}}</span>
							</a>
							<ul class="dropdown-menu">
								<li class="user-header">
									<img src="http://www.fengqiaoju.com/Public/home/images/noavatar.png" class="img-circle" alt="User Image">
									<p>
										{{comname}}
									</p>
								</li>
								<li class="user-footer">
									<div class="pull-left">
									</div>
									<div class="pull-right">
										<a @click='loginout' href="javascript:" id="logoutBtn" class="btn btn-default btn-flat">退出</a>
									</div>
								</li>
							</ul>
						</li>
					</ul>
				</div>
			</nav>
		</header>
    
		<aside class="main-sidebar">
            <section class="sidebar">
                <ul class="sidebar-menu">
                    <li @click="chioce(item,idx)" v-for='(item,idx) in Selectdata' :class='{active:isactive==idx}' class="treeview">
                        <router-link :to="item.address">
                            <i class="fa fa-user"></i> <span>{{item.name}}</span></i>
                        </router-link>
                    </li>
                </ul>
            </section>
		</aside>

        <!--修改密码弹框-->
        <el-dialog title="编辑" :visible.sync="pwdDialogVisible" width="40%" center>
          <el-form :model="ruleForm2" status-icon :rules="rules" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
          <el-form-item label="原密码" prop="oldPassword">
            <el-input placeholder="请输入原密码" type="password" v-model="ruleForm2.oldPassword" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input placeholder="请输入新密码" type="password" v-model="ruleForm2.newPassword" auto-complete="off"></el-input>
          </el-form-item>
        </el-form> 
          <span slot="footer" class="dialog-footer">
            <el-button @click="callOff('ruleForm2')">取 消</el-button>
            <el-button type="primary" @click="surexgbtn('ruleForm2')">确 定</el-button>
          </span>
        </el-dialog>

		<div class="content-wrapper addclass">
<!--            <router-view></router-view>-->
			<comchild :is=SelectComponents></comchild>
		</div>

	</div>
</template>
<script>
    
import comchild from './comchild.vue'
import comchild1 from './comchild1.vue'
import comchild2 from './comchild2.vue'
import comchild3 from './comchild3.vue'
import management from './management.vue'
import Approval from './Approval.vue'
    
export default {
    name: 'company',
        components:{
            comchild,
            comchild1,
            comchild2,
            comchild3,
            management,
            Approval
        },
        
        data () {
        return {
            SelectComponents:'comchild',
            Selectdata:[
                {name:'企业配置',address:'comchild'},
                {name:'角色管理',address:'comchild1'},
                {name:'成员管理',address:'comchild2'},
                {name:'部门管理',address:'comchild3'},
                {name:'考勤管理',address:'management'},
                {name:'审批管理',address:'Approval'},
            ],
            isactive:0,
            testMsg:'',
            orgId:'',
            comname:'',
            pwdDialogVisible:false,
            ruleForm2:{
                newPassword:'',
                oldPassword:''
            },
            rules:{
                oldPassword: [
                    { required: true, message: '请输入原密码', trigger: 'blur' },
                    { min: 1, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur'}
                ],
                newPassword: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                    { min: 1, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur'}
                ],
            }
        }
    },
    watch:{
        "$route": "routerfunc"
    },
    mounted:function(){
        this.ruleForm2.oldPassword = localStorage.getItem('oldpwd')
        this.comname = localStorage.getItem('name')
        this.orgId = localStorage.getItem('orgId');
        this.testMsg = localStorage.getItem('token')
        $(window).resize() //引入adminlet 解决首次加载首页需手动刷新问题
        const routerchioce = this.$route.path
        if(routerchioce=='/company'){
            this.SelectComponents='comchild'
        }else{
            this.SelectComponents=localStorage.getItem('SelectComponents')
            this.isactive=localStorage.getItem('isactive')
        }
    },
    methods:{
        chioce(item,idx){
            localStorage.setItem('SelectComponents',item.address)
            localStorage.setItem('isactive',idx)
            this.SelectComponents=item.address,
            this.isactive=idx    
        },
        routerfunc(){
            const routerchioce = this.$route.path
            console.log(routerchioce)
        },
        loginout(){
            var url = `api/base/logout`
            let httpDefaultOpts = { // http默认配置
                method: "post",
                url: url,
                timeout: 10000,
                data:'',
                headers : {
                  'X-Requested-With': 'XMLHttpRequest',
                  'Auth': this.testMsg,
                  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                   org:this.orgId
                }
              }
            this.$axios(httpDefaultOpts).then((response)=>{
                if(response.status==200){
                    if(response.data.suc == true){
                        this.$router.push({
                            path:'/login',
                            name:'login'
                        })
                    }
                }if(response.status!=200){
                    alert('请求失败')
                }
            })
        },
        //修改密码
        amendanswer(){
            this.pwdDialogVisible=true
        },
        //确认修改
        surexgbtn(ruleForm2){
            const changdata = JSON.stringify(this.ruleForm2)
            console.log(changdata)
            this.$refs[ruleForm2].validate((valid) => {
              if (valid) {
                this.$confirm('此操作将修改原密码, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                var url = `api/base/changePassword`
                let httpDefaultOpts = { // http默认配置
                    method: "PUT",
                    url: url,
                    timeout: 10000,
                    data:changdata,
                    headers : {
                      'X-Requested-With': 'XMLHttpRequest',
                      'Auth': this.testMsg,
                      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                       org:this.orgId
                    }
                  }
                this.$axios(httpDefaultOpts).then((response)=> {
                    if(response.data.suc==true){
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        }); 
                        this.loginout()
                        

    //                    for(var j in this.goData) {
    //					if(row.id == this.goData[j].id) {
    //                            this.goData.splice(j, 1)
    //                        }
    //                    }
                    }else{
                        this.showDelete=false
                        this.$message({
                            message: response.data.reason,
                        });
                    }
                })
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '取消修改'
                  });          
                })
              } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        //取消修改
        callOff(ruleForm2){
            this.$refs[ruleForm2].resetFields();
            this.pwdDialogVisible=false
        }
    }
}
</script>
<style>
    .active{
        background-color: #1E282C;
    }
    .addclass{
        overflow: auto;
    }
</style>