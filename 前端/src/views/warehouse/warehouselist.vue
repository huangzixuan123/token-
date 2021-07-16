<template>
    <div>
        <div>
            <el-input placeholder="请输入内容" v-model="input" style="max-width: 250px" clearable>
                <el-button v-if="input === ''" slot="append" icon="el-icon-refresh-right" @click="searchsubmit()"></el-button>
                <el-button v-else slot="append" icon="el-icon-search" @click="searchsubmit()"></el-button>
                <i class="el-icon-search el-input__icon" slot="suffix" v-if="input === ''"> </i>
            </el-input>
            <el-switch
                v-model="value1"
                inactive-color="#13ce66"
                active-color="#ff4949"
                inactive-text="详细表单"
                active-text="简约表单"
                style="margin-left: 15px"
            >
            </el-switch>
            <el-radio v-model="radio" label="1" style="margin-left: 15px">临期</el-radio>
            <el-radio v-model="radio" label="2">余货不足</el-radio>
        </div>

        <div style="margin-top: 5px">
            <el-table :data="list" ref="multipleTable" :summary-method="getSummaries" show-summary v-if="value1 == true" size="mini">
                <el-table-column prop="productname" label="商品名称" min-width="110" fixed></el-table-column>
                <el-table-column prop="CKbarcode" label="条形码" min-width="100"></el-table-column>
                <el-table-column prop="specs" label="包装系数" min-width="110"> </el-table-column>
                <el-table-column
                    prop="sum"
                    label="总数"
                    min-width="110"
                    sortable
                    :filters="[{ text: '余货不足', value: '余货不足' }]"
                    :filter-method="filterTag"
                >
                    <template slot-scope="scope">
                        {{ scope.row.sum }}
                        <el-badge value="余货不足" v-if="scope.row.sum < scope.row.CKstockwarning" type="warning"> </el-badge>
                    </template>
                </el-table-column>
            </el-table>
            <el-row :gutter="20" class="el-row" v-else size="mini">
                <section class="posts-expand" v-for="(ITEMS, i) in list" :key="i">
                    <el-col :span="40" style="margin-top: 15px">
                        <el-card class="box-card" style="margin-top: 5px">
                            <div slot="header" class="clearfix">
                                <span style="margin-right: 20px"> 商品：{{ ITEMS.productname }} </span>
                                <span> 条码：{{ ITEMS.CKbarcode }} </span>
                                <br />
                                <span style="margin-right: 20px"> 包装系数：{{ ITEMS.specs }} </span>
                                <span>
                                    总数：{{ ITEMS.sum }}
                                    <el-badge value="余货不足" v-if="ITEMS.sum < ITEMS.CKstockwarning" type="warning"> </el-badge>
                                </span>
                            </div>
                            <el-table :data="ITEMS.subList" ref="multipleTable" :summary-method="getSummaries" show-summary>
                                <el-table-column prop="intime" label="入仓时间" min-width="110" sortable>
                                    <template slot-scope="scope">
                                        {{ scope.row.intime }}
                                        <el-badge value="临期" v-if="NOWDATE > scope.row.Duedate"> </el-badge>
                                        <el-badge value="正常" v-if="NOWDATE < scope.row.Duedate" type="success"> </el-badge>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="Duedate" label="预计临期" min-width="110"></el-table-column>
                                <el-table-column prop="boxcode" label="箱码" min-width="110"></el-table-column>
                                <el-table-column prop="stock" label="余量" min-width="110" sortable> </el-table-column>
                            </el-table>
                        </el-card>
                    </el-col>
                </section>
            </el-row>
        </div>
    </div>
