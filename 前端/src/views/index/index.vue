<template>
    <div>
        <!-- <el-button @click="fileBtn">跳转</el-button>
        <el-button @click="fileBtn2">获取code</el-button>

        <el-button @click="fileBtn3">使用</el-button> -->

        <!-- //////////////////////上背景页面////////////////////////////////////////////////////////////////// -->
        <!-- <div class="headerBar">
            <header :style="{ background: 'url(' + backgroundImage + ')' }">
                <div class="header-inner">
                    <div class="auther">
                        <div>
                            <a href="/" class="brand">
                                <span class="site-title">超市存销系统</span>
                            </a>
                        </div>
                    </div>
                    <nav>
                        <ul class="menu">
                            <li class="menu-item">
                                <router-link to="/">
                                    <font-awesome-icon :icon="['fas', 'home']" />
                                    <span>首页</span>
                                </router-link>
                            </li>
                            <li class="menu-item">
                                <router-link to="/shelflist">
                                    <font-awesome-icon :icon="['fas', 'tags']" />
                                    <span>货架列表</span>
                                </router-link>
                            </li>
                            <li class="menu-item">
                                <router-link to="/archives">
                                    <font-awesome-icon :icon="['fas', 'archive']" />
                                    <span>归档</span>
                                </router-link>
                            </li>
                            <li class="menu-item">
                                <router-link to="/about">
                                    <font-awesome-icon :icon="['fas', 'user']" />
                                    <span>关于</span>
                                </router-link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>
        </div> -->
        <!-- //////////////////////原来页面////////////////////////////////////////////////////////////////// -->
        <div class="index-title">欢迎进入仓库货架管理系统</div>
        <!-- <div>
            <img :src="emptyGif" class="emptyGif" />
        </div> -->
        <!-- //////////////////////字体库////////////////////////////////////////////////////////////////// -->
        <footer>
            <div class="footer-inner">
                <!-- 字体库 font-awesome-icon :icon="['fas', 'copyright']" /-->
                <font-awesome-icon :icon="['fas', 'copyright']" />
                <span>2020.11.01 - {{ getFullYear }}.{{ getMonth }}.{{ getDate }}</span>
                |
                <!-- 字体库 font-awesome-icon :icon="['fas', 'heart']" /-->
                <font-awesome-icon :icon="['fas', 'heart']" />
                <span>黄梓轩</span>
            </div>
        </footer>
    </div>
</template>
<script>
export default {
    data() {
        return {
            getFullYear: '',
            getMonth: '',
            getDate: '',
            //上背景页面
            backgroundImage: require('../../assets/img/header-bg.jpg'),
            msg: 'headerBar',
            emptyGif: 'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3'
        };
    },
    mounted() {
        this.getFullYear = new Date().getFullYear();
        this.getMonth = new Date().getMonth() + 1;
        this.getDate = new Date().getDate();
    },
    methods: {
        fileBtn() {
            window.location.href = 'http://47.112.182.67:3003/user/code';
        },
        fileBtn3() {
            this.$message.success(window.sessionStorage.getItem('listview') + '');
        },
        async fileBtn2() {
            var request = require('request');
            var AppID = 'wx726f1d93af637d05';
            var AppSecret = '01b843e403456b727940579f29e05f2f';
            this.code = window.location.href + '';
            this.code = this.code.replace(/=/g, ' ');
            this.code = this.code.replace(/&/g, ' ');
            this.code = this.code.split(' ');
            var code = this.code[1];
            this.$message.success(this.code[1] + '');
            request.get(
                {
                    url:
                        'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' +
                        AppID +
                        '&secret=' +
                        AppSecret +
                        '&code=' +
                        code +
                        '&grant_type=authorization_code'
                    // url:'https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx726f1d93af637d05&secret=001aOv100eCETK1XTX0008xJd32aOv1n&code=011vjQFa1xwvfA08q5Ja1fFbic2vjQFW&grant_type=authorization_code'
                },
                function (error, response, body) {
                    // if (response.statusCode == 200) {
                    let data = JSON.parse(body);
                    let access_token = data.access_token;
                    let openid = data.openid;
                    request.get(
                        {
                            url: 'https://api.weixin.qq.com/sns/userinfo?access_token=' + access_token + '&openid=' + openid + '&lang=zh_CN'
                        },
                        function (error, response, body) {
                            var userinfo = JSON.parse(body);
                            console.log(userinfo);
                            window.sessionStorage.setItem('listview', userinfo.nickname);
                        }
                    );
                    // }
                }
            );
            this.$message.success(nickname + '');
            // this.$route.query.code
        }
    }
};
</script>


<style  lang="less" scoped>
////////////善良的乌贼那行 居中变灰色//////////////////////
.footerBar {
    position: relative;
}
footer {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    min-width: 350px;
    font-size: 14px;
    color: #999;
    .footer-inner {
        text-align: center;
        margin: 5px 0;
    }
}

////////////上背景页面//////////////////////
header {
    width: 100%;
    height: 325px;
    .header-inner {
        margin: 0 auto;
        padding: 100px 0 70px;
        width: 700px;
        height: 100%;
        position: relative;
    }
    .auther {
        text-align: center;
        color: #fff;
        font-size: 30px;
    }
    .brand {
        position: relative;
        display: inline-block;
        padding: 0 80px;
        line-height: 36px;
    }
    .site-title {
        position: relative;
        top: -50px;
        // opacity: 0;
        display: inline-block;
        vertical-align: top;
        line-height: 56px;
        color: #f5f5f5;
        font-weight: normal;
        animation: down 0.2s linear;
        animation-fill-mode: both;
        &:hover {
            transform: scale(1.2);
            transition: all 1s;
        }
    }
    .menu {
        margin: 20px auto 0;
        background: rgba(255, 255, 255, 0.65);
        width: 450px;
        height: 64px;
        display: flex;
        padding: 10px 50px;
        .menu-item {
            //空间平分
            flex: 1;
            list-style-type: none;
        }
        a {
            color: #333;
            font-size: 16px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            height: 100%;
            position: relative;
            //   top: -30px;
            //   opacity: 0;
            animation: down 0.3s 0.2s linear;
            animation-fill-mode: both;
            svg {
                opacity: 0.8;
            }
            span {
                position: relative;
                opacity: 0.8;
                &::before {
                    content: '';
                    position: absolute;
                    width: 100%;
                    height: 1px;
                    bottom: -5px;
                    left: 0;
                    background-color: #333;
                    visibility: hidden;
                    transform: scaleX(0);
                    transition: all 0.2s ease-in-out;
                }
            }
            &:hover {
                svg {
                    opacity: 1;
                }
                span {
                    opacity: 1;
                    &::before {
                        visibility: visible;
                        transform: scaleX(1);
                    }
                }
            }
        }
    }
    .menu-small {
        position: absolute;
        top: 10px;
        left: 10px;
        opacity: 0;
    }
}
@media screen and(max-width: 768px) {
    header {
        min-width: 350px;
        height: 260px;
        .header-inner {
            width: auto;
        }
        nav {
            width: 80%;
            margin: 0 auto;
            .menu {
                width: 100%;
            }
        }
    }
}

/////////////原来页面/////////////
.index-title {
    font-size: 26px;
    text-align: center;
    padding: 80px;
    color: #409eff;
}
</style>
