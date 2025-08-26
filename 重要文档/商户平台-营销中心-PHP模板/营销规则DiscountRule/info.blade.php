@extends('layout/master')
@section('header')
    <link rel="stylesheet" href="/css/wcc-element-ui/index.css?v={{config('constants.wcc_file_version')}}">
    <link rel="stylesheet" href="/css/wcc-element-ui/wcc.css?v={{config('constants.wcc_file_version')}}">
    <link rel="stylesheet" href="/css/DiscountRule/list.css?v={{config('constants.wcc_file_version')}}"/>
@endsection

@section('content')

<div id="DiscountRuleList" class="discountRuleList">
    <!-- 规则详情 -->
    <el-form class="discountRuleDetail" ref="form" :model="form" label-width="230px">
        <el-form-item label="优惠类型">
            <div>@{{RuleDiscountType}}</div>
        </el-form-item>
        <el-form-item label="规则名称">
            <div>@{{form.RuleName}}</div>
        </el-form-item>
        <el-form-item label="规则ID">
            <div>@{{form.ID}}</div>
        </el-form-item>
        <el-form-item label="规则时间">
            <div>@{{form.RuleStartTime}} 至 @{{form.RuleEndTime}}</div>
        </el-form-item>
        <el-form-item label="规则油站">
            <div>@{{form.RuleStation}}</div>
        </el-form-item>
        <el-form-item label="专车身份">
            <div>@{{form.RuleIdentity}}</div>
        </el-form-item>
        <el-form-item label="商品类型">
            <div>@{{form.RuleDiscountMethod}}</div>
        </el-form-item>
        <el-form-item label="支付方式">
            <div>@{{form.RulePayMethod}}</div>
        </el-form-item>
        <el-form-item label="卡名称" v-if="showCardName">
            <div>@{{form.RuleCardName}}</div>
        </el-form-item>
        <el-form-item v-if="form.RuleCardType" label="卡类型">
            <div>@{{form.RuleCardType}}</div>
        </el-form-item>
        <el-form-item label="用户限制">
            <div>@{{form.RuleCustomerType}}</div>
        </el-form-item>
        <el-form-item v-if="RuleCustomerInfo && form.RuleCustomerType=='会员等级'" label="会员等级名称">
            <div>@{{RuleCustomerInfo}}</div>
        </el-form-item>
        <el-form-item v-else-if="RuleCustomerInfo && form.RuleCustomerType=='卡组'" label="卡组名称">
            <div>@{{RuleCustomerInfo}}</div>
        </el-form-item>
        <el-form-item v-else-if="RuleCustomerInfo && form.RuleCustomerType=='车队卡'" label="车队卡名称">
            <div>@{{RuleCustomerInfo}}</div>
        </el-form-item>
        
        <el-form-item label="优惠油品">
            <div>@{{form.RuleOilInfo}}</div>
        </el-form-item>
        <el-form-item label="重复类型">
            <div>@{{form.repetTime}}</div>
        </el-form-item>
        <!-- 取整方式：0->四舍五入；1->进位；2->截尾 -->
        <el-form-item label="实付金额取整方式">
          <div v-if="form.RuleEnding == 0">四舍五入</div>
          <div v-else-if="form.RuleEnding == 1">进位</div>
          <div v-else-if="form.RuleEnding == 2">截尾</div>
        </el-form-item>
        <el-form-item label="优惠规则">
            <div v-for="(item,index) in discountList" :key="index" v-html="item" ></div>
        </el-form-item>
        <el-form-item label="是否与积分抵油互斥">
            <div>@{{form.ISOilDisplacement}}</div>
        </el-form-item>
        <el-form-item label="是否抵扣券共享">
            <div>@{{form.ISCoupon}}</div>
        </el-form-item>
        <el-form-item label="是否与其他优惠共享">
            <div>@{{form.ISDiscountShare}}</div>
        </el-form-item>
        <el-form-item label="优先级">
            <div>@{{form.RulePriority}}</div>
        </el-form-item>
        <div style="padding:20px 230px">
            <el-button type="primary" @click="baseOut">关闭</el-button>
        </div>
    </el-form>
