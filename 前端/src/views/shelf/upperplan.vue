<template>
    <div style="float: left">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="上架商品计划" name="first">
                <el-button type="primary" @click="end" size="mini">完成计划</el-button>
                <el-table :data="list" ref="multipleTable" size="mini" border style="margin-top: 5px">
                    <el-table-column prop="productname" label="商品名" align="center"></el-table-column>
                    <el-table-column prop="SJSMbarcode" label="条形码" align="center"></el-table-column>
                    <el-table-column prop="SJSM" label="数目" align="center"></el-table-column>
                    <el-table-column prop="SJSMtime" label="批次" align="center" width="100px" sortable></el-table-column>
                    <el-table-column prop="SJSMtime" label="计划时间" align="center" width="100px" sortable></el-table-column>
                    <el-table-column prop="outnum" label="出仓" align="center" width="70px" sortable></el-table-column>
                    <el-table-column prop="reinnum" label="回仓" align="center" width="70px" sortable></el-table-column>
                </el-table>
                <el-switch
                    v-model="value1"
                    inactive-color="#13ce66"
                    active-color="#ff4949"
                    inactive-text="出仓"
                    active-text="回仓"
                    style="margin-top: 15px"
                >
                </el-switch>
                <div>
                    <div style="margin-top: 15px">
                        <span class="add-title">箱码:</span>
                        <el-input v-model="boxcodeUrl" style="width: 213px" placeholder="请输入" clearable @blur="blur"></el-input>
                        <br />
                        <div style="margin-top: 5px">
                            <span class="add-title" v-if="value1 == false">出仓指导数目:{{ this.num }}</span>
                            <span class="add-title" v-if="value1 == true">回箱最大数目:{{ this.maxre }}</span>
                        </div>
                        <br />
                        <div v-if="value1 == true" style="margin-top: 5px">
                            <span class="add-title">数目:</span>
                            <el-input v-model="reinnum" style="width: 213px" placeholder="请输入" clearable></el-input>
                        </div>
                        <el-button type="primary" @click="submit" style="margin-top: 5px">确认</el-button>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="上架货架计划" name="second">
                <el-table :data="list2" ref="multipleTable" size="mini" border>
                    <el-table-column prop="SJHJshelf" label=" 货架" align="center"></el-table-column>
                    <el-table-column prop="productname" label="商品名" align="center"></el-table-column>
                    <el-table-column prop="barcode" label="条形码" align="center"></el-table-column>
                    <el-table-column prop="SJHJtime" label="计划时间" align="center" width="100px" sortable></el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
        <!-- 扫码 -->
        <!-- 扫码 -->
        <!-- 扫码 -->
        <!-- 扫码 -->
        <!-- 扫码 -->
        <div class="scan">
            <div id="bcid" v-if="a === true"></div>
            <footer>
                <div>
                    <el-button @click="startRecognize" type="warning" style="margin-left: 10px">1.创建控件</el-button>
                    <!-- <el-button @click="startScan"  type="warning">2.开始扫描</el-button>
                    <el-button @click="cancelScan"  type="warning">3.结束扫描</el-button> -->
                    <el-button @click="closeScan" type="warning">4.关闭控件</el-button>
                </div>
            </footer>
        </div>
    </div>
