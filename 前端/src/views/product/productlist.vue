<template>
    <div>
        <el-button type="primary" @click="addsubmit()" size="mini">添加</el-button>
        <el-button type="primary" @click="outExcel(sels)" size="mini"
            ><font-awesome-icon icon="file-excel" />

            导出数据</el-button
        >
        <el-switch
            v-model="value1"
            inactive-color="#13ce66"
            active-color="#ff4949"
            inactive-text="采购清单"
            active-text="制定采购计划"
            size="mini"
            style="margin-left: 5px"
        >
        </el-switch>
        <el-input
            placeholder="请输入内容"
            v-model="input"
            class="input-with-select"
            style="max-width: 250px; margin-left: 5px; float: right"
            size="mini"
            clearable
        >
            <el-button v-if="input === ''" slot="append" icon="el-icon-refresh-right" @click="searchsubmit()"></el-button>
            <el-button v-else slot="append" icon="el-icon-search" @click="searchsubmit()"></el-button>
            <i class="el-icon-search el-input__icon" slot="suffix" v-if="input === ''"> </i>
        </el-input>

        <el-table
            :data="list"
            ref="multipleTable"
            style="width: 100vw; margin-top: 5px"
            size="mini"
            :row-key="getRowKeyOfTarget"
            @expand-change="expandchange"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" :reserve-selection="true"></el-table-column>
            <el-table-column prop="productname" label="产品" fixed>
                <template slot-scope="scope">
                    <el-tag :type="scope.row.subList[0].suppliername !== null ? 'primary' : 'danger'">{{ scope.row.productname }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="barcode" label="条形码"></el-table-column>
            <el-table-column
                prop="producttype"
                label="类别"
                :filters="[
                    { text: '暂无计划', value: '暂无计划' },
                    { text: '无供应商', value: null },
                    { text: '存在计划', value: NOWDATE },
                    { text: '有供应商', value: '有供应商' }
                ]"
                :filter-method="filterTag"
            ></el-table-column>
            <el-table-column prop="retailprice" label="零售价"></el-table-column>
            <el-table-column prop="specs" label="包装系数"></el-table-column>
            <el-table-column prop="expirydate" label="保质期"></el-table-column>

            <el-table-column
                label="状态"
                prop="status"
                :filters="[
                    { text: '暂无计划', value: '暂无计划' },
                    { text: '无供应商', value: null },
                    { text: '存在计划', value: NOWDATE },
                    { text: '有供应商', value: '有供应商' }
                ]"
                :filter-method="filterTag"
            >
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.subList[0].suppliername === null" :type="'warning'" disable-transitions>无供应商</el-tag>
                    <el-tag v-else :type="'success'" disable-transitions>有供应商</el-tag>
                    <el-tag v-if="value1 == true && scope.row.planinputtime === NOWDATE" :type="'info'" disable-transitions
                        >存在计划</el-tag
                    >
                    <el-tag v-else-if="value1 == true" :type="'success'" disable-transitions>暂无计划 </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="数量(套)" align="center" v-if="value1 == true">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.subList[0].suppliername === null" :type="'danger'">无可操作</el-tag>
                    <el-tag v-else-if="scope.row.planinputtime === NOWDATE" :type="'info'" disable-transitions>{{
                        scope.row.number
                    }}</el-tag>
                    <el-input v-else v-model="scope.row.number1" size="small" clearable></el-input>
                </template>
            </el-table-column>
            <el-table-column label="供应商" align="center" prop="subList" v-if="value1 == true">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.subList[0].suppliername === null" :type="'danger'">无可操作</el-tag>
                    <el-tag v-else-if="scope.row.planinputtime === NOWDATE" :type="'info'" disable-transitions>{{
                        scope.row.CGJHsuppliername
                    }}</el-tag>
                    <el-select v-else v-model="scope.row.suppliername" placeholder="请选择" filterable allow-create>
                        <el-option v-for="(ITEMS, i) in scope.row.subList" :key="i" :value="ITEMS.suppliername"> </el-option>
                    </el-select>
                </template>
            </el-table-column>

            <el-table-column label="操作" align="center" fixed="right">
                <template slot-scope="scope">
                    <template
                        v-if="value1 == false && scope.row.subList[0].suppliername === null && scope.row.planinputtime !== NOWDATE"
                        size="mini"
                        ><el-popconfirm
                            confirm-button-text="好的"
                            cancel-button-text="不用了"
                            @onConfirm="deleteCGQD(scope.row.id, scope.$index)"
                            icon="el-icon-info"
                            icon-color="red"
                            title="确定删除该产品的信息吗？"
                        >
                            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" circle></el-button> </el-popconfirm
                    ></template>
                    <el-button
                        v-else-if="value1 == false"
                        type="primary"
                        icon="el-icon-edit"
                        size="mini"
                        circle
                        @click="edit(scope.$index, scope.row)"
                    ></el-button>
                    <el-button
                        v-if="value1 == true && scope.row.planinputtime === NOWDATE && scope.row.subList[0].suppliername !== null"
                        type="danger"
                        icon="el-icon-delete"
                        size="mini"
                        circle
                        @click="deleteCGJH(scope.row.id, scope.$index)"
                    ></el-button>
                    <el-tag v-else-if="value1 == true && scope.row.subList[0].suppliername === null" :type="'danger'">无可操作</el-tag>
                    <el-button
                        v-else-if="value1 == true && scope.row.subList[0].suppliername !== null"
                        type="success"
                        icon="el-icon-plus"
                        size="mini"
                        circle
                        @click="addCGJH(scope.$index, scope.row)"
                    ></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- /////////////////////页码/////////////////////////////////////////////////// -->
        <!-- /////////////////////页码/////////////////////////////////////////////////// -->
        <!-- /////////////////////页码/////////////////////////////////////////////////// -->
        <!-- /////////////////////页码/////////////////////////////////////////////////// -->
        <!-- /////////////////////页码/////////////////////////////////////////////////// -->
        <el-pagination
            background
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[5, 10, 15, 20, 25, 30]"
            :page-size="pageSize"
            :page-count="pageNum"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
        >
        </el-pagination>
        <!-- ///////编辑采购清单//////////////////////////////////////////////////// -->
        <!-- ///////编辑采购清单//////////////////////////////////////////////////// -->
        <!-- ///////编辑采购清单//////////////////////////////////////////////////// -->
        <!-- ///////编辑采购清单//////////////////////////////////////////////////// -->
        <!-- ///////编辑采购清单//////////////////////////////////////////////////// -->

        <el-dialog title="编辑采购清单" :visible.sync="editCGQDVisible">
            <el-form ref="editCGQDlist" :model="editCGQDlist" label-width="100px" :rules="rules" :inline="true">
                <el-form-item label="商品名称" prop="productname">
                    <el-input v-model="editCGQDlist.productname" placeholder="请输入" style="width: 160px" clearable
                        ><i class="el-icon-edit el-input__icon" slot="suffix" v-if="editCGQDlist.productname === ''"> </i
                    ></el-input>
                </el-form-item>
                <el-form-item label="条形码" prop="barcode">
                    <el-input v-model="editCGQDlist.barcode" placeholder="请输入" style="width: 160px" clearable disabled="false"
                        ><i class="el-icon-edit el-input__icon" slot="suffix" v-if="editCGQDlist.barcode === ''"> </i
                    ></el-input>
                </el-form-item>
                <el-form-item label="类别" prop="producttype">
                    <el-autocomplete
                        v-model="editCGQDlist.producttype"
                        :fetch-suggestions="querySearchproducttype"
                        placeholder="请输入内容"
                        clearable
                        ><i class="el-icon-edit el-input__icon" slot="suffix" v-if="editCGQDlist.producttype === ''">
                        </i> </el-autocomplete
                ></el-form-item>
                <!-- <el-form-item label="类别" prop="producttype">
                    <el-input v-model="editCGQDlist.producttype" placeholder="请输入" style="width: 160px" clearable
                        ><i class="el-icon-edit el-input__icon" slot="suffix" v-if="editCGQDlist.producttype === ''"> </i
                    ></el-input>
                </el-form-item> -->
                <el-form-item label="零售价" prop="retailprice">
                    <el-input v-model="editCGQDlist.retailprice" placeholder="请输入" style="width: 160px" clearable
                        ><i class="el-icon-edit el-input__icon" slot="suffix" v-if="editCGQDlist.retailprice === ''"> </i
                    ></el-input>
                </el-form-item>
                <el-form-item label="包装系数" prop="specs">
                    <el-input v-model="editCGQDlist.specs" placeholder="请输入" style="width: 160px" clearable
                        ><i class="el-icon-edit el-input__icon" slot="suffix" v-if="editCGQDlist.specs === ''"> </i
                    ></el-input>
                </el-form-item>
                <el-form-item label="保质期" prop="expirydate">
                    <el-input v-model="editCGQDlist.expirydate" placeholder="请输入" style="width: 160px" clearable
                        ><i class="el-icon-edit el-input__icon" slot="suffix" v-if="editCGQDlist.expirydate === ''"> </i
                    ></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button type="info" @click="clear1">清空</el-button>
                <el-button type="danger" @click="cancel1">取 消</el-button>
                <el-button type="primary" @click="saveedit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- /////////添加产品////////////////////////// -->
        <!-- /////////添加产品////////////////////////// -->
        <!-- /////////添加产品////////////////////////// -->
        <!-- /////////添加产品////////////////////////// -->
        <!-- /////////添加产品////////////////////////// -->

        <el-dialog title="添加供应商产品" :visible.sync="addSupplierproduct">
            <el-form ref="addSupplierProductForm" :model="addSupplierProductForm" :rules="rules2" :inline="true">
                <el-form-item label="商品名称" prop="supplierproduct">
                    <el-input v-model="addSupplierProductForm.supplierproduct" placeholder="请输入内容" clearable
                        ><i class="el-icon-edit el-input__icon" slot="suffix" v-if="addSupplierProductForm.supplierproduct === ''">
                        </i> </el-input
                ></el-form-item>
                <el-form-item label="条形码" prop="barcode">
                    <el-input v-model="addSupplierProductForm.barcode" placeholder="请输入内容" clearable
                        ><i class="el-icon-edit el-input__icon" slot="suffix" v-if="addSupplierProductForm.barcode === ''"> </i> </el-input
                ></el-form-item>
                <el-form-item label="品类" prop="producttype">
                    <el-autocomplete
                        v-model="addSupplierProductForm.producttype"
                        :fetch-suggestions="querySearchproducttype"
                        placeholder="请输入内容"
                        clearable
                        ><i class="el-icon-edit el-input__icon" slot="suffix" v-if="addSupplierProductForm.producttype === ''">
                        </i> </el-autocomplete
                ></el-form-item>
                <!-- <el-form-item label="品类" prop="producttype">
                    <el-input v-model="addSupplierProductForm.producttype" placeholder="请输入内容" clearable
                        ><i class="el-icon-edit el-input__icon" slot="suffix" v-if="addSupplierProductForm.producttype === ''"> </i
                    ></el-input>
                </el-form-item> -->
                <el-form-item label="零售价" prop="retailprice">
                    <el-input v-model="addSupplierProductForm.retailprice" placeholder="请输入内容" clearable
                        ><i class="el-icon-edit el-input__icon" slot="suffix" v-if="addSupplierProductForm.retailprice === ''"> </i
                    ></el-input>
                </el-form-item>
                <el-form-item label="箱系数" prop="specs">
                    <el-input v-model="addSupplierProductForm.specs" placeholder="请输入内容" clearable
                        ><i class="el-icon-edit el-input__icon" slot="suffix" v-if="addSupplierProductForm.specs === ''"> </i
                    ></el-input>
                </el-form-item>
                <el-form-item label="保质期" prop="expirydate">
                    <el-input v-model="addSupplierProductForm.expirydate" placeholder="请输入内容" clearable
                        ><i class="el-icon-edit el-input__icon" slot="suffix" v-if="addSupplierProductForm.expirydate === ''"> </i
                    ></el-input>
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
import Album from '@/components/album/album';

