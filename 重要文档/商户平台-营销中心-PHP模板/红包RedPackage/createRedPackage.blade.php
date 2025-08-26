@extends('layout/master')

@section('header')
    <link rel="stylesheet" href="/css/common/common.css?v={{config('constants.wcc_file_version')}}" />
    <link rel="stylesheet" href="/css/RedPackage/createRedPackage.css?v={{config('constants.wcc_file_version')}}" />
    <link href="/css/Setting/ruleManage.css?v={{config('constants.wcc_file_version')}}" rel="stylesheet">
    <link href="/css/wcc.css?v={{config('constants.wcc_file_version')}}" rel="stylesheet">
    <link rel="stylesheet" href="/css/MarketPrice/index.css?v={{config('constants.wcc_file_version')}}" />
    <link rel="stylesheet" href="/css/Marketing/config.css?v={{config('constants.wcc_file_version')}}" />
{{--    <link rel="stylesheet" href="/css/Setting/ruleManage.css?v={{config('constants.wcc_file_version')}}" />--}}
    <link rel="stylesheet" href="/css/wcc-element-ui/index.css?v={{config('constants.wcc_file_version')}}">
    <link rel="stylesheet" href="/css/wcc-element-ui/wcc.css?v={{config('constants.wcc_file_version')}}">
    <link rel="stylesheet" href="/css/GameActivity/createGameActivity.css?v={{config('constants.wcc_file_version')}}">
@endsection


