<template>
    <div id="app">
        <router-view  ></router-view>
    </div>
</template>
<style>
/*删掉 tags会出问题 */
    @import "./assets/css/main.css";       
    /*深色主题*/
    @import "./assets/css/color-dark.css"; 
    /* @import "./assets/css/theme-green/index.css";    */
        /* 绿色主题 */
</style>
<script>
//局部刷新实现不了 父组件在home.js,待续：测试这个页面作用，局部刷新是否有效
// export default {
//     name:"app",
//     //局部刷新有关
//     provide(){
//         return{
//             reload: this.reload
//         }
//     },
//     data(){
//         return{
//             isRouterAlive:true
//         }
//     },
//     methods:{
//         //局部刷新
//         reload1(){
//             this.isRouterAlive = false;
//         },
//         reload2(){
//             this.isRouterAlive = true;
//         },
//     }
// }
</script>
