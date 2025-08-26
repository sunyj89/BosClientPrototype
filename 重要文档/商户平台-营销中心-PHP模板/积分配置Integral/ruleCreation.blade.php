@extends('layout/master')

@section('header')
    <link rel="stylesheet" type="text/css" href="/css/wcc.css?v={{config('constants.wcc_file_version')}}">
    <link rel="stylesheet" type="text/css" href="/css/Integral/ruleCreation.css?v={{config('constants.wcc_file_version')}}">
    <link rel="stylesheet" type="text/css" href="/css/Integral/integralcommon.css?v={{config('constants.wcc_file_version')}}">
    <link rel="stylesheet" type="text/css" href="/css/wcc-element-ui/index.css?v={{config('constants.wcc_file_version')}}">
    <link rel="stylesheet" type="text/css" href="/css/wcc-element-ui/wcc.css?v={{config('constants.wcc_file_version')}}">
@endsection

@section('content')
    <div class="content-wrap" id="integral-app" v-cloak>
        <nav class="flex-start">
            <div class="nav-title flex-end" :class="{actived: step==1}">
                <span class="number flex-center">1</span>
                <span class="text">基本规则</span>
                <span class="arrow"></span>
            </div>
            <template v-if="postdata.purpose == 3">
            <div class="nav-title flex-end" :class="{actived: step==2}">
                <span class="number flex-center">2</span>
                <span class="text">时间规则</span>
                <span class="arrow"></span>
            </div>
            <div class="nav-title flex-end" :class="{actived: step==3}">
                <span class="number flex-center">3</span>
                <span class="text">计算公式</span>
                <span class="arrow-none"></span>
            </div>
            </template>
            <template v-else>
            <div class="nav-title flex-end" :class="{actived: step==2}">
                <span class="number flex-center">2</span>
                <span class="text">使用条件</span>
                <span class="arrow"></span>
            </div>
            <div class="nav-title flex-end" :class="{actived: step==3}">
                <span class="number flex-center">3</span>
                <span class="text">时间规则</span>
                <span class="arrow"></span>
            </div>
            <div class="nav-title flex-end" :class="{actived: step==4}">
                <span class="number flex-center">4</span>
                <span class="text">计算公式</span>
                <span class="arrow-none"></span>
            </div>
            </template>
        </nav>
        <section v-show="step == 1">
            <el-form style="padding-left: 5px" ref="form" :model="postdata" label-width="80px">
                <div class="flex-start">
                    <span class="important-element" style="transform: translateX(50px)">*</span>
                    <el-form-item :label-postion="'right'" label-width="120px" label="规则名称"
                                  style="margin-bottom: 15px;">
                        <el-input @blur="postdata.ruleName ? ruleNameflag = 0 : ruleNameflag = 1"
                                  :class="{wcc_input_error_element: ruleNameflag}" v-model="postdata.ruleName"
                                  placeholder="请输入内容" style="width: 250px"></el-input>
                    </el-form-item>
                    <div class="wcc_error" style="transform: translateY(-5px)" v-show="ruleNameflag"><span
                                class="iconfont"><i></i></span> <span>请输入活动名称</span></div>
                </div>
                <div class="flex-start">
                    <span class="important-element" style="transform: translateX(50px)">*</span>
                    <el-form-item :label-postion="'right'" label-width="120px" label="起止时间"
                                  style="margin-bottom: 15px;">
                        <el-date-picker
                                :class="{wcc_input_error_element_top: timeScopeFlag}"
                                @change="postdata.timescope ? timeScopeFlag = 0 : timeScopeFlag = 1"
                                v-model="postdata.timescope"
                                type="datetimerange"
                                unlink-panels
                                value-format="yyyy-MM-dd HH:mm:ss"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                        <div class="wcc_error" v-show="timeScopeFlag"><span class="iconfont"><i></i></span>
                            <span>请选择起止时间</span></div>
                    </el-form-item>
                </div>
                <div class="form_list flex-start">
                    <div class="list-title flex-end">
                        <span class="important"></span>
                        <label class="form_list_title">规则说明</label>
                    </div>
                    <textarea type="text" name="" value="" v-model="postdata.ruleExplain" placeholder="请输入规则说明"
                              class="wcc_textarea active_name"
                              :class="{wcc_input_error: ruleExplainflag}"></textarea>
                    <div class="wcc_error" v-show="ruleExplainflag"><span class="iconfont"><i></i></span>
                        <span>请输入规则说明</span></div>
                </div>
                <div class="flex-start">
                    <span class="important-element" style="transform: translateX(65px)">*</span>
                    <el-form-item :label-postion="'right'" label-width="120px" label="优先级" style="margin-bottom: 15px;">
                        <el-select v-model="postdata.propity"
                                   @change="postdata.propity ? choosepropityflag = 0 : choosepropityflag = 1"
                                   :class="{wcc_input_error_element: choosepropityflag}" placeholder="请选择"
                                   style="width:250px">
                            <el-option v-for="(item, index) in 10" :key="index" :label="item" :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <div class="ask wcc_hover" style="transform: translateY(-5px);">?
                        <div class="wcc_tips wcc_tips_right" style="width: 410px; right: -450px; top: -12px;">
                            <div class="font14_333">
                            </div>
                            <div class="font14_999">
                                优先级：决定规则执行的顺序。选项为1-10，数值越小优先级越高；同等优先级的情况下，按照ID越小越优先执行。
                                <br>
                                建议： 设置规则时从10优先级设置，方便以后增加新的高优先级规则。
                            </div>
                        </div>
                    </div>
                    <div class="wcc_error" style="transform: translateY(-5px)" v-show="choosepropityflag"><span
                                class="iconfont"><i></i></span>
                        <span>请选择优先级</span>
                    </div>
                </div>
                <div class="flex-start">
                    <el-form-item :label-postion="'right'" label-width="120px" label="绑定油站"
                                  style="margin-bottom: 15px; margin-left: 10px">
                        <el-select v-model="postdata.stationbind"
                                   multiple
                                   collapse-tags
                                   placeholder="请选择" style="width:250px">
                            <el-option v-for="(item, index) in station_list" :key="item.stanme" :label="item.stname"
                                       :value="item.stid"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                {{--<el-form-item :label-postion="'right'" label-width="120px" label="允许优惠叠加"--}}
                              {{--style="margin-bottom: 0; margin-left: 10px">--}}
                    {{--<el-radio-group v-model="postdata.approve">--}}
                        {{--<el-radio :label="1" :value="1">允许</el-radio>--}}
                        {{--<el-radio :label="0" :value="0">不允许</el-radio>--}}
                    {{--</el-radio-group>--}}
                {{--</el-form-item>--}}
                <el-form-item :label-postion="'right'" label-width="120px" label="来源"
                              style="margin-bottom: 15px; margin-left: 10px">
                    <el-radio-group v-model="postdata.purpose" @change="initObj">
                        <el-radio v-for="(item, index) in purposeArray" :value="item.value" :key="index"
                                  :label="item.value">@{{item.label}}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </section>
        <section v-show="step == 2 && postdata.purpose !== 4 && postdata.purpose !== 3">
            <template v-if="postdata.purpose != 3">
                <div class="section-title">卡使用范围<span style="color:#999">（以下选项不选表示“不限”）</span></div>
                <el-form style="padding-left: 45px" ref="form" :model="postdata" label-width="80px">
                    <el-form-item label="卡属性" style="margin-bottom: 0;" v-if="!is_new_card">
                        <el-checkbox-group v-model="postdata.cardattr">
                            <el-checkbox
                                    style="min-width: 95px"
                                    v-for="(item, index) in cardattrArray"
                                    :label="item.ProID" :value="item.ProID" :key="index"
                            >@{{item.ProName}}
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="卡主题" style="margin-bottom: 0; width: 70%">
                        <el-checkbox :indeterminate="isIndeterminateOfCard" v-model="checkAllOfCard" @change="CheckAllChangeOfCard">全选</el-checkbox>
                        <el-checkbox-group @change="handleCheckedCardChange" v-model="postdata.cardthem">
                            <el-checkbox
                                    style="min-width: 95px"
                                    v-for="(item, index) in cardthemArray"
                                    :label="item.ID" :value="item.ID" :key="index"
                            >@{{item.MC}}
                            </el-checkbox>
                        </el-checkbox-group>
                        
                    </el-form-item>
                </el-form>
            </template>
            <template>
                <div class="section-title mt30">客户使用范围<span style="color:#999">（以下选项不选表示“不限”）</span></div>
                <el-form style="padding-left: 45px" ref="form" :model="postdata" label-width="80px">
                    <el-form-item label="客户来源" prop="remark" style="margin-bottom: 0" v-if="!is_new_card">
                        <el-checkbox-group v-model="postdata.customerOrigin">
                            <el-checkbox
                                    style="min-width: 95px"
                                    v-for="(item, index) in customerOriginArray"
                                    :label="item.SourceID" :value="item.SourceID" :key="index"
                            >@{{item.SourceName}}
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="客户类型" style="margin-bottom: 0">
                        <el-checkbox-group v-model="postdata.custormType">
                            <el-checkbox
                                    style="min-width: 95px"
                                    v-for="(item, index) in customerTypeArray"
                                    :label="item.TypeID" :value="item.TypeID" :key="index"
                            >@{{item.TypeName}}
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="客户身份" style="margin-bottom: 0">
                    <el-checkbox :indeterminate="isIndeterminateOfRuleIdentity" v-model="checkAllOfRuleIdentity" @change="CheckAllChangeOfRuleIdentity">全选</el-checkbox>
                        <el-checkbox-group v-model="postdata.ruleIdentity">
                            <el-checkbox
                                    style="min-width: 95px"
                                    v-for="(item, index) in customerIdentityList"
                                    :label="item.value" :value="item.value" :key="index"
                            >@{{item.label}}
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-form>
            </template>
            <template v-if="postdata.purpose != 3">
                <el-form style="padding-left: 45px" ref="form" :model="postdata" label-width="80px">
                    <el-form-item label="客户分类" style="margin-bottom: 15px">
                        <el-radio-group v-model="postdata.customerClass.class" @change="toggleCustomClass">
                            <el-radio-button :label="item.value" v-for="(item, index) in customerClassArray"
                                             :key="index">@{{item.label}}
                            </el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="">
                        <el-select
                                v-if="postdata.customerClass.class === 1"
                                multiple
                                collapse-tags
                                v-model="postdata.customerClass.value"
                                ref="elselect1"
                                placeholder="请选择"
                                style="width:250px">
                            <el-option v-for="(item, index) in customerClassSelectArray"
                                       :label="item.MC" :value="item.BH" :key="item.MC">
                            </el-option>
                        </el-select>
                        <el-select
                                {{--v-show="postdata.customerClass.class !== 1"--}}
                                v-else
                                v-model="postdata.customerClass.value" placeholder="请选择" style="width:250px">
                            <el-option v-for="(item, index) in customerClassSelectArray"
                                       :label="item.MC" :value="item.BH" :key="item.MC">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </template>
            <template v-if="postdata.purpose != 3">
                <div class="section-title">高级设置<span style="color:#999">（以下选项不选表示“不限”）</span></div>
                <template>
                    <el-form style="padding-left: 45px; width:70%;" ref="form" :model="postdata" label-width="100px">
                        <el-form-item label="油品" v-if="postdata.purpose != 2" style="margin-bottom: 0">
                            <el-checkbox :indeterminate="isIndeterminateOfOil" v-model="checkAllOfOil" @change="CheckAllChangeOfOil">全选</el-checkbox>
                            <el-checkbox-group v-model="postdata.oil">
                                <el-checkbox
                                        style="min-width: 95px"
                                        v-for="(item, index) in oilArray"
                                        :label="item.WCID" :value="item.WCID" :key="index"
                                >@{{item.MC}}
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="数据来源" style="margin-bottom: 0">
                            <el-checkbox :indeterminate="isIndeterminateOfDataOrigin" v-model="checkAllOfDataOrigin" @change="CheckAllChangeOfDataOrigin">全选</el-checkbox>
                            <el-checkbox-group v-model="postdata.dataOrigin">
                                <el-checkbox
                                        style="min-width: 95px"
                                        v-for="(item, index) in dataOriginArray"
                                        v-show="!(postdata.purpose == 2 && item.BH == 0)"
                                        :label="item.BH" :value="item.BH" :key="index"
                                >@{{item.MC}}
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="付款方式" style="margin-bottom: 10px">
                            <el-checkbox :indeterminate="isIndeterminateOfPayType" v-model="checkAllOfPayType" @change="CheckAllChangeOfPayType">全选</el-checkbox>
                            <el-checkbox-group v-model="postdata.payType">
                                <el-checkbox
                                        v-if="postdata.purpose === 1"
                                        style="min-width: 95px"
                                        v-for="(item, index) in payTypeArrayShopping"
                                        :label="item.BH" :value="item.BH" :key="index"
                                >@{{item.MC}}
                                </el-checkbox>
                                <el-checkbox
                                        v-if="postdata.purpose === 2"
                                        style="min-width: 95px"
                                        v-for="(item, index) in payTypeArrayRechange"
                                        :label="item.BH" :value="item.BH" :key="index"
                                >@{{item.MC}}
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <template v-if="postdata.purpose == 1">
                            <el-form-item label="消费限制" style="margin-bottom: 10px;">
                                <el-select v-model="postdata.shoppingLimit.type" placeholder="请选择金额/油量"
                                           style="width:250px">
                                    <el-option v-for="(item, index) in shoppingLimitArray" :key="index"
                                               :label="item.label"
                                               :value="item.value">
                                    </el-option>
                                </el-select>
                                <span>&nbsp;&nbsp;大于&nbsp;&nbsp;</span>
                                <span style="position: relative; width: 130px">
                            <el-input-number :precision="2" placeholder="数字" :controls="false"
                                             v-model="postdata.shoppingLimit.gt" style="width: 120px"
                                             controls-position="right" @change="" :min="0">
                            </el-input-number>
                            <span class="unit" v-if="postdata.shoppingLimit.type == 1">元</span>
                            <span class="unit" v-else>升</span>
                        </span>
                                <span>&nbsp;&nbsp;小于等于&nbsp;&nbsp;</span>
                                <span style="position: relative; width: 130px">
                            <el-input-number :precision="2" placeholder="数字" :controls="false"
                                             v-model="postdata.shoppingLimit.lt" style="width: 120px"
                                             controls-position="right" @change="" :min="1">
                            </el-input-number>
                            <span class="unit" v-if="postdata.shoppingLimit.type == 1">元</span>
                            <span class="unit" v-else>升</span>
                        </span>
                                <span>&nbsp;&nbsp;时该规则有效</span>
                            </el-form-item>
                        </template>
                        <template v-if="postdata.purpose == 2">
                            <el-form-item label="充值限制" style="margin-bottom: 10px;">
                                <el-select v-model="postdata.rechangeLimit.type" placeholder="请选择" style="width:250px">
                                    <el-option v-for="(item, index) in rechangeLimitArray" :key="item.label"
                                               :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                                <span>&nbsp;&nbsp;大于&nbsp;&nbsp;</span>
                                <span style="position: relative; width: 130px">
                            <el-input-number :precision="2" placeholder="数字" :controls="false"
                                             v-model="postdata.rechangeLimit.gt" style="width: 120px"
                                             controls-position="right" @change="" :min="0">
                            </el-input-number>
                            <span class="unit">元</span>
                        </span>
                                <span>&nbsp;&nbsp;小于等于&nbsp;&nbsp;</span>
                                <span style="position: relative; width: 130px">
                            <el-input-number :precision="2" placeholder="数字" :controls="false"
                                             v-model="postdata.rechangeLimit.lt" style="width: 120px"
                                             controls-position="right" @change="" :min="1">
                            </el-input-number>
                           <span class="unit">元</span>
                        </span>
                                <span>&nbsp;&nbsp;时该规则有效</span>
                            </el-form-item>
                        </template>
                        <el-form-item label="专享限制" style="margin-bottom: 10px">
                            <el-radio-group v-model="postdata.exclusive_restriction" @change="resetTime">
                                <el-radio :label="0" style="min-width: 95px">无</el-radio>
                                <el-radio :label="1" style="min-width: 95px">生日专享</el-radio>
                                <div class="ask wcc_hover" style="transform: translateX(-45px);">?
                                    <div class="wcc_tips wcc_tips_right"
                                         style="width: 310px; right: -350px; top: -12px; background: #fff">
                                        <div class="font14_333">
                                        </div>
                                        <div class="font14_999">
                                            生日信息来源于BOS客户端中的客户生日设置。<br>
                                            若勾选，则用户生日当天享受本条规则。
                                        </div>
                                    </div>
                                </div>
                                {{--<el-radio :label="2" style="min-width: 95px">节假日专享</el-radio>--}}
                                {{--<div class="ask wcc_hover" style="transform: translateX(-32px);">?--}}
                                    {{--<div class="wcc_tips wcc_tips_right"--}}
                                         {{--style="width: 260px; right: -300px; top: -12px;">--}}
                                        {{--<div class="font14_333">--}}
                                        {{--</div>--}}
                                        {{--<div class="font14_999">--}}
                                            {{--若勾选，选中的节假日享受本条规则--}}
                                        {{--</div>--}}
                                    {{--</div>--}}
                                {{--</div>--}}
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item v-if="postdata.exclusive_restriction == 2" label=""
                                      style="margin-bottom: 10px; width: 55%">
                            <el-checkbox-group v-model="postdata.exclusive_holidaylimit">
                                <el-checkbox style="min-width: 95px" v-for="(item, index) in holidaylimitArray"
                                             :label="item.value" :key="index">@{{ item.label }}
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="是否超级会员" style="margin-bottom: 10px">
                            <el-radio-group v-model="postdata.vip_type" @change="resetTime">
                                <el-radio :label="0" style="min-width: 95px">无限制</el-radio>
                                <el-radio :label="1" style="min-width: 95px">是</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-form>
                </template>
            </template>
        </section>
        <section v-show="(postdata.purpose != 3 && step == 3)||(postdata.purpose == 3 && step == 2)">
            <el-form style="padding-left: 45px" ref="form" :model="postdata" label-width="80px">
                <el-form-item label="时间类型" style="margin-bottom: 0;">
                    <el-radio-group v-model="postdata.repeatType">
                        <el-radio :label="0" style="min-width: 80px">无</el-radio>
                        <el-radio :label="1" style="min-width: 80px">每日</el-radio>
                        <el-radio :label="2" style="min-width: 80px">每周</el-radio>
                        <el-radio :label="3" style="min-width: 80px">每月</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <el-repeat-time-picker
                @change="change"
                xstyle="width: 280px;"
                style="margin-left: 128px;"
                value-format="HH:mm:ss"
                :max-length="5"
                v-model="postdata.selectedTime"
                :type="postdata.repeatType">
            </el-repeat-time-picker>
        </section>
        <section v-show="(postdata.purpose != 3 && step == 4)||(postdata.purpose == 3 && step == 3)">
            <el-form style="padding-left: 45px" ref="form" :model="postdata" label-width="80px">
                <template v-if="postdata.purpose == 1">
                    <div class="flex-start">
                        <span class="important-element" style="transform: translateX(10px)">*</span>
                        <el-form-item label="积分类型" style="margin-bottom: 10px;">
                            <el-radio v-model="postdata.integraltype" :label="1">规则积分</el-radio>
                            <el-select :class="{wcc_input_error_element: rule_integral_flag && !postdata.rule_integral.type}"
                                    v-model="postdata.rule_integral.type" placeholder="金额/油量"
                                    style="width:120px">
                                <el-option v-for="(item, index) in shoppingLimitArray" :key="item.label"
                                           :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                            <span>&nbsp;&nbsp;每消费&nbsp;&nbsp;</span>
                            <span style="position: relative; width: 120px">
                            {{--<el-input-number :class="{wcc_input_error_element: rule_integral_flag && !postdata.rule_integral.lt}"--}}
                                             {{--disable--}}
                                             {{--:precision="4" placeholder="数字" :controls="false"--}}
                                             {{--v-model="postdata.rule_integral.lt" style="width: 130px"--}}
                                             {{--controls-position="right" @change="" :min="0">--}}
                            {{--</el-input-number>--}}
                            <span>1</span>
                            <span class="units" v-if="postdata.rule_integral.type == 1">元</span>
                            <span class="units" v-else>升</span>
                        </span>
                            <span>&nbsp;&nbsp;积&nbsp;&nbsp;</span>
                            <span style="position: relative; width: 120px">
                            <el-input-number :class="{wcc_input_error_element: rule_integral_flag}"
                                             :precision="4" placeholder="数字" :controls="false"
                                             v-model="postdata.rule_integral.gt" style="width: 130px"
                                             controls-position="right" @change="" :min="0">
                            </el-input-number>
                        </span>
                            <span>分。采用&nbsp;&nbsp;</span>
                            <span>
                            <el-select
                                    :class="{wcc_input_error_element: rule_integral_flag && !postdata.rule_integral.intType}"
                                    v-model="postdata.rule_integral.intType" placeholder="请选择" style="width:120px">
                                <el-option :label="'四舍五入'" :value="2" :key="2">四舍五入</el-option>
                                <el-option :label="'进位'" :value="3" :key="3">进位</el-option>
                                <el-option :label="'截尾'" :value="1" :key="1">截尾</el-option>
                            </el-select>
                        </span>
                            <span>&nbsp;&nbsp;取整</span>
                        </el-form-item>
                        <div class="wcc_error" style="transform: translateY(-5px)" v-show="rule_integral_flag"><span
                                    class="iconfont"><i></i></span> <span>请设置积分</span></div>
                    </div>
                </template>
                <template v-else-if="postdata.purpose == 2">
                    <div class="flex-start">
                        <span class="important-element" style="transform: translateX(10px)">*</span>
                        <el-form-item label="积分类型" style="margin-bottom: 10px;">
                            <el-radio v-model="postdata.integraltype" :label="1" style="margin-right: 20px">规则积分
                            </el-radio>
                            <span>&nbsp;&nbsp;充值每&nbsp;&nbsp;</span>
                            <span style="position: relative; width: 120px">
                            {{--<el-input-number :precision="2"--}}
                                             {{--disabled--}}
                                             {{--:class="{wcc_input_error_element: rule_integral_flag && !postdata.rule_integral.lt}"--}}
                                             {{--:precision="2" placeholder="数字" :controls="false"--}}
                                             {{--v-model="postdata.rule_integral.lt" style="width: 130px"--}}
                                             {{--controls-position="right" @change="" :min="0">--}}
                            {{--</el-input-number>--}}
                            <span class="units">1元</span>
                        </span>
                            <span>&nbsp;&nbsp;积&nbsp;&nbsp;</span>
                            <span style="position: relative; width: 120px">
                            <el-input-number :class="{wcc_input_error_element: rule_integral_flag && !postdata.rule_integral.gt}"
                                             :precision="4" placeholder="数字" :controls="false"
                                             v-model="postdata.rule_integral.gt" style="width: 130px"
                                             controls-position="right" @change="" :min="0">
                            </el-input-number>
                        </span>
                            <span>分。采用&nbsp;&nbsp;</span>
                            <span>
                            <el-select
                                    :class="{wcc_input_error_element: rule_integral_flag && !postdata.rule_integral.intType}"
                                    v-model="postdata.rule_integral.intType" placeholder="请选择" style="width:120px">
                                <el-option :label="'四舍五入'" :value="2" :key="2">四舍五入</el-option>
                                <el-option :label="'进位'" :value="3" :key="3">进位</el-option>
                                <el-option :label="'截尾'" :value="1" :key="1">截尾</el-option>
                            </el-select>
                        </span>
                            <span>&nbsp;&nbsp;取整</span>
                        </el-form-item>
                        <div class="wcc_error" style="transform: translateY(-5px)" v-show="rule_integral_flag"><span
                                    class="iconfont"><i></i></span> <span>请设置积分</span></div>
                    </div>
                </template>
                <div class="flex-start">
                    <span class="important-element" :class="{hideWarning:(postdata.purpose ==1 || postdata.purpose ==2)}">*</span>
                    <el-form-item :label="(postdata.purpose ==3 || postdata.purpose ==4) ? '积分类型' : ''" style="margin:0 0 10px 0;">
                        <el-radio v-model="postdata.integraltype" :label="2" style="margin-right: 20px">随机积分</el-radio>
                        <span>&nbsp;&nbsp;积分范围&nbsp;&nbsp;</span>
                        <span style="position: relative; width: 120px">
                        <el-input-number
                                :class="{wcc_input_error_element: random_integral_flag && !postdata.random_integral.lt}"
                                 placeholder="数字" :controls="false"
                                 step="1"
                                 step-strictly
                                v-model="postdata.random_integral.lt" style="width: 120px"
                                controls-position="right" @change="" :min="0">
                        </el-input-number>
                        </span>
                        <span>&nbsp;&nbsp;分至&nbsp;&nbsp;</span>
                        <span style="position: relative; width: 120px">
                        <el-input-number
                                :class="{wcc_input_error_element: random_integral_flag && !postdata.random_integral.gt}"
                                 placeholder="数字" :controls="false"
                                 step="1"
                                 step-strictly
                                v-model="postdata.random_integral.gt" style="width: 120px"
                                controls-position="right" :min="0">
                        </el-input-number>
                    </span>
                        <span>&nbsp;&nbsp;分</span>
                    </el-form-item>
                    <div class="wcc_error" style="transform: translateY(-5px)" v-show="random_integral_flag"><span
                                class="iconfont"><i></i></span> <span>请设置积分</span></div>
                </div>
                <!-- 充值和消费增项的固定积分选项 -->
                <div class="flex-start">
                    <el-form-item label="" style="margin-left: 10px;">
                        <el-radio v-model="postdata.integraltype" :label="3" style="margin-right: 20px">固定积分</el-radio>
                        <span>&nbsp;&nbsp;积&nbsp;&nbsp;</span>
                        <span style="position: relative; width: 120px">
                            <el-input-number
                                :class="{wcc_input_error_element: fixed_integral_flag && !postdata.fixed_integral}"
                                :precision="0" placeholder="数字" :controls="false"
                                v-model="postdata.fixed_integral" style="width: 130px"
                                controls-position="right" :min="0">
                            </el-input-number>
                        </span>
                        <span>分</span>
                    </el-form-item>
                    <div class="wcc_error" style="transform: translateY(-5px)" v-show="fixed_integral_flag">
                        <span class="iconfont"><i></i></span>
                        <span>请设置积分</span>
                    </div>
                </div>
            </el-form>
        </section>
        <div class="bottom-button flex-start">
            <el-button plain @click="prevStep" v-show="step !== 1">上一步</el-button>
            <template v-if="postdata.purpose == 3">
            <el-button type="primary" @click="nextStep" v-show="step !== 3">下一步</el-button>
            <el-button type="primary" @click="create" v-show="step == 3">
                <template v-if="!isEdit">创建</template>
                <template v-else>修改</template>
            </el-button>
            </template>
            <template v-else>
            <el-button type="primary" @click="nextStep" v-show="step !== 4">下一步</el-button>
            <el-button type="primary" @click="create" v-show="step == 4">
                <template v-if="!isEdit">创建</template>
                <template v-else>修改</template>
            </el-button>
            </template>
        </div>
    </div>
