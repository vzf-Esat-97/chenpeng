<template>
    <div class="workcenter">
        <!--头部导航-->
        <div id="headnav" class="head">
            <img v-show="calloff" src="../assets/images/htbtn.png">
            <img @click="calloff2" v-show="calloff1" src="../assets/images/htbtn.png">
            <p v-show="showDel1">近期上传</p>
            <p v-show="showDel2">已选择({{maths}})</p>
            <span v-show="MulChioce" @click="MulChoice(1)">多选</span>
            <span v-show="AllChioce" @click="MulChoice(2)">全选</span>
        </div>
        <div class="place"></div>

        <!--回收内容列表-->
        <div ref="backdels" class="content">
            <div v-for="item in listData" class="contentlist" :key="item">
                <div class="ChioceImg">
                    <img v-if='item.show == false' src="../assets/images/wxz.png">
                    <img v-if='item.show == true' src="../assets/images/xz.png">
                </div>
<!--                <transition :name='transtionNmae'>-->
                    <div :class={TurnRight:isTurnRight,TurnRight1:isTurnRight1} class="contentlist1">
                        <div style="position:relative;" @click="single(item)">
                            <div class="middlecont">
                                <img src='../assets/images/jqsc.png'>
                            </div>
                            <!--文件信息-->
                            <div class="Fileinfo">
                            <!--文件类型-->
                                <div class="FileType">
                                    <p>{{item.name}}</p>
                                </div>
                            <!--文件名称-->
                                <div class="FileType FileName">
                                    <p>{{item.filetype}}</p>
                                </div>
                            </div>
                        </div>
                        <div v-show="StopClick" class="StopClick"></div>
                        <img @click="Isrestore()" class="contentlistimg" src="../assets/images/gd.png">
                    </div>
<!--                </transition>    -->
            </div>
        </div>
        <!--清空按钮-->
        <div class="ClearBtn">
            <div v-show="ClearTwoBtn" class="ClearTwoBtn">
                <p @click="Removeall(1)" style="color:#eb3941">删除</p>
                <p @click="Removeall(2)" style="color:#34a1fb">移动到</p>
            </div>
        </div>

        <!--清空回收站弹框-->
        <yd-popup v-model="Claerpopup" position="center" width="80%">
            <div class="Claerpopup1">
                <div class="Delprompt">
                    <p class="Delprompt1">删除提示</p>
                    <p class="Delprompt2">是否删除已选项?</p>
                </div>
                <div class="ClaertwoBtn">
                    <div @click="Calloff()" class="leftbtn1">取消</div>
                    <div @click="Surebtn()" class="leftbtn">确定</div>
                </div>
            </div>
        </yd-popup>

        <!--是否测底删除某一项-->
        <yd-popup v-model="Claerbottom" position="bottom" width="100%">
            <div v-for="item in testData" class="contentlist bottomBorder" :key="item">
                <div class="middlecont">
                    <img src='../assets/images/jqsc.png'>
                </div>
                <!--文件信息-->
                <div class="Fileinfo">
                <!--文件类型-->
                    <div class="FileType">
                        <p>{{item.name}}</p>
                    </div>
                <!--文件名称-->
                    <div class="FileType FileName">
                        <p>{{item.filetype}}</p>
                    </div>
                </div>
                <img>
            </div>
            <!--还原-->
            <div @click="SurRestore(1)" class="Restore">重命名</div>
            <div @click="SurRestore(2)" class="Restore">移动到</div>
            <div @click="SurRestore(3)" class="Restore">复制到</div>
            <div @click="SurRestore(4)" class="Restore">删除</div>
            <div @click='Claerbottom=!Claerbottom' class="Abolish">取消</div>
        </yd-popup>

        <!--是否还原-->
        <yd-popup v-model="IsRestore" position="center" width="80%">
            <div class="Claerpopup1">
                <div class="Delprompt">
                    <p v-show="Hint" class="Delprompt1">信息提示</p>
                    <p v-show="Hint" class="Delprompt2">确认还原文件?</p>
                    <p v-show="Hint1" class="Delprompt1">删除提示</p>
                    <p v-show="Hint1" class="Delprompt2">是否彻底删除原文件?</p>
                </div>
                <div class="ClaertwoBtn">
                    <div @click="IsRestore=!IsRestore" class="leftbtn1">取消</div>
                    <div v-show='leftbtn' @click="Surebtn(1)" class="leftbtn">确定</div>
                    <div v-show='leftbtn1' @click="Surebtn(2)" class="leftbtn">确定</div>
                </div>
            </div>
        </yd-popup>

        <!--重命名-->
        <yd-popup v-model='Rename' position='center' width='80%'>
            <div class="Claerpopup1 Renamestyle">
                <div class="Delprompt Rename1">
                    <p class="Delprompt1">重命名</p>
                    <div class="Renameipt">
                        <input type="text" v-model='RenameVal' placeholder="请输入新名字">
                    </div>
                </div>
                <div class="ClaertwoBtn">
                    <div @click="Rename=!Rename" class="leftbtn1">取消</div>
                    <div @click="Surebtn()" class="leftbtn">确定</div>
                </div>
            </div>
        </yd-popup>

        <router-view></router-view>
    </div>
