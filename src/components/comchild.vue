<template>
    <div class="hello">
        <div id="container" class="container1">
            <div id="pickerBox">
                <input id="pickerInput" placeholder="输入关键字选取地点" />
                <div id="poiInfo"></div>
            </div>
        </div>

        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">
            <!--
            <el-form-item label="公司名称" prop="name">
                <div style="width:220px;">
                    <el-input v-model="ruleForm.name"></el-input>
                </div>  
            </el-form-item>
-->

            <el-form-item label="上班时间">
                <el-time-select placeholder="起始时间" v-model="ruleForm.startTime" :picker-options="{ start: '08:30', step: '00:15',end: '18:30',maxTime:ruleForm.endTime}">
                </el-time-select>

                <!--
                <el-time-select placeholder="结束时间" v-model="ruleForm.endTime" :picker-options="{start: '08:30',step: '00:15',end: '18:30',minTime:ruleForm.startTime}">
                </el-time-select>
-->

            </el-form-item>

            <el-form-item label="下班时间">
                <el-time-select placeholder="结束时间" v-model="ruleForm.endTime" :picker-options="{start: '08:30',step: '00:15',end: '18:30',minTime:ruleForm.startTime}">
                </el-time-select>
            </el-form-item>

            <el-form-item label="工作日">
                <!--            <el-checkbox-group v-model="ruleForm.type">-->
                <el-checkbox v-model='webks'>星期日</el-checkbox>
                <el-checkbox v-model='webko'>星期一</el-checkbox>
                <el-checkbox v-model='webkm'>星期二</el-checkbox>
                <el-checkbox v-model='webkt'>星期三</el-checkbox>
                <el-checkbox v-model='webkfor'>星期四</el-checkbox>
                <el-checkbox v-model='webkf'>星期五</el-checkbox>
                <el-checkbox v-model='webkw'>星期六</el-checkbox>
                <!--            </el-checkbox-group>-->
            </el-form-item>

            <el-form-item label="打卡范围(m)" prop="clockRange">
                <div class="mbfather" style="width:220px;">
                    <el-input type='number' v-model="ruleForm.clockRange"></el-input>
                    <div class="mblabel"></div>
                </div>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import AMap from 'AMap'
