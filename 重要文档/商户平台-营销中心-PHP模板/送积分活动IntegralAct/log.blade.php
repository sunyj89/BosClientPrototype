@extends('layout/master')

@section('header')
    <link rel="stylesheet" type="text/css" href="/css/wcc.css?v={{config('constants.wcc_file_version')}}">
    <link rel="stylesheet" type="text/css" href="/css/wcc-element-ui/index.css?v={{config('constants.wcc_file_version')}}">
    <link rel="stylesheet" type="text/css" href="/css/wcc-element-ui/wcc.css?v={{config('constants.wcc_file_version')}}">
    <style>
        #integral-list{
            padding-top:40px;
            padding-left:20px;
        }
    </style>
@endsection

@section('content')
    <div class="content-wrap" id="integral-list" v-cloak>
        <!-- 活动详情 -->
        <div v-if="showDetail">
            <el-button size="mini" type="primary" @click="showDetail=false;">返 回</el-button>
            <el-form v-loading="detailLoading" v-if="showDetail" :model="detailInfo" ref="ruleForm" label-width="200px" class="demo-ruleForm">
                <el-form-item label="活动ID">
                    <span>@{{detailInfo.id}}</span>
                </el-form-item>
                <el-form-item label="活动名称">
                    <span>@{{detailInfo.title}}</span>
                </el-form-item>
                <el-form-item label="活动有效期">
                    <span>@{{detailInfo.sdate}} 至 @{{detailInfo.etime}}</span>
                </el-form-item>
                <el-form-item label="活动背景">
                    <img :src="detailInfo.img_url" alt="">
                </el-form-item>
                <el-form-item label="积分类型">
                    <span>固定积分 积@{{detailInfo.points}}分</span>
                </el-form-item>
                <el-form-item label="活动链接">
                    <span>@{{detailInfo.act_url}}</span>
                </el-form-item>
                <el-form-item label="活动二维码">
                    <div id="qrcode"></div>
                    <!-- <span>@{{detailInfo.download_url}}</span> -->
                </el-form-item>
            </el-form>
        </div>

        <!-- 活动列表 -->
        <div v-else>
            <el-table
            v-loading="loading"
            :data="tableData"
            style="width: 100%">
                <el-table-column
                    prop="id"
                    width="100"
                    label="活动ID">
                </el-table-column>
                <el-table-column
                    prop="title"
                    label="活动名称">
                </el-table-column>
                <el-table-column
                    label="活动有效期">
                    <template slot-scope="scoped">
                        <span>@{{scoped.row.sdate}}</span> 至 <span>@{{scoped.row.edate}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作">
                    <template slot-scope="scoped">
                        <el-link type="success" style="margin-right:25px;" :underline="false" @click="handleModify(scoped.row.id)">修改</el-link>
                        <el-link type="success" :underline="false" @click="detailShow(scoped.row)">查看详情</el-link>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                style="margin-top:20px;"
                background
                @current-change="handleCurrentChange"
                :current-page.sync="page"
                :page-size="page_size"
                layout="prev, pager, next, total"
                :total="total">
            </el-pagination>
        </div>
    </div>
@endsection

@section('footer')
    <script src="/js/jquery.qrcode.min.js?v={{config('constants.wcc_file_version')}}"></script>
    <script type="text/javascript" src="/js/wcc-element-ui/vue.js?v={{config('constants.wcc_file_version')}}"></script>
    <script type="text/javascript" src="/js/wcc-element-ui/index.js?v={{config('constants.wcc_file_version')}}"></script>
    <script type="text/javascript">
      $(function () {
        new Vue({
            el: '#integral-list',
            data() {
                return{
                    showDetail:false,//是否展示详情
                    detailLoading:false,
                    loading:false,
                    tableData:[],//列表数据
                    page:1,
                    page_size:10,
                    total:0,
                    detailInfo:{
                        id:""
                    }//详情信息
                }
            },
            mounted() {
                this.pointsPartyList();
            },
            methods: {
                //显示活动详情
                detailShow(val){
                    this.showDetail = true;
                    this.pointsPartyDetails(val.id);
                },
                //查看详情
                pointsPartyDetails(id){
                    this.detailLoading = true;
                    this.detailInfo = {};
                    this.ajax('post', '/IntegralAct/pointsPartyDetails', {
                        id:id
                    }).then(res=>{
                        this.detailLoading = false;
                        let {status,info,data} = res;
                        if(status == 200){
                            this.detailInfo = data;
                            $("#qrcode").qrcode({
                                width: 200, //宽度
                                height:200, //高度
                                text: data.act_url, //任意内容
                            })
                        }else{
                            this.$message.error(info);
                        }
                    })
                },
                handleCurrentChange(val){
                    this.page = val;
                    this.pointsPartyList();
                },
                //获取积分活动记录
                pointsPartyList() {
                    this.loading = true;
                    this.ajax('post', '/IntegralAct/pointsPartyList', {
                        page:this.page,
                        page_size:this.page_size
                    }).then((res)=>{
                        this.loading = false;
                        let {status,info,data} = res;
                        if(status == 200){
                            this.tableData = data.data;
                            this.total = data.total;
                        }else{
                            this.$message.error(info);
                        }
                    }).catch((error)=>{

                    });
                },
                //修改
                handleModify(id){
                    location.href = "/IntegralAct/pointsPage?id="+ id;
                },
                //封装请求
                ajax(method, url, data) {
                    return new Promise((resolve, reject) => {
                        $.ajax({
                        type: method,
                        url: url,
                        dataType: "json",
                        data: data,
                        success(res) {
                            resolve(res)
                        },
                        error(err) {
                            reject(err)
                            console.log("request—error")
                        }
                        })
                    })
                }
            }
        })
      })
    </script>
@endsection
