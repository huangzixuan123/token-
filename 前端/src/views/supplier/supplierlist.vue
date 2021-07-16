<template>
    <div>
        <div style="margin-top: -5px">
            <el-button type="primary" @click="addsubmit()" size="mini">添加</el-button>
            <el-input
                placeholder="请输入内容"
                v-model="input"
                class="input-with-select"
                style="max-width: 330px; float: right"
                size="mini"
                clearable
            >
                <el-button v-if="input === ''" slot="append" icon="el-icon-refresh-right" @click="searchsubmit()"></el-button>
                <el-button v-else slot="append" icon="el-icon-search" @click="searchsubmit()"></el-button>
                <i class="el-icon-search el-input__icon" slot="suffix" v-if="input === ''"> </i>
            </el-input>
        </div>
        <el-table
            :data="list"
            border
            class="table"
            ref="multipleTable"
            :row-key="getRowKeyOfTarget"
            @expand-change="expandchange"
            :span-method="objectSpanMethod"
            style="width: 100vw; margin-top: 5px"
            v-loading="loading"
            :cell-style="{ padding: '0px' }"
            height="window.getComputedStyle(this.$refs.table).height"
            size="mini"
        >
            <!-- <el-table-column fixed type="selection" :reserve-selection="true"></el-table-column> -->
            <el-table-column fixed prop="suppliername" label="供应商名称" align="center">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <p>联系人: {{ scope.row.phonename }}</p>
                        <p>联系方式: {{ scope.row.phonenumber }}</p>
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium">{{ scope.row.suppliername }}</el-tag>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column prop="phonenumber" label="联系方式" align="center"></el-table-column>
            <el-table-column prop="phonename" label="联系人" align="center"></el-table-column>

            <el-table-column label="供应商信息操作" align="center" width="150px">
                <template slot-scope="scope">
                    <el-button
                        type="success"
                        icon="el-icon-circle-plus-outline"
                        size="mini"
                        circle
                        @click="SupplierProducthandleadd(scope.$index, scope.row)"
                    ></el-button>
                    <el-button
                        type="primary"
                        icon="el-icon-edit"
                        size="mini"
                        circle
                        @click="SupplierhandleEdit(scope.$index, scope.row)"
                    ></el-button>
                    <el-button type="text">
                        <el-popconfirm
                            confirm-button-text="好的"
                            cancel-button-text="不用了"
                            @onConfirm="handleDelete(scope.row.id, scope.$index)"
                            icon="el-icon-info"
                            icon-color="red"
                            title="确定删除该供应商所有信息吗？"
                        >
                            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" circle></el-button>
                        </el-popconfirm>
                    </el-button>
                </template>
            </el-table-column>

            <el-table-column label="供应商商品详情信息" align="center">
                <el-table-column prop="productname" label="商品名称" align="center">
                    <template scope="scope">
                        <span v-if="scope.row.productname === null" style="color: blue">待添加</span>
                        <span v-else>{{ scope.row.productname }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="productbarcode" label="条形码" align="center">
                    <template scope="scope">
                        <span v-if="scope.row.productbarcode === '待添加'" style="color: blue">待添加</span>
                        <span v-else>{{ scope.row.productbarcode }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="specs" label="包装系数" align="center">
                    <template scope="scope">
                        <span v-if="scope.row.specs === null" style="color: blue">待添加</span>
                        <span v-else>{{ scope.row.specs }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="producttype" label="商品种类" align="center">
                    <template scope="scope">
                        <span v-if="scope.row.producttype === null" style="color: blue">待添加</span>
                        <span v-else>{{ scope.row.producttype }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="expirydate" label="保质期" align="center">
                    <template scope="scope">
                        <span v-if="scope.row.expirydate === null" style="color: blue">待添加</span>
                        <span v-else>{{ scope.row.expirydate }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="retailprice" label="零售价（元）" align="center">
                    <template scope="scope">
                        <span v-if="scope.row.retailprice === null" style="color: blue">待添加</span>
                        <span v-else>{{ scope.row.retailprice }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="所属产品操作" width="150" align="center">
                    <template slot-scope="scope">
                        <el-button type="text">
                            <el-popconfirm
                                confirm-button-text="好的"
                                cancel-button-text="不用了"
                                @onConfirm="handleDeleteproduct(scope.row.id, scope.$index)"
                                icon="el-icon-info"
                                icon-color="red"
                                title="确定删除该供应商产品的信息吗？"
                            >
                                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" circle></el-button>
                            </el-popconfirm>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table-column>
        </el-table>

        <!-- 添加供应商资料 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-->
        <!-- 添加供应商资料 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-->
        <!-- 添加供应商资料 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-->
        <!-- 添加供应商资料 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-->
        <!-- 添加供应商资料 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-->
        <!-- 添加供应商资料 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-->
        <!-- 添加供应商资料 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-->
        <!-- 添加供应商资料 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-->
        <el-dialog title="添加供应商资料" :visible.sync="addVisible" width="400px">
            <el-form ref="form" :model="addlist" label-width="100px" :rules="rules">
                <el-form-item label="供应商名称" prop="suppliername">
                    <el-input v-model="addlist.suppliername" placeholder="输入要添加的供应商名称" style="width: 214px" clearable
                        ><i class="el-icon-edit el-input__icon" slot="suffix" v-if="addlist.suppliername === ''"> </i
                    ></el-input>
                </el-form-item>
                <el-form-item label="联系方式" prop="phonenumber">
                    <el-input v-model="addlist.phonenumber" placeholder="输入要添加的联系方式" style="width: 214px" clearable
                        ><i class="el-icon-edit el-input__icon" slot="suffix" v-if="addlist.phonenumber === ''"> </i
                    ></el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="phonename">
                    <el-input v-model="addlist.phonename" placeholder="输入要添加的联系人" style="width: 214px" clearable
                        ><i class="el-icon-edit el-input__icon" slot="suffix" v-if="addlist.phonename === ''"> </i
                    ></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button type="info" @click="clear1">清空</el-button>
                <el-button type="danger" @click="cancel1">取 消</el-button>
                <el-button type="primary" @click="saveadd">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 添加供应商商品 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-->
        <!-- 添加供应商商品 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-->
        <!-- 添加供应商商品 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-->
        <!-- 添加供应商商品 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-->
        <!-- 添加供应商商品 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-->
        <!-- 添加供应商商品 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-->
        <!-- 添加供应商商品 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-->
        <!-- 添加供应商商品 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-->
        <el-dialog title="添加供应商产品" :visible.sync="addSupplierproduct">
            <el-form ref="addSupplierProductForm" :model="addSupplierProductForm" :rules="rules2" :inline="true">
                <el-form-item label="供应商" prop="suppliername">
                    <el-input v-model="addSupplierProductForm.suppliername" placeholder="请输入内容" clearable disabled="false"
                        ><i class="el-icon-edit el-input__icon" slot="suffix" v-if="addSupplierProductForm.producttype === ''"> </i
                    ></el-input>
                </el-form-item>
                <el-form-item label="商品名称" prop="supplierproduct">
                    <el-autocomplete
                        v-model="addSupplierProductForm.supplierproduct"
                        :fetch-suggestions="querySearchsupplierproduct"
                        placeholder="请输入内容"
                        @select="handleSelectsupplierproduct"
                        clearable
                        ><i class="el-icon-edit el-input__icon" slot="suffix" v-if="addSupplierProductForm.supplierproduct === ''">
                        </i> </el-autocomplete
                ></el-form-item>
                <el-form-item label="条形码" prop="barcode">
                    <el-autocomplete
                        v-model="addSupplierProductForm.barcode"
                        :fetch-suggestions="querySearchbarcode"
                        placeholder="请输入内容"
                        @select="handleSelectbarcode"
                        clearable
                        ><i class="el-icon-edit el-input__icon" slot="suffix" v-if="addSupplierProductForm.barcode === ''">
                        </i> </el-autocomplete
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
        <!-- 编辑弹出框(供应商不包括商品信息) ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-->
        <!-- 编辑弹出框(供应商不包括商品信息) ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-->
        <!-- 编辑弹出框(供应商不包括商品信息) ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-->
        <!-- 编辑弹出框(供应商不包括商品信息) ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-->
        <!-- 编辑弹出框(供应商不包括商品信息) ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-->

        <el-dialog title="编辑供应商资料" :visible.sync="EditSupplierVisible" width="400px">
            <el-form ref="EditSupplierForm" :model="EditSupplierForm" label-width="100px" :rules="rules">
                <el-form-item label="供应商名称" prop="suppliername">
                    <el-input v-model="EditSupplierForm.suppliername" placeholder="输入要修改的供应商名称" style="width: 214px" clearable
                        ><i class="el-icon-edit el-input__icon" slot="suffix" v-if="EditSupplierForm.suppliername === ''"> </i
                    ></el-input>
                </el-form-item>
                <el-form-item label="联系方式" prop="phonenumber">
                    <el-input v-model="EditSupplierForm.phonenumber" placeholder="输入要修改的联系方式" style="width: 214px" clearable
                        ><i class="el-icon-edit el-input__icon" slot="suffix" v-if="EditSupplierForm.phonenumber === ''"> </i
                    ></el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="phonename">
                    <el-input v-model="EditSupplierForm.phonename" placeholder="输入要修改的联系人" style="width: 214px" clearable
                        ><i class="el-icon-edit el-input__icon" slot="suffix" v-if="EditSupplierForm.phonename === ''"> </i
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="info" @click="clear3">返回值</el-button>
                <el-button type="danger" @click="cancel3">取 消</el-button>
                <el-button type="primary" @click="SaveEditSupplier">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import Tags from '../../components/common/Tags.vue';
export default {
    components: { Tags },
    //局部刷新有关，方法衔接，衔接home.vue
    inject: ['reload'],
    data() {
        return {
            restaurants: [],
            state: '',
            timeout: null,
            CGQDsearch1A: [],
            CGQDsearch3A: [],
            CGQDsearch8A: [],
            addVisible: false,
            loading: false,
            input: '',
            addSupplierproduct: false,
            EditSupplierVisible: false,

            form: {
                suppliername: '',
                phonenumber: '',
                phonename: ''
            },
            addSupplierProductForm: {
                supplierproduct: '',
                producttype: '',
                retailprice: '',
                barcode: '',
                specs: '',
                expirydate: ''
            },
            EditSupplierForm: {
                suppliername: '',
                phonenumber: '',
                phonename: ''
            },
            rules: {
                suppliername: [{ required: true, message: '请输入', trigger: 'blur' }],
                phonenumber: [{ required: true, message: '请输入', trigger: 'blur' }],
                phonename: [{ required: true, message: '请输入', trigger: 'blur' }]
            },
            rules2: {
                supplierproduct: [{ required: true, message: '请输入', trigger: 'blur' }],
                producttype: [{ required: true, message: '请输入', trigger: 'blur' }],
                retailprice: [{ required: true, message: '请输入', trigger: 'blur' }],
                barcode: [{ required: true, message: '请输入', trigger: 'blur' }],
                specs: [{ required: true, message: '请输入', trigger: 'blur' }],
                expirydate: [{ required: true, message: '请输入', trigger: 'blur' }]
            },
            addlist: {
                suppliername: '',
                phonenumber: '',
                phonename: ''
            },
            // 单元合并
            spanList: [],
            number: 0,

            tableList: [],
            tableList2: [],
            list: [],
            ////////////////////
            ////////////////////
            ////////////////////
            ////////////////////
            ////////////////////
            sels: [], //选中的值显示(批量删除按钮那有关，方法在下面也有)
            //删除后是否进行编辑
            editproduct: [],
            //excel用
            ExcelTable: [],
            i: 0,
            //查询有关
            keywords: '',
            //添加加模态框添加input有关
            items: [],
            items1: [],
            items2: [],
            items3: [],
            supplierproduct: '',
            //添加：增加input有关
            a: 0,
            //分页有关
            total: '',
            currentIndex: 1,
            pageSize: 5,
            tableData: [],

            //懒加载
            id: 0,

            EditSupplierProductForm: {
                supplierproduct: '',
                producttype: '',
                retailprice: ''
            },

            classList: []
        };
    },
    created() {
        this.listGET();
        this.CGQDsearch1();
    },
    async mounted() {
        //带输入建议////////////////////////////////////
        //带输入建议///////////产品/////////////////////
        //带输入建议////////////////////////////////////
        //带输入建议////////////////////////////////////
        //带输入建议////////////////////////////////////
        let CGQDsearch1 = await this.axios({
            path: '/user/CGQDsearch1'
        });
        this.CGQDsearch1A = CGQDsearch1;
        this.CGQDsearch1A.forEach((item) => {
            this.$set(item, 'value', item.productname);
            //  const a= JSON.parse(item.productname);
            delete item.productname;
            //   console.log(a);
        });
        this.restaurants1 = this.CGQDsearch1A;
        //带输入建议////////////////////////////////////
        //带输入建议///////////条形码////////////////////
        //带输入建议////////////////////////////////////
        let CGQDsearch3 = await this.axios({
            path: '/user/CGQDsearch3'
        });
        this.CGQDsearch3A = CGQDsearch3;
        this.CGQDsearch3A.forEach((item) => {
            this.$set(item, 'value', item.barcode);
            //  const a= JSON.parse(item.productname);
            delete item.barcode;
            //   console.log(a);
        });
        this.restaurants2 = this.CGQDsearch3A;
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

    methods: {
        //查询////////////////////////////////////
        //查询////////////////////////////////////
        //查询////////////////////////////////////
        //查询////////////////////////////////////
        //查询////////////////////////////////////
        async searchsubmit() {
            if (this.input) {
                let GYSsearch3 = await this.axios({
                    path: '/user/GYSsearch3',
                    method: 'get',
                    data: {
                        suppliername: '%' + this.input + '%'
                        // productname: this.input
                    }
                });
                if (GYSsearch3.length == 0) {
                    this.$notify({
                        title: '查无数据',
                        type: 'warning'
                    });
                } else {
                    this.list = GYSsearch3;
                    this.$notify({
                        title: '查询成功',
                        type: 'success'
                    });
                    this.input = '';
                }
            } else {
                this.reload();
            }
        },

        //编辑（供应商）//////////////////
        //编辑（供应商）//////////////////
        //编辑（供应商）//////////////////
        //编辑（供应商）//////////////////
        //编辑（供应商）//////////////////
        clear3() {
            this.$refs['EditSupplierForm'].resetFields();
        },
        cancel3() {
            this.EditSupplierVisible = false;
            this.$refs['EditSupplierForm'].resetFields();
        },
        SupplierhandleEdit(index) {
            this.EditSupplierForm.suppliername = this.list[index].suppliername;
            this.EditSupplierForm.phonenumber = this.list[index].phonenumber;
            this.EditSupplierForm.phonename = this.list[index].phonename;
            this.EditSupplierVisible = true;
            this.suppliername = this.list[index].suppliername;
        },
        async SaveEditSupplier() {
            let result = await this.axios({
                path: '/user/GYSsearch2',
                method: 'get',
                data: {
                    suppliername: this.suppliername
                }
            });
            for (let index = 0; index < result.length; index++) {
                this.$refs['EditSupplierForm'].validate(async (valid) => {
                    if (!valid) return;
                    this.axios({
                        path: '/user/GYSedit1',
                        method: 'POST',
                        data: {
                            suppliername: this.EditSupplierForm.suppliername,
                            phonenumber: this.EditSupplierForm.phonenumber,
                            phonename: this.EditSupplierForm.phonename,
                            id: result[index].id
                        }
                    })
                        .then(() => {
                            if (index == 0) {
                                this.listGET();
                                this.EditSupplierVisible = false;
                                this.$notify({
                                    title: '修改成功！',
                                    type: 'success'
                                });
                            }
                        })
                        .catch((err) => {
                            this.$message.error(err.message);
                        });
                });
            }
        },
        //删除（删供应商）//////////////////
        //删除（删供应商）//////////////////
        //删除（删供应商）//////////////////
        //删除（删供应商）//////////////////
        //删除（删供应商）//////////////////
        async handleDelete(id, index) {
            this.axios({
                path: '/user/GYSdelete2',
                method: 'POST',
                data: {
                    suppliername: this.list[index].suppliername
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

        //删除（删供应商的商品）//////////////////
        //删除（删供应商的商品）//////////////////
        //删除（删供应商的商品）//////////////////
        //删除（删供应商的商品）//////////////////
        //删除（删供应商的商品）//////////////////
        async handleDeleteproduct(id, index) {
            this.axios({
                path: '/user/GYSdelete1',
                method: 'POST',
                data: {
                    suppliername: this.list[index].suppliername,
                    productbarcode: this.list[index].productbarcode
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
        //添加供应商品////////////////////////////////////
        //添加供应商品////////////////////////////////////
        //添加供应商品////////////////////////////////////
        //添加供应商品////////////////////////////////////
        //添加供应商品////////////////////////////////////
        cancel2() {
            this.addSupplierproduct = false;
            this.$refs['addSupplierProductForm'].resetFields();
        },
        clear2() {
            this.$refs['addSupplierProductForm'].resetFields();
        },
        SupplierProducthandleadd(index) {
            this.addSupplierProductForm.suppliername = this.list[index].suppliername;
            this.addSupplierProductForm.phonenumber = this.list[index].phonenumber;
            this.addSupplierProductForm.phonename = this.list[index].phonename;
            this.addSupplierproduct = true;
        },
        async saveaddSupplierproduct() {
            let a = this.a;
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
                });
                this.axios({
                    path: '/user/GYSdelete1',
                    method: 'POST',
                    data: {
                        suppliername: addSupplierProductForm.suppliername,
                        productbarcode: '待添加'
                    }
                });
                this.axios({
                    path: '/user/supplieradd1',
                    method: 'POST',
                    data: {
                        suppliername: this.addSupplierProductForm.suppliername,
                        phonenumber: this.addSupplierProductForm.phonenumber,
                        phonename: this.addSupplierProductForm.phonename,
                        productbarcode: addSupplierProductForm.barcode
                    }
                })
                    .then(() => {
                        this.$refs['addSupplierProductForm'].resetFields();
                        this.addSupplierproduct = false;
                        this.listGET();
                        this.$notify({
                            title: '成功添加！',
                            type: 'success'
                        });
                    })
                    .catch((err) => {
                        this.$message.error(err.message);
                    });
            });
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
        querySearchbarcode(queryString, cb) {
            var restaurants2 = this.restaurants2;
            var results = queryString ? restaurants2.filter(this.createStateFilter(queryString)) : restaurants2;
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                cb(results);
            }, 1000 * Math.random());
        },
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
        async handleSelectsupplierproduct(item) {
            console.log(item);
            let CGQDsearch2 = await this.axios({
                path: '/user/CGQDsearch2',
                method: 'get',
                data: {
                    productname: item.value
                }
            });
            this.addSupplierProductForm.barcode = CGQDsearch2[0].barcode;
            this.addSupplierProductForm.producttype = CGQDsearch2[0].producttype;
            this.addSupplierProductForm.retailprice = CGQDsearch2[0].retailprice;
            this.addSupplierProductForm.specs = CGQDsearch2[0].specs;
            this.addSupplierProductForm.expirydate = CGQDsearch2[0].expirydate;
        },
        async handleSelectbarcode(item) {
            console.log(item);
            let CGQDsearch2 = await this.axios({
                path: '/user/CGQDsearch4',
                method: 'get',
                data: {
                    barcode: item.value
                }
            });
            this.addSupplierProductForm.supplierproduct = CGQDsearch2[0].productname;
            this.addSupplierProductForm.producttype = CGQDsearch2[0].producttype;
            this.addSupplierProductForm.retailprice = CGQDsearch2[0].retailprice;
            this.addSupplierProductForm.specs = CGQDsearch2[0].specs;
            this.addSupplierProductForm.expirydate = CGQDsearch2[0].expirydate;
        },

        //获取页面数据并分段分页/////////////////////////////////////////////////////////////////////////////
        //获取页面数据并分段分页/////////////////////////////////////////////////////////////////////////////
        //获取页面数据并分段分页/////////////////////////////////////////////////////////////////////////////
        //获取页面数据并分段分页/////////////////////////////////////////////////////////////////////////////
        //获取页面数据并分段分页/////////////////////////////////////////////////////////////////////////////
        //获取页面数据并分段分页/////////////////////////////////////////////////////////////////////////////

        async listGET() {
            //懒加载
            // this.loading = true;
            // setTimeout(() => {
            //     this.loading = false;
            // }, 1700);
            // swal({
            //     title: '等待加载...',
            //     // text: '2秒后自动关闭。',
            //     imageUrl: 'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3',

            //     timer: 2000,
            //     showConfirmButton: false
            // });

            this.list = [];
            let result = await this.axios({
                path: '/user/suppliersearch1'
            });
            this.list = result;
            // this.$message.success(JSON.stringify(result));

            let contactDot = this.list[0].suppliername;
            let numberNow = this.number;
            let spanArr = [];
            let data = this.list;
            data.forEach((item, index) => {
                // 遍历数据记录需要合并的行数保存在spanArr中
                if (item.suppliername === contactDot) {
                    // 相同
                    numberNow += 1;
                } else {
                    spanArr.push(numberNow);
                    contactDot = item.suppliername; // 重新赋值标识
                    while (numberNow > 1) {
                        // 赋值0
                        spanArr.push(0);
                        numberNow -= 1;
                    }
                }
                if (index === data.length - 1) {
                    // 到最后一个了，把没有push的项处理完
                    spanArr.push(numberNow);
                    contactDot = item.suppliername;
                    while (numberNow > 1) {
                        spanArr.push(0);
                        numberNow -= 1;
                    }
                }
            });
            this.spanList = spanArr;
        },
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 1 || columnIndex === 0 || columnIndex === 2 || columnIndex === 3) {
                // 第一列、第二列和第三列
                if (this.spanList[rowIndex] === 0) {
                    return {
                        rowspan: 0,
                        colspan: 0
                    };
                } else {
                    return {
                        rowspan: this.spanList[rowIndex],
                        colspan: 1
                    };
                }
            }
        },

        //添加供应商////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //添加供应商////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //添加供应商////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //添加供应商////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //添加供应商////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //添加供应商////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        clear1() {
            this.$refs['form'].resetFields();
        },
        addsubmit() {
            this.addVisible = true;
        },
        cancel1() {
            this.addVisible = false;
            this.$refs['form'].resetFields();
        },
        async saveadd() {
            // let a = this.a;
            this.$refs['form'].validate(async (valid) => {
                if (!valid) return;
                let { addlist } = this;
                let GYSsearch2 = await this.axios({
                    path: '/user/GYSsearch2',
                    method: 'get',
                    data: {
                        suppliername: addlist.suppliername
                    }
                });
                if (GYSsearch2.length == 0) {
                    this.axios({
                        path: '/user/supplieradd1',
                        method: 'POST',
                        data: {
                            suppliername: addlist.suppliername,
                            phonenumber: addlist.phonenumber,
                            phonename: addlist.phonename,
                            productbarcode: '待添加'
                        }
                    })
                        .then(() => {
                            this.$refs['form'].resetFields();
                            this.addVisible = false;
                            this.listGET();
                            this.$notify({
                                title: '成功添加！',
                                type: 'success'
                            });
                        })
                        .catch((err) => {
                            this.$message.error(err.message);
                        });
                } else {
                    this.$notify({
                        title: '已经有该供应商！',
                        type: 'warning'
                    });
                }
            });
        },

        ////////////////////////////////////////////////////////////////////////////////////////////////

        ////////////////////////////////////////////////////////////////////////////////////////////////

        ////////////////////////////////////////////////////////////////////////////////////////////////

        ////////////////////////////////////////////////////////////////////////////////////////////////

        // excel导入////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        importf(obj) {
            let that = this;
            let inputDOM = this.$refs.inputer; // 通过DOM取文件数据
            this.file = event.currentTarget.files[0];
            var rABS = false; //是否将文件读取为二进制字符串
            var f = this.file;
            var reader = new FileReader();
            FileReader.prototype.readAsBinaryString = function (f) {
                var binary = '';
                var rABS = false; //是否将文件读取为二进制字符串
                var pt = this;
                var wb; //读取完成的数据
                var outdata;
                var reader = new FileReader();
                reader.onload = function (e) {
                    var bytes = new Uint8Array(reader.result);
                    var length = bytes.byteLength;
                    for (var i = 0; i < length; i++) {
                        binary += String.fromCharCode(bytes[i]);
                    }
                    var XLSX = require('xlsx');
                    if (rABS) {
                        wb = XLSX.read(btoa(fixdata(binary)), {
                            //手动转化
                            type: 'base64'
                        });
                    } else {
                        wb = XLSX.read(binary, {
                            type: 'binary'
                        });
                    }
                    // outdata就是你想要的东西 excel导入的数据
                    outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
                    // excel 数据再处理
                    let arr = [];
                    // 这里需要注意名字一定要和excel的内容的文字对上
                    outdata.map((v) => {
                        let obj = {};
                        obj.suppliername = v.供应商名称;
                        obj.phonenumber = v.联系方式;
                        obj.phonename = v.联系人;
                        obj.supplierproduct = v.商品名称;
                        obj.producttype = v.商品种类;
                        obj.retailprice = v.零售价;

                        arr.push(obj);
                    });
                    // 放入到element的table中显示出来
                    that.ExcelTable = arr;
                };
                reader.readAsArrayBuffer(f);
            };
            if (rABS) {
                reader.readAsArrayBuffer(f);
            } else {
                reader.readAsBinaryString(f);
            }
        },
        // 上传按钮////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        fileBtn() {
            //上传这里可以分两种,一种是直接获取input的文件上传给后端，一种是我们已经解析了excel所以只要把ExcelTable数组传给后端
            //两种方法都可行，看自己需求
            this.list = [];
            let a = this.ExcelTable.length;
            for (let i = 0; i <= a; i++) {
                this.axios({
                    path: '/user/addsupplier',
                    method: 'POST',
                    data: {
                        suppliername: this.ExcelTable[i].suppliername,
                        phonenumber: this.ExcelTable[i].phonenumber,
                        phonename: this.ExcelTable[i].phonename,
                        supplierproduct: this.ExcelTable[i].supplierproduct,
                        producttype: this.ExcelTable[i].producttype,
                        retailprice: this.ExcelTable[i].retailprice
                    }
                })
                    .then(() => {
                        if (i == a - 1) {
                            this.listGET();
                            this.addVisible = false;
                            this.$message.success('添加成功');
                            this.ExcelTable = [];
                        }
                    })
                    .catch((err) => {
                        this.$message.error(err.message);
                    });
            }
        },

        //输出数据////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        async outTab() {
            let result = await this.axios({
                path: '/user/supplierlist'
            });
            for (let index = 0; index < result.length; index++) {
                var suppliername = result[index].suppliername;
                let result2 = await this.axios({
                    path: '/user/searchsupplier',
                    method: 'get',
                    data: {
                        suppliername
                    }
                });
                this.list = this.list.concat(result2);
                result2 = 0;
            }
            this.tableData = this.list;

            require.ensure([], () => {
                const { export_json_to_excel } = require('@/Excel/Export2Excel'); //注意这个Export2Excel路径
                const tHeader = ['序号', '供应商名称', '联系方式', '联系人', '商品名称', '商品种类', '零售价（元）']; // 上面设置Excel的表格第一行的标题
                const filterVal = ['id', 'suppliername', 'phonenumber', 'phonename', 'supplierproduct', 'producttype', 'retailprice']; // 上面的index、nickName、name是tableData里对象的属性key值
                const list = this.tableData; //把要导出的数据tableData存到list
                const data = this.formatJson(filterVal, list);
                // const execelDate = format(new Date(), 'YYYY-MM-DD')
                const filename = '供应商列表';
                export_json_to_excel(tHeader, data, filename); //最后一个是表名字
            });
        },
        //格式转换,不需要改动////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        formatJson(filterVal, jsonData) {
            return jsonData.map((v) => filterVal.map((j) => v[j]));
        }
    }
};
</script>
<style  scoped>
.red {
    color: #ff0000;
}
.table {
    height: calc(100vh - 147px);
    /* overflow: auto */
}
</style>
