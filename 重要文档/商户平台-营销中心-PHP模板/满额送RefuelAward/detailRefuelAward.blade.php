@extends('layout/master')

@section('header')
    <link rel="stylesheet" href="/css/wecar.css?v={{config('constants.wcc_file_version')}}" />
    <link rel="stylesheet" href="/css/wcc.css?v={{config('constants.wcc_file_version')}}" />
    <link rel="stylesheet" href="/css/RefuelAward/detailRefuelAward.css?v={{config('constants.wcc_file_version')}}" />
@endsection


@section('content')
    <p class="active_detail">活动详情</p>
    <div class="detailContainer" id="detailBox" v-show="boxShow">
        <div class="detailContainer_lineBox">
            <div class="detailContainer_lineBox_left">活动ID：</div>
            <div class="detailContainer_lineBox_right">@{{activity_id}}</div>
        </div>

        <div class="detailContainer_lineBox">
            <div class="detailContainer_lineBox_left">活动名称：</div>
            <div class="detailContainer_lineBox_right">@{{detail_name}}</div>
        </div>
       
        <div class="detailContainer_lineBox">
            <div class="detailContainer_lineBox_left">活动类型：</div>
            <div class="detailContainer_lineBox_right">@{{red_type==1?'满额送券':'满额送裂变红包'}}</div>
        </div>
     
        <!-- 时间弹出层 -->
        <div style="width:0;height:0;position:relative;left:163px;overflow:hidden">
            <input id="timeSelect" type="text" />
        </div>

        <div class="detailContainer_lineBox">
            <div class="detailContainer_lineBox_left">活动时间：</div>
            <div class="detailContainer_lineBox_right">@{{time.start}} 至 @{{time.end}}</div>
        </div>

        <div class="detailContainer_lineBox">
            <div class="detailContainer_lineBox_left">周期规律：</div>
            <!-- <div class="detailContainer_lineBox_right" v-html='time_info'></div> -->
        </div>
        <div v-html='time_info' style="position: relative;top: -41px;right: -165px;margin-bottom: -36px; color: #666;
