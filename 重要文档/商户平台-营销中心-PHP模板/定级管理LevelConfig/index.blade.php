@extends('layout/master')

@section('header')
<link rel="stylesheet" href="/css/common/common.css?v={{config('constants.wcc_file_version')}}">
<link rel="stylesheet" href="/css/wecar.css?v={{config('constants.wcc_file_version')}}">
<link rel="stylesheet" href="/css/LevelConfig/index.css?v={{config('constants.wcc_file_version')}}">
@endsection

@section('content')
<!-- 
	leve_top_yellow //生效中
-->
<div class="leve_top clear {{ $level_status==1 || $level_status==2 || $level_status==3 ? 'leve_top_yellow' : '' }}" >
	<div class="leve_top_type">
		<span class="h3">
			定级规则
		</span>

        @if($level_count>1)
            <a href="/LevelConfig/index"><span class="button_tips {{ $level_status==1 ? '' : 'grey' }}">生效中</span></a>
            <a href="/LevelConfig/index?status=0&key={{$level_count}}"><span class="button_tips {{ $level_status==0 ? '' : 'grey' }}">待生效</span></a>
        @endif
        @if($level_count<=1)
            @if($level_status==0)
                <span class="button_tips">待生效</span>
            @endif
            @if($level_status==1)
                <span class="button_tips">生效中</span>
            @endif
            @if($level_status==2)
                <span class="button_tips button_tips_red">已停用</span>
            @endif
            @if($level_status==3 || $level_status==-1)
                <span class="button_tips">待设置</span>
            @endif
        @endif

		@if ( $is_support_operation==1 )
		<span class="prompt">
			@if($level_status=='-1')
				按照以下模版，结合实际情况配置集团定级规则
			@endif
			@if($level_status==1)
				<span>集团定级规则生效中，修改规则后，新规则将会在<span style="color:#32AF50">下一周期{{$next_month_first_day}}</span>生效
				<div class="leve_center_box_tips leve_center_box_tips_uni leve_center_box_tips_new" id="leve_config_tips">
						<div class="text">
						 	1.仅修改说明文案（等级模版、等级名字、升降级描述、特权描述）将直接生效<br>
							2.除上述内容只要修改其中一项（定级周期、定级类型、用户初始等级、用户等<br>
							级保护、所需积分），修改后将会在下一周期生效
						</div>
					</div>
				</span>
			@endif
			@if($level_status==0)
			集团定级规则将会在<span style="color:#32AF50">{{$final_level_info['level_base_info']['start_time']}}</span>生效
				
			@endif
			@if($level_status==3)
				集团定级规则已过期，可编辑后重新启用
			@endif
			@if($level_status==2)
				集团定级规则已停用，可编辑后重新启用
			@endif
		</span>
		@endif
		@if ( $is_support_operation!=1 )
			<span class="prompt">
				如需创建或者修改会员等级规则，请<span style="color:#32AF50">登录集团账号</span>。
			</span>
		@endif
	</div>
	<div id="time_cell">
		当前时间：<span>2017-01-28&nbsp;&nbsp;11:14:35</span>
	</div>

