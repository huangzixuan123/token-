webpackJsonp([14],{IsYD:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=a("woOf"),i=a.n(s),r=a("7biW"),n=a("1onU"),o=a("gyMJ"),l={components:{search:r.a,pagination:n.a},data:function(){return{search:[{span:6,key:"order_id",placeholder:"请输入订单号",type:"input"}],orderList:[],order:{},curPage:1,pageSize:10,totalData:0,dialogVisible:!1}},activated:function(){this.getOrders()},methods:{getOrders:function(){var t=this;this.orderList=[];var e={page:this.curPage,limit:this.pageSize},a=this.$refs.search;a.isSearch&&(e=i()(e,a.searchVal));var s=["","待发货","待收货","已完成","申诉通过","申诉不通过","","","","申诉中"];Object(o.C)(e).then(function(e){e.message.map(function(t){console.log(t),t.order_status_text=s[t.order_status]}),t.orderList=e.message,t.totalData=e.total})},orderDetail:function(t){this.dialogVisible=!0,this.order=t},send:function(t){var e=this;this.$confirm("确认发货吗",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){Object(o.i)({order_id:t.order_id,order_status:2}).then(function(t){200===t.success_code&&(e.$message.success("发货成功"),e.getOrders())})}).catch(function(){})},restData:function(){this.currentIndex=1,this.pageSize=5,this.getAllGoods()},paginationChange:function(t){this.curPage=t.page,this.pageSize=t.limit,this.getUsers()},handleClose:function(t){t()}}},c={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{attrs:{id:"admin-sales"}},[a("search",{ref:"search",attrs:{search:t.search},on:{restData:t.restData,searchData:t.getOrders}}),t._v(" "),a("el-table",{staticStyle:{width:"100%"},attrs:{data:t.orderList}},[a("el-table-column",{attrs:{prop:"order_id",label:"订单号"}}),t._v(" "),a("el-table-column",{attrs:{prop:"user_nickname",label:"买方"}}),t._v(" "),a("el-table-column",{attrs:{prop:"publisher",label:"卖方"}}),t._v(" "),a("el-table-column",{attrs:{prop:"createTime",label:"生成时间"}}),t._v(" "),a("el-table-column",{attrs:{fixed:"right",align:"center",label:"操作",width:"200"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-button",{attrs:{type:"text",size:"small"},on:{click:function(a){return t.orderDetail(e.row)}}},[t._v("详情")])]}}])})],1),t._v(" "),a("pagination",{attrs:{page:t.curPage,limit:t.pageSize,total:t.totalData},on:{pagination:t.paginationChange}}),t._v(" "),a("el-dialog",{attrs:{title:"订单详情",visible:t.dialogVisible,width:"30%","before-close":t.handleClose},on:{"update:visible":function(e){t.dialogVisible=e}}},[a("div",{staticClass:"item"},[a("span",[t._v("订单号")]),t._v(" "),a("span",[t._v(t._s(t.order.order_id))])]),t._v(" "),a("div",{staticClass:"item"},[a("span",[t._v("买方")]),t._v(" "),a("span",[t._v(t._s(t.order.user_nickname))])]),t._v(" "),a("div",{staticClass:"item"},[a("span",[t._v("卖方")]),t._v(" "),a("span",[t._v(t._s(t.order.publisher))])]),t._v(" "),a("div",{staticClass:"item"},[a("span",[t._v("订单状态")]),t._v(" "),a("span",[t._v(t._s(t.order.order_status_text))])]),t._v(" "),a("div",{staticClass:"item"},[a("span",[t._v("生成时间")]),t._v(" "),a("span",[t._v(t._s(t.order.createTime))])]),t._v(" "),a("div",{staticClass:"item"}),t._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{type:"primary"},on:{click:function(e){t.dialogVisible=!1}}},[t._v("确 定")])],1)])],1)},staticRenderFns:[]};var d=a("VU/8")(l,c,!1,function(t){a("eSe6")},"data-v-5a03768c",null);e.default=d.exports},eSe6:function(t,e){}});
//# sourceMappingURL=14.d63465e06ef38b4c408c.js.map