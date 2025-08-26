@extends('layout/master')
@section('header')
    <link rel="stylesheet" href="/css/wcc-element-ui/index.css?v={{config('constants.wcc_file_version')}}">
    <link rel="stylesheet" href="/css/wcc-element-ui/wcc.css?v={{config('constants.wcc_file_version')}}">
    <link rel="stylesheet" href="/css/DiscountRule/index.css?v={{config('constants.wcc_file_version')}}"/>
    <link rel="stylesheet" href="/css/wcc.css?v={{config('constants.wcc_file_version')}}" />
@endsection

@section('content')
<div id="priceMarketing">
    
    <div  class="priceMarketing">
        
        <div >
            <el-steps :active="defaultActive" finish-status="success" simple style="margin-bottom: 20px">
                <el-step title="基本信息" ></el-step>
                <el-step title="优惠明细" ></el-step>
                <el-step title="优惠限制" ></el-step>
            </el-steps>
            <!-- 基本信息 -->
            <div v-show="showBaseInfo">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="规则名称" required>
                        <el-input v-model="submit.rule_name"  maxlength="30" show-word-limit placeholder="请输入名称" style="width: 360px;"></el-input>
                    </el-form-item>
                    <el-form-item label="活动时间" required>
                    <el-date-picker    v-model="form.time" :default-time="['00:00:00', '23:59:59']" value-format="yyyy-MM-dd HH:mm:ss"  type="datetimerange"      range-separator="至"    start-placeholder="开始日期"    end-placeholder="结束日期"    align="right">
                    </el-date-picker>
                    </el-form-item>
                    <el-form-item label="优惠油站" required>
                        <el-checkbox :indeterminate="isIndeterminateOfStids" v-model="checkAllOfStids" @change="CheckAllChangeOfStids">全部油站</el-checkbox>
                        <el-checkbox-group @change="getStationChannel" v-model="submit.selection_stids">
                            <el-checkbox :label="station.stid" :key="'stname'+index"  v-for="(station,index) in station_list">@{{station.stname}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="专车身份" required v-show="identity_list.length>0" >
                        <el-checkbox :indeterminate="isIndeterminateOfIdentity" v-model="checkAllOfIdentity" @change="CheckAllChangeOfIdentity">全部身份</el-checkbox>
                        <div style="margin: 0;"></div>
                        <el-checkbox-group    v-model="submit.selection_identity">
                            <el-checkbox :label="station.channel_code" :key="'identity'+index"  v-for="(station,index) in identity_list">@{{station.name}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="支付方式" required>
                        <el-checkbox :indeterminate="isIndeterminateOfPayType" v-model="checkAllOfPayType" @change="CheckAllChangeOfPayType">全部支付方式</el-checkbox>
                        <div style="margin: 0;"></div>
                        <el-checkbox-group v-model="form.payType" @change="changePayType">
                            <el-checkbox :label="item" :value="item" v-for="(item,index) in payTypeList" >@{{item.MC}}</el-checkbox>
                            
                        </el-checkbox-group>
                        <div class="cardbox" v-show="form.showCardTheme">
                            <span class="title">卡名称</span>
                            <el-checkbox :indeterminate="isIndeterminateOfCardTheme" v-model="checkAllOfCardTheme" @change="CheckAllChangeOfCardTheme">全部卡名称</el-checkbox>
                            <div style="margin: 0;"></div>
                            <el-checkbox-group v-model="form.cardThemeList">
                                <el-checkbox :label="card_theme.ID" v-for="(card_theme,index) in card_theme_list" :key="'card_theme'+index" >@{{card_theme.Name}}</el-checkbox>
                                
                            </el-checkbox-group>
                            <span class="title">卡类型</span>
                            <el-checkbox :indeterminate="isIndeterminateOfCustomeTrType" v-model="checkAllOfCustomeTrType" @change="CheckAllChangeOfCustomeTrType">全选</el-checkbox>
                            <div style="margin: 0;"></div>
                            <el-checkbox-group v-model="form.customeTrType" >
                                <el-checkbox label="1" >个人卡</el-checkbox>
                                <el-checkbox label="2" >车队卡</el-checkbox>
                                <el-checkbox label="3" >不记名卡</el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </el-form-item>
                    <el-form-item label="用户限制" required>
                        <el-radio-group v-model="form.userLimit">
                            <el-radio label="0">会员等级</el-radio>
                            <el-radio label="1" v-show="form.showCardTheme">卡组</el-radio>
                            <el-radio label="2" v-show="form.showCardTheme">车队卡</el-radio>
                        </el-radio-group>
                        <div class="cardbox">
                            <el-radio-group v-if="form.userLimit==0" v-model="form.selectLevelsType">
                                <el-radio label="0">不限</el-radio>
                                <el-radio label="1"> 非会员</el-radio>
                                <el-radio label="2">
                                    <el-select v-model="form.selectLevels"  @change="form.selectLevelsType='2'" multiple placeholder="请选择">
                                        <el-option
                                            v-for="(item,index) in levels"
                                            :key="'selectLevels'+index"
                                            :label="item.level_name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-radio>
                            </el-radio-group>
                            <el-radio-group v-else-if="form.userLimit==1" v-model="form.selectCustomerGroupType">
                                <el-radio label="0">不限</el-radio>
                                <el-radio label="2">
                                    <el-select v-model="form.selectCustomerGroup" filterable @change="form.selectCustomerGroupType='2'"  multiple placeholder="请选择">
                                        <el-option
                                            v-for="(item,index) in customer_group_list"
                                            :key="'selectCustomerGroup'+index"
                                            :label="item.CustomerGroupName"
                                            :value="item.ID">
                                        </el-option>
                                    </el-select>
                                </el-radio>
                            </el-radio-group>
                            <el-radio-group v-else-if="form.userLimit==2" v-model="form.selectCompanyListType">
                                <el-radio label="0">不限</el-radio>
                                <el-radio label="2">
                                    <el-select v-model="form.selectCompanyList" filterable @change="form.selectCompanyListType='2'"  multiple placeholder="请选择">
                                        <el-option
                                            v-for="(item,index) in company_list"
                                            :key="'selectCompanyList'+index"
                                            :label="item.CompanyName"
                                            :value="item.ID">
                                        </el-option>
                                    </el-select>
                                </el-radio>
                            </el-radio-group>
                            
                        </div>
                    </el-form-item>
                
                    <el-form-item  label="优惠油品" required>
                        <el-checkbox :indeterminate="isIndeterminateOfOils" v-model="checkAllOfOils" @change="CheckAllChangeOfOils">全部油品</el-checkbox>
                        <div style="margin: 0;"></div>
                        <el-checkbox-group v-model="form.oilsList">
                           
                            <el-checkbox :label="oil" :key="'oilsList'+index"  v-for="(oil,index) in oils">@{{oil.oil_name}}</el-checkbox>
                        </el-checkbox-group>
                    
                    </el-form-item>
                    <el-form-item label="重复类型" style="margin-bottom: 0;" required>
                        <el-radio-group v-model="form.repetTime" @change="changeRepetTime">
                            <el-radio :label="1" style="min-width: 80px">每日</el-radio>
                            <el-radio :label="2" style="min-width: 80px">每周</el-radio>
                            <el-radio :label="3" style="min-width: 80px">每月</el-radio>
                        </el-radio-group>
                
                    </el-form-item>
                    <el-repeat-time-picker
                        @change = "checkTime"
                        xstyle="width: 380px;"
                        style="margin-left: 75px;margin-bottom:25px"
                        value-format="HH:mm:ss"
                        :max-length="5"
                        v-model="form.selectedTime"
                        :type="form.repetTime">
                    </el-repeat-time-picker>
                    <el-form-item>
                        <el-button type="primary" @click="baseNext">下一步</el-button>
                        <el-button type="warning" @click="baseOut">放弃修改并退出</el-button>
                    </el-form-item>
                </el-form> 
            </div>
            <!-- 优惠明细 -->
            <div v-show="showdetail" class="detail">
            
                <div v-for="(item,index) in submit.rule_discount">
                    <p class="title"><span class="greenline"></span>
                        
                        <span  v-if="item.repeatTime.RepeaType=='D'">设置第@{{index+1}}段优惠明细（每日 @{{item.repeatTime.timeRule_SJList[0].QSSJ}}-@{{item.repeatTime.timeRule_SJList[0].JZSJ}})</span>
                        <span  v-if="item.repeatTime.RepeaType=='W'">设置第@{{index+1}}段优惠明细（每周@{{getWeekList(item.repeatTime.RepeatPeriod)}} @{{item.repeatTime.timeRule_SJList[0].QSSJ}}-@{{item.repeatTime.timeRule_SJList[0].JZSJ}})</span>
                        <span  v-if="item.repeatTime.RepeaType=='M'">设置第@{{index+1}}段优惠明细（每月@{{item.repeatTime.RepeatPeriod.toString()}} @{{item.repeatTime.timeRule_SJList[0].QSSJ}}-@{{item.repeatTime.timeRule_SJList[0].JZSJ}})</span>
                    </p>
                    
                    <div class="detail-main">
                        <div class="item" v-for="(cal,calIndex) in item.calculationInterval" :key="'calculationInterval'+calIndex">
                            <div >
                                <el-select v-model="cal.PayMethod" multiple collapse-tags  placeholder="请选择">
                                    <el-option
                                    v-for="(item,index) in form.payType"
                                    :key="'PayMethod'+index"
                                    :label="item.MC"
                                    :value="item.BH">
                                    </el-option>
                                </el-select>
                                <el-select v-model="cal.oilAndGoods" multiple collapse-tags @change="changeData(cal.oilAndGoods)"  placeholder="请选择">
                                    <el-option
                                    v-for="(item,index) in form.oilsList"
                                    :key="'oilAndGoods'+index"
                                    :label="item.oil_name"
                                    :value="item.oil_id">
                                    </el-option>
                                </el-select>
                                <el-select v-model="cal.Type" placeholder="请选择">
                                    <el-option
                                    v-for="(item,index) in form.prefereType"
                                    :key="'Type'+index"
                                    :label="item.name"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>

                            <div class="detail-desc">@{{_setCalculationText(cal)}}</div>
                        
                            <div id="box">
                                <div class="input-box" v-for="(time,timeIndex)  in cal.calculation" :key="'calculation'+timeIndex">                         
                                    <span>大于等于</span>
                                    <el-input-number v-model="time.StartNum" style="margin:0 10px" :min="0" :max="99999" :precision="2" :step="1" controls-position="right"></el-input-number>
                                    <span>小于</span>
                                    <el-input-number v-model="time.EndNum" style="margin:0 10px" :min="0" :max="99999"  :precision="2" :step="1" controls-position="right"></el-input-number>
                                    <span>
                                        <span v-if="cal.Type==0 || cal.Type == 5">元</span><span v-else>升</span>
                                        ，
                                        <span >整单奖励抵用券</span>
                                    </span>
                                    
                                    
                                    <span>
                                        <div class="coupon_select select" @click="showCoupon(time.couponObj)" type="0">
                                            <div class="coupon_title font-gray">@{{time.couponObj.name}}</div>
                                        </div>
                                    </span>
                                    
                                    <el-button v-show="timeIndex == cal.calculation.length-1" type="text" style="margin-left:20px" @click="addBox(cal.calculation)">添加</el-button>
                                    <el-button v-show="cal.calculation.length != 1" type="text" icon="el-icon-delete" style="margin-left:20px" @click="removeBox(timeIndex,cal.calculation)"></el-button>
                                </div>
                            </div>
                            <span   v-show="item.calculationInterval.length != 1"   class="delete-btn" @click="removeCalculation(calIndex,item.calculationInterval)">删除</span>
                        </div>
                    </div>
                    <el-button v-if="0" class="add-btn" icon="el-icon-plus" @click="addCalculation(item)">添加</el-button>
                </div>
            
                <div>
                    <el-button @click="detailBefore">上一步</el-button>
                    <el-button @click="detailNext" type="primary">下一步</el-button>
                    <el-button type="warning" @click="baseOut">放弃修改并退出</el-button>
                </div>
            </div>
            <!-- 优惠限制 -->
            <div v-show="showControl">
                <el-form ref="form" :model="form" label-width="200px">
                    <el-form-item label="是否与积分抵现共享">
                        <el-radio-group v-model="submit.is_oil_displacement">
                            <el-radio label="1">不限制</el-radio>
                            <el-radio label="0">不可共享</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="是否与抵扣券共享">
                        <el-radio-group v-model="submit.is_coupon">
                            <el-radio label="1">不限制</el-radio>
                            <el-radio label="0">不可共享</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="是否与其他优惠共享">
                        <el-radio-group v-model="submit.is_discount_share">
                            <el-radio label="1">可共享</el-radio>
                            <el-radio label="2">不可共享</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="优先级" required>
                        <el-input v-model="submit.rule_priority" style="width:90px"></el-input>
                        <el-tooltip class="tips"  placement="right" effect="light">
                            <div slot="content">
                                <p>1. 优先级定为1，2，3...10，数字越高优先级越低；</p>
                                <p>2. 优先级的判断原则：</p>
                                <p>1）判断是否不同类型优惠规则如折扣、直降、返赠、返送等；</p>
                                <p>2）优先级数字越低则优先级越高，即优先使用该规则；</p>
                                <p>3）若优先级一样，则根据优惠规则的创建或修改时间来判断，创建时间越早则优先级越高。</p>
                            </div>
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-radio-group v-model="submit.rule_state">
                            <el-radio label="100">启用</el-radio>
                            <el-radio label="101">禁用</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="controlBefore">上一步</el-button>
                        <el-button type="primary" @click="submitData">确 认</el-button>
                        <el-button type="warning" @click="baseOut">放弃修改并退出</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</div>


