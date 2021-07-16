import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router); //Router注入根目录使用

export default new Router({
    routes: [{
            path: '/',
            redirect: '/index' //第一次进入网页定向
        },
        {
            path: '/',
            component: () => import( /* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: {
                title: '家'
            },
            children: [{
                    path: '/index',
                    component: () => import( /* webpackChunkName: "dashboard" */ '@/views/index/index'),
                    meta: {
                        roles: ['SupperAdmin', 'Admin', 'CGY', 'SYY'],
                        title: '首页'
                    }
                },
                // {
                //     path: '/studentAdd',
                //     component: () => import( /* webpackChunkName: "dashboard" */ '@/views/student/add'),
                //     meta: {
                //         title: '添加学生'
                //     }
                // },
                // {
                //     path: '/studentList',
                //     component: () => import( /* webpackChunkName: "dashboard" */ '@/views/student/list'),
                //     meta: {
                //         title: '学生列表'
                //     }
                // },
                // {
                //     path: '/perAdd',
                //     component: () => import( /* webpackChunkName: "dashboard" */ '@/views/per/add'),
                //     meta: {
                //         title: '添加成绩'
                //     }
                // },
                // {
                //     path: '/perLook',
                //     component: () => import( /* webpackChunkName: "dashboard" */ '@/views/per/look'),
                //     meta: {
                //         title: '查看成绩'
                //     }
                // },
                {
                    path: '/change',
                    component: () => import( /* webpackChunkName: "dashboard" */ '@/views/user/change'),
                    meta: {
                        roles: ['SupperAdmin', 'Admin', 'CGY', 'SYY'],
                        title: '修改信息'
                    }
                },
                {
                    path: '/course',
                    component: () => import( /* webpackChunkName: "dashboard" */ '@/views/course/course'),
                    meta: {
                        roles: ['SupperAdmin', 'Admin'],
                        title: '可视化'
                    }
                },





                // {
                //     path: '/shelflist',
                //     component: () => import( /* webpackChunkName: "dashboard" */ '@/views/shelf/shelflist'),
                //     meta: {
                //         title: '货架列表'
                //     }
                // },
                // {
                //     path: '/404',
                //     component: () => import( /* webpackChunkName: "dashboard" */ '@/views/404'),
                //     meta: {
                //         roles: ['admin'],
                //         title: '404'
                //     }
                // },
                {
                    path: '/shelfadd',
                    component: () => import( /* webpackChunkName: "dashboard" */ '@/views/shelf/shelfadd'),
                    meta: {
                        roles: ['SupperAdmin', 'Admin'],
                        title: '警告设置'
                    }
                },
                {
                    path: '/supplierlist',
                    component: () => import( /* webpackChunkName: "dashboard" */ '@/views/supplier/supplierlist'),
                    meta: {
                        roles: ['SupperAdmin'],
                        title: '供应商列表'
                    }
                },
                // {
                //     //页面尾缀
                //     path: '/text',
                //     component: () => import( /* webpackChunkName: "dashboard" */ '@/views/supplier/text'),
                //     meta: {
                //         roles: ['admin'],
                //         title: '入仓操作'
                //     }
                // },
                {
                    //页面尾缀
                    path: '/white',
                    component: () => import( /* webpackChunkName: "dashboard" */ '@/views/shelf/white'),
                    meta: {
                        roles: ['SupperAdmin', 'Admin', 'CGY', 'SYY'],
                        title: '货架'
                    }
                },
                {
                    path: '/plan',
                    component: () => import( /* webpackChunkName: "dashboard" */ '@/views/product/plan'),
                    meta: {
                        roles: ['SupperAdmin', 'Admin', 'CGY'],
                        title: '采购计划'
                    }
                },
                {
                    path: '/productlist',
                    component: () => import( /* webpackChunkName: "dashboard" */ '@/views/product/productlist'),
                    meta: {
                        roles: ['SupperAdmin', 'Admin'],
                        title: '采购清单'
                    }
                },
                {
                    path: '/warehouselist',
                    component: () => import( /* webpackChunkName: "dashboard" */ '@/views/warehouse/warehouselist'),
                    meta: {
                        roles: ['SupperAdmin', 'Admin', 'CGY'],
                        title: '仓库'
                    }
                },
                {
                    path: '/upperplan',
                    component: () => import( /* webpackChunkName: "dashboard" */ '@/views/shelf/upperplan'),
                    meta: {
                        roles: ['SupperAdmin', 'Admin', 'CGY'],
                        title: '上架计划'
                    }
                },
                // {
                //     path: '/upshelf',
                //     component: () => import( /* webpackChunkName: "dashboard" */ '@/views/shelf/upshelf'),
                //     meta: {
                //         roles: ['admin'],
                //         title: '上架操作'
                //     }
                // },
                // {
                //     path: '/returnwarehouse',
                //     component: () => import( /* webpackChunkName: "dashboard" */ '@/views/shelf/returnwarehouse'),
                //     meta: {
                //         roles: ['admin'],
                //         title: '返回仓库'
                //     }
                // },
                {
                    path: '/selllist',
                    component: () => import( /* webpackChunkName: "dashboard" */ '@/views/sell/selllist'),
                    meta: {
                        roles: ['SupperAdmin', 'Admin', 'CGY'],
                        title: '售出'
                    }
                },
                {
                    path: '/role',
                    component: () => import( /* webpackChunkName: "dashboard" */ '@/views/setting/role'),
                    meta: {
                        roles: ['SupperAdmin'],
                        title: '角色管理'
                    }
                },
            ]
        },




        ////////////////////////////////////////////////////////////////////////////////////////////////                




        {
            path: '/login',
            component: () => import( /* webpackChunkName: "login" */ '@/views/user/Login'),
            meta: {
                title: '登录'
            }
        },
        {
            path: '/reg',
            component: () => import( /* webpackChunkName: "dashboard" */ '@/views/user/reg'),
            meta: {
                title: '注册'
            }
        },
        {
            path: '/404',
            component: () => import( /* webpackChunkName: "dashboard" */ '@/views/404'),
            meta: {
                title: '404'
            }
        },

    ]
});