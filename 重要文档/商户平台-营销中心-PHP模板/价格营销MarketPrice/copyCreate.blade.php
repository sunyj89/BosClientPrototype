@extends('layout/master')

@section('header')
<link rel="stylesheet" href="/css/common/common.css?v={{config('constants.wcc_file_version')}}">
<link rel="stylesheet" href="/css/wcc.css">
<link rel="stylesheet" href="/css/MarketPrice/index.css?v={{config('constants.wcc_file_version')}}">
<link rel="stylesheet" href="/css/wcc-element-ui/index.css?v={{config('constants.wcc_file_version')}}">
<link rel="stylesheet" href="/css/wcc-element-ui/wcc.css?v={{config('constants.wcc_file_version')}}">
@endsection

@section('content')
    <div class="page-body" id="create-app"  style="min-height: 500px">
        <div class="m-p-body">
            <form class="create-from">
                <div id="channelBase">
                    <div class="form-items clear">
                        <div class="input-line common-title">优惠时间</div>
                        <div class="input-line input-body">
                            <i class="wcc_calendar"></i>
                            <input type="text" class="input-text" style="width: 366px; padding: 0 20px 0 30px;" id="marketPriceDateTime">
                            <div style="display: none;"><input type="text" name="start_time" class="input-text create-time" value="">
                                至
                                <input type="text" class="input-text"> <input type="text" name="end_time" class="input-text create-time" value="">
                            </div>
                        </div>
                        <div class="time_descs">开始时间必须大于最终提交时间，否则系统默认从最终提交时间开始生效</div>
                    </div>
                    @if($mch_type==2)
                    <div class="form-items clear">
                        <div class="input-line common-title">优惠油站</div>
                        <div class="input-line input-body" id="channelGas" itemShow="0">
                            <div class="create-select">
                                <div class="c-s-value c-s-Gas-value"><span>请选择要添加的优惠油站</span></div>
                                <div class="c-s-options">
                                    <div class="tree-head head-active"><input name="gas_check_all[]" type="checkbox" class="tree-box"><div class="wcc_checkbox_y"> <span></span></div><span class="tree-title parent-has tree-open">全选</span></div>
                                    <ul class="tree-ul">
                                        @foreach($group_station_list as $v)
                                            <li class="tree-li">
                                                <div class="tree-head">
                                                    <input name="gas[]" type="checkbox" value="{{$v['stid']}}" class="tree-box">
                                                    <div class="wcc_checkbox_y"><span></span></div>
                                                    <span class="tree-title">{{$v['stname']}}</span></div>
                                            </li>
                                        @endforeach
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="form-line closest-oil" style="display: none"></div>
                        <div class="clear-fix"></div>
                    </div>
                    @endif
                    <div class="form-items clear">
                        <div class="input-line common-title">优惠类型</div>
                        <div class="input-line input-body" id="channelType" itemShow="0">
                            <div class="create-select">
                                <div class="c-s-value c-channel-value"><span>请选择要添加的优惠类型</span></div>
                                <div class="c-s-options">
                                    <ul class="tree-ul">

                                    </ul>
                                </div>
                            </div>
                        </div>
                       
                    </div>
                    <div class="form-items clear" id="channelOil" itemShow="0">
                        <div class="input-line common-title">优惠油品</div>
                        <div class="input-line input-body">
                            <div class="create-select">
                                <div class="c-s-value c-oil-value"><span>请选择要添加的能源油品</span></div>
                                <div class="c-s-options">
                                    <ul class="tree-ul">
                                        @foreach($station_oil_info as $val)
                                            @if ($val['type_id'] !== 0)
                                                <li class="tree-li tree-li-0">
                                                    <div class="tree-head head-active">
                                                        <i class="tree-icon tree-open"></i>
                                                        <input name="oil[]" type="checkbox" class="tree-box" value="0">
                                                        <div class="wcc_checkbox_y"><span></span></div>
                                                        <span class="tree-title parent-has tree-open">{{$val['name']}}</span>
                                                    </div>
                                                    @if (isset($val['parent_arr']) && $val['parent_arr'])
                                                    <ul class="tree-ul parent-ul" style="display: block">
                                                        @foreach($val['parent_arr'] as $v)
                                                        <li class="tree-li">
                                                            <div class="tree-head">
                                                                <input name="oil[]" type="checkbox" value="{{$v['oil_id']}}" class="tree-box">
                                                                <div class="wcc_checkbox_y"><span></span></div>
                                                                <span class="tree-title">{{$v['name']}}</span></div>
                                                        </li>
                                                        @endforeach
                                                    </ul>
                                                    @endif
                                                </li>
                                            @elseif($val['type_id'] == 0)
                                                <li class="tree-li tree-li-0" id="j_other" style="display: none;">
                                                    <div class="tree-head head-active">
                                                        <i class="tree-icon tree-open"></i>
                                                        <input name="oil[]" type="checkbox" class="tree-box" value="0">
                                                        <div class="wcc_checkbox_y"><span></span></div>
                                                        <span class="tree-title parent-has tree-open">{{$val['name']}}</span>
                                                    </div>
                                                    @if ($val['parent_arr'])
                                                        <ul class="tree-ul parent-ul" style="display: block">
                                                            @foreach($val['parent_arr'] as $v)
                                                                <li class="tree-li">
                                                                    <div class="tree-head">
                                                                        <input name="oil[]" type="checkbox" value="{{$v['oil_id']}}" class="tree-box">
                                                                        <div class="wcc_checkbox_y"><span></span></div>
                                                                        <span class="tree-title">{{$v['name']}}</span></div>
                                                                </li>
                                                            @endforeach
                                                        </ul>
                                                    @endif
                                                </li>
                                            @endif
                                        @endforeach
                                    </ul>
                                </div>
                            </div>
                        </div>
                    
                    </div>
                    <div class="form-items clear">
                        <div class="input-line common-title">重复类型</div>
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
                                
                            </div>
                            
                        </div>
                        <div class="clear-fix"></div>
                    </div>
                    <div class="clear create-submit">
                        <a href="javascript:void(0);" class="wecar-btn-next wecar-btn-success wcc-disabled" id="nextCreate">下一步</a>
                    </div>
                </div>
                <div class="clear channel-set" style="display: none" id="channelList">
                    <!-- 按升数 -->
                    <div style="display: flex;margin-left: 10px;">
                        <div class="input-line common-title"><span>优惠门槛</span></div>
                        <div class="input-line input-body" style="margin-left: 10px;">
                            <select class="create-select" name="market_type" id="market_type" disabled style="width:120px">
                                <option value="1">按原价</option>
                                <option value="2">按升数</option>
                            </select>
                        </div>
                    </div>

                    <!-- 按折扣 -->
                    <div style="display: flex;margin: 10px 0 0 10px;">
                        <div class="input-line common-title"><span>享受优惠</span></div>
                        <div class="input-line input-body" style="margin-left: 10px;">
                            <select class="create-select" name="price_type" id="price_type" disabled style="width:120px">
                                <option value="1">每升直降</option>
                                <option value="2">按折扣</option>
                            </select>
                        </div>
                    </div>

                    <div class="channel-body">

                    </div>
                    <div class="clear create-submit">
                        <a href="javascript:void(0);" class="wecar-btn" id="prevCreate" style="border: 1px solid #d9d9d9;">上一步</a>
                        <a href="javascript:void(0);" class="wecar-btn wecar-btn-success wcc-disabled" id="submitPost" style="margin-left: 20px;">提交</a>
                    </div>
                </div>

            </form>
        </div>
    </div>