<div class="couponSelectContainer" id="couponSelect" style="display:none" v-show="show">
        <div class="couponSelectContainer_box" v-if="isclear">
            <div class="couponSelectContainer_title">
                <em>抵用劵设置</em>
                <div class="couponSelectContainer_close" v-on:click="show = 0">×</div>
            </div>

            <div class="couponSelectContainer_content">
                <div class="couponSelectContainer_content_list">
                    <template if="coupon_array.length" v-for="(item,key) in coupon_array">
                        <div class="couponSelectContainer_content_list_box" v-on:mouseenter.stop="ev_hoverCoupon($event,item,key)" v-on:mouseleave.stop="ev_hoveroutCoupon">
                            <div class="couponSelectContainer_content_list_block">
                                <div class="wcc_selectStation_listBlock" v-bind:isselect="Number(item.is_vue_selected)">
                                    <label class="wcc_label_checkbox">
                                        <input type="checkbox" v-bind:checked="Boolean(item.is_vue_selected)" v-on:change="ev_selectedCoupon($event,item,key)" />
                                        <div class="wcc_checkbox"><span>&#xe67d;</span></div>
                                    </label>
                                    <span class="wcc_selectStation_text" v-bind:title="item.coupon_name">@{{item.coupon_name.length > 16 ? item.coupon_name.slice(0,15) + '...' : item.coupon_name}}</span>
                                </div>
                                <template v-if="item.is_vue_selected">
                                    <div class="couponSelectContainer_content_list_countBox">
                                        <input class="wcc_input" type="number" v-model="transmit_array.obj[item.coupon_id].count" v-on:input="ev_changeCouponNumber($event,item.coupon_id)" v-on:keydown="ev_numberInputLimit($event)" />
                                        <span>张</span>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </template>
                </div>
                <div class="couponSelectContainer_content_detail" v-show="coupon_detail.length">
                    <div class="couponSelectContainer_content_detail_title">优惠券信息</div>
                    <template v-for="item in coupon_detail">
                        <div class="couponSelectContainer_content_detail_block">
                            <div class="couponSelectContainer_content_detail_block_left">@{{item.name}}:</div>
                            <div class="couponSelectContainer_content_detail_block_right" v-html="item.value"></div>
                        </div>
                    </template>
                </div>
            </div>
            <div class="couponSelectContainer_footer">
                <div class="wcc_btn_fat_green" v-on:click="confirm">确定</div>
            </div>
        </div>
    </div>

