@extends('layout/master')

@section('header')
    <link rel="stylesheet" href="/css/wcc.css?v={{config('constants.wcc_file_version')}}" />
    <link rel="stylesheet" href="/css/RefuelDiscount/refuelDiscount.css?v={{config('constants.wcc_file_version')}}" />
@endsection


@section('content')
<div id="app">
	<wcc-loading v-show="boolean" type='2'></wcc-loading>

	<!-- <div class="clear statistics_superBody">
		<div class="wcc_input wcc_select statistics_right statistics_m20 statistics_box statistics_w265 ">
			<div>@{{name}}</div>
			
		</div>
	</div> -->
	<div class="superBody_navLocal superBody_navLocal2">
		<div>
			@{{name}}满额立减活动<span class="size12_999 mlr10 font-weight">( 更新时间@{{filterTime()}} )</span>
		</div>
		<div class="wcc_btn_export"  v-on:click="exporFun" id="exportUseDetail">
			<i class="wcc_btn_i">&#xe67b;</i>
			<span class="wcc_btn_span">导出数据</span>
		</div>
	</div>
    <div>
    	<div class="statistics_title">活动数据统计</div>
    	<ul class="statistics_ul clear">
    		<li>
    			<div class="statistics_li">
    				<div class="statistics_ul_top">
    				满额立减人次
	    			</div>
	    			<div class="statistics_index_number">
	    				<span class="size34_1996FA" :style="fontSize">@{{listData.num ? listData.num : 0}}</span>
	    				<span class="size12_999">次</span>
	    			</div>
    			</div>
    		</li>
    		<li>
    			<div class="statistics_li">
    				<div class="statistics_ul_top">
    				参与人数
	    			</div>
	    			<div class="statistics_index_number">
	    				<span class="size34_1996FA" :style="fontSize">@{{listData.u_num ? listData.u_num : 0}}</span>
	    				<span class="size12_999">人</span>
	    			</div>
    			</div>
    		</li>
    		<li>
    			<div class="statistics_li">
    				<div class="statistics_ul_top">
    				营销成本
	    			</div>
	    			<div class="statistics_index_number">
	    				<span class="size34_1996FA" :style="fontSize">@{{listData.activity_cost_sum ? listData.activity_cost_sum : 0}}</span>
	    				<span class="size12_999">元</span>
	    			</div>
    			</div>
    		</li>
    	</ul>


    </div>	
</div>


@endsection


@section('footer')
   <script src="/js/vue_component.js?v={{config('constants.wcc_file_version')}}"></script>
   <script src="/js/vendor/Plug/Plug.js?v={{config('constants.wcc_file_version')}}"></script>
   <script>
   // RefuelDiscount/getStatistics
   var search = window.location.search.split('?refuel_id=')[1];
   search = search.split('&name=');
   function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg); //匹配目标参数
	if(r != null) return decodeURI(r[2]); //decodeURI参数内容。
	return null; //返回参数值
  }  
 

   var $vue = new Vue({
	 	el:'#app',
	 	data:{
	 		refuel_id:search[0],
	 		name: getUrlParam('name'),
	 		boolean:false,
	 		statusAttr:['待审核','已通过','不合格'],
	 		fontSize:32,
	 		listData:[], 	
	 	},
	 	mounted:function () {
	 		this.ajax();
	 	},
	
	 	methods:{
            filterTime() {
                return moment().format('YYYY-MM-DD HH:mm:ss')
            },
	 		
	 		exporFun:function  () {
	 			if ( $('#exportUseDetail').timing() ) {return }
	 			window.location.href ='/RefuelDiscount/explodeActivity?refuel_id='+this.refuel_id;
	 		},
	 		ajax:function () {
	 			var This = this;
	 			This.boolean = true;

		 		$.ajax({
		 			url:"/RefuelDiscount/getStatistics",
		 			data:{
		 				refuel_id:This.refuel_id,
		 			},
		 			type:'POST',
		 			dataType:'json',
		 			success:function (data) {
		 				if (data.status==200) {
		 					data.data.consumption= (Number(data.data.user_use_num)/Number(data.data.get_num) *100) || 0;
		 					data.data.Voucher= (Number(data.data.coupon_use_num)/Number(data.data.coupon_num) *100) || 0;
		 					data.data.consumption=data.data.consumption.toFixed(2);
		 					data.data.Voucher=data.data.Voucher.toFixed(2);

		 					data.data.send_coupon_price=Number(data.data.send_coupon_price);
		 					data.data.use_coupon_price=Number(data.data.use_coupon_price);

		 					data.data.send_coupon_price=data.data.send_coupon_price.toFixed(0);
		 					data.data.use_coupon_price=data.data.use_coupon_price.toFixed(0);

		 					

		 					var length = 0;
		 					for (var prop in data.data) {
		 						
		 						if ( !data.data[prop] && data.data[prop]!='' ){
		 							data.data[prop] = '0';
		 						}else{
		 							data.data[prop] = data.data[prop]+'';
		 						}
		 						if (length<data.data[prop].length) {
		 							length=data.data[prop].length
		 						}
		 						
		 					}


		 					This.fontSize = 'font-size:'+ $.fontSize(32,(Number(length)+2)/2,200) +'px';



		 					This.listData = data.data;



		 				}else{
		 					$alert(data.info);
		 				};
		 				This.boolean = false;
		 			},
		 			error : function(code){
                    	This.boolean = false;
                        $alert('网络错误,请稍后再试');
                        
                    }
		 		})
	 		},
	 	
	 	},


	});
	function $alert(msg){
	    layer.alert('', {
			    title:'温馨提示',
			    area: '440px',
			    shade: [1, 'rgba(255,255,255,0.75)'],
			    content:'<div class="layui-wcc-confirm"><div>'+msg+'</div></div>', 
			    //time: 20000, //20s后自动关闭
			    btn: ['确认']
			});  
	};
   

   </script>
@endsection
