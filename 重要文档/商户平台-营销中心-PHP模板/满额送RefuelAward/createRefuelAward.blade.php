@extends('layout/master')

@section('header')
    <link rel="stylesheet" href="/css/wecar.css?v={{config('constants.wcc_file_version')}}" />
    <link rel="stylesheet" href="/css/RefuelAward/refuelAward.css?v={{config('constants.wcc_file_version')}}" />
    <link rel="stylesheet" href="/css/wcc.css?v={{config('constants.wcc_file_version')}}" />
    <link rel="stylesheet" href="/css/wcc-element-ui/index.css?v={{config('constants.wcc_file_version')}}">
    <link rel="stylesheet" href="/css/wcc-element-ui/wcc.css?v={{config('constants.wcc_file_version')}}">
@endsection


@section('content')
    <div class="createContainer" id="createBox">

        <div class="createContainer_lineBox">
            <div class="createContainer_lineBox_left"><span>*</span>活动名称</div>
            <div class="createContainer_lineBox_right">
                <input class="createContainer_lineBox_input wcc_input" v-on:focus="error_obj.create_name=false" v-bind:class="{error_mess:error_obj.create_name}"  type="text" placeholder="请输入活动名称" v-model="create_name" />
            </div>
        </div>

        <div class="createContainer_lineBox">
            <div class="createContainer_lineBox_left"><span>*</span>活动有效期</div>
            <div class="createContainer_lineBox_right">
                <div class="wcc_selectStation_box wcc_time wcc_width343" itshow="0">
                    <i class="wcc_calendar"></i>
                    <div class="input_box">
                        <input id="timeSelect" type="text" />
                    </div>
                </div>
            </div>
        </div>

        <div class="createContainer_lineBox" v-if="is_group">
            <div class="createContainer_lineBox_left"><span>*</span>活动油站</div>
            <div class="createContainer_lineBox_right createContainer_lineBox_right_uni">
                <select-radio v-bind:add="station_list_arr1" select="请选择要添加的油站" v-on:selected="checkout_oil" type='2'></select-radio>
            </div>
        </div>

