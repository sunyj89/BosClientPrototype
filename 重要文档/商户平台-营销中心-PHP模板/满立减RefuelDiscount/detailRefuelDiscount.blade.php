@extends('layout/master')

@section('header')
    <link rel="stylesheet" href="/css/wecar.css?v={{config('constants.wcc_file_version')}}" />
    <link rel="stylesheet" href="/css/wcc.css?v={{config('constants.wcc_file_version')}}" />
    <link rel="stylesheet" href="/css/RefuelDiscount/detailRefuelDiscount.css?v={{config('constants.wcc_file_version')}}" />
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
            <div class="detailContainer_lineBox_right">满额立减</div>
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
            <div class="detailContainer_lineBox_right" v-html="time_info"></div>
        </div>


        <div class="detailContainer_lineBox">
            <div class="detailContainer_lineBox_left">活动创建时间：</div>
            <div class="detailContainer_lineBox_right">@{{time.create}}</div>
        </div>
        <div class="detailContainer_lineBox">
            <div class="detailContainer_lineBox_left">参与资格：</div>
            <div class="detailContainer_lineBox_right">
                <em v-if='identify_type == 0'>所有用户</em>
                <em v-if='identify_type == 3'>新用户</em>
            </div>
        </div>
        <div class="detailContainer_lineBox">
            <div class="detailContainer_lineBox_left">是否与券优惠同享：</div>
            <div class="detailContainer_lineBox_right">
                <em v-if='discount_with_coupon == 0'>不可同享</em>
                <em v-if='discount_with_coupon == 1'>可同享</em>
            </div>
        </div>
        <div class="detailContainer_lineBox">
            <div class="detailContainer_lineBox_left">是否与积分抵油同享：</div>
            <div class="detailContainer_lineBox_right">
                <em v-if='discount_with_credit == 0'>不可同享</em>
                <em v-if='discount_with_credit == 1'>可同享</em>
            </div>
        </div>

        <template v-if="station_select.stid == 0 && station_select.group_id > 0">
            <div class="detailContainer_lineBox">
                <div class="detailContainer_lineBox_left">活动油站：</div>
                <div class="detailContainer_lineBox_right" v-if="!oli_obj">集团下所有油站</div>
                <div class="detailContainer_lineBox_right" v-else v-html="show_oil()">
                </div>
            </div>
        </template>



        <div class="detailContainer_lineBox addProjectContainer" isauto="1">
            <div class="detailContainer_lineBox_left">立减规则：</div>
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
                                    <template v-else-if="bigItem.limit_type == 4">
                                        <em>限制类型：&nbsp;单升直降</em>
                                    </template>
                                </div>
                            </div>
                           
                            <template  v-for="(item,index) in bigItem.condition">
                                <div class="ruleContainer_box">
                                    <div class="ruleContainer_block">
                                        <em v-bind:style="{ opacity : index == 0 ? 1 : 0 }">立减梯度：&nbsp;&nbsp;</em>
                                        <em>消费大于等于</em>
                                        <em>&nbsp;@{{item.min_money}}</em>
                                        <div class="ruleContainer_center">小于</div>
                                        <em>@{{item.max_money}}&nbsp;</em>
                                        <i>@{{bigItem.limit_type == -1 ? '元/升，' : bigItem.limit_type == 3 ? '升，' : '元，'}}</i>
                                        <div v-if="bigItem.limit_type == 4" class="ruleContainer_center">每升直降@{{item.discount_price}}元</div>
                                        <div v-else class="ruleContainer_center">立减@{{item.discount_price}}元</div>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </template>

            </div>
        </div>

        <div class="detailContainer_lineBox">
            <div class="detailContainer_lineBox_left">奖励限制：</div>
            <div class="detailContainer_lineBox_right">
                <em>每个用户在本次活动中，每日最多可获得<i style="color:#32af50;"> @{{count_day_number}} </i>次奖励，最多可以获得<i style="color:#32af50;"> @{{count_number}} </i>次奖励</em>
            </div>
        </div>


        <div class="detailContainer_lineBox" style="margin-top:50px;">
            <template v-if="status == 1">
                <div class="submitButton wcc_btn_fat_green btn_fat_red" style="margin-left:164px;"  v-on:click="delRefuelDiscount">删除</div>
                <div class="submitButton wcc_btn_fat_green" style="margin-left:20px;"  v-on:click="updateRefuelDiscount('您确定要修改当前活动的时间吗？')">修改时间</div>
            </template>
            <template v-else-if="status == 2">
                <div class="submitButton wcc_btn_fat_green btn_fat_red" style="margin-left:164px;"  v-on:click="endRefuelDiscount">立即结束</div>
                <div class="submitButton wcc_btn_fat_green" style="margin-left:20px;"  v-on:click="updateRefuelDiscount('您确定要延迟结束时间来延缓当前活动吗？')">修改结束时间</div>
            </template>
        </div>

    </div>
@endsection