export default {
    inject: ['reload'],
    data() {
        return {
            value1: false,
            NOWDATE: this.dayjs().format('YYYY-MM-DD'),
            form: {
                productname: '',
                producttype: '',
                retailprice: '',
                barcode: '',
                specs: '',
                expirydate: ''
            },
            editCGQDVisible: false,
            editCGQDlist: {
                productname: '',
                producttype: '',
                retailprice: '',
                barcode: '',
                specs: '',
                expirydate: ''
            },
            rules: {
                productname: [{ required: true, message: '请输入', trigger: 'blur' }],
                producttype: [{ required: true, message: '请输入', trigger: 'blur' }],
                retailprice: [{ required: true, message: '请输入', trigger: 'blur' }],
                barcode: [{ required: true, message: '请输入', trigger: 'blur' }],
                specs: [{ required: true, message: '请输入', trigger: 'blur' }],
                expirydate: [{ required: true, message: '请输入', trigger: 'blur' }]
            },
            addSupplierproduct: false,
            addSupplierProductForm: {
                supplierproduct: '',
                producttype: '',
                retailprice: '',
                barcode: '',
                specs: '',
                expirydate: ''
            },
            rules2: {
                supplierproduct: [{ required: true, message: '请输入', trigger: 'blur' }],
                producttype: [{ required: true, message: '请输入', trigger: 'blur' }],
                retailprice: [{ required: true, message: '请输入', trigger: 'blur' }],
                barcode: [{ required: true, message: '请输入', trigger: 'blur' }],
                specs: [{ required: true, message: '请输入', trigger: 'blur' }],
                expirydate: [{ required: true, message: '请输入', trigger: 'blur' }]
            },
            input: '',
            list: [],
            listTable: [],
            ////////////分页有关
            ////////////分页有关
            ////////////分页有关
            ////////////分页有关
            ////////////分页有关
            total: '',
            currentIndex: 1,
            pageSize: 10,
            tableData: [],
            ///多选////
            ///多选////
            ///多选////
            ///多选////
            ///多选////
            sels: [],
            CGQDsearch8A: [],
            ///////////////////
            ///////////////////
            ///////////////////
            ///////////////////
            ///////////////////
            ///////////////////

            // classList: [],
            listTable2: [],
            listTableIndex: 0
        };
    },

    created() {
        this.listGET();
    },
    computed: {
        pageNum() {
            return Math.ceil(this.tableData.length / this.pageSize);
        }
    },
    async mounted() {
        //带输入建议////////////////////////////////////
        //带输入建议///////////品类////////////////////
        //带输入建议////////////////////////////////////
        let CGQDsearch8 = await this.axios({
            path: '/user/CGQDsearch8'
        });
        this.CGQDsearch8A = CGQDsearch8;
        this.CGQDsearch8A.forEach((item) => {
            this.$set(item, 'value', item.producttype);
            //  const a= JSON.parse(item.productname);
            delete item.producttype;
            //   console.log(a);
        });
        this.restaurants3 = this.CGQDsearch8A;
    },

    // components: {
    //     Album
    // },
    methods: {
        //带输入建议////////////////////////////////////
        //带输入建议////////////////////////////////////
        //带输入建议////////////////////////////////////
        //带输入建议////////////////////////////////////
        //带输入建议////////////////////////////////////
        //带输入建议////////////////////////////////////
        querySearchproducttype(queryString, cb) {
            var restaurants3 = this.restaurants3;
            var results = queryString ? restaurants3.filter(this.createStateFilter(queryString)) : restaurants3;
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                cb(results);
            }, 1000 * Math.random());
        },

        createStateFilter(queryString) {
            return (state) => {
                return state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
            };
        },
        //导出为EXCEL
        //导出为EXCEL
        //导出为EXCEL
        //导出为EXCEL
        //导出为EXCEL
        //格式转换,不需要改动
        formatJson(filterVal, jsonData) {
            return jsonData.map((v) => filterVal.map((j) => v[j]));
        },
        async outExcel() {
            if (this.sels.length === 0) {
                this.$notify({
                    title: '请选择需要导出的数据',
                    type: 'warning'
                });
            } else {
                for (let index = 0; index < this.sels.length; index++) {
                    var ids = this.sels.map((item) => item.barcode).join();
                    ids = ids.replace(/,/g, ' ');
                    ids = ids.split(' ');
                    ids = ids[index];
                    let result = await this.axios({
                        path: '/user/CGQDsearch7',
                        method: 'get',
                        data: {
                            barcode: ids
                        }
                    });
                    this.listTable = this.listTable.concat(result);
                }
                require.ensure([], () => {
                    const { export_json_to_excel } = require('@/Excel/Export2Excel'); //注意这个Export2Excel路径
                    const tHeader = ['商品名称', '条形码', '类别', '零售价（元）', '包装系数', '保质期']; // 上面设置Excel的表格第一行的标题
                    const filterVal = ['productname', 'barcode', 'producttype', 'retailprice', 'specs', 'expirydate']; // 上面的index、nickName、name是tableData里对象的属性key值
                    const list = this.listTable; //把要导出的数据tableData存到list
                    const data = this.formatJson(filterVal, list);
                    const filename = '供应清单';
                    export_json_to_excel(tHeader, data, filename); //最后一个是表名字
                });
                this.$notify({
                    title: '成功导出',
                    message: '请耐心等待',
                    type: 'success'
                });
                this.$refs.multipleTable.clearSelection();
            }
        },
        //多选////////////////
        //多选////////////////
        //多选////////////////
        //多选////////////////
        //多选////////////////
        async expandchange(row) {
            this.$message.error('选中状态发生变化时做出更改');
        },
        async handleSelectionChange(sels) {
            this.sels = sels;
        },
        //分页////////////////
        //分页////////////////
        //分页////////////////
        //分页////////////////
        //分页////////////////
        //前后页/////////////////////////////////////////////////////////////////////////////
        handleCurrentChange(val) {
            this.currentIndex = val;
            this.list = [];
            this.tableData.forEach((data, index) => {
                if (index >= (this.currentIndex - 1) * this.pageSize && index < this.currentIndex * this.pageSize) {
                    this.list.push(data);
                }
            });
        },
        //分页容量size(怎么实现刷新后保留格式,和头个使用)/////////////////////////////////////////////////////////////////////////////
        handleSizeChange(val) {
            this.pageSize = val;
            this.list = [];
            this.tableData.forEach((data, index) => {
                if (index >= (this.currentIndex - 1) * this.pageSize && index < this.currentIndex * this.pageSize) {
                    this.list.push(data);
                }
            });
        },
        //获取页面数据并分段分页/////////////////////////////////////////////////////////////////////////////
        async list() {},
        ////供应清单显示////////////
        ////供应清单显示////////////
        ////供应清单显示////////////
        ////供应清单显示////////////
        ////供应清单显示////////////
        async listGET() {
            // swal({
            //     title: '等待加载...',
            //     // text: '2秒后自动关闭。',
            //     imageUrl: 'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3',
            //     timer: 2000,
            //     showConfirmButton: false
            // });
            let res = await this.axios({
                path: '/user/CGQDsearch5',
                method: 'get',
                data: {
                    planinputtime: this.dayjs().format('YYYY-MM-DD')
                }
            });

            // this.list = res;
            let newArr = [];
            res.forEach((item, i) => {
                let index = -1;
                let isExists = newArr.some((newItem, j) => {
                    if (item.productname == newItem.productname) {
                        index = j;
                        return true;
                    }
                });
                if (!isExists) {
                    newArr.push({
                        productname: item.productname,
                        producttype: item.producttype,
                        retailprice: item.retailprice,
                        barcode: item.barcode,
                        specs: item.specs,
                        expirydate: item.expirydate,
                        planinputtime: item.planinputtime,
                        number: item.number,
                        CGJHsuppliername: item.CGJHsuppliername,
                        subList: [item]
                    });
                } else {
                    newArr[index].subList.push(item);
                }
                // this.list = newArr;
                this.tableData = newArr;
            });
            ///分页///
            ///分页///
            ///分页///
            this.tableData.forEach((data, index) => {
                if (index >= (this.currentIndex - 1) * this.pageSize && index < this.currentIndex * this.pageSize) {
                    this.list.push(data);
                    this.total = this.tableData.length;
                }
            });
        },
        //查询商品////////////////
        //查询商品////////////////
        //查询商品////////////////
        //查询商品////////////////
        //查询商品////////////////
        async searchsubmit() {
            if (this.input) {
                let CGQDsearch6 = await this.axios({
                    path: '/user/CGQDsearch6',
                    method: 'get',
                    data: {
                        productname: '%' + this.input + '%'
                    }
                });

                if (CGQDsearch6.length == 0) {
                    this.$notify({
                        title: '查无数据',
                        type: 'warning'
                    });
                } else {
                    // this.list = CGQDsearch6;
                    this.$notify({
                        title: '查询成功',
                        type: 'success'
                    });
                    this.input = '';
                    let newArr = [];
                    CGQDsearch6.forEach((item, i) => {
                        let index = -1;
                        let isExists = newArr.some((newItem, j) => {
                            if (item.productname == newItem.productname) {
                                index = j;
                                return true;
                            }
                        });
                        if (!isExists) {
                            newArr.push({
                                productname: item.productname,
                                producttype: item.producttype,
                                retailprice: item.retailprice,
                                barcode: item.barcode,
                                specs: item.specs,
                                expirydate: item.expirydate,
                                planinputtime: item.planinputtime,
                                number: item.number,
                                CGJHsuppliername: item.CGJHsuppliername,
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
        ////表格筛选////////////
        ////表格筛选////////////
        ////表格筛选////////////
        ////表格筛选////////////
        filterTag(value, row) {
            if (value === this.NOWDATE) {
                return row.planinputtime === value;
            }
            if (value === null) {
                return row.subList[0].suppliername === value;
            }
            if (value === '暂无计划') {
                return row.planinputtime !== this.NOWDATE;
            }
            if (value === '有供应商') {
                return row.subList[0].suppliername !== null;
            }
        },
        //新增商品/////////////
        //新增商品/////////////
        //新增商品/////////////
        //新增商品/////////////
        //新增商品/////////////
        cancel2() {
            this.addSupplierproduct = false;
            this.$refs['addSupplierProductForm'].resetFields();
        },
        clear2() {
            this.$refs['addSupplierProductForm'].resetFields();
        },

        addsubmit() {
            this.addSupplierproduct = true;
        },
        async saveaddSupplierproduct() {
            this.$refs['addSupplierProductForm'].validate(async (valid) => {
                if (!valid) return;
                let { addSupplierProductForm } = this;
                this.axios({
                    path: '/user/CGQDadd1',
                    method: 'POST',
                    data: {
                        productname: addSupplierProductForm.supplierproduct,
                        producttype: addSupplierProductForm.producttype,
                        retailprice: addSupplierProductForm.retailprice,
                        barcode: addSupplierProductForm.barcode,
                        specs: addSupplierProductForm.specs,
                        expirydate: addSupplierProductForm.expirydate
                    }
                })
                    .then(() => {
                        this.reload();
                        this.addSupplierproduct = false;
                        this.$notify({
                            title: '添加成功！',
                            type: 'success'
                        });
                    })
                    .catch((err) => {
                        this.$message.error(err.message);
                    });
            });
        },
        //编辑清单/////////////
        //编辑清单/////////////
        //编辑清单/////////////
        //编辑清单/////////////
        //编辑清单/////////////
        async edit(index, row) {
            this.editCGQDVisible = true;
            this.editCGQDlist.productname = this.list[index].productname;
            this.editCGQDlist.producttype = this.list[index].producttype;
            this.editCGQDlist.retailprice = this.list[index].retailprice;
            this.editCGQDlist.barcode = this.list[index].barcode;
            this.editCGQDlist.specs = this.list[index].specs;
            this.editCGQDlist.expirydate = this.list[index].expirydate;
        },
        clear1() {
            this.editCGQDlist.productname = '';
            this.editCGQDlist.producttype = '';
            this.editCGQDlist.retailprice = '';
            this.editCGQDlist.specs = '';
            this.editCGQDlist.expirydate = '';
        },
        cancel1() {
            this.editCGQDVisible = false;
            this.$refs['editCGQDlist'].resetFields();
        },
        async saveedit() {
            this.$refs['editCGQDlist'].validate(async (valid) => {
                if (!valid) return;
                this.axios({
                    path: '/user/CGQDedit1',
                    method: 'POST',
                    data: {
                        productname: this.editCGQDlist.productname,
                        producttype: this.editCGQDlist.producttype,
                        retailprice: this.editCGQDlist.retailprice,
                        barcode: this.editCGQDlist.barcode,
                        specs: this.editCGQDlist.specs,
                        expirydate: this.editCGQDlist.expirydate
                    }
                })
                    .then(() => {
                        this.reload();
                        this.editCGQDVisible = false;
                        this.$notify({
                            title: '修改成功！',
                            type: 'success'
                        });
                    })
                    .catch((err) => {
                        this.$message.error(err.message);
                    });
            });
        },

        //计划添加/////////////
        //计划添加/////////////
        //计划添加/////////////
        //计划添加/////////////
        //计划添加/////////////
        async addCGJH(index, row) {
            this.axios({
                path: '/user/CGJHadd1',
                method: 'POST',
                data: {
                    number: this.list[index].number1,
                    CGJHsuppliername: this.list[index].suppliername,
                    planinputtime: this.NOWDATE,
                    CGJHbarcode: this.list[index].barcode
                }
            })
                .then(() => {
                    this.list = [];
                    this.listGET();
                    this.value = true;
                    this.$notify({
                        title: '成功添加！',
                        type: 'success'
                    });
                })
                .catch((err) => {
                    this.$message.error(err.message);
                });
        },
        //采购清单删除/////////////
        //采购清单删除/////////////
        //采购清单删除/////////////
        //采购清单删除/////////////
        //采购清单删除/////////////
        deleteCGQD(row, index) {
            this.axios({
                path: '/user/CGQDdelete1',
                method: 'POST',
                data: {
                    barcode: this.list[index].barcode
                }
            })
                .then(() => {
                    this.reload();
                    this.$notify({
                        title: '成功删除！',
                        type: 'success'
                    });
                })
                .catch((err) => {
                    this.$message.error(err.message);
                });
        },
        //计划删除/////////////
        //计划删除/////////////
        //计划删除/////////////
        //计划删除/////////////
        //计划删除/////////////
        deleteCGJH(row, index) {
            this.axios({
                path: '/user/CGJHdelete1',
                method: 'POST',
                data: {
                    CGJHbarcode: this.list[index].barcode,
                    planinputtime: this.list[index].planinputtime + ''
                }
            })
                .then(() => {
                    this.$notify({
                        title: '成功删除！',
                        type: 'success'
                    });
                })
                .catch((err) => {
                    this.$message.error(err.message);
                });
            this.$set(this.list[index], 'number', null);
            this.$set(this.list[index], 'CGJHsuppliername', null);
            this.$set(this.list[index], 'planinputtime', null);
        }
    }
};
</script>
<style  scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 100px;
    height: 100px;
    object-fit: cover;
}
.per {
    color: #67c23a;
}
</style>