</template>

<script>
export default {
  name: 'workcenter',
  data () {
    return {
      lateData: 0,
      Claerpopup: false,
      Claerbottom: false,
      IsRestore: false,
      Hint: true,
      Hint1: false,
      leftbtn: true,
      leftbtn1: false,
      listData: [{name: '压缩文件.rar', filetype: '我的文档/工作报告/rar', show: false, id: 1}, {name: '压缩文件.rar', filetype: '我的文档2/工作报告/rar', show: false, id: 2}],
      testData: [{name: '压缩文件.rar', filetype: '我的文档/工作报告/rar', show: false, id: 1}],
      MulChioce: true, // 显示多选
      AllChioce: false, // 显示全选
      transtionNmae: 'ringht',
      isTurnRight: false,
      isTurnRight1: false,
      showDel1: true, // 显示清空回收站
      showDel2: false, // 显示已选择
      ClearTwoBtn: false, // 显示删除还原按钮
      maths: 0,
      NewAddarr: [],
      StopClick: true, // 控制是否可以点击
      calloff: true, // 显示返回上一个页面按钮
      calloff1: false, // 显示返回取消选择按钮
      Rename: false, // 重命名
      RenameVal: '' // 重命名的值
    }
  },
  mounted: function () {
    //        let height = document.body.clientHeight-document.getElementById("headnav").scrollHeight
    //        this.$refs.backdels.style.height=height+`px` console.log(document.body.clientHeight,this.$refs.backdels.style.height,document.getElementById("headnav").scrollHeight)
  },
  methods: {
    // 是否还原
    Isrestore () {
      this.Claerbottom = true
    },
    SurRestore (i) {
      // 移动 删除 复制
      if (i === 1) {
        this.Rename = true
      } if (i === 2) {
        console.log(2)
        this.IsRestore = true
        this.Hint = false
        this.Hint1 = true
        this.leftbtn = false
        this.leftbtn1 = true
      } if (i === 3) {
        console.log(3)
        this.IsRestore = true
        this.Hint = false
        this.Hint1 = true
        this.leftbtn = false
        this.leftbtn1 = true
      } if (i === 4) {
        console.log(4)
        this.IsRestore = true
        this.Hint = false
        this.Hint1 = true
        this.leftbtn = false
        this.leftbtn1 = true
      }
    },

    // 取消删除所有
    Calloff () {
      this.Claerpopup = false
    },
    // 确认删除所有
    Surebtn (i) {
      if (i === 1) {
        console.log('确认还原')
      } else {
        console.log('彻底删除')
      }
      this.Claerpopup = false
    },
    // 多选全选
    MulChoice (i) {
      if (i === 1 && this.listData.length !== 0) {
        this.MulChioce = false
        this.AllChioce = true
        this.isTurnRight = true
        this.isTurnRight1 = false
        this.showDel1 = false
        this.showDel2 = true
        this.ClearTwoBtn = true
        this.StopClick = false
        this.calloff1 = true
        this.calloff = false
      } else if (i === 2) {
        if (this.NewAddarr.length === 0) {
          this.listData.forEach((item) => {
            this.NewAddarr.push(item)
            item.show = true
          })
        } else {
          this.NewAddarr = []
          this.listData.forEach((item) => {
            this.NewAddarr.push(item)
            item.show = true
          })
          console.log('成都不等于0', this.NewAddarr.length)
        }
        this.maths = this.NewAddarr.length
        //                this.NewAddarr=this.listData
        //                this.MulChioce=true
        //                this.AllChioce=false
        //                this.showDel1=true
        //                this.showDel2=false
        //                this.ClearTwoBtn=false
      }
    },
    // 取消多项选择和全部选择
    calloff2 () {
      this.calloff1 = false
      this.calloff = true
      this.isTurnRight = false
      this.isTurnRight1 = true
      this.MulChioce = true
      this.AllChioce = false
      this.StopClick = true
      this.ClearTwoBtn = false
      this.showDel1 = true
      this.showDel2 = false
      this.maths = 0
      this.NewAddarr = []
      this.listData.forEach((item) => {
        item.show = false
      })
    },

    // 多选删除还原
    Removeall (i) {
      if (i === 1) {
        this.IsRestore = true
      } else {
        this.IsRestore = true
      }
    },
    // 列表单项选中
    single (item) {
      item.show = !item.show
      if (this.NewAddarr.length !== 0) {
        for (var i in this.NewAddarr) {
          if (item.id === this.NewAddarr[i].id) {
            this.NewAddarr.splice(i, 1)
          } else if (item.show === true) {
            this.NewAddarr.push(item)
          }
        }
      } else {
        this.NewAddarr.push(item)
      }
      this.maths = this.NewAddarr.length
    }
  },
  created () {

  }
}
</script>

