<template>
    <div class="sidebar">
        <!-- <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
        > </el-menu> -->
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem, i) in subItem.subs" :key="i" :index="threeItem.index">{{
                                    threeItem.title
                                }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">{{ subItem.title }}</el-menu-item>
                            <!-- <el-menu-item :index="subItem.index" :key="subItem.index">{{ subItem.title }}</el-menu-item> -->
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from '../common/bus';
export default {
    data() {
        return {
            collapse: false,
            items: [
                {
                    icon: 'el-icon-lx-home',
                    index: 'index',
                    title: '首页'
                },
                {
                    icon: 'el-icon-shopping-cart-2',
                    index: '1',
                    title: '供需清单',
                    subs: [
                        {
                            index: 'supplierlist',
                            title: '供应商清单'
                        },
                        {
                            index: 'productlist',
                            title: '采购清单'
                        }
                    ]
                },
                {
                    icon: 'el-icon-lx-home',
                    index: '2',
                    title: '仓储',
                    subs: [
                        {
                            index: 'warehouselist',
                            title: '仓库'
                        },
                        {
                            index: 'white',
                            title: '货架'
                        }
                    ]
                },
                {
                    icon: 'el-icon-tickets',
                    index: '3',
                    title: '计划及实施',
                    subs: [
                        {
                            index: 'upperplan',
                            title: '上架计划'
                        },
                        {
                            index: 'plan',
                            title: '采购计划'
                        }
                    ]
                },
                {
                    icon: 'el-icon-sell',
                    index: 'selllist',
                    title: '售出'
                },
                {
                    icon: 'el-icon-setting',
                    index: '4',
                    title: '设置',
                    subs: [
                        {
                            index: 'shelfadd',
                            title: '警告设置'
                        },
                            {
                            index: 'role',
                            title: '账户权限'
                        },
                    ]
                },
                // ////////////////////////
                // {
                //     icon: 'el-icon-s-shop',
                //     index: '3',
                //     title: '货架',
                //     subs: [
                //         {
                //             index: 'shelfadd',
                //             title: '警告设置'
                //         },
                //         {
                //             index: 'shelflist',
                //             title: '货架列表'
                //         },
                //         {
                //             index: 'white',
                //             title: '实际货架'
                //         },
                //         {
                //             index: 'upperplan',
                //             title: '上架模块'
                //         },
                //         {
                //             index: 'upshelf',
                //             title: '上架操作(放弃)'
                //         },
                //         {
                //             index: 'returnwarehouse',
                //             title: '返回仓库'
                //         }
                //     ]
                // },
                // {
                //     icon: 'el-icon-s-home',
                //     index: '5',
                //     title: '仓库',
                //     subs: [
                //         {
                //             index: 'warehouselist',
                //             title: '仓库列表'
                //         }
                //     ]
                // },
                // {
                //     icon: 'el-icon-s-order',
                //     index: '4',
                //     title: '商品需求管理',
                //     subs: [
                //         {
                //             index: 'productlist',
                //             title: '采购清单'
                //         },
                //         {
                //             index: 'plan',
                //             title: '采购计划'
                //         }
                //     ]
                // },
                // {
                //     icon: 'el-icon-s-custom',
                //     index: '1',
                //     title: '供应商',
                //     subs: [
                //         {
                //             index: 'supplierlist',
                //             title: '供应商列表'
                //         },
                //         {
                //             index: 'text',
                //             title: '进仓模块'
                //         }
                //     ]
                // },
                // {
                //     icon: 'el-icon-lx-cascades',
                //     index: '2',
                //     title: '学生管理',
                //     subs: [
                //         {
                //             index: 'studentAdd',
                //             title: '添加学生'
                //         },
                //         {
                //             index: 'studentList',
                //             title: '学生列表'
                //         }
                //     ]
                // },
                // {
                //     icon: 'el-icon-edit',
                //     index: 'perAdd',
                //     title: '预备使用仓库'
                // },
                {
                    icon: 'el-icon-pie-chart',
                    index: 'course',
                    title: '可视图表'
                }
            ]
        };
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', (msg) => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
    }
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: auto;
}

.sidebar-el-menu:not(.el-menu--collapse) {
    width: 200px;
}
.sidebar > ul {
    height: 100%;
}
</style>