</div>
<div class="leve_center_padding">
	<div  @if ( $is_support_operation==1 ) class="leve_center" @else class="leve_center no_input_hover "  @endif>
		<div class="leve_center_box padding_top">
			<span class='left'>
				规则生效时间	
			</span>
			<div class="right" >
				@if ($level_status != 1 && !($level_count > 1 && $level_status == 0))
					<input class="input w300" value="" type="text" id="timeRange" data-date-format="yyyy-mm-dd hh:ii:ss" name="">
				@endif
				@if ($level_status == 1 || ($level_count > 1 && $level_status == 0))
						<input class="input w300 input_color" value="" type="text" id="timeRange" data-date-format="yyyy-mm-dd hh:ii:ss" name="" disabled="true">
				@endif
			</div>
			<div class="leve_center_box_tips2">
				<div class="text">请选择</div>
			</div>
		</div>
		<div class="leve_center_box">
			<span class='left'> 
				定级周期	
			</span>
			<div class="right">
				<div style="display:none" class="select_radio" fun='number' id="level_term_option">
					@foreach ($final_level_info["level_base_info"]['level_term_option'] as $key => $value)
						@if ($value['is_show'] == 1 )
							@if ($value['is_selected'] == 1 )
							<div class="select_checkbox_top"  value="{{$key}}"  termDescType="{{$value['term_desc_type']}}">
								<span>{{$value['type_desc']}}</span>
							</div>
							@endif
						@endif
					@endforeach
					<ul class="select_checkbox_bottom">
						@foreach ($final_level_info["level_base_info"]['level_term_option'] as $key => $value)
							@if ($value['is_show'] == 1 )	
							<li value="{{$key}}" placeholder="{{$value['type_extra_desc']}}" termDescType="{{$value['term_desc_type']}}">
			                     <span>{{$value['type_desc']}}</span>
							</li>
							@endif
						@endforeach
					</ul>
				</div>
				@foreach ($final_level_info["level_base_info"]['level_term_option'] as $key => $value)
					@if ($value['is_show'] == 1 )
						@if ($value['is_selected'] == 1 )
						<div class="input_box">
							<span>{{$value['show_desc']}}</span>
							<input style="    width: 270px;" class="input" min='0' val='' style="line-height: 0;" value="{{$value['expiry']}}" type="number" placeholder='请输入有效数字'  _placeholder="{{$value['type_extra_desc']}}">
						</div>
						@endif
					@endif 
				@endforeach
			</div>
			<div class="leve_center_box_tips leve_center_box_tips_uni">
				<div class="text">
					规则生效时间内，按照用户在定级周期内的消费来升降级或保级<br>
					例1：定级周期1月=1个自然月<br>
					定级规则在5月20日生效，定级周期为5.20-5.31、6.1-6.30等
				</div>
			</div>
			<div class="leve_center_box_tips2">
				<div class="text">请选择</div>
			</div>
		</div>
		<div class="leve_center_box">
			<span class='left'> 
				定级类型	
			</span>
			<div class="right" >
				<div class="select_radio w300 Init_select_radio" id="level_basis_type_option" fun='checkbox'>
					@foreach ($final_level_info["level_base_info"]['level_basis_type_option'] as $key => $value)
						@if ($value['is_show'] == 1)
							@if ($value['is_selected'] == 1 )
							<div class="select_checkbox_top"  value="{{$key}}" basisType="{{$value['type']}}"  has_menu="{{$value['has_menu']}}">
								<span>{{$value['type_desc']}}</span>
							</div>
							@endif
						@endif
					@endforeach
					<ul class="select_checkbox_bottom">
						@foreach ($final_level_info["level_base_info"]['level_basis_type_option'] as $key => $value)
							@if ($value['is_show'] == 1 )	
							<li value="{{$key}}" has_menu="{{$value['has_menu']}}" basisType="{{$value['type']}}" >
			                     <span>{{$value['type_desc']}}</span>
							</li>
							@endif
						@endforeach
					</ul>
				</div>
				<div @if ( $is_support_operation == 0) class="select_checkbox none select_checkbox_none select_checkbox_margin"  @else class="select_checkbox none select_checkbox_margin"  @endif>
					<div class="select_checkbox_top">
						<span></span>
					</div>
					<ul class="select_checkbox_bottom"></ul>
				</div>
			</div>
			<div class="leve_center_box_tips2 leve_center_box_tips5">
				<div class="text">请选择</div>
			</div>
		</div>
		<div class="leve_center_box">
			<span class='left'> 
				用户初始等级	
			</span>
			<div class="right">
				<div class="select_radio w300" id="level_detail_info_input">
					@foreach ($final_level_info["level_detail_info"] as $key => $value)
						@if ($value['is_delete'] == 0 && $value['status']== '1')
							@if ($value['is_default'] == 1 )
							<div class="select_checkbox_top"  value="{{$key}}" id="clone">
								<span>Lv{{$value['sort']}}{{$value['level_name']}}</span>
							</div>
							@endif
						@endif
					@endforeach
					<ul class="select_checkbox_bottom">
						@foreach ($final_level_info["level_detail_info"] as $key => $value)
							@if ($value['is_delete'] == 0)
								<li value="{{$key}}" @if($value['status']== '0') style="display: none;" @endif	>
				                     <span>Lv{{$value['sort']}}{{$value['level_name']}}</span>
								</li>
							@endif	
						@endforeach
					</ul>
				</div>
			</div>
			<div class="leve_center_box_tips2">
				<div class="text">请选择</div>
			</div>
			<div class="leve_center_box_tips">
				<div class="text">用户初始等级为用户注册会员后获得的初始化等级</div>
			</div>
		</div>
        <div class="leve_center_box">
			<span class='left'> 
                升降级规则	
			</span>
			<div class="right" >
				<div class="select_radio w300" id="level_basis_grade_rule" fun_uni='up_down'>
					@foreach ($final_level_info["level_base_info"]['level_basis_grade_rule'] as $key => $value)
						@if ($value['is_show'] == 1)
							@if ($value['is_selected'] == 1 )
							<div class="select_checkbox_top"  value="{{$key}}" basisType="{{$value['type']}}"  has_menu="{{$value['has_menu']}}">
								<span>{{$value['type_desc']}}</span>
							</div>
							@endif
						@endif
					@endforeach
					<ul class="select_checkbox_bottom">
						@foreach ($final_level_info["level_base_info"]['level_basis_grade_rule'] as $key => $value)
							@if ($value['is_show'] == 1 )	
							<li value="{{$key}}" has_menu="{{$value['has_menu']}}" basisType="{{$value['type']}}" >
			                     <span>{{$value['type_desc']}}</span>
							</li>
							@endif
						@endforeach
					</ul>
				</div>
			</div>
            <div class="right" id="right_uni">
				<div class="select_radio w300" id="level_detail_info_input_2" fun_uni='up_down_li' style="min-width: 100px;">
					@foreach ($final_level_info["level_detail_info"] as $key => $value)
						@if ($value['is_delete'] == 0 && $value['status']== '1')
							@if ($value['is_protect'] == 1 )
							<div class="select_checkbox_top"  value="{{$key}}">
								<span>Lv{{$value['sort']}}{{$value['level_name']}}</span>
							</div>
							@endif
						@endif
					@endforeach
					<ul class="select_checkbox_bottom">
						@foreach ($final_level_info["level_detail_info"] as $key => $value)
							@if ($value['is_delete'] == 0)
								<li value="{{$key}}" @if($value['status']== '0') style="display: none;" @endif	>
				                     <span>Lv{{$value['sort']}}{{$value['level_name']}}</span>
								</li>
							@endif	
						@endforeach
					</ul>
				</div>
			</div>
            <div class="leve_center_box_tips2">
				<div class="text">请选择</div>
			</div>
            <div class="leve_center_box_tips leve_center_box_tips_uni">
				<div class="text">
                    根据上一周期消费情况升降级<br>
                    每个周期初始，油站用户默认按照上一周期的消费情况根据定级规则获得对应的会员等级<br>
                    例：一个金卡用户本周期未消费，下一周期定级为最低等级会员<br>
                    <br>
                    只升不降级<br>
                    每个周期初始，在保留用户当前等级的基础上以本周期消费情况进行升级<br>
                    例：一个金卡用户本周期未消费，下一周期定级为金卡会员，非最低等级会员<br>
                    <br>
                    最低会员等级保护<br>
                    在“根据上一周期消费情况升降级”的基础上，通过设置会员最低等级，此等级及以上等级的会员无论如何消费都不会掉<br>
                    至此等级以下<br>
                    例：设置最低等级Lv2金卡会员，一个白金用户本周期未消费，下一周期定级为金卡会员，非最低等级会员
                </div>
			</div>
		</div>
		
	<script type="text/javascript">
		var tbodyAtte=[]
	</script>
	<div class='table_box'>
		<table class="table">
			<thead>
				<tr>
					<th>等级</th>
					<th>等级模版</th>
					<th>等级名字</th>
					<th class="table_box_desc">
						<!-- 加油升数 -->
						@foreach ($final_level_info["level_base_info"]['level_basis_type_option'] as $key => $value)
							@if ($value['is_show'] == 1)
								@if ($value['is_selected'] == 1 )
									{{$value['desc']}}
								@endif
							@endif
						@endforeach
					</th>
					<th>升级描述</th>
					<th>降级描述</th>
					<th>特权描述</th>
				</tr>
			</thead>

			<tbody >
			@foreach ($final_level_info["level_detail_info"] as $key => $user)

				<tr key="{{$key}}" level_status="{{$level_status}}" status="{{$user['status']}}"   @if ($user['status'] ==0) class="none" @endif>
		            <td valign="top" height="110"  class=" pointer " width="50" align="center">
		                <div class="center padding20">Lv{{$user['sort']}}</div>
		                @if($is_support_operation==1)
						 <div class="center blue padding20">删除</div>   
						@endif              
		            </td>
		            <td align="center" class="pointer pointer_uni" valign="middle" width="80px">
		                <img class="padding20 img_show" src="{{$user['level_img']}}" alt="">
                        <label class="post_label">
                            <input type="file" class="post_img" name="post_img" accept="image/png, image/jpeg" key="{{$key}}">
                        </label>
                        <div class="td_border td_border_upload"></div>
		            </td>
		            <td valign="top">
		                <div class="padding20 td_div">{{$user['level_name']}}</div>
		                <textarea class="textarea padding20" name="" max='7'>{{$user['level_name']}}</textarea>
		                <div class="td_border"></div>
		            </td>
		            <td class="@if ( $key!=0) @else pointer @endif" valign="top">
		                
		                @if ( $key!=0)
		                	<div class="td_div padding20 nowrap">{{$user['upgrade_condition']}}</div>
		                	<!-- <div class="textarea"> -->
		                	<textarea class="textarea j_number padding20" type="number" name="" min='0' value="{{$user['upgrade_condition']}}"  placeholder="">{{$user['upgrade_condition']}}</textarea>
		                		<!-- <input class="textarea"  align="top" type="number" name="" min='0' value="{{$user['upgrade_condition']}}" placeholder=""> -->
		                	<!-- </div> -->
		                	
							<div class="td_border"></div>
		                	@else
		                	<input class="none" type="number" n='1' value="{{$user['upgrade_condition']}}">
		                	<div class="padding20 nowrap">{{$user['upgrade_condition']}}</div>
		                 @endif
		                

		            </td>
		            <td valign="top">
		                <div class="td_div padding20">{{$user['level_up_desc']}}</div>
		                <textarea class="textarea padding20" name="" max='1024'>{{$user['level_up_desc']}}</textarea>
		                <div class="td_border"></div>
		               
		            </td>
		            <td class="" valign="top">
		                <div class="td_div padding20">{{$user['level_down_desc']}}</div>
		                <textarea class="textarea padding20" max='1024' name="">{{$user['level_down_desc']}}</textarea>
		                <div class="td_border"></div>
		            </td>
		            <td class="td" valign="top">
		        		<script type="text/javascript">
							tbodyAtte.push("{{$user['privilege_desc']}}")
					    </script>
		                <div class="td_div padding20">
		                 	<ol>
		                 		
						    </ol>
		                </div>

		                <div class="textarea contenteditable padding20" max='1024' contenteditable='true'></div>
		                <div class="td_border"></div>
		            </td>
		        </tr>
			@endforeach
				<tr class="plus none">
			        <td valign="middle" height="120">
						<div class="plus_box add_blue">添加</div>
					</td>
			        <td></td>
			        <td></td>
			        <td></td>
			        <td></td>
			        <td></td>
			        <td></td>
			    </tr>
			</tbody>
		</table>

	</div>
	</div>
	<!-- </div><div>温馨提示：点击表格内容可编辑</div> -->
