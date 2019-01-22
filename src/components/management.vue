<template>
    <div class="hello">
        <div class='searchitem'>
            <div class="Section">
                <span>部门</span>
                <el-select clearable v-model="Sectionvalue" placeholder="请选择">
                    <el-option v-for="item in options" :key="item.value" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <!--
            <div class="Section">
                <span>名称</span>
                <el-input class='namestyle' v-model="nameinput" placeholder="请输入内容"></el-input>
            </div>
-->
            <div class="Section">
                <span>时间</span>
                <el-date-picker v-model="times" type="month" placeholder="选择日期">
                </el-date-picker>
            </div>
            <div class="Section">
                <el-button @click="sumsarch" type="primary" icon="el-icon-search">查询</el-button>
                <el-button @click='exportExcel' type="danger" icon="el-icon-download">EXCEL导出</el-button>
            </div>
        </div>
        <el-table id='out-table' :data="employeeClockInfos" border style="width: 100%">
            <el-table-column type="index" label="序号" width="80">
            </el-table-column>
            <el-table-column property="departmentNames" label="部门" width="80">
            </el-table-column>
            <el-table-column property="realName" label="姓名" width="80">
            </el-table-column>
            <el-table-column v-for="(day,idx) in days" :key='idx' :label="`${day}`" width="80">
                <template slot-scope="scope">
                    <div v-html="employeeClockInfos[scope.$index][day]">
                    </div>
                    <!-- <p v-if="employeeClockInfos[scope.$index].clockRecordMap[scope.column.label]">{{employeeClockInfos[scope.$index].clockRecordMap[scope.column.label].sDescription}}</p>
                    <p v-if="employeeClockInfos[scope.$index].clockRecordMap[scope.column.label]">{{employeeClockInfos[scope.$index].clockRecordMap[scope.column.label].xDescription}}</p> -->
                </template>
            </el-table-column>
        </el-table>
        <!--
        <el-pagination v-if='Sumtotal>10' :page-size="10" @current-change="handleCurrentChange" background layout="prev, pager, next" :total="Sumtotal">
        </el-pagination>
-->
    </div>
</template>

