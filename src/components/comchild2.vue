<template>
    <div class="hello">
<!--
        <el-row>
          <el-button @click="addrole" type="danger" icon="el-icon-plus">邀请成员</el-button>
        </el-row>
-->
        <el-table :data="tableData3" border style="width: 100%">
            <el-table-column prop="realName" label="姓名" width="180">
            </el-table-column>
            <el-table-column prop="phone" label="电话" width="180">
            </el-table-column>
            <el-table-column prop="position" label="职位">
            </el-table-column>
            
            <el-table-column fixed="right" label="操作" width="150">
              <template slot-scope="scope">
<!--                <el-button @click="dellist(scope.row)" type="text" size="small">删除</el-button>-->
                <el-button @click="jurisdiction(scope.row)" type="text" size="small">权限</el-button>
              </template>
            </el-table-column>  
        </el-table>

        <!--邀请弹框-->
        <el-dialog title="邀请成员" :visible.sync="addDialogVisible" width="40%" center>
            <el-form ref='ruleForm' :model="ruleForm" :rules="rules" label-position="left" label-width="95px">
              <el-form-item label="邀请人电话" prop="companyPhone">
                <el-input placeholder="请输入电话" v-model="ruleForm.companyPhone"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="surexgbtn('ruleForm')">确 定</el-button>
              </span>
        </el-dialog>

        <!--角色权限设置-->
        <el-dialog title="权限" :visible.sync="delDialogVisible" width="20%" center>
          <el-form ref="using" label-position="left" label-width="80px">
              <el-form-item v-for="(item,idx) in using" :key='idx' :label='item.name'>
                <el-switch v-model="item.enabled" active-color="#13ce66" inactive-color="#ff4949" @input="posSurBtn(item)">
                </el-switch>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="startusing">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      centerDialogVisible:false,
      delDialogVisible:false,
      addDialogVisible:false,    
      using:[],    
      testMsg:'',
        orgId:'',
        jsId:'',
      tableData3:[],
        ruleForm:{
            companyPhone:"",
        },
        Companyname:'',
        companyvalue2:'',
        rules:{
            companyPhone:[
                {required: true,message: '请输入手机号码',trigger: 'blur'},
                {validator:function(rule,value,callback){
                    if(/^1[34578]\d{9}$/.test(value) == false){
                        callback(new Error("请输入正确的手机号"));
                    }else{
                        callback();
                    }
                }, trigger: 'blur'}
            ]
        }
    }
  },
    mounted:function(){
        this.testMsg=localStorage.getItem('token') //获取token
        this.orgId = localStorage.getItem('orgId') //获取localStorage
        console.log(this.testMsg)
        this.Toobtain()
    },
    methods:{
        //获取原始数据
        Toobtain(){
            var url = `/api/compm/employees`
//          var data = data  = JSON.stringify(body);
            let httpDefaultOpts = { // http默认配置
                method: "GET",
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
                    let positions =response.data.records;
                    positions.forEach((item)=>{
                        item.closeopen=false
                        return
                    })
                    this.tableData3=positions
                }
            })
        },
        //确认邀请新人
        surexgbtn(ruleForm){
            this.$refs[ruleForm].validate((valid) => {
              if (valid) {
                var url = '/api/compm/invite'
                const body = this.ruleForm
                var data = JSON.stringify(body);
                let httpDefaultOpts = { // http默认配置
                    method: "post",
                    url: url,
                    timeout: 10000,
                    data:data,
                    headers : {
                      'X-Requested-With': 'XMLHttpRequest',
                      'Auth': this.testMsg,
                      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                       org:'ctm'
                    }
                  }
                this.$axios(httpDefaultOpts).then((response)=>{
                    this.show1=false
                    if(response.data.suc==true){
                        this.$message({
                            message: '邀请成功',
                            type: 'success'
                        });
                        this.$refs[ruleForm].resetFields();
                    }if(response.data.suc==false){
                        this.$message({
                            message: response.data.reason,
                            type: 'info'
                        });
                    }
                })   
              } else {
                console.log('error submit!!');
                return false;
              }
            })
        },
        //删除
        dellist(row){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
            var url = `/api/compm/employee?id=`+row.id
            let httpDefaultOpts = { // http默认配置
                method: "DELETE",
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
            this.$axios(httpDefaultOpts).then((response)=> {
                if(response.data.suc==true){
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    }); 
                    this.Toobtain()
                    
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
                message: '已取消删除'
              });          
            })
        },
        //权限
        jurisdiction(row){
            this.delDialogVisible=true
            this.jsId = row.id
            var url = `/api/compm/employeeRoles?employeeID=`+row.id
            let httpDefaultOpts = { // http默认配置
                method: "GET",
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
                    this.using=response.data.roles
                }
            })
        },
        //确认启用某个角色
        startusing(){
            var url = '/api/compm/employeeRoles'
            let body = {id:this.jsId,roles:[]}
            this.using.forEach(r=>{
                body.roles.push({id:r.id,enabled:r.enabled})
            })
            let httpDefaultOpts = { // http默认配置
                method: "PUT",
                url: url,
                timeout: 10000,
                data:JSON.stringify(body),
                headers : {
                  'X-Requested-With': 'XMLHttpRequest',
                  'Auth': this.testMsg,
                  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                   org:this.orgId
                }
              }
            this.$axios(httpDefaultOpts).then((response)=>{
                if(response.status==200){
                    if(response.data.suc==true){
                        this.$message({
                            type: 'success',
                            message: '设置成功!'
                        });
                    }else{
                        this.$message({
                            message:response.data.reason,
                            type: 'error',
                        });
                    }
                    console.log(response.data);
                }
            })
        },
        //增加角色
        addrole(){
            this.addDialogVisible=true
        },
        //角色权限设置
        posSurBtn(item){
            if(item.enabled){
                for(let i=0;i<this.using.length;i++){ 
                   if(this.using[i].id!=item.id){
                       this.using[i].enabled=false
                   }
                }
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1{
  font-weight: normal;
    margin: 0;
}
</style>
