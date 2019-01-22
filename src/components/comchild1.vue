<template>
    <div class="hello">
        <el-row>
          <el-button @click="addrole" type="danger" icon="el-icon-plus">增加角色</el-button>
        </el-row>
        <el-table id='out-table' :data="tableData3" border style="width: 100%">
            <el-table-column prop="name" label="角色" width="180">
            </el-table-column>
            <el-table-column prop="isDefault" label="是否默认角色" width="180">
            </el-table-column>
            <el-table-column prop="description" label="角色描述">
            </el-table-column>
            
            <el-table-column fixed="right" label="操作" width="150">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
                <el-button @click="dellist(scope.row)" type="text" size="small">删除</el-button>
                <el-button @click="jurisdiction(scope.row)" type="text" size="small">权限</el-button>
              </template>
            </el-table-column>  
        </el-table>


        <!--增加角色弹框-->
        <el-dialog title="增加角色" :visible.sync="addDialogVisible" width="40%" center>
          <el-form ref='ruleForm' :model="ruleForm" :rules="rules" label-position="left" label-width="80px">
              <el-form-item label="角色名称" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
              </el-form-item>
              <el-form-item label="是否默认">
                <el-switch v-model="ruleForm.isDefault" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
              <el-form-item label="角色描述" prop='description'>
                <el-input v-model="ruleForm.description"></el-input>
              </el-form-item>
            </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogclick('ruleForm')">取 消</el-button>
            <el-button type="primary" @click="characterbtn('ruleForm')">确 定</el-button>
          </span>
        </el-dialog>    

        <!--编辑弹框-->
        <el-dialog title="编辑" :visible.sync="centerDialogVisible" width="40%" center>
          <el-form label-position="left" label-width="80px">
              <el-form-item label="角色名称">
                <el-input v-model="Companyname"></el-input>
              </el-form-item>
              <el-form-item label="是否默认">
                <el-switch v-model="companyvalue2" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
              <el-form-item label="角色描述">
                <el-input v-model="companyPhone"></el-input>
              </el-form-item>
            </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="surexgbtn">确 定</el-button>
          </span>
        </el-dialog>
        
        <!--权限设置弹框-->
        <el-dialog title="权限" :visible.sync="delDialogVisible" width="20%" center>
          <el-form ref="using" label-position="left" label-width="80px">
              <el-form-item v-for='(item,idx) in posisz' :key='idx' :label='item.title'>
                <el-switch inactive-text="" v-model="item.enabled" active-color="#13ce66" inactive-color="#ff4949" @input="posSurBtn(item.enabled,item.id)">
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
    import FileSaver from 'file-saver'
    import XLSX from 'xlsx'
export default {
  name: 'HelloWorld',
  data () {
    return {
      centerDialogVisible:false,
      delDialogVisible:false,
      addDialogVisible:false,    
      using:[],
        ruleForm:{
            isDefault:false,
            name:'',
            description:'',
        },
        testMsg:'',
        tableData3:[],
        companyPhone:"",
        Companyname:'',
        companyvalue2:'',
        orgId:'',
        scId:'',
        posisz1:[],
        posisz:[],
        rules:{
            name: [
            { required: true, message: '请输入角色名称', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
          ],
            description: [
            { required: true, message: '请输入角色描述', trigger: 'blur' },
            { min: 2, max: 5, message: '长度在 2 到 15 个字符', trigger: 'blur' }
          ],
        },
        ModifyId:''
    }
  },
    mounted:function(){
        this.testMsg=localStorage.getItem('token') //获取token
        this.orgId = localStorage.getItem('orgId') //获取localStorage
        console.log(this.testMsg)
        this.Toobtain()
    },
    methods:{
        //获取数据
        Toobtain(){
            var url = `/api/compm/positions`
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
                    let positions =response.data.positions;
                    positions.forEach((item)=>{
                        item.closeopen=false
                        if(item.isDefault==true){
                            item.isDefault='是'
                        }else{
                            item.isDefault='不是'
                        }
                        return
                    })
                    this.tableData3=positions
                }
            })
        },
        //编辑
        handleClick(row){
            console.log(row)
            this.ModifyId=row.id
            this.Companyname=row.name
            if(row.isDefault=="不是"){
                this.companyvalue2=false
            }else{
                this.companyvalue2=true
            }
            this.companyPhone=row.description
            this.centerDialogVisible=true
        },
        //确认编辑/修改
        surexgbtn(){
            const ModifyDate = JSON.stringify({id:this.ModifyId,name:this.Companyname,isDefault:this.companyvalue2,description:this.companyPhone})
            var url ='/api/compm/position'
            let httpDefaultOpts = { // http默认配置
                method: "PUT",
                url: url,
                timeout: 10000,
                data:ModifyDate,
                headers : {
                  'X-Requested-With': 'XMLHttpRequest',
                  'Auth': this.testMsg,
                  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                   org:this.orgId
                }
              }
            this.$axios(httpDefaultOpts).then((response)=>{
                if(response.data.suc==true){
                    this.$message({
                        type: 'success',
                        message: '修改成功!'
                    });
                    this.Toobtain()
                }else{
                    this.$message({
                        type: response.data.reason,
                        message: '修改成功!'
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
            var url = `/api/compm/position?id=`+row.id
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
        //获取权限设置
        jurisdiction(row){
            console.log(1)
            this.posisz=[]
            this.delDialogVisible=true
            this.scId = row.id
            var url =`/api/compm/positionFunctions?`+`positionID=`+row.id
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
                this.posisz1=response.data.functions
                let responsedata = response.data.functions
                let structure=[]
                responsedata.forEach((item)=>{
                    if(item.pid==""){
                        structure.push(item)
                        // this.posisz.push(item)
                    }
                })
                console.log(structure)
                structure.forEach((item,idx)=>{
                    if(item.id == "emp_m4" || item.id=="emp_m6"){
                        console.log(idx)
                       structure.splice(idx,1)
                       console.log(structure)
                       return structure.length--
                    } 
                })
                
                structure.sort((x, y)=>{
//                    console.log(x,y)
                    return x.title > y.title ? 1:-1;               
                }) //排序
                
                this.posisz = structure
            })
        },
        //
        posSurBtn(i,id){
            console.log(i,id)
            this.posisz1.forEach((item)=>{
                if(item.pid==id){
                    item.enabled=i
                }
                return
            })
        },
        
        //确认启用
        startusing(){
            const NewData1={id:this.scId,functions:[]}
            this.posisz1.forEach((item)=>{
                NewData1.functions.push({id:item.id,enabled:item.enabled})
            })
            console.log(NewData1)
            const newDate = JSON.stringify(NewData1)
            console.log(newDate)
            var url ='/api/compm/positionFunctions'
            let httpDefaultOpts = { // http默认配置
                method: "PUT",
                url: url,
                timeout: 10000,
                data:newDate,
                headers : {
                  'X-Requested-With': 'XMLHttpRequest',
                  'Auth': this.testMsg,
                  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                   org:this.orgId
                }
              }
            this.$axios(httpDefaultOpts).then((response)=>{
                if(response.data.suc==true){
                    this.$message({
                        type: 'success',
                        message: '保存成功!'
                    });
                }
            })
        },
        //增加角色
        addrole(){
            this.addDialogVisible=true,
            this.ruleForm.name='',
            this.ruleForm.description=''
        },
        //确认增加角色
        characterbtn(ruleForm){
            this.$refs[ruleForm].validate((valid) => {
              if (valid) {
                var url = '/api/compm/position'
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
        addDialogclick(formName){
            this.$refs[formName].resetFields();
            this.addDialogVisible=false
        },
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
