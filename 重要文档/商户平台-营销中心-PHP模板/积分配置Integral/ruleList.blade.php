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
        <el-alert
            title="请注意：使用会员营销系统的积分规则以后将禁用原来的规则设置。"
            style="height: 35px; position: absolute; z-index: 10; top:0"
            left
            class="alert"
            type="warning"
            show-icon>
        </el-alert>
        <div class="table-content">
            <template>
                <el-table :data="tableDatas" style="width: 100%">
                    <el-table-column v-for="(item, index) in tableTitle" :key="index" :prop="item.field" :label="item.label">
                    </el-table-column>
                    <el-table-column label="操作" width="300px">
                        <template slot-scope="scope">
                            <div class="flex-start" style="display: flex; justify-content: flex-start; align-items: center; cursor: pointer">
                                <div style="color: #32AF50; width: 50px;" class="common-button" @click="handleEdit(scope.$index, scope.row)">修改</div>
                                <div style="color: #32AF50; width: 50px;" v-show="scope.row.status !== '启用'" lass="common-button" @click="handle(scope.$index, scope.row, 100)">启用</div>
                                <div style="color: #FA5A00; width: 50px;" v-show="scope.row.status !== '禁用'"  class="forbidden-button" type="warning" @click="handle(scope.$index, scope.row, 101)">禁用</div>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                {{--<el-pagination--}}
                        {{--background--}}
                        {{--layout="prev, pager, next"--}}
                        {{--:total="1000">--}}
                {{--</el-pagination>--}}
            </template>
        </div>
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
              tableTitle: [{label: "ID", field: 'aid'}, {label: "状态", field: 'status'}, {label: "名称", field: 'ruleName'},
                {label: "用途", field: 'purpose'}, {label: "优先级", field: 'propity'}, {label: "计算公式", field: 'computeMode'}, {label: "时间规则", field: 'timeRule'}, {label: "起止时间", field: 'start_time'}],
              tableDatas: []
            }
          },
          mounted() {
            this.getList()
          },
          methods: {
            getList() {
              ajax('post', 'getRuleList', null, (res) => {
                if (res.status === 200) {
                  this.tableDatas = res.data.list
                  this.tableDatas.forEach((item) => {
                    item['status'] = this.filterStatus(item['status'])
                    item['start_time'] = `${this.filterTime(item['start_time'])}  至 ${this.filterTime(item['end_time'])}`
                  })
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
            handleEdit(index, row) {
              window.location.href = `/Integral/ruleCreation?id=${row.id}`
            },
            handle(index, row, code) {
              const that = this
              let successmessage = code === 100 ? '启用成功' : '禁用成功'
              let faildsmessage = code === 100 ? '启用失败' : '禁用失败'
              let data = {
                id: row.id,
                status: code
              }
              ajax('post', 'setRuleState', data, (res) => {
                if (res.status === 200) {
                  this.$notify({
                    showClose: true,
                    title: '操作提示',
                    message: successmessage,
                    type: 'success'
                  });
                  // window.location.reload();
                  this.getList()
                } else {
                  this.$notify({
                    showClose: true,
                    title: '操作提示',
                    message: faildsmessage,
                    type: 'error'
                  });
                }
              })
            }
          }
        })
    </script>
@endsection