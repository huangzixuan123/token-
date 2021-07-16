<template>
    <div style="float: left">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="销售平台" name="first">
                <el-table
                    :data="list"
                    ref="multipleTable"
                    size="mini"
                    border
                    style="margin-top: 5px"
                    :summary-method="getSummaries"
                    show-summary
                >
                    <el-table-column label="操作" align="center" width="50">
                        <template slot-scope="scope">
                            <el-button
                                type="danger"
                                icon="el-icon-delete"
                                size="mini"
                                circle
                                @click="deleteJH(scope.$index, scope.row)"
                            ></el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="productname" label="商品名"></el-table-column>
                    <el-table-column prop="barcode" label="条形码"></el-table-column>
                    <el-table-column label="数目" width="200px">
                        <template slot-scope="scope">
                            <el-input-number
                                v-model="scope.row.num"
                                @change="handleChange(scope.$index, scope.row)"
                                :min="1"
                                label="1"
                            ></el-input-number>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column label="价格" width="50">
                        <template slot-scope="scope">{{ scope.row.retailprice * scope.row.num }} </template>
                    </el-table-column> -->
                    <el-table-column prop="value" label="价格" width="50"> </el-table-column>
                </el-table>
                <el-button type="primary" @click="end" size="mini" style="margin-top: 5px">结算订单</el-button>

                <div>
                    <div style="margin-top: 5px">
                        <span class="add-title">条形码:</span>
                        <el-input v-model="borcodeUrl" style="width: 213px" placeholder="请输入" clearable @blur="blur"></el-input>
                        <el-button type="primary" @click="submit" style="margin-top: 5px">确认</el-button>
                    </div>
                </div>
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
            num: 1,
            borcodeUrl: '',
            NOWDATE: this.dayjs().format('YYYY-MM-DD'),

            ///
            ///
            ///
            ///
            value1: false,
            list: [],
            text: [],
            time: '',
            activeName: 'first',
            a: false,
            maxre: '',
            reinnum: ''
        };
    },
    created() {},
    methods: {
        //列表计总和///////
        //列表计总和///////
        //列表计总和///////
        //列表计总和///////
        //列表计总和///////
        getSummaries(param) {
            if (this.value1 === false) {
                const { columns, data } = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '总库存';
                        //只计算最后一列
                    } else if (index === columns.length - 1) {
                        const values = data.map((item) => Number(item[column.property]));
                        if (!values.every((value) => isNaN(value))) {
                            sums[index] = values.reduce((prev, curr) => {
                                const value = Number(curr);
                                if (!isNaN(value)) {
                                    return prev + curr;
                                } else {
                                    return prev;
                                }
                            }, 0);
                            sums[index] += '';
                        } else {
                            sums[index] = '';
                        }
                    } else {
                        sums[index] = '';
                    }
                });
                return sums;
            }
        },
        //结算////
        //结算////
        //结算////
        //结算////
        //结算////
        end() {
            for (let i = 0; i < this.list.length; i++) {
                this.axios({
                    path: '/user/JSadd1',
                    method: 'POST',
                    data: {
                        JSbarcode: this.list[i].barcode,
                        JSnumber: this.list[i].num,
                        price: this.list[i].value,
                        JStime:this.NOWDATE
                    }
                });
                this.axios({
                    path: '/user/HJSPedit2',
                    method: 'POST',
                    data: {
                        HJSPbarcode: '%' + this.list[i].barcode + '' + '%',
                        HJSPnumber: this.list[i].num
                    }
                })
                    // .then(() => {
                    //     this.reload();
                    //     this.$notify({
                    //         title: '编辑成功',
                    //         type: 'success'
                    //     });
                    // })
                    // .catch((err) => {
                    //     this.$message.error(err.message);
                    // });
            }
            this.$notify({
                title: '结算成功！',
                type: 'success'
            });
            this.reload();
        },
        ///删计划///////
        ///删计划///////
        ///删计划///////
        ///删计划///////
        ///删计划///////
        deleteJH(index, row) {
            this.list.splice(index, 1);
            this.text.splice(index, 1);
        },
        //加入购物清单
        //加入购物清单
        //加入购物清单
        //加入购物清单
        //加入购物清单
        async submit() {
            let res = await this.axios({
                path: '/user/HJSPsearch2',
                method: 'get',
                data: {
                    HJSPbarcode: this.borcodeUrl
                }
            });
            this.list = this.list.concat(res);
            this.text = this.text.concat(res);
            this.borcodeUrl = '';
            this.text.forEach((item) => {
                this.$set(item, 'value', item.retailprice);
                this.$set(item, 'num', 1);
            });
        },
        //计数器
        //计数器
        //计数器
        //计数器
        //计数器
        handleChange(index, row) {
            // this.$message.error(this.text[index].value + '');
            // this.$message.error(this.text[index].num + '');
            // this.$message.success(JSON.stringify(this.text));
            this.$set(this.list[index], 'value', row.num * this.text[index].retailprice);
            // this.$set(this.list[index], 'retailprice', row.num * row.retailprice+'');
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
                that.borcodeUrl = result + '';
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