"></div>

        <div class="detailContainer_lineBox">
            <div class="detailContainer_lineBox_left">活动创建时间：</div>
            <div class="detailContainer_lineBox_right">@{{time.create}}</div>
        </div>

        <template v-if="station_select.stid == 0 && station_select.group_id > 0">
            <div class="detailContainer_lineBox">
                <div class="detailContainer_lineBox_left">活动油站：</div>
                <div class="detailContainer_lineBox_right" v-if="!oli_obj">集团下所有油站</div>
                <div class="detailContainer_lineBox_right" v-else v-html="show_oil()">
                </div>
            </div>
        </template>

        {{--<template v-if="identify_type != -1">--}}
            {{--<div class="detailContainer_lineBox" isauto="1">--}}
                {{--<template v-if="identify_type == 0">--}}
                    {{--<div class="detailContainer_lineBox_left">身份限制：</div>--}}
                    {{--<div class="detailContainer_lineBox_right">不限制</div>--}}
                {{--</template>--}}
                {{--<template v-else-if="identify_type == 1">--}}
                    {{--<div class="detailContainer_lineBox_left">身份限制：</div>--}}
                    {{--<div class="detailContainer_lineBox_right" v-html="'仅限以下身份的用户参与<br /><br />' + identify_arr.join(',')"></div>--}}
                {{--</template>--}}
                {{--<template v-else-if="identify_type == 2">--}}
                    {{--<div class="detailContainer_lineBox_left">身份限制：</div>--}}
                    {{--<div class="detailContainer_lineBox_right" v-html="'除以下身份的其他用户参与<br /><br />' + identify_arr.join(',')"><br /></div>--}}
                {{--</template>--}}
                {{--<template v-else-if="identify_type == 3">--}}
                    {{--<div class="detailContainer_lineBox_left">身份限制：</div>--}}
                    {{--<div class="detailContainer_lineBox_right">仅限新用户参与</div>--}}
                {{--</template>--}}
            {{--</div>--}}
        {{--</template>--}}

        <div class="detailContainer_lineBox addProjectContainer" isauto="1">
            <div class="detailContainer_lineBox_left">返券规则：</div>
            <div class="detailContainer_lineBox_right">

                <template v-for="(bigItem,bigIndex) in use_project">
                    <div class="ruleContainer_top">
                        <div class="ruleContainer_title">规则@{{Number(bigIndex)+1}}</div>
                        <div class="ruleContainer">
                            <div class="ruleContainer_box">
                                <div class="ruleContainer_block">
                                    <template v-if="bigItem.oil_type == 0">
                                        <em>活动油品：&nbsp;不限</em>
                                    </template>
                                    <template v-else>
                                        <em>活动油品：&nbsp;@{{fn_switchOilIdToName(bigItem.oil_selected).join(',')}}</em>
                                    </template>
                                </div>
                            </div>
                            <div class="ruleContainer_box">
                                <div class="ruleContainer_block">
                                    <template v-if="bigItem.limit_type == 1">
                                        <em>限制类型：&nbsp;原价</em>
                                    </template>
                                    <template v-else-if="bigItem.limit_type == 2">
                                        <em>限制类型：&nbsp;实付</em>
                                    </template>
                                    <template v-else-if="bigItem.limit_type == 3">
                                        <em>限制类型：&nbsp;升数</em>
                                    </template>
                                </div>
                            </div>
                            <template v-for="(item,index) in bigItem.condition">
                                <div class="ruleContainer_box">
                                    <div class="ruleContainer_block">
                                        <em v-bind:style="{ opacity : index == 0 ? 1 : 0 }">梯度奖励：&nbsp;&nbsp;</em>
                                        <em>消费大于等于</em>
                                        <em>&nbsp;@{{item.min_money}}</em>
                                        <div class="ruleContainer_center">小于</div>
                                        <em>@{{item.max_money}}&nbsp;</em>
                                        <i>@{{bigItem.limit_type == -1 ? '元/升，' : bigItem.limit_type == 3 ? '升，' : '元，'}}</i>
                                        <template v-if="reward_type != 2">
                                            <template v-if="red_type == 3 && item.coupon_select.red_Data">
                                                <div class="ruleContainer_buttonAll">
                                                    <div class="wcc_btn_thin_bor_ash" v-on:mouseover="mouseoverFun($event,item.coupon_select.red_Data)" v-on:mouseout="mouseoutFun">
                                                        @{{item.coupon_select.red_Data.name || '过期了'}}
                                                    </div>
                                                    <div class="red_details"  v-show="red_details" v-on:mouseover="mouseoverFun($event,'son')" v-on:mouseout="mouseoutFun">
                                                        <template v-if="!red_details_error">
                                                            <template v-if="red_details_data.activity">
                                                                
                                                                <div class="red_details_box clear">
                                                                    <span class="red_details_box_left">
                                                                        红包id：
                                                                    </span>
                                                                    <div class="red_details_box_right">@{{red_details_data.activity.id}}</div>
                                                                </div>
                                                                <div class="red_details_box clear">
                                                                    <span class="red_details_box_left">
                                                                        红包类型：
                                                                    </span>
                                                                    <div class="red_details_box_right">@{{red_details_data.activity.type == 0 ? '活动类红包' : '奖励类红包'}}</div>
                                                                </div>
                                                                <div class="red_details_box clear">
                                                                    <span class="red_details_box_left">
                                                                        红包名字：
                                                                    </span>
                                                                    <div class="red_details_box_right">@{{red_details_data.activity.name}}</div>
                                                                </div>
                                                                <div class="red_details_box clear">
                                                                    <span class="red_details_box_left">
                                                                        有效期：
                                                                    </span>
                                                                    <div v-if="red_details_data.type==1 && red_details_data.config_detail && red_details_data.config_detail.extra_time_rule.type == 1" class="red_details_box_right">
                                                                        @{{red_details_data.activity.config_detail.extra_time_rule.value+'天有效'}}
                                                                    </div>
                                                                    <div v-else class="red_details_box_right">
                                                                        @{{ red_details_data.activity.start_time + ' 至 ' + red_details_data.activity.end_time}}
                                                                    </div>

                                                                </div>
                                                                <div class="red_details_box clear">
                                                                    <span class="red_details_box_left">
                                                                        红包数量：
                                                                    </span>
                                                                    <div class="red_details_box_right">@{{red_details_data.gift_limit}}</div>
                                                                </div>
                                                                <div class="wcc_table_border clear">
                                                                    <table class="wcc_table">
                                                                        <thead>
                                                                            <tr>
                                                                                <td>营销券名称</td>
                                                                                <td>券额</td>
                                                                                <td>发放数量</td>
                                                                                <td>操作</td>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            <tr v-for=" item in red_details_data.coupon_arr">
                                                                                <td>@{{item.coupon_name}}</td>
                                                                                <template  v-if = 'item.price_type == 1' >
                                                                                    <td>@{{item.price_rule.price}}</td>
                                                                                
                                                                                </template>
                                                                                <template  v-else-if = 'item.price_type == 3' >
                                                                                    <td>@{{item.price_rule.discount}}折</td>
                                                                                </template>
                                                                                <template  v-else-if = 'item.price_type == 5' >
                                                                                    <td>@{{item.price_rule.price}}元/升</td>
                                                                                </template>
                                                                                <template  v-else >
                                                                                    <td>@{{item.price_rule.min_price + '~' + item.price_rule.max_price}}</td>
                                                                                </template>
                                                                                    <td>@{{item.coupon_select_count}}</td>
                                                                                    
                                                                                <td><span class="wcc_text_green" v-on:click='coupon_id_Fun(item.coupon_id)'>查看详情</span></td>
                                                                            
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>

                                                            </template>
                                                        </template>    
                                                        <div v-else style="text-align: center;"> @{{red_details_error?red_details_error:'正在加载红包详细...'}} </div>
                                                    </div>
                                                </div>


                                            </template>
                                            <template v-else>
                                                <div class="ruleContainer_text">奖励抵用券 @{{item.coupon_select.length}} 种 @{{item.coupon_select.total}} 张</div>
                                                <div class="ruleContainer_buttonAll">
                                                    <template v-if="item.coupon_select.length > 0">
                                                        <div class="wcc_btn_thin_bor_ash" v-on:click="ev_showCouponBox({ bigIndex : bigIndex , index : index , obj : item.coupon_select })">抵用券查看</div>
                                                    </template>
                                                </div>
                                            </template>
                                            

                                        </template>
                                        <template v-else>
                                            <div class="ruleContainer_text" v-bind:title="item.red_envelopes_info_array.join('\n')">奖励现金红包 @{{item.red_envelopes_total_money.toFixed(2)}} 元</div>
                                        </template>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </template>

            </div>
        </div>

        <div class="detailContainer_lineBox">
            <div class="detailContainer_lineBox_left">场景限制：</div>
            <div class="detailContainer_lineBox_right">
                <em v-if='user_type == 1'>不限</em>
                <em v-if='user_type == 2'>仅限无感支付场景</em>
            </div>
        </div>
        <div class="detailContainer_lineBox">
            <div class="detailContainer_lineBox_left">身份限制：</div>
            <div class="detailContainer_lineBox_right">
                <em v-if='identify_type == 0'>不限</em>
                <em v-if='identify_type == 3'>仅新用户可返券</em>
                <em v-if='identify_type == 1'>仅以下身份/等级可返券</em>
                <em v-if='identify_type == 2'>仅以下身份/等级不可返券</em>
            </div>
        </div>

        <div class="detailContainer_lineBox" v-if="plate_limit_show == 1">
            <div class="detailContainer_lineBox_left">车牌校验：</div>
            <div class="detailContainer_lineBox_right">
                <em v-if='plate_limit == 1'>是</em>
                <em v-if='plate_limit == 0'>否</em>
            </div>
        </div>

        <div class="detailContainer_lineBox" v-if="identify_driver">
            <div class="detailContainer_lineBox_left">等级身份：</div>
            <div class="detailContainer_lineBox_right">
                <em>@{{identify_driver}}</em>
            </div>
        </div>

        <div class="detailContainer_lineBox" v-if="identify_level">
            <div class="detailContainer_lineBox_left">认证身份：</div>
            <div class="detailContainer_lineBox_right">
                <em>@{{identify_level}}</em>
            </div>
        </div>

        <div class="detailContainer_lineBox">
            <div class="detailContainer_lineBox_left">奖励限制：</div>
            <div class="detailContainer_lineBox_right">
                <em>每个用户在本次活动中，每日最多可获得<i style="color:#32af50;"> @{{count_day_number}} </i>次奖励，最多可以获得<i style="color:#32af50;"> @{{count_number}} </i>次奖励</em>
            </div>
        </div>

        <div class="detailContainer_lineBox" style="height:40px;">
            <div class="detailContainer_lineBox_left">是否通知：</div>
            <div class="detailContainer_lineBox_right">
                <template v-if="notice_type == 1">是</template>
                <template v-else>否</template>
            </div>
        </div>
        <div class="detailContainer_lineBox" style="height:40px;">
            <div class="detailContainer_lineBox_left">与券优惠是否同享：</div>
            <div class="detailContainer_lineBox_right">
                <template v-if="detailInfo.is_mutx_coupon === 0">同享</template>
                <template v-else>不同享</template>
            </div>
        </div>
        <div class="detailContainer_lineBox" style="height:40px;">
            <div class="detailContainer_lineBox_left">与其他优惠是否同享：</div>
            <div class="detailContainer_lineBox_right">
                <template v-if="detailInfo.is_mutx_discount === 0">同享</template>
                <template v-else>不同享</template>
            </div>
        </div>

        <template v-if="notice_type == 1">
            <div class="detailContainer_lineBox" isauto="1">
                <div class="detailContainer_lineBox_left">短信内容：</div>
                <div class="detailContainer_lineBox_right" isblock="1">@{{notice_html}}</div>
            </div>
        </template>
        <div class="detailContainer_lineBox" style="margin-top:50px;">
            <template v-if="status == 1">
                <div class="submitButton wcc_btn_fat_green btn_fat_red" style="margin-left:164px;"  v-on:click="delRefuelAward">删除</div>
                <div class="submitButton wcc_btn_fat_green" style="margin-left:20px;"  v-on:click="updateRefuelAward('您确定要修改当前活动的时间吗？')">修改时间</div>
            </template>
            <template v-else-if="status == 2">
                <div class="submitButton wcc_btn_fat_green btn_fat_red" style="margin-left:164px;"  v-on:click="endRefuelAward">立即结束</div>
                <div class="submitButton wcc_btn_fat_green" style="margin-left:20px;"  v-on:click="updateRefuelAward('您确定要延迟结束时间来延缓当前活动吗？')">修改结束时间</div>
            </template>
        </div>

    </div>
