@extends('layout/master')

@section('header')
    <link rel="stylesheet" href="/js/vendor/bootstrap/css/bootstrap.min.css?v={{config('constants.wcc_file_version')}}">
    <link rel="stylesheet" href="/js/vendor/select2/css/select2.min.css?v={{config('constants.wcc_file_version')}}">
    <link rel="stylesheet" href="/css/common/common.css?v={{config('constants.wcc_file_version')}}">
    <link rel="stylesheet" href="/js/vendor/layer/skin/layer.css?v={{config('constants.wcc_file_version')}}" />
    <link rel="stylesheet" href="/css/Marketing/statistics.css?v={{config('constants.wcc_file_version')}}" />
@endsection

@section('content')
    @include ('common/marketing_header')
    <div class="page-body">
        <ul class="nav-tabs" id="data-tab">
            <li>
                <a href="#" class="text-center" id="seven-days">最近7天</a>
            </li>
            <li>
                <a href="#" class="text-center" id="thirty-days">最近30天</a>
            </li>
            <li class="calendar">
                <input type="text" id="timeRange" class="calendar-form" value="">
            </li>
            <div class="clear-fix"></div>
        </ul>

        <div class="select-box">
            <div class="select-couponlist">
                <span style="margin-left: 10px;margin-right: 5px;">券类型</span>
                <form action="" class="form-inline">
                    <select class="form-control" style="width: 120px;">
                    </select>
                </form>
            </div>
            <div class="select-coupon_active">
                <span style="margin-left: 10px;margin-right: 5px;">活动类型</span>
                <form action="" class="form-inline">
                    <select class="form-control" style="width: 120px;">
                    </select>
                </form>
            </div>
            <div class="select-active-type" style="margin-left: 3px;">
                <span style="margin-left: 10px;margin-right: 5px;">营销类型</span>
                <form action="" class="form-inline">
                    <select class="form-control" style="width: 120px;"></select>
                </form>
            </div>
            <div class="select-platform" style="margin-left: 3px; display: none">
                <span style="margin-right: 5px;">油站</span>
                <form action="" class="form-inline">
                    <select class="form-control" style="width: 120px;"></select>
                </form>
            </div>
            <div class="clear-fix"></div>

            <div class="content-body">
                <div class="tab-pane active">
                    <div class="content-block tongji_content">
                        <div class="chart_title">
                            <span>综合统计</span>
                            <span class="tip_icon"></span>
                            <div class="mask_state">
                                <div class="state_block">
                                    <p>领取数量是指发放的营销券总数</p>
                                    <p>领取成本等于领取数量x营销券面额（不含折扣券)</p>
                                </div>
                                <div class="state_block">
                                    <p>使用数量是指被使用的营销券总数</p>
                                    <p>营销成本等于使用数量x营销券面额（含折扣券）</p>
                                </div>
                                <div class="state_block">
                                    <p>产出销量是指被使用的营销券所在订单中油品销量订单金额</p>
                                </div>
                            </div>
                        </div>
                        <div class="content-area">
                            <div class="data-panel panel-5">
                                <div class="panel-title text-center">领取数量（张）</div>
                                <div class="panel-content text-center" id="coupon_num">-</div>
                            </div>
                            <div class="data-panel panel-5">
                                <div class="panel-title text-center">领取成本（元）</div>
                                <div class="panel-content text-center" id="coupon_price">-</div>
                            </div>
                            <div class="data-panel panel-5">
                                <div class="panel-title text-center">使用数量（张）</div>
                                <div class="panel-content text-center" id="use_coupon">-</div>
                            </div>
                            <div class="data-panel panel-5">
                                <div class="panel-title text-center">营销成本（元）</div>
                                <div class="panel-content text-center" id="market_price">-</div>
                            </div>
                            <div class="data-panel panel-5">
                                <div class="panel-title text-center">未使用（张）</div>
                                <div class="panel-content text-center" id="not_used">0</div>
                            </div>
                            <div class="data-panel panel-5">
                                <div class="panel-title text-center">已过期（张）</div>
                                <div class="panel-content text-center" id="overdue">0</div>
                            </div>
                            <div class="data-panel panel-5">
                                <div class="panel-title text-center">已弃用（张）</div>
                                <div class="panel-content text-center" id="invalid_num">0</div>
                            </div>
                            <div class="data-panel panel-5">
                                <div class="panel-title text-center">产出营销（元）</div>
                                <div class="panel-content text-center" id="output_amount">-</div>
                            </div>
                            <div class="data-panel panel-5">
                                <div class="panel-title text-center">产出营销（升）</div>
                                <div class="panel-content text-center" id="output_liter">-</div>
                            </div>
                            <div class="data-panel panel-5">
                                <div class="panel-title text-center">产出营销（笔）</div>
                                <div class="panel-content text-center" id="output_count">-</div>
                            </div>
                            <div class="clear-fix"></div>
                        </div>
                    </div>
                    <div class="clear-fix"></div>

                    <div class="tool">
                        <div class="btn-group">
                            <button type="button" class="btn btn-default select-btn" data-type="1">抵用券成本趋势图</button>
                            <button type="button" class="btn btn-default" data-type="2">抵用券数量趋势图</button>
                            <button type="button" class="btn btn-default" data-type="3">成本产出对比趋势图</button>
                        </div>
                        <h5 class="content-title download_title">
                            <a href="javascript:void(0);">
                                导出使用明细
                            </a>
                        </h5>
                    </div>

                    <div class="content-block" style="position: relative;">
                        <div class="content-area chart_zhe">
                            <div id="chart" style="width: 100%; height: 350px;"></div>
                            <div class="nothing"><span>暂无数据</span></div>
                        </div>
                    </div>

                    <div class="content-block table-data" style="margin: 20px;">
                        <h5 class="content-title download_table">
                            <a href="javascript:void(0);">下载表格</a>
                        </h5>
                        <div class="content-area" id="table_html"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="clear-fix"></div>
    </div>
@endsection

@section('footer')
    <script src="/js/vendor/bootstrap/js/bootstrap.min.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/vendor/select2/js/select2.min.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/vendor/select2/js/i18n/zh-CN.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/vendor/echarts/echarts.min.js?v={{config('constants.wcc_file_version')}}"></script>
    <script type="text/javascript">
        $(function() {
            //天数
            $('.select-day select').select2({
                minimumResultsForSearch: Infinity
            });

            //平台
            $('.select-platform select').select2({

            });

            //抵用券还是红包
            $('.select-coupon select').select2({
                minimumResultsForSearch: Infinity
            });

            //抵用券的类型
            $('.select-coupon_type select').select2({
                minimumResultsForSearch: Infinity
            });

            //抵用券活动
            $('.select-coupon_active select').select2({

            });

            //抵用券
            $('.select-couponlist select').select2({
                minimumResultsForSearch: Infinity
            });

            //营销类型
            $('.select-active-type select').select2({
                minimumResultsForSearch: Infinity
            });

            //选择图表的显示类型
            $('.select-chart-type select').select2({
                minimumResultsForSearch: Infinity
            });
        });
    </script>
    <script src="/js/vendor/Plug/Plug.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/Marketing/statistics.js?v={{config('constants.wcc_file_version')}}"></script>
@endsection
