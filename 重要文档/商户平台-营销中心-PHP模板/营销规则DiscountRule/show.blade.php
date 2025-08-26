@extends('layout/master')
@section('header')
    <link rel="stylesheet" href="/css/wcc-element-ui/index.css?v={{config('constants.wcc_file_version')}}">
    <link rel="stylesheet" href="/css/wcc-element-ui/wcc.css?v={{config('constants.wcc_file_version')}}">
    <link rel="stylesheet" href="/css/DiscountRule/list.css?v={{config('constants.wcc_file_version')}}"/>
@endsection

@section('content')

    <div id="DiscountRuleList" class="discountRuleList">
        <p class="title">规则记录</p>
        <ul class="tab-box">
            <li>状 态</li>
            <li v-for="(item,index) in stateList" @click="stateChange(index,item.value)" :key="item.index" :class="{active:stateValue == index}"
              >@{{item.lable}}
            </li>
        </ul>
        <ul class="tab-box">
            <li>优惠类型</li>
            <li v-for="(item,index) in typeList" :key="item.index" :class="{active:typeValue == index}"
                @click="typeChange(index,item.value)">@{{item.lable}}
            </li>
        </ul>
        <ul class="tab-box">
            <li>油品类型</li>
            <li v-for="(item,index) in oilType" :key="item.index" :class="{active:oilTypeValue == index}"
                @click="oilTypeChange(index,item.value)">@{{item.lable}}
            </li>
        </ul>
        <ul class="tab-box">
            <li>可用油站</li>
            <li :class="{active:StationValue == '0'}" @click="stationChange(0)">全部</li>
            <li v-for="(item,key,index) in station_list" :key="item.index" :class="{active:StationValue == index+1}"
                @click="stationChange(index+1,key)">@{{item.stname}}
            </li>
        </ul>
        <!-- 表格数据 -->
        <div class="search-box">
          <el-input style="width:200px"  placeholder="请输入规则名称"  v-model="keyWord"  clearable></el-input>  
          <el-input style="width:150px"  placeholder="请输入ID"  v-model="keyID"  clearable></el-input>  
          <el-button type="primary" @click="getList">搜索</el-button>
        </div>
        <el-table  v-loading="loading"
                class="DiscountRuleList-data"
                :data="tableData">
            <el-table-column
                    align="center"
                    prop="ID"
                    label="ID"
                    width="100">
            </el-table-column>
           
            <el-table-column
                    prop="RuleName"
                    label="规则名称">
            </el-table-column>
            <el-table-column
                    prop="RulePriority" width="100"
                    label="优先级">
            </el-table-column>
            <el-table-column
                    prop="RuleDiscountType" width="100"
                    label="优惠类型">
                    <template slot-scope="scope">
                      <span  v-if="scope.row.RuleDiscountType=='0'" >折扣</span>
                      <span  v-else-if="scope.row.RuleDiscountType=='1'" >满立减</span>
                      <span  v-else-if="scope.row.RuleDiscountType=='2'" >赠送</span>
                      <span  v-else-if="scope.row.RuleDiscountType=='3'" >单价锁定</span>
                      <span  v-else-if="scope.row.RuleDiscountType=='4'" >充值直降</span>
                      <span  v-else-if="scope.row.RuleDiscountType=='5'" >每满直降</span>
                      <span  v-else-if="scope.row.RuleDiscountType=='6'" >每满折扣</span>
                  </template>
            </el-table-column>
            <el-table-column
                    prop="RuleStartTime" width="400"
                    label="规则有效期">
                <template slot-scope="scope">
                    @{{scope.row.RuleStartTime}} 至 @{{scope.row.RuleEndTime}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="ActivityStatus" width="100"
                    label="状态">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.ActivityStatus=='NotStarted'">未开始</el-tag>
                  <el-tag v-else-if="scope.row.ActivityStatus=='Active'" type="success">进行中</el-tag>
                  <el-tag v-else-if="scope.row.ActivityStatus=='Expired'" type="info">已结束</el-tag>
                  <el-tag v-else-if="scope.row.ActivityStatus=='Disable'" type="info">已禁用</el-tag>
                </template>
            </el-table-column>
            <el-table-column  prop="RuleState" width="100"
                    label="是否启用">
                <template slot-scope="scope">
                  <span  v-if="scope.row.RuleState=='100'"  type="primary">启用</span>
                  <span :underline="false" v-else type="danger">禁用</span>
                </template>
            </el-table-column>
            
            <el-table-column
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="toDetail(scope.row.ID)">查看详情</el-button>
                    <el-button type="text" @click="eitDetail(scope.row.ID, scope.row)">修改</el-button>
                    <el-button type="text" v-if="scope.row.RuleState=='100'" @click="openRule(scope.row,101)">禁用</el-button>
                    <el-button type="text" v-else @click="openRule(scope.row,100)">启用</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageSize"
                layout="prev, pager, next, total, sizes"
                :total="total">
        </el-pagination>
    </div>
@endsection

@section('footer')
    <script src="/js/wcc-element-ui/vue.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/wcc-element-ui/index.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/axios.min.js"></script>
    <script>
      new Vue({
        el: '#DiscountRuleList',
        data() {
          return {
            radio: "",
            keyWord:"",
            keyID:'',
            // stids:"",
            loading:true,
            stateList: [
              {value: 0, lable: "全部"},
              {value: 1, lable: "未开始"},
              {value: 2, lable: "进行中"},
              {value: 3, lable: "已结束"}
            ],
            stateValue: "0",
            typeList: [
              {value: 7, lable: "全部"},
              {value: 0, lable: "折扣"},
              {value: 1, lable: "满立减"},
              {value: 2, lable: "赠送"},
              {value: 3, lable: "单价锁定"},
              {value: 4, lable: "充值直降"},
              {value: 5, lable: "每满直降"},
              {value: 6, lable: "每满折扣"}
            ],
            typeValue: "0",
            oilType:[
              {value: 3, lable: "全部"},
              {value: 0, lable: "油品"},
              {value: 1, lable: "非油品"},
            ],
            station_list:{!!json_encode($station_list)!!},
            oilTypeValue: "0",
            StationValue: "0",
            stids:[],
            "query_type":0,
            "rule_type":7,
            "oil_type":3,
            tableData: [],
            currentPage: 1,
            pageSize: 10,
            total: 0,
          }
        },
        mounted() {
          this.getList();
          console.log('station_list', {!!json_encode($station_list)!!} );
        },
        watch:{
          //监听输入规则和ID，只能搜索一个
          keyWord(newV){
            if(newV != ''){
              this.keyID = ''
            }
          },
          keyID(newV){
            if(newV != ''){
              this.keyWord = ''
            }
          }
        },
        methods: {
          eitDetail(id, item) {
            //判断是否是一口价  判断的规则是  CalculationType 是 ”=“
            var RuleDiscount = JSON.parse(item.RuleDiscount)
            
            if (RuleDiscount[0].calculationInterval[0].CalculationType == "=") {
              if(item.Type){
                window.location.href = "/CardMarketing/ruleEdit?id=" + id+"&type="+item.Type;
              }else{
                window.location.href = "/CardMarketing/ruleEdit?id=" + id+"&type=1";
              }
             

              //充值直降
            }else if (RuleDiscount[0].calculationInterval[0].Type == "2") {
              window.location.href = "/CardMarketing/ruleEdit?id=" + id+"&type=2";
            }else{
              //兼容性
              if(item.Type && item.Type>=7){
                window.location.href = "/CardMarketing/ruleEdit?id=" + id+"&type="+item.Type;
              }else{
                window.location.href = "/CardMarketing/ruleEdit?id=" + id;
              }
             
            }
            console.log(item);
          },
          //改变状态
          stateChange(index,value) {
            console.log(value)
            this.stateValue = index;
            this.query_type = value;
            this.currentPage = 1;
            this.getList();
          },
          openRule(row,state){
            var that = this;
            that.loading = true;
            $.ajax({
              url: '/CardMarketing/updateRuleState',
              type: 'POST',
              dataType: 'json',
              data: {
                "id": row.ID,
                "state":state,
                "rule_name":row.RuleName,
                "rule_discount_method":row.RuleDiscountMethod,
                "rule_discount_type":row.RuleDiscountType,
                "is_yiye":0,
              },
              success: function (res) {

                if (res.status == 200) {
                  that.getList();
                } else {
                  that.$message.error(res.info);
                }
              }
            })
          },
          //改变类型
          typeChange(index,value) {
            this.typeValue = index;
            this.rule_type = value;
            this.currentPage = 1;
            this.getList();
          },
          //改变油品类型
          oilTypeChange(index,value){
            this.keyID = ''
            this.keyWord = ''
            this.oilTypeValue = index;
            this.oil_type = value;
            this.currentPage = 1
            this.getList()
          },
          //改变油站类型
          stationChange(index,value){
            console.log('油站',index,value);
            //如果是全选
            this.stids = []
            if(index == 0){
              for (const key in this.station_list) {
                this.stids.push(key)
              }
            }else{
              this.stids = [value];
            }
            this.keyID = ''
            this.keyWord = ''
            this.StationValue = index;
            
            this.currentPage = 1
            this.getList()
          },
          //分页-start
          handleSizeChange(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.getList();
          },
          handleCurrentChange(val) {
            this.currentPage = val;
            this.getList() 
            console.log( this.currentPage )
          },
          toDetail(id) {
            window.location.href = "/CardMarketing/ruleInfo?id=" + id;
          },

          

          getList() {
            var that = this;

            that.loading = true;
            let query_text_type = 1 //0=ID查询, 1=名称模糊查询, 2=油品非油品查询 三者不能同时查询
            let query_text_info = this.keyWord // 默认是名称查询，查询信息是keyWord

            if(this.oil_type != 3){ //oil_type 3全部 0油品 1非油品  根据油品非油品查询
              query_text_type = 2
              query_text_info = this.oil_type
            }
            if(this.keyID != ""){ //根据ID查询 油品类型恢复成全部
              this.oil_type = 3
              this.oilTypeValue = '0'
              query_text_type = 0
              query_text_info = this.keyID
            }
            if(this.keyWord != ""){ //根据名称模糊查询 油品类型恢复成全部
              this.oil_type = 3
              this.oilTypeValue = '0'
              query_text_type = 1
              query_text_info = this.keyWord
            }
            $.ajax({
              url: '/CardMarketing/getRules',
              type: 'POST',
              dataType: 'json',
              data: {
                "page": that.currentPage,
                "query_type":that.query_type,
                "rule_type":that.rule_type,
                "page_size":that.pageSize,
                "query_text_type":query_text_type,//0=ID查询, 1=名称模糊查询, 2=油品非油品查询
                "query_text_info":query_text_info,
                "stids":that.stids,
              },
              success: function (res) {
                that.loading = false;
                if (res.status == 200) {
                  that.tableData = res.data.dt;
                  that.total = res.data.total;
                  that.tableData.forEach(function (item) {
                    item.RuleStartTime = item.RuleStartTime.replace(/T/ig, " ");
                    item.RuleEndTime = item.RuleEndTime.replace(/T/ig, " ");
                  })
                } else {
                  that.$message.error(res.info);
                }
              }
            })
          }
          //分页-end
        }
      });
    </script>
@endsection