<style scoped>
    .workcenter{
        width: 100%;
    }
    .head{
        width: 25rem;
        height: 3.33rem;
        background-color: #34a1fb;
        position: relative;
        position: fixed;
        display: flex;
        justify-content: space-between;
    }
    .head p{
        line-height: 3.33rem;
        font-size: 1.2rem;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0rem;
        color: #ffffff;
    }
    .head img{
        width: 1.5rem;
        height: 1.6rem;
        margin-top: .8rem;
        margin-left: 1rem;
    }
    .head span{
        line-height: 3.33rem;
        color: #ffffff;
        font-size: 1rem;
        margin-right: 1rem;
    }
    /*站位*/
    .place{
        width: 25rem;
        height: 3.33rem;
    }
    /*内容*/
    .content{
        width: 25rem;
/*        height: 10rem;*/
    }
    .contentlist{
        width: 25rem;
        height: 4rem;
        background-color: #ffffff;
        position: relative;
        overflow: hidden;
    }
    .bottomBorder{
        border-bottom: .03rem solid #d6d6d6;
    }
    .ChioceImg{
        width: 2rem;
        height: 2rem;
        padding: 1rem 1rem;
    }
    .ChioceImg img{
        width: 2rem;
    }
    .contentlist1{
        width: 25rem;
        height: 4rem;
        background-color: #ffffff;
        border-bottom: .07rem solid #d6d6d6;
        display: flex;
        justify-content: space-between;
        position: absolute;
        z-index: 33;
        top: 0;
    }
    .TurnRight{
        transition: all 0.5s ease;
        -webkit-transform: translateX(3rem);
        transform: translateX(3rem);
    }
    .TurnRight1{
        transition: all 0.5s ease;
        -webkit-transform: translateX(0rem);
        transform: translateX(0rem);
    }
    .middlecont{
        width: 2.4rem;
        height: 4rem;
        margin-left: 1rem;
        margin-right: .5rem;
        float: left;
    }
    .middlecont img{
        width: 2.4rem;
        height: 2.4rem;
        margin-top: .6rem;
    }
    .hszpstyle p{
        margin-right: 1rem;
    }
    .contentlistimg{
        width: 1.33rem;
        height: .3rem;
        margin-top: 1.8rem;
        margin-right: 1.2rem;
    }
    /*文件信息*/
    .Fileinfo{
        width: 18.4rem;
        height: 4rem;
        /* margin-top: .7rem; */
        float: left;
        padding-top: .7rem;
    }

    /*文件类型*/
    .FileType{
        width: 18.4rem;
        height: .97rem;
    }
    .FileType p{
        font-size: 1rem;
        color: #333333;
        text-align: left;
        padding-left: 0.4rem;
    }
    .FileName{
        margin-top: .47rem;
    }
    .FileName p{
        font-size: 0.8rem;
        color: #999999;
    }
    /*清空按钮*/
    .ClearBtn{
        width: 25rem;
        height: 3.33rem;
        position: fixed;
        bottom: 0;
        z-index: 99;
/*        background-color: #ffffff;*/
    }
    .ClearTwoBtn{
        width: 25rem;
        height: 3.33rem;
        background-color: #ffffff;
        display: flex;
        justify-content: space-between;
/*        line-height: 3.33rem;*/
        font-size: 1rem;
    }
    .ClearTwoBtn p{
        padding:1rem;
    }
    /*清除所有弹框*/
    .Claerpopup1{
        width: 20rem;
        height: 11rem;
        background-color: #ffffff;
    }
    .Delprompt{
        width: 20rem;
        height: 7.67rem;
        border-bottom: 1px solid #d6d6d6;
        border-radius: 0;
    }
    .Delprompt1{
        font-size: 1.2rem;
        color: #000000;
        padding-top: 2rem;
    }
    .Delprompt2{
        color: #333333;
        font-size: 1rem;
        margin-top: 1.43rem;
    }
    .ClaertwoBtn{
        width: 20rem;
        height: 3.33rem;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        display: flex;
        justify-content: space-between;
        line-height: 3.33rem;
    }
    .leftbtn1{
        width: 10rem;
        height: 3.33rem;
        font-size: 1.2rem;
        color: #333333;
        border-right: 1px solid #d6d6d6;
        border-radius: 0;
    }
    .leftbtn{
        width: 10rem;
        height: 3.33rem;
        font-size: 1.2rem;
        color: #34a1fb;
        border-radius: 0;
    }
    /*底部弹框*/
    .Restore{
        width: 100%;
        height: 3.33rem;
        background-color: #ffffff;
        text-align: left;
        line-height: 3.33rem;
        font-size: 1rem;
        color: #333333;
        padding-left: 1rem;
        border-bottom: 0.03rem solid #eeeeee;
    }
    .Abolish{
        width: 100%;
        height: 3.33rem;
        background-color: #ffffff;
        margin-top: .67rem;
        line-height: 3.33rem;
        font-size: 1.2rem;
        color: #333333;
    }
    /*阻止弹出点击*/
    .StopClick{
        width: 18.4rem;
        height: 4rem;
        position: absolute;
        top: 0;
/*        background-color: aquamarine;*/
        z-index: 99;
    }
    /*重命名*/
    .Renameipt{
        width: 16.8rem;
        height: 2rem;
        margin: auto;
        border: solid 0.07rem #d6d6d6;
        margin-top: 1.07rem;
    }
    .Renameipt input{
        width: 16.8rem;
        height: 2rem;
        padding-left: 5px;
        padding-right: 5px;
        border-spacing: inherit;
        border: 0;
    }
    .Renamestyle{
        height: 11.97rem;
    }
    .Rename1{
        height: 8.67rem;
    }
</style>
