<template>
    <div class="hello">
        <el-row>
          <el-button @click="addrole" type="danger" icon="el-icon-plus">新建部门</el-button>
        </el-row>
        <el-table :data="tableData3" border style="width: 100%">
            <el-table-column prop="name" label="部门" width="180">
            </el-table-column>
            <el-table-column prop="description" label="部门描述">
            </el-table-column>
            
            <el-table-column fixed="right" label="操作" width="150">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
                <el-button @click="dellist(scope.row)" type="text" size="small">删除</el-button>
                <el-button @click="jurisdiction(scope.row)" type="text" size="small">添加</el-button>
              </template>
            </el-table-column>  
        </el-table>

        <!--新增部门弹框-->
        <el-dialog title="增加部门" :visible.sync="addDialogVisible" width="40%" center>
          <el-form ref='ruleForm' :model="ruleForm" :rules="rules" label-position="left" label-width="80px">
              <el-form-item label="部门名称" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
              </el-form-item>
              <el-form-item label="部门描述" prop='description'>
                  <el-input v-model="ruleForm.description"></el-input>
              </el-form-item>
            </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addsection('ruleForm')">确 定</el-button>
          </span>
        </el-dialog>    

        <!--编辑弹框-->
        <el-dialog title="编辑" :visible.sync="centerDialogVisible" width="40%" center>
          <el-form ref='ruleForm' :model="ruleForm" :rules="rules" label-position="left" label-width="80px">
              <el-form-item label="角色名称" prop='name'>
                <el-input v-model="ruleForm.name"></el-input>
              </el-form-item>
              <el-form-item label="部门描述" prop='description'>
                  <el-input v-model="ruleForm.description"></el-input>
              </el-form-item> 
            </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="surexgbtn('ruleForm')">确 定</el-button>
          </span>
        </el-dialog>
        
        <!--添加部门联系人-->
        <el-dialog title="部门成员列表" :visible.sync="delDialogVisible" width="80%" center>
            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                <el-menu-item index='1'>成员列表</el-menu-item>
                <el-menu-item index='2'>邀请成员</el-menu-item>
            </el-menu>
            <div v-show="MemberList">
                <el-table :data="MemberData" border style="width: 100%">
                    <el-table-column prop="name" label="姓名" width="180">
                    </el-table-column>
                    <el-table-column prop="phone" label="联系电话">
                    </el-table-column>

                    <el-table-column fixed="right" label="操作" width="150">
                      <template slot-scope="scope">
                        <el-button @click="delperson(scope.row)" type="text" size="small">删除</el-button>
                      </template>
                    </el-table-column>  
                </el-table>
            </div>
            <div v-show="inviteList">
                <el-table :data="bmcyData" border style="width: 100%">
                    <el-table-column prop="realName" label="姓名" width="180">
                    </el-table-column>
                    <el-table-column prop="phone" label="联系电话">
                    </el-table-column>

                    <el-table-column fixed="right" label="操作" width="150">
                      <template slot-scope="scope">
                        <el-button @click="startusing(scope.row)" type="text" size="small">邀请</el-button>
                      </template>
                    </el-table-column>  
                </el-table>
            </div>
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
        MemberList:true,
        inviteList:false,
        activeIndex:'1',
        bmcyData:[],
        MemberData:[],
        bmID:'',
        navchioce:[
            {name:'成员列表'},
            {name:'邀请成员'}
        ],
      using:{
          value1:false, 
          value2:false,    
          value3:false,    
          value4:false,    
          value5:false,    
          value6:false, 
      },    
        testMsg:'',
        orgId:'',
        tableData3:[],
        ruleForm:{
            name:'',
            description:'',
        },
        rules:{
            name: [
            { required: true, message: '请输入部门名称', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
          ],
            description: [
            { required: true, message: '请输入部门描述', trigger: 'blur' },
            { min: 2, max: 5, message: '长度在 2 到 15 个字符', trigger: 'blur' }
          ],
        }
    }
  },
    mounted:function(){
        this.testMsg=localStorage.getItem('token') //获取token
        this.orgId=localStorage.getItem('orgId') //获取token
        console.log(this.testMsg)
        this.Toobtain()
    },
    methods:{
        //选择邀请人或者成员列表
        handleSelect(key, keyPath){
            if(key==1){
                this.MemberList=true,
                this.inviteList=false   
            }else{
                this.MemberList=false,
                this.inviteList=true
            }
        },
        
        //获取默认数据
        Toobtain(){
            var url =`/api/compm/departments?pid=`+''
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
                    let positions =response.data.Departments;
                    positions.forEach((item)=>{
                        item.closeopen=false
                        return
                    })
                    this.tableData3=positions
                }
            })
        },
        //编辑
        handleClick(row){
            this.centerDialogVisible=true,
            this.ruleForm.name=row.name,
            this.ruleForm.description=row.description,
            this.ruleForm.id = row.id    
        },
        //确认编辑/修改
        surexgbtn(ruleForm){
            console.log(this.ruleForm)
            var url ='/api/compm/department'
                let httpDefaultOpts = { // http默认配置
                method: "PUT",
                url: url,
                timeout: 10000,
                data:JSON.stringify(this.ruleForm),
                headers : {
                  'X-Requested-With': 'XMLHttpRequest',
                  'Auth':this.testMsg ,
                  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                   org:this.orgId
                }
            }
            this.$axios(httpDefaultOpts).then((response)=>{
                if(response.data.suc==true){
                    this.Toobtain()
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    });
                    this.$refs[ruleForm].resetFields();
                }else{
                    this.$message({
                        message: response.data.reson,
                        type: 'info'
                    });
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
            var url = `/api/compm/department?id=`+row.id
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
        //增加部门成员获取邀请列表
        jurisdiction(row){
            this.delDialogVisible=true
            this.bmID=row.id
            var url =`/api/compm/employees`+`?departmentID=`+row.id
                let httpDefaultOpts = { // http默认配置
                method: "GET",
                url: url,
                timeout: 10000,
                data:"",
                headers : {
                  'X-Requested-With': 'XMLHttpRequest',
                  'Auth':this.testMsg ,
                  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                   org:this.orgId
                }
            }
            this.$axios(httpDefaultOpts).then((response)=>{
                if(response.status==200){
//                    response.data.members.forEach((item)=>{
//                        item.closeopen1=false
//                        return
//                    })
                    this.bmcyData=response.data.records
                }
            })
            this.invitationlist()
        },
        //确认邀请
        startusing(row){
            const yqUserId=JSON.stringify({departmentID:this.bmID,userID:row.id})
            this.$confirm('是否邀请此人?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
            var url = `/api/compm/departmentMember`
            let httpDefaultOpts = { // http默认配置
                method: "POST",
                url: url,
                timeout: 10000,
                data:yqUserId,
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
                        message: '邀请成功!'
                    }); 
                    this.Toobtain(),
                    this.invitationlist()     
                }else{
                    this.$message({
                        message: '请勿重复邀请',
                        type: 'info'
                    });
                }
            })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消邀请'
              });          
            })
        },
        
        //获取邀请成员列表
        invitationlist(){
            var url =`/api/compm/departmentMembers`+`?departmentID=`+this.bmID
                let httpDefaultOpts = { // http默认配置
                method: "GET",
                url: url,
                timeout: 10000,
                data:"",
                headers : {
                  'X-Requested-With': 'XMLHttpRequest',
                  'Auth':this.testMsg ,
                  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                   org:this.orgId
                }
            }
            this.$axios(httpDefaultOpts).then((response)=>{
                if(response.status==200){
                    response.data.members.forEach((item)=>{
                        item.closeopen=false
                        return
                    })
                    this.MemberData=response.data.members
                }
            })
        },
        
        //新增部门
        addrole(){
            this.addDialogVisible=true
            this.ruleForm.name==''
            this.ruleForm.description==''
        },
        //确认新增部门
        addsection(ruleForm){
            this.$refs[ruleForm].validate((valid) => {
              if (valid) {
                var url = '/api/compm/department'
                const body = this.ruleForm
                var data = JSON.stringify(body);
                let httpDefaultOpts = { // http默认配置
                    method: "POST",
                    url: url,
                    timeout: 10000,
                    data:data,
                    headers : {
                      'X-Requested-With': 'XMLHttpRequest',
                      'Auth': this.testMsg,
                      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                       org:this.orgId
                    }
                  }
                this.$axios(httpDefaultOpts).then((response)=>{
                    this.show1=false
                    if(response.data.suc==true){
                        this.$message({
                            message: '增加成功',
                            type: 'success'
                        });
                        this.$refs[ruleForm].resetFields();
                        this.Toobtain()
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
        //删除部门成员
        delperson(row){
            var url = `/api/compm/departmentMember?departmentID=`+this.bmID+`&userID=`+row.id
                let httpDefaultOpts = { // http默认配置
                method: "DELETE",
                url: url,
                timeout: 10000,
                data:'',
                headers : {
                  'X-Requested-With': 'XMLHttpRequest',
                  'Auth':this.testMsg ,
                  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                   org:this.orgId
                }
            }
            this.$axios(httpDefaultOpts).then((response)=>{
                if(response.data.suc==true){
                    this.$message({
                            message: '移出成功',
                            type: 'success'
                        });
                    this.invitationlist()
                }
            })
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
    .indexboder{
        border-bottom:solid 2px #409EFF;
    }
</style>
