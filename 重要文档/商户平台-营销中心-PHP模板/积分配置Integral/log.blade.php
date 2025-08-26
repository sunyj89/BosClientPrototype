@extends('layout/master')

@section('header')
    <link rel="stylesheet" type="text/css" href="/css/wcc.css?v={{config('constants.wcc_file_version')}}">
    <link rel="stylesheet" type="text/css"
          href="/css/Integral/ruleList.css?v={{config('constants.wcc_file_version')}}">
    <link rel="stylesheet" type="text/css"
          href="/css/Integral/integralcommon.css?v={{config('constants.wcc_file_version')}}">
    <link rel="stylesheet" type="text/css"
          href="/css/wcc-element-ui/index.css?v={{config('constants.wcc_file_version')}}">
    <link rel="stylesheet" type="text/css"
          href="/css/wcc-element-ui/wcc.css?v={{config('constants.wcc_file_version')}}">
@endsection

@section('content')
    <div class="content-wrap" id="integral-list" v-cloak>
        <div>
        

            <div class="search" style="text-align:right;padding:0 20px 20px 0">
                <el-date-picker
                    v-model="time"
                    @change="changeTime"
                    type="daterange"
                    value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
                <el-input style="width:160px;display:inline-block;margin:0 10px 0 20px"
                    placeholder="请输入日志名称"
                    v-model="keyword"
                    clearable>
                </el-input>
                <el-button type="primary" @click="search()">搜 索</el-button>
            </div>
        </div>
        <div class="table-content">
            <template>
            <el-table
                class="cardRuleListTable"   v-loading="loading"
                :data="tableTitle">
                    <el-table-column
                    prop="log_id"
                    align="center"
                    header-align="center"
                    label="ID">
                    </el-table-column>
                    <el-table-column
                    prop="account"
                    align="center"
                    header-align="center"
                    label="用户名">
                    </el-table-column>
                    <el-table-column
                    prop="name"
                    align="center"
                    header-align="center"
                    label="账号">
                    </el-table-column>
                    <el-table-column
                    prop="operate"
                    align="center"
                    header-align="center"
                    label="操作类型">
                    </el-table-column>
                  
                    <el-table-column
                    prop="address"
                    align="center"
                    header-align="center"
                    label="创建时间">
                        <template slot-scope="scope">
                            @{{scope.row.create_time}}
                        </template>
                    </el-table-column>
                    <el-table-column
                    align="center"
                    header-align="center"
                    label="操作">
                        <template slot-scope="scope">
                            <el-button @click="showLog(scope.row.log_message)" type="text" size="small">详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            
            </template>
        </div>


        <el-dialog
    class="dialog"
    title="日志详情"
    append-to-body
    :visible.sync="cardEditDialogVisible"
    width="640px">
    <div class="main">
        <div class="item first-item">
            <p>@{{logDetail}}</p>
         
        </div>
  
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cardEditDialogVisible = false">取 消</el-button>
    </span>
    </el-dialog>
    </div>
@endsection

@section('footer')
    <script type="text/javascript" src="/js/vendor/jquery/jquery.js?v={{config('constants.wcc_file_version')}}"></script>
    <script type="text/javascript" src="/js/wcc-element-ui/vue.js?v={{config('constants.wcc_file_version')}}"></script>
    <script type="text/javascript" src="/js/wcc-element-ui/index.js?v={{config('constants.wcc_file_version')}}"></script>
    <script type="text/javascript" src="/js/vendor/moment/moment.min.js?v={{config('constants.wcc_file_version')}}"></script>
    <script type="text/javascript">
        const ajax = (method, url, data, callback) => {
          $.ajax({
            type: method,
            url: url,
            // async:true,
            dataType: "json",
            data: data,
            success(res) {
              callback(res)
            },
            error() {
              console.log("request—error")
            }
          })
        }
        new Vue({
          el: '#integral-list',
          data() {
            return {
                cardEditDialogVisible:false,
                tableTitle:[],
                logDetail:"",
                time:[],
                keyword:"",
                account:"",
                loading:true,
            }
          },
          mounted() {
            

            let _today = moment();
            
            //默认为前一天的数据
            let day1 = _today.subtract(0, 'days').format('YYYY-MM-DD');
            let day2 = _today.subtract(-1, 'days').format('YYYY-MM-DD');
            this.time = [day1,day2];
            this.getLists()
          },
          methods: {
            
            //封装的ajax请求
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
                },
                //获取卡规则列表
                getLists(){
                    this.loading = true;
                    this.tableTitle = [];
                    this.ajax("post","/operateLog/Log/getList",{
                        type:105,
                        start_date:this.time[0],
                        end_date:this.time[1],
                        keyword:this.keyword
                    }).then((res)=>{
                        if(res.status == 200){
                            console.log(res)
                            this.loading = false;
                            this.tableTitle = res.data;
                            this.tableTitle.forEach((item) => {
                                item['operate'] = (JSON.parse(item["remark"])).operate;
                                item['name'] = (JSON.parse(item["remark"])).name;
                                item['account'] = (JSON.parse(item["remark"])).account;
                                
                                item['create_time'] = `${this.filterTime(item['create_time']*1000)}`
                            })
                            //this.totalNumber = res.data.TotalQty;
                        }else{
                            this.loading = false;
                        }
                    })
                },
            filterStatus(status) {
              if (status === 100) {
                return '启用'
              } else if(status === 101) {
                return '禁用'
              } else {

              }
            },
            filterTime(time) {
              return moment(time).format('YYYY-MM-DD HH:mm:ss')
            },
            search(){
                this.getLists();
            },

            showLog(d){
                this.cardEditDialogVisible = true;
                this.logDetail = d;
            },
            changeTime(e){
                if(this.time){
                    this.getLists();
                }
               
            },
          }
        })
    </script>
@endsection