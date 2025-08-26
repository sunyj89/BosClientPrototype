@extends('layout/master')
@section('header')
    <link rel="stylesheet" href="/css/wcc-element-ui/index.css?v={{config('constants.wcc_file_version')}}">
    <link rel="stylesheet" href="/css/wcc-element-ui/wcc.css?v={{config('constants.wcc_file_version')}}">
    <link rel="stylesheet" href="/css/DiscountRule/index.css?v={{config('constants.wcc_file_version')}}"/>
@endsection

@section('content')
    <div id="priceMarketing">

        <div class="priceMarketing">
            <!-- 创建类型选择 -->
            <div v-show="showListData">
                <div class="list-title">价格营销</div>
                <div class="pricMarketing-card-box">
                    <div class="item" v-for="(item,index) in cardList" @click="goToCreate(item.value)"
                         :key="'cardList'+index">
                        <img class="icon" :src="item.src" alt="">
                        <div class="txt-box">
                            <div>@{{item.title}}</div>
                            <div class="txt">@{{item.description}}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-show="!showListData">

                <!-- 基本信息 -->
                <div v-show="showBaseInfo">
                    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                        <el-form-item :required="true" label="规则名称" required>
                            <el-input v-model="form.rule_name" placeholder="请输入名称" maxlength="30" show-word-limit  style="width: 360px;"></el-input>
                        </el-form-item>
                        <el-form-item :required="true" label="活动时间">
                            <el-date-picker v-model="form.time"  :default-time="['00:00:00', '23:59:59']" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange"
                                             range-separator="至" start-placeholder="开始日期"
                                            end-placeholder="结束日期" align="right">
                            </el-date-picker>
                            <span class="timeTitle">活动结束时间不可早于一口价储值卡有效时间</span>
                        </el-form-item>
                        <el-form-item :required="true" label="优惠油站" required>
                          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="selectAllStation">全选</el-checkbox>
                            <div style="margin: 0;"></div>
                            <el-checkbox-group v-model="form.selection_stids" @change="changeStation">
                                <el-checkbox :label="station.stid" :key="'stname'+index"
                                             v-for="(station,index) in station_list">@{{station.stname}}
                                </el-checkbox>
                            </el-checkbox-group>
                       
                        </el-form-item>
                        <el-form-item :required="true" label="支付方式" required>

                            <el-checkbox v-model="form.payType" disabled>加油卡</el-checkbox>

                            <div class="cardbox" v-show="form.showCardTheme">
                                <span class="title">卡名称</span>
                                <el-checkbox :indeterminate="isIndeterminateOfCardTheme" v-model="checkAllOfCardTheme" @change="CheckAllChangeOfCardTheme">全选</el-checkbox>
                                <div style="margin: 0;"></div>
                                <el-checkbox-group v-model="form.cardThemeList">
                                    <el-checkbox :label="card_theme.ID" v-for="(card_theme,index) in card_theme_list"
                                                 :key="'card_theme'+index">@{{card_theme.Name}}
                                    </el-checkbox>

                                </el-checkbox-group>
                                <span class="title">卡类型</span>
                                <el-checkbox-group v-model="form.customeTrType">
                                    <el-checkbox label="1" disabled>个人卡</el-checkbox>

                                </el-checkbox-group>
                            </div>
                        </el-form-item>


                        <el-form-item :required="true" label="优惠油品" required>
                            <el-radio-group v-model="form.oilsList" style="width: 60%">
                                <el-radio style="height: 2rem " :label="oil" :key="'oilsList'+index"
                                          v-for="(oil,index) in oils">@{{oil.oil_name}}
                                </el-radio>
                            </el-radio-group>

                        </el-form-item>

                        <el-form-item label="实付金额取整方式" required>
                          <el-select v-model="submit.rule_ending" placeholder="请选择">
                            <el-option
                              v-for="(item,index) in form.ruleEndType"
                              :key="index"
                              :label="item.name"
                              :value="item.value">
                            </el-option>
                          </el-select>
                          <el-tooltip class="tipsHeader" placement="right" effect="light">
                            <div slot="content">
                                <p>举例说明：</p>
                                <p>优惠后实付金额为24.3322</p>
                                <p>四舍五入后实付金额为24.33</p>
                                <p>截尾后实付金额为24.00</p>
                                <p>进位后实付金额为25.00</p>
                            </div>
                            <i  type="primary" size="10" class="el-icon-question"></i>
                          </el-tooltip>
                        </el-form-item>

                        <el-form-item label="价格" prop="CalculationNum">
                            <el-input v-model="form.CalculationNum" style="width: 130px;"></el-input>&nbsp;&nbsp;元
                            <span class="timeTitle">此价格为规则生效后价格</span>
                        </el-form-item>

                        <el-form-item label="状态">
                          <el-radio-group v-model="submit.rule_state">
                              <el-radio label="100">启用</el-radio>
                              <el-radio label="101">禁用</el-radio>
                          </el-radio-group>
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" @click="submitData">确认修改</el-button>
                        </el-form-item>
                    </el-form>
                </div>

            </div>
        </div>
    </div>
