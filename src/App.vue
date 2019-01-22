<template>
  <div id="app">
<!--挂载组件渲染到页面-->
    <router-view></router-view>  
  </div>
</template>

<script>
//import 引入文件(顺序必须先引入 在注册 最后挂载渲染)
//import "babel-polyfill"    
//注册组件    
export default {
  name: 'app',
}
//}
</script>

<style>
    *{
        padding: 0;
        margin: 0;
    }
/*
.el-button--primary{
    background-color: #000000;
    border: 0;
}    
*/
    #app{
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        font-family: "PingFang SC","Hiragino Sans GB","Microsoft YaHei Light","Microsoft YaHei","WenQuanYi Micro Hei",sans-serif;
    }
</style>