<!--         <div class="date_selected">
            <div class="date_selected_title"><span>*</span>周期规则</div>
            <div class="date_selected_content" >
                <el-radio-group class="flex-start" v-model="radio">
                  <el-radio :label="0">无</el-radio>
                  <el-radio :label="1">每天</el-radio>
                  <el-radio :label="2">每周</el-radio>
                  <el-radio :label="3">每月</el-radio>
                </el-radio-group>
                <el-repeat-time-picker
                    style="width: 100%"
                    @change="change"
                    xstyle="width: 280px;"
                    value-format="HH:mm:ss"
                    :max-length="6"
                    v-model="obj"
                    :type="radio">
                </el-repeat-time-picker>
            </div>
        </div> -->

        <div class="createContainer_lineBox">
            <div class="createContainer_lineBox_left"><span>*</span>周期规则</div>
        </div>
        
        <div class="date_selected" >
            <el-radio-group class="flex-start" v-model="radio">
              <el-radio :label="0">无</el-radio>
              <el-radio :label="1">每天</el-radio>
              <el-radio :label="2">每周</el-radio>
              <el-radio :label="3">每月</el-radio>
            </el-radio-group>
            <el-repeat-time-picker
                style="width: 100%"
                @change="change"
                xstyle="width: 280px;"
                value-format="HH:mm:ss"
                :max-length="8"
                v-model="obj"
                :type="radio">
            </el-repeat-time-picker>
        </div>
        

        @if($is_dao)
        <div class="createContainer_lineBox">
            <div class="createContainer_lineBox_left"><span>*</span>满额奖励</div>
            <div class="createContainer_lineBox_right">
            <!--     <input class="createContainer_lineBox_input wcc_input" type="text" placeholder="请输入活动名称" v-model="create_name" /> -->
                <label for="radio0" class="wcc_label">
                    <input type="radio" id="radio0" name="taxyer_type2" checked="checked" value="1" v-model="red_type" :checked="red_type==1">
                    <span class="wcc_label_radio"><i></i></span>
                    <span class='text'>营销券</span>
                    <!-- <div class="statistics_ask wcc_hover">
                        ? 
                        <div class="wcc_tips wcc_tips_top wcc_tips_top1">消费满足条件，将按规<br>则直接返券到用户账上</div>
                    </div> -->
                </label>
                <label for="radio1" class="wcc_label">
                    <input type="radio" id="radio1" name="taxyer_type2" value="3" v-model="red_type" :checked="red_type==3">
                    <span class="wcc_label_radio"><i></i></span>
                    <span class='text'>裂变红包</span>
                    <div class="statistics_ask wcc_hover">
                        ? 
                        <div class="wcc_tips wcc_tips_top wcc_tips_top2">
                            <div>
                                <!-- 消费满足条件，用户可获得一次分享红包 -->
                            </div>
                            <div class="wcc_tips_top2_text2">
                                用户满足满额送条件时，可获得一个裂变红包并分享给好友，好友
                                通过分享可领取优惠券（例：美团支付后给好友分享优惠券）<br>
                                营销中心>红包创建可创建裂变红包
                            </div>
                        </div>
                    </div>
                </label>
            </div>
        </div>
        @endif

        <!-- <template v-if="window.station_select.stid == 0 && window.station_select.group_id > 0">
            <div class="createContainer_lineBox">
                <div class="createContainer_lineBox_left">活动范围</div>
                <div class="createContainer_lineBox_right">集团下该时间内未独立创建活动的所有油站</div>
            </div>
        </template> -->

        <div class="createContainer_lineBox addProjectContainer" isauto="1">
            <div class="createContainer_lineBox_left"><span>*</span></div>
            <div class="createContainer_lineBox_right">

                <template v-for="(bigItem,bigIndex) in use_project">
                    <div class="ruleContainer_top">
                        <!-- <div class="ruleContainer_title">规则@{{Number(bigIndex)+1}}</div> -->
                        <div class="ruleContainer">
                            <div class="ruleContainer_box ruleContainer_box_float">
                                <div class="ruleContainer_block">
                                    <em class="ruleContainer_block_em">油品规则</em>
                                    <template v-if="bigIndex == 0">
                                        <select-radio v-bind:add="oil_type_array" v-bind:disabled="use_project.length > 1" select="请选择油品" v-on:selected="fn_getOilData(bigItem,arguments[0])" v-bind:search-input="0"></select-radio>
                                    </template>
                                    <template v-else>
                                        <select-radio v-bind:add="[{name:'选中油品',val:1,}]" select="请选择" v-on:selected="bigItem.oil_type = arguments[0].val" v-bind:search-input="0" v-bind:radio="0"></select-radio>
                                    </template>
                                    <template v-if="bigItem.oil_type == 1">
                                        <template v-if="oil_array.length">
                                            <select-radio class="w200" v-bind:add="checkOilFun(bigItem)" select="请选择" v-on:selected="(bigItem.oil_selected = []),ev_selectOil(arguments[0],bigItem.oil_selected)" type='2' v-bind:model="model"></select-radio>
                                        </template>
                                        <template v-else>
                                            <div class="wcc_selectStation_box"><em>请选择</em></div>
                                        </template>
                                    </template>
                                </div>
                            </div>
                            <div class="ruleContainer_box ruleContainer_box_float ruleContainer_box_float_t">
                                <div class="ruleContainer_block">
                                    <!-- <em class="ruleContainer_block_em">限制类型</em> -->
                                    <select-radio v-bind:add="checkLimitTypeFun(bigItem)" v-bind:radio="bigItem.limit_type-1" v-bind:select="'请选择'" v-on:selected="bigItem.limit_type = arguments[0].val" v-bind:search-input="0" v-bind:model="model"></select-radio>
                                </div>
                            </div>
                            <template v-for="(item,index) in bigItem.condition">
                                <div class="ruleContainer_box">
                                    <div class="ruleContainer_block">
                                        <em v-bind:style="{ opacity : index == 0 ? 1 : 0 }">梯度奖励大于等于&nbsp;&nbsp;</em>
                                        <!-- <em>消费</em> -->
                                        <input class="wcc_input wcc_input_up" type="number" v-on:focus="item.error=false" v-bind:class="{error_mess:item.error}" v-model="item.min_money" v-bind:placeholder="(index * 100).toFixed(2) +''" />
                                        <div class="ruleContainer_center">小于</div>
                                        <input class="wcc_input wcc_input_up_2" type="number" v-on:focus="item.error=false" v-bind:class="{error_mess:item.error}" v-model="item.max_money" v-bind:placeholder="((index * 100) + 100.00).toFixed(2) +''" />
                                        <i>@{{bigItem.limit_type == -1 ? '元/升，' : bigItem.limit_type == 3 ? '升，' : '元，'}}</i>
                                        <template v-if="red_type == 1">
                                            <div class="ruleContainer_text">奖励抵用券</div>
                                            <div class="ruleContainer_buttonAll">
                                                <div class="wcc_btn_thin_bor_ash" v-on:click="ev_selectCoupon({ bigIndex : bigIndex , index : index , obj : item.coupon_select })">抵用券选择</div>
                                            </div>
                                            <div class="has_choose"> 已选择<span>@{{item.coupon_select.length}}</span>种<span>@{{item.coupon_select.total}}</span>张</div>
                                        </template>
                                        <template v-if="red_type == 3">
                                            <div class="ruleContainer_text">分享一个裂变红包</div>
                                            <div class="ruleContainer_buttonAll"  v-if="red_attr.length">
                                                <select-radio v-bind:add="red_attr" class="w172" v-on:seover="mouseoverFun($event)" v-on:seout="mouseoutFun" v-bind:select="red_attr[item.red_Number]|| '请选择裂变红包'"  v-on:selected="red_Fun" :tempkey='item' v-bind:search-input="red_attr.length>5" v-bind:radio='item.red_Number'></select-radio>
                                                <div class="red_details"  v-show="red_details" v-on:mouseover="mouseoverFun($event,'son')" v-on:mouseout="mouseoutFun">
                                                    <template v-if="!red_details_error">
                                                        <template v-if="red_details_data.activity">
                                                            
                                                            <div class="red_details_box clear">
                                                                <span class="red_details_box_left">
                                                                    红包id
                                                                </span>
                                                                <div class="red_details_box_right">@{{red_details_data.activity.id}}</div>
                                                            </div>
                                                            <div class="red_details_box clear">
                                                                <span class="red_details_box_left">
                                                                    红包类型
                                                                </span>
                                                                <div class="red_details_box_right">@{{red_details_data.activity.type == 0 ? '活动类红包' : '奖励类红包'}}</div>
                                                            </div>
                                                            <div class="red_details_box clear">
                                                                <span class="red_details_box_left">
                                                                    红包名字
                                                                </span>
                                                                <div class="red_details_box_right">@{{red_details_data.activity.name}}</div>
                                                            </div>
                                                            <div class="red_details_box clear">
                                                                <span class="red_details_box_left">
                                                                    有效期
                                                                </span>
                                                                <div v-if="red_details_data.type==1 && red_details_data.config_detail && red_details_data.config_detail.extra_time_rule.type == 1" class="red_details_box_right">
                                                                    @{{red_details_data.activity.config_detail.extra_time_rule.value+'天有效'}}
                                                                </div>
                                                                <div v-else class="red_details_box_right">
                                                                    @{{ red_details_data.activity.start_time + ' 至 ' + red_details_data.activity.end_time}}
                                                                </div>

                                                            </div>
                                                            <div class="red_details_box clear">
                                                                <span class="red_details_box_left">
                                                                    红包数量
                                                                </span>
                                                                <div class="red_details_box_right">@{{red_details_data.gift_limit}}</div>
                                                            </div>
                                                            <div class="wcc_table_border clear">
                                                                <table class="wcc_table">
                                                                    <thead>
                                                                        <tr>
                                                                            <td>营销券名称</td>
                                                                            <td>券额</td>
                                                                            <td>发放数量</td>
                                                                            <td>操作</td>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        <tr v-for=" item in red_details_data.coupon_arr">
                                                                            <td>@{{item.coupon_name}}</td>
                                                                            <template  v-if = 'item.price_type == 1' >
                                                                                <td>@{{item.price_rule.price}}</td>
                                                                            
                                                                            </template>
                                                                            <template  v-else-if = 'item.price_type == 3' >
                                                                                <td>@{{item.price_rule.discount}}折</td>
                                                                            </template>
                                                                            <template  v-else-if = 'item.price_type == 5' >
                                                                                <td>@{{item.price_rule.price}}元/升</td>
                                                                            </template>
                                                                            <template  v-else >
                                                                                <td>@{{item.price_rule.min_price + '~' + item.price_rule.max_price}}</td>
                                                                            </template>
                                                                                <td>@{{item.coupon_select_count}}</td>
                                                                                
                                                                            <td><span class="wcc_text_green" v-on:click='coupon_id_Fun(item.coupon_id)'>查看详情</span></td>
                                                                        
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>

                                                        </template>
                                                    </template>
                                                    <div v-else style="text-align: center;"> @{{red_details_error?red_details_error:'正在加载红包详细...'}} </div>
                                                </div>
                                            </div>
                                            <div class="ruleContainer_buttonAll" style="margin-left: 0;margin-right: 0">
                                                没有合适的裂变红包?<a class="wcc_text_green" href="/RedPackage/createRedPackage" target="_blank" v-on:click="show_dialog">去创建</a>
                                            </div>

                                        </template>
                                        <div class="ruleContainer_buttonAll">
                                            <template v-if="bigItem.condition.length < 2">
                                                <div class="ruleContainer_button ruleContainer_button_add" v-on:click="ev_addRewardCondition(bigIndex,index)">添加</div>
                                            </template>
                                            <template v-else-if="bigItem.condition.length > 7">
                                                <div class="ruleContainer_button ruleContainer_button_del" v-on:click="ev_deleteRewardCondition(bigIndex,index)">删除</div>
                                            </template>
                                            <template v-else>
                                                <div class="ruleContainer_button ruleContainer_button_add" v-on:click="ev_addRewardCondition(bigIndex,index)">添加</div>
                                                <div class="ruleContainer_button ruleContainer_button_del" v-on:click="ev_deleteRewardCondition(bigIndex,index)">删除</div>
                                            </template>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                        <template v-if="use_project[0].oil_type == 1">
                            <div class="ruleContainer_function ruleContainer_function_new_position">
                                <!-- <template v-if="use_project.length < 2">
                                    <div class="ruleContainer_function_add" v-on:click="ev_addProject(bigIndex)">添加</div>
                                </template>
                                <template v-else-if="use_project.length > 4">
                                    <div class="ruleContainer_function_del" v-on:click="ev_deleteProject(bigIndex)">删除</div>
                                </template>
                                <template v-else>
                                    <div class="ruleContainer_function_add" v-on:click="ev_addProject(bigIndex)">添加</div>
                                    <div class="ruleContainer_function_del" v-on:click="ev_deleteProject(bigIndex)">删除</div>
                                </template> -->
                                <template v-if="use_project.length > 1">
                                    <div class="ruleContainer_function_del ruleContainer_function_del_new" v-on:click="ev_deleteProject(bigIndex)"><i>&#xe66f;</i></div>
                                </template>
                            </div>
                        </template>
                    </div>
                </template>
                <template v-if="use_project[0].oil_type == 1">
                <template v-if="use_project.length < 4">
                    <div class="ruleContainer_function ruleContainer_function_new">
                        <div class="ruleContainer_function_add ruleContainer_function_add_new" v-on:click="ev_addProject()">添加</div>
                    </div>
                </template>
                </template>
            </div>
        </div>


        <div class="createContainer_lineBox">
            <div class="createContainer_lineBox_left"><span>*</span>场景限制</div>
            <div class="createContainer_lineBox_right">
                <label class="wcc_label">
                    <input type="radio" name="user_type" checked="checked" value="1" v-model="user_type" :checked="user_type==1">
                    <span class="wcc_label_radio"><i></i></span>
                    <span class='text'>不限制</span>
                </label>
                <label class="wcc_label">
                    <input type="radio" name="user_type" value="2" v-model="user_type" :checked="user_type==2">
                    <span class="wcc_label_radio"><i></i></span>
                    <span class='text'>仅限无感支付场景</span>
                </label>
            </div>
        </div>

        <div class="createContainer_lineBox">
            <div class="createContainer_lineBox_left"><span>*</span>身份限制</div>
            <div class="createContainer_lineBox_right">
                <label class="wcc_label">
                    <input type="radio" name="rule_type" checked="checked" value="0" v-model="identify_type" :checked="identify_type==0">
                    <span class="wcc_label_radio"><i></i></span>
                    <span class='text'>不限制</span>
                </label>
                <label class="wcc_label">
                    <input type="radio" name="rule_type" value="1" v-model="identify_type" :checked="identify_type==1">
                    <span class="wcc_label_radio"><i></i></span>
                    <span class='text'>含以下身份可返券</span>
                </label>
                <label class="wcc_label">
                    <input type="radio" name="rule_type" value="2" v-model="identify_type" :checked="identify_type==2">
                    <span class="wcc_label_radio"><i></i></span>
                    <span class='text'>含以下身份不可返券</span>
                </label>
                <label class="wcc_label">
                    <input type="radio" name="rule_type" value="3" v-model="identify_type" :checked="identify_type==3">
                    <span class="wcc_label_radio"><i></i></span>
                    <span class='text'>仅新用户可返券</span>
                </label>
            </div>
        </div>

        <div v-if="plate_limit_show == 1 && identify_type == 3" class="createContainer_lineBox">
            <div class="createContainer_lineBox_left"><span>*</span></div>
            <div class="createContainer_lineBox_right">
                <span style="margin-right: 15px">是否校验车牌</span>
                <label class="wcc_label">
                    <input type="radio" name="plate_limit"  value="1" v-model="plate_limit" :checked="plate_limit==1">
                    <span class="wcc_label_radio"><i></i></span>
                    <span class='text'>是</span>
                </label>
                <label class="wcc_label">
                    <input type="radio" name="plate_limit" value="0" v-model="plate_limit" :checked="plate_limit==0">
                    <span class="wcc_label_radio"><i></i></span>
                    <span class='text'>否</span>
                </label>
            </div>
        </div>

        @if($driver_types)
            <div class="unit_box clear sign unit_box_clear unit_box_new" id="identify_box" v-show="show_box">
                <!-- <div class="lf_box">认证身份</div> -->
                <div class="rt_box">
                    @foreach($driver_types as $driver_type)
                        <label class="fixed_label"><input type="checkbox" name="identify" value="{{ $driver_type->sub_type_id }}"><div class="wcc_checkbox_y"><span>&#xe67d;</span></div><span>{{ $driver_type->sub_type_name }}</span></label>
                    @endforeach
                </div>
            </div>
        @endif

        @if ($levels)
            <div class="unit_box clear sign unit_box_clear unit_box_new" id="level_box" v-show="show_box">
                <!-- <div class="lf_box">等级身份</div> -->
                <div class="rt_box">
                    @foreach($levels as $level)
                        <label class="fixed_label"><input type="checkbox" name="level" value="{{ $level->id }}"><div class="wcc_checkbox_y"><span>&#xe67d;</span></div><span>{{ $level->level_name }}</span></label>
                    @endforeach
                </div>
            </div>
        @endif

        @if ($levels || $driver_types)
            <div class="unit_box clear sign unit_box_clear unit_box_new" id="des_box" v-show="show_box">
                <!-- <div class="lf_box">等级身份</div> -->
                <div class="rt_box">
                    <div class="oil_state">以上身份只需满足其中一个，限制类型就会生效。</div>
                </div>
            </div>
        @endif


        <div class="createContainer_lineBox">
            <div class="createContainer_lineBox_left"><span>*</span>奖励限制</div>
            <div class="createContainer_lineBox_right">
                <em>用户每日最多可获得</em>
                <input style="width:15%;margin:0 10px;text-align:center;" v-on:focus="error_obj.count_day_number=false" v-bind:class="{error_mess:error_obj.count_day_number}" class="createContainer_lineBox_input wcc_input" type="number" max="999" placeholder="整数" v-on:keydown="ev_numberInputLimit($event,true)" v-model=" count_day_number"  v-on:input="count_day_number = count_day_number>999? 999 : count_day_number;" value="count_day_number" />
                <em>次奖励，本次活动最多可获得</em>
                <input style="width:15%;margin:0 10px;text-align:center;" v-on:focus="error_obj.count_number=false" v-bind:class="{error_mess:error_obj.count_number}" class="createContainer_lineBox_input wcc_input" type="number" max="999" placeholder="整数" v-on:keydown="ev_numberInputLimit($event,true)" v-model=" count_number"  v-on:input="count_number = count_number>999? 999 : count_number;" value="count_number" />
                <em>次奖励</em>
            </div>
        </div>

        <div class="createContainer_lineBox">
            <div class="createContainer_lineBox_left"><span>*</span>是否通知</div>
            <div class="createContainer_lineBox_right">
                <!-- <select-radio v-bind:add="notice_type_arr" select="请选择" v-on:selected="ev_selectNotice" v-bind:search-input="0" v-bind:radio="0"></select-radio> -->
                <span><span class="on-off" v-bind:class="{off:!notice_type}" v-on:click="ev_selectNotice"><span class="circle" v-bind:class="{off:!notice_type}"></span></span></span>
            </div>
            <template v-if="notice_type == 1">
            <!-- <div class="createContainer_lineBox" isauto="1">
                    <div class="createContainer_lineBox_left">短信内容</div>
                    <div class="createContainer_lineBox_right" isblock="1">
                        <textarea class="wcc_textarea" v-model="notice_html"></textarea>
                        <div style="color:red;font-size:12px;margin-top:2px;">*建议在30字以内</div>
                    </div>
                </div> -->
                <div class="prompt_mew">
                    ...
                    <div class="prompt_new_content wcc_tips_right" v-if="red_type==1">
                        感谢您在{油站地址}消费,送给您营销券专享福利，详情请在公众号-个人中心中查看
                    </div>
                    <div class="prompt_new_content wcc_tips_right" v-if="red_type==3">
                        感谢您在{油站名字}加油,送给您一个红包，更多详情请关注{油站名字}公众号。
                    </div>
                </div>
            </template>
        </div>
        <div class="createContainer_lineBox">
            <div class="createContainer_lineBox_left">与券优惠是否同享</div>
            <div class="createContainer_lineBox_right">
                <el-radio-group v-model="is_mutx_coupon">
                    <el-radio :label="COUPON_SHARE.YES">同享</el-radio>
                    <el-radio :label="COUPON_SHARE.NO">不同享</el-radio>
                </el-radio-group>
            </div>
        </div>
        <div class="createContainer_lineBox">
            <div class="createContainer_lineBox_left">与其他优惠是否同享</div>
            <div class="createContainer_lineBox_right">
                <el-radio-group v-model="is_mutx_discount">
                    <el-radio :label="COUPON_SHARE.YES">同享</el-radio>
                    <el-radio :label="COUPON_SHARE.NO">不同享</el-radio>
                </el-radio-group>
            </div>
        </div>
        <div class="createContainer_lineBox" style="margin-top:50px;">
            <div class="submitButton wcc_btn_fat_green" v-on:click="ev_submit" style="margin-left:140px;">创建</div>
        </div>
    </div>