@section('footer')
    <script src="/js/vue_component.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/wecar.js?v={{config('constants.wcc_file_version')}}"></script>
    <script>
        var station_select = {!!json_encode($station_arr_selected)!!};
	    $(function(){(function(){
            var $container = new Vue({
                el : '#detailBox',
                data : {
                    station_select:station_select,
                    data:null,
                    discount_method_type:1,
                    identify_type:0,
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
                    discount_with_coupon: 0,//与券优惠是否同享0不同享1可同享
                    discount_with_credit: 0,//与积分抵油是否同享0不同享1可同享
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
                    use_project : [{
	                        oil_type : -1,
		                    oil_selected : [],
		                    limit_type : -1,
		                    condition : [{
			                    min_money : '',
			                    max_money : '',
                                discount_price: '',

		                    }],
                    }],

                },
                methods : {
                    show_oil:function(){
                        var str='';
                        for(var key in this.oli_obj){
                            str+=this.oli_obj[key].stname+'、'
                        }
                        return str;
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
                    endRefuelDiscount:function (argument) {
                        var This = this;
                        if(this.endRefuelDiscount.onoff)return;
                        $.wecarPage({
                            title: '温馨提示',
                            btnYes: '确定',
                            btnCancel:'取消',
                            width: 600,
                            height: 400,
                            isCancelBtn: true,
                            html:'<p class="dilog_prompt">您确定要结束当前活动吗？</p>',
                            yes: function() {
                                This.endRefuelDiscount.onoff = 1;
                                v$loading.show('数据提交中','two');

                                $.ajax({
                                    url : '/RefuelDiscount/endRefuelDiscount',
                                    type : 'POST',
                                    dataType : 'json',
                                    data : {
                                        refuel_id : '{{$refuel_id}}'
                                    },
                                    success : function(res){
                                        This.endRefuelDiscount.onoff = 0;
                                        v$loading.hide('two');

                                        if(res.status == 200){
                                            $alert(
                                                '操作成功',
                                                function(){
                                                    window.location.href = '/RefuelDiscount/viewList';
                                                }
                                            );
                                        }
                                        else {
                                            layer.msg(res.info);
                                        }
                                    },
                                    error : function(code){
                                        v$loading.hide('two');
                                        This.endRefuelDiscount.onoff = 0;
                                        layer.msg('网络错误,请稍后再试');
                                    },
                                });
                            },
                            cancel: function () {

                            }
                        })
                    },
                    // 删除 | jhd
                    delRefuelDiscount:function () {
	                    var This = this;
                        if(this.delRefuelDiscount.onoff)return;
                        $.wecarPage({
                            title: '温馨提示',
                            btnYes: '确定',
                            btnCancel:'取消',
                            width: 600,
                            height: 400,
                            isCancelBtn: true,
                            html:'<p class="dilog_prompt">确认删除当前活动吗？</p>',
                            yes: function() {
                                This.delRefuelDiscount.onoff = 1;
                                v$loading.show('数据提交中','two');

                                $.ajax({
                                    url : '/RefuelDiscount/delRefuelDiscount',
                                    type : 'POST',
                                    dataType : 'json',
                                    data : {
                                        refuel_id : '{{$refuel_id}}'
                                    },
                                    success : function(res){
                                        This.delRefuelDiscount.onoff = 0;
                                        v$loading.hide('two');

                                        if(res.status == 200){
                                            $alert(
                                                '删除成功',
                                                function(){
                                                    window.location.href = '/RefuelDiscount/viewList';
                                                }
                                            );
                                        }
                                        else {
                                            layer.msg(res.info);
                                        }
                                    },
                                    error : function(code){
                                        v$loading.hide('two');
                                        This.delRefuelDiscount.onoff = 0;
                                        layer.msgt('网络错误,请稍后再试');
                                    },
                                });
                            },
                            cancel: function () {

                            }
                        })

                    },
                    // 修改 | jhd
                    updateRefuelDiscount:function (_string) {
                    	$('#timeSelect').trigger('click');
                    },
                    //初始化时间控件
                    initlizeTimeObject : function(){
                    	var This = this;
	                    $('#timeSelect').daterangepicker(
		                    {
			                    singleDatePicker : This.status == 2,
			                    minDate : moment().format('YYYY-MM-DD 00:00:00'),
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
					                    url : '/RefuelDiscount/updateRefuelDiscount',
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

                        
                        var arr = data.limit_data,This = this;
                        This.discount_method_type = arr[0].discount_method_type;
                        This.status = data.status;
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
                        This.discount_with_coupon = data.discount_with_coupon;//满额立减与券是否同享
                        This.discount_with_credit = data.discount_with_credit;//满额立减与积分是否同享
                        This.initlizeTimeObject();
                        This.count_number = data.discount_count_limit;
                        This.notice_type = Number(data.is_send_sms);
                        if(This.notice_type == 1)This.notice_html = data.sms_content;
                        //身份等级获取
                        if('identify' in data && data.identify){
                            (function(){
                                var tt = data.identify,
                                    arr = [];

                                this.identify_type = tt.identify_type;
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
                                json.discount_price = item.discount_price;//立减金额
                            
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
			                url : '/RefuelDiscount/getRefuelDiscountInfo',
			                type : 'POST',
			                dataType : 'json',
			                data : {
				                refuel_id : '{{$refuel_id}}',
			                },
			                success : function(res){
				                if(res.status == 200){
				                	if('data' in res && 'limit_data' in res.data && res.data.limit_data.length){
                                        This.data = res.data;
                                        This.discount_method_type = res.data.limit_data[0].discount_method_type;
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
                    //同步获取到劵信息(不用获取)和油号
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

    </script>
@endsection