@endsection


@section('elastic')
    <div class="couponSelectContainer" id="couponSelect" style="display:none" v-show="show">
        <div class="couponSelectContainer_box">
            <div class="couponSelectContainer_title">
                <em>查看劵详情</em>
                <div class="couponSelectContainer_close" v-on:click="show = 0,ev_hoveroutCoupon()">×</div>
            </div>
            <div class="couponSelectContainer_content">
                <div class="couponSelectContainer_content_list">

                  <!--   <div class="couponSelectContainer_content_list_box">
                      <div class="couponSelectContainer_content_list_block">
                          <div class="wcc_selectStation_listBlock" v-bind:isselect="hasAllSelected">
                              <label class="wcc_label_checkbox">
                                  <input type="checkbox" v-bind:checked="Boolean(hasAllSelected)" />
                                  <div class="wcc_checkbox"><span>&#xe67d;</span></div>
                              </label>
                              <span class="wcc_selectStation_text">全选</span>
                          </div>
                      </div>
                  </div> -->
                    <template if="coupon_array.length" v-for="(item,key) in coupon_array">
                        <div class="couponSelectContainer_content_list_box" v-on:mouseenter.stop="ev_hoverCoupon($event,item,key)">
                            <div class="couponSelectContainer_content_list_block">
                                <div class="wcc_selectStation_listBlock" isselect="1">
                                    <span class="wcc_selectStation_text" v-bind:title="item.coupon_name">@{{item.coupon_name.length > 22 ? item.coupon_name.slice(0,20) + '...' : item.coupon_name}}</span>
                                    <template v-if="item.is_vue_selected">
                                        <span>（@{{transmit_array.obj.award_product_id[item.coupon_id].length}} 张）</span>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
                <div class="couponSelectContainer_content_detail" v-show="coupon_detail.length">
                    <div class="couponSelectContainer_content_detail_title">优惠券信息</div>
                    <template v-for="item in coupon_detail">
                        <div class="couponSelectContainer_content_detail_block">
                            <div class="couponSelectContainer_content_detail_block_left">@{{item.name}}:</div>
                            <div class="couponSelectContainer_content_detail_block_right" v-html="item.value"></div>
                        </div>
                    </template>
                </div>
            </div>
            <div class="couponSelectContainer_footer">
                <div class="wcc_btn_fat_green" v-on:click="show = 0">关闭</div>
            </div>
        </div>
    </div>
@endsection