@section('content')
    <div class="clear">
        <div style="display: none" id="activity_id">{{isset($activity_id)?$activity_id:0}}</div>
        <div style="display: none" id="temp_activity_id"></div>
        <div class="clear-fix"></div>
        {{--创建进度--}}
        <div class="progress_outter">
            <div class="progress progress_default " >活动设置</div>
            <div class="progress progress_default " >选择营销券</div>
            <div class="progress progress_default " >红包设置</div>
            <div class="progress progress_default progress_last" >确认信息</div>
        </div>
        <div class="clear-fix"></div>

        <div class="redpackage_body">
            {{-----------------活动信息-----------------开始--}}
            <div class="activity" id="activity_info" style="display: block">
                <div class="h5_outter" >
                    <img class="template_img" src="/img/hongbao_template_CouponsGiftInfo.png" />
                    <div id="h5_title" class="h5_title">页面标题</div>
                    <div class="h5_logo">
                        <img src="{{$st_logo}}" class="h5_logo_img">
                        <span class="h5_logo_str">{{$current_st_name}}</span>
                    </div>
                    <div class="h5_titleContainer" ittype="CouponsGiftInfo">
                        <div class="h5_titleContainer_mainTitle">活动主标语</div>
                        <div class="h5_titleContainer_otheTitle">领个红包更优惠</div>
                    </div>
                    {{--<div id="h5_banner" class="h5_banner">--}}
                        {{--<img class="h5_banner_img"><span class="h5_banner_str" >主标语</span>--}}
                    {{--</div>--}}
                    <div class="h5_rule" >
                        {{--<div class="h5_rule_title" >——活动规则——</div>--}}
                        <div id="h5_rule" class="h5_rule_content"></div>
                    </div>
                </div>






                <div class="active_info">
                    <div class="createRedPackage_title">
                        红包属性
                    </div>
                    @if($is_dao)
                        <div class="form_row">
                            <label class="form-label form_label_float"><span class="font-orange">*</span>红包类型</label>
                            <div class="form-line type-form-line">
                                <div class="createRedPackage_label">
                                    <label for="radio0" class="wcc_label">
                                        <input type="radio" id="radio0" name="taxyer_type"  value='1'  >
                                        <span class="wcc_label_radio"><i></i></span>
                                        <span class='text'>普通红包</span>
                                    </label>
                                    <div class="createRedPackage_ask wcc_hover">? 
                                        <div class="wcc_tips wcc_tips_right tips_right0">
                                            <div class="font14_333">
                                               一个活动发行一波红包 
                                            </div>
                                            <div class="font14_999">
                                               如发行1000个百元红包，满足条件得用户可主动领取一次 
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div  class="createRedPackage_label">
                                    <label for="radio1" class="wcc_label">
                                        <input type="radio" id="radio1" name="taxyer_type" value='2'>
                                        <span class="wcc_label_radio"><i></i></span>
                                        <span class='text'>裂变红包</span>
                                    </label>
                                    <div class="createRedPackage_ask wcc_hover">? 
                                        <div class="wcc_tips wcc_tips_right tips_right0">
                                            <div class="font14_333">
                                               <!-- 可设置为满额送奖励，一个奖励发行一波红包  -->
                                            </div>
                                            <div class="font14_999">
                                               <!-- 用户消费每满足一次满额送条件时，可获得一组分享红包，如用户今天消费满足100元可分享5个红包，明天消费满足条件可再分享5个 -->
                                                可设置为满额送奖励，当获得裂变红包并分享给好友时，好友
                                                通过分享可领取优惠券（例：美团支付后给好友分享优惠券）
                                                红包内添加“选择领取后x天有效”类营销券效果最佳
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                
                            </div>
                        </div>
                    @endif

                    


                    <div class="form_row" >
                        <label class="form-label"><span class="font-orange">*</span>红包名字</label>
                        <div class="form-line">
                            <span class="red_package_txt_count" id="act_name_cout">0/15</span>
                            <input type="text" id="act_name" class="redpackage-input-text act_name" maxlength="30" />
                        </div>
                    </div>
                    
                    <!-- <div class="form_row" id="type0">
                        <label class="form-label"><span class="font-orange">*</span>红包有效期</label>
                        <div class="form-line ml7">
                            <input type="text" id="time_range" class="redpackage-input-text" />
                        </div>
                    </div> -->

                    
                    
                    <div class="form_row">
                        <label class="form-label"><span class="font-orange">*</span>红包有效期</label>
                        <div class="form-line ml7">
                            <div class="createRedPackage_label clear">
                                <label for="radio0" class="wcc_label  float">
                                    <input class='time_range_none time-radio-btn' type="radio" id="radio0" name="taxyer_type1" checked="checked"  value="1" >
                                    <span class="wcc_label_radio time_range_none"><i></i></span>
                                    <div class="createRedPackage_label_left ml10">
                                        <div class="float time_range_none">固定时间</div> 
                                        <div class="ml10 redpackage-input-text float"></div>
                                        
                                    </div>
                                    
                                </label>
                                <input type="text" id="time_range" class="redpackage-input-text" />
                            </div>
                            <div  class="createRedPackage_label clear time_range_none" style="margin-bottom:15px;">
                                <label for="radio1" class="wcc_label float">
                                    <input class="time-radio-btn" type="radio" id="radio1" name="taxyer_type1" value="2" >
                                    <span class="wcc_label_radio"><i></i></span>
                                    <div class="createRedPackage_label_left ml10">
                                        <input type="text" id="red_number" class="redpackage-input-text float" />
                                        <div class="float ml10">天有效</div>
                                    </div>
                                    
                                </label>
                                

                            </div>
                            
                        </div>
                    </div>
                    
                    <div>
                        <div style="color: #8B8B8B;margin-left: 27px;">*周期规则</div>
                    </div>
                    <div id="select_date" class="date_selected" style="position: relative;right: -117px;top: -18px; margin-bottom: -8px;">
                        <el-radio-group class="flex-start" v-model="radio">
                          <el-radio :label="0" style="margin-right: 30px !important; margin-top: 3px !important;">无</el-radio>
                          <el-radio :label="1" style="margin-right: 30px !important; margin-top: 3px !important;">每天</el-radio>
                          <el-radio :label="2" style="margin-right: 30px !important; margin-top: 3px !important;">每周</el-radio>
                          <el-radio :label="3" style="margin-right: 30px !important; margin-top: 3px !important;">每月</el-radio>
                        </el-radio-group>
                        <el-repeat-time-picker
                            style="width: 100%;box-sizing:content-box;"
                            @change="change"
                            xstyle="width: 280px;"
                            value-format="HH:mm:ss"
                            :max-length="8"
                            v-model="obj"
                            :type="radio">
                        </el-repeat-time-picker>
                    </div>

                    <!-- 时间限制开始 -->
                    <div class="form_row" style="display: none">
                        <div class="form-label form_label_float lf_cell lf_box" style="margin-top:10px;"><span class="font-orange">*</span>周期规则</div>
                        <!-- 时间控件 -->
                        <div class="rt_cell rt_box">
                            <div class="form-items">
                                <div class="input-line rule-box">
                                    <div class="create-select c-s-repeat-type" style="width:280px !important;">
                                        <div class="value-active" type="day" id="repeatTypeVal" item-show="0"><span>每日重复</span></div>
                                        <div class="c-s-options repeat-type-ul" style="width:276px !important;">
                                            <ul>
                                                <li class="repeat-type-li" type="none"><span>不重复</span></li>
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
                                                    <input type="text" autocomplete="off" name="start_time" class="input-text create-time minTimePicker" value="00:00:00">&nbsp
                                                    至&nbsp
                                                    <input type="text" autocomplete="off" name="end_time" class="input-text create-time minTimePicker" value="23:59:59">
                                                    <span class="repeat-type-del delete_date"></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {{--//添加--}}
                                    <div class="task_layer_tel_add repeat-add">&nbsp&nbsp添加</div>
                                </div>
                                <!-- <div class="clear-fix"></div> -->
                            </div>
                        </div>
                        <!-- 时间控件结束 -->
                    </div>
                    <!-- 时间限制结束 -->
                    {{--身份条件--}}
                    <div class="form_row">
                    <div class="condition_cell">
                        <div class="lf_cell">*身份条件</div>
                        <div class="rt_cell">
                            <label for="user-limit-0" class="wcc_label">
                                <input type="radio" id="user-limit-0" name="identify_type" identify_type="0" checked>
                                <span class="wcc_label_radio"><i></i></span>
                                <span class='text'>不限</span>
                            </label>
                            <label for="user-limit-1" class="wcc_label">
                                <input type="radio" id="user-limit-1" name="identify_type" identify_type="1">
                                <span class="wcc_label_radio"><i></i></span>
                                <span class='text'>选中可参与</span>
                            </label>
                            <label for="user-limit-2" class="wcc_label">
                                <input type="radio" id="user-limit-2" name="identify_type" identify_type="2">
                                <span class="wcc_label_radio"><i></i></span>
                                <span class='text'>选中不可参与</span>
                            </label>
                        </div>
                    </div>
                        <div id="identify_cell" class="identify_cell" style="width: 500px;margin-bottom:20px;display:none;">
                            <div class="lf_cell"></div>
                            <div class="rt_cell">
                                @foreach( $driver_types as $value)
                                    <label for="sub-{{$value->sub_type_id}}" class="wcc_label_checkbox">
                                        <input type="checkbox" id="sub-{{$value->sub_type_id}}" name="special_car" data-id="{{$value->sub_type_id}}" value="{{$value->sub_type_id}}">
                                        <div class="wcc_checkbox">
                                            <span>&#xe67d;</span>
                                        </div>
                                        <span class='text'>{{$value->sub_type_name}}</span>
                                    </label>
                                @endforeach
                            </div>

                        </div>
                    </div>

                    <div class="form_row">
                        <label class="form-label form_label_float"><span class="font-orange">*</span>会员等级</label>
                        <div class="form-line type-form-line">
                            <div class="createRedPackage_label">
                                <label  class="wcc_label">
                                    <input type="radio" id="level0" name="level_type" level_type="0"  value='0'  checked>
                                    <span class="wcc_label_radio"><i></i></span>
                                    <span class='text'>不限制</span>
                                </label>
                            </div>
{{--                            <div  class="createRedPackage_label">--}}
{{--                                <label  class="wcc_label">--}}
{{--                                    <input type="radio" id="level1" name="level_type" level_type="1" value='1'>--}}
{{--                                    <span class="wcc_label_radio"><i></i></span>--}}
{{--                                    <span class='text'>非会员</span>--}}
{{--                                </label>--}}
{{--                            </div>--}}
                            <div  class="createRedPackage_label">
                                <label class="wcc_label">
                                    <input type="radio" id="level1" name="level_type" level_type="2" value='2'>
                                    <span class="wcc_label_radio"><i></i></span>
                                    <span class='text'>限制会员等级</span>
                                </label>
                            </div>

                        </div>
                    </div>
                    <div class="form_row" >
                        <div class="rt_cell" style="display: none;margin-top: 20px;margin-bottom: 20px;" id="level-cell">
                            @foreach( $levels as $value)
                                <label for="{{$value->id}}" class="wcc_label_checkbox">
                                    <input type="checkbox" id="{{$value->id}}" name="vip" data-id="{{$value->id}}" value="{{$value->id}}">
                                    <div class="wcc_checkbox">
                                        <span>&#xe67d;</span>
                                    </div>
                                    <span class='text'>{{$value->level_name}}</span>
                                </label>
                            @endforeach
                        </div>
                    </div>
                    <div class="form_row">
                        <label class="form-label form_label_float"><span class="font-orange">*</span>领取用户</label>
                        <div class="form-line type-form-line">
                            <div class="createRedPackage_label">
                                <label for="new0" class="wcc_label">
                                    <input type="radio" id="new0" name="new_type" user_type="0"  value='2'  checked>
                                    <span class="wcc_label_radio"><i></i></span>
                                    <span class='text'>所有用户</span>
                                </label>
                            </div>
                            <div  class="createRedPackage_label">
                                <label for="new1" class="wcc_label">
                                    <input type="radio" id="new1" name="new_type" user_type="1" value='1'>
                                    <span class="wcc_label_radio"><i></i></span>
                                    <span class='text'>未加油用户</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="form_row repaet_form_row" style="display:none">
                        <label class="form-label form_label_float"><span class="font-orange">*</span>重复领取</label>
                        <div class="form-line type-form-line">
                            <div class="createRedPackage_label">
                                <label for="repeat0" class="wcc_label">
                                    <input type="radio" id="repeat0" name="repeat_type" robtain_type="1"  value='1'>
                                    <span class="wcc_label_radio"><i></i></span>
                                    <span class='text'>是</span>
                                </label>
                            </div>
                            <div  class="createRedPackage_label">
                                <label for="repeat1" class="wcc_label">
                                    <input type="radio" id="repeat1" name="repeat_type" robtain_type="0" value='0'  checked>
                                    <span class="wcc_label_radio"><i></i></span>
                                    <span class='text'>否</span>
                                </label>
                            </div>
                            <div class="createRedPackage_label">
                                <label class="wcc_label">
                                    <span class='text' style="">说明</span>
                                </label>
                                <div class="createRedPackage_ask wcc_hover">? 
                                    <div class="wcc_tips wcc_tips_right tips_right0">
                                        <div>在红包有效期内，用户可以在一个周期内设置的不同时间段分别领取1次红包；不同周期可以重复领取；</div>
                                        <div>比如红包有效期为一个月；周期设置为每日09:00:00---12:00:00；</div>
                                        <div>选择不重复，那么只要用户在30天内只能领取1次；</div>
                                        <div>选择重复，那么用户每天在该时间段内都可以领取一次，即总共可以领取30次；</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="form_row">
                        <label class="form-label form_label_float"><span class="font-orange">*</span>能否分享</label>
                        <div class="form-line type-form-line">
                            <div class="createRedPackage_label">
                                <label for="share0" class="wcc_label">
                                    <input type="radio" id="share0" name="share_type"  value='2'  >
                                    <span class="wcc_label_radio"><i></i></span>
                                    <span class='text'>可以分享</span>
                                </label>
                            </div>
                            <div  class="createRedPackage_label">
                                <label for="share1" class="wcc_label">
                                    <input type="radio" id="share1" name="share_type" value='1'>
                                    <span class="wcc_label_radio"><i></i></span>
                                    <span class='text'>不可分享</span>
                                </label>
                            </div>

                        </div>
                    </div>

                    <div class="form_row if_free_form_row">
                        <label class="form-label form_label_float"><span class="font-orange">*</span>是否免费</label>
                        <div class="form-line type-form-line">
                            <div class="createRedPackage_label">
                                <label for="free0" class="wcc_label">
                                    <input type="radio" id="free0" name="if_free"  value='1'  checked>
                                    <span class="wcc_label_radio"><i></i></span>
                                    <span class='text'>免费</span>
                                </label>
                            </div>
                            <div  class="createRedPackage_label">
                                <label for="free1" class="wcc_label">
                                    <input type="radio" id="free1" name="if_free" value='2'>
                                    <span class="wcc_label_radio"><i></i></span>
                                    <span class='text'>花钱换购</span>
                                </label>
                            </div>
                            <div class="createRedPackage_label">
                                <span class='text'>每个红包</span>
                                <input type="text" id="each_cost" name="each_cost" class="input-each-cost each_cost" maxlength="6" disabled/>
                                <span class='text'>元</span>
                                <div class="each_cost_tips" style="display: none;">金额必须是大于0小于5000, 可留两位小数, 如0.01</div>
                            </div>
                        </div>
                    </div>

                    <div class="form_row" style="display:flex;align-items:center;margin-bottom: 15px;">
                        <label class="form-label" style="width:65px;"><span class="font-orange">*</span>次数限制</label>
                        <div class="form-line" style="display:flex;align-items:center;margin-bottom: 0px;">
                            <span>每位用户可以参与</span>
                            <input type="number" style="width:120px;height:24px;" id="times_limit" name="times_limit" class="redpackage-input-text times_limit" />
                            <span>次</span>
                        </div>
                    </div>

                    <div class="form_row">
                        <label class="form-label form_label_float"><span class="font-orange">*</span>领券时是否需要车牌号</label>
                        <div class="form-line type-form-line">
                            <div class="createRedPackage_label">
                                <label  class="wcc_label">
                                    <input type="radio" id="needplate0" name="is_need_plate"  value='0'  checked>
                                    <span class="wcc_label_radio"><i></i></span>
                                    <span class='text'>否</span>
                                </label>
                            </div>
                            <div  class="createRedPackage_label">
                                <label  class="wcc_label">
                                    <input type="radio" id="needplate1" name="is_need_plate" value='1'>
                                    <span class="wcc_label_radio"><i></i></span>
                                    <span class='text'>是</span>
                                </label>
                            </div>

                        </div>
                    </div>

                    <div class="createRedPackage_title">
                        页面内容
                    </div>

                    {{-- 模板选择 --}}
                    <div class="form_row" style="margin-bottom:20px;">
                        <div class="selectTemplate_box">
                            @foreach($templates as $i => $item)
                                <div class="selectTemplate_block" template="{{$item['name']}}">
                                    <img src="/img/hongbao_template_select_{{$item['name']}}.png" />
                                </div>
                            @endforeach
                        </div>
                    </div>

                   <!--  <div class="form_row" style="display:none">
                       <label class="form-label"><span class="font-orange">*</span>活动名称</label>
                       <div class="form-line">
                           <span class="red_package_txt_count" _id="act_name_cout">0/15</span>
                           <input type="text" _id="" class="redpackage-input-text act_name" maxlength="30" />
                       </div>
                   </div> -->
                    <!-- <div class="form_row " style="display:none">
                        <label class="form-label"><span class="font-orange">*</span>活动时间</label>
                        <div class="form-line">
                            <input type="text" id="time_range" class="redpackage-input-text" />
                        </div>
                    </div> -->
                    <div class="form_row ">
                        <label class="form-label"><span class="font-orange">*</span>页面标题</label>
                        <div class="form-line">
                            <span class="red_package_txt_count" id="title_count">0/12</span>
                            <input type="text" class="redpackage-input-text" id="title" maxlength="30" />
                        </div>
                    </div>

                    {{--油站标志--}}
                    <div class="form_row ">
                        <label class="form-label"><span class="font-orange">*</span>油站标志</label>
                        <a href="javascript:;" class="upload_logo"  >
                            <input type="file" id="upload_logo" accept="image/png,image/jpeg" name="file" multiple=""/>
                            <span id="upload_logo_txt">重新上传</span>
                        </a>
                        <div>
                            <div class="logo_desc_example">
                               <!--  <span>例：</span>
                               <img src="/img/ic_hongbao_logo.png"> -->
                            </div>
                            <p class="logo_desc">要求：1M以内，格式bmp、png、jpeg、jpg、gif； 尺寸不小于200*200px的正方形</p>
                        </div>
                        {{--<img src="/img/ic_hongbao_logo.png" id='demo_logo' class="demo_logo">--}}
                        <img id='demo_logo' class="demo_logo" src="{{$st_logo}}" />
                        <div class="setImageToDefault" id="setImageToDefault" style="display:none">
                            <a href="javascript:;">恢复默认</a>
                        </div>
                    </div>

                    {{--主标语banner--}}
                    {{--<div class="form_row form_top_margin15">--}}
                        {{--<label class="form-label"><span class="font-orange">*</span>主标语</label>--}}
                        {{--<a href="javascript:;" class="upload_logo upload_banner"  >--}}
                            {{--<input type="file" id="upload_banner" accept="image/png,image/jpeg" name="file" multiple=""/>--}}
                            {{--<span id="upload_banner_txt">上传图片</span>--}}
                        {{--</a>--}}
                        {{--<div>--}}
                            {{--<div class="logo_desc_example">--}}
                                {{--<span>例：</span>--}}
                                {{--<img src="/img/ic_hongbao_banner.png">--}}
                            {{--</div>--}}
                            {{--<p class="logo_desc">图片建议尺寸:240像素*80像素，仅支持jpg/png格式长方形图片，透明背景，大小不超过200k。</p>--}}
                        {{--</div>--}}
                        {{--<img src="/img/ic_hongbao_logo.png" id="demo_banner" class="demo_banner">--}}
                        {{--<img id="demo_banner" class="demo_banner">--}}
                    {{--</div>--}}

                    {{-- 油站名称配置 --}}
                    <div class="form_row" style="margin-top:30px;">
                        <label class="form-label"><span class="font-orange">*</span>油站名称</label>
                        <div class="form-line" style="margin-left:13px;">
                            <span class="red_package_txt_count">0/16</span>
                            <input type="text" class="redpackage-input-text" id="inputStationName" value="{{$current_st_name}}" maxlength="30" />
                        </div>
                    </div>

                    {{-- 配置标题 --}}
                    <div class="form_row">
                        <label class="form-label"><span class="font-orange">*</span>主标语&nbsp;&nbsp;</label>
                        <div class="form-line">
                            <span class="red_package_txt_count">0/8</span>
                            <input type="text" class="redpackage-input-text" id="MainTitleInput" maxlength="30" />
                        </div>
                    </div>

                    {{-- 对于用户的条件 --}}
                    <div class="form_row" style="display: none;">
                        <label class="form-label"><span class="font-orange">*</span>领取资格</label>
                        <div class="limitContainer" id="limitContainer">
                            <label for="limitRadio1" class="wcc_label">
                                <input type="radio" id="limitRadio1" name="taxyer_type2" checked="checked">
                                <span class="wcc_label_radio"><i></i></span>
                                <span class='text'>无限制</span>
                            </label>
                            <label for="limitRadio2" class="wcc_label">
                                <input type="radio" id="limitRadio2" name="taxyer_type2">
                                <span class="wcc_label_radio"><i></i></span>
                                <span class='text'>新用户</span>
                            </label><label for="limitRadio3" class="wcc_label">
                                <input type="radio" id="limitRadio3" name="taxyer_type2">
                                <span class="wcc_label_radio"><i></i></span>
                                <span class='text'>老用户</span>
                            </label>
                        </div>
                    </div>

                    {{--活动规则--}}
                    <div class="form_row  form-textarea-outter">
                        <label class="form-label form-activity-rule"><span class="font-orange">*</span>活动规则</label>
                        <div class="form-activity-ling_rule">
                            <textarea  class="form-textarea " id="txt_area" placeholder="根据使用方式及规则自动生成，也可自定义编辑。描述将会出现在红包页面中，建议不超过200个字。"></textarea>
                        </div>
                        <a href="javascript:;" class="reset_txt" id="reset_txt">恢复默认</a>
                        <span class="reset_txt">点击插入活动时间变量：</span>
                        <a href="javascript:;" class="wcc_text_green" id="reset_day">@{{day}}</a>
                    </div>

                    <div class="form_row form_top_margin15 create_btn_layout" >
                        <button class="wecar-redpackage-btn" disabled id="create_next">下一步</button>
                    </div>
                </div>
            </div>
            {{-----------------活动信息-----------------结束--}}


            {{-----------------营销券选择-----------------开始--}}
                {{--class="coupon_select"--}}
            <div id="coupon_select"  style="display: none" >
                <div class="coupon_title_outer">
                    <div class="coupon_title_rectangle"></div>
                    <div class="coupon_title">请选择红包里包含的营销券</div>
                    <button id="create_coupon" class="wecar-redpackage-btn create_coupon" style="display: block">创建营销券</button>
                    
                    <div class="wcc_input_search search_box">
                        <input type="text" type="text" id="search" placeholder="请输入营销券名称" >
                        <em class="wcc_btn_i deleteSearch">&#xe698;</em>
                        <span class="wcc_input_search_span searchButton">
                            <i class="wcc_btn_i">&#xe697;</i>
                        </span>
                    </div> 
                </div>

                <div class="coupon_table_outter">
                    <table class="coupon_table" id="tbl_coupon">
                        <thead >
                            <tr>
                                <td><input type="checkbox" id="select_all"/></td>
                                <td>券名</td>
                                <td>券ID</td>
                                <td>券额</td>
                                <td>券类型</td>
                                <td>有效期</td>
                                <td>操作</td>
                            </tr>
                        </thead>
                        <tbody id="tbody_list" ></tbody>
                    </table>
                </div>
                <div id="no_data" class="coupon_no_data">
                    <img src="/img/ic_notice_remind_small.png"/>
                    暂无营销券，请先创建
                </div>

                <div class="coupon_button_set" >
                    <button class="wecar-redpackage-btn-pre" id="coupon_set_pre">上一步</button>
                    <button class="wecar-redpackage-btn" disabled id="coupon_set_next">下一步</button>

                </div>
            </div>
            {{-----------------营销券选择-----------------结束--}}

            <div class="clear-fix"></div>

            {{-----------------营销券包配置(红包设置)-----------------开始--}}
            <div id="redpackage_config"  style="display: none">
                <div class="coupon_title_outer">
                    <div class="coupon_title_rectangle"></div>
                    <div class="coupon_title">请选择红包里包含的营销券</div>
                </div>
                <div class="set_prompt">每个用户只可领取一个红包，一个红包可包含多张营销券，每次发行红包的总预算= 红包发行数量*券额*券数量，预算计算时，不含折扣券</div>
                <div class="set_txt">
                    <div class="set_txt_1">发行红包数量</div>
                    <div class="set_plus">
                        <button id="red_set_sub" class="disable">-</button>
                        <input id="red_set_num" type="number"  value="1000" style="padding-left:12px" />
                        <button id="red_set_add">+</button>
                    </div>
                    <div class="set_txt_1" style="color:#8B8B8B">每个红包都包含以下所选的券</div>
                </div>
                <div class="red_set_table_outter">
                    <table class="coupon_table" id="tbl_coupon">
                        <thead>
                            <tr>
                                <td>券名</td>
                                <td>券ID</td>
                                <td>券额</td>
                                <td>券类型</td>
                                <td>券数量</td>
                            </tr>
                        </thead>
                        <tbody id="tbody_list_selected" ></tbody>
                    </table>
                    <div class="red_set_budget"> <span style="margin-right: 20px">总预算：<span class="budget_color" id="red_set_budget">-</span></span></div>
                </div>
                @if( $is_support_normal_rp )
                <div class="form_row confirm_row">
                    <div class="confirm_title_label" style="width: 150px;">是否可在浏览器中领取</div>
                    <div class="confirm_title" style="position: relative;top: 7px;">
                        <label for="taxyer_type1" class="wcc_label">
                             <input type="radio" id="taxyer_type1"  name="taxyer_type3" checked="checked"  value='0' >
                               <span class="wcc_label_radio"><i></i></span>
                             <span class='text'>否</span>
                        </label>
                        <label for="taxyer_type0" class="wcc_label">
                             <input type="radio" id="taxyer_type0" name="taxyer_type3" value='1' >
                               <span class="wcc_label_radio"><i></i></span>
                             <span class='text'>是</span>
                        </label>
                    </div>
                </div>

                <div class="form_row confirm_row">
                    <div class="confirm_title_label" style="width: 150px;height:10px"></div>
                    <div class="confirm_title" style="position: relative;top: 7px;font-size: 12px;color: #8B8B8B;">
                       如选择“是”，则用户可在浏览器打开链接输入手机号码后领取红包，新用户进行一键加油时需要在再次输入手机号码
                    </div>
                </div>
                @endif
                <div class="coupon_button_set" >
                    <button class="wecar-redpackage-btn-pre"  id="red_set_pre">上一步</button>
                    <button class="wecar-redpackage-btn" disabled id="red_set_next">下一步</button>
                </div>
            </div>
            {{-----------------营销券包配置 (红包设置)-----------------结束--}}

            <div class="clear-fix"></div>

            <div  id="confirm_info" style="display: none">
                <div class="h5_outter">
                    <img class="template_img" src="/img/hongbao_template_CouponsGiftInfo.png" />
                    <div id="h5_title" class="h5_title">页面标题</div>
                    <div class="h5_logo">
                        <img src="{{$st_logo}}" class="h5_logo_img"><span class="h5_logo_str">{{$current_st_name}}</span>
                    </div>
                    <div class="h5_titleContainer" ittype="CouponsGiftInfo">
                        <div class="h5_titleContainer_mainTitle">活动主标语</div>
                        <div class="h5_titleContainer_otheTitle">领个红包更优惠</div>
                    </div>
                    {{--<div id="h5_banner" class="h5_banner">--}}
                        {{--<img class="h5_banner_img"><span class="h5_banner_str" >主标语</span>--}}
                    {{--</div>--}}
                    <div class="h5_rule" >
                        {{--<div class="h5_rule_title" >——活动规则——</div>--}}
                        <div id="h5_rule" class="h5_rule_content"></div>
                    </div>
                </div>
                <div class="active_info">
                    <div class="form_row confirm_row" style="display:none">
                        <div class="confirm_title_label">页面标题</div>
                        <div class="confirm_title" id="confirm_title"></div>
                    </div>
                    <div class="form_row confirm_row" >
                        <div class="confirm_title_label">红包类型</div>
                        <div class="confirm_title" id="confirm_type"></div>
                    </div>
                    <div class="form_row confirm_row" >
                        <div class="confirm_title_label">红包名称</div>
                        <div class="confirm_title" id="confirm_name"></div>
                    </div>
                    <div class="form_row confirm_row" style="display:none">
                        <div class="confirm_title_label">活动有效期</div>
                        <div class="confirm_title" id="confirm_range_time"></div>
                    </div>

                    <div class="form_row confirm_row">
                        <div class="confirm_title_label">红包有效期</div>
                        <div class="confirm_title" id="confirm_red_time"></div>
                    </div>

                    <div class="form_row confirm_row" style="display:flex">
                        <div class="confirm_title_label">周期规律</div>
                        <div class="confirm_title" id="confirm_red_rule"></div>
                    </div>

                    <div class="form_row confirm_row" style="display:flex">
                        <div class="confirm_title_label">重复领取</div>
                        <div class="confirm_title" id="confirm_red_repeat"></div>
                    </div>

                    <div class="form_row confirm_row confirm_red_title">
                        <div class="package_summary">
                            红包数量<span id="confirm_redpack_num">-</span>个，总预算<span class="budget_color" id="confirm_redpack_budget">-</span>元。包含以下营销券
                        </div>
                    </div>
                    <div  class="form_row form_top_margin">
                        <table class="coupon_table">
                            <thead>
                                <tr>
                                    <td>营销券名称</td>
                                    <td>券额</td>
                                    <td>发放数量</td>
                                </tr>
                            </thead>
                            <tbody id="confirm_coupon_body">
                            </tbody>
                        </table>
                    </div>
                    


                    <div class="coupon_button_set" >
                        <button class="wecar-redpackage-btn-pre"  id="confirm_pre">上一步</button>
                        <button class="wecar-redpackage-btn" disabled id="confirm_sure">确定</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    {{--活动保存成功--}}
    <div id="save_success" class="save_success"  style="display: none;" >
        <img src="/img/ic_notice_correct.png"  >
        <div >活动保存成功</div>
        
            <div id="activity_url" class="save_success_box" style="margin-top:20px;display: none;" >
                <span class="save_success_text">微信链接</span>
                <input type='text' class="wcc_input" disabled="disabled" >
                <span  class="wcc_text_green save_success_copy">复制</span>
            </div>
            <div id="activity_url_in_explorer" class="save_success_box" style="display: none;">
                <span class="save_success_text">浏览器链接</span>
                <input type='text' class="wcc_input" disabled="disabled" >
                <span  class="wcc_text_green save_success_copy" >复制</span>
            </div>

        <div >


        <button class="wecar-redpackage-btn-pre" id="show_redpacke_record">点击查看</button>
        </div>
    </div>

    <script type="text/html" id="opVerTpl">
        <div class="rule-form-body rule-set">
            <div class="form-div" style="display: flex;">
                <label class="form-span">
                    请输入操作密码
                </label>
                <div class="form-right">
                    <input type="password" class="redpackage-input-text" name="op" />
                </div>
            </div>
            <div class="form-div">
                <label class="form-span">

                </label>
                <div class="form-right">
                    <label><input type="checkbox" name="readme" value="1"> 30分钟内不再输入操作密码</label>
                </div>
            </div>
        </div>
    </script>
@endsection

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
                <input  type="text" autocomplete="off" name="start_time" class="input-text create-time minTimePicker" value="00:00:00">&nbsp
                至&nbsp
                <input type="text" autocomplete="off" name="end_time" class="input-text create-time minTimePicker" value="23:59:59">
                <span class="repeat-type-del delete_date"></span>
            </div>
        </div>
    </script>

@section('elastic')
    {{-- 营销券详情 --}}
    <div class="modal dialog" id="chakanjuan" style="display:none">
        <div class="dialog_content">
            <div class="top_cell">
                <span class="prompt">营销券详情</span><span class="dialog_close"></span>
            </div>
            <div class="center_cell">

            </div>
        </div>
    </div>

    {{--弹窗--}}
    <div class="pop dialog" type="0">
        <div class="dialog_content">
            <div class="top_cell">
                <span class="prompt">提示</span><span class="dialog_close"></span>
            </div>
            <div class="center_cell">
                <div class="dialog_icon" type="0"></div>
                <div class="dialog_text">
                    <p class="dialog_title">标题</p>
                    <p class="dialog_state">内容</p>
                </div>
                <div class="dialog_btn">
                    <div class="bot_btn">
                        <input type="button" class="cancel" value="取消">
                        <input type="button" class="sure_btn" id="btn-sure" value="创建完毕" able="1">
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('footer')
    <script src="/js/wcc-element-ui/vue.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/wcc-element-ui/index.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/vendor/jQuery-File-Upload/js/vendor/jquery.ui.widget.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/vendor/jQuery-File-Upload/js/jquery.iframe-transport.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/vendor/jQuery-File-Upload/js/jquery.fileupload.js?v={{config('constants.wcc_file_version')}}"></script>
{{--    <script src="/js/vendor/date/formatDate.js?v={{config('constants.wcc_file_version')}}"></script>--}}
    <script src="/js/wecar.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/vendor/Plug/Plug.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/RedPackage/config.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/RedPackage/createRedPackage.js?v={{config('constants.wcc_file_version')}}"></script>
{{--    <script src="/js/Setting/ruleManage.js?v={{config('constants.wcc_file_version')}}"></script>--}}
@endsection
