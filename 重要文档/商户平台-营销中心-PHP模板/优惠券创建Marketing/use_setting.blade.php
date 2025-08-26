@extends('layout/master')

@section('header')
<link rel="stylesheet" href="/css/uno.css?v={{config('constants.wcc_file_version')}}">
<link rel="stylesheet" href="/css/common/common.css?v={{config('constants.wcc_file_version')}}">
<link rel="stylesheet" href="/css/MarketPrice/index.css?v={{config('constants.wcc_file_version')}}">
<link rel="stylesheet" href="/css/wcc.css">
<link rel="stylesheet" href="/css/Marketing/use_setting.css?v={{config('constants.wcc_file_version')}}" />
@endsection

@section('content')
    @include ('common/marketing_header')
    <div class="hover_tip right_nav_tip">
        <div class="hover_tip_info">
            <p>营销券设置，用于限制集团或油站用户的营销券使用数量，有利于限制营销的成本</p>
        </div>
    </div>
    <div class="page-body">
        <ul class="nav-tabs" id="data-tab">
            <li class="active">
                <a href="#" class="text-center" id="today">普通限制</a>
            </li>
            <li>
                <a href="#" class="text-center" id="seven-days">特殊限制</a>
            </li>
            <li>
                <a href="#" class="text-center" id="wash-car">洗车券指南</a>
            </li>
            <div class="clear-fix"></div>
        </ul>

        <div class="select-box">

            <div class="clear-fix"></div>

            <div class="content-body">
                <div class="tab-pane active" id="baseSettingCl">

                    <div class="title_span">
                        <span class="t_s_name">集团限制 </span>
                        <span class="hover_tip">
                            <span class="hover_tip_info">
                                <p>只要用户不在特殊限制集团名单内，就必须遵循集团限制规则</p>
                            </span>
                        </span>
                        @if($merchant_type==2)
                        <a href="javascript:;" class="config_add_btn addGroupCl" data-type="1">添加</a>
                        @endif
                    </div>
                    <div class="main_content">
                        <table class="package_table">
                            <thead>
                            <tr>
                                <td>限制范围</td>
                                <td>使用平台</td>
                                <td>券类型</td>
                                <td>限制时间</td>
                                <td>限制身份</td>
                                <td>限制情况</td>
                                <td>是否授权给油站</td>
                                <td>操作</td>
                            </tr>
                            </thead>
                            <tbody class="baseGroupSettingBody" data-type="1">
                            <tr>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="title_span">
                        <span class="t_s_name">单站限制 </span>
                        <span class="hover_tip">
                            <span class="hover_tip_info">
                                <p>只要用户不在特殊限制的集团和油站名单内，就必须先后遵循集团和单站的限制规则</p>
                            </span>
                        </span>
                        <a href="javascript:;" class="config_add_btn addStationCl" data-type="2">添加</a>
                    </div>
                    <div class="main_content">
                        <table class="package_table">
                            <thead>
                            <tr>
                                <td>限制范围</td>
                                <td>使用平台</td>
                                <td>券类型</td>
                                <td>限制时间</td>
                                <td>限制身份</td>
                                <td>限制情况</td>
                                <td>是否授权给油站</td>
                                <td>操作</td>
                            </tr>
                            </thead>
                            <tbody class="baseStationSettingBody" data-type="2">
                                <tr>
                                </tr>
                            </tbody>
                        </table>
                    </div>


                </div>
                <div class="tab-pane" id="specialSettingCl" style="display: none">


                    <div class="title_span">
                        <span class="t_s_name">集团限制 </span>
                        <span class="hover_tip">
                            <span class="hover_tip_info">
                                <p>集团特殊名单内的用户，必须遵守集团特殊名单的限制规则</p>
                            </span>
                        </span>
                        @if($merchant_type==2)
                        <a href="javascript:;" class="config_add_btn addGroupCl" data-type="3">添加</a>
                        @endif
                    </div>
                    <div class="main_content">
                        <table class="package_table table_special">
                            <thead>
                            <tr>
                                <td>限制范围</td>
                                <td>特殊名单</td>
                                <td>使用平台</td>
                                <td>券类型</td>
                                <td>限制时间</td>
                                <td>限制情况</td>
                                <td>是否授权给油站</td>
                                <td>操作</td>
                            </tr>
                            </thead>
                            <tbody class="baseGroupSettingBody" data-type="3">
                            <tr>
                            </tr>
                            </tbody>
                        </table>
                    </div>



                    <div class="title_span">
                        <span class="t_s_name">单站限制 </span>
                        <span class="hover_tip">
                            <span class="hover_tip_info">
                                <p>油站特殊名单内的用户，必须先后遵守集团特殊名单、集团限制和油站限制特殊名单的限制规则</p>
                            </span>
                        </span>
                        <a href="javascript:;" class="config_add_btn addStationCl" data-type="4">添加</a>
                    </div>
                    <div class="main_content">
                        <table class="package_table table_special">
                            <thead>
                            <tr>
                                <td>限制范围</td>
                                <td>特殊名单</td>
                                <td>使用平台</td>
                                <td>券类型</td>
                                <td>限制时间</td>
                                <td>限制情况</td>
                                <td>是否授权给油站</td>
                                <td>操作</td>
                            </tr>
                            </thead>
                            <tbody class="baseStationSettingBody" data-type="4">
                            <tr>
                            </tr>
                            </tbody>
                        </table>
                    </div>


                </div>
								<div class="tab-pane hidden" id="washCar">
									<div class="flex" v-loading="loading">
										<el-form :model="query" ref="form" class="w-550px" label-width="120px" :rules="rules">
											<el-form-item label="倒计时" prop="countdown_time">
												<el-input-number class="w-200px" placeholder="请输入洗车倒计时时间" v-model="query.countdown_time" :controls="false" :precision="0" :min="1" :max="30"></el-input-number>
												<span>分钟</span>
											</el-form-item>
											<el-form-item label="洗车指南标题" prop="countdown_name">
												<el-input v-model="query.countdown_name" placeholder="请输入洗车指南标题" maxlength="15"
																	show-word-limit clearable>
													<template #append>
														<el-button @click="restoreDefaultName"><span class="text-primary">恢复默认</span></el-button>
													</template>
												</el-input>
											</el-form-item>
											<el-form-item label="洗车指南内容" prop="countdown_content">
												<el-input type="textarea" v-model="query.countdown_content" placeholder="请输入洗车指南内容"
																	maxlength="300" :rows="12" show-word-limit clearable>
													<el-button slot="append" @click="restoreDefaultContent">恢复默认</el-button>
												</el-input>
												<el-button @click="restoreDefaultContent" type="text"><span class="text-primary">恢复默认</span></el-button>
											</el-form-item>
											<el-form-item>
												<el-button type="primary" @click="saveForm">@{{ config_info ? '修改' : '保存' }}
												</el-button>
											</el-form-item>
										</el-form>
										<div class="ml-40 w-375px shadow-lg bg-#F5F5F5">
											<div class="w-full h-88px" bg="[length:100%_auto] no-repeat [url(/img/WashCar/navbar.png)]"></div>
											<div class="w-full min-h-730px" bg="no-repeat [length:100%_auto] [url(https://fs1.weicheche.cn/images/test/240619103118-10256.png)]">
												<p text="center 20px white" class="pt-20px pb-8px">您已进入洗车倒计时</p>
												<div class="flex items-center rd-8px w-321px mx-auto box-border px-25px py-8px" b="1px [rgba(255,255,255,0.5)] solid">
													<img class="w-18px" src="https://fs1.weicheche.cn/images/test/240619105427-34768.png" alt="">
													<p class="ml-8px" text="14px left white">请勿关闭此页面，并将页面出示给油站工作人</p>
												</div>
												<div class="w-345px mx-auto">
													<div class="w-full px-24px box-border rd-16px bg-gradient-linear shape-bottom from-#FFEFE3 to-#fff relative mt-17px">
														<p text="#F16932 center" class="w-171px h-27px py-3px box-border bg-#FFE2CB mx-auto rd-b-13px">洗车时间还剩余</p>
														<div class="flex justify-center items-center space-x-18px">
															<img class="w-23px" src="https://fs1.weicheche.cn/images/test/240619104806-57405.png" alt=""/>
															<div class="space-x-9px flex items-center pt-23px pb-30px">
																<div text="white 44px center" class="leading-67px rd-8px w-49px h-67px bg-gradient-linear shape-bottom from-#717070 to-#141414 box-border">@{{formatMinutesAsTimeArray(query.countdown_time).min[0]}}</div>
																<div text="white 44px center" class="leading-67px rd-8px w-49px h-67px bg-gradient-linear shape-bottom from-#717070 to-#141414 box-border">@{{formatMinutesAsTimeArray(query.countdown_time).min[1]}}</div>
																<img class="w-6px" src="https://fs1.weicheche.cn/images/test/240619115158-74523.png" alt=""/>
																<div text="white 44px center" class="leading-67px rd-8px w-49px h-67px bg-gradient-linear shape-bottom from-#717070 to-#141414 box-border">@{{formatMinutesAsTimeArray(query.countdown_time).sec[0]}}</div>
																<div text="white 44px center" class="leading-67px rd-8px w-49px h-67px bg-gradient-linear shape-bottom from-#717070 to-#141414 box-border">@{{formatMinutesAsTimeArray(query.countdown_time).sec[1]}}</div>
															</div>
															<img class="w-23px" src="https://fs1.weicheche.cn/images/test/240619115004-42011.png" alt="">
														</div>
													</div>
													<div class="w-full px-25px py-18px box-border bg-white rd-16px mt-16px">
														<p text="center #333 18px">@{{query.countdown_name}}</p>
														<div class="bg-#F78B33 w-48px h-5px rd-full mx-auto"></div>
														<p text="#666666 left 14px" class="leading-20px pt-15px ws-pre-wrap">@{{query.countdown_content}}</p>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
            </div>
        </div>
        <div class="clear-fix"></div>
    </div>
