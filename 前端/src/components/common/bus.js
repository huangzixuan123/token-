import Vue from 'vue';

// 使用 Event Bus
const bus = new Vue();

export default bus;

// bus.$on（发射某值）bus.$emit（接收某值引发事件），
// import bus from './bus'，import bus from '../common/bus'好像没区别;
//created（）{}方法 意思生成网页前先调取数据；mounted则是生成网页后再调取数值
//     @/ 表示src目录下      ./ 表示当前目录下      ../ 表示父级目录