@extends('layout/master')

@section('header')
    <link rel="stylesheet" href="/css/wcc.css?v={{config('constants.wcc_file_version')}}" />
    <link rel="stylesheet" href="/css/Marketing/usestatistics.css?v={{config('constants.wcc_file_version')}}" />
@endsection

@section('content')
<div id="app" v-cloak>
	<wcc-loading v-show="boolean" type='1'></wcc-loading>
	<div class="wcc_selectStation_box wcc_time wcc_width343" itshow="0">
	    <i class="wcc_calendar"></i>
	    <div class="input_box">
	        <input id="time" type="text" name="" value="" placeholder="">
	    </div>
	</div>
	<div class="wcc_table_border_hover_none">
	    <table class="wcc_table">
			<caption class="caption">
	        <div class="wcc_table_title">优惠卷使用统计报表</div>
	        <!-- <span class='wcc_table_remarks'>备注说明</span> -->
	      <!-- 	<bottom  clss="wcc_btn_export wcc_table_btn" v-on:click="exportFun">
	      		<i class="wcc_btn_i"></i><span class="wcc_btn_span">导出数据</span>
      		</bottom> -->
		    </caption>
		    <thead>
		        <tr>
		            <th>所属机构</th>
		            <th>优惠卷类型</th>
		            <th>优惠卷金额</th> 
		            <!-- price      -->
		            <th>交易总笔数</th>   
 					<!--amount  -->
		            <th>优惠卷使用总金额</th>  
 					<!-- count -->
		        </tr>
		    </thead>
		    <tbody v-if="tableAttr.length!=0">
				<template v-for="item in tableAttr">
					<tr >
			            <td :rowspan="(item.oil_coupon.length+item.product_coupon.length+item.service_coupon.length)+4">@{{item.st_name}}服务站</td>
			            <!-- <template if="item.oil_coupon.length!=0"> -->
				            <td :rowspan="item.product_coupon.length+1">非油品优惠劵</td>
				            <td>@{{item.product_coupon[0].coupon_price}}</td>
				            <td>@{{item.product_coupon[0].count}}</td>
				            <td>@{{item.product_coupon[0].amount}}</td>
				        <!-- </template> -->
			          
				    </tr>
					<template if="item.oil_coupon.length!=0">

					    <tr v-for="product in item.product_coupon.length-1">
					        <td>@{{item.product_coupon[product].coupon_price}}</td>
				            <td>@{{item.product_coupon[product].count}}</td>
				            <td>@{{item.product_coupon[product].amount}}</td>
					    </tr>
					     <tr>
				            <td>非油品优惠劵汇总</td>
				            <td>
				            	@{{item.product_count}}
				            </td>
				            <td>
				            	@{{item.product_amount}}
				            </td>
					    </tr>
					</template>
				    <tr>
			            <td :rowspan="item.oil_coupon.length+1">油品优惠劵</td>
						<td>@{{item.oil_coupon[0].coupon_price}}</td>
						<td>@{{item.oil_coupon[0].count}}</td>
						<td>@{{item.oil_coupon[0].amount}}</td>
				    </tr>
				     <tr v-for="oli in item.oil_coupon.length-1">
			            <td>@{{item.oil_coupon[oli].coupon_price}}</td>
			            <td>@{{item.oil_coupon[oli].count}}</td>
			            <td>@{{item.oil_coupon[oli].amount}}</td>
				    </tr>
				    <tr>
			            <td>油品优惠劵汇总</td>
			            <td>
			            	@{{item.oil_count}}
			            </td>
			            <td>
			            	@{{item.oil_amount}}
			            </td>
				    </tr>

				    <tr>
			            <td :rowspan="item.service_coupon.length+1">服务优惠券</td>
						<td>@{{item.service_coupon[0].coupon_price}}</td>
						<td>@{{item.service_coupon[0].count}}</td>
						<td>@{{item.service_coupon[0].amount}}</td>
				    </tr>
				     <tr v-for="service in item.service_coupon.length-1">
			            <td>@{{item.service_coupon[service].coupon_price}}</td>
			            <td>@{{item.service_coupon[service].count}}</td>
			            <td>@{{item.service_coupon[service].amount}}</td>
				    </tr>
				    <tr>
			            <td>服务优惠券汇总</td>
			            <td>
			            	@{{item.service_coupon_count}}
			            </td>
			            <td>
			            	@{{item.service_coupon_amount}}
			            </td>
				    </tr>





				     <tr>
			            <!-- <td>data</td> -->
			            <td colspan='2'>@{{item.st_name}}服务站汇总</td>
			            <td>@{{item.product_count + item.oil_count + item.service_coupon_count}}</td>
			            <td>@{{item.product_amount + item.oil_amount + item.service_coupon_amount}}</td>
			           
				    </tr>
				</template>
			   	<tr>
		            <!-- <td>data</td> -->
		            <td colspan='3'>汇总</td>
		            <td>@{{count}}</td>
		            <td>@{{amount}}</td>
			    </tr>
		        
			</tbody>
			<tbody v-else>
					<tr>
				  <td  class="wcc_no_data" :colspan="5">
				     </td>
				 </tr>
			</tbody>
		</table>		
	</div>
	
</div>


@endsection

@section('footer')
    <script type="text/javascript" src="/js/vendor/Plug/Plug.js?v={{config('constants.wcc_file_version')}}"></script>
    <script type="text/javascript" src="/js/Marketing/usestatistics.js?v={{config('constants.wcc_file_version')}}"></script>

@endsection
