<template>
    <div>
        <div>
            <div class="add-title">加 入 仓 库</div>
            <div class="add-input-box">
                <el-form ref="form" :model="list" label-width="80px" label-position="left" :rules="rules" :status-icon="true">
                    <el-form-item label="条形码" prop="codeUrl">
                        <el-input v-model="list.codeUrl" style="width: 213px" placeholder="请输入" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="箱码" prop="boxcodeUrl">
                        <el-input v-model="list.boxcodeUrl" style="width: 213px" placeholder="请输入" clearable></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <el-button type="primary" round class="add-submit" @click="submit">确认添加</el-button>
        </div>
        <div class="scan">
            <div id="bcid" v-if="a === true"></div>
            <footer>
                <el-button @click="startRecognize" type="warning">1.创建控件</el-button>
                <!-- <button @click="startScan">2.开始扫描</button>
                <button @click="cancelScan">3.结束扫描</button> -->
                <el-button @click="closeScan" type="warning">4.关闭控件</el-button>
            </footer>
        </div>
    </div>
</template>

<script>
let scan = null;

export default {
    data() {
        return {
            //表单初始化，''代表表单内为空，[]代表下拉选框不选
            classList: [],
            list: {
                codeUrl: '',
                boxcodeUrl: ''
            },
            rules: {
                codeUrl: [{ required: true, message: '请输入', trigger: 'blur' }],
                boxcodeUrl: [{ required: true, message: '请输入', trigger: 'blur' }]
            },
            a: false,
            NOWDATE: this.dayjs().format('YYYY-MM-DD')
        };
    },
    methods: {
        async studentGET() {
            let res = await this.axios({
                path: '/user/planlist2'
            });
            this.classList = res;
        },
        //创建扫描控件
        startRecognize() {
            this.a = true;

            let that = this;
            if (!window.plus) return;
            scan = new plus.barcode.Barcode('bcid');
            scan.onmarked = onmarked;

            function onmarked(type, result, file) {
                switch (type) {
                    case plus.barcode.QR:
                        type = 'QR';
                        break;
                    case plus.barcode.EAN13:
                        type = 'EAN13';
                        break;
                    case plus.barcode.EAN8:
                        type = 'EAN8';
                        break;
                    default:
                        type = '其它' + type;
                        break;
                }
                result = result.replace(/\n/g, ''); //全文搜索换行跟换为无
                // that.codeUrl = result;
                // alert(result);
                // that.closeScan();
                // scan.start();
                result = result.replace(/\n/g, ''); //全文搜索换行跟换为无
                if (that.list.codeUrl == '') {
                    that.list.codeUrl = result;
                    that.list.boxcodeUrl = '';
                    alert(result);
                    scan.start();
                } else {
                    that.list.boxcodeUrl = result;
                    that.submit();
                    that.closeScan();
                }
            }
            scan.start();
        },
        //开始扫描
        startScan() {
            if (!window.plus) return;
            scan.start();
        },
        //关闭扫描
        cancelScan() {
            if (!window.plus) return;
            scan.cancel();
        },
        //关闭条码识别控件
        closeScan() {
            this.a = false;
            if (!window.plus) return;
            scan.close();
        },
        async submit() {
            this.$refs['form'].validate(async (valid) => {
                if (!valid) return;
                let { list } = this;

                let result = await this.axios({
                    path: '/user/CGJHsearch3',
                    method: 'get',
                    data: {
                        barcode: list.codeUrl+''
                    }
                });
                this.$message.error(result[0].specs+'');

                this.axios({
                    path: '/user/CKadd1',
                    method: 'POST',
                    data: {
                        stock: result[0].specs+'',
                        CKbarcode: list.codeUrl+'',
                        boxcode: list.boxcodeUrl+'',
                        intime: this.NOWDATE,
                    }
                })
                    .then(() => {
                        this.$message.success('成功进仓');
                        this.$refs['form'].resetFields();
                    })
                    .catch((err) => {
                        this.$message.error(err.message);
                    });
            });
        }
    },
    created() {
        this.studentGET();
    }
};
</script>
<style lang="less">
.scan {
    // height: 100%;
    #bcid {
        // width: 100%;
        // position: fixed;//全覆盖
        position: absolute;

        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        text-align: center;
        // color: #fff;
        // background: #ccc;
    }
    footer {
        position: absolute;
        left: 0;
        bottom: 1rem;
        height: 2rem;
        line-height: 2rem;
        z-index: 2;
    }
}
</style>
<style scoped>
.add-title {
    text-align: center;
    padding: 20px 0 40px;
    font-size: 26px;
    color: #409eff;
    font-weight: bold;
    letter-spacing: 5px;
}
.add-input-box {
    width: fit-content;
    margin: 0 auto;
}
.add-submit {
    width: 30%;
    display: block;
    margin: 20px auto;
}
</style>