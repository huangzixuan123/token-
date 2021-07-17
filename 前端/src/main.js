import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import "./utils/axios" //顶端有关，head
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import './assets/css/icon.css'; //学生管理的图标
import 'babel-polyfill'; //部分垃圾网站不兼容es6，这个就是解决这个问题的
// import echarts from 'echarts'
// Vue.prototype.$echarts = echarts



//不知道是否可用，后期删删看
import XLSX from 'xlsx'
Vue.prototype.XLSX = XLSX
// import Blob from './Excel/Blob.js'
// import Export2Excel from './Excel/Export2Excel.js'

Vue.config.productionTip = false; //解决无用警告




import {
    library
} from '@fortawesome/fontawesome-svg-core'
import {
    fas
} from '@fortawesome/free-solid-svg-icons'
import {
    far
} from '@fortawesome/free-regular-svg-icons'
import {
    fab
} from '@fortawesome/free-brands-svg-icons'
import {
    FontAwesomeIcon,
    FontAwesomeLayers,
    FontAwesomeLayersText
}
from '@fortawesome/vue-fontawesome'
library.add(fas, far, fab)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('font-awesome-layers', FontAwesomeLayers)
Vue.component('font-awesome-layers-text', FontAwesomeLayersText)


Vue.use(ElementUI, {}); //使用主题

//日期计算
import dayjs from 'dayjs';
Vue.prototype.dayjs = dayjs;
//使用钩子函数对路由进行权限跳转

let JSONuser = JSON.parse(window.sessionStorage.getItem("user"));
router.beforeEach((to, from, next) => {
    console.log(to.path)
    let user = window.sessionStorage.getItem("token");

    if (user && to.path === '/login') return next('/');
    if (user && to.path === '/reg') return next('/');
    if (!user && to.path === '/reg') return next();
    if (!user && to.path !== '/login') return next('/login');
    next()
    // role = JSONuser.role;
    if (to.meta.roles.includes(JSONuser.role)) {
        next() //放行
    } else {
        next({
            path: "/404"
        }) //跳到404页面
        // this.reload()
    }

});




new Vue({
    router,
    render: h => h(App)
}).$mount('#app');