<script type="text/html" id="addHtmlTpl">
<div class="config_add_body config_add_body_new">
    <div class="config_group phone_input">
        <div class="config_left"><span>用户手机</span></div>
        <div class="config_right">
            <!-- <input type="text" class="input-text" name="phones" placeholder="请输入手机号（输入多个用逗号隔开）"> -->
            <input type="text" class="input-text" name="phones" placeholder="请输入特殊人员手机号码" style="transform: translateX(-4px);-webkit-transform:translateX(-4px)">
            <div class="task_layer_tel_add repeat-add">&nbsp;&nbsp;添加人员</div>
            <span class="prompt_new prompt_new_2"><i>&#xe674;</i> 手机号码格式不正确</span>
        </div>
    </div>

    <div class="config_group merchant_region">
        <div class="config_left"><span>限制油站</span></div>
        <div class="config_right">
            <div class="input-line input-body" id="channelType">
                <div class="create-select create-select_new" style="width: 354px">
                    <div class="c-s-value"><span>请选择油站</span></div>
                    <div class="c-s-options" style="display: none; width: 354px; max-height: 220px; overflow-y: auto;">
                        <ul class="tree-ul">
                            @foreach($station_list as $key=>$val)
                            <li data-id="{{$val['stid']}}" class="channelother tree-li tree-li-0">
                                <label class="tree-head">
                                    <input name="merchant_id[]" type="checkbox" class="tree-box" value="{{$val['stid']}}">
                                    <div class="wcc_checkbox_y"><span>&#xe67d;</span></div>
                                    <span class="tree-open">{{$val['name']}}</span>
                                </label>
                            </li>
                            @endforeach
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="config_group limit_time">
        <div class="config_left"><span>限制时间</span></div>
        <div class="config_right">
            <div class="wcc_selectStation_box wcc_time wcc_width_auto" style="width: 354px">
                <i class="wcc_calendar"></i>
                <div class="input_box">
                    <input class="column_name_date" type="text" name="" value="" placeholder="">
                </div>
            </div>
        </div>
    </div>
    <div class="config_group platform config_group_new">
        <div class="config_left"><span>限制平台</span></div>
        <div class="config_right">
            @foreach($platform_arr as $key=>$val)
            <label>
                <input type="radio" name="platform" value="{{$key}}" @if($key==0) checked="checked" @endif> {{$val}}
                <div class="input_icon"></div>
            </label>
            @endforeach
        </div>
    </div>

    <div class="config_group coupon_type config_group_new">
        <div class="config_left"><span>券类型</span></div>
        <div class="config_right">
            <label><input type="radio" name="coupon_type" value="0" checked="checked"> 所有券<div class="input_icon"></div></label>
            <label><input type="radio" name="coupon_type" value="1"> 油品券<div class="input_icon"></div></label>
            <label><input type="radio" name="coupon_type" value="2"> 非油品券<div class="input_icon"></div></label>
            <label><input type="radio" name="coupon_type" value="3"> 服务券<div class="input_icon"></div></label>
        </div>
    </div>

    <div class="config_group identity_type config_group_new">
        <div class="config_left"><span>限制身份</span></div>
        <div class="config_right">
            <label><input type="radio" name="identity_type" value="0" checked="checked"> 所有身份<div class="input_icon"></div></label>
            <label><input type="radio" name="identity_type" value="1"> 选中身份<div class="input_icon"></div></label>
            <div class="input-line input-body input-line-new">
                <div class="create-select">
                    <div class="c-s-value c-s-value-new c-oil-value c-oil-value"><span>请选择身份</span></div>
                    <div class="c-s-options create-from">
                        <ul class="tree-ul">
                            <li class="tree-li tree-li-0">
                                <div class="tree-head head-active">
                                    <i class="tree-icon tree-open"></i>
                                    <input name="level-c[]" type="checkbox" class="tree-box tree-box-l" value="0">
                                    <div class="wcc_checkbox_y"><span>&#xe67d;</span></div>
                                    <span class="tree-title parent-has tree-open">等级身份</span>
                                </div>
                                <ul class="tree-ul parent-ul" style="display: block">
                                    @foreach($levels as $val)
                                    <li class="tree-li">
                                        <div class="tree-head">
                                            <input name="level[]" type="checkbox" value="{{$val->id}}" class="tree-box">
                                            <div class="wcc_checkbox_y"><span>&#xe67d;</span></div>
                                            <span class="tree-title">{{$val->level_name}}</span>
                                        </div>
                                    </li>
                                    @endforeach
                                </ul>
                            </li>
                            <li class="tree-li tree-li-0" id="j_other">
                                <div class="tree-head head-active">
                                    <i class="tree-icon tree-open"></i>
                                    <input name="identity-c[]" type="checkbox" class="tree-box tree-box-i" value="0">
                                    <div class="wcc_checkbox_y"><span>&#xe67d;</span></div>
                                    <span class="tree-title parent-has tree-open">认证身份</span>
                                </div>
                                <ul class="tree-ul parent-ul" style="display: block">
                                    @foreach($driverTypes as $val)
                                    <li class="tree-li">
                                        <div class="tree-head">
                                            <input name="identity[]" type="checkbox" value="{{$val->sub_type_id}}" class="tree-box">
                                            <div class="wcc_checkbox_y"><span>&#xe67d;</span></div>
                                            <span class="tree-title">{{$val->sub_type_name}}</span>
                                        </div>
                                    </li>
                                    @endforeach
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="config_group use_type config_group_new">
        <div class="config_left"><span>限制情况</span></div>
        <div class="config_right">
            <label><input type="radio" name="use_type" value="1" checked="checked"> 按天<div class="input_icon"></div></label>
            <label><input type="radio" name="use_type" value="2"> 按小时<div class="input_icon"></div></label>
            <label><input type="radio" name="use_type" value="3"> 不可使用<div class="input_icon"></div></label>
        </div>
    </div>

    <div class="config_group use_value">
        <div class="config_left"><span></span></div>
        <div class="config_right">
            <div class="can_use">
                每 <input type="number" class="input-text" value="1" name="use_value" /> <span class="use_type_name">天</span>可使用
                <input type="number" class="input-text" value="1" name="num" /> 张
                <span class="prompt_new prompt_new_1"><i>&#xe674;</i> 请输入大于0的整数</span>
            </div>
            <div class="cannot_use" style="display:none">
                <input type="text" name="" class="wcc_input wcc_input_new" value="" placeholder="请输入不可用原因，例“不可与会员日优惠叠加”" >
                <span class="num_prompt">0/15</span>
                <span class="content_prompt_icon"><i>&#xe659;</i></span>
                <div class="content_prompt_text">
                    将在券上直接显示用于向车主解释此时券不可用的原因
                </div>
            </div>
        </div>
    </div>

    <div class="config_group allow_station config_group_new">
        <div class="config_left"><span>修改限制</span></div>
        <div class="config_right">
            <label><input type="radio" name="allow_station" value="1" checked="checked"> 油站可修改<div class="input_icon"></div></label>
            <label><input type="radio" name="allow_station" value="0"> 油站不可修改<div class="input_icon"></div></label>
        </div>
    </div>

</div>
</script>
@endsection

@section('footer')
<script>
    var _MERCHANT_TYPE = {{$merchant_type}};
    var _STID = {{$stid}};
    var _GROUP_ID = {{$group_id}};
    var is_group = '{{$is_group}}';
    var countdown_limit_show = {{$countdown_limit_show}};
    var config_info =  {!!json_decode($config_info)!!};

</script>
<script src="/js/wecar.js?v={{config('constants.wcc_file_version')}}"></script>
<script src="/js/Marketing/use_setting.js?v={{config('constants.wcc_file_version')}}"></script>
<script src="/js/Marketing/washCarCountDown.js"></script>
@endsection
