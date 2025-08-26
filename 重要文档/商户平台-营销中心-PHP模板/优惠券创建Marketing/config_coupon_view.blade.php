@extends('layout/master')

@section('header')
    <link rel="stylesheet" href="/js/vendor/bootstrap/css/bootstrap.min.css?v={{config('constants.wcc_file_version')}}">
    <link rel="stylesheet" href="/css/Marketing/config_view.css?v={{config('constants.wcc_file_version')}}" />
@endsection

@section('content')
    <div class="wrapper" type="0">
        <div class="list-head">
            营销券列表
        </div>
        <nav class="tab_box">
            <div class="coupon_status_box flex_box">
                <div class="head_btn">状态</div>
                <div class="nav_btn nav_btn1 nav_btn_active" type="1">审核通过</div>
                <div class="nav_btn nav_btn1" type="0">待审核</div>
            </div>
            <div class="coupon_status_box flex_box">
                <div class="head_btn">类型</div>
                <div class="nav_btn nav_btn4 nav_btn_active" type="0">全部</div>
                <div class="nav_btn nav_btn4" type="1">油品</div>
                <div class="nav_btn nav_btn4" type="2">非油品</div>
                <div class="nav_btn nav_btn4" type="5">充值赠金</div>
            </div>
            <div class="coupon_status_box flex_box">
                <div class="head_btn">来源</div>
                <div class="nav_btn nav_btn2 nav_btn_active" type="0">手动创建</div>
                <div class="nav_btn nav_btn2" type="1">自动召回</div>
                <div class="nav_btn nav_btn2" type="2">一键召回</div>
            </div>
            <div class="coupon_status_box flex_box">
                <div class="head_btn">有效</div>
                <div class="nav_btn nav_btn3 nav_btn_active" type="1">使用中</div>
                <div class="nav_btn nav_btn3" type="3">已弃用</div>
                <div class="nav_btn nav_btn3" type="2">已过期</div>
            </div>
            <div class="coupon_operate_box coupon_operate_box_inner flex_box">
                <div class="flex_box">
                    <div class="opt_btn" type="1" style="border:0;font-weight:bold;color:#333;">
                        <input type="checkbox">全选
                        <div class="wcc_checkbox_y"><span></span></div>
                    </div>
                    <div class="type_one_btn_group" >
                        <div class="opt_btn" type="4">弃用</div>
                        <div class="opt_btn" type="5" style="display: none;">还原</div>
                    </div>
                    <div class="type_two_btn_group" style="display: none">
                        <div class="opt_btn" type="2">删除</div>
                        <div class="opt_btn" type="3">审核通过</div>
                    </div>
                </div>
                <div class="flex_box">
                    <input type="text" class="search-input" name="coupon_name" placeholder="按券名称模糊搜索" value="">
                    <input type="text" class="search-input" style="margin-left: 10px;" name="coupon_id" placeholder="按券ID搜索" value="">
                    <button class="search-btn" >搜索</button>
                </div>
            </div>
        </nav>
        <div class="coupon_content_box">
            <div class="not_overdue_box clear">
                {{--抵用券--}}

            </div>
            <div class="no_record">
                <div class="icon" type="1"></div>
                <div class="state">暂无记录</div>
            </div>
            <div class="page">
                <div id="pager" class="pagination clear" style="margin: 0"></div>
            </div>
        </div>
    </div>
@endsection

@section('elastic')
    <div class="confirm coupon_info_box" id="coupon_info_box"  type="1">
        <div class="content_box">
            <div class="top_box">
                <div class="sign" style="font-size:16px;color: #4A4A4A;">营销券详情</div>
                <div class="close"></div>
            </div>
            <div class="main_box public_scrollBrowser">

            </div>
            <div class="foot_box">
                <div class="c_btn sure c_btn_uni" id="activate">激活</div>
                {{--<div class="c_btn sure c_btn_uni" type="1" id="modify">修改</div>--}}
            </div>
        </div>
    </div>
@endsection

@section('footer')
    <script>
       var pay_limit_show = {{$pay_limit_show}};
       var coupon_append_show   = {{$coupon_append_show}};
       var plate_limit_show = {{$plate_limit_show}};
       var countdown_limit_show = {{$countdown_limit_show}};
    </script>
    <script src="/js/vendor/jqPaginator.min.js?v={{config('constants.wcc_file_version')}}"></script>
    <script type="text/javascript" src="/js/Marketing/card_type_data.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/Marketing/config_view.js?v={{config('constants.wcc_file_version')}}"></script>
@endsection
