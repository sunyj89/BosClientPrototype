@extends('layout/master')
@section('header')
    <link rel="stylesheet" type="text/css" href="/css/wcc.css?v={{config('constants.wcc_file_version')}}">
    <link rel="stylesheet" href="/css/wecar.css?v={{config('constants.wcc_file_version')}}" />
    <link rel="stylesheet" href="/css/mp.css?v={{config('constants.wcc_file_version')}}" />
    <link rel="stylesheet" href="/css/InviteFriend/detail.css?v={{config('constants.wcc_file_version')}}" />
@endsection

@section('content')
<div id="detail_ap">
    <table class="wcc_table">
        <caption class="caption">
            <div class="wcc_table_title">@{{activity_name}}</div>
            <a class="wcc_btn_export wcc_table_btn" :href="'/InviteFriend/downloadInviteDetail?activity_id='+activity_id">
                <i class="wcc_btn_i">&#xe679;</i>
                <span class="wcc_btn_span">导出数据</span>
            </a>
        </caption>
        <thead>
            <tr>
                <th>手机号码</th>
                <th>接受邀请人数</th>
                <th>完成邀请人数</th>
                <th>奖励<span class="prompt_day">（T+1天更新）</span></th>
                <th style="width:300px"></th>         
            </tr>
        </thead>
        <tbody v-if="detail_data.cnt>0">
            <tr v-for="(item, index) in detail_data.list" :key="index">
                <td>@{{item.phone?item.phone:'-'}}</td>
                <td>@{{item.invite_cnt}}</td> 
                <td>@{{item.invite_success_cnt}}</td>
                <td v-html="return_award(item.award)" style="line-height:1.8"></td>
                <td style="width:300px"></td>
            </tr>
        </tbody>
        <tbody v-else>
            <tr>
                <td  class="wcc_no_data" :colspan="5">
                </td>
            </tr>
        </tbody>
    </table>

    <div class="page_box" v-if="detail_data.cnt>10">
        <wcc-page v-bind:size='page_size' v-bind:page='page' v-bind:strip='strip' v-on:selected='change_page' v-bind:common='detail_data.cnt' >
        </wcc-page>
    </div>
</div>


@endsection

@section('footer')
    <script src="/js/vue_component.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/vendor/Plug/Plug.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/InviteFriend/detail.js?v={{config('constants.wcc_file_version')}}"></script>
@endsection