@extends('layout/master')

@section('header')
    <link rel="stylesheet" href="/css/wcc.css?v={{config('constants.wcc_file_version')}}" />
    <link rel="stylesheet" href="/css/wecar.css?v={{config('constants.wcc_file_version')}}" />
    <link rel="stylesheet" href="/css/mp.css?v={{config('constants.wcc_file_version')}}" />
    <link rel="stylesheet" href="/css/InviteFriend/create.css?v={{config('constants.wcc_file_version')}}" />
@endsection

@section('content')
<div id="data_box">
    <wcc-switch	v-bind:add='tab_arr' type='2' v-bind:selected='tab_selected' v-if="tab_selected!=4"></wcc-switch>
    <div v-show="tab_selected==0">
        <!-- 第一步 -->
        <div class="data_box_one data_box_list">
            <div class="form_list">
                <p class="form_list_title">活动名称</p>
                <input type="text" name="" class="wcc_input active_name" v-bind:class="{'wcc_input_error':error_data.aictive_error}" v-model="post_mss.activity_name" value="" placeholder="请输入活动名称" v-on:focus="error_data.aictive_error=false">
                <div class="wcc_error" v-if="error_data.aictive_error">
                    <span class='iconfont'><i>&#xe674;</i></span> 
                    <span>请输入活动名称</span>
                </div>
            </div>
            <div class="form_list" style="margin-bottom: 30px;">
                <p class="form_list_title">活动日期</p>
                <div class="wcc_selectStation_box wcc_time wcc_width343" itshow="0" v-bind:class="{'wcc_input_error':error_data.time_error}">
                    <i class="wcc_calendar"></i>
                    <div class="input_box">
                        <input id="select_time" type="text" name="" value="" placeholder="" v-on:focus="error_data.time_error=false">
                    </div>
                </div>
            </div>
            <div class="form_list form_list_46">
                <p class="form_list_title">活动类型</p>
                <label for="active_type_radio1" class="wcc_label">
                    <input type="radio" id="active_type_radio1" name="active_type" value='1' v-model="post_mss.activity_type">
                    <span class="wcc_label_radio"><i></i></span>
                    <span class='text'>一级邀请</span>
                </label>
                <label for="active_type_radio2" class="wcc_label wcc_label_uni" style="transform: translateY(0px);z-index:9;">
                    <input type="radio" id="active_type_radio2" name="active_type" value='2' v-model="post_mss.activity_type">
                    <span class="wcc_label_radio"><i></i></span>
                    <div class="li_title text">二级邀请
                        <div class="statistics_ask wcc_hover">
                            <i class="fonticon">&#xe659;</i> 
                            <div class="wcc_tips wcc_tips_top wcc_tips_top2">
                                <div class="wcc_tips_top2_text2">
                                    <p class=content_hover>用户A邀请用户B，用户B邀请用户C</p>
                                    <p class=content_hover>·二级邀请会对A进行奖励</p>
                                    <p class="content_hover">·一级邀请不会对A进行奖励</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </label>
                <!-- 宝鸡的时候才展示 -->
                <label for="active_type_radio3" class="wcc_label">
                    <input type="radio" id="active_type_radio3" name="active_type" value='5' v-model="post_mss.activity_type">
                    <span class="wcc_label_radio"><i></i></span>
                    <span class='text'>代理商模式</span>
                </label>
            </div>
            <div class="form_list form_list_46">
                <p class="form_list_title">邀请人资格设置</p>
                <label for="avalible_user_type_radio1" class="wcc_label">
                    <input type="radio" id="avalible_user_type_radio1" name="avalible_user_type" value='1' v-model="post_mss.inviter_config.rule[0].avalible_user_type">
                    <span class="wcc_label_radio"><i></i></span>
                    <span class='text'>所有用户</span>
                </label>
                <label for="avalible_user_type_radio2" class="wcc_label">
                    <input type="radio" id="avalible_user_type_radio2" name="avalible_user_type" value='2' v-model="post_mss.inviter_config.rule[0].avalible_user_type">
                    <span class="wcc_label_radio"><i></i></span>
                    <span class='text'>加过油用户</span>
                </label>
                <label for="avalible_user_type_radio3" class="wcc_label">
                    <input type="radio" id="avalible_user_type_radio3" name="avalible_user_type" value='12' v-model="post_mss.inviter_config.rule[0].avalible_user_type">
                    <span class="wcc_label_radio"><i></i></span>
                    <span class='text'>已注册集团会员的用户</span>
                </label>
                <!-- 宝鸡的时候才展示 -->
                <label for="avalible_user_type_radio4" class="wcc_label" v-if="post_mss.activity_type==5">
                    <input type="radio" id="avalible_user_type_radio4" name="avalible_user_type" value='31' v-model="post_mss.inviter_config.rule[0].avalible_user_type">
                    <span class="wcc_label_radio"><i></i></span>
                    <span class='text'>经油站认证的代理商</span>
                </label>
            </div>
            <div class="form_list form_list_46">
                <p class="form_list_title">被邀人资格设置</p>
                <label for="invitee_config_radio1" class="wcc_label">
                    <input type="radio" id="invitee_config_radio1" name="invitee_config" value='1' v-model="post_mss.invitee_config.rule[0].avalible_user_type">
                    <span class="wcc_label_radio"><i></i></span>
                    <span class='text'>未加过油用户</span>
                </label>
                <label for="invitee_config_radio2" class="wcc_label">
                    <input type="radio" id="invitee_config_radio2" name="invitee_config" value='11' v-model="post_mss.invitee_config.rule[0].avalible_user_type">
                    <span class="wcc_label_radio"><i></i></span>
                    <span class='text'>未注册集团会员的用户</span>
                </label>
            </div>
        </div>
        <div class="setp_one">
            <button class="wcc_btn_fat_green" v-on:click="next_step">下一步</button>
        </div>
    </div>
    <div v-if="tab_selected==1">
        <!-- 第二步 -->
        <div class="data_box_two data_box_list">
            <div class="data_box_two_left data_box_two_contain">
                <p class="title">页面预览</p>
                <div class="preview">
                    <p class="page_title">@{{post_mss.activity_desc_config.page_title}}</p>
                    <p class="page_title_info">@{{post_mss.activity_desc_config.page_title_info}}</p>
                </div>
            </div>
            <div class="data_box_two_right data_box_two_contain">
                <div class="content">
                    <p class="title">邀请页页面设置</p>
                    <div class="content_list content_list_two one">
                        <div class="input_list">
                            <p class="form_list_title">页面标题</p>
                            <input type="text" name="" class="wcc_input page_title" v-bind:class="{'wcc_input_error':error_data.page_title}" v-model="post_mss.activity_desc_config.page_title" value="" placeholder="请输入页面标题" v-on:focus="error_data.page_title=false">
                            <span class="text_num">@{{post_mss.activity_desc_config.page_title.length}}/15</span>
                            <div class="wcc_error_box" v-if="error_data.page_title">
                                <div class="wcc_error">
                                    <span class='iconfont'><i>&#xe674;</i></span> 
                                    <span>请输入页面标题</span>
                                </div>
                            </div>
                        </div>
                        <div class="input_list">
                            <p class="form_list_title">主标语</p>
                            <input type="text" name="" class="wcc_input page_title_info" v-bind:class="{'wcc_input_error':error_data.page_title_info}" v-model="post_mss.activity_desc_config.page_title_info" value="" placeholder="请输入主标语，例：领加油礼包" v-on:focus="error_data.page_title_info=false">
                            <span class="text_num">@{{post_mss.activity_desc_config.page_title_info.length}}/8</span>
                            <div class="wcc_error_box" v-if="error_data.page_title_info">
                                <div class="wcc_error">
                                    <span class='iconfont'><i>&#xe674;</i></span> 
                                    <span>请输入主标语</span>
                                </div>
                            </div>
                        </div>
                        <div class="input_list">
                            <p class="form_list_title activity_rule_desc">活动规则</p>
                            <textarea  type="text" name="" class="wcc_textarea wcc_input activity_rule_desc public_scrollBrowser" v-bind:class="{'wcc_input_error':error_data.activity_rule_desc}" v-model="post_mss.activity_desc_config.activity_rule_desc" placeholder="请输入活动规则" v-on:focus="error_data.activity_rule_desc=false"></textarea >
                            <p class="rule_back" v-on:click="rule_back">恢复默认</p>
                            <div class="wcc_error_box" v-if="error_data.activity_rule_desc">
                                <div class="wcc_error">
                                    <span class='iconfont'><i>&#xe674;</i></span> 
                                    <span>活动规则不可为空</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="input_list margin_top_28 margin_bottom_0 title">
                        <div class="li_title text font_14">好友接受邀请时的通知与奖励
                            <div class="statistics_ask wcc_hover">
                                <i class="fonticon">&#xe659;</i> 
                                <div class="wcc_tips wcc_tips_top wcc_tips_top2">
                                    <div class="wcc_tips_top2_text2">
                                        <p class=content_hover>好友接受邀请时，给邀请人发放通知与奖励，鼓励邀请人引导其好友完成邀请并获得奖励。</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="content_list content_list_two two">
                        <div class="input_list input_list_select">
                            <p class="form_list_title form_list_title_one">邀请人奖励设置</p>
                            <div class="select_box" v-for="(item, index) in award_detail_num.one" :key="index">
                                <select-radio v-bind:add="inviter_award" v-on:selected="select_inviter_award($event,'one',item)" v-bind:search-input="false" v-bind:class="{'wcc_input_error':error_data.inviter_award_err_obj.one[item].inviter_award}" v-bind:radio='award_detail_select.one.first.inviter_award_index' v-bind:select="inviter_award[award_detail_select.one.first.inviter_award_index]?inviter_award[award_detail_select.one.first.inviter_award_index]:'请选择奖励内容'"></select-radio>
                                <div class="select_input_box" v-if="award_detail_select.one.first.inviter_award_index == 1">
                                    <div class="wcc_btn_fat_bor_ash btn_10" style="padding: 10px 10px;" v-on:click="select_coupon(['one','first'])" v-bind:class="{'wcc_input_error':error_data.inviter_award_err_obj.one[item].inviter_award_content}">抵用券设置</div>
                                    <span>@{{coupon_type_num.one.first.type}}种，共@{{coupon_type_num.one.first.num}}张</span>
                                </div>
                                <div class="select_input_box" v-if="award_detail_select.one.first.inviter_award_index == 2">
                                    <span>奖励</span>
                                    <input type="number" class="wcc_input width_60" v-model="post_mss.inviter_award_when_accept_config.award_detail[index].award" v-bind:class="{'wcc_input_error':error_data.inviter_award_err_obj.one[item].inviter_award_content}" v-on:focus="error_data.inviter_award_err_obj.one[item].inviter_award_content=false">
                                    <span>个积分</span>
                                </div>
                                <div class="select_input_box" v-if="award_detail_select.one.first.inviter_award_index == 3">
                                    <span>奖励</span>
                                    <input type="number" class="wcc_input width_60" v-model="post_mss.inviter_award_when_accept_config.award_detail[index].award" v-bind:class="{'wcc_input_error':error_data.inviter_award_err_obj.one[item].inviter_award_content}" v-on:focus="error_data.inviter_award_err_obj.one[item].inviter_award_content=false">
                                    <span>个积分和经验值</span>
                                </div>
                                <div class="wcc_error_box" style="margin-left:0;width:150px;" v-if="error_data.inviter_award_err_obj.one[item].inviter_award||error_data.inviter_award_err_obj.one[item].inviter_award_content">
                                    <div class="wcc_error" style="margin-top:5px">
                                        <span class='iconfont'><i>&#xe674;</i></span> 
                                        <span>请选择奖励内容</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="input_list input_list_select notice">
                            <p class="form_list_title" style="float: left;line-height: 25px;">接受邀请自动通知邀请人</p>
                            <div class="notice_btn" v-on:click="change_notice('accept_invitation')" v-bind:class="{dont_notice:post_mss.sms_config.accept_invitation.is_send_inviter==0}">
                                <div class="notice_btn_cir" v-bind:class="{dont_notice:post_mss.sms_config.accept_invitation.is_send_inviter==0}"></div>
                            </div>
                            <div class="statistics_ask wcc_hover notice_wcc_hover" v-if="post_mss.sms_config.accept_invitation.is_send_inviter==1">
                                <i class="fonticon">&#xe67f;</i>  
                                <div class="wcc_tips wcc_tips_top wcc_tips_top2">
                                    <div class="wcc_tips_top2_text2">
                                        <p class=content_hover>{用户手机号}已接受您的邀请，关注他的状态，尽快让他去{油站地址}加油吧。</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="input_list margin_top_28 margin_bottom_0 title">
                        <div class="li_title text font_14">好友完成邀请时的通知与奖励
                            <div class="statistics_ask wcc_hover">
                                <i class="fonticon">&#xe659;</i> 
                                <div class="wcc_tips wcc_tips_top wcc_tips_top2">
                                    <div class="wcc_tips_top2_text2">
                                        <p class=content_hover>好友完成邀请后，会给邀请人发放通知与奖励，鼓励邀请人继续邀请别的好友</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="content_list content_list_two three">
                        <div class="input_list form_list">
                            <p class="form_list_title middle">完成邀请条件</p>
                            <label for="success_type_radio1" class="wcc_label middle">
                                <input type="radio" id="success_type_radio1" name="success_type" value='3' v-model="invite_success_config_con">
                                <span class="wcc_label_radio"><i></i></span>
                                <span class='text'>注册成为油站会员</span>
                            </label>
                            <label for="success_type_radio2" class="wcc_label middle">
                                <input type="radio" id="success_type_radio2" name="success_type" value='1' v-model="invite_success_config_con">
                                <span class="wcc_label_radio"><i></i></span>
                                <span class='text'>在有效期内加油满足条件</span>
                            </label>
                        </div>
                        <!-- 有效期内加油满足条件start -->
                        <div v-if="invite_success_config_con==1" class="add_oil_active">
                            <div class="input_list form_list">
                                <p class="form_list_title middle">邀请有效时间</p>
                                <div class="select_box">
                                    <span>在接受邀请的</span><input type="number" v-model="post_mss.valid_time_config.amount" class="day_limit wcc_input width_60" v-bind:class="{'wcc_input_error':error_data.valid_time_config_amount}" v-on:focus="error_data.valid_time_config_amount=false"><span>天内</span>
                                </div>
                                <div class="wcc_error_box" style="width:150px;" v-if="error_data.valid_time_config_amount">
                                    <div class="wcc_error" style="margin-top:5px">
                                        <span class='iconfont'><i>&#xe674;</i></span> 
                                        <span>请输入整数天数</span>
                                    </div>
                                </div>
                            </div>
                            <div class="input_list form_list">
                                <p class="form_list_title middle" style="margin-top:-16px;">加油门槛</p>
                                <div class="select_box select_box_oil" v-for="(item, index) in post_mss.invite_success_config.rule" :key="index">
					                <select-radio v-bind:add="return_oil_list(index)" v-bind:model="true" v-bind:search-input="false"  v-bind:radio="check_oil_select(item,index,'index')" v-bind:select="check_oil_select(item,index,'name')" v-on:selected="select_oil($event,index)" class="select_uni"></select-radio>
                                    <select-radio v-bind:add="return_oil_type()" v-bind:model="true" v-bind:search-input="false" v-bind:radio="check_price_select(item,index,'index')" v-bind:select="check_price_select(item,index,'name')" v-on:selected="select_price($event,index)" class="select_uni"></select-radio>
                                    <div class="price_input">
                                        <span>满</span>
                                        <input type="number" class="wcc_input width_60" v-model="item.limit_amount">
                                        <span>元（升）</span>
                                        <span class="repeat-type-del delete_condition" v-if="post_mss.invite_success_config.rule.length>1" v-on:click="delete_oil_select(index)"><i>&#xe66f;</i></span>
                                    </div>
                                </div>
                                <a href="javascript:;" class="add_condition" v-on:click="add_oil_select" v-bind:class="{'no_add':post_mss.invite_success_config.rule[0].limit_id==0}">&nbsp;&nbsp;添加</a>
                            </div>
                        </div>
                        <!-- 有效期内加油满足条件end -->
                        <div class="input_list input_list_select" v-for="(item, index) in award_detail_num.two" :key="index">
                            <p class="form_list_title form_list_title_one">@{{Object.keys((award_detail_num.two)).length>1?(item=='first'?'一级'+invitation_text:'二级'+invitation_text):invitation_text}}</p>
                            <div class="select_box">
                                <select-radio v-bind:add="inviter_award_add" v-on:selected="select_inviter_award($event,'two',item)" v-bind:search-input="false" v-bind:class="{'wcc_input_error':error_data.inviter_award_err_obj.two[item].inviter_award}"  v-bind:radio="award_detail_select.two[item].inviter_award_index" v-bind:select="inviter_award_add[award_detail_select.two[item].inviter_award_index]?inviter_award_add[award_detail_select.two[item].inviter_award_index]:'请选择奖励内容'"></select-radio>
                                <div class="select_input_box" v-if="award_detail_select.two[item].inviter_award_index == 1">
                                    <div class="wcc_btn_fat_bor_ash btn_10" style="padding: 10px 10px;" v-on:click="select_coupon(['two',item])" v-bind:class="{'wcc_input_error':error_data.inviter_award_err_obj.two[item].inviter_award_content}">抵用券设置</div>
                                    <span>@{{coupon_type_num.two[item].type}}种，共@{{coupon_type_num.two[item].num}}张</span>
                                </div>
                                <div class="select_input_box" v-if="award_detail_select.two[item].inviter_award_index == 2">
                                    <span>奖励</span>
                                    <input type="number" class="wcc_input width_60" v-model="post_mss.inviter_award_config.award_detail[index].award" v-bind:class="{'wcc_input_error':error_data.inviter_award_err_obj.two[item].inviter_award_content}" v-on:focus="error_data.inviter_award_err_obj.two[item].inviter_award_content=false">
                                    <span>个积分</span>
                                </div>
                                <div class="select_input_box" v-if="award_detail_select.two[item].inviter_award_index == 100">
                                    <span>奖励</span>
                                    <input type="number" class="wcc_input width_60" v-model="post_mss.inviter_award_config.award_detail[index].award" v-bind:class="{'wcc_input_error':error_data.inviter_award_err_obj.two[item].inviter_award_content}" v-on:focus="error_data.inviter_award_err_obj.two[item].inviter_award_content=false">
                                    <span>个积分和经验值</span>
                                </div>
                                <div class="select_input_box" v-if="award_detail_select.two[item].inviter_award_index == 3">
                                    <select-radio v-bind:add="red_package" v-on:selected="select_red_package($event,'two',item)" v-bind:search-input="false" v-bind:class="{'wcc_input_error':error_data.inviter_award_err_obj.two[item].inviter_award_content}" v-bind:radio="return_red_radio(item)" v-bind:select="return_red_select(item)"></select-radio>
                                    <span v-if="red_package.length==0" class="red_package_prompt">若无可用的微信现金红包，请联系客户经理配置</span>                                                      
                                </div>
                                <div class="wcc_error_box" style="margin-left:0;width:150px;" v-if="error_data.inviter_award_err_obj.two[item].inviter_award||error_data.inviter_award_err_obj.two[item].inviter_award_content">
                                    <div class="wcc_error" style="margin-top:5px">
                                        <span class='iconfont'><i>&#xe674;</i></span> 
                                        <span>请选择奖励内容</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="input_list input_list_select notice">
                            <p class="form_list_title" style="float: left;line-height: 25px;">完成邀请自动通知邀请人</p>
                            <div class="notice_btn" v-on:click="change_notice('success_invitation')" v-bind:class="{dont_notice:post_mss.sms_config.success_invitation.is_send_inviter==0}">
                                <div class="notice_btn_cir" v-bind:class="{dont_notice:post_mss.sms_config.success_invitation.is_send_inviter==0}"></div>
                            </div>
                            <div class="statistics_ask wcc_hover notice_wcc_hover" v-if="post_mss.sms_config.success_invitation.is_send_inviter==1">
                                <i class="fonticon">&#xe67f;</i>  
                                <div class="wcc_tips wcc_tips_top wcc_tips_top2">
                                    <div class="wcc_tips_top2_text2">
                                        <p class=content_hover>您已成功邀请{用户手机尾号}去加油，奖励发送到您的账户。快去邀请更多好友获取更多奖励吧</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="input_list input_list_select notice" style="min-height:initial;">
                            <p class="form_list_title" style="float: left;line-height: 25px;font-weight:700;">阶梯奖励设置</p>
                            <div class="notice_btn" v-on:click="change_notice('extra_award_config')" v-bind:class="{dont_notice:extra_award_config==0}">
                                <div class="notice_btn_cir" v-bind:class="{dont_notice:extra_award_config==0}"></div>
                            </div>
                            <div class="statistics_ask wcc_hover notice_wcc_hover" v-if="extra_award_config==1">
                                <i class="fonticon">&#xe67f;</i>  
                                <div class="wcc_tips wcc_tips_top wcc_tips_top2">
                                    <div class="wcc_tips_top2_text2">
                                        <p class=content_hover>直接邀请人成功邀请好友的数量达到一定数量时，给直接邀请人发放阶梯奖励</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 阶梯奖励start -->
                    <div class="content_list content_list_two four" v-if="post_mss.inviter_award_config.extra_award_config">
                        <div class="input_list form_list">
                            <p class="form_list_title middle" style="margin-top:-16px;">奖励设置</p>
                            <div class="select_box select_box_extra" v-for="(item, index) in award_detail_num.three" :key="index">
                                <span class="extra_award_title">成功邀请</span><input type="text" class="wcc_input width_60 extra_award_input" v-model.lazy="post_mss.inviter_award_config.extra_award_config.extra_award_detail[index].num_limit" v-on:input="number_input_limit($event)"><span class="extra_award_title">人，</span>
                                <select-radio v-bind:add="return_inviter_award_t()" v-on:selected="select_inviter_award($event,'three',item,index)" v-bind:search-input="false" v-bind:class="{'wcc_input_error':error_data.inviter_award_err_obj.three[item].inviter_award}" v-bind:radio='award_detail_select.three[item].inviter_award_index-1' v-bind:select="inviter_award_t[award_detail_select.three[item].inviter_award_index-1]"></select-radio>
                                <div class="select_input_box" v-if="award_detail_select.three[item].inviter_award_index == 1">
                                    <div class="wcc_btn_fat_bor_ash btn_10" style="padding: 10px 10px;" v-on:click="select_coupon(['three',item])" v-bind:class="{'wcc_input_error':error_data.inviter_award_err_obj.three[item].inviter_award_content}">抵用券设置</div>
                                    <span>@{{coupon_type_num.three[item].type}}种，共@{{coupon_type_num.three[item].num}}张</span>                                
                                </div>
                                <div class="select_input_box" v-if="award_detail_select.three[item].inviter_award_index == 2">
                                    <span>奖励</span>
                                    <input type="number" class="wcc_input width_60" v-model.lazy="post_mss.inviter_award_config.extra_award_config.extra_award_detail[index].award_detail[0].award" v-bind:class="{'wcc_input_error':error_data.inviter_award_err_obj.three[item].inviter_award_content}" v-on:focus="error_data.inviter_award_err_obj.three[item].inviter_award_content=false">
                                    <span>个积分</span>
                                </div>
                                <div class="select_input_box" v-if="award_detail_select.three[item].inviter_award_index == 3">
                                    <span>奖励</span>
                                    <input type="number" class="wcc_input width_60" v-model.lazy="post_mss.inviter_award_config.extra_award_config.extra_award_detail[index].award_detail[0].award" v-bind:class="{'wcc_input_error':error_data.inviter_award_err_obj.three[item].inviter_award_content}" v-on:focus="error_data.inviter_award_err_obj.three[item].inviter_award_content=false">
                                    <span>个积分和经验值</span>
                                </div>
                                <span class="repeat-type-del delete_condition padding_10" v-if="post_mss.inviter_award_config.extra_award_config.extra_award_detail.length>1" v-on:click="delete_extra_award(item,index)"><i>&#xe66f;</i></span>
                                <div class="wcc_error_box" style="margin-left:0;width:150px;" v-if="error_data.inviter_award_err_obj.three[item].inviter_award||error_data.inviter_award_err_obj.three[item].inviter_award_content">
                                    <div class="wcc_error" style="margin-top:5px">
                                        <span class='iconfont'><i>&#xe674;</i></span> 
                                        <span>请选择奖励内容</span>
                                    </div>
                                </div>
                            </div>
                            <a href="javascript:;" class="add_condition" v-on:click="add_extra_award" v-bind:class="{'no_add':post_mss.inviter_award_config.extra_award_config.extra_award_detail.length>4}">&nbsp;&nbsp;添加</a>
                        </div>
                    </div>
                    <!-- 阶梯奖励end -->
                </div>
            </div>
        </div>
        <div class="setp_two step">
            <button class="wcc_btn_fat_green" v-on:click="pre_step">上一步</button>
            <button class="wcc_btn_fat_green" v-on:click="next_step">下一步</button>
        </div>
    </div>
    <div v-else-if="tab_selected==2" style="min-height: 650px;">
        <!-- 第三步 -->
        <div class="data_box_three data_box_list">
            <div class="data_box_two_left data_box_two_contain">
                <p class="title">页面预览</p>
                <div class="preview preview_one">
                    <p class="page_title">@{{post_mss.activity_desc_config.page_title}}</p>
                    <p class="page_title_info">@{{post_mss.activity_desc_config.page_title_info}}</p>
                </div>
            </div>
            <div class="data_box_three_right data_box_three_contain">
                <div class="content">
                    <div class="input_list margin_top_28 margin_bottom_0 title">
                        <div class="li_title text font_14">好友接受邀请时的通知与奖励
                            <div class="statistics_ask wcc_hover">
                                <i class="fonticon">&#xe659;</i> 
                                <div class="wcc_tips wcc_tips_top wcc_tips_top2">
                                    <div class="wcc_tips_top2_text2">
                                        <p class="content_hover">好友接受邀请时，给被邀人发放通知与奖励，鼓励被邀人进一步完成邀请。</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="content_list content_list_three three">
                    <div class="input_list input_list_select">
                        <p class="form_list_title form_list_title_one">被邀人奖励设置</p>
                        <div class="select_box" v-for="(item, index) in award_detail_num.four" :key="index">
                            <select-radio v-bind:add="return_inviter_award_f()" v-on:selected="select_inviter_award($event,'four',item)" v-bind:search-input="false" v-bind:class="{'wcc_input_error':error_data.inviter_award_err_obj.four[item].inviter_award}" v-bind:radio='award_detail_select.four[item].inviter_award_index' v-bind:select="return_inviter_award_f()[award_detail_select.four[item].inviter_award_index]?return_inviter_award_f()[award_detail_select.four[item].inviter_award_index]:'请选择奖励内容'"></select-radio>
                            <div v-if="award_detail_select.four[item].inviter_award_index == 3" class="clear_both"></div>
                            <div class="select_input_box" v-if="award_detail_select.four[item].inviter_award_index == 1">
                                <div class="wcc_btn_fat_bor_ash btn_10" style="padding: 10px 10px;" v-on:click="select_coupon(['four',item])" v-bind:class="{'wcc_input_error':error_data.inviter_award_err_obj.four[item].inviter_award_content}">抵用券设置</div>
                                <span>@{{coupon_type_num.four[item].type}}种，共@{{coupon_type_num.four[item].num}}张</span>
                            </div>
                            <div class="select_input_box" v-if="award_detail_select.four[item].inviter_award_index == 2">
                                <span>奖励</span>
                                <input type="number" class="wcc_input width_60" v-model="post_mss.invitee_award_config.award_detail[index].award" v-bind:class="{'wcc_input_error':error_data.inviter_award_err_obj.four[item].inviter_award_content}" v-on:focus="error_data.inviter_award_err_obj.four[item].inviter_award_content=false">
                                <span>个积分</span>
                            </div>
                            <div class="select_input_box" v-if="award_detail_select.four[item].inviter_award_index == 100">
                                <span>奖励</span>
                                <input type="number" class="wcc_input width_60" v-model="post_mss.invitee_award_config.award_detail[index].award" v-bind:class="{'wcc_input_error':error_data.inviter_award_err_obj.four[item].inviter_award_content}" v-on:focus="error_data.inviter_award_err_obj.four[item].inviter_award_content=false">
                                <span>个积分和经验值</span>
                            </div>
                            <!-- 积分和经验值暂时没有，所以下面的inviter_award_index改为3 -->
                            <div class="select_input_box" v-if="award_detail_select.four[item].inviter_award_index == 3">
                                <div class="select_box select_box_oil select_box_oil_uni" v-for="(item, index) in post_mss.invitee_award_config.award_detail[0].award" :key="index">
					                <select-radio v-bind:add="return_oil_list(index)" v-bind:model="true" v-bind:search-input="false"  v-bind:radio="check_oil_select(item,index,'index')" v-bind:select="check_oil_select(item,index,'name')" v-on:selected="select_oil_t($event,index)" class="select_uni"></select-radio>
                                    <div class="price_input">
                                        <span>优惠</span>
                                        <input class="wcc_input width_60" v-model.lazy="item.money" v-on:input="number_input_limit($event)" style="width: 70px;box-sizing: border-box;">
                                        <span>毛（升）</span>
                                        <span class="repeat-type-del delete_condition" v-if="post_mss.invitee_award_config.award_detail[0].award.length>1" v-on:click="delete_oil_select_t(index)"><i>&#xe66f;</i></span>
                                    </div>
                                </div>
                                <a href="javascript:;" class="add_condition" style="margin-left:0;margin-top:16px;" v-on:click="add_oil_select_t" v-bind:class="{'no_add':post_mss.invitee_award_config.award_detail[0].award[0].id==0}">&nbsp;&nbsp;添加</a>
                            </div>
                            <div class="wcc_error_box" style="margin-left:0;width:150px;" v-if="error_data.inviter_award_err_obj.four[item].inviter_award||error_data.inviter_award_err_obj.four[item].inviter_award_content">
                                <div class="wcc_error" style="margin-top:5px">
                                    <span class='iconfont'><i>&#xe674;</i></span> 
                                    <span>请选择奖励内容</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="input_list input_list_select notice">
                        <p class="form_list_title" style="float: left;line-height: 25px;">接受邀请自动通知被邀人</p>
                        <div class="notice_btn" v-on:click="change_notice('accept_invitation','is_send_invitee')" v-bind:class="{dont_notice:post_mss.sms_config.accept_invitation.is_send_invitee==0}">
                            <div class="notice_btn_cir" v-bind:class="{dont_notice:post_mss.sms_config.accept_invitation.is_send_invitee==0}"></div>
                        </div>
                        <div class="statistics_ask wcc_hover notice_wcc_hover" v-if="post_mss.sms_config.accept_invitation.is_send_invitee==1">
                            <i class="fonticon">&#xe67f;</i>  
                            <div class="wcc_tips wcc_tips_top wcc_tips_top2">
                                <div class="wcc_tips_top2_text2">
                                    <p class=content_hover>您已接受{用户手机尾号}的邀请，尽快去{油站地址}加油完成邀请回馈好友吧。</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="setp_three step">
            <button class="wcc_btn_fat_green" v-on:click="pre_step">上一步</button>
            <button class="wcc_btn_fat_green" v-on:click="next_step">下一步</button>
        </div>
    </div>
    <div v-else-if="tab_selected==3" style="min-height: 650px;">
        <!-- 第四步 -->
        <div class="data_box_four data_box_list">
            <div class="data_box_two_left data_box_two_contain">
                <p class="title">页面预览</p>
                <div class="preview preview_four">
                    <p class="page_title">@{{post_mss.activity_desc_config.activity_share_title}}</p>
                    <img v-bind:src="post_mss.activity_desc_config.activity_share_img_url" class="share_logo_2" alt="分享logo">
                </div>
            </div>
            <div class="data_box_four_right data_box_four_contain">
                <div class="content">
                    <p class="title">分享设置</p>
                    <div class="content_list content_list_four four">
                        <div class="input_list input_list_select">
                            <p class="form_list_title form_list_title_four">分享标题</p>
                            <input type="text" name="" class="wcc_input page_title width_344" v-bind:class="{'wcc_input_error':error_data.activity_share_title}" v-model="post_mss.activity_desc_config.activity_share_title" placeholder="请输入分享标题" v-on:focus="error_data.activity_share_title=false">
                            <div class="wcc_error_box" v-if="error_data.activity_share_title">
                                <div class="wcc_error">
                                    <span class='iconfont'><i>&#xe674;</i></span> 
                                    <span>请输入分享标题</span>
                                </div>
                            </div>
                        </div>
                        <div class="input_list input_list_select">
                            <p class="form_list_title form_list_title_four" style="vertical-align: top;">分享logo</p>
                            <div class="img_box">
                                <img v-bind:src="post_mss.activity_desc_config.activity_share_img_url" class="share_logo" alt="分享logo">
                            </div>
                            <div>
                                <label class="wcc_btn_fat_bor_ash up_load_img_label" for="up_load_img">重新上传</label>
                                <p class="prompt_upload">要求：1M以内，格式bmp、png、jpeg、jpg、gif；尺寸不小于200*200px的正方形</p>
                            </div>
                            <input type="file" id="up_load_img" accept="image/*" v-on:change="upload_img($event)">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="setp_four step" style="margin-left: 514px;">
            <button class="wcc_btn_fat_green" v-on:click="pre_step">上一步</button>
            <button class="wcc_btn_fat_green" v-on:click="next_step">创建</button>
        </div>
    </div>
    <!-- 创建成功 -->
    <div v-else-if="tab_selected==4" class="create-success-box">
		<div class="created-link">
			<div class="created-header">
				<div class="created-succ-icon"><i class="fonticon">&#xe65a;</i></div>
				<div class="created-title">创建成功</div>
			</div>
			<div>
				活动链接<input id="scan_code" class="wcc_input created-activity-link created_activity_link" type="text" :value="success_url"><a class="copy-link-btn" v-on:click="copyUrl(success_url)" href="javascript:;">复制</a>
			</div>
		</div>
		<div class="share-list-box" style="text-align: center;">
			<div class="share-box">
				<div class="share-box-title">
					设置公众号
				</div>
				<div class="share-sub-title">
					将活动链接设置到公众号菜单，让更多人参与活动
				</div>
				<div class="share-tip-img">
					<img src="https://fs1.weicheche.cn/activity/origin/2018030311170320491.png" alt="">
				</div>
				<div class="share-box-footer">
					<a class="wcc_btn_fat_bor_green" href="/Weixin/menu" target="_blank">将活动设置到公众号菜单</a>
				</div>
			</div>
			<div class="share-box">
				<div class="share-box-title">
					活动二维码
				</div>
				<div class="share-sub-title">
					下载活动二维码并打印，通过扫码让更多用户参与活动
				</div>
				<div class="share-tip-img">
					<div class="activity_code">

					</div>
				</div>
				<div class="share-box-footer">
					<a class="wcc_btn_fat_bor_green" id="download_qrcode" href="" download="活动二维码.png">下载二维码</a>
				</div>
			</div>
		</div>
	</div>
