<template>
    <div class="hello">
        <div class="content">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="企业名称" prop="name">
                    <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="企业法人" prop="legalPerson">
                    <el-input v-model="ruleForm.legalPerson"></el-input>
                </el-form-item>
                <el-form-item label="管理员电话" prop="managerPhone">
                    <el-input v-model="ruleForm.managerPhone"></el-input>
                </el-form-item>
                <el-form-item label="企业描述" prop="description">
                    <el-input v-model="ruleForm.description"></el-input>
                </el-form-item>
                <el-form-item label="企业地址" prop="address">
                    <el-input v-model="ruleForm.address"></el-input>
                </el-form-item>
                <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
              </el-form-item>
            </el-form>
    </div>
    <router-view></router-view>
    </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
        msg: 'Welcome to Your Vue.js App',
        testMsg:'',
        domainurl:domain.domainUrl, //公共域名
        ruleForm: {
            name:'',
            legalPerson:'',
            managerPhone:'',
            description:'',
            address:''
        },
        rules: {
            name: [
            { required: true, message: '请输入企业名称', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
          ],
            legalPerson: [
            { required: true, message: '请输入企业法人', trigger: 'blur' },
            { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
          ],
            description: [
            { required: true, message: '请输入企业描述', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
          ],
            address: [
            { required: true, message: '请输入企业地址', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
          ],
            managerPhone:[
                {required: true,message: '请输入手机号码',trigger: 'blur'},
                {validator:function(rule,value,callback){
                    if(/^1[34578]\d{9}$/.test(value) == false){
                        callback(new Error("请输入正确的手机号"));
                    }else{
                        callback();
                    }
                }, trigger: 'blur'}
            ]
        },
    }
  },
    mounted:function(){
        this.testMsg = localStorage.getItem('token') //获取localStorage
    },
    methods: {
        toggleSelection(rows) {
            if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row);
                });
            } else {
                    this.$refs.multipleTable.clearSelection();
                }
            },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //增加企业
        submitForm(ruleForm){
            this.$refs[ruleForm].validate((valid) => {
              if (valid) {
                var url =this.domainurl+'/api/ctm/company'
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
                            message: '创建成功',
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
            console.log(this.ruleForm)
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
    .content{
        width: 400px;
/*        margin: auto;*/
    }    
</style>
