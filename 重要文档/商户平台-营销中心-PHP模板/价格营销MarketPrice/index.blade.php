@extends('layout/master')

@section('header')
<link rel="stylesheet" href="/css/common/common.css?v={{config('constants.wcc_file_version')}}">
<link rel="stylesheet" href="/css/wecar.css?v={{config('constants.wcc_file_version')}}">
<link rel="stylesheet" href="/css/MarketPrice/index.css?v={{config('constants.wcc_file_version')}}">
<style>
    [v-cloak]{
        display: none
    }
</style>
@endsection

@section('content')

<div class="page-body channel-body" id="page-body" v-cloak>
    <div class="page-content">
        <div class="page-head" style="height: 40px; margin-bottom: 20px; border-bottom: 1px solid #eaeaea; font-weight: 600;">
            优惠策略列表
        </div>
        <div class="channel_ul channel_status">
            <div style="display: inline-block;line-height: 28px;vertical-align: top; font-weight: 600">策略状态</div>
            <ul style="display: inline-block;vertical-align: top; margin-left: 20px;">
                <li class="active" val="1" title="生效中"><span>生效中</span></li>
                <li val="3"  title="计划生效"><span>计划生效</span></li>
                <li val="2"  title="已过期"><span>已过期</span></li>
            </ul>
            <div class="channel_more" item-show="0">
                <a>更多</a>
            </div>
        </div>
        @if($mch_type == 2)
            <div class="channel_ul channelInfo" id="channel_gas" style="margin-bottom: 15px;">
                <div style="display: inline-block;line-height: 28px;vertical-align: top; font-weight: 600">优惠油站</div>
                <div class="channel_div" style="display: inline-block; margin-left: 20px;">
                    <ul class="channel_li_ul">
                        <li class="all active" val="-1" title="全部"><span>全部</span></li>
                        <li v-for="(item, index) in gasLists" class="channel_li" :data-index="index" v-if="index < INDEXONE" :title="item.stname"><span>@{{item.stname}}</span></li>
                    </ul>
                    <ul class="channel_li_ul ul_hide">
                        <li v-for="(item, index) in gasLists" class="channel_li" :data-index="index" v-if="index >= INDEXONE" :title="item.stname"><span>@{{item.stname}}</span></li>
                    </ul>
                </div>
                <div class="channel_more" item-show="0">
                    <a>更多</a>
                </div>
            </div>
        @endif
        <div class="channel_ul channelInfo" id="channel_type" style="margin-bottom: 15px;">
            <div style="display: inline-block;line-height: 28px;vertical-align: top; font-weight: 600">优惠类型</div>
            <div class="channel_div" style="display: inline-block; margin-left: 20px;">
                <ul class="channel_li_ul" >
                    <li class="all active" val="-1" title="全部"><span>全部</span></li>
                    <li v-for="(item, index) in channelAll" class="channel_li" :data-index="index" v-if="index < INDEXTOW"  :title="item.name"><span>@{{item.name}}</span></li>
                </ul>
                <ul class="channel_li_ul ul_hide">
                    <li v-for="(item, index) in channelAll" class="channel_li" :data-index="index" v-if="index >= INDEXTOW"  :title="item.name"><span>@{{item.name}}</span></li>
                </ul>
            </div>
            <div class="channel_more" item-show="0">
                <a>更多</a>
            </div>
        </div>
    </div>

    <div class="common_content">
        <div class="common_header" id="channelEdit">
            <div class="edit_div">
                <input type="checkbox" name="checkAll" style="position: relative;z-index: 1;width: 17px;height:17px;opacity: 0; left: 0px;top: 4px">
                <div class="wcc_checkbox_y"><span></span></div>
                <span style="line-height:30px;margin-left: 10px;" id="checkAllS">全选</span>
                <span href="javascript:;" class="c_btn wc-disabled" id="editChannelDate">修改策略时间</span>
                <span href="javascript:;" class="c_btn wc-disabled" id="editChannelDel">删除</span>
            </div>
        </div>
        <div class="common_body" id="tableContent">
            <table class="wrapper_table" width="100%" id="wrapper_table" cellpadding="0" cellspacing="0">
                <thead>
                <tr>
                    <th style="width: 20px;"></th>
                    <th style="width: 80px;">优惠类型</th>
                    <th style="width: 40px;">重复类型</th>
                    <th style="width: 100px">重复时段</th>
                    <!-- <th style="width: 170px">优惠油品</th> -->
                    <th style="width: 170px">优惠油品、优惠限制及价格</th>
                    @if($mch_type==2)
                    <th style="width: 100px">优惠油站</th>
                    @endif
                    <th  style="width: 100px">优惠时间</th>
                    <template v-if="is_show_limit == 1">
                        <th  style="width: 100px">参与资格</th>
                        <th  style="width: 100px">优惠限制</th>
                    </template>


                    <th v-show="status!=3"  style="width: 120px">操作</th>
                    
                    
                </tr>
                </thead>
                <tbody>
                    <tr class="item-tr" v-for="(list, index) in tableList"   :class="(index%2)? 'tr_bg ' : ''">
                        
                        <td v-if="list.a_isMerge" :rowspan = "list.a_merge">
                            <div class="input_div input_div_all">
                                <input  data-type="channel"  :data_id="list.type_id" :data_index="list.aIndex" type="checkbox" :data_start="list.valid_start_time" :data_end="list.valid_end_time" name="rule_all[]" class="js_info">
                                <div class="wcc_checkbox_s"><span></span></div>
                            </div>
                        </td>


                        <td v-if="list.b_isMerge" :rowspan = "list.b_merge" >
                            <div class="input_div twoSelect">
                                <input :data_nums="list.a_num"  :data_index="list.aIndex" :data_type="list.type" :data_gas="list.oilstation_info_list.length" :data_type_id="list.type_id"  :data_parent_name="list.type_name" :data_sub_name="list.sub_type_name"  :data_start="list.valid_start_time" :data_end="list.valid_end_time" type="checkbox" name="rule_id[]" :data_rule_id="list.rule_id_list"  style="left: -33%;">
                                <div class="wcc_checkbox_y"><span></span></div>
                                <div class="lists_value">
                                    <p><span>@{{list.type_name}}</span></p>
                                    <p><span>· @{{list.sub_type_name}}</span</p>
                                </div>
                            </div>
                            <p style="display:none" class="border_show_gas" v-for="item in list.oilstation_info_list" :data_gas_id="item.stid"></p>
                        </td>
                        <td  v-if="list.b_isMerge" :rowspan = "list.b_merge" class="item-height">
                             @{{list.date_type}}
                        </td>
                        <td class="item-height">
                                <span v-if='list.date_type_desc =="每周"'>
                                    @{{list.date_desc}}
                                </span>
                                <span v-else-if='list.date_type_desc =="每月"'>
                                    @{{list.date_desc}}
                                </span>
                                <span v-else>
                                    @{{list.date_type_desc}}
                                </span>
                                <br/><br/>
                                <span>
                                    @{{list.start_time}}-@{{list.end_time}}
                                </span>
                        </td>
                        <td>
                            <p v-for="(i,index) in list.data" :key="index" class="price-box">
                                <span style="width:100px">@{{i.oil_name}}</span>
                                <span style="margin-left:15px">
                                    <span style="text-align: left;padding-bottom: 10px;" v-for="j in i.discount">@{{j.sale_desc}}</span>
                                </span>
                            </p>
                        </td>
                        <!-- <td>
                            <p v-for="i in list.data">@{{i.sale_desc}}</p>
                        </td> -->
                        @if($mch_type==2)
                        <td v-if="list.a_isMerge" :rowspan = "list.a_merge">
                            <p class="border_none_gas" v-for="item in list.oilstation_info_list" :data_gas_id="item.stid">@{{item.stname}}</p>
                        </td>
                        @endif
                        <td v-if="list.a_isMerge" :rowspan = "list.a_merge">
                            <p class="border_none_time"></span>@{{list.valid_start_time}}至@{{list.valid_end_time}}</p>
                        </td>
                        <template v-if="is_show_limit == 1">
                            <td v-if="list.a_isMerge" :rowspan="list.a_merge">
                                <p class="border_none_time"></span>@{{list.if_newuser == 1 ? '新用户' : '无限制'}}</p>
                            </td>
                            <td v-if="list.a_isMerge" :rowspan="list.a_merge">
                                <p class="border_none_time" v-if="list.daily_limit || list.times_limit"></span>
                                    每日最多优惠@{{list.daily_limit}}次，活动期间最多优惠@{{list.times_limit}}次</p>
                                <p class="border_none_time" v-else></span>无限制</p>
                            </td>
                        </template>
                        <td v-if="list.a_isMerge && status!=3" :rowspan = "list.a_merge">                 <span @click="copy(list.aIndex)"  class="c_btn" >复制优惠策略</span>
                        </td>
                        
                    </tr>
                </tbody>
            </table>


         
        </div>
    </div>
    <div class="page_default_one" id="page_data" v-show="isTo">
        <div class="page_bg">
        </div>
    </div>
        {{--<div class="page_default_one">--}}
            {{--<div class="page_bg">--}}
            {{--</div>--}}
            {{--<div class="page_title" id="page_add_one">--}}
                {{--<a href="/MarketPrice/create">新增</a>--}}
            {{--</div>--}}
        {{--</div>--}}
                    <!-- 全局外层loading -->
   <wcc-loading v-show="isLoadingShow"></wcc-loading>