</template>
<script>
let scan = null;
export default {
    inject: ['reload'],
    data() {
        return {
            value1: false,
            list: [],
            list2: [],
            time: '',
            activeName: 'first',
            a: false,
            boxcodeUrl: '',
            num: '',
            maxre: '',
            reinnum: ''
        };
    },
    created() {
        this.listGET();
        this.listGET2();
    },
    methods: {
        //焦点//////////
        //焦点//////////
        //焦点//////////
        //焦点//////////
        //焦点//////////
        async blur() {
            if (this.value1 === true) {
                let res = await this.axios({
                    path: '/user/SJSPJHseach3',
                    method: 'get',
                    data: {
                        boxcode: this.boxcodeUrl
                    }
                });
                if (res.length === 0) {
                    this.$notify({
                        title: '错误箱号',
                        type: 'warning'
                    });
                    this.maxre = '';
                } else {
                    this.maxre = res[0].specs - res[0].stock;
                }
            }
        },
        //完成计划
        //完成计划
        //完成计划
        //完成计划
        //完成计划
        end() {
            let that = this;
            swal(
                {
                    title: '确定结束计划吗？',
                    text: '你将无法恢复计划状态！',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#DD6B55',
                    confirmButtonText: '确定结束！',
                    cancelButtonText: '取消删除！',
                    closeOnConfirm: false,
                    closeOnCancel: false
                },
                function (isConfirm) {
                    if (isConfirm) {
                        that.endplan();
                        that.endSJSPSM();
                        that.allend();
                        swal('成功!', '计划已经完成:)', 'success');
                    } else {
                        swal('取消！', '你的计划是安全的:)', 'error');
                    }
                }
            );
        },
        async endplan() {
            for (let i = 0; i < this.list.length; i++) {
                let res = await this.axios({
                    path: '/user/HJSPsearch3',
                    method: 'get',
                    data: {
                        HJSPbarcode: this.list[i].SJSMbarcode + ''
                    }
                });
                if (res.length === 0) {
                    var HJSPnumber = this.list[i].outnum - this.list[i].reinnum;
                    this.axios({
                        path: '/user/HJSPadd1',
                        method: 'POST',
                        data: {
                            HJSPbarcode: this.list[i].SJSMbarcode,
                            HJSPnumber,
                            inwarehousetime: this.list[i].SJSMintime
                        }
                    });
                } else {
                    //编辑
                    var HJSPnumber = res[0].HJSPnumber + this.list[i].outnum - this.list[i].reinnum;
                    this.axios({
                        path: '/user/HJSPedit1',
                        method: 'POST',
                        data: {
                            HJSPbarcode: this.list[i].SJSMbarcode,
                            HJSPnumber
                        }
                    });
                }
            }
        },
        async endSJSPSM() {
            // // 货架计划删null
            this.axios({
                path: '/user/HJdelete2',
                method: 'POST'
            });
            // 货架计划删已经存在的
            this.axios({
                path: '/user/HJdelete3',
                method: 'POST'
            });
            // 货架计划添加入实际
            for (let i = 0; i <= this.list2.length; i++) {
                let SJHJshelf = [];
                SJHJshelf = this.list2[i].SJHJshelf.split('货架');
                this.axios({
                    path: '/user/HJadd2',
                    method: 'POST',
                    data: {
                        HJname: SJHJshelf[0] + '',
                        HJchildren: this.list2[i].SJHJshelf,
                        HJbarcode: this.list2[i].SJbarcode
                    }
                })
                    .then(() => {
                        // this.$message.success('成功');
                    })
                    .catch((err) => {
                        this.$message.error(err.message);
                    });
            }
        },
        async allend() {
            //变更为结束状态
            this.axios({
                path: '/user/SJSPJHedit3',
                method: 'POST'
            });
            //货架计划编辑为结束
            this.axios({
                path: '/user/SJSPJHedit4',
                method: 'POST'
            }).then(() => {
                this.reload();
                this.boxcodeUrl = '';
            });
        },
        // 扫码功能
        // 扫码功能
        // 扫码功能
        // 扫码功能
        // 扫码功能
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
                that.boxcodeUrl = result + '';
                that.submit();
                that.closeScan();

                swal({
                    title: '等待加载...',
                    imageUrl: 'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3',
                    timer: 1000,
                    showConfirmButton: false
                });
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
            let res = await this.axios({
                path: '/user/SJSPJHseach3',
                method: 'get',
                data: {
                    boxcode: this.boxcodeUrl
                }
            });
            if (res.length === 0) {
                this.$notify({
                    title: '错误箱号',
                    type: 'warning'
                });
            } else {
                if (this.value1 === false) {
                    // this.$message.success(res[0].stock+'');
                    if (res[0].specs >= res[0].stock) {
                        var outnum = res[0].stock + res[0].outnum + '';
                        //编辑仓库stock=0
                        var stock = 0;
                        this.num = res[0].stock;
                    } else {
                        var outnum = res[0].specs + res[0].outnum + '';
                        //编辑仓库
                        var stock = res[0].stock - res[0].specs;
                        this.num = res[0].specs;
                    }
                    //编辑出仓进度
                    this.axios({
                        path: '/user/SJSPJHedit1',
                        method: 'POST',
                        data: {
                            SJSMbarcode: res[0].SJSMbarcode,
                            outnum
                        }
                    });
                    //编辑仓库
                    this.axios({
                        path: '/user/CKedit1',
                        method: 'POST',
                        data: {
                            boxcode: this.boxcodeUrl,
                            stock
                        }
                    })
                        .then(() => {
                            this.$notify({
                                title: '成功出仓',
                                type: 'success'
                            });
                            this.listGET();
                            this.boxcodeUrl = '';
                        })
                        .catch((err) => {
                            this.$message.error(err.message);
                        });
                } else if (this.value1 === true) {
                    if (this.reinnum === '') {
                        this.$notify({
                            title: '请填写完整',
                            type: 'warning'
                        });
                    } else {
                        if (this.reinnum > this.maxre) {
                            sweetAlert('数目错误', '你录入的数目不得超过回箱最大数', 'error');
                        } else {
                            var reinnum = res[0].reinnum + parseInt(this.reinnum);
                            //编辑出仓进度
                            this.axios({
                                path: '/user/SJSPJHedit2',
                                method: 'POST',
                                data: {
                                    SJSMbarcode: res[0].SJSMbarcode,
                                    reinnum
                                }
                            });

                            var stock = res[0].stock + parseInt(this.reinnum);
                            //编辑仓库
                            this.axios({
                                path: '/user/CKedit1',
                                method: 'POST',
                                data: {
                                    boxcode: this.boxcodeUrl,
                                    stock
                                }
                            })
                                .then(() => {
                                    this.$notify({
                                        title: '成功回仓',
                                        type: 'success'
                                    });
                                    this.listGET();
                                    this.boxcodeUrl = '';
                                    this.reinnum = '';
                                })
                                .catch((err) => {
                                    this.$message.error(err.message);
                                });
                        }
                    }
                }
            }
        },

        ///列表显示////////
        ///列表显示////////
        ///列表显示////////
        ///列表显示////////
        ///列表显示////////
        async listGET() {
            let res = await this.axios({
                path: '/user/SJSPJHseach1'
            });
            this.list = res;
        },
        async listGET2() {
            let res = await this.axios({
                path: '/user/SJSPJHseach2'
            });
            this.list2 = res;
            this.time = list[2].SJHJtime;
        }
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
    text-align: left;
    padding: 20px 0 40px;
    font-size: 26px;
    color: #409eff;
    font-weight: bold;
    letter-spacing: 5px;
}
</style>