<div class="page-min-time-picker"></div>
<script id="setItemTpl" type="text/html">
    <div class="set-items">
        <div class="set-head">设置第#index#段（#time_lists#）优惠明细</div>
        <div class="set-body">
            <div class="set-li clear">
                <div class="input-line common-title"><span>优惠时间</span></div>
                <div class="input-line">
                    <div>#channel_date#</div>
                </div>
            </div>
            @if($mch_type==2)
            <div class="set-li clear">
                <div class="input-line common-title"><span>优惠油站</span></div>
                <div class="input-line">
                    <div>#channel_gas#</div>
                </div>
            </div>
            @endif
            <div class="set-li clear">
                <div class="input-line common-title"><span>优惠类型</span></div>
                <div class="input-line">
                    <div>#channel_type#</div>
                </div>
            </div>
            <div class="set-li clear">
                <div class="input-line common-title"><span>优惠时段</span></div>
                <div class="input-line">
                    <div>#channel_time#</div>
                </div>
            </div>
            <div class="set-li clear">
                <div class="input-line common-title"><span>优惠价格</span></div>
                <div class="input-line">
                   <div>#channel_price#</div>
                </div>
            </div>
        </div>
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
         
        </div>
    </div>
</script>

<script type="text/html" id="authAdminTpl">
<div class="page-html auth-admin">
    <div class="desc"><span class="alert-msg">向以下人员发送验证码#name#验证通过后15分钟内操作无需验证</span></div>
    <form class="form-horizontal" role="form">
        <div class="form-line">
            <div class="input-div">
                <input type="tel" class="input-text" autocomplete="off" name="phone-code" maxlength="6" placeholder="请输入验证码"/>
                <span class="wecar-btn wecar-code">获取验证码</span>
            </div>
        </div>
    </form>
</div>
</script>
@endsection

@section('footer')
    <script>
        var mch_type = '{{$mch_type}}'; // 油站或集团判断
        var mch_name = '{{$mch_name}}';
        var mch_id = '{{$mch_id}}'; // 油站或者集团Id
    </script>
    <script src="/js/wcc-element-ui/vue.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/wecar.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/vue_component.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/wcc-element-ui/index.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/MarketPrice/copy.js?v={{config('constants.wcc_file_version')}}"></script>
@endsection
