<template>
    <div>
        <div>
            <div class="add-title">添 加 货 架</div>
            <div class="add-input-box">
                <el-form ref="form" :model="list" label-width="80px" label-position="left" :rules="rules" :status-icon="true">
                    <el-form-item label="计划" prop="upperplantime">
                        <el-select v-model="list.upperplantime" placeholder="请选择计划">
                            <el-option v-for="(t, i) in classList" :key="i" :label="t.upperplantime" :value="t.upperplantime"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="箱码" prop="boxcodeUrl">
                        <el-input v-model="list.boxcodeUrl" style="width: 213px" placeholder="请输入"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <el-button type="primary" round class="add-submit" @click="submit">确认添加</el-button>
        </div>
        <div class="scan">
            <div id="bcid" v-if="a === true"></div>
            <footer>
                <button @click="startRecognize">1.创建控件</button>
                <!-- <button @click="startScan">2.开始扫描</button>
                <button @click="cancelScan">3.结束扫描</button> -->
                <button @click="closeScan">4.关闭控件</button>
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
                boxcodeUrl: '',
                // upperplantime: ''
            },
            rules: {
                boxcodeUrl: [{ required: true, message: '请输入', trigger: 'blur' }],
                // upperplantime: [{ required: true, message: '请输入', trigger: 'blur' }]
            },
            a: false,
            getFullYear: '',
            getMonth: '',
            getDate: ''
        };
    },
    mounted() {
        this.getFullYear = new Date().getFullYear();
        this.getMonth = new Date().getMonth() + 1;
        if (this.getMonth < 10) {
            this.getMonth = '0' + this.getMonth + '';
        }
        this.getDate = new Date().getDate();
        if (this.getDate < 10) {
            this.getDate = '0' + this.getDate + '';
        }
    },
    methods: {
        async studentGET() {
            let res = await this.axios({
                path: '/user/Upperplantime'
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
                // result = result.replace(/\n/g, ''); //全文搜索换行跟换为无
                // if (that.list.codeUrl == '') {
                //     that.list.codeUrl = result;
                //     that.list.boxcodeUrl = '';
                //     alert(result);
                //     scan.start();
                // } else {
                that.list.boxcodeUrl = result;
                that.submit();
                // that.closeScan();
                // }
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

                // ！！！！！！！！！！！！！！！！以后这里设定为无计划换页面
                let result3 = await this.axios({
                    path: '/user/SearchUpperstatus',
                    method: 'get',
                    data: {
                        status: '进行中'
                    }
                });
                // if (result3.length === 0) {
                //     this.$message.error('当前没有进行中的上架计划');
                // } else {

                // }
                let result = await this.axios({
                    path: '/user/searchwarehousebarcode',
                    method: 'get',
                    data: {
                        boxcode: list.boxcodeUrl
                    }
                });
                //仓库有没有这个箱的商品
                if (result.length === 0) {
                    this.$message.error('当前仓库无箱号为' + list.boxcodeUrl + '的产品');
                } else {
                    let result2 = await this.axios({
                        path: '/user/searchupperproduct',
                        method: 'get',
                        data: {
                            upperproduct: result[0].productname + '',
                            upperplantime: result3[0].upperplantime
                        }
                    });
                    //上架计划有没有这个箱的商品
                    if (result2.length === 0) {
                        this.$message.error('当前进行的计划无' + result[0].productname + '产品');
                    } else {
                        //计划中是否存在箱号已出仓
                        if (result2[0].outputboxcode === null || result2[0].outputboxcode === '') {
                            this.$message.success('空');
                            var outputboxcode = list.boxcodeUrl;
                            // if (result2[0].uppernumber - result2[0].outputnumber >= result[0].stock) {
                            //     var outputnumber = result2[0].outputnumber + result[0].stock;
                            //     //稍后得处理库存的数目
                            // } else {
                            //     var outputnumber = result[0].stock;
                            // }

                            //锁定批次
                            this.axios({
                                path: '/user/changeupperinwarehousetime',
                                method: 'POST',
                                data: {
                                    // outputnumber:991,
                                    status: '进行中',
                                    upperproduct: result[0].productname + '',
                                    inwarehousetime: result[0].intime + ''
                                }
                            }).catch((err) => {
                                this.$message.error(err.message);
                            });
                            //计算计划已出仓数目
                            if (result2[0].uppernumber - result2[0].outputnumber >= result[0].stock) {
                                this.$message.success('总数>总数-系数');
                                var outputnumber = result2[0].outputnumber + result[0].stock;
                                var stock = 0;
                            } else {
                                var outputnumber = result2[0].uppernumber;
                                var stock = result[0].stock - result2[0].uppernumber + result2[0].outputnumber;
                            }
                        } else if (result2[0].outputboxcode.indexOf(list.boxcodeUrl) >= 0) {
                            this.$message.success('重复出仓，请确认无误后重试！');
                            var outputboxcode = result2[0].outputboxcode;
                        } else {
                            this.$message.success('其他');
                            var outputboxcode = list.boxcodeUrl + ',' + result2[0].outputboxcode;
                            if (result2[0].uppernumber - result2[0].outputnumber >= result[0].stock) {
                                // this.$message.success('总数>总数-系数');
                                var outputnumber = result2[0].outputnumber + result[0].stock;
                                //稍后得处理库存的数目
                                var stock = 0;
                            } else {
                                var outputnumber = result2[0].uppernumber;
                                var stock = result[0].stock - result2[0].uppernumber + result2[0].outputnumber;
                            }
                        }

                        this.axios({
                            path: '/user/changeupperout',
                            method: 'POST',
                            data: {
                                // outputnumber:991,
                            upperplantime: result3[0].upperplantime,
                                upperproduct: result[0].productname + '',
                                outputboxcode,
                                outputnumber
                            }
                        }).catch((err) => {
                            this.$message.error(err.message);
                        });

                        this.axios({
                            path: '/user/changewarehousestock',
                            method: 'POST',
                            data: {
                                boxcode: list.boxcodeUrl,
                                stock
                            }
                        })
                            .then(() => {
                                if (result2[0].outputboxcode.startsWith(list.boxcodeUrl) < 0) {
                                    this.$message.success('成功出仓');
                                }
                                this.$refs['form'].resetFields();
                            })
                            .catch((err) => {
                                this.$message.error(err.message);
                            });
                    }
                }
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