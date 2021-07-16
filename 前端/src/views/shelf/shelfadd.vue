<template>
    <div>
        <el-table :data="list" ref="multipleTable" size="mini" border>
            <el-table-column prop="productname" label="商品" align="center"></el-table-column>
            <el-table-column prop="barcode" label="条形码" align="center"></el-table-column>
            <el-table-column prop="expirydate" label="保质期(天)" align="center"></el-table-column>

            <el-table-column prop="duedateproportion" label="临期设定(天)" align="center"></el-table-column>
            <el-table-column prop="CKstockwarning" label="仓库预警货存" align="center" sortable></el-table-column>
            <el-table-column prop="HJstockwaring" label="货架预警货存" align="center" sortable></el-table-column>
            <el-table-column label="操作" align="center" fixed="right">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="edit(scope.$index, scope.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- ///////编辑采购清单//////////////////////////////////////////////////// -->
        <!-- ///////编辑采购清单//////////////////////////////////////////////////// -->
        <!-- ///////编辑采购清单//////////////////////////////////////////////////// -->
        <!-- ///////编辑采购清单//////////////////////////////////////////////////// -->
        <!-- ///////编辑采购清单//////////////////////////////////////////////////// -->

        <el-dialog title="编辑采购清单" :visible.sync="editCGQDVisible">
            <el-form ref="editCGQDlist" :model="editCGQDlist" :rules="rules" :inline="true" size="mini">
                <el-form-item label="商品" prop="productname">
                    <el-input v-model="editCGQDlist.productname" placeholder="请输入" style="width: 160px" clearable disabled="false"
                        ><i class="el-icon-edit el-input__icon" slot="suffix" v-if="editCGQDlist.productname === ''"> </i
                    ></el-input>
                </el-form-item>
                <el-form-item label="条形码" prop="barcode">
                    <el-input v-model="editCGQDlist.barcode" placeholder="请输入" style="width: 160px" clearable disabled="false"
                        ><i class="el-icon-edit el-input__icon" slot="suffix" v-if="editCGQDlist.barcode === ''"> </i
                    ></el-input>
                </el-form-item>
                <el-form-item label="保质期(天)" prop="expirydate">
                    <el-input v-model="editCGQDlist.expirydate" placeholder="请输入" style="width: 160px" clearable disabled="false"
                        ><i class="el-icon-edit el-input__icon" slot="suffix" v-if="editCGQDlist.expirydate === ''"> </i
                    ></el-input>
                </el-form-item>
                <el-form-item label="临期设定(天)" prop="duedateproportion">
                    <el-input v-model="editCGQDlist.duedateproportion" placeholder="请输入" style="width: 160px" clearable
                        ><i class="el-icon-edit el-input__icon" slot="suffix" v-if="editCGQDlist.duedateproportion === ''"> </i
                    ></el-input>
                </el-form-item>
                <el-form-item label="仓库预警货存" prop="CKstockwarning">
                    <el-input v-model="editCGQDlist.CKstockwarning" placeholder="请输入" style="width: 160px" clearable
                        ><i class="el-icon-edit el-input__icon" slot="suffix" v-if="editCGQDlist.CKstockwarning === ''"> </i
                    ></el-input>
                </el-form-item>
                <el-form-item label="货架预警货存" prop="HJstockwaring">
                    <el-input v-model="editCGQDlist.HJstockwaring" placeholder="请输入" style="width: 160px" clearable
                        ><i class="el-icon-edit el-input__icon" slot="suffix" v-if="editCGQDlist.HJstockwaring === ''"> </i
                    ></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button type="info" @click="clear1">清空</el-button>
                <el-button type="danger" @click="cancel1">取 消</el-button>
                <el-button type="primary" @click="saveedit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    inject: ['reload'],
    data() {
        return {
            list: [],
            editCGQDVisible: false,
            editCGQDlist: {
                productname: '',
                barcode: '',
                expirydate: '',
                duedateproportion: '',
                CKstockwarning: '',
                HJstockwaring: ''
            },
            rules: {
                productname: [{ required: true, message: '请输入', trigger: 'blur' }],
                barcode: [{ required: true, message: '请输入', trigger: 'blur' }],
                expirydate: [{ required: true, message: '请输入', trigger: 'blur' }],
                duedateproportion: [{ required: true, message: '请输入', trigger: 'blur' }],
                CKstockwarning: [{ required: true, message: '请输入', trigger: 'blur' }],
                HJstockwaring: [{ required: true, message: '请输入', trigger: 'blur' }]
            }
        };
    },
    created() {
        this.listGET();
    },
    methods: {
        //编辑清单/////////////
        //编辑清单/////////////
        //编辑清单/////////////
        //编辑清单/////////////
        //编辑清单/////////////
        async edit(index, row) {
            this.editCGQDVisible = true;
            this.editCGQDlist.productname = this.list[index].productname;
            this.editCGQDlist.barcode = this.list[index].barcode;
            this.editCGQDlist.expirydate = this.list[index].expirydate;
            this.editCGQDlist.duedateproportion = this.list[index].duedateproportion;
            this.editCGQDlist.CKstockwarning = this.list[index].CKstockwarning;
            this.editCGQDlist.HJstockwaring = this.list[index].HJstockwaring;
        },
        clear1() {
            this.editCGQDlist.duedateproportion = '';
            this.editCGQDlist.CKstockwarning = '';
            this.editCGQDlist.HJstockwaring = '';
        },
        cancel1() {
            this.editCGQDVisible = false;
            this.$refs['editCGQDlist'].resetFields();
        },
        async saveedit() {
            this.$refs['editCGQDlist'].validate(async (valid) => {
                if (!valid) return;
                this.axios({
                    path: '/user/WARNINGedit1',
                    method: 'POST',
                    data: {
                        WARNINGbarcode: this.editCGQDlist.barcode,
                        CKstockwarning: this.editCGQDlist.CKstockwarning,
                        duedateproportion:this.editCGQDlist.duedateproportion,
                        HJstockwaring: this.editCGQDlist.HJstockwaring
                    }
                }).then(() => {
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
 
        ///列表显示////////
        ///列表显示////////
        ///列表显示////////
        ///列表显示////////
        ///列表显示////////
        async listGET() {
            let res = await this.axios({
                path: '/user/WARNINGsearch1'
            });
            this.list = res;
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

