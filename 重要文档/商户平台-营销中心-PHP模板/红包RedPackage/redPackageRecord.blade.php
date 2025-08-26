@extends('layout/master')

@section('header')
    <link rel="stylesheet" href="/css/common/common.css?v={{config('constants.wcc_file_version')}}" />
    <link rel="stylesheet" href="/css/RedPackage/redPackageRecord.css?v={{config('constants.wcc_file_version')}}" />
@endsection


@section('content')
    <div style="display:none;" id="activity_type">{{isset($activity_type)?$activity_type:-1}}</div>
    <div class="container">
        <div class="header_nav clear">
            <div class="nav_btn nav_active" data-type="-1">全部</div>
            <div class="nav_btn " data-type="1">未开始</div>
            <div class="nav_btn" data-type="2">进行中</div>
            <div class="nav_btn" data-type="3">已结束</div>
        </div>
        <div class="main_content">
            <table class="package_table">
                <thead>
                    <tr>
                        <td>红包类型</td>

                        <td>红包名称</td>
                        <td>红包ID</td>
                        <td>红包有效期</td>
                        <td class="ic_state">券数(张) <div class="state_mask">券数量是指每个红包里包含的营销券数量</div> </td>
                        <td>红包数量(个)</td>
                        <td>操作</td>
                    </tr>
                </thead>
                <tbody>
                    
                </tbody>
            </table>
        </div>
        <div id="pager" class="pagination clear"></div>
    </div>
@endsection

@section('footer')
    <script>
        var ostn_id = {{session('ostn_id')}};
        var pagesize = {{env('pagesize')}};
    </script>
    <script src="/js/vendor/jqPaginator.min.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/RedPackage/redPackageRecord.js?v={{config('constants.wcc_file_version')}}"></script>
@endsection
