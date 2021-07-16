<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar></v-sidebar>
        <!-- 隐藏侧边栏扩展出来的空白，:class="{'content-collapse':collapse}"负责隐藏 -->
        <div class="content-box" :class="{'content-collapse':collapse}">
            <v-tags></v-tags>
            <div class="content">
                <transition name="move" mode="out-in">
                    <keep-alive :include="tagsList">
                        <router-view v-if="isRouterAlive"></router-view>
                    </keep-alive>
                </transition>
                <el-backtop target=".content"></el-backtop>
            </div>
        </div>
    </div>
</template>

<script>
//引入页面
import vHead from './Header.vue';
import vSidebar from './Sidebar.vue';
import vTags from './Tags.vue';

import bus from './bus';
export default {
    //局部刷新
    //父组件中通过provide来提供变量，在子组件中通过inject来注入变量。
    provide(){
        return{
            reload: this.reload,
        }
    },
    data() {
        return {
            //局部刷新
            isRouterAlive:true,

            tagsList: [],
            collapse: false
        };
    },
    components: {
        vHead,
        vSidebar,
        vTags
    },
    created() {
        bus.$on('collapse-content', msg => {
            this.collapse = msg;
        });

        // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
        bus.$on('tags', msg => {
            let arr = [];
            for (let i = 0, len = msg.length; i < len; i++) {
                msg[i].name && arr.push(msg[i].name);
            }
            this.tagsList = arr;
        });
        
    },
    methods:{
        //局部刷新
        reload(){
            this.isRouterAlive = false;
	        this.$nextTick(function () {
	            this.isRouterAlive = true; 
	        })
        },
    }
};
</script>
