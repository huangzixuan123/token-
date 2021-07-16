<template>
    <div>
        <div style="float: left">
            <el-tabs v-model="activeName" @tab-click="handleClick" style="margin-left: 15px">
                <!-- ///////////////////////////////货架管理//////////////////////////// -->
                <!-- ///////////////////////////////货架管理//////////////////////////// -->
                <!-- ///////////////////////////////货架管理//////////////////////////// -->
                <!-- ///////////////////////////////货架管理//////////////////////////// -->
                <!-- ///////////////////////////////货架管理//////////////////////////// -->
                <el-tab-pane label="货架管理" name="first">
                    <el-button @click="show2 = !show2">货架收纳/展开</el-button>
                    <el-button @click="addshow">添加货架</el-button>
                    <el-input
                        placeholder="请输入内容"
                        v-model="input"
                        class="input-with-select"
                        style="max-width: 250px; margin-left: 5px"
                        clearable
                    >
                        <el-button v-if="input === ''" slot="append" icon="el-icon-refresh-right" @click="searchsubmit()"></el-button>
                        <el-button v-else slot="append" icon="el-icon-search" @click="searchsubmit()"></el-button>
                        <i class="el-icon-search el-input__icon" slot="suffix" v-if="input === ''"> </i>
                    </el-input>
                    <div style="margin-top: 5px; margin-left: 5px">
                        <transition name="el-zoom-in-center">
                            <div v-show="show2">
                                <span style="margin-right: 20px">货架:</span>
                                <el-radio-group v-model="radio" v-for="(ITEMS, i) in HJ" :key="i" style="margin-right: 15px">
                                    <el-radio :label="ITEMS.HJname">{{ ITEMS.HJname }}</el-radio>
                                </el-radio-group>
                            </div>
                        </transition>
                    </div>
                    <!-- /////////////////卡片信息///////////////////// -->
                    <!-- /////////////////卡片信息///////////////////// -->
                    <div>
                        <el-row :gutter="20" class="el-row" size="mini">
                            <section class="posts-expand" v-for="(ITEMS, i) in list" :key="i">
                                <el-col :span="40" style="max-width: 400px">
                                    <el-card class="box-card" style="margin-top: 5px">
                                        <div slot="header" class="clearfix">
                                            <span style="margin-right: 20px" v-if="radio === ''">{{ ITEMS.HJname }} </span>
                                            <el-checkbox-group v-else v-model="checked2" @change="handleCheckedChange">
                                                <el-checkbox :label="ITEMS.HJchildren"></el-checkbox>
                                            </el-checkbox-group>
                                            <el-button
                                                slot="reference"
                                                type="primary"
                                                icon="el-icon-position"
                                                @click="go(ITEMS)"
                                                v-if="radio === ''"
                                                size="mini"
                                                circle
                                            ></el-button>
                                            <el-button type="text" v-if="radio === ''">
                                                <el-popconfirm
                                                    confirm-button-text="好的"
                                                    cancel-button-text="不用了"
                                                    @onConfirm="deleteHJname(ITEMS)"
                                                    icon="el-icon-info"
                                                    icon-color="red"
                                                    title="确定删除该货架吗？"
                                                >
                                                    <el-button
                                                        slot="reference"
                                                        type="danger"
                                                        icon="el-icon-delete"
                                                        size="mini"
                                                        circle
                                                    ></el-button>
                                                </el-popconfirm>
                                            </el-button>
                                        </div>
                                        <span style="margin-right: 20px">商品:</span>
                                        <el-badge
                                            v-for="(item, i) in ITEMS.subList"
                                            :key="i"
                                            ref="multipleTable"
                                            :value="item.HJbarcode !== '' && item.HJbarcode !== null ? item.productname : '空'"
                                            :type="item.HJbarcode !== '' && item.HJbarcode !== null ? 'success' : 'primary'"
                                        ></el-badge>
                                    </el-card>
                                </el-col>
                            </section>
                        </el-row></div
                ></el-tab-pane>
                <!-- ////////////////////////////////在架商品////////////////////////////////// -->
                <!-- ////////////////////////////////在架商品////////////////////////////////// -->
                <!-- ////////////////////////////////在架商品////////////////////////////////// -->
                <!-- ////////////////////////////////在架商品////////////////////////////////// -->
                <!-- ////////////////////////////////在架商品////////////////////////////////// -->
                <el-tab-pane label="在架商品" name="second">
                    <el-table :data="HJGET" ref="multipleTable" size="mini" border>
                        <el-table-column prop="productname" label="商品名称" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.productname }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="HJSPbarcode" label="条形码" align="center"></el-table-column>
                        <el-table-column prop="HJSPnumber" label="数目" align="center" sortable> </el-table-column>
                        <el-table-column prop="inwarehousetime" label="批次" align="center" sortable></el-table-column>
                        <el-table-column prop="Duedate" label="临期日期" align="center" sortable></el-table-column>
                        <el-table-column
                            label="状态"
                            align="center"
                            :filters="[
                                { text: '临期', value: '临期' },
                                { text: '余货不足', value: '余货不足' },
                                { text: '正常', value: '正常' }
                            ]"
                            :filter-method="filterTag"
                        >
                            <template slot-scope="scope">
                                <el-badge value="余货不足" v-if="scope.row.HJSPnumber < scope.row.CKstockwarning" type="warning">
                                </el-badge>
                                <el-badge value="临期" v-if="NOWDATE > scope.row.Duedate" type="danger"> </el-badge>
                                <el-badge
                                    value="正常"
                                    v-if="NOWDATE < scope.row.Duedate && scope.row.HJSPnumber > scope.row.CKstockwarning"
                                    type="success"
                                >
                                </el-badge>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
                <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
            </el-tabs>
        </div>

        <!-- ///////////////////////侧边打开/////////////////////// -->
        <!-- ///////////////////////侧边打开/////////////////////// -->
        <!-- ///////////////////////侧边打开/////////////////////// -->
        <!-- ///////////////////////侧边打开/////////////////////// -->
        <!-- ///////////////////////侧边打开/////////////////////// -->
        <transition name="el-zoom-in-bottom">
            <div style="display: flex; position: fixed; bottom: 0px; right: 0px" v-show="show1" class="transition-box">
                <el-form ref="form" :model="form" label-width="100px" :rules="rules">
                    <el-form-item label="子架区">
                        <el-input v-model="checked2" clearable @clear="clear()"></el-input>
                    </el-form-item>
                    <el-form-item label="商品名称" prop="product">
                        <el-autocomplete
                            v-model="form.product"
                            :fetch-suggestions="querySearchsupplierproduct"
                            placeholder="请输入内容"
                            @select="handleSelectsupplierproduct"
                            clearable
                        ></el-autocomplete
                    ></el-form-item>
                    <el-form-item label="批次" prop="intime">
                        <el-select v-model="form.intime" placeholder="请选择补充的商品" clearable>
                            <el-option v-for="(t, i) in CP" :key="i" :label="t.intime" :value="t.intime"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="数目" prop="num">
                        <el-input v-model="form.num" clearable
                            ><i class="el-icon-edit el-input__icon" slot="suffix" v-if="form.phonename === ''"> </i
                        ></el-input>
                    </el-form-item>
                    <el-button type="primary" @click="saveadd" align="center">创建计划</el-button>
                </el-form>
            </div>
        </transition>
        <!-- ///////添加货架//////////////// -->
        <!-- ///////添加货架//////////////// -->
        <!-- ///////添加货架//////////////// -->
        <!-- ///////添加货架//////////////// -->
        <!-- ///////添加货架//////////////// -->
        <el-dialog title="添加供应商产品" :visible.sync="addHJ">
            <el-form ref="addHJForm" :model="addHJForm" :rules="rules" :inline="true">
                <el-form-item label="货架" prop="HJname">
                    <el-input v-model="addHJForm.HJname" placeholder="请输入内容" clearable
                        ><i class="el-icon-edit el-input__icon" slot="suffix" v-if="addHJForm.producttype === ''"> </i
                    ></el-input>
                </el-form-item>
                <el-form-item label="子区间" prop="shelf">
                    <el-form-item prop="shelfy">
                        <el-input v-model="addHJForm.shelfy" style="width: 105px" placeholder="请输入纵数"></el-input> &nbsp;
                    </el-form-item>
                    <el-form-item prop="shelfx">
                        <el-input v-model="addHJForm.shelfx" style="width: 105px" placeholder="请输入列数"></el-input>
                    </el-form-item>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="info" @click="clear2">清空</el-button>
                <el-button type="danger" @click="cancel2">取 消</el-button>
                <el-button type="primary" @click="saveaddSupplierproduct">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    show2: true,
    inject: ['reload'],
    name: 'AutoHeightTable',
    data() {
        return {
            input: '',
            NOWDATE: this.dayjs().format('YYYY-MM-DD'),
            CP: {},
            labelPosition: 'right',
            addHJ: false,
            addHJForm: {
                HJname: '',
                shelfy: '',
                shelfx: ''
            },
            form: {
                product: '',
                num: '',
                intime: ''
            },
            rules: {
                HJname: [{ required: true, message: '请输入', trigger: 'blur' }],
                shelfy: [{ required: true, message: '请输入', trigger: 'blur' }],
                shelfx: [{ required: true, message: '请输入', trigger: 'blur' }]
            },
            rules: {
                product: [{ required: true, message: '请输入', trigger: 'blur' }],
                num: [{ required: true, message: '请输入', trigger: 'blur' }],
                intime: [{ required: true, message: '请输入', trigger: 'blur' }]
            },
            checked: [],
            checked2: [],
            input: '',
            radio: '',
            list: [],
            HJ: [],
            HJSP: [],
            NOWDATE: this.dayjs().format('YYYY-MM-DD'),
            show2: true,
            show1: false,
            activeName: 'first',
            code: ''
        };
    },
    created() {
        this.listGET();
        this.HJGET();
        this.HJSPGET();
        this.listselect();
    },
    watch: {
        radio: function (val) {
            this.radio = val;
            var a = this.radio;
            this.$message.success('货架___' + a);
            this.radioshow();
        }
    },
    async mounted() {
        //带输入建议////////////////////////////////////
        //带输入建议///////////产品/////////////////////
        //带输入建议////////////////////////////////////
        //带输入建议////////////////////////////////////
        //带输入建议////////////////////////////////////
        let CGQDsearch1 = await this.axios({
            path: '/user/SJSPseach1'
        });
        this.CGQDsearch1A = CGQDsearch1;
        this.CGQDsearch1A.forEach((item) => {
            this.$set(item, 'value', item.productname);
            delete item.productname;
        });
        this.restaurants1 = this.CGQDsearch1A;
    },
    methods: {
        //添加供应商品////////////////////////////////////
        //添加供应商品////////////////////////////////////
        //添加供应商品////////////////////////////////////
        //添加供应商品////////////////////////////////////
        //添加供应商品////////////////////////////////////
        cancel2() {
            this.addHJ = false;
            this.$refs['addHJForm'].resetFields();
        },
        clear2() {
            this.$refs['addHJForm'].resetFields();
        },
        addshow() {
            this.addHJ = true;
        },
        async saveaddSupplierproduct() {
            this.$refs['addHJForm'].validate(async (valid) => {
                if (!valid) return;
                let { addHJForm } = this;
                for (let y = 1; y <= addHJForm.shelfy; y++) {
                    for (let x = 1; x <= addHJForm.shelfx; x++) {
                        let a = x,
                            b = y;
                        if (x < 10) {
                            a = '0' + a + '';
                        }
                        if (y < 10) {
                            b = '0' + b + '';
                        }
                        this.axios({
                            path: '/user/HJadd1',
                            method: 'POST',
                            data: {
                                HJname: addHJForm.HJname,
                                // HJname: addHJForm.HJname + ' | ' + addHJForm.shelfy + ' X ' + addHJForm.shelfx,
                                HJchildren: addHJForm.HJname + '货架' + b + '' + '行' + a + '' + '列'
                            }
                        }).catch((err) => {
                            this.$message.error(err.message);
                        });
                    }
                }
                this.$refs['addHJForm'].resetFields();
                this.addHJ = false;
                this.listGET();
                this.reload();
                this.$notify({
                    title: '成功添加！',
                    type: 'success'
                });
            });
        },
        //删除货架//////////////////
        //删除货架//////////////////
        //删除货架//////////////////
        //删除货架//////////////////
        //删除货架//////////////////
        async deleteHJname(ITEMS) {
            let HJsearch5 = await this.axios({
                path: '/user/HJsearch5',
                method: 'get',
                data: {
                    HJname: ITEMS.HJname
                }
            });
            if (HJsearch5.length === 0) {
                this.axios({
                    path: '/user/HJdelete1',
                    method: 'POST',
                    data: {
                        HJname: ITEMS.HJname
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
            } else {
                sweetAlert('哎呦……出错了！', '你需要把货架的商品下架才能删除货架', 'error');
            }
        },
        //查询////////////////
        //查询////////////////
        //查询////////////////
        //查询////////////////
        //查询////////////////
        async searchsubmit() {
            if (this.input) {
                let HJsearch4 = await this.axios({
                    path: '/user/HJsearch4',
                    method: 'get',
                    data: {
                        HJname: '%' + this.input + '%'
                    }
                });
                if (HJsearch4.length == 0) {
                    this.$notify({
                        title: '查无数据',
                        type: 'warning'
                    });
                } else {
                    this.list = HJsearch4;
                    this.$notify({
                        title: '查询成功',
                        type: 'success'
                    });
                    this.input = '';
                }
            } else {
                this.reload();
                this.radio = '';
                this.listGET();
                this.clear();
            }
        },
        //带输入建议////////////////////////////////////
        //带输入建议////////////////////////////////////
        //带输入建议////////////////////////////////////
        //带输入建议////////////////////////////////////
        //带输入建议////////////////////////////////////
        //带输入建议////////////////////////////////////
        querySearchsupplierproduct(queryString, cb) {
            var restaurants1 = this.restaurants1;
            var results = queryString ? restaurants1.filter(this.createStateFilter(queryString)) : restaurants1;
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                cb(results);
            }, 1000 * Math.random());
        },
        createStateFilter(queryString) {
            return (state) => {
                return state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
                // return state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
                // return state.barcode.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
            };
        },
        async handleSelectsupplierproduct(item) {
            //仓库为准
            let SJSPseach2 = await this.axios({
                path: '/user/SJSPseach2',
                method: 'get',
                data: {
                    productname: item.value
                }
            });
            //货架上有没有
            let SJSPseach3 = await this.axios({
                path: '/user/SJSPseach3',
                method: 'get',
                data: {
                    productname: item.value
                }
            });
            let SJSPseach4 = await this.axios({
                path: '/user/SJSPseach4',
                method: 'get',
                data: {
                    productname: item.value
                }
            });
            if (SJSPseach3.length === 0) {
                this.CP = SJSPseach2;
                this.code = SJSPseach2[0].CKbarcode;
            } else {
                if (SJSPseach4.length === 0) {
                    sweetAlert('该货架的商品批次已用尽！', '你需要把货架的商品下架才才能继续进行', 'error');
                    this.CP = [];
                } else {
                    this.CP = SJSPseach3;
                    this.form.intime = SJSPseach3[0].inwarehousetime;
                    this.code = SJSPseach3[0].CKbarcode;
                }
            }
        },
        // 创建计划//////////
        // 创建计划//////////
        // 创建计划//////////
        // 创建计划//////////
        // 创建计划//////////
        async saveadd() {
            this.$refs['form'].validate(async (valid) => {
                if (!valid) return;
                let { form } = this;
                ///删
                for (let i = 0; i < this.checked2.length; i++) {
                    this.axios({
                        path: '/user/SJSPJHdelete1',
                        method: 'POST',
                        data: {
                            SJHJshelf: this.checked2[i] + '',
                            SJHJtime: this.NOWDATE,
                            SJbarcode: this.code
                        }
                    });
                }
                this.axios({
                    path: '/user/SJSPSMdelete1',
                    method: 'POST',
                    data: {
                        // SJSMbarcode: form.product,
                        SJSMbarcode: this.code,
                        SJSMtime: this.NOWDATE
                    }
                }).then(() => {
                    ///加
                    for (let i = 0; i < this.checked2.length; i++) {
                        this.axios({
                            path: '/user/SJSPJHadd1',
                            method: 'POST',
                            data: {
                                // SJbarcode: form.product,
                                SJbarcode: this.code,
                                SJHJshelf: this.checked2[i] + '',
                                SJHJtime: this.NOWDATE,
                                SJHJstatus: '进行中'
                            }
                        });
                    }
                    this.axios({
                        path: '/user/SJSPSMadd1',
                        method: 'POST',
                        data: {
                            SJSMbarcode: this.code,
                            SJSM: form.num,
                            SJSMtime: this.NOWDATE,
                            SJSMstatus: '进行中',
                            SJSMintime: form.intime + ''
                        }
                    });
                    this.clear();
                    this.$notify({
                        title: '成功添加！',
                        type: 'success'
                    });
                });
            });
        },
        //多选///////////////////
        //多选///////////////////
        //多选///////////////////
        //多选///////////////////
        //多选///////////////////
        clear() {
            this.$refs['form'].resetFields();
            this.checked2 = [];
            this.show1 = false;
        },

        handleCheckedChange(value) {
            if (value.length !== 0) {
                this.show1 = true;
            } else {
                this.show1 = false;
            }
        },
        ////表格筛选////////////
        ////表格筛选////////////
        ////表格筛选////////////
        ////表格筛选////////////
        ////表格筛选////////////
        filterTag(value, row) {
            if (value === '临期') {
                return this.NOWDATE > row.Duedate;
            }
            if (value === '余货不足') {
                return row.HJSPnumber < row.CKstockwarning;
            }
            if (value === '正常') {
                return this.NOWDATE < row.Duedate && row.HJSPnumber > row.CKstockwarning;
            }
        },
        async go(ITEMS) {
            this.radio = ITEMS.HJname;
            this.radioshow();
        },
        ///单选////////
        ///单选////////
        ///单选////////
        ///单选////////
        ///单选////////
        async radioshow() {
            let res = await this.axios({
                path: '/user/HJsearch3',
                method: 'get',
                data: {
                    HJname: this.radio
                }
            });
            let newArr = [];
            res.forEach((item, i) => {
                let index = -1;
                let isExists = newArr.some((newItem, j) => {
                    if (item.HJchildren == newItem.HJchildren) {
                        index = j;
                        return true;
                    }
                });
                if (!isExists) {
                    newArr.push({
                        HJchildren: item.HJchildren,
                        subList: [item]
                    });
                } else {
                    newArr[index].subList.push(item);
                }
                this.list = newArr;
            });
        },
        ///列表显示////////
        ///列表显示////////
        ///列表显示////////
        ///列表显示////////
        ///列表显示////////
        // async listselect() {
        //     let res = await this.axios({
        //         path: '/user/SJSPseach1'
        //     });
        //     this.CP = res;
        // },

        async listGET() {
            let res = await this.axios({
                path: '/user/HJsearch1'
            });
            let newArr = [];
            res.forEach((item, i) => {
                let index = -1;
                let isExists = newArr.some((newItem, j) => {
                    if (item.HJname == newItem.HJname) {
                        index = j;
                        return true;
                    }
                });
                if (!isExists) {
                    newArr.push({
                        HJname: item.HJname,
                        subList: [item]
                    });
                } else {
                    newArr[index].subList.push(item);
                }
                this.list = newArr;
            });
            // this.$message.success(JSON.stringify(newArr));
            this.show1 = false;
        },
        async HJGET() {
            let res = await this.axios({
                path: '/user/HJsearch2'
            });
            this.HJ = res;
        },
        async HJSPGET() {
            let res = await this.axios({
                path: '/user/HJSPsearch1'
            });
            this.HJGET = res;
            res.forEach((item, i) => {
                this.$set(item, 'Duedate', this.dayjs(item.inwarehousetime).add(item.duedateproportion, 'day').format('YYYY-MM-DD'));
            });
        }
    }
};
</script>
<style>
.el-row {
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap;
}
.transition-box {
    max-width: 400px;
    background-color: #a8c8e7;
    padding: 40px 20px;
    margin-right: 10px;
}
.red {
    color: #ff0000;
}
</style>
<style lang="less">
</style>