@section('footer')
    <script src="/js/vue_component.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/wecar.js?v={{config('constants.wcc_file_version')}}"></script>
    <script>
        var station_select = {!!json_encode($station_arr_selected)!!};
        var plate_limit_show={!! json_encode($plate_limit_show) !!};
        console.log('plate_limit_show',plate_limit_show);
	    $(function(){(function(){
            var $container = new Vue({
                el : '#detailBox',
                data : {
                    plate_limit_show: plate_limit_show,
                    station_select:station_select,
                    data:null,
                    red_details:false,
                    red_details_error : false,
                    red_details_data_arr: [],
                    red_details_data: {},
                    red_type:1,
                    identify_type:0,
                    user_type:1,
                    plate_limit: 0,
                    identify_driver:'',
                    identify_level:'',
                    oli_obj:null,
                    trueId: undefined,
                    status : 0,
                    time_info:'',
                    count_day_number:0,
                	boxShow : 0,
                	activity_id : 0,
                	detail_name : '',
                    timeUnchanged:'',
                	time : {
                		start : moment().subtract(-1,'day').format('YYYY-MM-DD 00:00:00'),
                        end : moment().subtract(-29,'day').format('YYYY-MM-DD 23:59:59'),
                    },
                    limit_type_array : [
	                    {
		                    name : '按原价',
		                    val : 1,
	                    },
	                    {
		                    name : '按实付',
		                    val : 2,
	                    },
	                    {
		                    name : '按升数',
		                    val : 3,
	                    },
                    ],
                    oil_array : [],
                    oil_type_array : [
	                    {
		                    name : '不限',
		                    val : 0,
	                    },
	                    {
		                    name : '指定油品',
		                    val : 1,
	                    },
                    ],
                    coupon_arr : [],
                    coupon_detail_arr : [],
                    count_number : 1,
	                notice_type : 0,
	                notice_html : '',
	                notice_type_arr : [
		                {
			                name : '否',
			                val : 0,
		                },
		                {
			                name : '是',
			                val : 1,
		                },
                    ],
	                identify_arr : [],
	                identify_type : -1,
	                reward_type : -1,
                    use_project : [{
	                        oil_type : -1,
		                    oil_selected : [],
		                    limit_type : -1,
		                    condition : [{
			                    min_money : '',
			                    max_money : '',
                                red_Name : -1,
                                red_id : '',
			                    coupon_select : {
				                    length : 0,
				                    total : 0,
                                },
		                    }],
                    }],
                    red_attr : [],
                    detailInfo:{}
                },
                methods : {
                    show_oil:function(){
                        var str='';
                        for(var key in this.oli_obj){
                            str+=this.oli_obj[key].stname+'、'
                        }
                        return str;
                    },
                    mouseoverFun:function (data, sonData ) {
                        if (sonData=='son') {
                            clearTimeout(this.mouseoutFun.setTimeout);
                            return;
                        }
                        clearTimeout(this.mouseoutFun.setTimeout);
                        if (!sonData) {
                            return false
                        }
                        var This = this;
                        this.red_details = true;
                        Vue.nextTick(function(){
                            //用于解决重复出现的bug
                            var index=$(data.target).index('.'+data.target.className);
                            $('.red_details').hide();
                            $('.red_details').eq(index).show();
                        })
                        This.red_details_error = false;
                        This.trueId = sonData.data.id
                        for (var i = 0; i < This.red_details_data_arr.length; i++) {
                            if (This.trueId == This.red_details_data_arr[i][0]) {
                                This.red_details_error = This.red_details_data_arr[i][1];
                                return
                            } else if (This.trueId == (This.red_details_data_arr[i].activity && This.red_details_data_arr[i].activity.id)) {
                                This.red_details_data = This.red_details_data_arr[i];
                                return;
                            }
                        }
                        $.ajax({
                            url: '/RedPackage/getActivityDetail',
                            type: 'POST',
                            dataType: 'json',
                            data: {
                                id: This.trueId
                            },
                            success: function (res) {

                                if (res.status == 200) {
                                    This.red_details_data_arr.push(JSON.parse(JSON.stringify(res.data)));
                                    This.red_details_data = JSON.parse(JSON.stringify(res.data));
                                } else {
                                    This.red_details_data_arr.push([This.trueId, res.info]);
                                    This.red_details_error = res.info;
                                    // $alert(res.info);
                                }
                            },
                            error: function (code) {
                                This.red_details_error = '网络错误,请稍后再试';

                            },
                        });

                        // console.log(data.ev.target,data.index,data.item,data.select,2)
                    },
                    mouseoutFun:function (evnt) {
                        
                        // var
                        this.mouseoutFun.setTimeout = setTimeout(function (argument) {
                           this.red_details_error = false;
                            this.red_details = false;
                        }.bind(this),500);

                        // body...
                    },
                    coupon_id_Fun:function (id,Fun) {
                        var $this = this;

                        $this.coupon_id_Fun.dataJson = $this.coupon_id_Fun.dataJson || {};
                        var storageData = $this.coupon_id_Fun.dataJson;
                        //检查是否存在缓存,存在就直接渲染
                        if( id in storageData ){
                            
                            if (Fun) {
                                Fun(strFun(storageData[id]))
                            }else{
                                layer.closeAll();
                                render(storageData[id]);
                            }
                            
                            return;
                        }
                        if (!Fun) {
                            window.v$loading.show()
                        }

                        $.ajax({
                                url : '/Coupon/ajaxGetCouponInfo',
                                type : 'POST',
                                dataType : 'json',
                                data : {
                                    coupon_id : id,
                                },
                                success : function ( response ) {

                                    
                                    // layer.closeAll();
                                    if( response.status == 200 ){
                                        //渲染
                                        if (Fun) {
                                            Fun(strFun(response.data))
                                        }else{
                                            render(response.data);
                                        }
                                        
                                        //缓存
                                        $this.coupon_id_Fun.dataJson[id] = response.data;
                                    }else{
                                        layer.msg( data.info ); 
                                        
                                    }
                                    window.v$loading.hide();
                                },
                                error : function () {
                                    window.v$loading.hide();
                                    // layer.closeAll();
                                    layer.alert('', {
                                        title:'温馨提示',
                                        area: '440px',
                                        shade: [1, 'rgba(255,255,255,0.75)'],
                                        content:'<div class="layui-wcc-confirm"><div>网络错误，请稍后重试</div></div>', 
                                        //time: 20000, //20s后自动关闭
                                        btn: ['确认']
                                    }); 
                                }

                        });
                    },


                    //结束活动 | jhd
                    endRefuelAward:function (argument) {
                        var This = this;
                        if(this.endRefuelAward.onoff)return;
                        $.wecarPage({
                            title: '温馨提示',
                            btnYes: '确定',
                            btnCancel:'取消',
                            width: 600,
                            height: 400,
                            isCancelBtn: true,
                            html:'<p class="dilog_prompt">您确定要结束当前活动吗？</p>',
                            yes: function() {
                                This.endRefuelAward.onoff = 1;
                                v$loading.show('数据提交中','two');

                                $.ajax({
                                    url : '/RefuelAward/endRefuelAward',
                                    type : 'POST',
                                    dataType : 'json',
                                    data : {
                                        refuel_id : '{{$refuel_id}}'
                                    },
                                    success : function(res){
                                        This.endRefuelAward.onoff = 0;
                                        v$loading.hide('two');

                                        if(res.status == 200){
                                            $alert(
                                                '操作成功',
                                                function(){
                                                    window.location.href = '/RefuelAward/viewList';
                                                }
                                            );
                                        }
                                        else {
                                            layer.msg(res.info);
                                        }
                                    },
                                    error : function(code){
                                        v$loading.hide('two');
                                        This.endRefuelAward.onoff = 0;
                                        layer.msg('网络错误,请稍后再试');
                                    },
                                });
                            },
                            cancel: function () {

                            }
                        })
                    },
                    // 删除 | jhd
                    delRefuelAward:function () {
	                    var This = this;
                        if(this.delRefuelAward.onoff)return;
                        $.wecarPage({
                            title: '温馨提示',
                            btnYes: '确定',
                            btnCancel:'取消',
                            width: 600,
                            height: 400,
                            isCancelBtn: true,
                            html:'<p class="dilog_prompt">确认删除当前活动吗？</p>',
                            yes: function() {
                                This.delRefuelAward.onoff = 1;
                                v$loading.show('数据提交中','two');

                                $.ajax({
                                    url : '/RefuelAward/delRefuelAward',
                                    type : 'POST',
                                    dataType : 'json',
                                    data : {
                                        refuel_id : '{{$refuel_id}}'
                                    },
                                    success : function(res){
                                        This.delRefuelAward.onoff = 0;
                                        v$loading.hide('two');

                                        if(res.status == 200){
                                            $alert(
                                                '删除成功',
                                                function(){
                                                    window.location.href = '/RefuelAward/viewList';
                                                }
                                            );
                                        }
                                        else {
                                            layer.msg(res.info);
                                        }
                                    },
                                    error : function(code){
                                        v$loading.hide('two');
                                        This.delRefuelAward.onoff = 0;
                                        layer.msgt('网络错误,请稍后再试');
                                    },
                                });
                            },
                            cancel: function () {

                            }
                        })

	                    // if(!window.confirm('您确定要删除当前活动吗？'))return;

                       
                    },
                    // 修改 | jhd
                    updateRefuelAward:function (_string) {
                    	$('#timeSelect').trigger('click');
                    },
                    //初始化时间控件
                    initlizeTimeObject : function(){
                    	var This = this;
	                    $('#timeSelect').daterangepicker(
		                    {
			                    singleDatePicker : This.status == 2,
			                    minDate : moment().subtract(-1,'day').format('YYYY-MM-DD 00:00:00'),
			                    startDate : This.status == 2 ? This.time.end : This.time.start,
			                    endDate : This.time.end,
			                    timePicker : true,
			                    timePicker24Hour : true,
			                    timePickerSeconds : true,
			                    timePicker12Hour : false,
			                    timePickerSecondInc :1,
			                    autoApply : false,
			                    timePickerIncrement : 1,
			                    format : "YYYY-MM-DD HH:mm:ss",
		                    },
		                    function(start,end){
			                    if(This.status == 2){
				                    send(
					                    This.time.start,
					                    start.format('YYYY-MM-DD HH:mm')
				                    );
				                    return;
			                    }
			                    send(
				                    start.format('YYYY-MM-DD HH:mm'),
				                    end.format('YYYY-MM-DD HH:mm')
			                    );

			                    function send(start,end){
				                    v$loading.show('数据提交中','two');
				                    $.ajax({
					                    url : '/RefuelAward/updateRefuelAward',
					                    type : 'POST',
					                    dataType : 'json',
					                    data : {
						                    refuel_id : '{{$refuel_id}}',
						                    start_time : start,
						                    end_time : end,
					                    },
					                    success : function(res){
						                    v$loading.hide('two');
						                    $alert(
							                    res.status == 200 ? '修改成功' : res.info,
							                    function(){
								                    window.location.reload();
							                    }
						                    );
					                    },
					                    error : function(code){
						                    v$loading.hide('two');
						                    $alert(
							                    '网络错误,请稍后再试',
							                    function(){
								                    window.location.reload();
							                    }
						                    );
					                    },
				                    });
			                    }
		                    }
	                    );
                    },
                    //选择返劵规则和红包
                    ev_showCouponBox : function(_config,_promiseObj){
                    	var This = this; 
                      
                        if (This.red_type == 3 && This.red_attr.length==0 ) {
                           
                            // window.v$loading.show()
                            $.ajax({
                                url : '/RedPackage/getActivityList',
                                type : 'POST',
                                dataType : 'json',
                                data:{
                                    active_type:-1,
                                    type:1,
                                    page:1,
                                    page_size: (new Date().getFullYear()*360 )
                                },
                                success : function(res){
                                 
                                    if(res.status == 200){

                                        This.red_attr = res.data.list;

                                        if (This.red_attr.length) {
                                            if(_promiseObj){
                                                _promiseObj.success();
                                            }
                                            
                                        }else{
                                            if(_promiseObj){
                                                _promiseObj.failed('没有获取到数据');
                                            }
                                        }

                                    }
                                    else {
                                        if(_promiseObj){
                                            _promiseObj.failed(res.info);
                                        }
                                    }
                                    // window.v$loading.hide();
                                },
                                error : function(code){
                                    
                                    // window.v$loading.hide();
                                    if(_promiseObj){
                                        _promiseObj.failed('网络错误,请稍后再试');
                                    }
                                },
                            });
                       
                            return
                        }
                        if(!$couponSelect.coupon_array.length){
	                        $.ajax({
                                url : '/Coupon/ajaxGetActiveCouponsNotOverdue',
                                type : 'POST',
                                dataType : 'json',
                                success : function(res){
                                	if(res.status == 200){
                                        if('data' in res && res.data.length){
                                            for(var i=0;i<res.data.length;i++){
                                            	var item = res.data[i];

                                            	item.is_vue_selected = 0;
                                            }
	                                        This.coupon_arr = res.data;
	                                        $couponSelect.coupon_array = JSON.parse(JSON.stringify(res.data));
	                                        $couponSelect.transmit_array = _config;
	                                        //如果有promise实例对象则调用
	                                        if(_promiseObj){
		                                        _promiseObj.success();
                                            }
                                        }
                                        else {
	                                        if(_promiseObj){
		                                        _promiseObj.failed('没有获取到数据');
	                                        }
                                        }
                                    }
                                    else {
		                                if(_promiseObj){
			                                _promiseObj.failed(res.info);
		                                }
                                    }
                                },
                                error : function(code){
	                                if(_promiseObj){
		                                _promiseObj.failed('网络错误,请稍后再试');
	                                }
                                },
                            });
                        	return;
                        }

	                    $couponSelect.transmit_array = _config;
                        console.log(_config);
                        var _newArray = JSON.parse(JSON.stringify(this.coupon_detail_arr.length ? this.coupon_detail_arr : this.coupon_arr)),
                            filterArray = [];

                        if($checkObject(_config.obj)){
                            for(var i=0;i<_newArray.length;i++){
                            	if(_newArray[i].coupon_id in _config.obj.award_product_id){
                                    
		                            _newArray[i].is_vue_selected = 1;
		                            filterArray.push(_newArray[i]);
                                }
                            }
                            if(!filterArray.length){
                            	if( $checkObject(_config.obj.award_product_id,1) ){
                            		var idArr = [];
                            		for(var t_key in _config.obj.award_product_id){
			                            idArr.push(t_key);
                                    }

                                    if(idArr.length){
	                                    return layer.msg('您的劵ID为:<br />' + idArr.join(','));
                                    }
                                }
                                return layer.msg('您当前的券都已过期,无法查看');
                            }
                        }

	                    $couponSelect.coupon_array = filterArray;
	                    $couponSelect.show = 1;
                    },
                    //异步加油油号
                    fn_getOilData : function(_promiseObj){
                    	var This = this;

	                    $.ajax({
                            url : '/Oil/getOil',
                            type : 'POST',
                            dataType : 'json',
                            data : {
	                            merchant_id : This.station_select.stid > 0 ? This.station_select.stid : This.station_select.group_id
                            },
                            success : function(res){
                            	if(res.status == 200){
                                    if('data' in res && res.data.length){
	                                    var oilData = [];
                                        for(var i=0;i<res.data.length;i++){
                                        	oilData.push({
                                                id : res.data[i].oil_id,
                                                name : res.data[i].oil_name,
                                            });
                                        }
                                        This.oil_array = oilData;

                                        if(_promiseObj){
	                                        _promiseObj.success();
                                        }
                                    }
                                    else {
	                                    if(_promiseObj){
                                            _promiseObj.success();
		                                    // _promiseObj.failed('未获取到油号，您可以选择活动油品为不限');
	                                    }
                                    }
                                }
                                else {
		                            if(_promiseObj){
			                            _promiseObj.failed(res.info);
		                            }
                                }
                            },
                            error : function(code){
	                            if(_promiseObj){
		                            _promiseObj.failed('网络错误,请稍后再试');
	                            }
                            }
                        });
                    },
                    //填数据 
                    fn_addData : function (data) {

                        function stringToNumber(str,defaultValue=1) {
                            const num = parseFloat(str);
                            return isNaN(num) ? defaultValue : num;
                        }

                        var arr = data.limit_data,This = this;
                        this.detailInfo = data;
                        this.detailInfo.is_mutx_coupon  = stringToNumber(this.detailInfo.is_mutx_coupon)
                        this.detailInfo.is_mutx_discount = stringToNumber(this.detailInfo.is_mutx_discount)
                        This.red_type = arr[0].award_product_type;
                        This.status = data.status;
                        This.user_type = data.user_type;
                        This.plate_limit = data.plate_limit;
                        This.activity_id = data.id;
                        if(data.area_info){
                            This.oli_obj=JSON.parse(JSON.stringify(data.area_info));
                        }
                        This.detail_name = data.name;
                        This.time = {
                            create : data.create_time,
                            start : data.start_time,
                            end : data.end_time,
                        };
                        This.time_info = data.time_info;
                        This.count_day_number = data.day_limit;
                        This.timeUnchanged = data.start_time;
                        This.initlizeTimeObject();
                        This.count_number = data.award_count_limit;
                        This.notice_type = Number(data.is_send_sms);
                        if(This.notice_type == 1)This.notice_html = data.sms_content;
                        This.reward_type = data.award_product_type;//奖励类型 1.劵 2.红包
                        if('award_product_info' in data && ($.isArray(data.award_product_info) && data.award_product_info.length)){
                            //取得详情返回的劵信息
                            This.coupon_detail_arr = data.award_product_info;
                        }
                        //身份等级获取
                        if('identify' in data && data.identify){
                            (function(){
                                var tt = data.identify,
                                    arr = [];

                                this.identify_type = tt.identify_type;
                                //白黑名单
                                if(tt.identify_type == 1 || tt.identify_type == 2){
                                    //专车身份
                                    if('driver' in tt && tt.driver.length){
                                        for(var m=0;m<tt.driver.length;m++){
                                            arr.push(tt.driver[m]['identify_name']);
                                        }
                                        if(arr.length)this.identify_arr = arr;
                                    }
                                    //等级身份
                                    if('level' in tt && tt.level.length){
                                        for(var m=0;m<tt.level.length;m++){
                                            arr.push(tt.level[m]['identify_name']);
                                        }
                                        if(arr.length)this.identify_arr = arr;
                                    }
                                }
                            }.bind(This))();
                        }

                        //循环取得每个项目
                        for(var i=0,bigArr = [];i<arr.length;i++){
                            var bigJson = {},
                                bigItem = arr[i];

                            //油品
                            if(bigItem.product_id[0] == 0){
                                bigJson.oil_type = 0;
                                bigJson.oil_selected = [];
                            }
                            else {
                                bigJson.oil_type = 1;
                                bigJson.oil_selected = bigItem.product_id;
                            }
                            //限制类型
                            bigJson.limit_type = bigItem.limit_type;
                            //梯度奖励
                            bigJson.condition = [];
                            for(var j=0;j<bigItem.amount.length;j++){
                                var json = {},
                                    item = bigItem.amount[j];

                                json.min_money = item.amount_min;
                                json.max_money = item.amount_max;



                                (function(){
                                    if(This.reward_type == 2){
                                        //红包的奖励
                                        var thatArray = item.award_product_id.split(','),
                                            totalMoney = 0,
                                            contrastObject = (function(){
                                                var obj = {},
                                                    data = data.award_product_info,
                                                    i = 0;
                                                for(;i<data.length;i++){
                                                    obj[ data[i]['id'] ] = data[i];
                                                }
                                                return obj;
                                            })();

                                        if(thatArray[0]){
                                            json.red_envelopes_info_array = [];
                                            for(var k=0;k<thatArray.length;k++){
                                                if(thatArray[k] in contrastObject){
                                                    json.red_envelopes_info_array.push(
                                                        '红包编号:' + thatArray[k] +
                                                        '，红包金额:' +  Number(contrastObject[ thatArray[k] ].price).toFixed(2) +
                                                        '元，红包名称:' + contrastObject[ thatArray[k] ].name
                                                    );
                                                    totalMoney += Number(contrastObject[ thatArray[k] ].price);
                                                }
                                                else {
                                                    json.red_envelopes_info_array.push(
                                                        '红包编号:' + thatArray[k]
                                                    );
                                                }
                                            }
                                            json.coupon_select = {
                                                award_product_id : {},
                                                total : 0,
                                                length : 0,
                                            };
                                            json.red_envelopes_total_money = totalMoney;
                                        }
                                        return;
                                    }
                                    //劵的奖励
                                    var thatArray = item.award_product_id.split(','),
                                        filter = {},
                                        totalLength = 0,
                                        classLength = 0;
                                    if(thatArray[0]){
                                        for(var k=0;k<thatArray.length;k++){
                                            if(thatArray[k] in filter){
                                                filter[ thatArray[k] ]['length']++;
                                            }
                                            else {
                                                filter[ thatArray[k] ] = {
                                                    length : 1
                                                };
                                                classLength++;
                                            }
                                            totalLength++;
                                        }
                                    }

                                    json.coupon_select = {
                                        red_Data : (function (argument) {
                                            item.award_product_id;
                                            for (var i = 0; i < This.red_attr.length; i++) {

                                                
                                                if (This.red_attr[i].id == item.award_product_id) {
                                                    return {name:This.red_attr[i].name,data:This.red_attr[i]};
                                                    
                                                }
                                                
                                            };
                                        })(),
                                        red_id : item.award_product_id,
                                        award_product_id : filter,
                                        total : totalLength,
                                        length : classLength,
                                    };
                                })();
                            
                                bigJson.condition.push(json);
                            }



                            bigArr.push(bigJson);
                        }
                        This.use_project = bigArr;
                                    
                    },
                    //获取详情信息
	                fn_getDetailInfo : function(_promiseObj){
		                var This = this;

		                $.ajax({
			                url : '/RefuelAward/getRefuelAwardInfo',
			                type : 'POST',
			                dataType : 'json',
			                data : {
				                refuel_id : '{{$refuel_id}}',
			                },
			                success : function(res){
				                if(res.status == 200){
				                	if('data' in res && 'limit_data' in res.data && res.data.limit_data.length){
                                        This.data = res.data;
                                        This.red_type = res.data.limit_data[0].award_product_type;
                                        _promiseObj.Promise();
                                    }
                                    else {
						                _promiseObj.failed('没有获取到数据');
                                    }

                                    if ('data' in res && 'identify' in res.data) {
                                        var identify = res.data.identify;
                                        This.identify_type = identify.identify_type;

                                        if (identify.driver) {
                                            for (let i = 0 ; i<identify.driver.length; i++ ) {
                                                This.identify_driver += identify.driver[i]['identify_name'];
                                                if (i < identify.driver.length - 1) {
                                                    This.identify_driver += ',';
                                                }
                                            }
                                        }
                                        
                                        if (identify.level) {
                                            for (let i = 0 ; i<identify.level.length; i++ ) {
                                                This.identify_level += identify.level[i]['identify_name'];
                                                if (i < identify.level.length - 1) {
                                                    This.identify_level += ',';
                                                }
                                            }
                                        }
                                    }

					                _promiseObj.success();
				                }
				                else {
					                if(_promiseObj){
						                _promiseObj.failed(res.info);
					                }
				                }
			                },
			                error : function(code){
				                if(_promiseObj){
					                _promiseObj.failed('网络错误,请稍后再试');
				                }
			                }
		                });
                    },
                    //同步获取到劵信息和油号
                    fn_getAllData : function(){
	                    "use strict";
                        var This = this;

	                    if( Promise ){
	                    	v$loading.show('获取数据中','two');
                            (function(){
                                var _promise = new Promise(function(resolve,reject){
                                    This.fn_getDetailInfo({
                                        success : resolve,
                                        failed : reject,
                                        Promise : function  (argument) {
                                            Promise.all([
                                                  
                                                    (function(){
                                                        var _promise = new Promise(function(resolve,reject){
                                                            This.ev_showCouponBox(
                                                                {
                                                                    bigIndex : 0,
                                                                    index : 0,
                                                                    obj : []
                                                                },
                                                                {
                                                                    success : resolve,
                                                                    failed : reject
                                                                }
                                                            );
                                                        });

                                                        return _promise;
                                                    })(),
                                                    (function(){
                                                        var _promise = new Promise(function(resolve,reject){
                                                            This.fn_getOilData({
                                                                success : resolve,
                                                                failed : reject
                                                            });
                                                        });

                                                        return _promise;
                                                    })(),
                                                    
                                                    
                                                ]).then(function(){
                                                    
                                                    This.fn_addData(This.data);
                                                    v$loading.hide('two');
                                                    This.boxShow = 1;
                                                })
                                                .catch(function(error){

                                                    v$loading.hide('two');
                                                    $alert(error,function(){
                                                        window.location.reload();
                                                    });
                                                });
                                        }

                                    });
                                });

                                return _promise;
                            })();

		                   
                            
                        }
                        else {
                            alert('抱歉，您的浏览器不支持指定API<br />请您下载标准浏览器,如chrome,火狐,360等<br />给你带来不便敬请谅解');
                        }
                    },
                    //通过给定油号ID换取油号名称
                    fn_switchOilIdToName : function(_arr){
                    	var _newArr = [];
                    	for(var i=0;i<_arr.length;i++){
                    		for(var k=0;k<this.oil_array.length;k++){
                    			if(_arr[i] == this.oil_array[k].id){
				                    _newArr.push(this.oil_array[k].name);
                                }
                            }
                        }

                        return _newArr;
                    }
                },
            });

            var $couponSelect = new Vue({
                el : '#couponSelect',
                data : {
                	show : 0,
	                coupon_array : [],
                    coupon_detail : [],
	                transmit_array : {},
                },
                computed : {
                	hasAllSelected : function(){

                        
                        for(var i=0;i<this.coupon_array.length;i++){
                        	var item = this.coupon_array[i];
                        	if(!item.is_vue_selected){
                        		return 0;
                            }
                        }
                        return 1;
                    }
                },
                methods : {
                	//选中优惠券后
                    ev_selectedCoupon : function(e,item,index){
                        var tar = e.target;
	                    // item.is_vue_selected = Number(tar.checked);
	                    if(tar.checked){
	                    	Vue.set(
			                    this.transmit_array.obj,
			                    item.coupon_id,
                                {
	                                id : item.coupon_id,
	                                count : 1,
                                }
                            );
                        }
                        else {
	                    	Vue.delete(
			                    this.transmit_array.obj,
			                    item.coupon_id
                            );
                        }
                        var countObj = $checkObject(this.transmit_array.obj);
	                    Vue.set(
		                    this.transmit_array.obj,
                            'length',
		                    countObj.length
                        );
	                    Vue.set(
		                    this.transmit_array.obj,
		                    'total',
		                    countObj.total
	                    );
                        //跨域赋值
                        Vue.set(
	                        $container.use_project[ this.transmit_array.bigIndex ]['condition'][ this.transmit_array.index ],
                            'coupon_select',
	                        this.transmit_array.obj
                        );
                    },
                    //全选的优惠券
                    ev_allSelectedCoupon : function(e){
                        var tar = e.target;
	                    for(var i=0;i<this.coupon_array.length;i++){
		                    var item = this.coupon_array[i];
		                    // item.is_vue_selected = Number(tar.checked);
		                    if(tar.checked){
			                    if(!(item.coupon_id in this.transmit_array.obj)){
				                    this.transmit_array.obj[item.coupon_id] = {
					                    id : item.coupon_id,
					                    count : 1,
				                    };
			                    }
                            }
	                    }
	                    if(tar.checked){
		                    var countObj = $checkObject(this.transmit_array.obj);
		                    this.transmit_array.obj.length = countObj.length;
		                    this.transmit_array.obj.total = countObj.total;
                        }
                        else {
		                    this.transmit_array.obj = {
			                    length : 0
		                    };
                        }
	                    //跨域赋值
	                    $container.use_project[ this.transmit_array.bigIndex ]['condition'][ this.transmit_array.index ]['coupon_select'] = this.transmit_array.obj;
                    },
                    //移入优惠券
	                ev_hoverCoupon : function(e,item,index){
		                var tar = e.target;
                      this.ev_hoveroutCoupon();

                        this.coupon_detail.push({
                            name : '劵ID',
                            value : item.coupon_id,
                        });
		                this.coupon_detail.push({
			                name : '创建时间',
			                value : $date('Y-m-d H:i:s',(String(item.detail_time) + '000')),
		                });
		                this.coupon_detail.push({
			                name : '劵名称',
			                value : item.coupon_name,
		                });
		                this.coupon_detail.push({
			                name : '分账券',
			                value : item.profit_sharing == 1 ? '是' : '否',
		                });
                      if (item.price_type == 1) {
                          this.coupon_detail.push({
                              name: '劵金额',
                              value: '固定金额' + Number(item.price_rule.price).toFixed(2) + '元',
                          });
                      } else if (item.price_type == 2) {
                          this.coupon_detail.push({
                              name: '劵金额',
                              value: '随机金额' + Number(item.price_rule.min_price).toFixed(2) + '元~' + Number(item.price_rule.max_price).toFixed(2) + '元',
                          });
                      }else if (item.price_type == 5) {
                          this.coupon_detail.push({
                              name: '劵金额',
                              value: Number(item.price_rule.price)+'元/升',
                          });
                      }else{
                          this.coupon_detail.push({
                              name: '劵折扣',
                              value: item.price_rule.discount + '折',
                          });
                      }
                      if (item.validate_days.validate_days > 0) {
                          this.coupon_detail.push({
                              name: '有效期内',
                              value: '自领取之日' + item.validate_days.validate_days + '天内有效',
                          });
                      } else {
                          this.coupon_detail.push({
                              name: '有效期为',
                              value: $date('Y-m-d H:i:s', String(item.validate_days.start_time) + '000') + ' 至 ' + $date('Y-m-d H:i:s', String(item.validate_days.end_time) + '000'),
                          });
                      }
                        try {
                            (function(){
                            	var data = JSON.parse(item.desc);
                            	if(data.limit_desc){
		                            this.coupon_detail.push({
			                            name : '使用条件',
			                            value : data.limit_desc,
		                            });
                                }
                                if(data.time_desc){
	                                this.coupon_detail.push({
		                                name : '使用时间',
		                                value : data.time_desc,
	                                });
                                }
                                if(data.type_desc){
	                                this.coupon_detail.push({
		                                name : '使用范围',
		                                value : data.type_desc,
	                                });
                                }
                            }.bind(this))();
                        }
                        catch(code){}
                    },
                    //移除优惠券
	                ev_hoveroutCoupon : function(){
	                	this.coupon_detail = [];
                    },
                },
                mounted : function(){
	                //获取所有数据(因为目前只是实例完成了创建,并未到最后一步返回该实例化对象,所以需要一个延迟)
                    setTimeout(function(){
	                    $container.fn_getAllData();
                    },222);
                },
            });
	    })();});

	    //获取时间 | 参数1:时间格式字符串 2:时间戳,不传默认为当前时间
	    function $date(_typeStr,_stamp){
		    if(!_typeStr || typeof _typeStr != 'string')return _typeStr;
		    if(typeof _stamp != 'undefined'){
			    if(!isNaN(_stamp)){
				    _stamp = Number(_stamp);
			    }
		    }
		    var thatDate = typeof _stamp == 'number' ? (new Date(_stamp)) : (new Date()),
			    hasRegexp = /[YmdHisw]/g;

		    var supplement = function(_num){
			    _num = String(_num);
			    return _num.length == 1 ? ("0" + _num) : _num;
		    }

		    _typeStr = _typeStr.replace(
			    hasRegexp
			    ,
			    function(v){
				    if( v == "Y" ){
					    return thatDate.getFullYear();
				    }
				    else if( v == "m" ){
					    return supplement(thatDate.getMonth() + 1);
				    }
				    else if( v == "d" ){
					    return supplement(thatDate.getDate());
				    }
				    else if( v == "H" ){
					    return supplement(thatDate.getHours());
				    }
				    else if( v == "i" ){
					    return supplement(thatDate.getMinutes());
				    }
				    else if( v == "s" ){
					    return supplement(thatDate.getSeconds());
				    }
				    else if( v == "w" ){
					    var day = thatDate.getDay(),
						    numberArr = ["日","一","二","三","四","五","六"];
					    return numberArr[day];
				    }
				    else {
					    return v;
				    }
			    }
		    );

		    return _typeStr;
	    }
	    //弹出信息
        function $alert(msg,_callback){
	        if(layer){
		        layer.open({
			        title : '温馨提示',
			        content : typeof msg != 'string' ? msg.toString() : msg,
			        yes : callback,
			        /*cancel : callback,*/
		        });

		        function callback(index){
			        layer.close(index);
			        _callback && _callback();
                }
	        }
	        else {
		        alert(msg);
		        _callback && _callback();
	        }
        }
        //检查对象
        function $checkObject(_obj,_boolean){
        	if(_boolean){
        		for(var key in _obj){
        			return true
                }
                return false;
            }
            else {
        		var i = 0,
        		    total = 0;
        		for(var key in _obj){
        			if(key !== 'length' && key != 'total'){
        				i++;
                    }
                    if(_obj[key] && typeof _obj[key].count != 'undefined'){
                        total += Number(_obj[key].count);
                    }
                }

                return { length : i , total : total };
            }
        }

        function render(data){
            var str = strFun(data);

            layer.open({
                type: 1,
                title: '券详情', //不显示标题栏
                closeBtn: 1,
                area: '600px',
                shade: 0.8,
                id: 'j_layuipro' ,//设定一个id，防止重复弹出
                resize: false,
                btn: '确认',
                shade: [1, 'rgba(255,255,255,0.75)'],
                btnAlign: 'c',
                moveType: 0, //拖拽模式，0或者1
                content:' <div class="layui-wcc-inquiry" style="height:auto;"><div class="coupon_info_box">'+str+'</div></div> ', 
            });
        }


        function strFun (data) {
            var str = '';
            var coupon_info_box = $(document.querySelector('#coupon_info_box'));
            var coupon_info = data;

            str += '<div class="info_unit_box clear" id="' + coupon_info.coupon_id + '"><div class="lf_box">券ID:</div><div class="rt_box">' + coupon_info.coupon_id + '</div></div>';
            str += '<div class="info_unit_box clear"><div class="lf_box">创建时间:</div><div class="rt_box">' + coupon_info.create_time + '</div></div>';
            str += '<div class="info_unit_box clear"><div class="lf_box">券名:</div><div class="rt_box">' + coupon_info.coupon_name + '</div></div>';
            str += '<div class="info_unit_box clear"><div class="lf_box">分账券:</div><div class="rt_box">' + (coupon_info.profit_sharing == 1 ? '是' : '否') + '</div></div>';
            str += '<div class="info_unit_box clear"><div class="lf_box">券类型:</div><div class="rt_box">' + coupon_info.coupon_type.join(',') + '</div></div>';
            str += '<div class="info_unit_box clear"><div class="lf_box">金额类型:</div><div class="rt_box">' + coupon_info.price_type + '</div></div>';
            if( coupon_info.validate_days_type == 2 ){
                str += '<div class="info_unit_box clear"><div class="lf_box">有效日期:</div><div class="rt_box">' + coupon_info.validate_day_start + '至' + coupon_info.validate_day_end + '</div></div>';
            }else{
                str += '<div class="info_unit_box clear"><div class="lf_box">有效日期:</div><div class="rt_box">自领取之日' + coupon_info.validate_day + '天内有效</div></div>';
            }
            str += '<div class="info_unit_box clear"><div class="lf_box">可用平台:</div><div class="rt_box">' + coupon_info.platform + '</div></div>';
            str += '<div class="info_unit_box clear"><div class="lf_box">优惠限制:</div><div class="rt_box">' + coupon_info.mutex + '</div></div>';

            //可用范围
            var select_station = [];
            $(coupon_info.select_region).each(function () {
                select_station.push( $(this)[0].stname );
            })

            str += '<div class="info_unit_box clear"><div class="lf_box">可用范围:</div><div class="rt_box">' + select_station.join(', ') + '可用</div></div>';
            if (coupon_info.desc && coupon_info.desc.time_desc) {
                str += '<div class="info_unit_box clear"><div class="lf_box">可用时间:</div><div class="rt_box">' + coupon_info.desc.time_desc + '</div></div>';
            }

            //可用类型一键加油
            if( coupon_info.coupon_type_id[0] == 2 ){
                if( coupon_info.limit_type == 0 ){
                    str += '<div class="info_unit_box clear"><div class="lf_box">限制类型:</div><div class="rt_box">不限</div></div>';
                }
                else {
                    str += '<div class="info_unit_box clear"><div class="lf_box">限制类型:</div><div class="rt_box">'+ ( coupon_info.limit_type == 1 ? '仅以下身份/等级可用' : '仅以下身份/等级不可用' ) +'</div></div>';
                    (function(){
                        var i = 0,
                            length = coupon_info.level_rule.length,
                            value = '';

                        if (length != 0) {
                            //渲染等级
                            for(;i<length;i++){
                                value += coupon_info.level_rule[i] + ',';
                            }
                            str += '<div class="info_unit_box clear"><div class="lf_box">等级身份:</div><div class="rt_box">' + value.slice(0,value.length-1) + '</div></div>';
                        }

                        i = 0;
                        length = coupon_info.identify_rule.length;
                        value = '';
                        if (length != 0) {
                            //渲染身份
                            for(;i<length;i++){
                                value += coupon_info.identify_rule[i] + ',';
                            }
                            str += '<div class="info_unit_box clear"><div class="lf_box">认证身份:</div><div class="rt_box">' + value.slice(0,value.length-1) + '</div></div>';
                        }

                        i = 0;
                        length = coupon_info.tag_rule.length;
                        value = '';
                        if (length != 0) {
                            //渲染身份
                            for(;i<length;i++){
                                value += coupon_info.tag_rule[i] + ',';
                            }
                            str += '<div class="info_unit_box clear"><div class="lf_box">自定义身份:</div><div class="rt_box">' + value.slice(0,value.length-1) + '</div></div>';
                        }


                    })();
                }
                if (coupon_info.desc && coupon_info.desc.limit_desc) {
                    str += '<div class="info_unit_box clear"><div class="lf_box">使用条件:</div><div class="rt_box">' + coupon_info.desc.limit_desc + '</div></div>';
                }
            }
            //可用类型为非油品
            else if( coupon_info.coupon_type_id[0] == 3 ){
                str += '<div class="info_unit_box clear"><div class="lf_box">可用商品:</div><div class="rt_box">' + coupon_info.retail_names.join(', ') +'</div></div>';
                var j_n=0;
                for(var i = 0; i < coupon_info.amount_rule_orig[0].rule_detail.length; i++ ){
                    if (j_n <= coupon_info.amount_rule_orig[0].rule_detail[i].amount_limit ) {
                        j_n = coupon_info.amount_rule_orig[0].rule_detail[i].amount_limit
                    }
                }
                str += '<div class="info_unit_box clear"><div class="lf_box">使用条件:</div><div class="rt_box">付款满' + j_n +'元可用</div></div>';
            }



            return str
        }

    </script>
@endsection