</div>

<script type="text/html" id="editChannelTpl">
    <div class="rule-form-body edit_channel_date">
        <form class="form-horizontal editDateTime" role="form">
            <div class="form-line" style="text-align: left" v-show="isShow">
                <div class="form-label" style="vertical-align: top; width: 120px">已选中#gasNumber#个油站</div>
                <div class="input-div">
                    <ul>
                        #gasHtml#
                    </ul>
                </div>
            </div>
            <div class="form-line" style="text-align: left">
                <div class="form-label" style="vertical-align: top; width: 120px">已选中#cnt#条优惠</div>
                {{--<div class="input-div">--}}
                        {{--#channel#--}}
                {{--</div>--}}
            </div>

            <div class="form-line form_start" style="display: none; text-align: left">
                <div class="form-label" style="width: 120px">修改开始时间</div>
                <div class="input-div" style="width: 155px">
                    <input name="start_time" type="text" class="input-text">
                </div>
                <div class="time_desc" id="startTimeCl" style="float: inherit; ">若开始时间小于当前时间，表示立即开始</div>
            </div>

            <div class="form-line"  style="text-align: left">
                <div class="form-label" style="width: 120px">修改结束时间</div>
                <div class="input-div" style="width: 155px">
                    <input name="end_time" type="text" class="input-text">
                </div>
                <div class="time_desc" id="endTimeCl"  style="float: inherit;">结束时间必须大于当前时间，设置时建议预留操作时间</div>
            </div>
        </form>
    </div>
</script>
<script type="text/html" id="editChannelTplS">
    <div class="rule-form-body edit_channel_date">
        <form class="form-horizontal editDateTime" role="form" style="margin-left: 60px;">
            <div class="form-line" style="text-align: left">
                <div class="form-label" style="vertical-align: top; width: 120px">已选中#cnt#条优惠</div>
                {{--<div class="input-div">--}}
                    {{--#channel#--}}
                {{--</div>--}}
            </div>
            <div class="form-line form_start" style="display: none; text-align: left">
                <div class="form-label" style="width: 120px">修改开始时间</div>
                <div class="input-div" style="width: 155px">
                    <input name="start_time" type="text" class="input-text">
                </div>
                <div class="time_desc" id="startTimeCl" style="float: inherit; ">若开始时间小于当前时间，表示立即开始</div>
            </div>

            <div class="form-line"  style="text-align: left">
                <div class="form-label" style="width: 120px">修改结束时间</div>
                <div class="input-div" style="width: 155px">
                    <input name="end_time" type="text" class="input-text">
                </div>
                <div class="time_desc" id="endTimeCl"  style="float: inherit;">结束时间必须大于当前时间，设置时建议预留操作时间</div>
            </div>
        </form>

    </div>
</script>
<script type="text/html" id="authAdminTpl">
    <div class="page-html auth-admin">
        <div class="desc"><span class="alert-msg">向以下人员发送验证码#name#验证通过后15分钟内操作无需验证</span></div>
        <form class="form-horizontal" role="form">
            <div class="form-line">
                <div class="input-div">
                    <input type="tel" class="input-text" autocomplete="off" name="phone-code" maxlength="6" placeholder="请输入验证码"/>
                    <span class="wecar-btn wecar-code" style="border: none;">获取验证码</span>
                </div>
            </div>
        </form>
    </div>
</script>
@endsection

@section('footer')
<script>
    var dataList =  {!!json_encode($channel_detail)!!}
    var _CHANNEL = {!!json_encode($all_channel)!!}; //生效的
    var  gasLists = {!!json_encode($group_station_list)!!}; // 油站列表
    var mch_type = '{{$mch_type}}';
    var mch_id = '{{$mch_id}}';
    var _T = '{{$has}}';
    var is_show_limit = '{{$is_show_limit}}'; // 灰度值（0 隐藏 1 显示），针对 参与资格、优惠限制

</script>
<script src="/js/wecar.js?v={{config('constants.wcc_file_version')}}"></script>
<script src="/js/vue_component.js?v={{config('constants.wcc_file_version')}}"></script>
<script src="/js/MarketPrice/show.js?v={{config('constants.wcc_file_version')}}"></script>
@endsection