@endsection

@section('footer')
    <script type="text/javascript" src="/js/vendor/jquery/jquery.js?v={{config('constants.wcc_file_version')}}"></script>
    <script type="text/javascript" src="/js/wcc-element-ui/vue.js?v={{config('constants.wcc_file_version')}}"></script>
    <script type="text/javascript" src="/js/wcc-element-ui/index.js?v={{config('constants.wcc_file_version')}}"></script>
    <script type="text/javascript">
      $(function () {
        new Vue({
          el: '#integral-app',
          data() {
            return {
              checkAllCard: false,
              isIndeterminate: false,
              loading: true,
              vaild3flag: true,
              disable: false,
              id: '',
              isEdit: false,
              postdata: {
                ruleName: '',  // 规则名称
                timescope: null, // 起止时间
                ruleExplain: '', //规则说明
                propity: null, // 优先级 1-10
                stationbind: null, // 绑定油站 id
                // approve: 0, // 允许优惠叠加 0:不允许 1：允许
                purpose: 1, // 用途 1：消费  2：充值  3：开户  4：关注公众号
                cardattr: [], // 卡属性
                cardthem: [], // 卡主题
                customerOrigin: [], // 客户来源
                custormType: [], // 客户类型
                ruleIdentity: [], // 客户身份
                customerClass: { // 客户分类
                  class: '', // 1: 等级 2：客户组 3：企业客户
                  value: '' // 选项值
                },
                oil: [], // 油品
                dataOrigin: [], // 数据来源
                payType: [], // 付款方式
                rechangeLimit: { // 充值限制
                  type: null, // 1: 本次充值金额 2：首次充值金额 3：历史充值金额
                  gt: null, // 大于等于
                  lt: 9999 // 小于
                },
                shoppingLimit: { // 消费限制
                  type: null, // 1: 金额 2：油量
                  gt: null, // 大于等于
                  lt: 9999 // 小于
                },
                exclusive_restriction: 1, // 专享限制  0:无  1：生日专享  2：节假日专享
                exclusive_holidaylimit: [], // 专享限制为2时节假日专享
                vip_type: 0, // 默认无限制
                repeatType: 0, // 时间类型 0：无  1：每日  2：每周  3：每月
                selectedTime: null, // 时间选择
                integraltype: 1, // 积分类型 1：规则积分 2：随机积分 3:固定积分
                rule_integral: {},
                random_integral: {},
                fixed_integral:""
              },
              step: 1,
              ruleNameflag: 0,
              timeScopeFlag: 0,
              ruleExplainflag: false,
              choosepropityflag: false,
              superpositionArray: [{label: '允许', value: 1}, {label: '不允许', value: 0}],
              purposeArray: [{label: '消费', value: 1}, {label: '充值', value: 2}, {label: '新用户注册', value: 3}],
              cardattrArray: [],
              cardthemArray: [],
              customerTypeArray: [],
              customerIdentityList: [],//客户身份
              customerOriginArray: [],
              customerClassArray: [{label: '等级', value: 1}, {label: '客户组', value: 2}, {label: '企业客户', value: 3}],
              customerClassSelectArray: [],
              customerClassLevel: [],
              customerClassgroup: [],
              customerClasscompon: [],
              customerClassflag: false,
              oilArray: [],
              dataOriginArray: [],
              payTypeArray: [],
              payTypeArrayRechange: [],
              payTypeArrayShopping: [],
              shoppingLimitArray: [{label: '金额', value: 1}, {label: '油量', value: 2}],
              rechangeLimitArray: [{label: '本次充值金额', value: 1}, {label: '首次充值金额', value: 2}, {
                label: '历史充值金额',
                value: 3
              }],
              holidaylimitArray: [{label: '元旦', value: 1}, {label: '春节', value: 2}, {
                label: '元宵节',
                value: 3
              }, {label: '妇女节', value: 4}, {label: '劳动节', value: 5}, {label: '儿童节', value: 6},
                {label: '端午节', value: 7}, {label: '七夕', value: 8}, {label: '中秋节', value: 9}, {
                  label: '国庆节',
                  value: 10
                }, {label: '重阳节', value: 11}, {label: '圣诞节', value: 12}],
              rule_integral_flag: false,
              random_integral_flag: false,
              fixed_integral_flag: false,
              station_list: {!!json_encode($station_list)!!} || [],
              is_new_card:true,//判断是否为新卡,新卡隐藏客户来源和卡属性

              checkAllOfDataOrigin: false,
              isIndeterminateOfDataOrigin: true,

              checkAllOfPayType: false,
              isIndeterminateOfPayType: true,

              checkAllOfOil: false,
              isIndeterminateOfOil: true,

              checkAllOfCard: false,
              isIndeterminateOfCard: true,

              checkAllOfRuleIdentity: false,
              isIndeterminateOfRuleIdentity: true,
            }
          },
          async mounted() {
            window.v$loading.show('');
            await this.setConfigOptions()
            await this.setBusinessCustomerInfo()
            if (this.id = this.GetQueryString('id')) {
              this.isEdit = true
              await this.setEidtInfo()
              if (this.postdata.cardthem.length === this.cardthemArray.length) {
                this.checkAllCard = true
              }
            } else {
              window.v$loading.hide('');
            }
          },
          methods: {
             //数据来源全选
             CheckAllChangeOfDataOrigin(val) {
                    
                    var stids = [];
                    for(var item in this.dataOriginArray){
                        stids.push(this.dataOriginArray[item].BH)
                    }
                    this.postdata.dataOrigin = val ? stids : [];
                    this.isIndeterminateOfDataOrigin = false;
               
                },
            //客户身份全选
            CheckAllChangeOfRuleIdentity(val){
              var stids = [];
              console.log(this.customerIdentityList);
              for(var item in this.customerIdentityList){
                  stids.push(this.customerIdentityList[item].value)
              }
              this.postdata.ruleIdentity = val ? stids : [];
              this.isIndeterminateOfRuleIdentity = false;
            },
            //付款方式全选
            CheckAllChangeOfPayType(val) {
                    
                    var stids = [];
                    if(this.postdata.purpose == 1){
                      for(var item in this.payTypeArrayShopping){
                        stids.push(this.payTypeArrayShopping[item].BH)
                      }
                    }
                    else if(this.postdata.purpose == 2){
                      for(var item in this.payTypeArrayRechange){
                        stids.push(this.payTypeArrayRechange[item].BH)
                      }
                    }                    
                    this.postdata.payType = val ? stids : [];
                    this.isIndeterminateOfPayType = false; 

                  },

            //油品全选
            CheckAllChangeOfOil(val) {
                    
                    var stids = [];
                    for(var item in this.oilArray){
                        stids.push(this.oilArray[item].WCID)
                    }
                    this.postdata.oil = val ? stids : [];
                    this.isIndeterminateOfOil = false;
               
                },

            //油品全选
            CheckAllChangeOfCard(val) {
                    
                    var stids = [];
                    for(var item in this.cardthemArray){
                        stids.push(this.cardthemArray[item].ID)
                    }
                    this.postdata.cardthem = val ? stids : [];
                    this.isIndeterminateOfCard = false;
               
                },

            handleCheckAllChange(val) {
              let idarr = val.map(item => item.ID)
              if (this.postdata.cardthem.sort().toString() === idarr.sort().toString() ) {
                this.postdata.cardthem = []
              } else {
                this.postdata.cardthem = idarr
              }
              this.isIndeterminate = false;
            },
            handleCheckedCardChange(value) {
              let checkedCount = value.length;
              this.checkAllCard = checkedCount === this.cardthemArray.length;
              this.isIndeterminate = checkedCount > 0 && checkedCount < this.cardthemArray.length;
            },
            async setConfigOptions() {
              let res = await this.getConfigOptions()
              if (res.status === 200) {
                  if(res.data.is_new_card == 1){
                      this.is_new_card = true;
                  }else{
                      this.is_new_card = false;
                  }
                this.formartData(res.data)
              } else {
                this.$notify({
                  showClose: true,
                  title: res.status,
                  message: res.info,
                  type: 'error'
                });
              }
            },
            async setBusinessCustomerInfo() {
              let res = await this.getBusinessCustomerInfo()
              if (res.status === 200) {
                this.customerClasscompon = res.data
                this.customerClasscompon.map((item) => {
                  item.BH = item.ID
                })
              } else {
                this.$notify({
                  showClose: true,
                  title: res.status,
                  message: res.info,
                  type: 'error'
                });
              }
            },
            async setEidtInfo() {
              let res = await this.getEidtInfo(this.id)
              if (res.status === 200) {
                res.data.rule_integral = res.data.rule_integral || this.choosefixed_type()
                res.data.random_integral = res.data.random_integral || {
                  gt: null,
                  lt: null
                }
                this.postdata = res.data
                this.chooseClass()
                window.v$loading.hide('');
              } else {
                this.$notify({
                  showClose: true,
                  title: res.status,
                  message: res.info,
                  type: 'error'
                });
              }
            },
            getEidtInfo(id) {
              let data = {}
              data.id = id.toString()
              return this.ajax('post', '/Integral/getRule', data)
            },
            getBusinessCustomerInfo() {
              return this.ajax('post', '/Integral/getBusinessCustomerInfo', null)
            },
            getConfigOptions() {
              return this.ajax('post', '/Integral/getIntegralRuleTem', null)
            },
            formartData(data) {
              this.cardattrArray = data.cardPropertyList
              this.cardthemArray = data.cardTopicList
              this.customerOriginArray = data.customerSourceList
              this.customerTypeArray = data.customerTypeList
            //   data.customerIdentityList.map((item)=>{
            //       return item.value = String(item.value)
            //   })
              this.customerIdentityList = data.customerIdentityList;
              this.oilArray = data.oilInfoList
              this.dataOriginArray = data.systemSourceList
              this.payTypeArrayShopping = data.systemPaywayList.filter(item => item.LX === 'FKFS')
              this.payTypeArrayRechange = data.systemPaywayList.filter(item => item.LX === 'FKFS_CZ')
              this.customerClassLevel = data.customerLevelList
              this.customerClassgroup = data.customerGroupList
              this.initObj()
            },
            resetTime() {
              this.postdata.exclusive_holidaylimit = []
              this.postdata.repeatType = 0
              this.postdata.selectedTime = null
            },
            resetPuopse() {
              this.postdata.cardattr = []
              this.postdata.cardthem = []
              this.postdata.customerOrigin = []
              this.postdata.custormType = []
              this.postdata.ruleIdentity = []
              this.postdata.customerClass = { // 客户分类
                class: '', // 1: 等级 2：客户组 3：企业客户
                value: '' // 选项值
              }
              this.postdata.oil = []
              this.postdata.dataOrigin = []
              this.postdata.payType = []
              this.postdata.rechangeLimit = { // 充值限制
                type: null, // 1: 本次充值金额 2：首次充值金额 3：历史充值金额
                gt: null, // 大于等于
                lt: 9999 // 小于
              }
              this.postdata.shoppingLimit = { // 充值限制
                type: null, // 1: 本次充值金额 2：首次充值金额 3：历史充值金额
                gt: null, // 大于等于
                lt: 9999 // 小于
              }
              this.postdata.exclusive_restriction = 0
              this.postdata.exclusive_holidaylimit = []
              this.postdata.vip_type = 0
              this.postdata.repeatType = 0
              this.postdata.selectedTime = null
              if(this.postdata.purpose ==1 || this.postdata.purpose ==2){
                this.postdata.integraltype = 1
              }else{
                this.postdata.integraltype = 2
              }
              this.postdata.rule_integral = {}
              this.postdata.random_integral = {}
              this.postdata.fixed_integral = ""
            },
            initObj() {
              this.resetPuopse()
              this.postdata.rule_integral = {
                type: null,
                lt: 1,
                gt: null,
                intType: 2
              }
              this.postdata.random_integral = {
                lt: null,
                gt: null,
              }
              this.postdata.fixed_integral = "";
              this.choosefixed_type()
            },
            choosefixed_type() {
              const that = this
              switch (that.postdata.purpose) {
                case 1:
                  that.postdata.rule_integral = {
                    type: null,
                    lt: 1,
                    gt: null,
                    intType: 2
                  }
                  break;
                case 2:
                  that.postdata.rule_integral = {
                    lt: 1,
                    gt: null,
                    intType: 2
                  }
                  break;
                default:
                  break;
              }
              return that.postdata.rule_integral
            },
            create() {
              if (this.createvaild()) {
                let data = {}
                let message = ''
                if(this.isIndeterminateOfPayType == false){
                  this.postdata.payType = ['']
                }
                if (this.isEdit) {        
                  data = this.postdata
                  data.id = this.id
                  message = '修改成功'
                } else {
                  data = this.postdata
                  message = '创建成功'
                  this.rule_integral_flag = 0
                  this.random_integral_flag = 0
                  this.fixed_integral_flag = 0
                }
                this.ajax('post', '/Integral/addRule', data).then((res) => {
                  if (res.status === 200) {
                    this.$notify({
                      showClose: true,
                      title: '操作提示',
                      message: message,
                      type: 'success'
                    });
                    // window.location.reload();
                    window.location.href = `/Integral/ruleList`
                  } else {
                    this.$notify({
                      showClose: true,
                      title: '操作提示',
                      message: res.info,
                      type: 'error'
                    });
                  }
                })
              }
            },
            createvaild() {
              const that = this
              const fn = (len) => {
                let flag1 = true
                /*
                if (that.postdata.integraltype == 1) {
                  Object.keys(that.postdata.rule_integral).forEach((key) => {
                    let tmp = that.postdata.rule_integral[key]
                    if (!tmp || tmp == 0) {
                      that.rule_integral_flag = true
                      flag1 = false
                    }
                  })
                } else if(that.postdata.integraltype == 2) {
                  Object.keys(that.postdata.random_integral).forEach((key) => {
                    if (!that.postdata.random_integral[key]) {
                      that.random_integral_flag = true
                      flag1 = false
                    }
                  })
                }else{
                    if (!that.postdata.fixed_integral) {
                      that.fixed_integral_flag = true
                      flag1 = false
                    }
                }
                */
                return flag1
              }
              let flag = true
              switch (that.postdata.purpose) {
                case 1:
                  flag = fn(4);
                  break;
                case 2:
                  flag = fn(3);
                  break;
                case 3:
                  flag = fn(1);
                  break;
                case 4:
                  flag = fn(1);
                  break;
                default:
                  break;
              }
              return flag
            },
            toggleCustomClass() {
              this.postdata.customerClass.value = ''
              this.chooseClass()
            },
            chooseClass() {
              const that = this
              switch (this.postdata.customerClass.class) {
                case 1:
                  that.customerClassSelectArray = that.customerClassLevel;
                  setTimeout(() => {
                    that.$refs.elselect1.selectedLabel = ''
                  }, 20)
                  break;
                case 2:
                  that.customerClassSelectArray = that.customerClassgroup
                  break;
                case 3:
                  that.customerClassSelectArray = that.customerClasscompon
                  break;
                default:
                  break;
              }
            },
            prevStep() {
              if (this.step > 1) {
                if (this.postdata.purpose == 4 && this.step == 3) {
                  this.step = 1
                } else if (this.postdata.exclusive_restriction == 2 && this.step == 4 && (this.postdata.purpose == 1 || this.postdata.purpose == 2)) {
                  this.step = 2
                } else {
                  this.step--
                }
              }
            },
            nextStep() {
              const that = this
              switch (this.step) {
                case 1:
                  that.validstep1()
                  break;
                case 2:
                  if(this.postdata.purpose == 3){
                    that.validstep3()
                  }else{
                    that.validstep2()
                  }
                  break;
                case 3:
                  that.validstep3()
                  break;
                default:
                  this.step++
              }
            },
            validstep1() {
              let flag = true
              if (!this.postdata.ruleName) {
                this.ruleNameflag = true
                flag = false
              }
              if (!this.postdata.propity) {
                this.choosepropityflag = true
                flag = false
              }
              if (this.postdata.timescope === null) {
                this.timeScopeFlag = true
                flag = false
              }
              if (flag) {
                if (this.postdata.purpose == 4) {
                  this.step = 3
                } else {
                  this.step++
                }
              }
            },
            validstep2() {
              if (this.postdata.exclusive_restriction == 2 && (this.postdata.purpose == 1 || this.postdata.purpose == 2)) {
                if (this.postdata.exclusive_holidaylimit.length) {
                  this.step = 4
                } else {
                  this.$message({
                    showClose: true,
                    message: '请选择节假日！',
                    type: 'error'
                  });
                }
              } else {
                this.step++
              }
            },
            vaildCustomerClass() {
              if(this.postdata.customerClass.class && this.postdata.customerClass.value != 0) {
                return true
              } else if (!this.postdata.customerClass.class) {
                return true
              } else {
                this.$message({
                  showClose: true,
                  message: '请选择客户分类！',
                  type: 'error'
                });
                return false
              }
            },
            validstep3() {
              if (this.vaild3flag || this.postdata.repeatType == 0) {
                this.step++
              } else {
                this.$message({
                  showClose: true,
                  message: '请设置合法时间！',
                  type: 'error'
                });
              }
            },
            change(flag) {
              this.vaild3flag = flag
            },
            GetQueryString(name) {
              var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
              var r = window.location.search.substr(1).match(reg);//search,查询？后面的参数，并匹配正则
              if (r != null) return unescape(r[2]);
              return null;
            },
            ajax(method, url, data) {
              return new Promise((resolve, reject) => {
                $.ajax({

                  type: method,
                  url: url,
                  // async:true,
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
            deepCopy(obj) {
              return JSON.parse(JSON.stringify(obj))
            }
          },
          computed: {},
          watch: {
            postdata: {
              handler(newValue, oldValue) {
                const that = this
                let key, flag1 = true, flag2 = true, flag3 = true
                let fixed = that.postdata.rule_integral
                let random = that.postdata.random_integral
                if (newValue.integraltype == 1) {
                  that.random_integral_flag = 0
                } else {
                  that.rule_integral_flag = 0
                }
                for (key in fixed) {
                  let tmp = fixed[key]
                  if (!tmp && typeof(tmp) != "undefined" && tmp != 0) {
                    flag1 = false
                  }
                }
                for (key in random) {
                  let tmp = random[key]
                  if (!tmp && typeof(tmp) != "undefined" && tmp != 0) {
                    flag2 = false
                  }
                }
                if (!that.postdata.fixed_integral && that.postdata.fixed_integral != 0) {
                    flag3 = false
                }
                that.$nextTick(() => {
                  if (flag1) {
                    that.rule_integral_flag = 0
                  }
                  if (flag2) {
                    that.random_integral_flag = 0
                  }
                  if (flag3) {
                    that.fixed_integral_flag = 0
                  }
                })
              },
              deep: true
            }
          }
        })
      })
    </script>
@endsection
