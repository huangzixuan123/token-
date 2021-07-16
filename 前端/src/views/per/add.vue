<template>
    <div>
        <el-table :data="list" border class="table" ref="multipleTable" header-cell-class-name="table-header">
            <!-- <el-table-column  width="100" align="center"></el-table-column> -->
            <el-table-column prop="productname" label="商品" align="center"></el-table-column>
            <el-table-column prop="barcode" label="条形码" align="center"></el-table-column>
            <el-table-column prop="intime" label="入仓时间" align="center"></el-table-column>
            <el-table-column prop="boxcode" label="箱码" align="center"></el-table-column>
            <el-table-column prop="specs" label="包装系数" align="center"></el-table-column>
            <el-table-column prop="plantime" label="计划日期" align="center"></el-table-column>
            <el-table-column label="操作" width="250" align="center">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row.id, scope.$index)"
                        >删除</el-button
                    >
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
    data() {
        return {
            list: []
            // editVisible:false,
        };
    },
    methods: {
        async listGET() {
            let res = await this.axios({
                path: '/user/WarehouseList'
            });
            this.list = res;
        }
    },
    created() {
        this.listGET();
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