var map //申明实例化地图
var lnglatXY //申明全局经纬度,
var address
var lng
var lat
export default {
    name: 'HelloWorld',
    data() {
        return {
            testMsg: '',
            endTime: '',
            startTime: '',
            orgId: '',
            webks: false,
            webko: false,
            webkm: false,
            webkt: false,
            webkfor: false,
            webkf: false,
            webkw: false,
            name: '',
            ruleForm: {
                name: '',
                type: [],
                resource: '',
                clockRange: '',
                testMsg: '',
                endTime: '',
                startTime: '',
            },
            rules: {
                name: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 2 到 30 个字符', trigger: 'blur' }
                ],
                type: [
                    { type: 'array', required: true, message: '请至少选择一个工作日', trigger: 'change' }
                ],
                clockRange: [
                    { required: true, message: '请输入打卡范围(m)', trigger: 'blur' },
                    {                        validator: function (rule, value, callback) {
                            if (value < 50 || value > 1000) {
                                callback(new Error('打卡范围50m-1000m之间'));
                            } else {
                                callback();
                            }
                        }, trigger: 'blur'                    }
                ],
                startTime: [{ required: true, message: '请选择开始时间', trigger: 'blur' },
                { type: 'date', required: true, message: '请选择开始时间', trigger: 'change' }
                ],
                endTime: [
                    { required: true, message: '请选择结束时间', trigger: 'blur' },
                    { type: 'date', required: true, message: '请选择结束时间', trigger: 'change' }
                ],
            }
        }
    },
    mounted: function () {
        this.testMsg = localStorage.getItem('token') //获取localStorage
        this.orgId = localStorage.getItem('orgId') //获取localStorage
        console.log(this.testMsg)
        this.loadmap(),
            this.NewMath()
    },
    methods: {
        //地图函数
        loadmap() {
            var map = new AMap.Map('container', {
                zoom: 16,
                resizeEnable: true,
                keyboardEnable: false
                //                scrollWheel: false
            })
            map.plugin(['AMap.ToolBar', 'AMap.Scale'], (() => {
                map.addControl(new AMap.ToolBar())//放大加号
                map.addControl(new AMap.Scale())//缩小减号
            }));

            map.plugin(['AMap.Geolocation'], (() => {

                let Geolocation = new AMap.Geolocation({
                    enableHighAccuracy: true, //  是否使用高精度定位，默认:true
                    timeout: 1000, //  超过10秒后停止定位，默认：无穷大
                    maximumAge: 0, // 定位结果缓存0毫秒，默认：0
                    convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                    showButton: true, //  显示定位按钮，默认：true
                    buttonPosition: 'LB',  // 定位按钮停靠位置，默认：'LB'，左下角
                    buttonOffset: new AMap.Pixel(10, 20), //  定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                    showMarker: true, //  定位成功后在定位到的位置显示点标记，默认：true
                    showCircle: true, //  定位成功后用圆圈表示定位精度范围，默认：true
                    panToLocation: true,  //  定位成功后将定位到的位置作为地图中心点，默认：true
                    zoomToAccuracy: true,  //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                })

                map.addControl(Geolocation)
                Geolocation.getCurrentPosition()

                AMap.event.addListener(Geolocation, 'complete', (result) => {
                    map.setCenter(result.position);
                    console.log(result.position)
                    const position = [result.position.lng, result.position.lat]   //  返回定位信息
                    lng = result.position.lng;
                    lat = result.position.lat;
                    lnglatXY = position
                    console.log(lng, lat)
                })
                AMap.event.addListener(Geolocation, 'error', (result) => {   //  返回定位出错信息 
                    console.log(result)
                    alert("定位失败")
                })
            }));
            var windowsArr = [];
            var marker = [];
            map.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch'], function () {
                var autoOptions = {
                    city: "北京", //城市，默认全国
                    input: "pickerInput"//使用联想输入的input的id
                };
                const autocomplete = new AMap.Autocomplete(autoOptions);
                var placeSearch = new AMap.PlaceSearch({
                    city: '北京',
                    map: map
                })
                AMap.event.addListener(autocomplete, "select", function (e) {
                    //TODO 针对选中的poi实现自己的功能
                    console.log(e)
                    placeSearch.setCity(e.poi.adcode);
                    placeSearch.search(e.poi.name)
                });
            });

            //拖动定位
            AMapUI.loadUI(['misc/PositionPicker'], function (PositionPicker) {
                var positionPicker = new PositionPicker({
                    mode: 'dragMap',
                    map: map,
                });
                positionPicker.on('success', function (positionResult) {   //返回拖动定位成功消息
                    lng = positionResult.position.lng;
                    lat = positionResult.position.lat;
                    console.log(lng, lat)
                    console.log(positionResult)
                });
                positionPicker.on('fail', function (positionResult) {      //返回拖动定位失败消息 
                    alert(positionResult)
                });
                positionPicker.start();
            });
        },

        //获取默认位置信息
        NewMath() {
            var url = '/api/compm/configure'
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
                console.log(12311111111)
                if (response.status == 200) {
                    console.log(response.data)
                    this.goData = response.data
                    this.name = this.goData.name
                    this.clockRange = this.goData.clockRange
                    this.DescriPtion = this.goData.description
                    this.address = this.goData.id
                    var d = "0" + this.goData.startWorkH;
                    var h = "0" + this.goData.startWorkM;
                    this.ruleForm.startTime =d.substring(d.length - 2, d.length) + `:` + h.substring(h.length - 2, h.length)
                    var d = "0" + this.goData.finishWorkH;
                    var h = "0" + this.goData.finishWorkM;
                    this.ruleForm.endTime =d.substring(d.length - 2, d.length) + `:` + h.substring(h.length - 2, h.length)
                    this.ruleForm.clockRange = response.data.clockRange
                    this.ruleForm.type = response.data.workingDaysInWeek
                    console.log(this.ruleForm.type)
                    this.webks = response.data.workingDaysInWeek[0]
                    this.webko = response.data.workingDaysInWeek[1]
                    this.webkm = response.data.workingDaysInWeek[2]
                    this.webkt = response.data.workingDaysInWeek[3]
                    this.webkfor = response.data.workingDaysInWeek[4]
                    this.webkf = response.data.workingDaysInWeek[5]
                    this.webkw = response.data.workingDaysInWeek[6]
                }
            })
        },

        submitForm(ruleForm) {
            this.$refs[ruleForm].validate((valid) => {
                if (valid) {
                    const starttimes = this.ruleForm.startTime.split(":")
                    const starttimesH = parseFloat(starttimes[0])
                    const starttimesM = parseFloat(starttimes[1])
                    const endtimes = this.ruleForm.endTime.split(":")
                    const endtimesH = parseFloat(endtimes[0])
                    const endtimesM = parseFloat(endtimes[1])
                    if (lng && lat) {
                        if (this.clockRange >= 50 && this.clockRange <= 1000) {
                            var url = '/api/compm/configure'
                            var body = { id: this.address, name: this.name = 'chengdushi', clockLng: parseFloat(lng), clockLat: parseFloat(lat), clockRange: parseFloat(this.ruleForm.clockRange), startWorkH: starttimesH, startWorkM: starttimesM, finishWorkH: endtimesH, finishWorkM: endtimesM, workingDaysInWeek: [this.webks, this.webko, this.webkm, this.webkt, this.webkfor, this.webkf, this.webkw], description: this.DescriPtion }
                            var data = JSON.stringify(body);
                            console.log(data)
                            let httpDefaultOpts = { // http默认配置
                                method: "put",
                                url: url,
                                timeout: 10000,
                                data: data,
                                headers: {
                                    'X-Requested-With': 'XMLHttpRequest',
                                    'Auth': this.testMsg,
                                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                                    org: this.orgId
                                }
                            }
                            this.$axios(httpDefaultOpts).then((response) => {
                                if (response.data.suc == true) {
                                    this.$message({
                                        type: 'success',
                                        message: '更新成功!'
                                    });
                                } else {
                                    this.$message({
                                        type: 'info',
                                        message: response.data.reason
                                    });
                                }
                            }).catch((err) => {
                                console.log(err)
                                //alert("获取位置失败!请重新获取")
                            })
                        } else {
                            this.$dialog.toast({
                                mes: '范围为50-1000米!',
                                timeout: 1500,
                                icon: 'error',
                            });
                            this.clockRange = ''
                        }

                    } else {
                        this.$dialog.toast({
                            mes: '定位失败,请重新定位!',
                            timeout: 1500,
                            icon: 'error',
                        });
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    }
}
</script>
<style scoped>
h1 {
  font-weight: normal;
  margin: 0;
}
.container1 {
  width: 98%;
  height: 400px;
  margin: 20px auto;
  position: relative;
}
#pickerBox {
  position: absolute;
  z-index: 10;
  top: 50px;
  right: 30px;
  width: 300px;
}

#pickerInput {
  width: 200px;
  padding: 5px 5px;
}

#poiInfo {
  background: #fff;
}

.amap_lib_placeSearch .poibox.highlight {
  background-color: #cae1ff;
}

.amap_lib_placeSearch .poi-more {
  display: none !important;
}
.mbfather {
  position: relative;
}
.mblabel {
  width: 15px;
  height: 96%;
  background-color: #ffffff;
  position: absolute;
  margin-top: 1px;
  top: 0;
  left: 189px;
}
</style>
