@extends('layout/master')


@section('header')
		<link rel="stylesheet" href="/css/uno.css?v={{config('constants.wcc_file_version')}}">
		<link rel="stylesheet" href="/js/vendor/bootstrap/css/bootstrap.min.css?v={{config('constants.wcc_file_version')}}">
    <link rel="stylesheet" href="/css/MarketPrice/index.css?v={{config('constants.wcc_file_version')}}">
    <link rel="stylesheet" href="/css/Marketing/config.css?v={{config('constants.wcc_file_version')}}" />
    <link rel="stylesheet" href="/css/wcc.css?v={{config('constants.wcc_file_version')}}" />
    <link rel="stylesheet" type="text/css" href="/css/wcc-element-ui/index.css?v={{config('constants.wcc_file_version')}}">
    <link rel="stylesheet" type="text/css" href="/css/wcc-element-ui/wcc.css?v={{config('constants.wcc_file_version')}}">
@endsection

@section('content')
    <div id="App" class="wrapper">
        <div class="top_header">
            <div class="step step_one step_active"><i>1</i><span>基础设置</span></div>
            <div class="step step_two" type="1"><i>2</i><span>时间设置</span></div>
            <div class="step step_three" type="1"><i>3</i><span>使用说明</span></div>
        </div>
        <div class="config_info config_info_one">
            {{--基本信息--}}
            <div class="unit_box clear sign">
                <div class="lf_box">券名称</div>
                <div class="rt_box">
                    <input type="text" id="coupon_name" placeholder="请输入抵用券名称" maxlength="30" class="wcc_input">
                </div>
            </div>
            <div class="unit_box clear sign">
                <div class="lf_box">券类型</div>
                <div class="rt_box">
                    @foreach($coupon_types as $coupon_type)
                        <label class="fixed_label"><input type="radio" name="coupon_type" @change="changeNonOilCoupon('{{ $coupon_type->type_id }}')" value="{{ $coupon_type->type_id }}"><div class="input_icon"></div><span>{{ $coupon_type->type_name }}</span></label>
                    @endforeach
                </div>
            </div>

            <div class="unit_box clear sign">
                <div class="lf_box">可用平台</div>
                <div class="rt_box">
                    @foreach($platform as $key => $item)
                        <label class="fixed_label">
                            <input type="checkbox" _is="@if($is_general_coupon==1) 1 @else 0 @endif" name="platform" value="{{ $key }}" @change="changePlatform('{{ $key }}')">
                            <div class="wcc_checkbox_y">
                                <span>&#xe67d;</span>
                            </div>
                            <span> {{ $item }} </span>
                        </label>
                    @endforeach
                </div>
            </div>

            <div id="paylimit" v-if="pay_limit_show" v-show="coupon_type_show" class="unit_box clear sign">
                <div class="lf_box">支付方式限制</div>
                <div class="rt_box">
                    <label class="fixed_label"><input type="radio" name="pay_limit" value="0" checked/><div class="input_icon"></div><span>不限制</span></label>
                    <label class="fixed_label"><input type="radio" name="pay_limit" value="1" /><div class="input_icon"></div><span>仅云端储值卡支付可用</span></label>
                    <label class="fixed_label"><input type="radio" name="pay_limit" value="2" /><div class="input_icon"></div><span>储值卡不可用</span></label>
                </div>
            </div>

            <div class="unit_box clear sign moneyType">

                <div class="lf_box">面额类型</div>
                <div class="rt_box">
                    <label class="block_label"><input type="radio" name="price_type" value="1" checked>
                        <div class="input_icon"></div>
                        <span>固定金额<input class="inline_input wcc_input"
                                             type="tel"
                                             id="fixed_input"
                                             maxlength="5"
                                             placeholder="金额">元</span>
                        <span class="prompt_new prompt_new_1"><i>&#xe66c;</i> 请输入大于0的数</span>
                    </label>
                    <label v-if="couponType != 5" class="block_label block_label_new">
                        <input type="radio"
                             name="price_type"
                             value="2">
                        <div class="input_icon"></div>
                        <span>随机金额<input class="inline_input wcc_input" type="tel" id="min_input" maxlength="5"
                                             disabled placeholder="金额">元至<input class="inline_input wcc_input"
                                                                                    type="tel" id="max_input"
                                                                                    maxlength="5" disabled
                                                                                    placeholder="金额">元</span>
                        <span class="prompt_new prompt_new_1 prompt_new_uni"><i>&#xe66c;</i> 请输入大于0的整数</span>
                    </label>
                    <label class="block_label"><input type="radio" name="price_type" value="3">
                        <div class="input_icon"></div>
                        <span>固定折扣<input class="inline_input wcc_input" type="tel" id="discount_input" maxlength="5"
                                             disabled placeholder="折扣">折,&nbsp;最多优惠<input
                                class="inline_input wcc_input" type="tel" id="max_discount" maxlength="5" disabled
                                placeholder="金额">元</span><span class="prompt_new prompt_new_1 notice"> 例：加油200元，使用“9折最多优惠10元”优惠券，仅优惠10元</span>
                    </label>
                    <label class="block_label hide" id="reduction_coupon" v-if="coupon_liter_show">
                        <input type="radio" name="price_type" value="5">
                        <div class="input_icon"></div>
                        <span>单升直降<input class="inline_input wcc_input common_input data-input" type="tel" id="direct_input" maxlength="5"
                                             data-name="direct"
                                             disabled placeholder="金额">元,&nbsp;最多优惠<input
                                class="inline_input wcc_input common_input data-input" type="tel" id="max_direct" maxlength="5" disabled
                                data-name="maxDirect"
                                placeholder="金额">元</span>
                        <span class="notice notice_text prompt_new" data-text=" 例：加油30升，使用“单升直降0.8元/升 最多优惠20元”优惠券， 仅优惠20元"> 例：加油30升，使用“单升直降0.8元/升 最多优惠20元”优惠券， 仅优惠20元</span>
                    </label>
                </div>
            </div>
             <div class="unit_box clear sign amount_limit"  style="display: none">
                <div class="lf_box">使用限制</div>
                <div class="rt_box">
                    <div class="oil_box">
                        <div class="condition_choose clear">
                            <div class="price_condition">
                                购买<input type="tel" min="0" class="price_input otherPriceLimit price_input_uni" placeholder="金额">元非油品可用 <span class="prompt_new prompt_new_1"><i>&#xe66c;</i> 请输入大于0的整数</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="unit_box clear sign condition_box">
                <div class="lf_box">使用限制</div>
                <div class="rt_box">
                    <div class="oil_box">
                        <div class="condition_choose clear">
                            <div class="oil_select select" type="0">
                                <div class="oil_select_title" choose_oil_id="-1">请选择油品</div>
                                <div class="oil_list public_scrollBrowser">
                                    <div class="oil_unit" data-id="0">不限</div>
                                    @foreach($oils as $oil)
                                        <div class="oil_unit" data-id="{{ $oil['oil_id'] }}">{{ $oil['oil_name'] }}</div>
                                    @endforeach
                                </div>
                            </div>
                            <div class="type_select select" type="0">
                                <div class="type_select_title" choose_limit_type="1">原价</div>
                                <div class="type_list">
                                    <div class="type_unit" data-limit_type="1">原价</div>
                                    <div class="type_unit" data-limit_type="2">实付</div>
                                    <div class="type_unit" data-limit_type="3">升数</div>
                                </div>
                            </div>
                            <div class="price_condition">
                                满<input type="tel" min="0" class="price_input otherPriceLimit" placeholder="金额">元 (升)
                                <span class="prompt_new prompt_new_1"><i>&#xe66c;</i> 请输入大于0的整数</span>
                            </div>
                            <!-- <a href="javascript:;" class="add_condition">添加</a> -->
                        </div>
                    </div>
                    <a href="javascript:;" class="add_condition">&nbsp;&nbsp;添加</a><span class="add_condition_prompt">全部油品已设置</span>
                    <!-- <div class="oil_state">存在多条使用条件时，用户只需满足其中一个条件即可使用营销券</div> -->
                </div>
            </div>
            {{-- 卡名称/卡类型在充值赠金券时才显示 --}}
            <div class="unit_box clear sign pay_card_list">
                <div class="card_title lf_box">卡名称</div>
                <div class="card_checkbox_list rt_box">
                  <el-checkbox :indeterminate="!cardListAll"  v-model="cardListAll" @change="cardSelected = $event?cardListAllValues:[]">全选</el-checkbox>
                  <el-checkbox-group v-model="cardSelected">
                    <el-checkbox
                        class="checkbox_fill"
                        style="min-width: 95px"
                        v-for="card in selectData"
                        :value="card.ID" :label="card.ID" :key="card.ID">
                      @{{card.MC}}
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
            </div>
            <div class="unit_box clear sign pay_card_list">
                <div class="lf_box checkbox_fill">卡类型</div>
                <div class="rt_box">
                  <el-checkbox :indeterminate="!cardTypeAll" v-model="cardTypeAll" @change="cardTypeSelected = $event?cardTypeAllValues:[]">全选</el-checkbox>
                  <el-checkbox-group v-model="cardTypeSelected">
                    <el-checkbox
                        class="checkbox_fill"
                        v-for="cardType in cartTypeList"
                        :label="cardType.value" :value="cardType.value" :key="cardType.value">
                      @{{ cardType.title }}
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
            </div>

            <div id="recharge_condition" class="unit_box clear sign recharge_condition">
                <div class="lf_box">充值条件</div>
                <div class="rt_box">
                    <div class="oil_box">
                        <div class="condition_choose clear" v-for="(item,index) in rechargeList"  :key="index">
                            <div class="price_condition">
                            &nbsp;&nbsp;充值满<input type="tel" min="0" v-model="item.amount_limit" class="price_input priceLimit" maxlength="6" placeholder="金额">元
                                <span v-if="index!=0" class="repeat-type-del delete_condition recharge-type-del" @click.stop="delRechargeCondition(index)"></span>
                                <span class="prompt_new prompt_recharge"><i>&#xe66c;</i> 请输入大于0的整数</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            @if($is_group or $is_layer)
                <div class="unit_box clear sign">
                    <div class="lf_box">油站限制</div>
                    <div class="rt_box rt_box_grop">
                        <div class="create-select edit_group" type='0'>
                            <span class="group_name" id="group_name">全部油站</span>
                            <!-- <a class="edit_group" href="javascript:;">修改</a> -->
                        </div>
                        {{--可选择油站弹窗--}}
                            <div class="confirm station_confirm station_confirm_new">
                                <div class="content_box station_box public_scrollBrowser station_box_new">
                                    <div class="main_box">
                                        <div class="select_all">
                                            <div class="wcc_checkbox_y checked_all"><span>&#xe67d;</span></div>
                                            <div class="selectAll" type="1">全选</div>
                                        </div>
                                        <div class="station_list_box clear">
                                            @foreach($station_list as $v)
                                                <label class="std_unit_box">
                                                    <input type="checkbox" name="station_name" checked><div class="wcc_checkbox_y"><span>&#xe67d;</span></div>
                                                    <div class="station_name" data-id="{{ $v->stid }}">{{ $v->stname }}</div>
                                                </label>
                                            @endforeach
                                        </div>
                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
            @endif

            <div class="unit_box clear sign" id="goods_box"  style="display: none" able="0">
                <div class="lf_box">绑定商品</div>
                <div class="rt_box">
                    <div class="goods_name" id="goods_name">请选择相应的商品</div><span class="select_span">去<a  class="@if($is_group==1) sure_uni @else sure_uni_son @endif edit_goods edit_goods_new"  href="javascript:;">选择</a></span>
                </div>
            </div>
            <div class="unit_box clear sign" id="extra_box"  style="display: none">
                <div class="lf_box">绑定商品</div>
                <div class="rt_box">
                    <span class="extra_name">洗车券</span><span class="select_span">去<a class="edit_extra edit_extra_new" href="javascript:;">选择</a></span>
                </div>
            </div>

            <div class="unit_box clear sign" id="mutex_type_box">
                <div class="lf_box">优惠限制</div>
                <div class="rt_box">
                    <label class="fixed_label"><input type="radio" name="mutex_type" value="0" checked><div class="input_icon"></div><span>不互斥</span></label>
                    <label class="fixed_label"><input type="radio" name="mutex_type" value="1"><div class="input_icon"></div><span>优惠互斥</span></label>
                    <span style="color: #999999;" v-if="couponType == 5">用于配置与加油卡后台-规则管理-充值规则优惠互斥</span>
                </div>
            </div>

            <!-- 修改：分账券字段，添加显示条件 -->
            <div class="unit_box clear sign" v-if="couponType == '2'">
                <div class="lf_box">分账券</div>
                <div class="rt_box">
                    <label class="fixed_label">
                        <input type="radio" name="profit_sharing" v-model="profit_sharing" value="0" checked>
                        <div class="input_icon"></div>
                        <span>否</span>
                    </label>
                    <label class="fixed_label">
                        <input type="radio" name="profit_sharing" v-model="profit_sharing" value="1">
                        <div class="input_icon"></div>
                        <span>是</span>
                    </label>
                </div>
            </div>

            <div class="unit_box clear sign" id="share_type_box">
                <div class="lf_box">能否转赠</div>
                <div class="rt_box">
                    <label class="fixed_label"><input type="radio" name="share_type" value="0" checked><div class="input_icon"></div><span>不能转赠</span></label>
                    <label class="fixed_label"><input type="radio" name="share_type" value="1"><div class="input_icon"></div><span>能转赠</span></label>
                </div>
            </div>

            <div class="unit_box clear sign" id="limit_type_box">
                <div class="lf_box">身份限制</div>
                <div class="rt_box">
                    <label class="fixed_label"><input type="radio" name="limit_type" value="0" checked><div class="input_icon"></div><span>不限制</span></label>
                    <label class="fixed_label"><input type="radio" name="limit_type" value="1"><div class="input_icon"></div><span>选中可用</span></label>
                    <label class="fixed_label"><input type="radio" name="limit_type" value="2"><div class="input_icon"></div><span>选中不可用</span></label>
                </div>
            </div>

            <div class="unit_box clear sign" v-if="coupon_append_show && priceType !== '3' && ['2','3'].includes(couponType) && profit_sharing == 0" id="append_type_box">
                <div class="lf_box">叠加限制</div>
                <div class="rt_box">
                    <label class="fixed_label"><input type="radio" name="append_type" value="0" checked><div class="input_icon"></div><span>不可叠加</span></label>
                    <label class="fixed_label"><input type="radio" name="append_type" value="1"><div class="input_icon"></div><span>可叠加</span></label>
                </div>
            </div>

            <div v-if="couponType != 5" class="unit_box clear sign" id="vip_type_box">
                <div class="lf_box">是否超级会员</div>
                <div class="rt_box">
                    <label class="fixed_label"><input type="radio" name="vip_type" value="0" checked><div class="input_icon"></div><span>不限制</span></label>
                    <label class="fixed_label"><input type="radio" name="vip_type" value="1"><div class="input_icon"></div><span>是</span></label>
                </div>
            </div>
            <div v-if="show_plate_limit && plate_limit_show == 1" class="unit_box clear sign" id="plate_type_box">
                <div class="lf_box">车牌校验</div>
                <div class="rt_box">
                    <label class="fixed_label"><input type="radio" name="plate_type" value="0" checked><div class="input_icon"></div><span>不限制</span></label>
                    <label class="fixed_label"><input type="radio" name="plate_type" value="1"><div class="input_icon"></div><span>是</span></label>
                </div>
            </div>
            <div class="unit_box clear sign" id="points_type_box" v-if="show_points && profit_sharing != 1">
                <div class="lf_box">积分抵油</div>
                <div class="rt_box">
                    <label class="fixed_label"><input type="radio" name="points_type" value="1"><div class="input_icon"></div><span>不可叠加</span></label>
                    <label class="fixed_label"><input type="radio" name="points_type" value="0" checked><div class="input_icon"></div><span>可叠加</span></label>
                </div>
            </div>
            <div class="unit_box clear sign" id="getPoints_box" v-if="show_points">
                <div class="lf_box">加油返积分</div>
                <div class="rt_box">
                    <label class="fixed_label"><input type="radio" name="getPoints" value="1"><div class="input_icon"></div><span>不可叠加</span></label>
                    <label class="fixed_label"><input type="radio" name="getPoints" value="0" checked><div class="input_icon"></div><span>可叠加</span></label>
                </div>
            </div>

            @if($driver_types)
                <div class="unit_box clear sign unit_box_clear unit_box_new" id="identify_box" style="display: none;">
                    <!-- <div class="lf_box">认证身份</div> -->
                    <div class="rt_box">
                        @foreach($driver_types as $driver_type)
                            <label class="fixed_label"><input type="checkbox" name="identify" value="{{ $driver_type->sub_type_id }}"><div class="wcc_checkbox_y"><span>&#xe67d;</span></div><span>{{ $driver_type->sub_type_name }}</span></label>
                        @endforeach
                    </div>
                </div>
            @endif

            @if ($levels)
                <div class="unit_box clear sign unit_box_clear unit_box_new" id="level_box" style="display: none">
                    <!-- <div class="lf_box">等级身份</div> -->
                    <div class="rt_box">
                        @foreach($levels as $level)
                            <label class="fixed_label"><input type="checkbox" name="level" value="{{ $level->id }}"><div class="wcc_checkbox_y"><span>&#xe67d;</span></div><span>{{ $level->level_name }}</span></label>
                        @endforeach
                        @if(!$use_tag)
                            <div class="oil_state">以上身份只需满足其中一个，限制类型就会生效。</div>
                        @endif

                    </div>
                </div>
            @endif
            @if($use_tag)
                <div class="unit_box clear sign unit_box_clear unit_box_new" id="use_tag_box" style="display: none">
                    <!-- <div class="lf_box">自定义身份</div> -->
                    <div class="rt_box">
                        @foreach($use_tag as $use)
                            <label class="fixed_label"><input type="checkbox" name="use" value="{{ $use->id }}"><div class="wcc_checkbox_y"><span>&#xe67d;</span></div><span>{{ $use->name }}</span></label>
                        @endforeach
                        <div class="oil_state">以上身份只需满足其中一个，限制类型就会生效。</div>
                    </div>
                </div>
            @endif

            <div class="unit_box clear sign" style="display: none;">
                <div class="lf_box">描述</div>
                <div class="rt_box">
                    <div class="group_name"><input type="text" id="description" maxlength="15"></div>
                </div>
            </div>

            <div class="foot_box">
                <div class="c_btn" id="save" type="1">下一步</div>
            </div>
        </div>
        <div class="config_info config_info_two" style="display:none">
            <div class="unit_box clear sign">
                <div class="lf_box">券有效期</div>
                <div class="rt_box">
                    {{--<label class="block_label"><input type="radio" name="date_type" value="2" checked><div class="input_icon"></div><span>时间范围<input class="inline_input" type="text" id="timeRange"></span></label> --}}
                    <label class="block_label">
                        <input type="radio" name="date_type" value="2" checked>
                        <div class="input_icon"></div>
                        <span>时间范围</span>
                        <div class="wcc_selectStation_box wcc_time wcc_width343" itshow="0">
                            <i class="wcc_calendar"></i>
                            <div class="input_box">
                                <input id="timeRange" type="text" name="" value="" placeholder="">
                            </div>
                        </div>
                    </label>
                    <label class="block_label"><input type="radio" name="date_type" value="1"><div class="input_icon"></div><span>自领取之日<input class="inline_input wcc_input" type="tel" id="valid_day" maxlength="3" placeholder="整数" disabled>天内有效</span><span class="prompt_new prompt_new_1"><i>&#xe66c;</i> 请输入大于0的整数</span></label>
                    <label class="block_label"><input type="radio" name="date_type" value="3"><div class="input_icon"></div>
                        <span>自领取之日起,第
                            <input class="inline_input wcc_input textcenter" type="tel" id="start_date" maxlength="3" placeholder="整数" value="2" disabled>天生效,有效期
                            <input class="inline_input wcc_input textcenter" type="tel" id="valid_day2" maxlength="3" placeholder="整数" disabled>天
                        </span>
                        <span class="prompt_new prompt_new_1 "><!--<i>&#xe66c;</i>--> 领取后次日生效</span>
                    </label>
                </div>
            </div>

            <!-- 时间限制开始 -->
            <div class="unit_box clear sign">
                <div class="lf_box">时间限制</div>
                <div class="rt_box">
                    <label class="fixed_label"><input class="disable_time" type="radio" name="set_time" value="0" checked><div class="input_icon"></div><span>有效期内可用</span></label>
                    <label class="fixed_label"><input class="disable_time" type="radio" name="set_time" value="2"><div class="input_icon"></div><span>设置时间可用</span></label>
                    <label class="fixed_label"><input class="disable_time" type="radio" name="set_time" value="1"><div class="input_icon"></div><span>设置时间不可用</span></label>
                </div>
            </div>
            <div class="unit_box clear sign data_time_box" style="display:none">
                <div class="lf_box"></div>
                <!-- 时间控件 -->
                <div class="rt_box">
                    <div class="form-items clear">
                        <div class="input-line">
                            <div class="create-select c-s-repeat-type">
                                <div class="value-active" type="day" id="repeatTypeVal" item-show="0"><span>每日重复</span></div>
                                <div class="c-s-options repeat-type-ul">
                                    <ul>
                                        <li class="repeat-type-li" type="day"><span>每日重复</span></li>
                                        <li class="repeat-type-li" type="week"><span>每周重复</span></li>
                                        <li class="repeat-type-li" type="month"><span>每月重复</span></li>
                                    </ul>
                                </div>
                            </div>
                            <div class="repeat-type" id="repeatType" type="day" itemShow="0">
                                <div class="item-type">
                                    <div class="repeat-time">
                                        <div class="input-line yh-time">
                                            <input type="text" name="start_time" class="input-text create-time minTimePicker" value="00:00:00">&nbsp
                                            至&nbsp
                                            <input type="text" name="end_time" class="input-text create-time minTimePicker" value="23:59:59">
                                            <span class="repeat-type-del delete_date"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {{--//添加--}}
                            <div class="task_layer_tel_add repeat-add">&nbsp&nbsp添加</div>
                        </div>
                        <div class="clear-fix"></div>
                    </div>
                </div>
                <!-- 时间控件结束 -->
            </div>

            <!-- 时间限制结束 -->

            <div class="foot_box">
                <div class="c_btn" id="save_back" type="1" style="margin-right:5px">上一步</div>
                <div class="c_btn" id="save_next" type="1" style="margin-left:15px">下一步</div>
            </div>
            {{--<div class="foot_box" style="margin-left:0">--}}
                {{--<div class="c_btn" id="save_true" type="1">创建</div>--}}
            {{--</div>--}}
        </div>

        <div class="config_info config_info_three" style="display:none">
            {{--<div class="unit_box clear sign">--}}
                {{--<div class="lf_box">优惠说明</div>--}}
                {{--<div class="rt_box"></div>--}}
            {{--</div>--}}
            {{--<div class="unit_box clear sign">--}}
                {{--<div class="lf_box">有效日期</div>--}}
                {{--<div class="rt_box"></div>--}}
            {{--</div>--}}
            {{--<div class="unit_box clear sign">--}}
                {{--<div class="lf_box">可用时段</div>--}}
                {{--<div class="rt_box"></div>--}}
            {{--</div>--}}
            <div class="unit_box clear sign">
                <div class="lf_box">补充说明</div>
                <div class="rt_box">
                    <el-input v-model="add_desc" style="width: 500px" :rows="5" type="textarea" resize="none"></el-input>
                </div>
            </div>
            <div class="unit_box clear sign" v-show="showCode">
                <span class="lf_box">生成核销码</span>
                <el-radio-group v-model="isCode">
                    <el-radio :label="1" style="width:80px;">是</el-radio>
                    <el-radio :label="0" style="width:80px;">否</el-radio>
                </el-radio-group>
                <span>核销码用于车主主动扫码核销券</span>
            </div>
						<div class="flex items-center unit_box clear sign" v-if="couponType === '4' && countdown_limit_show === 1">
							<span class="lf_box">洗车倒计时</span>
							<el-radio-group v-model="countdown">
								<el-radio :label="1" style="width:80px;">支持</el-radio>
								<el-radio :label="0" style="width:80px;">不支持</el-radio>
							</el-radio-group>
						</div>

            <div class="foot_box">
                <div class="c_btn" id="save_back_second" type="1" style="margin-right:5px">上一步</div>
            </div>
            <div class="foot_box" style="margin-left:0">
                <div class="c_btn" id="save_true" type="1">创建</div>
            </div>
        </div>
    </div>
@endsection

@section('elastic')
    {{--可兑换弹窗--}}
    @if (!$is_group)
        {{--单站--}}
        <div class="confirm choice_confirm exchange_confirm"  type="1">
            <div class="content_box single_box">
                <div class="top_box">
                    <div class="c_title sign c_title_new">选择可核销的商品</div>
                    <div class="close"></div>
                </div>
                <div class="main_box">
                    <div class="choice_radio" id="choice_radio" style="display: flex; -webkit-display: flex;">
                        <span class='text text_title'>商品类型</span>
                        <label for="radio1" class="wcc_label">
                             <input type="radio" name="goods_zhou" data-status="-1" id="radio1">
                               <span class="wcc_label_radio"><i></i></span>
                             <span class='text'>全部商品</span>
                        </label>
                        <label for="radio2" class="wcc_label">
                             <input type="radio" name="goods_zhou" data-status="1" id="radio2">
                               <span class="wcc_label_radio"><i></i></span>
                             <span class='text'>已上架商品</span>
                        </label>
                        <label for="radio3" class="wcc_label">
                             <input type="radio" name="goods_zhou" data-status="0" id="radio3">
                               <span class="wcc_label_radio"><i></i></span>
                             <span class='text'>未上架商品</span>
                        </label>
                        <div class="j_choice_box j_choice_box_new">
                            <div class="text" >
                                <input type="tel" name="" value="" placeholder="请输入条形码">
                                <div class="bottom" id="choice_box_bottom"><i class="wcc_btn_i">&#xe697;</i></div>
                            </div>
                        </div>
                    </div>
                    <div class="choice_top_box">
                        <!-- <div class="choice_box">
                            <div class="choice_title">品类</div>
                            <div class="select kind_choice" type="0">
                                <div class="select_title" select_id="0">请选择品类</div>
                                <div class="select_list">
                                    <div class="select_item kind_item" data-id="0">全部</div>
                                    @foreach($retail_class as $v)
                                        <div class="select_item kind_item" data-id="{{ $v->id }}">{{ $v->name }}</div>
                                    @endforeach

                                </div>
                            </div>
                        </div> -->
                    </div>
                    <div class="choice_main_box">
                        <div class="list_box select_able_box">
                            <div class="list_title">商品列表 <label class="select_all_retails">全选</label></div>
                            <div class="list_content public_scrollBrowser">
                            </div>
                        </div>
                        <div class="list_box" id="single_select_box">
                            <div class="list_title">已选中商品<label class="delete_all_retails">清除</label ></div>
                            <div class="list_content show_box show_box_uni public_scrollBrowser"></div>
                        </div>
                    </div>
                </div>
                <div class="foot_box">
                    <div class="c_btn sure" type="1">确认</div>
                    <div class="c_btn cancel" type="0">取消</div>
                </div>
            </div>
        </div>
    @else
        {{--集团--}}
        <div class="confirm choice_confirm exchange_confirm" type="2">
            <div class="content_box group_std_box" @click="hidden">
                <div class="top_box">
                    <div class="c_title sign c_title_new">选择可核销的商品</div>
                    <div class="close"></div>
                </div>
                <div class="main_box" >
                    <div class="choice_top_box">
                        <div class="choice_box">
                            <div class="choice_title choice_title_group">油站限制</div>
                            <div class="select std_choice_me select_group limit_choose" type="0">
                                <?php
                                    $firstStation = [];
                                    foreach ($station_list as $k => $v) {
                                        $firstStation = $v;
                                        break;
                                    }
                                ?>
                                <div class="select_title" id="select_title_uni" select_id="{{$firstStation->stid}}">{{$firstStation->stname}}</div>
                                <div class="select_list select_list_group public_scrollBrowser" v-show="flag" id="select_station_list">
                                    @foreach($station_list as $v)
                                        <div class="select_item station_item" data-id="{{ $v->stid }}">{{ $v->stname }}</div>
                                    @endforeach

                                </div>
                            </div>
                        </div>
                        <!-- <div class="choice_box">
                            <div class="choice_title">商品类型</div>
                            <div class="select kind_choice" type="0">
                                <div class="select_title" select_id="0">请选择品类</div>
                                <div class="select_list">
                                    <div class="select_item kind_item" data-id="0">全部</div>
                                    @foreach($retail_class as $v)
                                        <div class="select_item kind_item" data-id="{{ $v->id }}">{{ $v->name }}</div>
                                    @endforeach
                                </div>
                            </div>
                        </div> -->
                    </div>
                    <div class="choice_radio" id="choice_radio" style="display: flex; -webkit-display: flex;margin-top:20px;">
                        <span class='text text_title'>商品类型</span>
                        <label for="radio1" class="wcc_label">
                             <input type="radio" name="goods_zhou" data-status="-1" id="radio1" checked>
                               <span class="wcc_label_radio"><i></i></span>
                             <span class='text'>全部商品</span>
                        </label>
                        <label for="radio2" class="wcc_label">
                             <input type="radio" name="goods_zhou" data-status="1" id="radio2">
                               <span class="wcc_label_radio"><i></i></span>
                             <span class='text'>已上架商品</span>
                        </label>
                        <label for="radio3" class="wcc_label">
                             <input type="radio" name="goods_zhou" data-status="0" id="radio3">
                               <span class="wcc_label_radio"><i></i></span>
                             <span class='text'>未上架商品</span>
                        </label>
                        <div class="j_choice_box j_choice_box_new">
                            <div class="text" >
                                <input type="tel" name="" value="" placeholder="请输入条形码">
                                <div class="bottom" id="choice_box_bottom"><i class="wcc_btn_i">&#xe697;</i></div>
                            </div>
                        </div>
                    </div>
                    <div class="choice_main_box">
                        <div class="list_box select_able_box">
                            <div class="list_title">可选择商品<label class="select_all_retails">全选</label></div>
                            <div class="list_content public_scrollBrowser">

                            </div>
                        </div>
                        <div class="list_box">
                            <div class="list_title">已选中商品<label class="delete_all_retails">清除</label ></div>
                            <div class="list_content show_box show_box_uni public_scrollBrowser" id="group_select_box">
                                <div class="group_choice_box" data-stid="0">
                                    <p class="station_title myGroup_title" data-stid="0">钓鱼岛加油站集团</p>
                                    <div class="station_select_unit_box station_select_unit_box">
                                        <div class="choice_items no_choice_items">
                                            <p class="no_choice">未选择商品</p>
                                        </div>
                                    </div>
                                </div>
                                @foreach($station_list as $v)
                                    <div class="group_choice_box" data-stid="{{ $v->stid }}">
                                        <p class="station_title" data-stid="{{ $v->stid }}">{{ $v->stname }}</p>
                                        <div class="station_select_unit_box">
                                            <div class="choice_items no_choice_items">
                                                <p class="no_choice">未选择商品</p>
                                            </div>
                                        </div>
                                    </div>
                                @endforeach
                            </div>
                        </div>
                    </div>
                </div>
                <div class="foot_box">
                    <div class="c_btn sure" type="1">确认</div>
                    <div class="c_btn cancel" type="0">取消</div>
                </div>
            </div>
        </div>
    @endif
    {{--可兑换异业商品--}}
    {{--单站--}}
    <div class="confirm choice_confirm extra_confirm" type="1">
        <div class="content_box single_box">
            <div class="top_box">
                <div class="c_title sign c_title_new">选择可核销的商品</div>
                <div class="close"></div>
            </div>
            <div class="main_box">
                <div class="choice_top_box">
                    <div class="choice_box">
                        <div class="choice_title">品类</div>
                        <div class="select kind_choice" type="0">
                            <div class="select_title">请选择油站</div>
                            <div class="select_list">
                                <div class="select_item">中国钓鱼岛第一加油站</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="choice_main_box">
                    <div class="list_box">
                        <div class="list_title">可选择商品</div>
                        <div class="list_content">

                        </div>
                    </div>
                    <div class="list_box">
                        <div class="list_title">已选择商品</div>
                        <div class="list_content show_box"></div>
                    </div>
                </div>
            </div>
            <div class="foot_box">
                <div class="c_btn cancel" type="0">取消</div>
                <div class="c_btn sure" type="1">确定</div>
            </div>
        </div>
    </div>
@endsection

@section('footer')
    {{--条件单元--}}

    <script type="text/html" id="addCondition_unit">
        <div class="condition_choose clear condition_choose_new">
            <div class="oil_select select" type="0">
                <div class="oil_select_title" choose_oil_id="-1">请选择油品</div>
                <div class="oil_list public_scrollBrowser">
                    @foreach($oils as $oil)
                        <div class="oil_unit" data-id="{{ $oil['oil_id'] }}">{{ $oil['oil_name'] }}</div>
                    @endforeach
                </div>
            </div>
            <div class="type_select select" type="0">
                <div class="type_select_title" choose_limit_type="1">原价</div>
                <div class="type_list">
                    <div class="type_unit" data-limit_type="1">原价</div>
                    <div class="type_unit" data-limit_type="2">实付</div>
                    <div class="type_unit" data-limit_type="3">升数</div>
                </div>
            </div>
            <div class="price_condition">
                满<input type="tel" min="0" class="price_input otherPriceLimit" placeholder="金额">元 (升)
                <span class="repeat-type-del delete_condition"></span>
                <span class="prompt_new prompt_new_1"><i>&#xe66c;</i> 请输入大于0的整数</span>
            </div>
            <!-- <a href="javascript:;" class="delete_condition">删除</a> -->
        </div>
    </script>




    <!-- 按月重复 -->
    <script id="repeatMonthTpl" type="text/html">
        <div class="repeat-by-month">
            <ul>
                @for($i=1;$i<32;$i++)
                <li class="item-li" val="{{$i}}"><span>{{$i}}</span></li>
                @endfor
            </ul>
        </div>
    </script>

    <!-- 按周重复 -->
    <script type="text/html" id="repeatWeekTpl">
        <div class="repeat-by-month repeat-by-week">
            <ul>
                <li class="item-li" val="7"><span>日</span></li>
                <li class="item-li" val="1"><span>一</span></li>
                <li class="item-li" val="2"><span>二</span></li>
                <li class="item-li" val="3"><span>三</span></li>
                <li class="item-li" val="4"><span>四</span></li>
                <li class="item-li" val="5"><span>五</span></li>
                <li class="item-li" val="6"><span>六</span></li>
            </ul>
        </div>
    </script>

    <!-- 按日重复 -->
    <script type="text/html" id="repeatTimeTpl">
        <div class="repeat-time">
            <div class="input-line yh-time">
                <input type="text" name="start_time" class="input-text create-time minTimePicker" value="00:00:00">&nbsp
                至&nbsp
                <input type="text" name="end_time" class="input-text create-time minTimePicker" value="23:59:59">
                <span class="repeat-type-del delete_date"></span>
            </div>
        </div>
    </script>


    <script>
        var is_group = {{$is_group}},
            is_stid = {{$is_stid}},
        		countdown_limit_show = {{$countdown_limit_show}},
            coupon_liter_show = {{$coupon_liter_show}},
            disableOnline ={{$not_oil_show}},
            is_layer = {{$is_layer}},
            driver_types = {{$driver_types ? 1 : 0 }},
            levels   = {{$levels ? 1 : 0 }},
            use_tag   = {{$use_tag ? 1 : 0 }},
            coupon_append_show   = {{$coupon_append_show}};
        var black_fun_arr = {!! json_encode($black_privilege_arr)  !!};
        var is_limit_function = {{$version_control['is_limit_function']}};
        var group_id = {{$group_id}};
        var groupID = {{$group_id}};
        var currentStation = {!!json_encode($current)!!};
        $(".myGroup_title").html(currentStation.label);
        var plate_limit_show = {!! json_encode($plate_limit_show)  !!};
    </script>
    <script type="text/javascript" src="/js/vendor/Plug/Plug.js"></script>
    <script type="text/javascript" src="/js/vendor/vue/vue.min.js"></script>
    <script src="/js/Marketing/btnControl.js?v={{config('constants.wcc_file_version')}}"></script>
    <script type="text/javascript" src="/js/wcc-element-ui/vue.js?v={{config('constants.wcc_file_version')}}"></script>
    <script type="text/javascript" src="/js/wcc-element-ui/index.js?v={{config('constants.wcc_file_version')}}"></script>
    <script type="text/javascript" src="/js/Marketing/card_type_data.js?v={{config('constants.wcc_file_version')}}"></script>
    <script>
    var vm = new Vue({
          el: '#App',
          computed:{
              cartTypeList(){
                  let res = []
                  for (const key in cardType) {
                      res.push({value:key,title:cardType[key]})
                  }
                  return res;
              },
              // 卡名称列表值
              cardListAllValues(){
                  return this.selectData.map(item => item.ID)
              },
              // 卡类型值
              cardTypeAllValues(){
                  return  this.cartTypeList.map(item => item.value)
              },
              // 当前选中的卡名称列表
              currentCardList(){
                  return  this.selectData.filter(item => this.cardSelected.includes(item.ID)).map(item => ({id:item.ID,name:item.MC}))
              },
              /**
               * 是否存在充值赠金券
                */
              isRechargeGift(){
                  return this.couponTypes.find(item => item.type_id == 5)
              }
          },
          data:{
            	countdown_limit_show,
              coupon_liter_show:coupon_liter_show,
              plate_limit_show:plate_limit_show,
              add_desc: '',
              profit_sharing: 0,
              lists: {!! json_encode($station_list)  !!},
              flag: false,
              selectData:[],
              selectValue:"",
              rechargeList:[{
                  product:"",
                  amount_limit:""
            }],
            selectList:[],
              // 选中的群类型
              couponType:'',
            a:"",
            pay_limit_show: {{$pay_limit_show}},//控制灰度油站标识
            couponTypes:  {!! json_encode($coupon_types) !!},//券类型数组
            coupon_type_show: 1, //券类型为油品券时为1其他为0,
            coupon_append_show:coupon_append_show,
            show_points:true,//只有油品才展示积分选项
            showCode: false, //展示核销码选项
            isCode: 0, // 生成核销码
              // 卡列表全选
              cardListAll:false,
              // 卡类型全选
              cardTypeAll:false,
              // 选中的卡
              cardSelected:[],
              // 选中的卡类型
              cardTypeSelected:[],
              selectPlateList:[],
              show_plate_limit:false,
              checkPlate:0,
              priceType:'1', // 面额类型（😒在 config.js 中 price_type_checkbox.on('click', function () {赋值）
							countdown:0,
          },
          watch: {
              profit_sharing(newVal) {
                  if(newVal == 1) {
                      // 当选择"是"时，强制设置为不可叠加
                      $('input[name="append_type"][value="0"]').prop('checked', true);
                  }
              },
              couponType(newVal) {
                  // 当切换到非油品券时，重置分账券状态
                  if(newVal != '2') {
                      this.profit_sharing = 0;
                  }
              }
          },
          mounted() {
              if (this.pay_limit_show || this.isRechargeGift) {
                  this.setConfigOptions();
              }
              var that = this;
              if (groupID == 1856 || groupID == 1) {
                  this.show_points = true;
              } else {
                  this.show_points = false;
              }

              //券类型为油品时才会有支付方式限制选项
              $(document.querySelectorAll('input[name="coupon_type"]')).on('click', function () {
                  var coupon_type_value = $(document.querySelectorAll('input[name="coupon_type"]:checked')).val();
                  //2为油品券
                  if (coupon_type_value != 2) {
                      that.coupon_type_show = 0;
                  } else {
                      that.coupon_type_show = 1;
                  }
              })
          },
          methods: {
            hidden() {
              if (this.flag) {
                this.flag = false
              }
            },
            changeConditionRecharge(v,i){
                this.rechargeList[i].product_name = this.selectData[v].MC;
                this.rechargeList[i].product_id = this.selectData[v].ID;
            },
            getConfigOptions() {
              return this.ajax('post', '/Integral/getIntegralRuleTem', null)
            },
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
            async setConfigOptions() {
              let res = await this.getConfigOptions()
              if (res.status === 200) {
                  // 禁用ZT 101的数据
                this.selectData = res.data.cardTopicList.filter(item => item.ZT != 101)
              } else {
                this.$notify({
                  showClose: true,
                  title: res.status,
                  message: res.info,
                  type: 'error'
                });
              }
            },
            changeNonOilCoupon(type) {
                // 设置当前选中的券类型
                this.couponType = type;
                if((groupID == 1856 || groupID == 1) && type == 2){
                    this.show_points = true;
                }else{
                    this.show_points = false;
                }
                if(
                  ( (this.selectPlateList.length === 1 && (this.selectPlateList[0] == 2 || this.selectPlateList[0] == 4 )) || 
                  (this.selectPlateList.length === 2 && this.selectPlateList.includes('2')&&this.selectPlateList.includes('4')) ) && 
                  this.couponType == 2
                ){
                  this.show_plate_limit = true
                }else{
                  this.show_plate_limit = false
                }
            },
            changePlatform(key){
              var selectedValues = [];
              $('input[name="platform"]:checked').each(function() {
                selectedValues.push($(this).val());
              });
              this.selectPlateList = selectedValues
              if(
                ( (selectedValues.length === 1 && (selectedValues[0] == 2 || selectedValues[0] == 4 )) || 
                (selectedValues.length === 2 && selectedValues.includes('2')&&selectedValues.includes('4')) ) && 
                this.couponType == 2
               ){
                this.show_plate_limit = true
              }else{
                this.show_plate_limit = false
              }
            },
            addRechargeCondition(){
                this.rechargeList.push({
                  product:"",
                  amount_limit:""
                })
            },
            delRechargeCondition(index){
                this.rechargeList.splice(index,1);
            }
          }
        });
    </script>
    <script src="/js/Marketing/config.js?v={{config('constants.wcc_file_version')}}"></script>
@endsection