</div>
@endsection


@section('elastic')
    <div id="coupon_list_page" v-if="coupon_show" v-on:click.stop="close_itshow">
        <div class="content_box">
            <div class="banner">
                <p class="title">选择营销券</p>
                <!-- <i class="colse_icon" v-on:click="colse_coupon_list_page">&#xe666;</i> -->
            </div>
            <div class="content">
                <div class="coupon_select_box">
                    优惠券
                    <div class="wcc_selectStation_box select_coupon_radio" :itshow="itshow" v-on:click.stop="open_itshow">
                        <em v-on:click.stop="change_itshow">选择优惠券<span v-if="coupon_dia_arr[show_num[0]][show_num[1]].length>0">（已选择@{{coupon_dia_arr[show_num[0]][show_num[1]].length}}项）</span></em>
                        <div class="wcc_selectStation_boxTwo" style="overflow: initial;" v-on:mouseleave="hide_coupon_mess">
                            <div class="wcc_selectStation_listBox public_scrollBrowser">
                                <label :for="'wcc_label_checkbox'+item.coupon_id" v-for="(item, index) in coupon_list" :key="index" class="wcc_selectStation_listBlock" v-on:mouseover="get_select_mess(item)">
                                    <label class="wcc_label_checkbox">
                                        <input type="checkbox" :id="'wcc_label_checkbox'+item.coupon_id" name="wcc_checkAll" v-bind:value="item.coupon_id" v-model="coupon_dia_arr[show_num[0]][show_num[1]]">
                                        <div class="wcc_checkbox"><span>&#xe67d;</span></div>
                                    </label>
                                    <span class="wcc_selectStation_text">@{{item.coupon_name}}</span>
                                </label>
                            </div>
                            <div class="coupon_select_mess public_scrollBrowser" v-if="show_coupon_mess_con" v-on:mouseenter="show_coupon_mess" v-on:mouseleave="hide_coupon_mess">
                                <p class="mess_list"><span class="coupon_select_mess_title">劵ID：</span><span class="coupon_select_mess_content">@{{select_mess_obj.coupon_id}}</span></p>
                                <p class="mess_list"><span class="coupon_select_mess_title">创建时间：</span><span class="coupon_select_mess_content">@{{init_data(select_mess_obj.create_time)}}</span></p>
                                <p class="mess_list"><span class="coupon_select_mess_title">劵名称：</span><span class="coupon_select_mess_content">@{{select_mess_obj.coupon_name}}</span></p>
                                <p class="mess_list"><span class="coupon_select_mess_title">分账券：</span><span class="coupon_select_mess_content">@{{select_mess_obj.profit_sharing == 1 ? '是' : '否'}}</span></p>
                                <p class="mess_list">
                                    <span class="coupon_select_mess_title">劵金额：</span>
                                    <span class="coupon_select_mess_content" v-if="select_mess_obj.price_type != 5">@{{select_mess_obj.price_type==1?'固定金额':select_mess_obj.price_type==2?'随机金额':""}}@{{select_mess_obj.price_type==1?Number(select_mess_obj.price_rule.price).toFixed(2)+'元':select_mess_obj.price_type==2?Number(select_mess_obj.price_rule.min_price).toFixed(2) + '元~' + Number(select_mess_obj.price_rule.max_price).toFixed(2) + '元':select_mess_obj.price_rule.discount+"折"}}</span>
                                    <span class="coupon_select_mess_content" v-if="select_mess_obj.price_type == 5">@{{select_mess_obj.price_rule.price}}元/升</span>
                                </p>
                                <p class="mess_list" v-if="select_mess_obj.validate_days.validate_days>0"><span class="coupon_select_mess_title">有效期内：</span><span class="coupon_select_mess_content">自领取之日@{{select_mess_obj.validate_days.validate_days}}天内有效</span></p>
                                <p class="mess_list" v-if="select_mess_obj.validate_days.validate_days==0"><span class="coupon_select_mess_title">有效期为：</span><span class="coupon_select_mess_content">@{{init_data(select_mess_obj.validate_days.start_time)}}至@{{init_data(select_mess_obj.validate_days.end_time)}}</span></p>
                                <p class="mess_list"><span class="coupon_select_mess_title">使用条件：</span><span class="coupon_select_mess_content" v-html="JSON.parse(select_mess_obj.desc).limit_desc?JSON.parse(select_mess_obj.desc).limit_desc:'不限'"></span></p>
                                <!-- <p class="mess_list"><span class="coupon_select_mess_title">使用时间：</span><span class="coupon_select_mess_content" v-html="JSON.parse(select_mess_obj.desc).time_desc?JSON.parse(select_mess_obj.desc).time_desc:'不限'"></span></p> -->
                                <p class="mess_list"><span class="coupon_select_mess_title">使用范围：</span><span class="coupon_select_mess_content" v-html="JSON.parse(select_mess_obj.desc).type_desc?JSON.parse(select_mess_obj.desc).type_desc:'不限'"></span></p>
                            </div>
                        </div>
                    </div>
                    没有合适的营销券?
                    <a class="create_link" href="/Marketing/config" target="_blank" v-on:click="show_dialog">去创建</a>
                </div>
                <div class="select_coupon_manage" v-if="coupon_dia_arr[show_num[0]][show_num[1]].length>0">
                    <div class="select_coupon_manage_title">
                        <p class="title_list" style="width:30%;text-align:left;padding-left: 40px;">
                            券名
                        </p>
                        <p class="title_list" style="width:20%">
                            券额
                        </p>
                        <p class="title_list" style="width:30%">
                            数量
                        </p>
                        <p class="title_list" style="width:20%">
                            操作
                        </p>
                    </div>
                    <div class="select_coupon_manage_content public_scrollBrowser">
                        <div v-for="(item, index) in get_coupon_dia_arr_obj[show_num[0]][show_num[1]]" :key="index" class="content_list_box">
                            <div class="content_lsit" style="width:30%;text-align:left;padding-left: 40px;">
                                @{{item.coupon_name}}
                            </div>
                            <div class="content_lsit" style="width:20%">
                                <template v-if="item.price_type != 5">@{{item.price_rule.price?item.price_rule.price:item.price_rule.min_price?(item.price_rule.min_price+'-'+item.price_rule.max_price):item.price_rule.discount+"折"}}</template>
                                <template v-else>@{{item.price_rule.price}}元/升</template>
                            </div>
                            <div class="content_lsit" style="width:30%">
                                <span class="coupon_num_manage reduce" v-on:click="computed_coupon_num(item.coupon_id,'reduce')"></span>
                                    <input type="text" v-model.lazy="coupon_dia_arr_num[show_num[0]][show_num[1]][item.coupon_id]" v-on:input="number_input_limit($event)" class="coupon_num">
                                <span class="coupon_num_manage add" v-on:click="computed_coupon_num(item.coupon_id,'add')"></span>
                            </div>
                            <div class="content_lsit content_lsit_delete" style="width:20%" v-on:click="delete_coupon(show_num,item.coupon_id)">
                               删除
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bottom_btn">
                    <button class="wcc_btn_thin_green" v-on:click="confirm_data"  style="margin-right:8px;">确认</button>
                    <button class="wcc_btn_thin_bor_ash" v-on:click="cancel_data">取消</button>
                </div>
            </div>
        </div>
    </div>
@endsection


@section('footer')
    <script>
        var st_logo = '{{$st_logo}}';//活动logo
        var station_select = {!!json_encode($station_arr_selected)!!};
        var with_group_id = '{{$with_group_id}}';//判断特定油站的标识，比如宝鸡
        var merchant_name = '{{$merchantName}}';
    </script>
    <script src="/js/wecar.js?v={{config('constants.wcc_file_version')}}"></script>
	<script src="/js/jquery.qrcode.min.js?v={{config('constants.wcc_file_version')}}"></script>
	<script src="/js/vendor/Plug/Plug.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/vue_component.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/InviteFriend/create_new.js?v={{config('constants.wcc_file_version')}}"></script>
@endsection