@extends('layout/master')

@section('header')
	<link rel="stylesheet" type="text/css" href="/css/wcc.css?v={{config('constants.wcc_file_version')}}">
	<style>
	.wcc_table_btn .wcc_btn_i {
		transform: rotate(-180deg);
		-ms-transform: rotate(-180deg);
		-webkit-transform: rotate(-180deg);
		top: 13px;
    	font-size: 14px;
	}
	.wcc_table_title{
		font-size: 18px;
		color: #333333;
	}
	.wcc_table tr{
		text-align: left;
	}
	.wcc_table th,.wcc_table td{
		padding-left:20px;
	}
	.wcc_table_btn{
		overflow: hidden;
	}
	.wcc_table_btn input{
		width:1000px;
		height:1000px;
		position: absolute;
		top:0;
		left:0;
		opacity: 0;
		cursor: pointer;
	}
	.wcc_btn_Preservation{
		position: absolute;
		top: 10px;
		right: 151px;
	}
	.layui-layer-msg{
		z-index:999999999999 !important;
	}
	</style>

@endsection

@section('content')
 <div id="app">
	<div class="wcc_table_border_bottom" >
		<table class="wcc_table wcc_table_border_hover_none" >
			<caption class="caption">
				<div class="wcc_table_title">邀请人名单管理</div>
				<div  class="wcc_btn_Preservation" v-on:click="exportFun($event.target)">
					<i class="wcc_btn_i">&#xe67b;</i>
					<span class="wcc_btn_span">下载模板</span>
				</div>
				<div  class="wcc_btn_export wcc_table_btn">
					<i class="wcc_btn_i">&#xe663;</i>
					<span class="wcc_btn_span">导入数据</span>
					<input type="file" id="file" v-on:change="fileFun($event.target)" _multiple="multiple" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" runat="server" />
				</div>
				
			</caption>
			<thead>
				<tr>
				
					<th width="105">名字</th>
					<th width="143">手机号</th>
					<th width="198">身份证号码</th>
					<th width="300">合同签订时间</th>
					<th>操作</th>        			      
				</tr>
			</thead>
			<tbody v-if="list.length">
					<tr v-for="iten in list">
						<td>@{{iten.name}}</td>
						<td>@{{iten.phone}}</td> 
						<td>@{{iten.id_card}}</td>
						<td>@{{iten.contract_start_time}} 至 @{{iten.contract_end_time}}</td>	
						<td>
							<span v-on:click="deleteManageName(iten.id)" class="wcc_text_green">删除</span>
						</td>		
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
	<template v-if="cnt > 0">
		<wcc-page
				v-bind:size='Math.ceil(cnt/page_size)'
				v-bind:page='page'
				v-bind:common='cnt'
				v-on:selected="pageSelectChange"
				style="margin: 40px 20px 20px 20px"
		></wcc-page>
	</template>
	<wcc-loading v-show="boolean" type='2'></wcc-loading>

 </div>


@endsection


@section('footer')
	
	<script src="/js/jquery.qrcode.min.js?v={{config('constants.wcc_file_version')}}"></script>
	<script src="/js/vendor/Plug/Plug.js?v={{config('constants.wcc_file_version')}}"></script>
	<script src="/js/vue_component.js?v={{config('constants.wcc_file_version')}}"></script>
	<script>
		$(function(){
			new Vue({
				el:"#app",
				data:{
					page:1,
					page_size:10,
					list:[],
					cnt:0,
					boolean : true,
				},
				mounted:function(){
					this.$Ajax();
				},
				methods:{
					exportFun:function(target){
						var closest = $(target).closest('.wcc_btn_Preservation')
						if(closest.length){
							target = closest[0]
						}
						if ( $(target).find('span').timing() ) { return  }
				
						window.location.href ='/xls/tmp/template.xlsx';
					
					},
					deleteManageName:function(id){
						var $this = this;
						window.v$loading.show()
						$.ajax({
								url:'/InviteFriend/deleteManageName',
								data:{
									id:[id]
								},
								type:'post',
								dataType:'json',
								success:function(data){
									if( data.status == 200 ){
										layer.msg('删除成功');
										//  if($this.page > 1 && $this.list.length==1){
										// 	$this.page=-1;

										// }
										$this.page = 1;
										$this.$Ajax()

									}else{
										layer.msg(data.info);
									}
									window.v$loading.hide()
								}, 
								error:function(){	
									target.value = '';
									window.v$loading.hide()
									layer.msg('网络出错');
								}
							})

					},
					fileFun:function(target){
						
						var $this = this;
						var files = target.files[0]
						if(files.length==0){
							return
						}
						
						var formData = new FormData();
						// formData.ppend(name, element);
						
						//创建图片文件
						formData.append('file', files); 
						//如果第二个参数没有名称，那么取第三个默认参数blob为file的名称,当然你也可以设置第三个参数名称
						

						window.v$loading.show('正在上传文件')
						// reader.onload = function(e) {
							$.ajax({
								url:'/InviteFriend/saveManageNameLists',
								data:formData,
								type:'post',
								dataType:'json',
								contentType: false, // 注意这里应设为false
								processData: false,
								cache: false,
								success:function(data){
									target.value = '';
									if( data.status == 200 ){
										layer.msg('上传成功');
										$this.page = 1;
										$this.$Ajax()

									}else{
										layer.msg(data.info);
									}
									window.v$loading.hide()
								}, 
								error:function(){	
									target.value = '';
									window.v$loading.hide()
									layer.msg('网络出错');
								}
							})
							

					},
					pageSelectChange:function(data){
                        if(this.page_size!=data.strip){
                            this.page=1
                        }else{
                            this.page = data.page;    
                        }
                        this.page_size = data.strip;
                        this.$Ajax();
					},
					$Ajax:function(){
						var $this = this;
						$this.boolean = true;
						$.ajax({
							url:'/InviteFriend/getManageNameLists',
							data:{
								page:$this.page,
								page_size:$this.page_size
							},
							type:'post',
							dataType:'json',
							success:function(data){
								$this.cnt = 0;
								if( data.status == 200 ){
									
									$this.cnt = data.data.cnt || 0;
									$this.list = data.data.lists||[];
									
									
								}else{
									layer.msg(data.info);
								}
								$this.boolean = false;	
							}, 
							error:function(){
								$this.boolean = false;	
								layer.msg('网络出错');
							}
						})
					}
				}
			})

			// $('#file').on('change',function(){
			// 	console.log(this.files[0])
			// });
			// $.ajax({
			// 	url:obj.url,
			// 	data:dateJons,
			// 	type:'post',
			// 	dataType:'json',
			// 	success:function(data){
			// 		obj.success&&obj.success(data)
			// 	},
			// 	error:function(){
			// 		obj.error?obj.error():alert('网络错误');
			// 	}
			// })
		})
	</script>
@endsection