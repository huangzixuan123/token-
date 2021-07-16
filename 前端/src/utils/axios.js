//1.引入vue
import Vue from 'vue'
//2.引入axios库
import axiosP from 'axios';
import {config} from '@/utils/config'//引入公用文件
axiosP.defaults.timeout =3000;//请求超时时间

axiosP.interceptors.request.use(//请求拦截
    config => {
        if (window.sessionStorage.getItem('token')){
            config.headers.Authorization = window.sessionStorage.getItem('token');
        } 
        return config;
    },

    err => {
        return Promise.reject(err);
    }

)

axiosP.interceptors.response.use(response => {//相应拦截
    return response;
}
    ,err=>{
        return Promise.reject(err)
    }
);

const axios=function({path,method="GET",data={}}={}){
    return new Promise((resolve,reject)=>{
        let datas={params:{...data}}
        if(method==="POST") datas={...{data}};
        axiosP({
            url:`${config.host}${path}`,
            method,
            ...datas
        }).then(res=>{
            if(res.data.state===0){
                console.log(JSON.stringify(res.data));
                resolve(res.data)
            }else{
                reject(res.data)
            }
        })
    })
};
let $img=(arr)=>{//图片地址处理
    return arr=arr.map(t=>config.img+t);
}



//5.将axios注册  Vue示例
Vue.prototype.axios=axios;
Vue.prototype.$img=$img;
//7.在main.js 引入axios即可


