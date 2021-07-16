<template>
    <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="采购计划列表" name="first">
                <div class="block">
                    <span class="demonstration" style="font-size: 13px; margin-right: 5px">日期</span>
                    <el-date-picker
                        v-model="value2"
                        value-format="yyyy-MM-dd"
                        align="right"
                        type="date"
                        placeholder="选择日期"
                        @change="changeTime"
                        :picker-options="pickerOptions"
                        size="mini"
                    >
                    </el-date-picker>
                </div>
                <section v-for="(ITEMS, i) in list2" :key="i" size="mini">
                    <div>
                        <i class="el-icon-date" slot="suffix" style="margin-right: 5px"> </i>
                        <span class="demonstration" style="font-size: 13px; margin-right: 5px">{{ ITEMS.planinputtime }}</span>
                        <template type="text">
                            <el-popconfirm
                                confirm-button-text="好的"
                                cancel-button-text="不用了"
                                @onConfirm="DeleTimePlan(ITEMS)"
                                title="确定删除该产品的计划吗？"
                            >
                                <el-button slot="reference" type="text" icon="el-icon-delete" class="red" circle></el-button>
                            </el-popconfirm>
                        </template>
                    </div>
                    <el-table
                        :data="ITEMS.subList"
                        border
                        class="table"
                        ref="multipleTable"
                        header-cell-class-name="table-header"
                        size="mini"
                    >
                        <el-table-column fixed prop="productname" label="产品名" align="center"></el-table-column>
                        <el-table-column prop="CGJHbarcode" label="条形码" align="center"></el-table-column>
                        <el-table-column prop="specs" label="包装系数" align="center"></el-table-column>
                        <el-table-column prop="producttype" label="种类" align="center"></el-table-column>
                        <el-table-column prop="retailprice" label="零售价（元）" align="center"></el-table-column>
                        <el-table-column prop="CGJHsuppliername" label="供应商" align="center"></el-table-column>
                        <el-table-column fixed="right" label="数量(套/总)" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.number + '/' + scope.row.number * scope.row.specs }}
                            </template>
                        </el-table-column>
                        <el-table-column fixed="right" label="操作" align="center">
                            <template slot-scope="scope">
                                <template type="text">
                                    <el-popconfirm
                                        confirm-button-text="好的"
                                        cancel-button-text="不用了"
                                        @onConfirm="handleplanproduct(scope.row.id, scope.$index)"
                                        icon="el-icon-info"
                                        icon-color="red"
                                        title="确定删除该产品的计划吗？"
                                    >
                                        <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" circle></el-button>
                                    </el-popconfirm>
                                </template>
                            </template>
                        </el-table-column>
                    </el-table>
                </section>
            </el-tab-pane>
            <el-tab-pane label="入仓操作" name="second">
                <div style="height: 100%">
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
            </el-tab-pane>
        </el-tabs>
        <div class="scan">
            <div id="bcid" v-if="a === true"></div>
            <footer>
                <el-button @click="startRecognize" type="warning" v-if="this.activeName == 'second'">1.创建控件</el-button>
                <!-- <button @click="startScan">2.开始扫描</button>
                        <button @click="cancelScan">3.结束扫描</button> -->
                <el-button @click="closeScan" type="warning" v-if="this.activeName == 'second'">4.关闭控件</el-button>
            </footer>
        </div>
    </div>
</template>
<script>
let scan = null;

export default {
    data() {
        return {
            //时间选择器
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
                shortcuts: [
                    {
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    },
                    {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    },
                    {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }
                ]
            },
            value2: '',
            activeName: 'first',
            list2: [],
            ITEMS: [],

            /////操作
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
    created() {
        this.listGET();
        //操作
        this.studentGET();
    },
    methods: {
        ///获取数值///////////////////////////
        ///获取数值///////////////////////////
        ///获取数值///////////////////////////
        ///获取数值///////////////////////////
        ///获取数值///////////////////////////
        async listGET() {
            // swal({
            //     title: '等待加载...',
            //     imageUrl: 'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3',
            //     timer: 2000,
            //     showConfirmButton: false
            // });
            let res = await this.axios({
                path: '/user/CGJHsearch1'
            });
            let newArr = [];
            res.forEach((item, i) => {
                let index = -1;
                let isExists = newArr.some((newItem, j) => {
                    if (item.planinputtime == newItem.planinputtime) {
                        index = j;
                        return true;
                    }
                });
                if (!isExists) {
                    newArr.push({
                        planinputtime: item.planinputtime,
                        id: item.id,
                        subList: [item]
                    });
                } else {
                    newArr[index].subList.push(item);
                }
                this.list2 = newArr;
            });
        },
        ///删除单条计划///////////////////////////
        ///删除单条计划///////////////////////////
        ///删除单条计划///////////////////////////
        ///删除单条计划///////////////////////////
        ///删除单条计划///////////////////////////
        handleplanproduct(id, index) {
            this.axios({
                path: '/user/CGJHdelete2',
                method: 'POST',
                data: {
                    id
                }
            })
                .then(() => {
                    this.listGET();
                    this.$notify({
                        title: '成功删除！',
                        type: 'success'
                    });
                })
                .catch((err) => {
                    this.$message.error(err.message);
                });
        },
        ///删除日计划///////////////////////////
        ///删除日计划///////////////////////////
        ///删除日计划///////////////////////////
        ///删除日计划///////////////////////////
        ///删除日计划///////////////////////////
        DeleTimePlan(ITEMS) {
            var planinputtime = ITEMS.planinputtime + '';
            this.axios({
                path: '/user/CGJHdelete3',
                method: 'POST',
                data: {
                    planinputtime
                }
            })
                .then(() => {
                    this.listGET();
                    this.$notify({
                        title: '成功删除！',
                        type: 'success'
                    });
                })
                .catch((err) => {
                    this.$message.error(err.message);
                });
        },
        ///查询日计划///////////////////////////
        ///查询日计划///////////////////////////
        ///查询日计划///////////////////////////
        ///查询日计划///////////////////////////
        ///查询日计划///////////////////////////
        async changeTime() {
            let result = await this.axios({
                path: '/user/CGJHsearch2',
                method: 'get',
                data: {
                    planinputtime: this.value2 + ''
                }
            });
            if (result.length === 0) {
                this.$notify({
                    title: '警告',
                    message: '查无数据',
                    type: 'warning'
                });
                this.listGET();
            } else {
                //查询出来的数据分页
                let newArr = [];
                result.forEach((item, i) => {
                    let index = -1;
                    let isExists = newArr.some((newItem, j) => {
                        if (item.planinputtime == newItem.planinputtime) {
                            index = j;
                            return true;
                        }
                    });
                    if (!isExists) {
                        newArr.push({
                            planinputtime: item.planinputtime,
                            subList: [item]
                        });
                    } else {
                        newArr[index].subList.push(item);
                    }
                    this.list = newArr;
                });
                this.$notify({
                    title: '查询成功！',
                    type: 'success'
                });
            }
        },
        //操作
        //操作
        //操作
        //操作
        //操作
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
                if (that.list.codeUrl === '') {
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
                        barcode: list.codeUrl + ''
                    }
                });
                this.$message.error(result[0].specs + '');

                this.axios({
                    path: '/user/CKadd1',
                    method: 'POST',
                    data: {
                        stock: result[0].specs + '',
                        CKbarcode: list.codeUrl + '',
                        boxcode: list.boxcodeUrl + '',
                        intime: this.NOWDATE
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
    }
};
</script>
<style  scoped>
.red {
    color: #ff0000;
}
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