</div>	
@if($is_support_operation==1)
@if($level_status=='-1'&& $is_support_operation==1)
<div class="bottom_box">
	<button class="button Submit">提交配置</button>
</div>
@else
<div class="bottom_box">
<!-- <div class="button_box"> -->
	@if($level_status==0) <!-- 待生效 -->
		<button class="button Submit" fun="submit5">保存修改</button>
        @if($level_count==1)
		    <button class="button white" fun='effective'>立即启用</button>
        @endif
	@endif
	@if($level_status==3)  <!-- 已过期 -->
		<button class="button Submit">提交配置</button>
	@endif
	@if($level_status==1) <!-- 生效中 -->
		<button class="button Submit" fun="Submit" backupsFun="Submit">保存修改</button>
        @if($level_count==1)
		    <button class="button white Disable" fun='Disable' status='0'>立即停用</button>
        @endif
	@endif
</div>
@endif
	<div id="layui_box_fixed" class="layui-layer-loading">
		<div class="layui-layer-loading1"></div>
	</div>
<!-- </div> -->
@endif
	<script type="text/javascript">
		
		var  level_status = {{$level_status}};
		var level_count = {{$level_count}};
		var index_key = {{$index_key}};
		var is_wait_to_go = 0;		//用于记录是否为待生效转换为立即生效
		var is_cancel = 0;
		var  is_support_operation = '{{$is_support_operation}}';
		var  start_time = "{{$final_level_info['level_base_info']['start_time']}}".split(':');
		var  end_time = "{{$final_level_info['level_base_info']['end_time']}}".split(':');
		var  final_level_info_json = {!!$final_level_info_json!!};
		var initial_final_level_info_json = {!! $final_level_info_json !!};
		var is_change_next = false;
        var  level_default_term_desc_arr_json = {!!$level_default_term_desc_arr_json!!};
		start_time =  start_time[0]+':'+start_time[1]+':'+'00';
		end_time =  end_time[0]+':'+end_time[1]+':'+'59';
		var d=new Date(); //创建一个Date对象 
		var localTime = d.getTime(); 
		var localOffset=d.getTimezoneOffset()*60000; //获得当地时间偏移的毫秒数 
		var utc = localTime + localOffset; //utc即GMT时间 
		var offset = 8; //以夏威夷时间为例，东10区 
		var hawaii = utc + (3600000*offset); 
		var nd = +new Date(hawaii); 
		var DateTime = Date.now();
		var curr_time_stamp = DateTime-{{$curr_time_stamp}} + (Date.now()-nd) ;
		console.log(curr_time_stamp,'jhd');
		 // time()
		// 
		
		(function(){
			var  time_cell = document.querySelector('#time_cell span');

			var time = new Date;
			setInterval(function(){
				time = new Date((Date.now()-curr_time_stamp))
				time_cell.innerHTML = time.getFullYear()+'-'+(time.getMonth()+1)+'-'+time.getDate()+' '+time.getHours()+':'+time.getMinutes()+':'+time.getSeconds();   	
			},16)
		})();
		  	
	</script>
    <script src="/js/vendor/layer/layer.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/wecar.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/vendor/bootstrap/js/bootstrap.min.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/vendor/echarts/echarts.min.js?v={{config('constants.wcc_file_version')}}"></script>
   	<script src="/js/Leve/Leve.js?v={{config('constants.wcc_file_version')}}"></script>
@endsection

@section('footer')

@endsection
