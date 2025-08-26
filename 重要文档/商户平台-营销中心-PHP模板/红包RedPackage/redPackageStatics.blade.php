@extends('layout/master')

@section('header')
    <link rel="stylesheet" href="/js/vendor/bootstrap/css/bootstrap.min.css?v={{config('constants.wcc_file_version')}}">
    <link rel="stylesheet" href="/css/RedPackage/redPackageStatistics.css?v={{config('constants.wcc_file_version')}}">
    <link rel="stylesheet" href="/css/wcc.css?v={{config('constants.wcc_file_version')}}">
@endsection

@section('content')
    <div class="wrapper">
        <div class="top_block">
            {{-- 集团的块切换 --}}
            <div class="swtichGroupBox_top" style="display:none;">
                <div class="swtichGroupBox swtichGroupBox_select">集团数据</div>
                <div class="swtichGroupBox" style="display:none">各站使用情况</div>
            </div>

            {{--<div class="time_info font-normal" style="display:none">数据截至 <span>2016-12-31</span></div>--}}

            <div class="activity_box">
                @if($activity_arr)
                    <div class="activity_select select" type="0">
                        {{--<i class="task_icon"></i>--}}
                        @foreach( $activity_arr as $key => $value )
                            @if( $key == $activity_select )
                                <div class="activity_title" is_group="{{$value['merchant_type']==2?1:0}}" hide_group="{{$merchant_type == 2 ? 1 : 0}}" choose_id="{{$activity_select}}">
                                    <em>{{$value['name']}}</em>
                                </div>
                            @endif
                        @endforeach
                        <div class="activity_list">
                            @foreach( $activity_arr as $key => $value )
                                <div class="activity_item" is_group="{{$value['merchant_type']==2?1:0}}" hide_group="{{$merchant_type == 2 ? 1 : 0}}" data-id="{{$key}}">
                                    <em>{{$value['name']}}</em>
                                </div>
                            @endforeach
                        </div>
                    </div>
                @else
                    <div class="activity_select select">
                        {{--<i class="task_icon"></i>--}}
                        <div class="activity_title" choose_id="0">暂无活动</div>
                    </div>
                @endif
            </div>
        </div>
        <div class="statistics_cell">
            <div class="overview">
                <div class="chart_title">
                    <span>数据概览</span>
                    <span class="tip_icon"></span>
                    <div class="mask_state">
                        <div class="state_block">
                            <p>发放数量是指发放的营销券总数</p>
                            <p>领取数量是指被领取的营销券总数</p>
                            <p>使用数量是指被使用的营销券总数</p>
                        </div>
                        <div class="state_block">
                            <p>领取人数是指是领取红包的人数</p>
                            <p>使用人数是指使用了红包中营销券的人数</p>
                        </div>
                        <div class="state_block">
                            <p>计划成本等于发放数量x营销券面额（不含折扣券）</p>
                            <p>领取成本等于领取数量x营销券面额（不含折扣券）</p>
                            <p>使用成本等于使用数量x营销券面额（含折扣券）</p>
                        </div>
                    </div>
                </div>
                <div class="chart_content clear">

                </div>
            </div>
            {{--时间选择--}}
            <div class="time_block clear">
                <div class="date_select time_active" data-date="7">最近7天</div>
                <div class="date_select"  data-date="30">最近30天</div>
                {{--<div class="time_range">--}}
                    {{--<span class="time_icon">--}}
                       {{--<i class="glyphicon glyphicon-calendar"></i>--}}
                    {{--</span>--}}
                    {{--<input type="text" id="timeRange">--}}
                {{--</div>--}}

                <div class="wcc_selectStation_box wcc_time width231 border_left_none" itshow="0" style="margin-left:20px;">
                    <i class="wcc_calendar"></i>
                    <div class="input_box">
                        <input id="timeRange" type="text" name="" value="" placeholder="">
                    </div>
                </div>
            </div>

            {{--<div class="">--}}
                {{--<div class="wcc_selectStation_box wcc_time width231 border_left_none" itshow="0">--}}
                    {{--<i class="wcc_calendar"></i>--}}
                    {{--<div class="input_box">--}}
                        {{--<input id="timeRange" type="text" name="" value="" placeholder="">--}}
                    {{--</div>--}}
                {{--</div>--}}
            {{--</div>--}}
            {{--数据趋势--}}
            <div class="overview">
                <div class="chart_title">
                    <span>数据趋势</span>
                    <a href="javascript:;" class="download_img">保存图片</a>
                </div>
                <div class="empty_data">暂无数据</div>
                <div class="chart_content trend">
                    <div class="top_btn_nav">
                        <div class="nav_btn nav_active" type="1">营销券</div>
                        <div class="nav_btn" type="2">人数</div>
                        <div class="nav_btn" type="3">成本</div>
                    </div>

                    <div id="line_chart">

                    </div>
                </div>
            </div>
            {{--详细数据--}}
            <div class="overview">
                <div class="chart_title">
                    <span>详细数据</span>
                    <a href="javascript:;" class="download_form">导出报表</a>
                </div>
                <div class="chart_content">
                    <table class="wcc_table">
                        <thead>
                            <tr>
                                <td>日期</td>
                                <td>领取数量(张)</td>
                                <td>使用数量(张)</td>
                                <td>领取人数(人)</td>
                                <td>使用人数(人)</td>
                                <td>领取成本(元)</td>
                                <td>实际成本(元)</td>
                            </tr>
                        </thead>
                        <tbody>

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="stationData" style="display:none">
            <div class="stationDataSelectContentBox">
                <div class="stationDataSelectContentBlock">使用数量</div>
                <div class="stationDataSelectContentBlock">使用人数</div>
                <div class="stationDataSelectContentBlock">使用成本</div>
            </div>
            <div id="stationRender">

            </div>
        </div>
    </div>
@endsection

@section('footer')
    <script>
        var selected = '{{$activity_select}}';
    </script>
    <script src="/js/vendor/Plug/Plug.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/vendor/echarts/echarts.min.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/vendor/echarts/weicheche.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/RedPackage/redPackageStatistics.js?v={{config('constants.wcc_file_version')}}"></script>
@endsection