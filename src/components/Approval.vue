<template>
    <div class="hello">
        <div class='searchitem'>
            <div class="Section">
                <span>部门</span>
                <el-select clearable v-model="Sectionvalue" placeholder="请选择">
                    <el-option
                    v-for="item in options" :key="item.value" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
                
<!--
                <el-autocomplete
                  class="inline-input" v-model="state1" :fetch-suggestions="querySearch" placeholder="请输入内容" @select="handleSelect"
                ></el-autocomplete>
-->
                
            </div>
            <div class="Section">
                <span>名称</span>
                <el-select clearable v-model="Realnamevalue" placeholder="请选择">
                    <el-option
                    v-for="item in Realname" :key="item.value" :label="item.realName" :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div class="Section Sections">
                <span>时间</span>
                <el-date-picker v-model="times" type="month" placeholder="选择日期">
                </el-date-picker>
            </div>
            <div class="Section">
                <el-button @click='findclick()' type="primary" icon="el-icon-search">查询</el-button>
              <el-button @click='exportExcel' type="danger" icon="el-icon-download">EXCEL导出</el-button>
            </div>
        </div>
        <el-table header-align='center' id='out-table' :data="tableData3" border style="width: 100%">
            <el-table-column align='center' header-align='center' type='index' label="序号" width="80">
            </el-table-column>
            <el-table-column align='center' header-align='center' prop="departmentNames" label="部门" width="80">
            </el-table-column>
            <el-table-column align='center' header-align='center' prop="realName" label="申请人" width="80">
            </el-table-column>
            <el-table-column align='center' header-align='center' prop="ct" label="申请时间" width="135">
            </el-table-column>
            <el-table-column align='center' header-align='center' prop="typeName" label="类型" width="80">
            </el-table-column>
            <el-table-column align='center' header-align='center' prop="startTime" label="开始时间" width="135">
            </el-table-column>
            <el-table-column align='center' header-align='center' prop="endTime" label="结束时间" width="135">
            </el-table-column>
            <el-table-column align='center' header-align='center' prop="hours" label="请假时长" width="80">
            </el-table-column>
            <el-table-column align='center' header-align='center' prop="reason" label="请假原因">
            </el-table-column>
            <el-table-column align='center' header-align='center' prop="handlerName" label="审批人" width="80">
            </el-table-column>
            <el-table-column align='center' header-align='center' prop="state" label="状态" width="80">
            </el-table-column>
        </el-table>
<!--
        <el-pagination v-if='Sumtotal>10' :page-size="10" @current-change="handleCurrentChange" background layout="prev, pager, next" :total="Sumtotal">
        </el-pagination>
-->
    </div>
</template>

<script>
    import FileSaver from 'file-saver'
    import XLSX from 'xlsx'
export default {
  name: 'HelloWorld',
  data () {
    return {
      times:'',        
      using:[],
        testMsg:'',
        tableData3:[
            {
                names:'李大胆',
                isDefault:'研发',
                serial:1
            }
        ],
        companyPhone:"",
        orgId:'',
        scId:'',
        posisz1:[],
        posisz:[],
        ModifyId:'',
        options:[],
        Sectionvalue:'',
        nameinput:'',
        Sumtotal:0,
        Nowpage:1,
        Realname:[],
        Realnamevalue:''
    }
  },    
    mounted:function(){
        this.testMsg=localStorage.getItem('token') //获取token
        this.orgId = localStorage.getItem('orgId') //获取localStorage
//        console.log(this.testMsg)
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        this.times = year+`-`+month
        this.Toobtain()
        this.section()
        this.Resondata()
    },
    methods:{
     //翻页
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
          this.Nowpage=val
          this.Toobtain()
      },
        
        //获取数据
        Toobtain(){
            const date = new Date(this.times);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            if(year==1970){
                this.$message({
                  message: '警告，请输入年月',
                  type: 'warning'
                });
            }else{
                var url = `api/compm/leaveNoteRecords?departmentID=`+this.Sectionvalue+`&year=`+year+`&month=`+month+`&userID=`+this.Realnamevalue
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
                    this.Sumtotal = response.data.totalQty
                    this.tableData3 =response.data.Records;
                    this.tableData3.forEach((item)=>{
                        var date =  new Date(item.startTime);
                        var y = 1900+date.getYear();
                        var m = "0"+(date.getMonth()+1);
                        var d = "0"+date.getDate();
                        var h = "0"+date.getHours();
                        var s = "0"+date.getMinutes();
                        item.startTime =y+"-"+m.substring(m.length-2,m.length)+"-"+d.substring(d.length-2,d.length)+` `+h.substring(h.length-2,h.length)+`:`+s.substring(s.length-2,s.length)
                        
                        var date =  new Date(item.endTime);
                        var y = 1900+date.getYear();
                        var m = "0"+(date.getMonth()+1);
                        var d = "0"+date.getDate();
                        var h = "0"+date.getHours();
                        var s = "0"+date.getMinutes();
                        item.endTime =y+"-"+m.substring(m.length-2,m.length)+"-"+d.substring(d.length-2,d.length)+` `+h.substring(h.length-2,h.length)+`:`+s.substring(s.length-2,s.length)
                        
                        var date =  new Date(item.ct);
                        var y = 1900+date.getYear();
                        var m = "0"+(date.getMonth()+1);
                        var d = "0"+date.getDate();
                        var h = "0"+date.getHours();
                        var s = "0"+date.getMinutes();
                        item.ct =y+"-"+m.substring(m.length-2,m.length)+"-"+d.substring(d.length-2,d.length)+` `+h.substring(h.length-2,h.length)+`:`+s.substring(s.length-2,s.length)
                        return
                    });
                    
                    for(var i=0; i<this.tableData3.length;i++){
                        this.Realname.push(this.tableData3[i]);
                    }
                    
                    for(var i=0;i<this.Realname.length;i++){
                        for(var j=i+1;j<this.Realname.length;j++){
                            if(this.Realname[i].realName==this.Realname[j].realName){
                                this.Realname.splice(j,1);
                                j--
                            }
                        }
                    }
                    console.log(this.Realname)
                    console.log(this.tableData3)
                }
            })
            }
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
        //导出数据
        exportExcel () {
         /* generate workbook object from table */
         var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'))
         /* get binary string as output */
         var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
         try {
             FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), this.testMsg+`sheetjs.xlsx`)
         } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
         return wbout
     },
        
        //获取部门列表
        section(){
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
                    this.options=positions
                }
            })
        },
        //获取选择ID
        Sectionchange(item){
            console.log(item)
        },
        //查找
        findclick(){
            this.Toobtain()
        },
        //获取人员数据
        Resondata(){
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
                    this.Realname = positions
                }
            })
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
    .searchitem{
        width: 100%;
        height: 60px;
        padding: 10px;
    }
    .Section{
        width: 260px;
        height: 40px;
        float: left;
    }
    .Sections{
        width: 420px;
    }
    .Section span{
        padding-right:10px;
    }
    .namestyle{
        width: 216px;
    }
</style>
