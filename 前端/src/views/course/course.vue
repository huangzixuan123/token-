<template>
    <div>
        <el-button type="primary" @click="allbarcode" size="mini">cs</el-button>

        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-pie-chart"></i> schart图表 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!-- <div class="container"> -->
        <div class="schart-box">
            <!-- <div class="content-title">柱状图</div> -->
            <schart class="schart" canvasId="bar" :options="options1"></schart>
        </div>
        <div class="schart-box">
            <!-- <div class="content-title">折线图</div> -->
            <schart class="schart" canvasId="line" :options="options2"></schart>
        </div>
        <div class="schart-box">
            <!-- <div class="content-title">饼状图</div> -->
            <schart class="schart" canvasId="pie" :options="options3"></schart>
        </div>
        <div class="schart-box">
            <!-- <div class="content-title">饼状图</div> -->
            <schart class="schart" canvasId="a" :options="options4"></schart>
        </div>
        <!-- </div> -->
    </div>
</template>

<script>
import Schart from 'vue-schart';
export default {
    components: {
        Schart
    },
    data() {
        return {
            list: [],
            use: [],
            options1: {
                type: 'bar',
                title: {
                    text: '最近一周各品类销售图'
                },
                bgColor: '#fbfbfb',
                labels: ['周一', '周二', '周三', '周四', '周五'],
                datasets: [
                    {
                        label: '家电',
                        fillColor: 'rgba(241, 49, 74, 0.5)',
                        data: [234, 278, 270, 190, 230]
                    },
                    {
                        label: '百货',
                        data: [164, 178, 190, 135, 160]
                    },
                    {
                        label: '食品',
                        data: [144, 198, 150, 235, 120]
                    }
                ]
            },
            options2: {
                type: 'line',
                title: {
                    text: '最近几个月各品类销售趋势图'
                },
                legend: {
                    position: 'top'
                },
                bgColor: '#fbfbfb',
                labels: [],
                datasets: [
                    {
                        label: '',
                        data: []
                    }
                ]
            },
            options3: {
                type: 'pie',
                title: {
                    text: '货架商品占比(单位：个)'
                },
                legend: {
                    position: 'right'
                },
                bgColor: '#fbfbfb',
                labels: [],
                datasets: [
                    {
                        data: []
                    }
                ]
            },
            options4: {
                type: 'pie',
                legend: {
                    position: 'right'
                },
                title: {
                    text: '仓库商品占比(单位：箱)'
                },
                bgColor: '#fbfbfb',
                labels: [],
                datasets: [
                    {
                        data: []
                    }
                ]
            }
        };
    },
    created() {
        this.listGET();
        this.allbarcode();
        this.listGET2();
        this.listGET3();
    },
    methods: {
        //折线图
        //折线图
        //折线图
        //折线图
        //折线图
        //环比///////////
        async listGET() {
            let res = await this.axios({
                path: '/user/TBsearch1',
                method: 'get'
            });
            this.list = [];
            this.options2.labels = [];
            for (let i in res) {
                this.options2.labels.push(res[i].month);
                this.list.push(res[i].SUMprice);
            }
            this.use = this.options2.labels;
            this.options2.datasets = [{ label: '环比', data: this.list }];
        },
        //各商品数据折线图///////////
        async allbarcode() {
            let res = await this.axios({
                path: '/user/JSsearch1',
                method: 'get'
            });
            for (let i = 0; i < res.length; i++) {
                let res2 = await this.axios({
                    path: '/user/TBsearch2',
                    method: 'get',
                    data: {
                        JSbarcode: res[i].JSbarcode
                    }
                });
                this.list = [];
                let b = 0;
                for (let a = 0; a < this.use.length; a++) {
                    if (this.use[a] == res2[b].month) {
                        for (let i in res2) {
                            this.list.push(res2[i].SUMprice);
                        }
                        b = b++;
                    } else {
                        this.list.push(0);
                    }
                }
                // this.$message.success(JSON.stringify(this.list));
                this.options2.datasets = this.options2.datasets.concat({
                    label: res2[0].productname + '(' + res2[0].JSbarcode + ')',
                    data: this.list
                });
            }
        },
        //饼图
        //饼图
        //饼图
        //饼图
        //饼图
        ////货架////
        async listGET2() {
            let res = await this.axios({
                path: '/user/TBsearch3',
                method: 'get'
            });
            this.list = [];
            this.options3.labels = [];
            for (let i in res) {
                this.options3.labels.push(res[i].productname + '(' + res[i].HJSPbarcode + ')');
                this.list.push(res[i].HJSPnumber);
            }
            // this.use = this.options3.labels;
            this.options3.datasets = [{ data: this.list }];
        },
        ////仓库////
        async listGET3() {
            let res = await this.axios({
                path: '/user/TBsearch4',
                method: 'get'
            });
            this.list = [];
            this.options4.labels = [];
            for (let i in res) {
                this.options4.labels.push(res[i].productname + '(' + res[i].CKbarcode + ')');
                this.list.push(res[i].COUNT);
            }
            // this.use = this.options3.labels;
            this.options4.datasets = [{ data: this.list }];
        }
    }
};
</script>

<style scoped>
.schart-box {
    display: inline-block;
    margin: 20px;
}
.schart {
    width: 700px;
    height: 400px;
}
.content-title {
    clear: both;
    font-weight: 400;
    line-height: 50px;
    margin: 10px 0;
    font-size: 22px;
    color: #1f2f3d;
}
</style>