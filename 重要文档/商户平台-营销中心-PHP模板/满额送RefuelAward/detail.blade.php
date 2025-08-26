@extends('layout/master')

@section('header')
    <link rel="stylesheet" href="/css/wcc.css?v={{config('constants.wcc_file_version')}}" />
    <link rel="stylesheet" href="/css/common/common.css?v={{config('constants.wcc_file_version')}}" />
    <link rel="stylesheet" href="/css/RefuelAward/detail.css?v={{config('constants.wcc_file_version')}}" />
@endsection

@section('content')
    <div id="data_app" v-cloak>
        <table class="wcc_table">
            <caption class="caption">
            <div class="wcc_table_title">@{{acitve_name}}</div>
            <span class='wcc_table_remarks'></span>
            <button  class="wcc_btn_export wcc_table_btn" v-on:click="export_data">
                <i class="wcc_btn_i">&#xe663;</i>
                <span class="wcc_btn_span">导出数据</span>
            </button>
            </caption>
            <thead>
                <tr>
                    <th>手机号码</th>
                    <th>订单号</th>
                    <th>奖励内容</th>  
                    <th>领取日期</th>     
                </tr>
            </thead>
            <tbody v-if="total>0">
                <tr v-for="(item, index) in list_data" :key="index">
                    <td>@{{item.phone}}</td>
                    <td class="order_code" v-on:click="show_detail(item.order_code)">@{{item.order_code}}</td> 
                    <td>@{{item.award_list.award_name}}*@{{item.award_list.award_num}}</td>
                    <td>@{{item.create_time}}</td>
                </tr>
            </tbody>
            <tbody v-else>
                <tr><td  class="wcc_no_data" colspan="4"></td></tr>
            </tbody>
        </table>
        <template v-if="total > 10">
            <wcc-page
                v-bind:strip='page_size'
                v-bind:page='page'
                v-bind:common='total'
                v-bind:size="page_num"
                v-on:selected="select_page"
            ></wcc-page>
        </template>
    </div>
@endsection


@section('footer')
<script src="/js/vue_component.js?v={{config('constants.wcc_file_version')}}"></script>
<script src="/js/RefuelAward/detail.js?v={{config('constants.wcc_file_version')}}"></script>
@endsection
