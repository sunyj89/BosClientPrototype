@extends('layout/master') @section('header')
    <link rel="stylesheet" href="/css/common/common.css?v={{config('constants.wcc_file_version')}}">
    <link rel="stylesheet" href="/css/wecar.css?v={{config('constants.wcc_file_version')}}">
    <link rel="stylesheet" href="/css/wcc.css?v={{config('constants.wcc_file_version')}}" />
    <link rel="stylesheet" href="/css/MarketPrice/set.css?v={{config('constants.wcc_file_version')}}"> @endsection @section('content')
    <div class="page-body channel-body" id="page-body">
        {{--<div class="channel_ul">--}}
            {{--<ul class="clear" id="ul_li">--}}
                {{--<li class="active" data-val="1"><span>优惠限制设置</span></li>--}}
                {{--<li data-val="1"><span>优惠优先级设置</span></li>--}}
            {{--</ul>--}}
        {{--</div>--}}
            <div class="page_content">
                {{--<div class="page_one" id="page_one">--}}
                    {{--@if($mch_type == 2)--}}
                        {{--<div class="channel_status" id="channel_gas" style="margin-bottom: 15px;">--}}
                            {{--<div style="display: inline-block;line-height: 60px;vertical-align: top;">优惠油站</div>--}}
                            {{--<ul class="clear" style="display: inline-block;vertical-align: top;width: 1200px">--}}
                                {{--<li class="all active" val="-1"><span>全部</span></li>--}}
                                {{--@foreach($group_station_list as $key=>$val)--}}
                                    {{--<li class="channel_li" data-index="{{$key}}"><span>{{$val['stname']}}</span></li>--}}
                                {{--@endforeach--}}
                            {{--</ul>--}}
                        {{--</div>--}}
                    {{--@endif--}}
                    {{--<div class="channel_status" id="channel_c">--}}
                        {{--<div style="display: inline-block;line-height: 60px;vertical-align: top;">优惠类型</div>--}}
                        {{--<ul class="clear" style="display: inline-block;vertical-align: top;width: 1200px">--}}
                            {{--<li class="all active" val="-1"><span>全部</span></li>--}}
                            {{--@foreach($all_channel as $key=>$val)--}}
                                {{--<li class="channel_li" data-index="{{$key}}"><span>{{$val['name']}}</span></li>--}}
                            {{--@endforeach--}}
                        {{--</ul>--}}
                    {{--</div>--}}
                    {{--<div class="newAdd" id="newAddOne">新增</div>--}}
                    {{--<div class="page_table_container">--}}
                        {{--<table class="wcc_table activity-table activity_table">--}}
                            {{--<thead>--}}
                            {{--<tr>--}}
                                {{--<th>优惠类型</th>--}}
                                {{--<th>优惠油站</th>--}}
                                {{--<th>优惠门槛</th>--}}
                                {{--<th>限制次数</th>--}}
                                {{--<th>操作</th>--}}
                            {{--</tr>--}}
                            {{--</thead>--}}
                            {{--<tbody>--}}
                            {{--<tr v-for="item in list_data">--}}
                                {{--<td>--}}
                                    {{--<p class="channel_name">@{{item.type_name}}</p>--}}
                                    {{--<p class="channel_children">@{{item.sub_type_name}}</p>--}}
                                {{--</td>--}}
                                {{--<td>--}}
                                    {{--<p v-for="list in item.oilstation_info_list">@{{list.stname}}</p>--}}
                                {{--</td>--}}
                                {{--<td>--}}
                                    {{--<p v-for="im in item.oil_info">@{{im.limit_desc}}</p>--}}
                                {{--</td>--}}
                                {{--<td>--}}
                                    {{--<p v-for="i in item.limit_count">@{{i.limit_desc}}</p>--}}
                                {{--<td>--}}
                                    {{--<a class="wcc_text_green td_detail" href="javascript:;" :data_channel_name="item.type_name" :data_rule_name="item.sub_type_name" :data_rule_id="item.type_id" :data_gas_num="item.oilstation_info_list.length">修改</a>--}}
                                    {{--<a class="wcc_text_green td_del" href="javascript:;">删除</a>--}}
                                {{--</td>--}}
                            {{--</tr>--}}
                            {{--</tbody>--}}
                        {{--</table>--}}
                    {{--</div>--}}
                {{--</div>--}}
                <div class="page_tow" id="page_tow">
                    @if($mch_type == 2 && $list_data && $has_priv_all == 0)
                    <div class="newAdd" id="newAddTow">新增</div>
                    @endif
                    <div class="page_table_container">
                        @if($list_data)
                        <table class="wcc_table activity-table activity_table">
                            <thead>
                            <tr>
                                <th>油站名称</th>
                                <th>优惠类型</th>
                                <th>优先级</th>
                                <th>操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            @foreach($list_data as $v)
                            <tr>
                                <td>
                                    @foreach($v["ostn_info_list"] as $i)
                                    <p data-id='{{$i["stid"]}}'>{{$i["stname"]}}</p>
                                    @endforeach
                                </td>
                                <td>
                                    @foreach($v["channel_codes"] as $i)
                                    <p data-id='{{$i["channel_code"]}}'>{{$i["channel_code_desc"]}}</p>
                                    @endforeach
                                </td>
                                <td>
                                    @foreach($v["sort"] as $i)
                                        <p data-id="{{$i}}">{{$i}}</p>
                                    @endforeach
                                </td>
                                <td width="300">
                                    @if($v["merchant_type"] == 2 && $mch_type == 1)
                                    <a class="wcc_text_green td_disabled_left" href="javascript:;" style="margin-right: 60px;">修改</a>
                                    <a class="wcc_text_green td_disabled_right" href="javascript:;">删除</a>
                                    @else
                                    <a class="wcc_text_green td_detail" href="javascript:;" style="margin-right: 60px;" data-region='{{$v["region_rule_id"]}}' data-mechant_type='{{$v["merchant_type"]}}' data-mechant_id='{{$v["merchant_id"]}}'>修改</a>
                                    <a class="wcc_text_green td_del" href="javascript:;" data-region='{{$v["region_rule_id"]}}'>删除</a>
                                    @endif
                                </td>
                            </tr>
                            @endforeach
                            </tbody>
                        </table>
                        @endif
                    </div>
                </div>
            </div>
            {{--<div class="page_default_one" id="page_default_one">--}}
                {{--<div class="page_bg">--}}
                {{--</div>--}}
                {{--<div class="page_title" id="page_add_one">--}}
                    {{--新增--}}
                {{--</div>--}}
            {{--</div>--}}
            @if(!$list_data)
            <div class="page_default_tow" id="page_default_tow">
                <div class="page_bg">
                </div>
                <div class="page_title" id="newAddTow">
                    新增
                </div>
            </div>
            @endif
        <!--门槛弹出层-->
    <script type="text/html" id="addMk">
        <div class="lists_li_three">
            <div class="input-line input-body">
                <div class="create-select">
                    <div class="c-s-value"><span>请选择油号</span></div>
                    <div class="c-s-options">
                        <ul class="tree-ul">
                        </ul>
                    </div>
                </div>
            </div>
            <div class="input-line input-body channelPrice">
                <div class="create-select" style="width: 90px;">
                    <div class="c-s-value"><span>原价</span></div>
                    <div class="c-s-options" style="width: 90px;overflow: hidden;">
                        <ul class="tree-ul">
                            <li class="item-li" data_val="1">原价</li>
                            <li class="item-li" data_val="2">升数</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="input-line">
                <div class="create_price">
                    <span>满</span>
                    <input class="create-input">
                    <span>元/升</span>
                </div>
            </div>
            <div class="input-line">
                <span class="repeat-type-del" data_type="1"></span>
            </div>
        </div>
    </script>
        <!--次数重复-->
    <script type="text/html" id="addCs" >
        <div class="lists_li_four">
            <div class="input-line input-body">
                <div class="create-select">
                    <div class="c-s-value"><span>请选择</span></div>
                    <div class="c-s-options">
                        <ul class="tree-ul">
                        </ul>
                    </div>
                </div>
            </div>
            <div class="input-line">
                <div class="create_price">
                    <input class="create-input">
                    <span>次</span>
                </div>
            </div>
            <div  class="input-line">
                <span class="repeat-type-del" data_type="2"></span>
            </div>
        </div>
    </script>
        <!--限制弹出层-->
    <script type="text/html" id="addNewLimit">
        <div class="form-items clear">
            <div class="input-line common-title">选择优惠油站</div>
            <div class="input-line input-body" id="channelGas">
                <div class="create-select">
                    <div class="c-s-Gas-value"><span>请选择油站</span></div>
                    <div class="c-s-options">
                        <div class="tree-head head-active">
                            <input name="gas_check_all[]" type="checkbox" class="tree-box">
                            <div class="wcc_checkbox_y"> <span></span></div><span class="tree-title parent-has tree-open">全选</span></div>
                            <ul class="tree-ul">
                                {{--@foreach($group_station_list as $v)--}}
                                    {{--<li class="tree-li">--}}
                                        {{--<div class="tree-head">--}}
                                            {{--<input name="gas[]" type="checkbox" value="{{$v['stid']}}" class="tree-box">--}}
                                            {{--<div class="wcc_checkbox_y"><span></span></div>--}}
                                            {{--<span class="tree-title">{{$v['stname']}}</span></div>--}}
                                    {{--</li>--}}
                                {{--@endforeach--}}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-line closest-oil" style="display: none"></div>
            <div class="clear-fix"></div>
        </div>
        <div class="form-items clear">
            <div class="input-line common-title">选择优惠类型</div>
            <div class="input-line input-body" id="channelType">
                <div class="create-select">
                    <div class="c-s-value"><span>请选择要添加的优惠类型</span></div>
                    <div class="c-s-options">
                        <ul class="tree-ul">
                        </ul>
                    </div>
                </div>
            </div>
            <div class="clear-fix"></div>
        </div>
        {{--优惠门槛--}}
        <div class="form-items clear">
            <div class="input-line common-title">设置优惠门槛</div>
            <div class="lists_li_One">
                <div class="lists_li_three">
                    <div class="input-line input-body"  id="channelOil">
                        <div class="create-select">
                            <div class="c-s-value"><span>请选择油号</span></div>
                            <div class="c-s-options">
                                <ul class="tree-ul">
                                    {{--@foreach($station_oil_info as $val)--}}
                                        {{--<li class="tree-li tree-li-0">--}}
                                            {{--<div class="tree-head">--}}
                                                {{--<i class="tree-icon tree-open"></i>--}}
                                                {{--<input name="oil[]" type="checkbox" class="tree-box" value="0">--}}
                                                {{--<div class="wcc_checkbox_y"><span></span></div>--}}
                                                {{--<span class="tree-title parent-has tree-open">{{$val['name']}}</span>--}}
                                            {{--</div>--}}
                                            {{--@if ($val['parent_arr'])--}}
                                                {{--<ul class="tree-ul parent-ul">--}}
                                                    {{--@foreach($val['parent_arr'] as $v)--}}
                                                        {{--<li class="tree-li">--}}
                                                            {{--<div class="tree-head">--}}
                                                                {{--<input name="oil[]" type="checkbox" value="{{$v['oil_id']}}" class="tree-box">--}}
                                                                {{--<div class="wcc_checkbox_y"><span></span></div>--}}
                                                                {{--<span class="tree-title">{{$v['name']}}</span></div>--}}
                                                        {{--</li>--}}
                                                    {{--@endforeach--}}
                                                {{--</ul>--}}
                                            {{--@endif--}}
                                        {{--</li>--}}
                                    {{--@endforeach--}}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="input-line input-body  channelPrice">
                        <div class="create-select" style="width: 90px;">
                            <div class="c-s-value"><span>原价</span></div>
                            <div class="c-s-options" style="width: 90px;overflow: hidden;">
                                <ul class="tree-ul">
                                    <li class="item-li" data_val="1">原价</li>
                                    <li class="item-li" data_val="2">升数</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="input-line">
                        <div class="create_price">
                            <span>满</span>
                            <input class="create-input">
                            <span>元/升</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="task_layer_tel_add repeat-add-one" data-type="1">添加</div>
        </div>
        {{--优惠次数限制--}}
        <div class="form-items clear">
            <div class="input-line common-title">设置次数限制</div>
            <div class="lists_li_Tow">
                <div class="lists_li_four">
                    <div class="input-line input-body">
                        <div class="create-select">
                            <div class="c-s-value"><span>请选择</span></div>
                            <div class="c-s-options" style="overflow: hidden;">
                                <ul class="tree-ul">
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="input-line">
                        <div class="create_price">
                            <input class="create-input">
                            <span>次</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="task_layer_tel_add repeat-add-tow" data-type="2">添加</div>
        </div>
    </script>
        <!--优先级弹出层-->
    <script type="text/html" id="addNewPriority">
        <div class="addNew">
            <div class="form-items clear" id="gasShow">
                <div class="input-line common-title">选择优惠油站</div>
                <div class="input-line input-body" id="channelGas">
                    <div class="create-select">
                        <div class="c-s-Gas-value"><span>请选择油站</span></div>
                        <div class="c-s-options">
                            <div class="tree-head head-active">
                                <input name="gas_check_all[]" type="checkbox" class="tree-box">
                                @if($has_priv_all == 1)
                                <div class="wcc_checkbox_y c_disabled"> <span></span></div><span class="tree-title parent-has tree-open">全选</span></div>
                                @else
                                <div class="wcc_checkbox_y"> <span></span></div><span class="tree-title parent-has tree-open">全选</span></div>
                                @endif
                                <ul class="tree-ul">
                                    @foreach($group_station_list as $v)
                                        <li class="tree-li">
                                            <div class="tree-head">
                                                @if ($v['has_priv'] == 1)
                                                <input name="gas[]" type="checkbox" value="{{$v['stid']}}" class="tree-box" disabled>
                                                <div class="wcc_checkbox_y c_disabled"><span></span></div>
                                                    <span class="tree-title c_span">{{$v['stname']}}</span>
                                                @else
                                                <input name="gas[]" type="checkbox" value="{{$v['stid']}}" class="tree-box">
                                                <div class="wcc_checkbox_y"><span></span></div>
                                                <span class="tree-title">{{$v['stname']}}</span>
                                                @endif
                                            </div>
                                            @if ($v['has_priv'] == 1)
                                            <div class="tree-info">
                                                <i class="tree-warning common_alert_hover"><span class="common_alert_title"></span></i>
                                            </div>
                                            @endif
                                        </li>
                                    @endforeach
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-items clear">
                <div class="input-line common-title">
                    <p>优先级排序</p>
                    <p class="input-p">通过拖拽右侧优惠名称可调整优先级</p>
                </div>
                <div class="input-line" style="margin-left: 35px;border: 1px solid #eaeaea;min-height: 40px;min-width: 222px;">
                    <div class="lists_left">
                        <ul class="lists_ul_left" id="lists_ul_left">
                        </ul>
                    </div>
                    <div class="lists_right">
                        <div class="mpPublic_GlobalLoading" id="rangeLoadingss" style="display: none;">
                            <div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </div>
                        <ul id="lists_ul_right">
                        </ul>
                    </div>
                </div>
            </div>
            <div class="form-item clear" style="margin-left: 107px;color: #999999;">
                设置优惠优先级后，当优惠相同时，将优先享受优先级高的优惠
            </div>
        </div>
    </script>
        <!--修改优先级弹出层-->
    <script type="text/html" id="editChannePriority">
            <div class="rule-form-body edit_channel_date">
                <form class="form-horizontal editDateTime" role="form" style="margin-left: 60px;">
                    <div class="form-line" style="text-align: left">
                        <div class="form-label" style="vertical-align: top; width: 120px">已选中#gasNumber#个油站</div>
                        <div class="input-div">
                            <ul>
                                #gasHtml#
                            </ul>
                        </div>
                    </div>
                    <div class="form-items clear" style="padding-top: 25px;">
                        <div class="input-line common-title">
                            <p>优先级排序</p>
                            <p class="input-p">通过拖拽右侧优惠名称可调整优先级</p>
                        </div>
                        <div class="input-line"  style="margin-left: 35px;border: 1px solid #eaeaea;min-width: 222px;">
                            <div class="lists_left">
                                <ul class="lists_ul_left" id="lists_ul_left">
                                </ul>
                            </div>
                            <div class="lists_right">
                                <div class="mpPublic_GlobalLoading" id="rangeLoadingss">
                                    <div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                </div>
                                <ul id="lists_ul_right">
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="form-item clear" style="margin-left: 107px;color: #999999;">
                        设置优惠优先级后，当优惠相同时，将优先享受优先级高的优惠
                    </div>
                </form>
            </div>
        </script>
        <!--修改限制弹出层-->
    <script type="text/html" id="editChanneLimit">
        <div class="rule-form-body edit_channel_date">
            <form class="form-horizontal editDateTime" role="form" style="margin-left: 60px;">
                <div class="form-line" style="text-align: left">
                    <div class="form-label" style="vertical-align: top; width: 120px">已选中#gasNumber#个油站</div>
                    <div class="input-div">
                        <ul>
                            #gasHtml#
                        </ul>
                    </div>
                </div>
                <div class="form-line" style="text-align: left">
                    <div class="form-label" style="vertical-align: top; width: 120px">已选中#cnt#种优惠</div>
                    <div class="input-div">
                        <ul class="ul_list">
                            #channel#
                        </ul>
                    </div>
                </div>
                <div class="form-line" style="text-align: left">
                    <div class="form-label" style="vertical-align: top; width: 120px">优惠门槛</div>
                    <div class="input-div">
                        <ul class="ul_list">
                            #thresholdHtml#
                        </ul>
                    </div>
                </div>
                <div class="form-line" style="text-align: left">
                    <div class="form-label" style="vertical-align: top; width: 120px">次数限制</div>
                    <div class="input-div">
                        <ul class="ul_list">
                            #frequencyHtml#
                        </ul>
                    </div>
                </div>
            </form>
        </div>
    </script>
</div>
    <script type="text/html" id="station_oil_channel_list">
        {!!json_encode($station_oil_channel_list)!!}
    </script>
@endsection
@section('footer')
    <script>
        var mch_type = '{{$mch_type}}'; // 油站或集团判断
        var mch_id = '{{$mch_id}}'; // 油站或者集团Id
        {{--var $list_data = {!!json_encode($list_data)!!};--}}
        {{--console.log($list_data);--}}
        var _CHANNEL = {!!json_encode($all_channel)!!}; //生效的
        var  gasLists = {!!json_encode($group_station_list)!!}; // 油站列表
        var station_oil_info = {!!json_encode($station_oil_info)!!} // 油品信息
    </script>
    <script src="/js/wecar.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/vue_component.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/MarketPrice/set.js?v={{config('constants.wcc_file_version')}}"></script>
@endsection