@endsection

@section('footer')
    <script src="/js/wcc-element-ui/vue.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/wcc-element-ui/index.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/axios.min.js"></script>
    <script>

      var station_list = {!!json_encode($station_list)!!};//油站列表
      const station_arr = []
      Object.keys(station_list).forEach(item => {
        let obj = {
          stid: station_list[item]['stid'],
          stname: station_list[item]['stname'],
        }
        station_arr.push(obj)
      })
      station_list = station_arr
      var levels = {!!json_encode($levels)!!};//等级
      var oils = {!!json_encode($oils)!!};//油耗
      var card_theme_list = {!!json_encode($card_theme_list)!!}; //卡主题列表
      var company_list = {!!json_encode($company_list)!!}; //车队卡列表
      var customer_group_list = {!!json_encode($customer_group_list)!!}; //卡组
      var _stid = {!!$stid!!} //单站判断， 0集团， >0单站
        console.log('单站判断',_stid);

      function getQueryVariable(variable)
        {
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            for (var i=0;i<vars.length;i++) {
                    var pair = vars[i].split("=");
                    if(pair[0] == variable){return pair[1];}
            }
            return(false);
        }

      new Vue({
        el: '#priceMarketing',
        data() {
          var validateNum = (rule, value, callback) => {
              if (value === '') {
              callback(new Error('请输入≥0的正确数值，例0.50，小数点后限4位'));
              } else {
                  var regex = /^\d+(\.\d{1,4})?$/;
                  if (regex.test(value)) {
                      callback()
                  }else{
                      callback(new Error('请输入≥0的正确数值，例0.50，小数点后限4位'));
                  }
              }
          };
          return {
            rules:{
              CalculationNum: [
                {required: true, validator: validateNum, trigger: 'blur'}
              ]
            },
            checkAll: false,
            isIndeterminate: false,
            isShowTypeBox: true,
            station_list: station_list,
            levels: levels,
            oils: oils,
            card_theme_list: card_theme_list.dt,
            company_list: company_list.dt,
            customer_group_list: customer_group_list.dt,
            showListData: false,
            weekList: [
              "一", "二", "三", "四", "五", "六", "日"
            ],
            checkAllOfCardTheme: false,
            isIndeterminateOfCardTheme: true,
            payTypeList: [
              {
                name: "加油卡",
                value: 0
              }
            ],
            cardList: [
              {
                value: "1",
                src: "http://fs1.weicheche.cn/images/test/191230055902-18439.png",
                title: "整单折扣",
                description: "加油满200元/满30升，油款98折",
              },
              {
                value: "2",
                src: "http://fs1.weicheche.cn/images/test/191230060200-75535.png",
                title: "金额直减",
                description: "这里是金额直减说明",
              },
              {
                value: "3",
                src: "http://fs1.weicheche.cn/images/test/191230060234-89828.png",
                title: "整单赠送",
                description: "这里是整单赠送说明",
              },
              {
                value: "4",
                src: "http://fs1.weicheche.cn/images/test/191230060300-58094.png",
                title: "明细折扣",
                description: "这里是明细折扣说明",
              },
              {
                value: "5",
                src: "http://fs1.weicheche.cn/images/test/191230060508-57598.png",
                title: "一口价",
                description: "这里是一口价说明",
              },
              {
                value: "6",
                src: "http://fs1.weicheche.cn/images/test/191230060534-62622.png",
                title: "单升直减",
                description: "加油满200元/满30升，每升优惠0.2元",
              },
              {
                value: "7",
                src: "http://fs1.weicheche.cn/images/test/191230060556-63046.png",
                title: "明细赠送",
                description: "这里是明细赠送说明",
              },
            ],
            defaultActive: 0,
            showBaseInfo: true,//基本信息
            showdetail: false,//优惠明细
            showControl: false,//优惠限制
            form: {
              rule_name: '',
              selection_stids: [],
              CalculationNum: '',
              selectLevels: [], //选择会员等级
              selectCustomerGroup: [],//选择卡组
              selectCompanyList: [],//选择车队卡
              selectLevelsType: "0",
              selectCustomerGroupType: "0",
              selectCompanyListType: "0",
              payType: true,//支付方式
              showCardTheme: true,//是否显示卡主题
              cardThemeList: [],//卡主题
              customeTrType: ["1"],//客户类型
              oilsList: '',//优惠油品


              time: "",//活动时间
              region: '',
              date: '',
              typeValue: [],
              type: 0,
              selectedTime: [],

              // 取整方式
              ruleEndType: [
                {
                    name:"四舍五入",
                    value:0
                },
                {
                    name:"进位",
                    value:1
                },
                {
                    name:"截尾",
                    value:2
                }
              ],
              prefereType: [
                {
                  name: "按原价",
                  value: 5
                },
                {
                  name: "按实付",
                  value: 0
                },
                {
                  name: "按升数",
                  value: 1
                }
              ]
            },


            isCheckTime: false,//检查时间规则合格的变量
            tipsText: `1、优先级定为1，2，3...10，数字越高，优先级越低2、优先级有两个作用，一方面，在同时间段内，存在相同类型的活动时，作为判断优先启用哪一个规则的判断依据。优先级较高的规则，优先判断，若优先级一样，则根据优惠规则的创建/修改时间来判断，创建时间越早的优先级越高。另一方面，当不同类型的优惠规则共享情况下，根据优先级的大小，决定优惠规则的计算顺序。若优先级一样，则根据优惠规则的创建/修改时间来判断，创建时间越早的优先级越高。`,

           

            submit: {
              "rule_id": "",                         	  		//规则id，修改时需要传
              "rule_type": 1,                      			//规则类型
              "rule_discount_method": 0,           	 		//规则优惠类型
              "rule_discount_type": 3,  			 			//规则优惠方式
              "rule_discount_detailed_type": 0, 	 			//规则明细方式
              "rule_name": "", 						//规则名称
              "start_date": "", 			//开始时间
              "end_date": "", 	 			//结束时间
              "selection_stids": [], 			//选中的油站id集合，‘,’分隔
              "rule_pay_method": "", 					//规则可用支付方式，‘,’分隔
              "rule_card_name": "", 						//制卡规则id集合，‘,’分隔
              "rule_card_type": "", 						//规则可用卡类型，‘,’分隔
              "rule_customer_type": "", 						//车队卡是"C"，卡组是"G",会员等级是"LA"，rule_customer_info 是相关选中的ID
              "rule_customer_info": "", 					// 是rule_customer_type选中的相关id，‘,’分隔
              "oli_ids": "", 							//油品id集合，‘,’分隔
              "rule_priority": 3, 							//规则优先级，优先级10最低，1最高
              "is_oil_displacement": "1", 						//是否允许与积分抵油共享；1为不限制(默认)，0为不可共享
              "is_coupon": "1", 								//是否允许与抵扣券共享；1为不限制(默认)，0为不可共享
              "is_discount_share": "2", 						//是否允许与其他优惠共享，0为不限制（默认）， 1为可共享类型，2为不可共享类型
              "discount_share_type": [], 				//共享优惠类型，‘,’分隔
              "rule_formulate_leve": 1, 							//规则制定的等级,1为集团（默认）,2=大区,3=分公司,4=油站
              "rule_state": "100", 								//规则状态,100=正常，101=禁用，102=历史记录
              "rule_ending": 0, 								// 取整方式，0四舍五入，1进位，2截尾
              "rule_repeat_time": [],						//规则重复时间
              "rule_discount": []	//规则优惠明细，里面优惠
            }
          }
        },
        mounted() {
          this.selectAllStation(true)
          this.getDetail(getQueryVariable("id"));
        },
        watch:{
            //反选
            'form.selection_stids'(){ //优惠油站
                let checkedCount = this.form.selection_stids.length;
                this.checkAll = checkedCount === this.station_list.length
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.station_list.length
            },
            'form.cardThemeList'(){//卡名称
                let checkedCount = this.form.cardThemeList.length;
                this.checkAllOfCardTheme = checkedCount === this.card_theme_list.length;
                this.isIndeterminateOfCardTheme = checkedCount > 0 && checkedCount < this.card_theme_list.length;
            },
        },

        methods: {
          //卡名称全选
          CheckAllChangeOfCardTheme(val) {
                    var _selectList = [];
                    this.card_theme_list.forEach(function(item){
                        _selectList.push(item.ID)
                    })
                    this.form.cardThemeList = val ? _selectList : [];
                    this.isIndeterminateOfCardTheme = false;
                   
                },
          getDetail(id){
                    var that = this;
                    $.ajax({
                        url: '/CardMarketing/getRuleInfo',
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            "id":id,
                        },
                        success: function(res) {
                            if (res.status == 200) {
                                //that.form = res.data;
                                
                                //规则名称
                                that.form.rule_name = res.data.RuleName;

                                //活动时间
                                var RuleStartTime = res.data.RuleStartTime.replace(/T/g," ");
                                var RuleEndTime = res.data.RuleEndTime.replace(/T/g," ");
                                that.form.time = [RuleStartTime,RuleEndTime];
                               
                                //优惠油站
                                var selectionName = res.data.RuleStation.split(",");
                                var selection_stids = [];
                                
                                selectionName.forEach(function(item){
                                    for(var station in station_list){
                                        if(station_list[station].stname == item){
                                            selection_stids.push(station_list[station].stid)
                                        }
                                    }
                                })
                                
                                that.form.selection_stids = selection_stids;

                                //卡名称
                                var cardName = res.data.RuleCardName.split(",");
                                var cardNameList = [];
                                cardName.forEach(function(element){
                                    cardNameList.push(Number(element))
                                })
                                that.form.cardThemeList= cardNameList;

                               //卡类型
                                var cardType = res.data.RuleCardType.split(",");
                                that.form.customeTrType  = cardType;

                                //优惠油品
                                var OilInfo = res.data.RuleOilInfo.split(",");
                                var OilInfo_ids ;
                                
                                OilInfo.forEach(function(item){
                                    oils.forEach(function(element){
                                        if(element.oil_id == item){
                                          OilInfo_ids = element;
                                        }
                                    })

                                })
                                // 空判断,全选中
                                if(that.form.selection_stids.length==0){//优惠油站
                                    that.isIndeterminate=false
                                    that.checkAll=true
                                    that.form.selection_stids=[]
                                    for(let i in that.station_list){
                                        that.form.selection_stids.push(station_list[i].stid)
                                    }
                                }
                                if(!that.form.cardThemeList[0]){//卡名称
                                    that.isIndeterminateOfCardTheme=false
                                    that.checkAllOfCardTheme=true
                                    console.log('卡名称',that.card_theme_list);
                                    that.card_theme_list.forEach((v,i)=>{
                                        that.form.cardThemeList[i]=v.ID
                                    })
                                }
                                
                                that.form.oilsList = OilInfo_ids;

                                that.form.CalculationNum = res.data.RuleDiscount[0].calculationInterval[0].calculation[0].CalculationNum;

                                that.submit.rule_id = res.data.ID;
                                that.submit.rule_ending = res.data.RuleEnding;

                                that.submit.rule_state = res.data.RuleState.toString();
                               
                            }else{
                                that.$message.error(res.info);
                            }
                        }
                    })
                },
          changeStation(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.station_list.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.station_list.length;
          },
          selectAllStation(val) {
            let arr = []
            this.station_list.forEach((item) => {
              arr.push(item.stid)
            })
            this.form.selection_stids = val ? arr : [];
            this.isIndeterminate = false;
          },
          toAddRule(index) {
            this.isShowTypeBox = false;
            if (index == 1) {
              this.submit.rule_type = 0;
              this.submit.rule_discount_method = 0;
              this.submit.rule_discount_type = 0;
              this.submit.rule_discount_detailed_type = 0;

            } else if (index == 2) {
              this.submit.rule_type = 1;
              this.submit.rule_discount_method = 0;
              this.submit.rule_discount_type = 0;
              this.submit.rule_discount_detailed_type = 0;
            }

          },
          getWeekList(list) {
            var that = this;
            var str = "";
            list.forEach(function (element) {
              str += that.weekList[element - 1] + ","
            })
            return str
          },
          _setCalculationText(cal) {

            var that = this;
            var PayMethod = cal.PayMethod;
            var oilAndGoods = cal.oilAndGoods;
            var Type = cal.Type;
            var _list = [];
            that.form.oilsList.forEach(function (item) {
              if (oilAndGoods.includes(item.oil_id)) {
                _list.push(item.oil_name)
              }
            })

            var _pay = [];
            that.form.payType.forEach(function (item) {
              if (PayMethod.includes(item.value)) {
                _pay.push(item.name)
              }
            })

            var _type = "";
            that.form.prefereType.forEach(function (item) {
              if (Type == item.value) {
                _type = item.name;
              }
            })


            return _list.join("、") + " 用 " + _pay.join("、") + " " + _type;
          },
          baseNext() {
            //转换时间
            var that = this;
            that.submit.rule_discount = [];


            if (this.form.selectedTime) {
              this.form.selectedTime.forEach(function (element) {

                that.submit.rule_discount.push({
                  "DetailedType": 1, //优惠明细类型， 1=单品，2=混搭
                  "repeatTime": {//重复时间
                    "RepeaType": _t, //同上
                    "RepeatPeriod": element.date || "",
                    "timeRule_SJList": [
                      {"QSSJ": element.time[0], "JZSJ": element.time[1]}
                    ]
                  },
                  "calculationInterval": [
                    {
                      "Type": 5, //计算区间类型，5=原价，1=升数,0=实付
                      "CalculationType": "*", //计算类型; + =赠送,- =直减,* =折扣,= =一口价
                      "PayMethod": "",//支付方式，用,号分割
                      "calculation": [
                        {
                          "StartNum": "", //区间开始值
                          "EndNum": "", //区间截止值
                          "CalculationNum": "", //计算数，如果是折扣需要除以100
                          "ISGive": false, //是否为赠送，false=不是赠送规则
                        }
                      ],
                      "oilAndGoods": [],
                    }
                  ],
                })

              })
            }
            //进行验证
            if (!this.submit.rule_name) {
              this.$message.error('请输入规则名称！');
              return;
            }

            if (!this.form.time) {
              this.$message.error('请选择活动时间！');
              return;
            }

            
            if (this.form.CalculationNum === '') {
              this.$message.error('请输入金额！');
              return;
            }


            this.defaultActive = 1;
            this.showBaseInfo = false;
            this.showdetail = true;
            // return ;


          },
          detailBefore() {
            this.defaultActive = 0;
            this.showBaseInfo = true;
            this.showdetail = false;
          },
          detailNext() {
            this.defaultActive = 2;
            this.showdetail = false;
            this.showControl = true;
          },
          controlBefore() {
            this.defaultActive = 1;
            this.showdetail = true;
            this.showControl = false;
          },
          //检查时间合法性
          checkTime(val) {
            this.isCheckTime = val;
          },

          addBox(parent) {
            var list = {
              "StartNum": "", //区间开始值
              "EndNum": "", //区间截止值
              "CalculationNum": "", //计算数，如果是折扣需要除以100
              "ISGive": false, //是否为赠送，false=不是赠送规则
            };
            parent.push(list)
          },
          removeBox(index, parent) {
            parent.splice(index, 1)
          },
          removeCalculation(index, parent) {
            parent.splice(index, 1)
          },
          addCalculation(parent) {
            parent.calculationInterval.push(
              {
                "Type": 0, //计算区间类型，0=原价，1=升数
                "CalculationType": "*", //计算类型; + =赠送,- =直减,* =折扣,= =一口价
                "PayMethod": "",//支付方式，用,号分割
                "calculation": [
                  {
                    "StartNum": "", //区间开始值
                    "EndNum": "", //区间截止值
                    "CalculationNum": "", //计算数，如果是折扣需要除以100
                    "ISGive": false, //是否为赠送，false=不是赠送规则
                  }
                ],
                "oilAndGoods": [],
              }
            )
          },

          submitData() {
            var that = this;
            // 表单校验
            this.$refs.form.validate((valid) => {
              if(!valid) return

            //进行验证
            if (!this.form.rule_name) {
              this.$message.error('请输入规则名称！');
              return;
            }

            if (!this.form.time) {
              this.$message.error('请选择活动时间！');
              return;
            }

            if (this.form.selection_stids.length == 0) {
              this.$message.error('请选择优惠油站！');
              return;
            }

            if (this.form.showCardTheme) {
              if (this.form.cardThemeList.length == 0) {
                this.$message.error('请选择卡名称！');
                return;
              }
            }

            if (this.form.oilsList === '') {
              this.$message.error('请选择优惠油品！');
              return;
            }

            if (this.form.CalculationNum === '') {
              this.$message.error('请输入金额！');
              return;
            }

            var data = {};
            //进行数值转换
            //日期转换
            data.start_date = this.form.time[0];
            data.end_date = this.form.time[1];
            //规则可用支付方式，‘,’分隔

            data.rule_pay_method = "3";

            data.rule_name = this.form.rule_name

            //选中的油站id集合，‘,’分隔
            data.selection_stids = this.form.selection_stids.join(",");

            //制卡规则id集合，‘,’分隔
            data.rule_card_name = this.form.cardThemeList.join(",");

            //规则可用卡类型，‘,’分隔
            data.rule_card_type = this.form.customeTrType.join(",");

            //规则可用卡类型，‘,’分隔
            data.oli_ids = that.form.oilsList.oil_id
            var oilAndGoods = [{
                              "Type": "0", //类型;0=油品,1=非油品
                              "SKU": that.form.oilsList.oil_id, //条码
                              "GoodsName": that.form.oilsList.oil_name //商品名称 
                          }];

            that.submit.rule_discount = [{
              "DetailedType": 1, //优惠明细类型， 1=单品，2=混搭
              "repeatTime": {//重复时间
                "RepeaType": "D", //同上
                "RepeatPeriod": [],
                "timeRule_SJList": [
                  {"QSSJ": "00:00:00", "JZSJ": "23:59:59"}
                ]
              },
              "calculationInterval": [{
                "Type": 1, //计算区间类型，0=原价，1=升数
                "CalculationType": "=", //计算类型; + =赠送,- =直减,* =折扣,= =一口价
                "PayMethod": "3",//支付方式，用,号分割
                "calculation": [
                  {
                    "StartNum": "0", //区间开始值
                    "EndNum": "9999", //区间截止值
                    "CalculationNum": that.form.CalculationNum, //计算数，如果是折扣需要除以100金额
                    "ISGive": false, //是否为赠送，false=不是赠送规则
                  }
                ],
                "oilAndGoods": oilAndGoods ,
              }]
            }]


            //共享优惠类型，‘,’分隔
            data.discount_share_type = "0";

            data.rule_discount = JSON.parse(JSON.stringify(this.submit.rule_discount));

            data.rule_customer_type = "LA";
            data.rule_customer_info = "";

            data.rule_repeat_time = [{
              "RepeaType": "D", //同上
              "RepeatPeriod": [],
              "timeRule_SJList": [
                {"QSSJ": "00:00:00", "JZSJ": "23:59:59"}
              ]
            }];

            let params = {
              "type":1,
              "id": that.submit.rule_id,
              "rule_type": that.submit.rule_type,
              "rule_discount_method": that.submit.rule_discount_method,
              "rule_discount_type": that.submit.rule_discount_type,
              "rule_discount_detailed_type": that.submit.rule_discount_detailed_type,
              "rule_name": data.rule_name,
              "start_date": data.start_date,
              "end_date": data.end_date,
              "selection_stids": data.selection_stids,
              "rule_pay_method": data.rule_pay_method,
              "rule_card_name": data.rule_card_name,
              "rule_card_type": data.rule_card_type,
              "rule_customer_type": data.rule_customer_type,
              "rule_customer_info": data.rule_customer_info,
              "oli_ids": data.oli_ids,
              "rule_priority": that.submit.rule_priority,
              "is_oil_displacement": that.submit.is_oil_displacement,
              "is_coupon": that.submit.is_coupon,
              "is_discount_share": that.submit.is_discount_share,
              "discount_share_type": data.discount_share_type,
              "rule_formulate_leve": that.submit.rule_formulate_leve,
              "rule_state": Number(that.submit.rule_state),
              "rule_ending": that.submit.rule_ending,
              "rule_repeat_time": data.rule_repeat_time,
              "rule_discount": data.rule_discount,
            }
            //全选逻辑优化
            if(this.checkAll && _stid == 0) params.selection_stids='' //优惠油站
            if(this.checkAllOfCardTheme) params.rule_card_name='' //卡名称

            $.ajax({
              url: '/CardMarketing/create',
              type: 'POST',
              dataType: 'json',
              data: params,
              success: function (res) {
                if (res.status == 200) {
                  window.location.href = "/CardMarketing/marketingRules";
                } else {
                  that.$message.error(res.info);
                }
              }
            })
          })
          }
        }
      });
    </script>
@endsection