<script>
function initCurrentDays(year, month) {
    let days = {};
    let firstDay = new Date(year, month - 1, 1);//指定年月的第一天
    for (let date = 1; date <= new Date(year, month, 0).getDate(); date++) {
        days[date] = new Date(year, month - 1, date)
    }
    return days;
}
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export default {
    name: 'HelloWorld',
    data() {
        return {
            times: '',
            using: [],
            testMsg: '',
            days: [],
            companyPhone: "",
            orgId: '',
            scId: '',
            posisz1: [],
            posisz: [],
            ModifyId: '',
            options: [],
            Sectionvalue: '',
            nameinput: '',
            mathlist: [],
            Sumtotal: 0,
            NowMonthdate: [],
            employeeClockInfos: [], // 考勤数据
            LeaveMath: [],   // 请假数据
            Realnamevalue: ''
        }
    },
    mounted: function () {
        this.testMsg = localStorage.getItem('token') //获取token
        this.orgId = localStorage.getItem('orgId') //获取localStorage
        console.log(this.testMsg)
        this.section()
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        this.times = year + `-` + month
        this.Toobtain(year, month)
        // 计算当前月
        this.LeaveMathfnc(year, month)
        this.Forthemonth(date, month)
        // if(this.NowMonthdate){
        // this.NowMonthdate=[]
        // }
    },
    methods: {
        //搜索
        sumsarch() {
            const date = new Date(this.times);
            const year = date.getFullYear();
            const month = date.getMonth() + 1
            if (year == 1970) {
                this.$message({
                    message: '警告，请输入年月',
                    type: 'warning'
                });
            } else {
                this.NowMonthdate = []
                this.Forthemonth(date, month)          
                this.LeaveMathfnc(year, month)
                this.Toobtain(year, month)
            }
        },
        //获取考勤数据
        Toobtain(year, month) {
            var url = `api/compm/attendanceStatus?year=` + year + `&month=` + month + `&departmentID=` + this.Sectionvalue
            let httpDefaultOpts = { // http默认配置
                method: "GET",
                url: url,
                timeout: 10000,
                data: '',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Auth': this.testMsg,
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    org: this.orgId
                }
            }
            this.$axios(httpDefaultOpts).then((response) => {
                console.log(response.data.employees)
                if (response.status == 200) {
                    this.employeeClockInfos = [];
                    let employees = [];

                    let days = initCurrentDays(year, month);
                    this.days = [];
                    for (const keyIdx in Object.keys(days)) {
                        const key = Object.keys(days)[keyIdx];
                        this.days.push(key);
                    }
                    response.data.employees.forEach((employee) => {
                        let employeeClockInfo = {
                            realName: employee.realName,
                            departmentNames: employee.departmentNames
                        };
                        //                        console.log(employee)
                        let employeeMsg = "";
                        for (const keyIdx in Object.keys(days)) {
                            const key = Object.keys(days)[keyIdx];
                            employeeClockInfo[key] = `<p>未打卡</p><p>未打卡</p>`;
                        }
                        employee.clockRecords.forEach(clockRecord => {//遍历当前这个员工的打卡记录
                            // employeeMsg += `${JSON.stringify(clockRecord)},`
                            let date = new Date(clockRecord.date)
                            let clockInfo = '';

                            if (true) {
                                clockInfo = `<p>${clockRecord.sDescription}</p><p>${clockRecord.xDescription}</p>`
                            }

                            employeeClockInfo[date.getDate()] = clockInfo
                        });
                        this.employeeClockInfos.push(employeeClockInfo);
                    });
                    this.days.forEach((daysitem) => {
                        this.employeeClockInfos.forEach((item1) => {
                            this.LeaveMath.forEach((LeaveMathitem) => {
                                if (LeaveMathitem.realName===item1.realName&&LeaveMathitem.state==='通过'&&daysitem===LeaveMathitem.endTime&&LeaveMathitem.statrTimeday<=12&&LeaveMathitem.hours<=4) {
                                    item1[daysitem]=JSON.stringify(item1[daysitem].replace(/,/g, ""))
                                    item1[daysitem] = `<p>请假</p>${item1[daysitem].length>5?item1[daysitem].substring(4,9):item1[daysitem]}`
                                }else if(LeaveMathitem.realName===item1.realName&&LeaveMathitem.state==='通过'&&daysitem===LeaveMathitem.endTime&&LeaveMathitem.statrTimeday>12&&LeaveMathitem.hours<=4){
                                    item1[daysitem]=JSON.stringify(item1[daysitem].replace(/,/g, ""))
                                    item1[daysitem] = `${item1[daysitem].length>5?item1[daysitem].substring(4,9):item1[daysitem]}<p>请假</p>`
                                }else if(LeaveMathitem.realName===item1.realName&&LeaveMathitem.state==='通过'&&daysitem===LeaveMathitem.endTime&&LeaveMathitem.hours>=8){
                                    item1[daysitem] = `<p>请假</p><p>请假</p>`
                                }
                            })
                        })
                    })
                }
            })
        },


        // 获取请假数据
        LeaveMathfnc(year, month) {
            this.LeaveMath=[]
            if (year == 1970) {
                this.$message({
                    message: '警告，请输入年月',
                    type: 'warning'
                });
            } else {
                var url = `api/compm/leaveNoteRecords?departmentID=` + this.Sectionvalue + `&year=` + year + `&month=` + month + `&userID=` + this.Realnamevalue
                let httpDefaultOpts = { // http默认配置
                    method: "GET",
                    url: url,
                    timeout: 10000,
                    data: '',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'Auth': this.testMsg,
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        org: this.orgId
                    }
                }
                this.$axios(httpDefaultOpts).then((response) => {
                    if (response.status == 200) {
                        this.Sumtotal = response.data.totalQty
                        const tableData3 = response.data.Records;
                        console.log(tableData3)
                        tableData3.forEach((item) => {
                            var date = new Date(item.startTime);
                            var y = 1900 + date.getYear();
                            var m = "0" + (date.getMonth() + 1);
                            var d = "0" + date.getDate();
                            var h = "0" + date.getHours();
                            var s = "0" + date.getMinutes();
                            item.startTime = d.substring(d.length - 2, d.length)
                            item.statrTimeday = h.substring(h.length - 2, h.length)

                            var date = new Date(item.endTime);
                            var y = 1900 + date.getYear();
                            var m = "0" + (date.getMonth() + 1);
                            var d = "0" + date.getDate();
                            var h = "0" + date.getHours();
                            var s = "0" + date.getMinutes();
                            item.endTime = d.substring(d.length - 2, d.length)
                            item.endTimeday = y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length) + ` ` + h.substring(h.length - 2, h.length) + `:` + s.substring(s.length - 2, s.length)

                            var date = new Date(item.ct);
                            var y = 1900 + date.getYear();
                            var m = "0" + (date.getMonth() + 1);
                            var d = "0" + date.getDate();
                            var h = "0" + date.getHours();
                            var s = "0" + date.getMinutes();
                            item.ct = y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length) + ` ` + h.substring(h.length - 2, h.length) + `:` + s.substring(s.length - 2, s.length)
                            return
                        });

                        for (var i = 0; i < tableData3.length; i++) {
                            this.LeaveMath.push(tableData3[i]);
                        }
                    }
                })
            }
        },

        // 获取当前月
        Forthemonth(NowDate, NowMONTH) {
            NowDate.setMonth(NowMONTH)
            NowDate.setDate(0)
            let alday = NowDate.getDate()
            for (var i = 1; i <= alday; i++) {
                this.NowMonthdate.push(i)
            }
        },

        //翻页
        handleCurrentChange(val) {
            console.log(val)
        },

        //
        posSurBtn(i, id) {
            console.log(i, id)
            this.posisz1.forEach((item) => {
                if (item.pid == id) {
                    item.enabled = i
                }
                return
            })
        },

        //导出数据
        exportExcel() {
            var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'))
            var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
            try {
                FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), this.testMsg + `sheetjs.xlsx`)
            } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
            return wbout
        },
        //获取部门列表
        section() {
            var url = `/api/compm/departments?pid=` + ''
            //          var data = data  = JSON.stringify(body);
            let httpDefaultOpts = { // http默认配置
                method: "GET",
                url: url,
                timeout: 10000,
                data: '',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Auth': this.testMsg,
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    org: this.orgId
                }
            }
            this.$axios(httpDefaultOpts).then((response) => {
                if (response.status == 200) {
                    let positions = response.data.Departments;
                    positions.forEach((item) => {
                        item.closeopen = false
                        return
                    })
                    this.options = positions
                }
            })
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  font-weight: normal;
  margin: 0;
}
.searchitem {
  width: 100%;
  height: 60px;
  padding: 10px;
}
.Section {
  width: 300px;
  height: 40px;
  float: left;
}
.Section span {
  padding-right: 10px;
}
.namestyle {
  width: 216px;
}
</style>
