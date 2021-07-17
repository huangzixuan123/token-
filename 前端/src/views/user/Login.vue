<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">登录系统</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="用户名">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="密码" v-model="param.password" @keyup.enter.native="submitForm()">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                    <router-link to="reg"><el-button type="info" class="reg-but">注册</el-button></router-link>
                </div>

                <el-button @click="fileBtn">跳转</el-button>
                <el-button @click="fileBtn2">获取code</el-button>
                <el-button @click="fileBtn3">使用</el-button>
                <!-- <p class="login-tips">Tips : 用户名和密码随便填。</p> -->
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data: function() {
        return {
            param: {
                username: '',
                password: ''
            },
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
            },
            user: []
        };
    },
    methods: {
        //////////////////////////微信授权登录（转到header那也有东西）////////////////////////////////////////////////////////////////////////////
        fileBtn() {
            window.location.href = 'http://47.112.182.67:3003/user/code';
        },
        fileBtn3() {
            // this.$message.success(window.sessionStorage.getItem('user'));
            this.$router.push('/');
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
                function(error, response, body) {
                    // if (response.statusCode == 200) {
                    let data = JSON.parse(body);
                    let access_token = data.access_token;
                    let openid = data.openid;
                    request.get(
                        {
                            url: 'https://api.weixin.qq.com/sns/userinfo?access_token=' + access_token + '&openid=' + openid + '&lang=zh_CN'
                        },
                        function(error, response, body) {
                            var userinfo = JSON.parse(body);
                            console.log(userinfo);
                            window.sessionStorage.setItem('user2', userinfo.headimgurl);
                            window.sessionStorage.setItem('user', userinfo.nickname);
                            // window.sessionStorage.setItem('listview', userinfo.nickname);
                        }
                    );
                }
                // this.$message.success(window.sessionStorage.getItem('listview') + '')
            );
            this.$router.push('/');
        },
        //////////////////////////////////////////////////////////////////////////////////////////////////////
        async submitForm() {
            this.$refs.login.validate(async valid => {
                if (valid) {
                    let res = await this.axios({
                        path: '/user/login',
                        method: 'POST',
                        data: {
                            name: this.param.username,
                            pwd: this.param.password
                        }
                    });
                    if (res.check === 0) return this.$message.error('请输入正确的用户名和密码');
                    // let r = JSON.stringify(res);
                    window.sessionStorage.setItem('name', res.name);
                    window.sessionStorage.setItem('token', res.token);

                    this.$message.success('登录成功');
                    // 显示
                    this.$message.success(JSON.stringify(res));

                    this.$router.push('/');
                } else {
                    this.$message.error('请输入用户名和密码');
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    }
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 450px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 40px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
.reg-but {
    margin: 0;
}
.ms-login >>> .el-input--small .el-input__inner {
    height: 40px;
}
</style>
