@extends('layout/master')
@section('header')
<link rel="stylesheet" href="/css/wcc-element-ui/index.css?v={{config('constants.wcc_file_version')}}">
<link rel="stylesheet" href="/css/wcc-element-ui/wcc.css?v={{config('constants.wcc_file_version')}}">
<link rel="stylesheet" href="/css/MultiLevel/index.css?v={{config('constants.wcc_file_version')}}"/>
<style>
</style>
@endsection

@section('content')
<div id="memberSetting" class="memberSetting">
    <span>优惠类型：</span>
    <el-select v-model="typeValue" style="width:150px;margin-right:10px;">
        <el-option
        v-for="item in typeOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value">
        </el-option>
    </el-select>
    <span>商品类型：</span>
    <el-select v-model="oilValue" style="width:150px;margin-right:10px;">
        <el-option
        v-for="item in oilOptions"
        :key="item.id"
        :label="item.name"
        :value="item.id">
        </el-option>
    </el-select>
    <span>人员：</span>
    <el-select v-model="nameValue" filterable  style="width:150px;margin-right:10px;">
        <el-option
        v-for="item in nameOptions"
        :key="item.adid"
        :label="item.name"
        :value="item.adid">
        </el-option>
    </el-select>
    <el-checkbox v-model="onlyme">仅看与我有关</el-checkbox>
    <el-date-picker
        style="margin:0 10px;"
        :clearable=false
        v-model="dateValue"
        type="datetimerange"
        range-separator="至"
        value-format="yyyy-MM-dd HH:mm:ss"
        :default-time="['00:00:00','23:59:59']"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
    </el-date-picker>
    <el-button type="primary" @click="search">查询</el-button>
    <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%;">
        <el-table-column
            prop="id">
            <template slot-scope="scope">
                <div style="display:flex;justify-content: space-between;">
                    <span style="max-width: 80%;">@{{scope.row.oper_name}} @{{scope.row.operate}}</span>
                    <span>@{{getTime(scope.row.create_time)}}</span>
                </div>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination
        background
        style="margin-top:10px"
        layout="prev, pager, next, total"
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-size="pagesize"
        :total="total">
    </el-pagination>
</div>
@endsection

@section('footer')
    <script src="/js/wcc-element-ui/vue.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/wcc-element-ui/index.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/axios.min.js"> </script>
    <script>
        new Vue({
            el: '#memberSetting',
            data() {
                return {
                    typeOptions: [
                        {value: 7, label: "全部"},
                        {value: 0, label: "折扣"},
                        {value: 1, label: "满立减"},
                        {value: 2, label: "赠送"},
                        {value: 3, label: "单价锁定"},
                        {value: 4, label: "充值直降"},
                        {value: 5, label: "每满直降"},
                        {value: 6, label: "每满折扣"}
                    ],
                    typeValue: 7,
                    oilOptions:[{
                        name:"全部",
                        id:0
                    },{
                        name:"油品",
                        id:1
                    },{
                        name:"非油品",
                        id:2
                    }],//名称列表
                    oilValue:0,
                    nameOptions:[],//名称列表
                    nameValue:0,
                    onlyme:false,//仅看与我有关
                    dateValue:"",//自选时间
                    loading:false,
                    tableData:[],//流水数据
                    page:1,
                    pagesize:10,
                    total:0
                }
            },
            async mounted() {
                this.dateValue = [moment().subtract(1, "month").format("YYYY-MM-DD 00:00:00"),moment().format("YYYY-MM-DD 23:59:59")]
                this.nameOptions = [{
                    name:"全部",
                    adid:0
                }];
                let res = await this.getPersons();
                if(res.data.status == 200){
                    this.nameOptions = this.nameOptions.concat(res.data.data);
                }else{
                    this.$message.error(res.data.info);
                }
                this.getRuleLog();
            },
            methods: {
                getTime(time){
                    return moment(Number(time)*1000).format("YYYY-MM-DD HH:mm:ss");
                },
                //获取人员列表
                getPersons(){
                    return this.$axios("post","/CardMarketing/getPersons",{})
                },
                //获取订单流水列表
                async getRuleLog(){
                    this.loading = true;
                    let res = await this.$axios("post","/CardMarketing/getRuleLog",{
                        stime:this.dateValue?this.dateValue[0]:0,
                        etime:this.dateValue?this.dateValue[1]:0,
                        page:this.page,
                        pagesize:this.pagesize,
                        typeValue:this.typeValue,
                        nameValue:this.nameValue,
                        oilValue:this.oilValue,
                        onlyme:this.onlyme
                    })
                    this.loading = false;
                    if(res.data.status == 200){
                        this.tableData = res.data.data.data;
                        this.total = res.data.data.total;
                    }else{
                        this.$message.error(res.data.info);
                    }
                },
                //切换页码
                handleCurrentChange(val){
                    this.page = val;
                    this.getRuleLog();
                },
                //搜索
                search(){
                    this.page = 1;
                    this.getRuleLog();
                },

                //封装请求接口
                $axios(method, url, data) {
                    return new Promise((resolve, reject) => {
                        axios({
                            method: method,        
                            url: url,
                            data: data
                        }).then(function (res) {
                            resolve(res)
                        })
                        .catch(function (error) {
                            reject(error)
                        });
                    })
                },
            }
        });
    </script>
@endsection
