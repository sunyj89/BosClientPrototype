@extends('layout/master')

@section('header')
    <link rel="stylesheet" type="text/css" href="/css/wcc.css?v={{config('constants.wcc_file_version')}}">
    <link rel="stylesheet" href="/css/wecar.css?v={{config('constants.wcc_file_version')}}" />
    <link rel="stylesheet" href="/css/mp.css?v={{config('constants.wcc_file_version')}}" />
    <link rel="stylesheet" href="/css/InviteFriend/info_new.css?v={{config('constants.wcc_file_version')}}" />
@endsection

@section('content')
    <div class="content_box" id="content_box">
        <div v-if="active_data!=null">
            <div class="content_box_left">
                <p class="content_title">页面预览</p>
                <div class="content_content preview" v-bind:class="{preview_one:tab==1,preview_two:tab==2}">
                    <p class="page_title" v-if="tab!=2">@{{active_data.activity_desc_config.page_title}}</p>
                    <p class="page_title_info" v-if="tab!=2">@{{active_data.activity_desc_config.page_title_info}}</p>
                </div>
                <div class="tab_box">
                    <p class="tab_list" v-bind:class="{active:tab==0}" v-on:click="tab=0">邀请页</p>
                    <p class="tab_list" v-bind:class="{active:tab==1}" v-on:click="tab=1">被邀请页</p>
                    <p class="tab_list" v-bind:class="{active:tab==2}" v-on:click="tab=2">接受邀请页</p>
                </div>
            </div>
            <div class="content_box_right">
                <p class="content_title">活动详情</p>
                <div class="content_content content_content_two">
                    <div class="mess_list">
                        <div class="mess_list_left">
                            <span class="mess_list_title mess_list_text">活动名称</span>
                        </div>
                        <div class="mess_list_right">
                            <span class="mess_list_content mess_list_text">@{{active_data.activity_name}}</span>
                        </div>
                    </div>
                    <div class="mess_list">
                        <div class="mess_list_left">
                            <span class="mess_list_title mess_list_text">活动日期</span>
                        </div>
                        <div id="select_time" class="mess_list_right" name="select_time" style="width:0;height:0;overflow:hidden;position:absolute;top:0;left:110px;"></div>
                        <div class="mess_list_right">
                            <span class="mess_list_content mess_list_text">@{{active_data.start_time}}&ensp;至&ensp;@{{active_data.end_time}}</span>
                        </div>
                    </div>
                    <div class="mess_list">
                        <div class="mess_list_left">
                            <span class="mess_list_title mess_list_text">活动资格</span>
                        </div>
                        <div class="mess_list_right">
                            <span class="mess_list_content mess_list_text">邀请人-@{{return_inviter_type()}}</span><br>
                            <span class="mess_list_content mess_list_text">被邀人-@{{return_invitee_type()}}</span>
                        </div>
                    </div>
                    <div class="mess_list">
                        <div class="mess_list_left">
                            <span class="mess_list_title mess_list_text">活动类型</span>
                        </div>
                        <div class="mess_list_right">
                            <span class="mess_list_content mess_list_text">@{{return_activity_type()}}</span>
                        </div>
                    </div>
                    <div class="mess_list" style="position:relative">
                        <div class="mess_list_left" style="position:absolute">
                            <span class="mess_list_title mess_list_text">完成邀请条件</span>
                        </div>
                        <div class="mess_list_right" style="margin-left: 110px;">
                            <span class="mess_list_content mess_list_text">@{{return_invite_success_config()}}</span>
                        </div>
                    </div>
                    <div class="mess_list" style="position:relative">
                        <div class="mess_list_left" style="position:absolute">
                            <span class="mess_list_title mess_list_text">活动规则</span>
                        </div>
                        <div class="mess_list_right" style="margin-left: 110px;">
                            <span class="mess_list_content mess_list_text" v-html="return_rule_desc(active_data.activity_desc_config.activity_rule_desc)"></span>
                        </div>
                    </div>
                    <div class="mess_list">
                        <caption class="caption">
                            <div class="award_title" style="margin-top:25px">邀请人奖励</div>
                        </caption>
                        <table class="wcc_table">
                            <thead>
                                <tr>
                                    <th>奖励来源</th>
                                    <th>奖励类型</th>
                                    <th>奖励内容</th>
                                    <th>奖品数量</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- 接受邀请 -->
                                <tr v-if="!active_data.inviter_award_when_accept_config">
                                    <td>接受邀请</td>
                                    <td>无奖励</td>
                                    <td>-</td>
                                    <td>-</td>
                                </tr>
                                <template v-else-if="active_data.inviter_award_when_accept_config.award_detail[0].award_type==1">
                                    <tr v-for="(item, index) in refactor_coupon_arr(active_data.inviter_award_when_accept_config.award_detail[0].award)" :key="index">
                                        <td>接受邀请</td>
                                        <td>@{{return_award_type(active_data.inviter_award_when_accept_config.award_detail[0].award_type)}}</td>
                                        <td>@{{get_coupon_name(item)}}</td>
                                        <td>@{{item.length}}</td>
                                    </tr>
                                </template>
                                <tr v-else>
                                    <td>接受邀请</td>
                                    <td>@{{return_award_type(active_data.inviter_award_when_accept_config.award_detail[0].award_type)}}</td>
                                    <td>@{{active_data.inviter_award_when_accept_config.award_detail[0].award}}积分</td>
                                    <td>1</td>
                                </tr>
                                <!-- 完成邀请 -->
                                <tr v-if="!active_data.inviter_award_config.award_detail">
                                    <td>完成邀请</td>
                                    <td>无奖励</td>
                                    <td>-</td>
                                    <td>-</td>
                                </tr>
                                <template v-else v-for="(item, index) in active_data.inviter_award_config.award_detail" :key="index">
                                    <template v-if="item.award_type==1||item.award_type==5">
                                        <tr v-for="(item_t, index_t) in refactor_coupon_arr(item.award)" :key="index_t">
                                            <td>@{{return_inviter_name(item.award_level)}}</td>
                                            <td>@{{return_award_type(item.award_type)}}</td>
                                            <td v-if="item.award_type==1">@{{get_coupon_name(item_t)}}</td>
                                            <td v-else>@{{get_wx_name(item_t)}}</td>
                                            <td>@{{item_t.length}}</td>
                                        </tr>
                                    </template>
                                    <tr v-else>
                                        <td>@{{return_inviter_name(item.award_level)}}</td>
                                        <td>@{{return_award_type(item.award_type)}}</td>
                                        <td>@{{item.award}}积分</td>
                                        <td>1</td>
                                    </tr>
                                </template>
                                <!-- 阶梯奖励 -->
                                <template v-if="active_data.inviter_award_config.extra_award_config">
                                    <template v-for="(item, index) in active_data.inviter_award_config.extra_award_config.extra_award_detail" :key="index">
                                        <template v-if="item.award_detail[0].award_type==1">
                                            <tr v-for="(item_t, index_t) in refactor_coupon_arr(item.award_detail[0].award)" :key="index_t">
                                                <td>@{{item.num_limit}}人阶梯奖励</td>
                                                <td>@{{return_award_type(item.award_detail[0].award_type)}}</td>
                                                <td>@{{get_coupon_name(item_t)}}</td>
                                                <td>@{{item_t.length}}</td>
                                            </tr>
                                        </template>
                                        <tr v-else>
                                            <td>@{{item.num_limit}}人阶梯奖励</td>
                                            <td>@{{return_award_type(item.award_detail[0].award_type)}}</td>
                                            <td>@{{item.award_detail[0].award}}积分</td>
                                            <td>1</td>
                                        </tr>
                                    </template>
                                </template>
                            </tbody>
                        </table>
                    </div>
                    <div class="mess_list">
                        <caption class="caption">
                            <div class="award_title" style="margin-top:25px">被邀人奖励</div>
                        </caption>
                        <table class="wcc_table">
                            <thead>
                                <tr>
                                    <th>奖励来源</th>
                                    <th>奖励类型</th>
                                    <th>奖励内容</th>
                                    <th>奖品数量</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="!active_data.invitee_award_config.award_detail">
                                    <th>接受邀请</th>
                                    <th>无奖励</th>
                                    <th>-</th>
                                    <th>-</th>
                                </tr>
                                <template v-else-if="active_data.invitee_award_config.award_detail[0].award_type==1">
                                    <tr v-for="(item, index) in refactor_coupon_arr(active_data.invitee_award_config.award_detail[0].award)" :key="index">
                                        <td>接受邀请</td>
                                        <td>@{{return_award_type(active_data.invitee_award_config.award_detail[0].award_type)}}</td>
                                        <td>@{{get_coupon_name(item)}}</td>
                                        <td>@{{item.length}}</td>
                                    </tr>
                                </template>
                                <template v-else-if="active_data.invitee_award_config.award_detail[0].award_type==7">
                                    <tr v-for="(item_t, index_t) in active_data.invitee_award_config.award_detail[0].award" :key="index_t">
                                        <td>接受邀请</td>
                                        <td>@{{return_award_type(active_data.invitee_award_config.award_detail[0].award_type)}}</td>
                                        <td>@{{get_oil_name(item_t.id)}}每升@{{item_t.money}}毛</td>
                                        <td>1</td>
                                    </tr>
                                </template>
                                <template v-else>
                                    <tr>
                                        <td>接受邀请</td>
                                        <td>@{{return_award_type(active_data.invitee_award_config.award_detail[0].award_type)}}</td>
                                        <td>@{{active_data.invitee_award_config.award_detail[0].award}}积分</td>
                                        <td>1</td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                    <div v-if="active_data.status==1" class="edit_btn">
                        <button class="wcc_btn_fat_green edit_btn_left" v-on:click="delete_activity(active_data.activity_id)">删除</button>
                        <a class="wcc_btn_fat_green" v-on:click="modify_time" href="#select_time">修改</a>
                    </div>
                    <div v-else-if="active_data.status==2" class="edit_btn">
                        <a class="wcc_btn_fat_green edit_btn_left" v-on:click="delay_activity(false)" href="#select_time">延迟结束</a>
                        <a class="wcc_btn_fat_green" v-on:click="delay_activity(true,'over')">立即结束</a>
                    </div>
                    <div v-else class="edit_btn">
                        <a class="wcc_btn_fat_green edit_btn_left" :href="'/InviteFriend/inviteDetail?activity_id='+active_data.activity_id+'&activity_name='+active_data.activity_name">数据详情</a>
                        <a class="wcc_btn_fat_green" :href="'/InvitingAnalysis?code=' + active_data.activity_code+'&type='+active_data.activity_type" target="_blank">数据统计</a>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <p>没有有效的活动id</p>
        </div>
    </div>
@endsection

@section('footer')
    <script>
        var station_select = {!!json_encode($station_arr_selected)!!};
    </script>
	<script src="/js/vue_component.js?v={{config('constants.wcc_file_version')}}"></script>
	<script src="/js/vendor/Plug/Plug.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/InviteFriend/info_new.js?v={{config('constants.wcc_file_version')}}"></script>
@endsection