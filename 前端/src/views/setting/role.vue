<template>
    <div>
        <el-button type="primary" @click="addsubmit()" size="mini">添加</el-button>
        <el-button type="primary" @click="cs()" size="mini">cs</el-button>

        <el-table :data="list" ref="multipleTable" size="mini" border>
            <el-table-column prop="name" label="账户" align="center"></el-table-column>
            <el-table-column prop="pwd" label="密码" align="center"></el-table-column>
            <el-table-column prop="role" label="角色" align="center"></el-table-column>
            <el-table-column label="操作" align="center" fixed="right">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="edit(scope.$index, scope.row)"></el-button>
                    <el-button type="text" v-if="scope.row.role !== 'SupperAdmin'">
                        <el-popconfirm
                            confirm-button-text="好的"
                            cancel-button-text="不用了"
                            @onConfirm="handleDelete(scope.row.id, scope.$index)"
                            icon="el-icon-info"
                            icon-color="red"
                            title="确定删除信息吗？"
                        >
                            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" circle></el-button>
                        </el-popconfirm>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- ///////编辑采购清单//////////////////////////////////////////////////// -->
        <!-- ///////编辑采购清单//////////////////////////////////////////////////// -->
        <!-- ///////编辑采购清单//////////////////////////////////////////////////// -->
        <!-- ///////编辑采购清单//////////////////////////////////////////////////// -->
        <!-- ///////编辑采购清单//////////////////////////////////////////////////// -->

        <el-dialog title="编辑账户" :visible.sync="editCGQDVisible">
            <el-form ref="editCGQDlist" :model="editCGQDlist" :rules="rules" :inline="true">
                <el-form-item label="账户" prop="name">
                    <el-input v-model="editCGQDlist.name" placeholder="请输入" style="width: 160px" clearable
                        ><i class="el-icon-edit el-input__icon" slot="suffix" v-if="editCGQDlist.name === ''"> </i
                    ></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="pwd">
                    <el-input v-model="editCGQDlist.pwd" placeholder="请输入" style="width: 160px" clearable
                        ><i class="el-icon-edit el-input__icon" slot="suffix" v-if="editCGQDlist.pwd === ''"> </i
                    ></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="role" v-if="this.value !== 'SupperAdmin'">
                    <el-select v-model="value" placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            :disabled="item.disabled"
                        >
                        </el-option>
                    </el-select>
                    <!-- <el-input
                        v-model="editCGQDlist.role"
                        placeholder="请输入"
                        clearable
                        :disabled="editCGQDlist.role === 'admin' ? true : false"
                        ><i class="el-icon-edit el-input__icon" slot="suffix" v-if="editCGQDlist.role === ''"> </i
                    ></el-input> -->
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button type="info" @click="clear1">清空</el-button>
                <el-button type="danger" @click="cancel1">取 消</el-button>
                <el-button type="primary" @click="saveedit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- ///////新增账户//////////////////////////////////////////////////// -->
        <!-- ///////新增账户//////////////////////////////////////////////////// -->
        <!-- ///////新增账户//////////////////////////////////////////////////// -->
        <!-- ///////新增账户//////////////////////////////////////////////////// -->
        <!-- ///////新增账户//////////////////////////////////////////////////// -->

        <el-dialog title="新增账号" :visible.sync="editCGQDVisible2">
            <el-form ref="editCGQDlist2" :model="editCGQDlist2" :rules="rules" :inline="true">
                <el-form-item label="账户" prop="name">
                    <el-input v-model="editCGQDlist2.name" placeholder="请输入" style="width: 160px" clearable
                        ><i class="el-icon-edit el-input__icon" slot="suffix" v-if="editCGQDlist2.name === ''"> </i
                    ></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="pwd">
                    <el-input v-model="editCGQDlist2.pwd" placeholder="请输入" style="width: 160px" clearable
                        ><i class="el-icon-edit el-input__icon" slot="suffix" v-if="editCGQDlist2.pwd === ''"> </i
                    ></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="value" v-if="this.value !== 'SupperAdmin'">
                    <el-select v-model="editCGQDlist2.value" placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            :disabled="item.disabled"
                        >
                        </el-option>
                    </el-select>
                    <!-- <el-input
                        v-model="editCGQDlist.role"
                        placeholder="请输入"
                        clearable
                        :disabled="editCGQDlist.role === 'admin' ? true : false"
                        ><i class="el-icon-edit el-input__icon" slot="suffix" v-if="editCGQDlist.role === ''"> </i
                    ></el-input> -->
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button type="info" @click="clear2">清空</el-button>
                <el-button type="danger" @click="cancel2">取 消</el-button>
                <el-button type="primary" @click="saveedit2">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    inject: ['reload'],
    data() {
        return {
            options: [
                {
                    value: 'SupperAdmin',
                    label: '超级管理员',
                    disabled: true
                },
                {
                    value: 'Admin',
                    label: '普通管理员'
                },
                {
                    value: 'CGY',
                    label: '仓管员'
                },
                {
                    value: 'SYY',
                    label: '收银员'
                }
            ],
            value: '',
            list: [],
            editCGQDVisible: false,
            editCGQDlist: {
                name: '',
                pwd: '',
                role: '',
                id: ''
            },
            rules: {
                name: [{ required: true, message: '请输入', trigger: 'blur' }],
                pwd: [{ required: true, message: '请输入', trigger: 'blur' }],
                value: [{ required: true, message: '请输入', trigger: 'blur' }]
            },
            editCGQDVisible2: false,
            editCGQDlist2: {
                name: '',
                pwd: '',
                value: '',
                id: ''
            }
        };
    },
    created() {
        this.listGET();
    },
    methods: {
        async cs() {
            let res = await this.axios({
                path: '/user/YHselect1'
            });
            this.$message.success(JSON.stringify(res));
        },
        //删
        //删
        //删
        //删
        //删
        handleDelete(row, index) {
            this.axios({
                path: '/user/YHdelete1',
                method: 'POST',
                data: {
                    id: this.list[index].id
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
        //新增/////////////
        //新增/////////////
        //新增/////////////
        //新增/////////////
        //新增/////////////
        addsubmit() {
            this.editCGQDVisible2 = true;
        },
        clear2() {
            this.editCGQDlist2.name = '';
            this.editCGQDlist2.pwd = '';
            this.value = '';
        },
        cancel2() {
            this.editCGQDVisible2 = false;
            this.$refs['editCGQDlist2'].resetFields();
        },
        async saveedit2() {
            this.$refs['editCGQDlist2'].validate(async (valid) => {
                if (!valid) return;
                this.axios({
                    path: '/user/YHadd1',
                    method: 'POST',
                    data: {
                        name: this.editCGQDlist2.name,
                        pwd: this.editCGQDlist2.pwd,
                        role: this.editCGQDlist2.value
                    }
                })
                    .then(() => {
                        this.reload();
                        this.editCGQDVisible = false;
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
            this.editCGQDlist.name = this.list[index].name;
            this.editCGQDlist.pwd = this.list[index].pwd;
            this.value = this.list[index].role;
            this.editCGQDlist.id = this.list[index].id;
        },
        clear1() {
            this.editCGQDlist.name = '';
            this.editCGQDlist.pwd = '';
            this.value = '';
        },
        cancel1() {
            this.editCGQDVisible = false;
            this.$refs['editCGQDlist'].resetFields();
        },
        async saveedit() {
            this.$refs['editCGQDlist'].validate(async (valid) => {
                if (!valid) return;
                this.axios({
                    path: '/user/YHedit1',
                    method: 'POST',
                    data: {
                        name: this.editCGQDlist.name,
                        pwd: this.editCGQDlist.pwd,
                        role: this.value,
                        id: this.editCGQDlist.id
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

        ///列表显示////////
        ///列表显示////////
        ///列表显示////////
        ///列表显示////////
        ///列表显示////////
        async listGET() {
            let res = await this.axios({
                path: '/user/YHselect1'
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