</div>
@endsection

@section('footer')
    <script src="/js/wcc-element-ui/vue.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/wcc-element-ui/index.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/axios.min.js"> </script>
    <script src="/js/bignumber.min.js"></script>
    <script>
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


       

        var pay_list = {!!json_encode($pay_list)!!}; //卡组
        var company_list = {!!json_encode($company_list)!!}; //车队卡列表
        var customer_group_list = {!!json_encode($customer_group_list)!!}; //卡组

        new Vue({
            el: '#DiscountRuleList',
            data() {
                return {
                    form:{

                    },
                    ruleType:"",
                    levels:[],
                    card_theme_list:[],
                    company_list:[],
                    customer_group_list:[],
                    oils:[],
                    discountList:[],
                    RuleDiscountType:"",
                    RuleCustomerInfo:"",
                    weekList:[
                        "星期一","星期二","星期三","星期四","星期五","星期六","星期日"
                    ],
                    payTypeList:pay_list,
                    showCardName:false,
                    customeTrType:[
                        {
                            name:"个人卡",
                            value:"1"
                        },
                        {
                            name:"车队卡",
                            value:"2"
                        },
                        {
                            name:"不记名卡",
                            value:"3"
                        },
                    ],
                    userLimit:[
                        {
                            name:"会员等级",
                            value:"LA"
                        },
                        {
                            name:"卡组",
                            value:"G"
                        },
                        {
                            name:"车队卡",
                            value:"C"
                        },
                    ],
                    repetTime:[
                        {
                            name:"每日",
                            value:"D"
                        },
                        {
                            name:"每周",
                            value:"W"
                        },
                        {
                            name:"每月",
                            value:"M"
                        },
                    ],
                    prefereType:[
                            {
                                name:"按实付",
                                unit:"元",
                                value:0
                            },
                            {
                                name:"按原价",
                                unit:"元",
                                value:5
                            },
                            {
                                name:"按升数",
                                unit:"升",
                                value:1
                            },
                            {
                                name:"按数量",
                                unit:"件",
                                value:1
                            },
                            {
                                name:"按充值金额",
                                unit:"元",
                                value:2
                            }
                        ],

                    discountShareType:[
                            {
                                name:"折扣",
                                value:"0"
                            },
                            {
                                name:"优惠直减",
                                value:"1"
                            },
                            {
                                name:"赠送",
                                value:"2"
                            }
                        ],


                }
            },
            mounted() {
                this.getDetail(getQueryVariable("id"))
            },
            methods: {
                baseOut(){
                    window.location.href="/CardMarketing/marketingRules";
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
                                /*
                                RuleTyep        是        int        规则类型；0=整单，1=明细
                                RuleDiscountMethod        是        int        规则优惠类型；0=油品， 1=非油品
                                RuleDiscountType        是        int        规则优惠方式； 0=折扣，1=优惠直减（明细中为单价直减；整单中为整单总额直减）， 2=赠送，3=一口价，4=充值直降（只有明细）
                                */
                                
                                that.form = res.data;
                                that.ruleType = res.data.RuleTyep;
                                that.levels = res.data.levels;
                                that.card_theme_list = res.data.card_theme_list.dt;
                                that.company_list = res.data.company_list.dt;
                                that.customer_group_list = res.data.customer_group_list.dt;
                               
                                that.oils = res.data.oils;

                                that.form.RuleStartTime = that.form.RuleStartTime.replace(/T/ig," ");
                                that.form.RuleEndTime = that.form.RuleEndTime.replace(/T/ig," ");

                               //优惠类型
                               if(res.data.RuleDiscountType == 0){
                                    that.RuleDiscountType = "折扣"
                                }else if(res.data.RuleDiscountType == 1){
                                    that.RuleDiscountType = "满立减"
                                }else if(res.data.RuleDiscountType == 2){
                                    that.RuleDiscountType = "赠送"
                                }else if(res.data.RuleDiscountType == 3){
                                    that.RuleDiscountType = "单价锁定"
                                }else if(res.data.RuleDiscountType == 4){
                                    that.RuleDiscountType = "充值直降"
                                }else if(res.data.RuleDiscountType == 5){
                                    that.RuleDiscountType = "每满直降"
                                }else if(res.data.RuleDiscountType == 6){
                                    that.RuleDiscountType = "每满折扣"
                                }

                                //专车身份
                                let _data = {}
                                if(res.data.RuleStid){
                                    _data.stids = res.data.RuleStid.split(',') 
                                    delete _data.is_all
                                }else {
                                    _data.stids = []
                                    _data.is_all = 1
                                }
                                _data.start_time = that.form.RuleStartTime
                                _data.end_time = that.form.RuleEndTime
                                _data.is_identity = 1
                                console.log('专车身份',_data);
                                $.ajax({
                                    url: '/CardMarketing/getStationChannel',
                                    type: 'POST',
                                    dataType: 'json',
                                    data: _data,
                                    success: function(_res) {
                                        let _rule = []
                                        let _RuleIdentity = res.data.RuleIdentity.split(',')
                                        _res.data.forEach(v => {
                                            if(_RuleIdentity.includes(v.channel_code)){
                                                _rule .push(v.name)
                                            }
                                        })
                                        that.form.RuleIdentity = _rule.join(",")||'所有专车身份';
                                    }
                                })
                                
                               //支付方式
                               var _pay = [];
                               var _RulePayMethod = res.data.RulePayMethod.split(",");
                               
                                that.payTypeList.forEach(function(item){
                                    if(_RulePayMethod.includes(item.BH)){
                                        _pay.push(item.MC)
                                    }
                                    //判断是否含有卡
                                    if(_RulePayMethod.includes("3")){
                                        that.showCardName = true;
                                    }
                                })
                                that.form.RulePayMethod = _pay.join(",")||'所有支付方式';
                                that.form.RuleStation = res.data.RuleStation || '所有油站'
                                that.form.RuleDiscountMethod = res.data.RuleDiscountMethod==2?'所有商品':res.data.RuleDiscountMethod==0?'油品':'非油品'

                                //卡主题
                                var _RuleCardNameList = [];
                                var _RuleCardName = res.data.RuleCardName.split(",");
                                that.card_theme_list.forEach(function(item){
                                   
                                    if(_RuleCardName.includes(item.ID.toString())){
                                        
                                        _RuleCardNameList.push(item.Name)
                                    }
                                })
                                that.form.RuleCardName = _RuleCardNameList.join(",")||"无";
                               


                                //卡类型
                                var _RuleCard = [];
                                var _RuleCardType = res.data.RuleCardType.split(",");
                               
                                that.customeTrType.forEach(function(item){
                                    if(_RuleCardType.includes(item.value)){
                                        _RuleCard.push(item.name)
                                    }
                                })
                                that.form.RuleCardType = _RuleCard.join(",");


                                
                                that.RuleCustomerInfo = "";
                                var _RuleCustomerName = [];
                                if(res.data.RuleCustomerType == "LA"){
                                    //会员等级
                                    var _RuleCustomerInfo = res.data.RuleCustomerInfo.split(",");
                                    that.levels.forEach(function(item){
                                        if(_RuleCustomerInfo.includes((item.id).toString())){
                                            _RuleCustomerName.push(item.level_name)
                                        }
                                    })
                                    that.RuleCustomerInfo = _RuleCustomerName.join(",");
                                    if(!that.RuleCustomerInfo){
                                        that.RuleCustomerInfo = res.data.RuleCustomerInfo=='nonmember'?'非会员':'不限'
                                    }
                                }else if(res.data.RuleCustomerType == "G"){
                                    //卡组
                                    var _RuleCustomerInfo = res.data.RuleCustomerInfo.split(",");
                                    that.customer_group_list.forEach(function(item){
                                        if(_RuleCustomerInfo.includes((item.ID).toString())){
                                            _RuleCustomerName.push(item.CustomerGroupName)
                                        }
                                    })
                                    that.RuleCustomerInfo = _RuleCustomerName.join(",");
                                    if(!that.RuleCustomerInfo){
                                        that.RuleCustomerInfo = '不限'
                                    }
                                }else if(res.data.RuleCustomerType == "C"){
                                    //车队卡
                                    var _RuleCustomerInfo = res.data.RuleCustomerInfo.split(",");
                                    that.company_list.forEach(function(item){
                                        if(_RuleCustomerInfo.includes((item.ID).toString())){
                                            _RuleCustomerName.push(item.CompanyName)
                                        }
                                    })
                                    that.RuleCustomerInfo = _RuleCustomerName.join(",");
                                    if(!that.RuleCustomerInfo){
                                        that.RuleCustomerInfo = '不限'
                                    }
                                }

                                //用户限制
                                var _RuleCustomerType = "";
                                that.userLimit.forEach(function(item){
                                   if(res.data.RuleCustomerType == item.value){
                                        _RuleCustomerType = item.name;
                                    }

                                    
                                })
                                that.form.RuleCustomerType = _RuleCustomerType;

                                //优惠油品
                               
                                var _oilList = [];
                                that.oils.forEach(function(item){
                                    
                                    if(that.form.RuleOilInfo.includes(item.oil_id)){
                                        _oilList.push(item.oil_name)
                                    }
                                })
                                that.form.RuleOilInfo = _oilList.join(",")||"所有油品";


                                //重复类型
                                var _RepeaType = "";
                                that.repetTime.forEach(function(item){
                                    if(res.data.RuleRepeatTime[0].RepeaType == item.value){
                                     _RepeaType = item.name;
                                    }
                                })
                                that.form.repetTime = _RepeaType;

                                //优惠规则
                                that.discountList = [];
                                that.form.RuleDiscount.forEach(function(item){
                                    //一口价的规制
                                    if(res.data.RuleDiscountType == 3){
                                        that.discountList.push(that._setDiscountFixed(item))
                                    //每满多少  或者每满多少件
                                    }else if(res.data.RuleDiscountType == 2 || res.data.RuleDiscountType == 5 || res.data.RuleDiscountType == 6){
                                        that.discountList.push(that._setDiscountZS(item,res.data.RuleDiscountType))
                                    }else{
                                        that.discountList.push(that._setDiscountDetail(item))
                                    }
                                   
                                })
                               

                               //是否与积分抵油互斥
                               if(that.form.ISOilDisplacement==1){
                                that.form.ISOilDisplacement = "不限制"
                               }else{
                                that.form.ISOilDisplacement = "不可共享"
                               }


                               //是否抵扣券共享
                               if(that.form.ISCoupon==1){
                                that.form.ISCoupon = "不限制"
                               }else{
                                that.form.ISCoupon = "不可共享"
                               }

                               //是否与其他优惠共享
                               if(that.form.ISDiscountShare==0){
                                that.form.ISDiscountShare = "不限制"
                               }else if(that.form.ISDiscountShare==1){

                                    var _typeList = that.form.DiscountShareType.split(",");
                                    var _nameList = [];
                                    that.discountShareType.forEach(function(item){
                                        if(_typeList.includes(item.value)){
                                            _nameList.push(item.name)
                                        }
                                    })
                                    that.form.ISDiscountShare = "选择 "+_nameList.join("、")+" 可共享"

                               }else if(that.form.ISDiscountShare==2){
                                that.form.ISDiscountShare = "不可共享"
                               }
                                
                            }else{
                                that.$message.error(res.info);
                            }
                        }
                    })
                },


                _setDiscountFixed(obj){
                    var that = this;
                   
                   var _text = [];
                   var _list = [];
                   var _pay = [];
                   var _type = "";
                   var cal = obj.calculationInterval;

                   cal.forEach(function(element){
                        var PayMethod = element.PayMethod.split(',');
                        var oilAndGoods = element.oilAndGoods;
                        var Type = element.Type;
                        var price = element.calculation;

                        var oilList = [];
                        oilAndGoods.forEach(function(item){
                            oilList.push(item.SKU)
                            _list.push(item.GoodsName);
                        })

                        that.oils.forEach(function(item){
                            if(oilList.includes(item.oil_id)){
                                // _list.push(item.oil_name)
                            }
                        })


                        that.payTypeList.forEach(function(item){
                            if(PayMethod.includes(item.BH)){
                                _pay.push(item.MC)
                            }
                        })


                        that.prefereType.forEach(function(item){
                            if(Type == item.value){
                                _type = item.name;
                            }
                        })
                        if(Type == 1){
                            that.form.RuleDiscountMethod == '油品' ? (_type = '按升数') : (_type = '按数量')
                        }


                        var priceList = [];
                        price.forEach(function(item){
                            priceList.push(" 一口价"+item.CalculationNum+"元")
                        })
                        _text.push(" 用 【<span style='color:#7f7f7f'>"+ _pay.join("、") +"</span>】支付 【<span style='color:#7f7f7f'>" + _list.join("、")+"</span>】"+ priceList.join(""))

                   })
                   

               
                   
                   return _text.join("   ");
                },

                _setDiscountDetail(item){
                    var _repeat = "";//日期重复
                    
                    if(item.repeatTime.RepeaType == 'D'){
                        _repeat+="每天";
                        _repeat+= item.repeatTime.timeRule_SJList[0].QSSJ+"-"+item.repeatTime.timeRule_SJList[0].JZSJ;
                       
                    }else if(item.repeatTime.RepeaType == 'W'){
                        _repeat+="每周";
                        if(item.repeatTime.RepeatPeriod && item.repeatTime.RepeatPeriod.length>0){
                            _repeat+=this.getWeekList(item.repeatTime.RepeatPeriod)+" ";
                        }
                        _repeat+= item.repeatTime.timeRule_SJList[0].QSSJ+"-"+item.repeatTime.timeRule_SJList[0].JZSJ;
                    }else if(item.repeatTime.RepeaType == 'M'){
                        _repeat+="每月";
                        if(item.repeatTime.RepeatPeriod && item.repeatTime.RepeatPeriod.length>0){
                            _repeat+= item.repeatTime.RepeatPeriod.join("日、")+"日 ";
                        }
                        _repeat+= item.repeatTime.timeRule_SJList[0].QSSJ+"-"+item.repeatTime.timeRule_SJList[0].JZSJ;

                    }

                    //油品
                    //ruleType 0=整单  1=明细
                    if(this.ruleType==0){
                        var _cal = this._setCalculationTextByAll(item.calculationInterval);
                    }else{
                        var _cal = this._setCalculationText(item.calculationInterval);
                    }
                    

                    //明细

                    var _detail = "";
                    


                    return  _repeat+"<br/>"+_cal+"<br/>";
                },



                _setDiscountZS(item,RuleDiscountType){
                    var _repeat = "";//日期重复
                    
                    if(item.repeatTime.RepeaType == 'D'){
                        _repeat+="每天";
                        _repeat+= item.repeatTime.timeRule_SJList[0].QSSJ+"-"+item.repeatTime.timeRule_SJList[0].JZSJ;
                       
                    }else if(item.repeatTime.RepeaType == 'W'){
                        _repeat+="每周";
                        if(item.repeatTime.RepeatPeriod && item.repeatTime.RepeatPeriod.length>0){
                            _repeat+=this.getWeekList(item.repeatTime.RepeatPeriod)+" ";
                        }
                        _repeat+= item.repeatTime.timeRule_SJList[0].QSSJ+"-"+item.repeatTime.timeRule_SJList[0].JZSJ;
                    }else if(item.repeatTime.RepeaType == 'M'){
                        _repeat+="每月";
                        if(item.repeatTime.RepeatPeriod && item.repeatTime.RepeatPeriod.length>0){
                            _repeat+= item.repeatTime.RepeatPeriod.join("日、")+"日 ";
                        }
                        _repeat+= item.repeatTime.timeRule_SJList[0].QSSJ+"-"+item.repeatTime.timeRule_SJList[0].JZSJ;

                    }

                    //油品
                    //ruleType 0=整单  1=明细
                    if(this.ruleType==0){
                        var _cal = this._setCalculationTextByAll(item.calculationInterval,RuleDiscountType);
                    }else{
                        var _cal = this._setCalculationText(item.calculationInterval,RuleDiscountType);
                    }
                    

                    //明细

                    var _detail = "";
                    


                    return  _repeat+"<br/>"+_cal+"<br/>";
                },


                getWeekList(list){
                    var that = this;
                    var str="";
                    list.forEach(function(element){
                        str+= that.weekList[element-1]+"、"
                    })
                    return str
                },

                _setCalculationText(cal,RuleDiscountType){
                   
                   var that = this;
                   
                   var _text = [];
                   var _list = [];
                   var _pay = [];
                   var _type = "";
                    var _unit = "";
                   cal.forEach(function(element){
                        var PayMethod = element.PayMethod.split(',');
                        var oilAndGoods = element.oilAndGoods || [];
                        var Type = element.Type;
                        var price = element.calculation;

                        var oilList = [];
                        oilAndGoods.forEach(function(item){
                            oilList.push(item.SKU)
                            _list.push(item.GoodsName);
                        })

                        that.oils.forEach(function(item){
                            if(oilList.includes(item.oil_id)){
                                // _list.push(item.oil_name)
                            }
                        })


                        that.payTypeList.forEach(function(item){
                            if(PayMethod.includes(item.BH)){
                                _pay.push(item.MC)
                            }
                        })


                        that.prefereType.forEach(function(item){
                            if(Type == item.value){
                                _type = item.name;
                                _unit = item.unit;
                            }
                        })
                        if(Type == 1){
                            that.form.RuleDiscountMethod == '油品' ? (_type = '按升数') : (_type = '按数量')
                            that.form.RuleDiscountMethod == '油品' ? (_unit = '升') : (_unit = '件')
                        }


                        var priceList = [];
                        price.forEach(function(item){
                            

                            
                            
                            var b = (that.form.RuleDiscountType==0)?"享受":"直降";

                            let num1 = new BigNumber('10')
                            let num2 = new BigNumber(String(item.CalculationNum))
                            var c = (that.form.RuleDiscountType==0)?num1.times(num2).toString()+"折":item.CalculationNum+"元";


                            var d = [];
                            if(item.giveCouponList && item.giveCouponList.length>0){
                                item.giveCouponList.forEach(function(coupon){
                                    d.push(coupon.CouponNum +"张\""+coupon.CouponName+"\"");
                                })
                            }
                            if(item.giveGoodsList && item.giveGoodsList.length>0){
                                item.giveGoodsList.forEach(function(coupon){
                                    d.push(coupon.GiveNum +"件\""+coupon.GoodsName+"\"");
                                })
                            }
                            if(item.GiveType == 1){
                                d = d.join(" 或 ");
                            }else{
                                d = d.join(" 和 ");
                            }
                            
                                
                            if(RuleDiscountType==2){
                                priceList.push(item.StartNum+_unit+" 至 "+item.EndNum+_unit+"，赠送"+d+"<br/>")
                            }else if(RuleDiscountType==5){
                                priceList.push("每满 "+item.EndNum+_unit+"，直降"+item.CalculationNum+"元<br/>")
                            }else if(RuleDiscountType==6){
                                priceList.push("每满 "+item.EndNum+_unit+"，享受"+num1.times(num2).toString()+"折<br/>")
                            }else{
                                priceList.push(item.StartNum+_unit+" 至 "+item.EndNum+_unit+"，"+b+c+"<br/>")
                            }

                            
                           
                        })

                        _text.push(" 用 【<span style='color:#7f7f7f'>"+ _pay.join("、") +"</span>】支付 【<span style='color:#7f7f7f'>" + _list.join("、")+"</span>】"+ _type +"【<span style='color:#7f7f7f'>"+priceList.join(" ")+"</span>】")

                   })
                   

               
                   
                   return _text.join("   ");
               },

               //整单  isZS是否是赠送
               _setCalculationTextByAll(cal,RuleDiscountType){
                   
                   var that = this;
                   
                   var _text = [];
                   var _list = [];
                  
                   var _type = "";
                 
                   cal.forEach(function(element){
                        var PayMethod = element.PayMethod;
                        var oilAndGoods = element.oilAndGoods;
                        var Type = element.Type;
                        var price = element.calculation;

                        

                        


                        that.prefereType.forEach(function(item){
                            if(Type == item.value){
                                _type = item.name;
                            }
                        })
                        if(Type == 1){
                            that.form.RuleDiscountMethod == '油品' ? (_type = '按升数') : (_type = '按数量')
                        }


                        var priceList = [];
                        price.forEach(function(item){
                            
                            
                            if(_type == "按原价"){
                                var a = "元";
                            }else if(_type == "按升数"){
                                var a = "升";
                            }else if(_type == "按金额"){
                                var a = "元";
                            }else if(_type == "按数量"){
                                var a = "件";
                            }else if(_type == "按实付"){
                                var a = "元";
                            }
                            
                            let num1 = new BigNumber('10')
                            let num2 = new BigNumber(String(item.CalculationNum))
                            var b = (that.form.RuleDiscountType==0)?"享受":"直降";
                            var c = (that.form.RuleDiscountType==0)?num1.times(num2).toString()+"折":item.CalculationNum+"元";
                            
                            var d = [];
                            if(item.giveCouponList && item.giveCouponList.length>0){
                                item.giveCouponList.forEach(function(coupon){
                                    d.push(coupon.CouponNum +"张\""+coupon.CouponName+"\"");
                                })
                            }
                            if(item.giveGoodsList && item.giveGoodsList.length>0){
                                item.giveGoodsList.forEach(function(coupon){
                                    d.push(coupon.GiveNum +"件\""+coupon.GoodsName+"\"");
                                })
                            }
                            if(item.GiveType == 1){
                                d = d.join(" 或 ");
                            }else{
                                d = d.join(" 和 ");
                            }

                            if(RuleDiscountType==2){
                                priceList.push(item.StartNum+a+" 至 "+item.EndNum+a+"，赠送"+d+"<br/>")
                            }else if(RuleDiscountType==5){
                                priceList.push("每满 "+item.EndNum+a+"，直降"+item.CalculationNum+"元<br/>")
                            }else if(RuleDiscountType==6){
                                priceList.push("每满 "+item.EndNum+a+"，享受"+num1.times(num2).toString()+"折<br/>")
                            }else{
                                priceList.push(item.StartNum+a+" 至 "+item.EndNum+a+"，"+b+c+"<br/>")
                            }
                           
                        })
                        _text.push(priceList.join(" "))

                   })
                   

               
                   
                   return _text.join("   ");
               },


               
            }
        });
    </script>
@endsection
