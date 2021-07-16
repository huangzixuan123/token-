<template>
    <div>
        <div>
            <div class="add-title">添 加 货 架</div>
            <div class="add-input-box">
                <el-form ref="form" :model="list" label-width="80px" label-position="left" :rules="rules" :status-icon="true">
                    <el-form-item label="箱码" prop="boxcodeUrl">
                        <el-input v-model="list.boxcodeUrl" style="width: 213px" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="回仓数目" prop="backnum">
                        <el-input v-model="list.backnum" style="width: 213px" placeholder="请输入"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="add-input-box">
                <el-button type="primary" class="add-submit" @click="submit">确认添加</el-button>
                <el-button type="primary" class="add-submit" @click="submit2">完成上架（待定有问题待处理）</el-button>
            </div>
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
            tableproduct: [],
            tableshelfposition: [],
            list: {
                boxcodeUrl: '',
                backnum: ''
            },
            rules: {
                boxcodeUrl: [{ required: true, message: '请输入', trigger: 'blur' }],
                backnum: [{ required: true, message: '请输入', trigger: 'blur' }]
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
        async submit2() {
            let that = this;

            swal(
                {
                    title: '确定完成上架吗吗？',
                    text: '进行中的上架计划将结束，你将无法继续进行回仓',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#DD6B55',
                    confirmButtonText: '确定！',
                    cancelButtonText: '取消！',
                    closeOnConfirm: false,
                    closeOnCancel: false
                },
                function (isConfirm) {
                    if (isConfirm) {
                        that.changesupperstatus();
                        swal('成功！', '已完成上架流程', 'success');
                    } else {
                        swal('取消！', '系统无进行任何操作', 'error');
                    }
                }
            );
        },
        ///////////////////////////////////////////////////////////////////
        async changesupperstatus() {
            let that = this;
            that.end();

            //筛选进行中的对应产品的货架
            let result = await this.axios({
                path: '/user/SearchUpperstatus',
                method: 'get',
                data: {
                    status: '进行中'
                }
            });
            for (let i = 0; i < result.length; i++) {
                var shelfposition = result[i].shelfposition.split(',');
                this.axios({
                    path: '/user/addshelfproductstockwarning',
                    method: 'POST',
                    data: {
                        stockwarning: 50,
                        product: result[i].upperproduct + ''
                    }
                }).catch((err) => {
                    this.$message.error(err.message);
                });
                for (let a = 0; a < shelfposition.length; a++) {
                    let result2 = await this.axios({
                        path: '/user/searchShelfposition',
                        method: 'get',
                        data: {
                            shelfposition: shelfposition[a]
                        }
                    });

                    if (result2[0].product === null || result2[0].product === '') {
                        var product = result[i].upperproduct;
                        this.$notify({
                            title: '0',
                            message: result2[0].shelfposition + '              ||||||||||||            ' + product,
                            type: 'success'
                        });
                    } else if (result2[0].product.indexOf(result[i].upperproduct) >= 0) {
                        var product = result2[0].product;
                        this.$notify({
                            title: '1',
                            message: '重复！',
                            type: 'success'
                        });
                    } else {
                        var product = result[i].upperproduct + ',' + result2[0].product + '';
                        this.$notify({
                            title: '1',
                            message: product,
                            type: 'success'
                        });
                    }
                    this.axios({
                        path: '/user/changeShelfproduct',
                        method: 'POST',
                        data: {
                            shelfposition: shelfposition[a],
                            product
                        }
                    }).catch((err) => {
                        this.$message.error(err.message);
                    });

                    //  this.tableproduct = this.tableproduct.concat(product);
                    // this.tableshelfposition = this.tableshelfposition.concat(result2[0].shelfposition);
                }
            }

            // this.$message.success(this.tableshelfposition + '');
            // this.$message.error(this.tableproduct + '');
            // this.$message.success(this.tableproduct.length + '');
        },
        end() {
            this.axios({
                path: '/user/addshelfproduct',
                method: 'POST'
            })
                .then(() => {
                    this.axios({
                        path: '/user/deleshelfproductcopy',
                        method: 'POST'
                    })
                        .then(() => {
                            this.axios({
                                path: '/user/insertshelfproductcopy',
                                method: 'POST'
                            })
                                .then(() => {
                                    this.axios({
                                        path: '/user/deleshelfproduct',
                                        method: 'POST'
                                    })
                                        .then(() => {
                                            this.axios({
                                                path: '/user/insertshelfproduct',
                                                method: 'POST'
                                            })
                                                .then(() => {
                                                    this.axios({
                                                        path: '/user/changesupperstatus2',
                                                        method: 'POST',
                                                        data: {
                                                            status: '结束'
                                                        }
                                                    })
                                                        .then(() => {
                                                            this.$message.error('1111');
                                                        })
                                                        .catch((err) => {
                                                            this.$message.error(err.message);
                                                        });
                                                })
                                                .catch((err) => {
                                                    this.$message.error(err.message);
                                                });
                                        })
                                        .catch((err) => {
                                            this.$message.error(err.message);
                                        });
                                })
                                .catch((err) => {
                                    this.$message.error(err.message);
                                });
                        })
                        .catch((err) => {
                            this.$message.error(err.message);
                        });
                })
                .catch((err) => {
                    this.$message.error(err.message);
                });
        },
        async submit() {
            this.$refs['form'].validate(async (valid) => {
                if (!valid) return;
                let { list } = this;

                // ！！！！！！！！！！！！！！！！以后这里设定为无计划换页面
                let result = await this.axios({
                    path: '/user/SearchUpperoutputboxcode',
                    method: 'get',
                    data: {
                        status: '进行中',
                        outputboxcode: list.boxcodeUrl
                    }
                });
                if (result.length === 0) {
                    this.$message.error('请检查该商品是否需要进行回仓');
                } else {
                    this.$message.error('成功回仓');
                    // 仓库+

                    // stock:???
                    let result2 = await this.axios({
                        path: '/user/searchwarehousebarcode',
                        method: 'get',
                        data: {
                            boxcode: list.boxcodeUrl
                        }
                    });

                    var stock = result2[0].stock + parseInt(list.backnum) + '';
                    var outputnumber = result[0].outputnumber - parseInt(list.backnum) + '';

                    // this.$message.error(stock );

                    this.axios({
                        path: '/user/changeupperout',
                        method: 'POST',
                        data: {
                            //保持不变
                            upperplantime: result[0].upperplantime,
                            upperproduct: result[0].upperproduct + '',
                            outputboxcode: list.boxcodeUrl,
                            outputnumber
                        }
                    })
                        .then(() => {
                            this.axios({
                                path: '/user/changewarehousestock',
                                method: 'POST',
                                data: {
                                    boxcode: list.boxcodeUrl,
                                    stock
                                }
                            })
                                .then(() => {
                                    this.$message.success('成功入仓');
                                    this.$refs['form'].resetFields();
                                })
                                .catch((err) => {
                                    this.$message.error(err.message);
                                });
                        })
                        .catch((err) => {
                            this.$message.error(err.message);
                        });
                    //接下来限制输入数，回仓数目必须小于出仓数目，如果回仓数目大于出仓数目，货架相对应产品数目减少
                    // 当我箱号录入时，判定输入数最大为多少
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
</style>