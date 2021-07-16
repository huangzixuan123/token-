<template>
    <div>
        <el-button type="primary" round class="dele-submit" @click="delesubmit(sels)">批量删除（id）</el-button>
        <el-button type="primary" round class="dele-submit" @click="delesubmit2(sels)">批量删除（name）</el-button>
        <el-input v-model="keywords" placeholder="检索" style="width: 214px"></el-input>
        <el-button type="danger" icon="el-icon-search" @click="searchsubmit()">检索/页面刷新</el-button>

        <el-button type="primary" round class="select-submit" @click="submit()">测试</el-button>
        <!-- @selection-change="selsChange" 跟多选有关 -->
        <!-- :row-key="getRowKeyOfTarget" 对应下面:reserve-selection="true" 翻页保留勾选状态 -->
        <el-table
            :data="list"
            border
            class="table"
            ref="multipleTable"
            header-cell-class-name="table-header"
            @selection-change="handleSelectionChange"
            :row-key="getRowKeyOfTarget"
            @expand-change="expandchange"
        >
            <!-- 勾选框 -->
            <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>

            //待定 ////// ////// ///// /////
            <!-- 内层信息 -->
            <el-table-column type="expand" v-if="expandview">
                <template slot-scope="props" :v-model="props">
                    <el-button type="primary" round class="select-submit" @click="submit2(props.$index, props.row)">测试</el-button>
                    <el-form label-position="right" inline class="demo-table-expand">
                        <el-table :data="list2" border class="table" ref="multipleTable">
                            <el-table-column prop="id" label="编号" width="100" v-if="idview" align="center"></el-table-column>
                            <el-table-column prop="name" label="货架称号/编号" v-if="nameview" align="center"></el-table-column>
                            <el-table-column
                                prop="shelfposition"
                                label="货架称号/编号"
                                v-if="shelfpositionview"
                                align="center"
                            ></el-table-column>
                            <el-table-column label="货架属性" align="center">
                                <template slot-scope="scope">{{ scope.row.sex }}</template>
                            </el-table-column>
                            <el-table-column prop="class" label="备注" align="center"></el-table-column>

                            <el-table-column label="操作" width="250" align="center">
                                <template slot-scope="scope">
                                    <router-link :to="{ path: 'perLook', query: { id: scope.row.id } }">
                                        <el-button type="text" icon="el-icon-tickets" class="per">成绩</el-button>
                                    </router-link>
                                    <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                    <el-button
                                        type="text"
                                        icon="el-icon-delete"
                                        class="red"
                                        @click="handleDelete(scope.row.id, scope.$index)"
                                        >删除</el-button
                                    >
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form>
                </template>
            </el-table-column>

            <!-- 列表 -->
            <el-table-column prop="id" label="编号" width="100" v-if="idview" align="center"></el-table-column>
            <el-table-column prop="name" label="货架称号/编号" v-if="nameview" align="center"></el-table-column>
            <el-table-column prop="shelfposition" label="货架称号/编号" v-if="shelfpositionview" align="center"></el-table-column>
            <el-table-column label="货架属性" align="center">
                <template slot-scope="scope">{{ scope.row.sex }}</template>
            </el-table-column>
            <el-table-column prop="class" label="备注" align="center"></el-table-column>

            <el-table-column label="操作" width="250" align="center">
                <template slot-scope="scope">
                    <router-link :to="{ path: 'perLook', query: { id: scope.row.id } }">
                        <el-button type="text" icon="el-icon-tickets" class="per">成绩</el-button>
                    </router-link>
                    <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row.id, scope.$index)"
                        >删除</el-button
                    >
                </template>
            </el-table-column>
        </el-table>

        <!-- 页码 -->
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

        <!-- 另一个表单，预备删/////////////////////////////////////////// -->
        <el-table class="listTable_ele" :data="listTable" stripe height="250" style="width: 100%">
            <el-table-column prop="id" label="编号" width="100" v-if="idview" align="center"></el-table-column>
            <el-table-column prop="name" label="货架称号/编号" v-if="nameview" align="center"></el-table-column>
            <el-table-column label="数量">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.model" size="small" style="width: 240px"></el-input>
                </template>
            </el-table-column>
        </el-table>

        <!-- 编辑弹出框 -->
        <el-dialog title="修改资料" :visible.sync="editVisible" width="35%">
            <el-form ref="form" :model="form" label-width="70px" :rules="rules">
                <el-form-item label="货架名称" prop="name">
                    <el-input v-model="form.name" placeholder="输入要修改的货架名称" style="width: 214px"></el-input>
                </el-form-item>
                <el-form-item label="或加属性" prop="sex">
                    <el-select v-model="form.sex" placeholder="请选择货架属性">
                        <el-option label="零食" value="零食"></el-option>
                        <el-option label="果蔬" value="果蔬"></el-option>
                        <el-option label="日常用品" value="日常用品"></el-option>
                        <el-option label="家用电器" value="家用电器"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="班级" prop="class">
                    <el-select v-model="form.class" placeholder="请选择所在班级">
                        <el-option v-for="(t, i) in classList" :key="i" :label="t" :value="t"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    //局部刷新有关，方法衔接，衔接home.vue
    inject: ['reload'],
    data() {
        return {
            //加载的页面
            loading: 1,
            //消失
            idview: false,
            shelfpositionview: false,
            expandview: true,
            nameview: true,
            //批量删除有关
            sels: [], //选中的值显示(批量删除按钮那有关，方法在下面也有)
            ids: [],
            //分页有关
            total: '',
            currentIndex: 1,
            pageSize: 5,

            props: [],

            //查询有关
            keywords: '',

            tableData: [],
            list: [],
            ////实验预备删
            listTable: [],
            //编辑框显示:false
            editVisible: false,
            classList: [],
            form: {
                name: '',
                sex: '',
                class: ''
            },
            rules: {
                name: [{ required: true, message: '请输入货架名称', trigger: 'blur' }],
                class: [{ required: true, message: '请选择所在班级', trigger: 'change' }],
                sex: [{ required: true, message: '请选择货架属性', trigger: 'change' }]
            }
        };
    },
    // 在created函数中调用ajax获取页面初始化所需的数据
    created() {
        this.listGET();
        for (let i = 1; i <= 12; i++) this.classList.push(i + '班');
    },
    loading() {
        if ((this.loading = 1)) {
            this.idview = false;
            this.shelfpositionview = false;
        } else if ((this.loading = 2)) {
            this.idview = true;
            this.nameview = false;
            this.shelfpositionview = true;
            this.expandview = false;
        }
    },

    methods: {
        //测试用/////////////////////////////////////////////////////////////////////////////
        submit() {
            swal("这是一条信息！")
            this.list = [];
            // this.idview = !this.idview;
            this.listGET2();
            
            // this.shelfposition=!shelfposition;
            // this.expandview=!this.expandview;
        },

        //子插槽信息显示:显示父级的详细所有信息/////////////////////////////////////////////////////////////////////////////
        async submit2(index) {
            //需要展示的信息必须提前弄出来
            this.idview = true;
            this.nameview = false;
            this.shelfpositionview = true;

            var name = this.list[index].name;
            this.$message.success(name);
            // this.list = [];
            let result = await this.axios({
                path: '/user/searchShelfname',
                data: {
                    name: name
                }
            });
            this.list = [];
            this.tableData = result;
            this.tableData.forEach((data, index) => {
                if (index >= (this.currentIndex - 1) * this.pageSize && index < this.currentIndex * this.pageSize) {
                    this.list.push(data);
                    this.total = this.tableData.length;
                }
            });
            //expandview插槽必须在最后,才不会出错(不知道待定)
            this.expandview = false;

            this.loading = 2;
        },
        //待定
        //////
        //////
        /////
        /////
        async expandchange(row) {
            name = row.name;
            this.$message.success(name);
            let result = await this.axios({
                path: '/user/searchShelfname',
                data: {
                    name: name
                }
            });
            this.list2 = [];
            this.list2 = result;
            // this.list2.forEach((data, index) => {

            // if (index >= (this.currentIndex - 1) * this.pageSize && index < this.currentIndex * this.pageSize) {
            //     this.list2.push(data);
            //     this.total = this.tableData.length;
            // }
            // this.list2.push(data);

            // });
        },
        // 检索/////////////////////////////////////////////////////////////////////////////
        async searchsubmit() {
            if (this.keywords) {
                let result = await this.axios({
                    path: '/user/searchShelfname',
                    method: 'get',
                    data: {
                        name: this.keywords
                    }
                });
                if (result.length === 0) {
                    this.$refs.multipleTable.clearSelection();
                    this.$message.error('数据不存在');
                } else {
                    //查询出来的数据分页
                    this.list = [];
                    this.tableData = result;
                    this.tableData.forEach((data, index) => {
                        if (index >= (this.currentIndex - 1) * this.pageSize && index < this.currentIndex * this.pageSize) {
                            this.list.push(data);
                        }
                        this.total = this.tableData.length;
                        this.$refs.multipleTable.clearSelection();
                    });
                }
                this.keywords = '';
            } else {
                this.reload();
            }
        },

        //选中时触发(多选) 获取到选中的数据/////////////////////////////////////////////////////////////////////////////
        async handleSelectionChange(sels) {
            this.sels = sels;
            this.listTable = [];
            /////////预备删，方法试用///////
            for (let index = 0; index < this.sels.length; index++) {
                var ids = this.sels.map((item) => item.name).join();
                ids = ids.replace(/,/g, ' ');
                ids = ids.split(' ');
                ids = ids[index];
                let result = await this.axios({
                    path: '/user/searchShelfname',
                    method: 'get',
                    data: {
                        name: ids
                    }
                });

                this.listTable = this.listTable.concat(result);
            }
            this.$message.error('勾选成功');
            //////////////
        },

        //删除货架2（name）/////////////////////////////////////////////////////////////////////////////
        delesubmit2() {
            //获取所有选中行的id组成的字符串，以逗号分隔
            // var ids= this.sels.map(item => item.id).join();
            //字符串逗号转化为空格;
            // ids= ids.replace(/,/g,' ');
            // 字符串根据空格把字符串分割为数组,用了这个批量删除就有问题了
            // ids = ids.split(" ");
            // ids = ids[index];
            // for(let index=0;index<6;index++){

            if (this.sels.length > 0) {
                // let str = `确定删除《${ids}》同学信息吗？`;
                this.$confirm('此操作将永久删除所选数据, 是否继续?', '提示', {
                    confirmButtonText: '确定删除',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    for (let index = 0; index < this.sels.length; index++) {
                        var ids = this.sels.map((item) => item.name).join();
                        ids = ids.replace(/,/g, ' ');
                        ids = ids.split(' ');
                        ids = ids[index];

                        this.axios({
                            path: '/user/deleShelf2',
                            method: 'POST',
                            data: {
                                name: ids
                            }
                        })
                            .then(() => {
                                //为解决 https://m.imooc.com/wenda/detail/382196
                                //未解决，直接使用sels长度对比不行，原因未知
                                //解决了，但是不知道为什么任意一个不超过sels长度的数也可以
                                if (index == 0) {
                                    // this.listRenovate();
                                    this.$refs.multipleTable.clearSelection();
                                    this.list = [];
                                    this.listGET();
                                    this.$message.success('成功删除！');
                                }
                            })
                            .catch((err) => {
                                this.$message.error(err.message);
                            });
                    }
                });
            } else {
                this.$message.error('请选择！');
            }
            // }
        },

        //勾选批量删除(id)/////////////////////////////////////////////////////////////////////////////
        delesubmit() {
            //获取所有选中行的id组成的字符串，以逗号分隔
            // var ids= this.sels.map(item => item.id).join();
            //字符串逗号转化为空格;
            // ids= ids.replace(/,/g,' ');
            // 字符串根据空格把字符串分割为数组,用了这个批量删除就有问题了
            // ids = ids.split(" ");
            // ids = ids[index];
            // for(let index=0;index<6;index++){

            if (this.sels.length > 0) {
                // let str = `确定删除《${ids}》同学信息吗？`;
                this.$confirm('此操作将永久删除所选数据, 是否继续?', '提示', {
                    confirmButtonText: '确定删除',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    for (let index = 0; index < this.sels.length; index++) {
                        var ids = this.sels.map((item) => item.id).join();
                        ids = ids.replace(/,/g, ' ');
                        ids = ids.split(' ');
                        ids = ids[index];

                        this.axios({
                            path: '/user/deleShelf',
                            method: 'POST',
                            data: {
                                id: ids
                            }
                        })
                            .then(() => {
                                //为解决 https://m.imooc.com/wenda/detail/382196
                                //未解决，直接使用sels长度对比不行，原因未知
                                //解决了，但是不知道为什么任意一个不超过sels长度的数也可以
                                if (index == 0) {
                                    // this.listRenovate();
                                    this.$refs.multipleTable.clearSelection();
                                    this.list = [];
                                    this.listGET();
                                    this.$message.success('成功删除！');
                                }
                            })
                            .catch((err) => {
                                this.$message.error(err.message);
                            });
                    }
                });
            } else {
                this.$message.error('请选择！');
            }
            // }
        },

        //删除/////////////////////////////////////////////////////////////////////////////
        async handleDelete(id, index) {
            var name = this.list[index].name;

            let str = `确定删除《${this.list[index].name}》同学信息吗？`;
            this.$confirm(str, '删除', {
                confirmButtonText: '确定删除',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (this.loading == 1) {
                    this.axios({
                        path: '/user/deleShelf2',
                        method: 'POST',
                        data: {
                            name
                        }
                    })
                        .then(() => {
                            this.$refs.multipleTable.clearSelection();
                            this.list = [];
                            this.listGET();
                            this.$message.success('成功删除！');
                        })
                        .catch((err) => {
                            this.$message.error(err.message);
                        });
                } else if (this.loading == 2) {
                    this.axios({
                        path: '/user/deleShelf',
                        method: 'POST',
                        data: {
                            id
                        }
                    })
                        .then(() => {
                            this.idview = true;
                            this.nameview = false;
                            this.shelfpositionview = true;

                            // this.list = [];

                            //一方案
                            // this.list = result;

                            //三方案
                            // this.list = [];
                            // this.listGET();
                            this.$refs.multipleTable.clearSelection();
                            this.$message.success('成功删除！');
                        })
                        .catch((err) => {
                            this.$message.error(err.message);
                        });
                }
            });
        },

        //编辑/////////////////////////////////////////////////////////////////////////////
        handleEdit(index) {
            this.form.name = this.list[index].name;
            this.form.sex = this.list[index].sex;
            this.form.class = this.list[index].class;
            this.editVisible = true;
            this.id = this.list[index].id;
        },
        async saveEdit() {
            this.$refs['form'].validate(async (valid) => {
                if (!valid) return;
                this.axios({
                    path: '/user/changeShelf',
                    method: 'POST',
                    data: {
                        name: this.form.name,
                        sex: this.form.sex,
                        class: this.form.class,
                        id: this.id
                    }
                })
                    .then(() => {
                        this.$refs.multipleTable.clearSelection();
                        this.list = [];
                        this.listGET();

                        this.editVisible = false;
                        this.$message.success('修改成功');
                    })
                    .catch((err) => {
                        this.$message.error(err.message);
                    });
            });
        },

        //查询货架数据（全部数据，插槽显示）/////////////////////////////////////////////////////////////////////////////
        async listGET2() {
            let result = await this.axios({
                path: '/user/listShelf2'
            });
            this.list = [];
            this.tableData = result;
            this.tableData.forEach((data, index) => {
                if (index >= (this.currentIndex - 1) * this.pageSize && index < this.currentIndex * this.pageSize) {
                    this.list.push(data);
                    this.total = this.tableData.length;
                }
            });
            // res.forEach((t) => {
            //     t.img = this.$img([t.img])[0];
            // });
        },

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
        async listGET() {
            let result = await this.axios({
                path: '/user/listShelf'
            });
            this.tableData = result;
            this.tableData.forEach((data, index) => {
                if (index >= (this.currentIndex - 1) * this.pageSize && index < this.currentIndex * this.pageSize) {
                    this.list.push(data);
                    this.total = this.tableData.length;
                }
            });
        }
    },

    computed: {
        pageNum() {
            return Math.ceil(this.tableData.length / this.pageSize);
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