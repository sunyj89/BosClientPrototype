@extends('layout/master')

@section('header')
<link rel="stylesheet" href="/css/common/common.css?v={{config('constants.wcc_file_version')}}">
<link rel="stylesheet" href="/css/MarketPrice/index.css?v={{config('constants.wcc_file_version')}}">
@endsection

@section('content')

    <div class="page-body" style="min-height: 500px">
        <div class="m-p-body">
            <form class="create-from">
                <div id="channelBase">
                    <div class="form-items clear">
                        <div class="input-line common-title">选择优惠时间</div>
                        <div class="input-line input-body">
                            <input type="text" class="input-text" style="width: 310px;" id="marketPriceDateTime">
                            <div style="display: none;"><input type="text" name="start_time" class="input-text create-time" value="">
                                至
                                <input type="text" class="input-text"> <input type="text" name="end_time" class="input-text create-time" value="">
                            </div>
                        </div>
                        <div class="time_desc">开始时间必须大于最终提交时间,否则系统默认从最终提交时间开始生效</div>
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
                                <div class="c-s-already">
                                    <div class="alr-title"><span>已选优惠类型</span></div>
                                    <div class="alr-content">
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div class="time_desc">不同类型的优惠不可同享，用户将享受其中最高的优惠</div>
                        <div class="clear-fix"></div>
                    </div>
                    <div class="form-items clear" id="channelOil">
                        <div class="input-line common-title">选择优惠油品</div>
                        <div class="input-line input-body">
                            <div class="create-select">
                                <div class="c-s-value"><span>请选择要添加的能源油品</span></div>
                                <div class="c-s-options">
                                    <ul class="tree-ul">
                                        @foreach($station_oil_info as $val)
                                        <li class="tree-li tree-li-0">
                                            <div class="tree-head head-active">
                                                <i class="tree-icon tree-open"></i>
                                                <input name="oil[]" type="checkbox" class="tree-box" value="0">
                                                <span class="tree-title parent-has tree-open">{{$val['name']}}</span>
                                            </div>
                                            @if ($val['parent_arr'])
                                            <ul class="tree-ul parent-ul" style="display: block">
                                                @foreach($val['parent_arr'] as $v)
                                                <li class="tree-li">
                                                    <div class="tree-head">
                                                        <input name="oil[]" type="checkbox" value="{{$v['oil_id']}}" class="tree-box">
                                                        <span class="tree-title">{{$v['name']}}</span></div>
                                                </li>
                                                @endforeach
                                            </ul>
                                            @endif
                                        </li>
                                        @endforeach
                                    </ul>
                                </div>
                                <div class="c-s-already">
                                    <div class="alr-title"><span>已选油品</span></div>
                                    <div class="alr-content">
                                        @foreach($station_oil_info as $val)
                                        @if ($val['parent_arr'])
                                        <div data-id="3" data-pid="0" style="display: block" class="show-items">
                                            @foreach($val['parent_arr'] as $v)
                                            <div class="show-li" data-id="{{$v['oil_id']}}">
                                                <span>{{$val['name']}}-{{$v['name']}}</span>
                                            </div>
                                            @endforeach
                                        </div>
                                        @endif
                                        @endforeach
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="time_desc">未选中的油品，默认为该油品无此类优惠。</div>
                        <div class="form-line closest-oil" style="display: none"></div>
                        <div class="clear-fix"></div>
                    </div>
                    <div class="form-items clear">
                        <div class="input-line common-title">选择重复类型</div>
                        <div class="input-line input-body">
                            <div class="create-select c-s-repeat-type">
                                <div class="c-s-value value-active" type="day" id="repeatTypeVal"><span>每日重复</span></div>
                                <div class="c-s-options repeat-type-ul">
                                    <ul>
                                        <li class="repeat-type-li" type="day"><span>每日重复</span></li>
                                        <li class="repeat-type-li" type="week"><span>每周重复</span></li>
                                        <li class="repeat-type-li" type="month"><span>每月重复</span></li>
                                    </ul>
                                </div>
                            </div>
                            <div class="input-msg"><span>最多设置8个时段</span></div>
                            <div class="repeat-type" id="repeatType" type="day">
                                <div class="item-type">
                                    <div class="repeat-time">
                                        <div class="input-line input-body yh-time">
                                            <input type="text" name="start_time" class="input-text create-time minTimePicker" value="00:00">
                                            至
                                            <input type="text" name="end_time" class="input-text create-time minTimePicker" value="23:59">
                                            <a href="javascript:;" class="repeat-type-del">删除</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="repeat-add"><span>添加</span></div>
                            </div>
                        </div>
                        <div class="clear-fix"></div>
                    </div>
                    <div class="clear create-submit">
                        <a href="javascript:void(0);" class="wecar-btn wecar-btn-success wcc-disabled" id="nextCreate">下一步</a>
                    </div>
                </div>
                <div class="clear channel-set" style="display: none" id="channelList">
                    <div class="channel-body">

                    </div>
                    <div class="clear create-submit">
                        <a href="javascript:void(0);" class="wecar-btn" id="prevCreate">上一步</a>
                        <a href="javascript:void(0);" class="wecar-btn wecar-btn-success" id="submitPost">提交</a>
                    </div>
                </div>

            </form>

        </div>
    </div>
<div class="page-min-time-picker"></div>
<script id="setItemTpl" type="text/html">
    <div class="set-items">
        <div class="set-head">设置第#index#段优惠明细</div>
        <div class="set-body">
            <div class="set-li clear">
                <div class="input-line common-title"><span>优惠时间</span></div>
                <div class="input-line input-body">
                    <span>#channel_date#</span>
                </div>
            </div>
            <div class="set-li clear">
                <div class="input-line common-title"><span>优惠类型</span></div>
                <div class="input-line input-body">
                    <span>#channel_type#</span>
                </div>
            </div>
            <div class="set-li clear">
                <div class="input-line common-title"><span>优惠时段</span></div>
                <div class="input-line input-body">
                    <span>#channel_time#</span>
                </div>
            </div>
            <div class="set-li clear">
                <div class="input-line common-title"><span>优惠价格</span></div>
                <div class="input-line input-body">
                    #channel_price#
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
        <div class="input-line input-body yh-time">
            <input type="text" name="start_time" class="input-text create-time minTimePicker" value="00:00">
            至
            <input type="text" name="end_time" class="input-text create-time minTimePicker" value="23:59">
            <a href="javascript:void(0);" class="repeat-type-del">删除</a>
        </div>
    </div>
</script>

<script type="text/html" id="authAdminTpl">
<div class="page-html auth-admin">
    <div class="desc"><span class="alert-msg">向以下人员发送验证码#name#验证通过后15分钟内操作无需验证</span></div>
    <form class="form-horizontal" role="form">

        <div class="form-line">
            <label class="form-label">请输入验证码</label>
            <div class="input-div">
                <input type="tel" class="input-text" autocomplete="off" name="phone-code" maxlength="6" />
                <span class="wecar-btn wecar-code">获取验证码</span>
            </div>
        </div>

    </form>
</div>
</script>

<script type="text/html" id="oilInfoJOSN">
{!!json_encode($station_oil_info)!!}
</script>
<script type="text/html" id="station_oil_channel_list">
{!!json_encode($station_oil_channel_list)!!}
</script>
@endsection

@section('footer')
<script>
    var _STID = {{$stid}};
</script>
<script src="/js/wecar.js?v={{config('constants.wcc_file_version')}}"></script>
<script src="/js/MarketPrice/create.js?v={{config('constants.wcc_file_version')}}"></script>
@endsection