</template>
<script>
export default {
    inject: ['reload'],

    data() {
        return {
            NOWDATE: this.dayjs().format('YYYY-MM-DD'),
            input: '',
            value1: false,
            radio: '',
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

            list: [],
            ITEMS: []
        };
    },
    created() {
        this.listGET();
    },
    watch: {
        radio: function (val) {
            this.radio = val;
            var a = this.radio;
            if (a == 1) {
                this.duetime();
            }
            if (a == 2) {
                this.unsum();
            }
        }
    },
    methods: {
        ////单选筛选////////////
        ////单选筛选////////////
        ////单选筛选////////////
        ////单选筛选////////////
        async unsum() {
            let res = await this.axios({
                path: '/user/CKsearch4'
            });
            let newArr = [];
            res.forEach((item, i) => {
                this.$set(item, 'Duedate', this.dayjs(item.intime).add(item.duedateproportion, 'day').format('YYYY-MM-DD'));
                let index = -1;
                let isExists = newArr.some((newItem, j) => {
                    if (item.CKbarcode == newItem.CKbarcode) {
                        index = j;
                        return true;
                    }
                });
                if (!isExists) {
                    newArr.push({
                        CKbarcode: item.CKbarcode,
                        productname: item.productname,
                        specs: item.specs,
                        sum: item.sum,
                        CKstockwarning: item.CKstockwarning,
                        Duedate: item.Duedate,
                        subList: [item]
                    });
                } else {
                    newArr[index].subList.push(item);
                }
                this.list = newArr;
            });
        },
        async duetime() {
            let res = await this.axios({
                path: '/user/CKsearch3'
            });
            let newArr = [];
            res.forEach((item, i) => {
                this.$set(item, 'Duedate', this.dayjs(item.intime).add(item.duedateproportion, 'day').format('YYYY-MM-DD'));
                let index = -1;
                let isExists = newArr.some((newItem, j) => {
                    if (item.CKbarcode == newItem.CKbarcode) {
                        index = j;
                        return true;
                    }
                });
                if (!isExists) {
                    newArr.push({
                        CKbarcode: item.CKbarcode,
                        productname: item.productname,
                        specs: item.specs,
                        sum: item.sum,
                        CKstockwarning: item.CKstockwarning,
                        Duedate: item.Duedate,
                        subList: [item]
                    });
                } else {
                    newArr[index].subList.push(item);
                }
                this.list = newArr;
            });
        },
        ////表格筛选////////////
        ////表格筛选////////////
        ////表格筛选////////////
        ////表格筛选////////////
        filterTag(value, row) {
            if (value === '余货不足') {
                return row.sum < row.CKstockwarning;
            }
        },
        //查询商品////////////////
        //查询商品////////////////
        //查询商品////////////////
        //查询商品////////////////
        //查询商品////////////////
        async searchsubmit() {
            if (this.input) {
                let CKsearch2 = await this.axios({
                    path: '/user/CKsearch2',
                    method: 'get',
                    data: {
                        productname: '%' + this.input + '%'
                    }
                });

                if (CKsearch2.length == 0) {
                    this.$notify({
                        title: '查无数据',
                        type: 'warning'
                    });
                } else {
                    // this.list = CKsearch2;
                    this.$notify({
                        title: '查询成功',
                        type: 'success'
                    });
                    this.input = '';
                    let newArr = [];
                    CKsearch2.forEach((item, i) => {
                        let index = -1;
                        let isExists = newArr.some((newItem, j) => {
                            if (item.CKbarcode == newItem.CKbarcode) {
                                index = j;
                                return true;
                            }
                        });
                        if (!isExists) {
                            newArr.push({
                                CKbarcode: item.CKbarcode,
                                productname: item.productname,
                                specs: item.specs,
                                sum: item.sum,
                                CKstockwarning: item.CKstockwarning,
                                subList: [item]
                            });
                        } else {
                            newArr[index].subList.push(item);
                        }
                        this.list = newArr;
                    });
                }
            } else {
                this.reload();
            }
        },
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
        ///列表显示////////
        ///列表显示////////
        ///列表显示////////
        ///列表显示////////
        ///列表显示////////
        async listGET() {
            let res = await this.axios({
                path: '/user/CKsearch1'
            });
            let newArr = [];
            res.forEach((item, i) => {
                this.$set(item, 'Duedate', this.dayjs(item.intime).add(item.duedateproportion, 'day').format('YYYY-MM-DD'));
                let index = -1;
                let isExists = newArr.some((newItem, j) => {
                    if (item.CKbarcode == newItem.CKbarcode) {
                        index = j;
                        return true;
                    }
                });
                if (!isExists) {
                    newArr.push({
                        CKbarcode: item.CKbarcode,
                        productname: item.productname,
                        specs: item.specs,
                        sum: item.sum,
                        CKstockwarning: item.CKstockwarning,
                        subList: [item]
                    });
                } else {
                    newArr[index].subList.push(item);
                }
                this.list = newArr;
            });
        }
    }
};
</script>
<style  scoped>
.el-row {
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap;
}
.red {
    color: #ff0000;
}
</style>
<style lang="less">
</style>