@endsection


@section('elastic')
    <div class="couponSelectContainer" id="couponSelect" style="display:none" v-show="show">
        <div class="couponSelectContainer_box">
            <div class="couponSelectContainer_title">
                <em>抵用劵设置</em>
                <div class="couponSelectContainer_close" v-on:click="show = 0,ev_hoveroutCoupon()">×</div>
            </div>
            <el-input
                    v-model="coupon_name"
                    style="width: 300px; margin: 1rem 1rem 0 1rem;"
                    placeholder="请输入券名称">
                <i slot="suffix" @click="search_coupon" class="el-input__icon el-icon-search"></i>
            </el-input>
            <div class="couponSelectContainer_content">
                <div class="couponSelectContainer_content_list">
                    <template if="coupon_array.length" v-for="(item,key) in coupon_array">
                        <div class="couponSelectContainer_content_list_box" v-on:mouseenter.stop="ev_hoverCoupon($event,item,key)" >
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
                <div class="wcc_btn_fat_green" v-on:click="show = 0">确定</div>
            </div>
        </div>
    </div>
@endsection


@section('footer')
    <script>
        var is_group={!! json_encode($is_group) !!};
        var station_list={!! json_encode($station_list) !!};
        var station_list_arr=[];
        var driver_types = {!! json_encode($driver_types) !!};
        var levels = {!! json_encode($levels) !!};
        if(Object.prototype.toString.call(station_list)==='[object Object]'){
            for(var key in station_list){
                station_list_arr.push({name:station_list[key].stname,id:station_list[key].stid});
            }
        }
        var plate_limit_show={!! json_encode($plate_limit_show) !!};
        console.log('plate_limit_show',plate_limit_show);
    </script>
    <script src="/js/wcc-element-ui/vue.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/wcc-element-ui/index.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/wecar.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/vue_component.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/dayjs.min.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/RefuelAward/RefuelAward.js?v={{config('constants.wcc_file_version')}}"></script>
@endsection