@endsection

@section('footer')
    <script src="/js/wcc-element-ui/vue.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/wcc-element-ui/index.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/discountRule/rule.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/axios.min.js"> </script>
    <script>

        var station_list = {!!json_encode($station_list)!!};//油站列表
        var levels = {!!json_encode($levels)!!};//等级
        var oils = {!!json_encode($oils)!!};//油耗
        var card_theme_list = {!!json_encode($card_theme_list)!!}; //卡主题列表
        var company_list = {!!json_encode($company_list)!!}; //车队卡列表
        var customer_group_list = {!!json_encode($customer_group_list)!!}; //卡组
        var pay_list = {!!json_encode($pay_list)!!}; //卡组

        var RuleDiscount;
 
        var _stid = {!!$stid!!} //单站判断， 0集团， >0单站
        console.log('单站判断',_stid);
        console.log("等级")
        console.log(levels)
        console.log("油耗")
        console.log(oils)
        console.log("卡主题列表")
        console.log(card_theme_list)
        console.log("车队卡列表")
        console.log(company_list)
        console.log("卡组")
        console.log(customer_group_list)
        console.log("支付方式列表")
        console.log(pay_list)


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


        var $Main = new Vue({
            el: '#priceMarketing',
            data() {
                return {
                    ruleType:"",
                    CalculationType:"",
                    GiveType:"0",
                    ISGive:false,
                    station_list:station_list,
                    identity_list:[],
                    levels:levels,
                    oils:oils,
                    card_theme_list:card_theme_list.dt,
                    company_list:company_list.dt,
                    customer_group_list:customer_group_list.dt,
                    showListData:false,
                    weekList:[
                        "一","二","三","四","五","六","日"
                    ],
                    checkAllOfStids: false,
                    isIndeterminateOfStids: false,

                    checkAllOfIdentity:false,
                    isIndeterminateOfIdentity: false,

                    checkAllOfCustomeTrType:false,
                    isIndeterminateOfCustomeTrType: false,

                    checkAllOfPayType: false,
                    isIndeterminateOfPayType: false,

                    checkAllOfCardTheme: false,
                    isIndeterminateOfCardTheme: false,

                    checkAllOfOils: false,
                    isIndeterminateOfOils: false,

                    payTypeList:pay_list,
                    
                    defaultActive:0,
                    showBaseInfo:true,//基本信息
                    showdetail:false,//优惠明细
                    showControl:false,//优惠限制
                    form: {
                     
               
                        selectLevels:[], //选择会员等级
                        selectCustomerGroup:[],//选择卡组
                        selectCompanyList:[],//选择车队卡
                        selectLevelsType:"0",
                        selectCustomerGroupType:"0",
                        selectCompanyListType:"0",
                        payType:[],//支付方式
                        showCardTheme:false,//是否显示卡主题
                        cardThemeList:[],//卡主题
                        customeTrType:[],//客户类型
                        oilsList:[],//优惠油品
                        userLimit:"0",
                        repetTime:0,//重复类型
                        time:"",//活动时间
                        region: '',
                        date: '',
                        typeValue: [],
                        type:0,
                        selectedTime:[],
                     
                        prefereType:[
                            {
                                name:"按原价",
                                value:5
                            },
                            {
                                name:"按实付",
                                value:0
                            },
                            {
                                name:"按升数",
                                value:1
                            }
                        ]
                    },
                    
                  
               
                    isCheckTime:false,//检查时间规则合格的变量
                    isChangeTime:true,//检查是否修改时间
                    oldTime:[],
                    oldRepetTime:null,
                    tipsText:`1、优先级定为1，2，3...10，数字越高，优先级越低2、优先级有两个作用，一方面，在同时间段内，存在相同类型的活动时，作为判断优先启用哪一个规则的判断依据。优先级较高的规则，优先判断，若优先级一样，则根据优惠规则的创建/修改时间来判断，创建时间越早的优先级越高。另一方面，当不同类型的优惠规则共享情况下，根据优先级的大小，决定优惠规则的计算顺序。若优先级一样，则根据优惠规则的创建/修改时间来判断，创建时间越早的优先级越高。`,

                   

                    submit:{
                        "rule_id":"",                         	  		//规则id，修改时需要传
                        "rule_type": 0,                      			//规则类型
                        "rule_discount_method": 0,           	 		//规则优惠类型
                        "rule_discount_type": 0,  			 			//规则优惠方式
                        "rule_discount_detailed_type": 0, 	 			//规则明细方式
                        "rule_name": "", 						//规则名称
                        "start_date": "", 			//开始时间
                        "end_date": "", 	 			//结束时间
                        "selection_stids": [], 			//选中的油站id集合，‘,’分隔
                        "selection_identity":[],        //专车身份
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
                        "rule_ending": 0, 								//规则计算结尾
                        "rule_repeat_time": [],						//规则重复时间
                        "rule_discount": []	//规则优惠明细，里面优惠

                    },
                }
            },
            mounted() {
                this.getDetail(getQueryVariable("id"))
            },
            watch:{
                //反选
                'submit.selection_stids'(){ //优惠油站
                    let checkedCount = this.submit.selection_stids.length;
                    this.checkAllOfStids = checkedCount === Object.keys(this.station_list).length;
                    this.isIndeterminateOfStids = checkedCount > 0 && checkedCount < Object.keys(this.station_list).length;
                },
                'submit.selection_identity'(){//专车身份
                    let checkedCount = this.submit.selection_identity.length;
                    this.checkAllOfIdentity = checkedCount === this.identity_list.length;
                    this.isIndeterminateOfIdentity = checkedCount > 0 && checkedCount < this.identity_list.length;
                },
                'form.payType'(){//支付方式
                    let checkedCount = this.form.payType.length;
                    this.checkAllOfPayType = checkedCount === this.payTypeList.length;
                    this.isIndeterminateOfPayType = checkedCount > 0 && checkedCount < this.payTypeList.length;
                },
                'form.cardThemeList'(){//卡名称
                    let checkedCount = this.form.cardThemeList.length;
                    this.checkAllOfCardTheme = checkedCount === this.card_theme_list.length;
                    this.isIndeterminateOfCardTheme = checkedCount > 0 && checkedCount < this.card_theme_list.length;
                },
                'form.oilsList'(){//优惠油品
                    let checkedCount = this.form.oilsList.length;
                    this.checkAllOfOils = checkedCount === this.oils.length;
                    this.isIndeterminateOfOils = checkedCount > 0 && checkedCount < this.oils.length;
                },
                'form.customeTrType'(){//卡类型（注：页面是写死的3条）
                    let checkedCount = this.form.customeTrType.length;
                    this.checkAllOfCustomeTrType = checkedCount === 3;
                    this.isIndeterminateOfCustomeTrType = checkedCount > 0 && checkedCount < 3;
                },
            },
       
            methods: {
                //优惠油站全选
                CheckAllChangeOfStids(val) {
                    
                    var stids = [];
                    for(var item in this.station_list){
                        stids.push(this.station_list[item].stid)
                    }
                    this.submit.selection_stids = val ? stids : [];
                    this.isIndeterminateOfStids = false;

                    //todo请求
                    this.getStationChannel();
                   
                },
                //专车身份全选
                CheckAllChangeOfIdentity(val){
                    var stids = [];
                    for(var item in this.identity_list){
                        stids.push(this.identity_list[item].channel_code)
                    }
                    this.submit.selection_identity = val ? stids : [];
                    this.isIndeterminateOfIdentity = false;
                },
                //专车身份全选
                CheckAllChangeOfCustomeTrType(val){
                    
                    this.form.customeTrType = val ? ["1", "2", "3"] : [];
                    this.isIndeterminateOfCustomeTrType = false;
                },
                
                //支付方式全选
                CheckAllChangeOfPayType(val) {
                    
                   
                    this.form.payType = val ? this.payTypeList : [];
                    this.isIndeterminateOfPayType = false;
                    this.form.showCardTheme = val;
                   
                },

                //卡名称全选
                CheckAllChangeOfCardTheme(val) {
                    var _selectList = [];
                    this.card_theme_list.forEach(function(item){
                        _selectList.push(item.ID)
                    })
                    this.form.cardThemeList = val ? _selectList : [];
                    this.isIndeterminateOfCardTheme = false;
                   
                },
                //优惠油品全选
                CheckAllChangeOfOils(val) {
                    
                    this.form.oilsList = val ? this.oils : [];
                    this.isIndeterminateOfOils = false;
                   
                },


                getStationChannel(){
                    
                    var that  = this;
                    if(this.form.time.length > 0  && this.submit.selection_stids.length>0){
                        $.ajax({
                            url: '/CardMarketing/getStationChannel',
                            type: 'POST',
                            dataType: 'json',
                            data: {
                                "stids":that.submit.selection_stids,
                                "start_time": that.form.time[0],
                                "end_time": that.form.time[1],
                                "is_identity": 1, 
                            
                            },
                            success: function(res) {
                                console.log(res)
                                
                                if (res.status == 200) {
                                    that.identity_list = res.data;
                                    if(!that.submit.selection_identity[0]){ //专车身份
                                        that.isIndeterminateOfIdentity=false
                                        that.checkAllOfIdentity=true
                                        console.log('identity_list',that.identity_list);
                                        that.identity_list.forEach((v,i)=>{
                                            that.submit.selection_identity[i]=v.channel_code
                                        })
                                    }
                                    // 反选
                                    let checkedCount = that.submit.selection_identity.length;
                                    that.checkAllOfIdentity = checkedCount === that.identity_list.length;
                                    that.isIndeterminateOfIdentity = checkedCount > 0 && checkedCount < that.identity_list.length;
                                }else{
                                    
                                    that.$message.error(res.info);
                                }
                            }
                        })
                    }
                },

                changeRepetTime(val){
                    var that = this;
                    console.log("changeRepetTime")
                    if( (val == that.oldRepetTime) && (JSON.stringify(this.oldTime) == JSON.stringify(this.form.selectedTime)) ){
                        that.isChangeTime = true;
                    }else{
                        that.isChangeTime = false;
                    }
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
                            console.log(res)
                            if (res.status == 200) {
                                //that.form = res.data;
                                
                                
                                //初始化
                                that.toAddRule(9);
                                //规则名称
                                that.submit.rule_name = res.data.RuleName;

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
                                
                                that.submit.selection_stids = selection_stids;
                                if(that.submit.selection_stids.length==0){//优惠油站
                                    that.isIndeterminateOfStids=false
                                    that.checkAllOfStids=true
                                    that.submit.selection_stids=[]
                                    for(let i in that.station_list){
                                        that.submit.selection_stids.push(station_list[i].stid)
                                    }
                                }

                                //专车身份
                                that.getStationChannel();
                                that.submit.selection_identity = res.data.RuleIdentity.split(",");


                                //支付方式
                                var payName = res.data.RulePayMethod.split(",");
                                var RulePayMethod_ids = [];
                                var isShow = false;
                                
                                payName.forEach(function(item){
                                    that.payTypeList.forEach(function(element){
                                        if(element.BH == item){
                                            RulePayMethod_ids.push(element)
                                        }
                                    })

                                    //判断是否有加油卡
                                    if(item=="3"){
                                        isShow = true;
                                    }
                                })
                                that.form.payType= RulePayMethod_ids;
                                that.form.showCardTheme = isShow;

                                


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
                               


                                //用户限制
                                
                                if(res.data.RuleCustomerType == "LA"){
                                    that.form.userLimit = "0"
                                }else if(res.data.RuleCustomerType == "G"){
                                    that.form.userLimit = "1"
                                }else if(res.data.RuleCustomerType == "C"){
                                    that.form.userLimit = "2"
                                }
                                
                                //限制详情
                                
                                if(res.data.RuleCustomerInfo == ""){
                                    
                                    if(res.data.RuleCustomerType == "LA"){
                                        that.form.selectLevelsType = "0"
                                    }else if(res.data.RuleCustomerType == "G"){
                                        that.form.selectCustomerGroupType = "0"
                                    }else if(res.data.RuleCustomerType == "C"){
                                        that.form.selectCompanyListType = "0"
                                    }

                                }else if(res.data.RuleCustomerInfo == "nonmember"){
                                    if(res.data.RuleCustomerType == "LA"){
                                        that.form.selectLevelsType = "1"
                                    }else if(res.data.RuleCustomerType == "G"){
                                        that.form.selectCustomerGroupType = "1"
                                    }else if(res.data.RuleCustomerType == "C"){
                                        that.form.selectCompanyListType = "1"
                                    }
                                }else{
                                    
                                    

                                    if(res.data.RuleCustomerType == "LA"){
                                        that.form.selectLevelsType = "2"
                                        var selectLevels = res.data.RuleCustomerInfo.split(",");
                                        var selectLevels_ids = [];
                                        selectLevels.forEach(function(item){
                                            levels.forEach(function(element){
                                                if(element.id == item){
                                                    selectLevels_ids.push(element.id)
                                                }
                                            })
                                        })
                                        that.form.selectLevels  = selectLevels_ids;
                                       
                                    }else if(res.data.RuleCustomerType == "G"){
                                        that.form.selectCustomerGroupType = "2"
                                        var selectLevels = res.data.RuleCustomerInfo.split(",");
                                        var selectLevels_ids = [];
                                        selectLevels.forEach(function(item){
                                            customer_group_list.dt.forEach(function(element){
                                               
                                                if(element.ID == item){
                                                    selectLevels_ids.push(element.ID)
                                                }
                                            })
                                        })
                                        
                                        that.form.selectCustomerGroup  = selectLevels_ids;
                                    }else if(res.data.RuleCustomerType == "C"){
                                        that.form.selectCompanyListType = "2"
                                        var selectLevels = res.data.RuleCustomerInfo.split(",");
                                        var selectLevels_ids = [];
                                        selectLevels.forEach(function(item){
                                            company_list.dt.forEach(function(element){
                                                
                                                if(element.ID == item){
                                                    selectLevels_ids.push(element.ID)
                                                }
                                            })
                                        })
                                        console.log(selectLevels_ids)
                                        that.form.selectCompanyList  = selectLevels_ids;
                                    }
                                    
                                }


                                //优惠油品
                                var OilInfo = res.data.RuleOilInfo.split(",");
                                var OilInfo_ids = [];
                        
                                OilInfo.forEach(function(item){
                                    oils.forEach(function(element){
                                        if(element.oil_id == item){
                                            OilInfo_ids.push(element)
                                        }
                                    })

                                })
                              
                                that.form.oilsList = OilInfo_ids;


                                //空判断，全选中
                                if(!that.form.payType[0]){//支付方式
                                    that.isIndeterminateOfPayType=false
                                    that.checkAllOfPayType=true
                                    that.payTypeList.forEach((v,i)=>{
                                        that.form.payType[i]=v
                                    })
                                    that.form.showCardTheme=true
                                }
                                if(!that.form.cardThemeList[0]){//卡名称
                                    that.isIndeterminateOfCardTheme=false
                                    that.checkAllOfCardTheme=true
                                    console.log('卡名称',that.card_theme_list);
                                    that.card_theme_list.forEach((v,i)=>{
                                        that.form.cardThemeList[i]=v.ID
                                    })
                                }
                                if(!that.form.oilsList[0]){ //优惠油品
                                    that.isIndeterminateOfOils=false
                                    that.checkAllOfOils=true
                                    console.log('油品',oils);
                                    oils.forEach((v,i)=>{
                                        that.form.oilsList[i]=v
                                    })
                                }

                                //重复类型
                                

                                var RuleRepeatTime = res.data.RuleRepeatTime;
                                var _selectedTime = [];
                                RuleRepeatTime.forEach(function(item){
                                    var _RepeatPeriod = [];
                                    if(item.RepeatPeriod instanceof Array){
                                        item.RepeatPeriod.forEach(function(element){
                                            _RepeatPeriod.push(Number(element))
                                        })
                                    }else{
                                        _RepeatPeriod = item.RepeatPeriod;
                                    }
                                    
                                    var a = {
                                        date:_RepeatPeriod,
                                        time:[item.timeRule_SJList[0].QSSJ,item.timeRule_SJList[0].JZSJ]
                                    }
                                   
                                    if(item.RepeaType =="D"){
                                        that.form.repetTime = 1
                                    }else if(item.RepeaType =="W"){
                                        that.form.repetTime = 2
                                    }else if(item.RepeaType =="M"){
                                        that.form.repetTime = 3
                                    }

                                    _selectedTime.push(a)
                                })
                                
                                that.form.selectedTime = _selectedTime;
                                that.oldRepetTime = that.form.repetTime;//存储一下，用于做数据比对
                                that.oldTime = $.extend(true,[],_selectedTime);//存储一下，用于做数据比对


                                //优惠明细

                                //that.submit.rule_discount = [];
                                RuleDiscount = $.extend(true,[],res.data.RuleDiscount);
                                
                                //是否与积分抵现共享
                                that.submit.is_oil_displacement = res.data.ISOilDisplacement.toString();
                                //是否与抵扣券共享
                                that.submit.is_coupon = res.data.ISCoupon.toString();
                                //是否与其他优惠共享
                                that.submit.is_discount_share = res.data.ISDiscountShare.toString();

                                that.submit.discount_share_type = res.data.DiscountShareType.split("|");
                           

                                that.submit.rule_priority = res.data.RulePriority;

                                that.submit.rule_id = res.data.ID;

                                that.submit.rule_state = res.data.RuleState.toString();

                                //卡规则
                                that.submit.rule_discount_type = res.data.RuleDiscountType;

                                console.log( that.submit)
                               
                            }else{
                                that.$message.error(res.info);
                            }
                        }
                    })
                },
                toAddRule(index){
                        this.ruleType = index;
                    /**
                        RuleTyep        是  int  规则类型；0=整单，1=明细
                        RuleDiscountMethod    是   int  规则优惠类型；0=油品， 1=非油品
                        RuleDiscountType     是   int   规则优惠方式； 0=折扣，1=优惠直减（明细中为单价直减；整单中为整单总额直减）， 2=赠送，3=一口价，4=充值直降（只有明细）
                        RuleDiscountDetailedType	是	int	规则明细方式；0=单品， 1=混搭
                     */

                    /*明细折扣 */ 
                    this.submit.rule_type = 1;
                    this.submit.rule_discount_method = 0;
                    this.submit.rule_discount_type = 2;
                    this.submit.rule_discount_detailed_type = 0;

                    this.CalculationType = "+";
                    this.GiveType = "0";
                    this.ISGive = true;
                },
                getWeekList(list){
                    var that = this;
                    var str="";
                    list.forEach(function(element){
                        str+= that.weekList[element-1]+","
                    })
                    return str
                },
                _setCalculationText(cal){
                   
                    var that = this;
                    var PayMethod = cal.PayMethod;
                    var oilAndGoods = cal.oilAndGoods;
                    var Type = cal.Type;
                    var _list = [];
                    that.form.oilsList.forEach(function(item){
                        if(oilAndGoods.includes(item.oil_id)){
                            _list.push(item.oil_name)
                        }
                    })

                    var _pay = [];
                    that.form.payType.forEach(function(item){
                        if(PayMethod.includes(item.BH)){
                            _pay.push(item.MC)
                        }
                    })

                    var _type = "";
                    that.form.prefereType.forEach(function(item){
                        if(Type == item.value){
                            _type = item.name;
                        }
                    })


                
                    
                    return _list.join("、")+" 用 "+ _pay.join("、") +" "+ _type;
                },
                baseNext() {
                    //转换时间
                    var that =  this;
                    that.submit.rule_discount = [];

                    //规则重复时间
                    var _t = "";
                    if(this.form.repetTime == "1"){
                        _t = "D"
                    }else if(this.form.repetTime == "2"){
                        _t = "W"
                    }else if(this.form.repetTime == "3"){
                        _t = "M"
                    }
                    
                    var _payType = [];
                    this.form.payType.forEach(function(item){
                        _payType.push(item.BH)
                    })

                    var _oilsList = [];
                    this.form.oilsList.forEach(function(item){
                        _oilsList.push(item.oil_id)
                    })
                    
                    var isSelectTime = false;
                    if(this.form.selectedTime){
                        this.form.selectedTime.forEach(function(element){

                            if(element.hasOwnProperty('date')){
                                if(typeof  element.date =="object" && element.date.length==0){
                                    isSelectTime = true;
                                }
                            }

                            that.submit.rule_discount.push({
                                "DetailedType": 1, //优惠明细类型， 1=单品，2=混搭
                                "repeatTime": {//重复时间
                                    "RepeaType":_t, //同上
                                    "RepeatPeriod": element.date || "",
                                    "timeRule_SJList": [
                                        {"QSSJ": element.time[0], "JZSJ": element.time[1]}
                                    ]
                                },
                                "calculationInterval":[
                                    {
                                        "Type": 5, //计算区间类型，5=原价，1=升数,0=实付
                                        "CalculationType": that.CalculationType, //计算类型; + =赠送,- =直减,* =折扣,= =一口价
                                        "PayMethod":_payType,//支付方式，用,号分割
                                        "calculation":[
                                            {
                                                "StartNum": "", //区间开始值
                                                "EndNum": "", //区间截止值
                                                "CalculationNum": "0", //计算数，如果是折扣需要除以100
                                                "ISGive": that.ISGive, //是否为赠送，false=不是赠送规则
                                                "GiveType": that.GiveType, 
                                                "couponObj":{
                                                    name:"请选择营销券",
                                                    giveCouponList:[],
                                                },
                                                "giveCouponList":[],
                                            }
                                        ],
                                        "oilAndGoods": _oilsList,
                                    }
                                ],
                            })
                            
                        })
                    }

                    //对编辑的数据进行赋值
                    console.log(that.submit.rule_discount)
                    //判断时间是否有修改   如果修改了  优惠规制重新初始化
                    console.log('edit9:1058',that.isChangeTime)
                    if(that.isChangeTime){
                        var _RuleDiscount = $.extend(true,[],RuleDiscount);
                        that.submit.rule_discount = $.extend(true,[],RuleDiscount);
                       
                        _RuleDiscount.map(function(element,index){
                        
                            element.calculationInterval.map(function(cal,index2){
                                cal.calculation.map(function(calcula,index3){

                                    
                                        that.submit.rule_discount[index].calculationInterval[index2].calculation[index3].giveCouponList = $.extend(true,[],calcula.giveCouponList);

                                        that.submit.rule_discount[index].calculationInterval[index2].calculation[index3].couponObj = {};


                                        var selectArray = [];
                                        var arr = {};
                                        console.log(calcula.giveCouponList)
                                       

                                        for(var i=0;i<calcula.giveCouponList.length;i++){
                                            var item = calcula.giveCouponList[i];
                                            selectArray.push(item.CouponID)
                                            arr[item.CouponID]={
                                                id: item.CouponID,
			                                    count: item.CouponNum,
                                            }
                                        }
                                            
                                       
                                        
                                        that.submit.rule_discount[index].calculationInterval[index2].calculation[index3].couponObj.giveCouponList = $.extend(true,[],calcula.giveCouponList);
                                        that.submit.rule_discount[index].calculationInterval[index2].calculation[index3].couponObj.name = '已选择' + selectArray.length + '种优惠券';
                                        that.submit.rule_discount[index].calculationInterval[index2].calculation[index3].couponObj.id = selectArray;
                                        that.submit.rule_discount[index].calculationInterval[index2].calculation[index3].couponObj.selectArrayObj = arr;
                                        
                                        console.log(arr)
                                        
                                    
                                    
                                })
                                that.submit.rule_discount[index].calculationInterval[index2].PayMethod = _payType;
                                that.submit.rule_discount[index].calculationInterval[index2].oilAndGoods = _oilsList;

                                //选择类型
                                that.submit.rule_discount[index].calculationInterval[index2].Type = Number(cal.Type);
                            })
                        })
                    }

                    if(isSelectTime){
                        this.$message.error('请选择每周重复时间或者每月重复时间！');
                         return;
                    }
              
                    if(this.submit.selection_stids.length==0){
                        this.$message.error('请选择优惠油站！');
                        return ;
                    }

                    if(this.identity_list.length>0 && this.submit.selection_identity.length==0){
                        this.$message.error('请选择专车身份！');
                        return ;
                    }
            
                    if(this.form.payType.length==0){
                        this.$message.error('请选择支付方式！');
                        return ;
                    }
                    if(this.form.showCardTheme){

                        if(this.form.cardThemeList.length==0){
                            this.$message.error('请选择卡名称！');
                            return ;
                        }
                        if(this.form.customeTrType.length==0){
                            this.$message.error('请选择卡类型！');
                            return ;
                        }
                    }
                    if(this.form.userLimit==0 && this.form.selectLevelsType ==2){
                        if(this.form.selectLevels.length==0){
                            this.$message.error('请选择会员等级！');
                            return ;
                        }
                    }
                    if(this.form.userLimit==1 && this.form.selectCustomerGroupType ==2){
                        if(this.form.selectCustomerGroup.length==0){
                            this.$message.error('请选择卡组！');
                            return ;
                        }
                    }
                    if(this.form.userLimit==2 && this.form.selectCompanyListType ==2){
                        if(this.form.selectCompanyList.length==0){
                            this.$message.error('请选择车队卡！');
                            return ;
                        }
                    }

                    if(this.form.oilsList.length==0){
                        this.$message.error('请选择优惠油品！');
                        return ;
                    }

                   

                    
                    this.defaultActive = 1;
                    this.showBaseInfo = false;
                    this.showdetail = true;
                   // return ;
                   
                   this.$forceUpdate(); 

                    
                },
                detailBefore(){
                    this.defaultActive = 0;
                    this.showBaseInfo = true;
                    this.showdetail = false;
                },
                detailNext(){
                     //进行验证
                     var that = this;
                    console.log(this.submit.rule_discount)
                    var isNext = true;
                    
                    this.submit.rule_discount.forEach(function(item){
                        var _dist = [];//存储现金和油品的组合数据
                        var _payMethodArr = [];
                        item.calculationInterval.forEach(function(cal){
                            _payMethodArr = _payMethodArr.concat(cal.PayMethod);
                            if(cal.PayMethod.length==0){
                                that.$message.error('请选择支付方式！');
                                isNext = false;
                                throw new Error("ending");//报错，就跳出循环
                            }
                            if(cal.oilAndGoods.length==0){
                                that.$message.error('请选择油品！');
                                isNext = false;
                                throw new Error("ending");//报错，就跳出循环
                            }
                            if(that.isConcat(cal.calculation)){
                                that.$message.error('价格有相同的区间值！');
                                isNext = false;
                                throw new Error("ending");//报错，就跳出循环
                            }
                            cal.calculation.forEach(function(calcu){
                               
                                if(calcu.StartNum.length==0 || Number(calcu.StartNum)<0){
                                    that.$message.error('请输入最小值！');
                                    isNext = false;
                                    throw new Error("ending");//报错，就跳出循环
                                }
                                
                                if(calcu.EndNum.length==0){
                                    that.$message.error('请输入最大值！');
                                    isNext = false;
                                    throw new Error("ending");//报错，就跳出循环
                                }
                                if(Number(calcu.EndNum)<=Number(calcu.StartNum)){
                                    that.$message.error('最大值必须大于最小值！');
                                    isNext = false;
                                    throw new Error("ending");//报错，就跳出循环
                                }


                                if(calcu.couponObj.giveCouponList.length == 0){
                                    that.$message.error('请选择优惠劵！');
                                    isNext = false;
                                    throw new Error("ending");//报错，就跳出循环
                               }
                                
                                
                               
                            })
                           

                            //判断有没有重复的类型 
                            _dist = _dist.concat(that._setPayAndOilList(cal.PayMethod,cal.oilAndGoods));

                            
                        })

                        if(that._isRepeat(_payMethodArr)){
                            console.log(_payMethodArr);
                            that.$message.error('有重复的支付方式，请重新勾选支付方式！');
                            isNext = false;
                            throw new Error("ending");//报错，就跳出循环
                        }
                        if(that._isRepeat(_dist)){
                            that.$message.error('有重复的设置');
                            isNext = false;
                            throw new Error("ending");//报错，就跳出循环
                        }
                    })

                    
                    
                    if(!isNext){
                        return;
                    }

                   
                    this.defaultActive = 2;
                    this.showdetail = false;
                    this.showControl = true;
                },

                _setPayAndOilList(pay,oil){
                    var _d = [];
                    for(var i=0;i<pay.length;i++){
                        for(var j=0;j<oil.length;j++){
                            _d.push(pay[i]+"-"+oil[j])
                        }
                    }
                    return _d;
                },
                //判断是否有重复项
                _isRepeat(arr){
                    let  hash = {};
                    for(let i in arr) {
                        if(hash[arr[i]]) {
                            return true;
                　　     }
                        hash[arr[i]] = true;
                    }
                    return false;
                },
                isConcat(arr){
                    let flag = false
                    for (let i = 0; i < arr.length; i++) {
                        for (let j = i + 1; j < arr.length; j++) {
                        if (arr[j].EndNum >= arr[i].EndNum && arr[i].StartNum >= arr[j].StartNum) {
                            flag = true
                        } else if (arr[i].EndNum >= arr[j].EndNum && arr[j].StartNum >= arr[i].StartNum) {
                            flag = true
                        } else if (arr[j].EndNum >= arr[i].StartNum && arr[j].EndNum <= arr[i].StartNum) {
                            flag = true
                        } else if (arr[j].StartNum < arr[i].EndNum && arr[j].EndNum >= arr[i].EndNum) {
                            flag = true
                        }
                        }
                    }
                    return flag;
                },
                controlBefore(){
                    this.defaultActive = 1;
                    this.showdetail = true;
                    this.showControl = false;
                },
                //检查时间合法性
                checkTime(val){
         
                    this.isCheckTime = val;
                    
                    if(this.form.selectedTime && (JSON.stringify(this.oldTime) == JSON.stringify(this.form.selectedTime))){
                       
                        this.isChangeTime = true;
                    }else{
                        this.isChangeTime = false;
                    }
                   
                },
                //选择支付方式
                changePayType(val){
                    console.log(val)
                    let isShow = false;
                    val.map(function(item){
                        //判断是否是“加油卡”
                        if(item.BH=="3"){
                            isShow = true;
                        }
                    })
                    this.form.showCardTheme = isShow;
                    
                },
                addBox(parent){
                    console.log(parent)
                    var list = {
                            "StartNum": "", //区间开始值
                            "EndNum": "", //区间截止值
                            "CalculationNum": "0", //计算数，如果是折扣需要除以100
                            "ISGive": this.ISGive, //是否为赠送，false=不是赠送规则
                            "GiveType": this.GiveType, 
                            "couponObj":{
                                name:"请选择营销券",
                                giveCouponList:[],
                            },
                            "giveCouponList":[],
                        };
                        parent.push(list)
                    this.$forceUpdate(); 
                },
                removeBox(index,parent){
                    parent.splice(index,1);
                    this.$forceUpdate(); 
                },
                removeCalculation(index,parent){
                    parent.splice(index,1)
                    this.$forceUpdate(); 
                },
                addCalculation(parent){
                    var that = this;
                    console.log(parent)
                    var _payType = [];
                    this.form.payType.forEach(function(item){
                        _payType.push(item.BH)
                    });

                    var _oilsList = [];
                    this.form.oilsList.forEach(function(item){
                        _oilsList.push(item.oil_id)
                    })

                    parent.calculationInterval.push(
                        {
                            "Type": 0, //计算区间类型，0=原价，1=升数
                            "CalculationType": that.CalculationType, //计算类型; + =赠送,- =直减,* =折扣,= =一口价
                            "PayMethod": _payType,//支付方式，用,号分割
                            "calculation":[
                                {
                                    "StartNum": "", //区间开始值
                                    "EndNum": "", //区间截止值
                                    "CalculationNum": "0", //计算数，如果是折扣需要除以100
                                    "ISGive": that.ISGive, //是否为赠送，false=不是赠送规则
                                    "GiveType": that.GiveType, 
                                    "couponObj":{
                                        name:"请选择营销券",
                                        giveCouponList:[],
                                    },
                                    "giveCouponList":[],
                                }
                            ],
                            "oilAndGoods": _oilsList,
                        }
                    )
                    that.$forceUpdate(); 
                },

                changeData(){
                    this.$forceUpdate(); 
                },

                submitData(){
                    var loading = this.$loading({ fullscreen: true })
                    var that = this;
                    var data = {};
                    //做数据验证
                    
                    
                    
                    //进行数值转换
                    //日期转换
                    data.start_date = this.form.time[0];
                    data.end_date = this.form.time[1];
                    //规则可用支付方式，‘,’分隔
                    var _payType = [];
                    this.form.payType.forEach(function(item){
                        _payType.push(item.BH)
                    })
                    data.rule_pay_method = _payType.join(",");

                    //选中的油站id集合，‘,’分隔
                    data.selection_stids = this.submit.selection_stids.join(",");

                    //选中的专车身份
                    data.rule_identity = this.submit.selection_identity.join(",");

                    //制卡规则id集合，‘,’分隔
                    data.rule_card_name = this.form.cardThemeList.join(",");

                    //规则可用卡类型，‘,’分隔
                    data.rule_card_type = this.form.customeTrType.join(",");

                    //规则可用卡类型，‘,’分隔
                    if(this.form.userLimit == "0"){
                        data.rule_customer_type = "LA";

                        if(this.form.selectLevelsType == 0){
                            data.rule_customer_info = "";
                        }else if(this.form.selectLevelsType == 1){
                            data.rule_customer_info = "nonmember";
                        }else if(this.form.selectLevelsType == 2){
                            data.rule_customer_info = this.form.selectLevels.join(",");
                        }

                        
                    }else if(this.form.userLimit == "1"){
                        data.rule_customer_type = "G";
                        
                        if(this.form.selectCustomerGroupType == 0){
                            data.rule_customer_info = "";
                        }else if(this.form.selectCustomerGroupType == 1){
                            data.rule_customer_info = "nonmember";
                        }else if(this.form.selectCustomerGroupType == 2){
                            data.rule_customer_info = this.form.selectCustomerGroup.join(",");
                        }
                    }else if(this.form.userLimit == "2"){
                        data.rule_customer_type = "C";
                        
                        if(this.form.selectCompanyListType == 0){
                            data.rule_customer_info = "";
                        }else if(this.form.selectCompanyListType == 1){
                            data.rule_customer_info = "nonmember";
                        }else if(this.form.selectCompanyListType == 2){
                            data.rule_customer_info = this.form.selectCompanyList.join(",");
                        }
                    }

                    //规则可用卡类型，‘,’分隔
                    

                    //油品id集合，‘,’分隔
                    var _oilsList = [];
                    this.form.oilsList.forEach(function(item){
                        _oilsList.push(item.oil_id)
                    })
                    data.oli_ids = _oilsList.join(",");
                   
                    //规则重复时间
                    var _t = "";
                    if(this.form.repetTime == "1"){
                        _t = "D"
                    }else if(this.form.repetTime == "2"){
                        _t = "W"
                    }else if(this.form.repetTime == "3"){
                        _t = "M"
                    }
                    data.rule_repeat_time = [];
                    this.form.selectedTime.forEach(function(element){

                        data.rule_repeat_time.push(
                            {
                                "RepeaType":_t, //同上
                                "RepeatPeriod": element.date || "",
                                "timeRule_SJList": [
                                    {"QSSJ": element.time[0], "JZSJ": element.time[1]}
                                ]
                            }
                        )
                    });


                    //共享优惠类型，‘,’分隔
                    data.discount_share_type = this.submit.discount_share_type.join("|");
                 
                    
                    data.rule_discount = $.extend(true,[],this.submit.rule_discount);

                    data.rule_discount.forEach(function(item){
                        item.calculationInterval.forEach(function(item2){
                            item2.PayMethod = item2.PayMethod.join(",");
                            
                            var _list = [];
                            that.form.oilsList.forEach(function(item3){
                                if(item2.oilAndGoods.includes(item3.oil_id)){
                                    _list.push(
                                        {
                                            "Type": "0", //类型;0=油品,1=非油品
                                            "SKU": item3.oil_id, //条码
                                            "GoodsName": item3.oil_name //商品名称 
                                        }
                                    )
                                }
                            })

                            item2.calculation.forEach(function(calcu){
                               
                               //判断返赠
                                calcu.giveCouponList=$.extend(true,[],calcu.couponObj.giveCouponList);
                               
                           })

                            item2.oilAndGoods = _list;


                        })
                    })

                    //全选逻辑优化
                    if(this.checkAllOfStids && _stid==0) data.selection_stids='' //优惠油站
                    if(this.checkAllOfIdentity) data.rule_identity='' //专车身份
                    if(this.checkAllOfPayType) data.rule_pay_method='' //支付方式
                    if(this.checkAllOfCardTheme) data.rule_card_name='' //卡名称
                    if(this.checkAllOfOils) data.oli_ids='' //优惠油品




                   
                       
                    $.ajax({
                        url: '/CardMarketing/create',
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            "type":that.ruleType,
                            "id":that.submit.rule_id,
                            "rule_type": that.submit.rule_type,
                            "rule_discount_method": that.submit.rule_discount_method,
                            "rule_discount_type": that.submit.rule_discount_type,
                            "rule_discount_detailed_type":that.submit.rule_discount_detailed_type,
                            "rule_name": that.submit.rule_name,
                            "start_date": data.start_date,
                            "end_date":data.end_date,
                            "selection_stids": data.selection_stids,
                            "rule_identity":data.rule_identity,
                            "rule_pay_method": data.rule_pay_method,
                            "rule_card_name": data.rule_card_name,
                            "rule_card_type": data.rule_card_type,
                            "rule_customer_type": data.rule_customer_type,
                            "rule_customer_info": data.rule_customer_info,
                            "oli_ids": data.oli_ids,	
                            "rule_priority":that.submit.rule_priority,
                            "is_oil_displacement": that.submit.is_oil_displacement,
                            "is_coupon":that.submit.is_coupon,
                            "is_discount_share": that.submit.is_discount_share,
                            "discount_share_type": data.discount_share_type,
                            "rule_formulate_leve": that.submit.rule_formulate_leve,
                            "rule_state": Number(that.submit.rule_state),
                            "rule_ending": that.submit.rule_ending,
                            "rule_repeat_time": data.rule_repeat_time,
                            "rule_discount": data.rule_discount,
                        },
                        success: function(res) {
                           
                            if (res.status == 200) {
                                window.location.href="/CardMarketing/marketingRules";
                            }else{
                                loading.close();
                                that.$message.error(res.info);
                            }
                        }
                    })

                },
                baseOut(){
                    window.location.href="/CardMarketing/marketingRules";
                },
                showCoupon(obj){
                    $couponSelect.show = 1;
                    $couponSelect.obj = obj;
                    $couponSelect.showObj();
                },

            }
        });
    </script>
@endsection
