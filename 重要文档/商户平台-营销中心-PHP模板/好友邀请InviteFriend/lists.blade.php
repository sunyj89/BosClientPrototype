@extends('layout/master')

@section('header')
    <link rel="stylesheet" type="text/css" href="/css/wcc.css?v={{config('constants.wcc_file_version')}}">
    <style>
        .tr_uni th{
            color:#333333;
        }
        .url_td{
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 300px;
            display: inline-block;
            height: 50px;
            box-sizing: border-box;
            line-height: 50px;
            vertical-align: middle;
        }
        .wcc_text_green.uni{
            margin-left:5px;
        }
    </style>
@endsection

@section('content')

<div id="app">
   	<wcc-loading v-show="boolean" type='2'></wcc-loading>
   	<wcc-switch v-bind:add='status' style="margin:20px;" v-bind:selected='selected' v-on:tabfun='switchFun'></wcc-switch>
 	<table class="wcc_table">
		    <thead>
		        <tr class='tr_uni'>
                    <th>活动名称</th>
                    <th>活动id</th>
		            <th>活动有效期</th>
		            <!-- <th>状态</th> -->
                    <th>活动链接</th>
                    <th>活动详情</th> 
                    <th v-if="selected!=0">参与情况</th>     
		        </tr>
		    </thead>
			<tbody v-if="listData.length">
			    <tr v-for="item in listData">  
                    <td>@{{item.activity_name}}</td>
                    <td>@{{item.activity_id}}</td>
			        <td>@{{item.start_time}}至@{{item.end_time}}</td> 
                    <td><span class="url_td">@{{item.activity_url?item.activity_url:'-'}}</span><a class="wcc_text_green uni" href="javascript:;" v-on:click="copy_url(item.activity_url)">复制</a></td>
			        <!-- <td>@{{status[ item.status-1 ].name}}</td> -->
			        <td>
						<a class="wcc_text_green" :href="'/InviteFriend/info?id=' + item.activity_id">查看</a>
						<!-- <span class="wcc_text_green ml10" v-if="item.status!=2" v-on:click="deleteActivity(item.activity_id)">删除</span>
			        	<span class="wcc_text_green ml10" v-on:click="$.copy(item.activity_url)">复制活动链接</span> -->
                    </td>
                    <td v-if="selected!=0">
                        <a class="wcc_text_green" :href="'/InviteFriend/inviteDetail?activity_id='+item.activity_id+'&activity_name='+item.activity_name" style="margin-right:10px;">详情</a>
                        <a class="wcc_text_green" :href="'/InvitingAnalysis?code=' + item.activity_code+'&type='+item.activity_type" target="_blank">统计</a>
                    </td>
			    </tr>
			</tbody>
			<tbody v-else>
				<tr class="wcc_no_data">
			 		<td  :colspan="5"></td>
			 	</tr>
			</tbody>
	</table>
	<wcc-page v-if="Math.ceil(cnt/page)==1" style="margin:20px;" v-bind:size='Math.ceil(cnt/page)' v-bind:page='1'  v-bind:strip='0' v-on:selected='pageFun' v-bind:common='cnt' ></wcc-page>
</div>  
@endsection

@section('footer')
	    <script src="/js/vendor/Plug/Plug.js?v={{config('constants.wcc_file_version')}}"></script>
	<script src="/js/vue_component.js?v={{config('constants.wcc_file_version')}}"></script>
	<script>
	$(function (argument) {
		var $app = new Vue({
				 	el:'#app',
				 	data:{
				 		cnt:0,
				 		strip:10,
				 		page:1,
				 		listData:[],
				 		boolean:true,
				 		selected:0,
				 		// 1未开始 2进行中 3已结束
				 		status:[
				 			// {
					 		// 	name:'全部',
					 		// 	val:[1,2,3],
					 		// },
					 		{
					 			name:'未开始',
					 			val:[1],
					 		},
					 		{
					 			name:'进行中',
					 			val:[2],
					 		},
					 		{
					 			name:'已结束',
					 			val:[3],
					 		}
				 		]
				 	},
				 	mounted:function () {
				 		this.ajax();
				 	},
				 	methods:{
                        copy_url:function(val){
                            !val&&(val='-');
                            if (window.clipboardData) {//如果是IE浏览器
                                window.clipboardData.setData('text', val);
                            }else{
                                var inputDom=document.createElement('input');
                                inputDom.setAttribute('value',val);
                                document.body.appendChild(inputDom);
                                inputDom.focus();
                                inputDom.setSelectionRange(0, inputDom.value.length);
                                //document.execCommand('copy', true);这样写，火狐不支持
                                var a=document.execCommand('copy');
                                a&&layer.msg('复制成功');
                                document.body.removeChild(inputDom);
                            }
                        },
						deleteActivity:function(id){
							var This = this;
							This.boolean = true;
							$.ajax({
					 			url:"/InviteFriend/deleteActivity",
					 			data:{
									id:id
					 			},
					 			type:'POST',
					 			dataType:'json',
					 			success:function (data) {
					 				if (data.status==200) {
					 					This.ajax();
					 				}else{
					 					$alert(data.info);
					 				};
					 				This.boolean = false;
					 			},
					 			error : function(code){
			                    	This.boolean = false;
			                        $alert('网络错误,请稍后再试');
			                        
			                    }
					 		});

						},
				 		pageFun:function  (data) {
				 			this.strip = data.strip;
				 			this.page = data.page;
				 			this.ajax()
				 		},
				 		ajax:function () {
				 			var This = this;
				 			This.boolean = true;
					 		$.ajax({
					 			url:"/InviteFriend/getActivityList",
					 			data:{
					 				page:This.page,
					 				page_size:This.strip,
					 				status:This.status[This.selected].val,
					 			},
					 			type:'POST',
					 			dataType:'json',
					 			success:function (data) {
					 				if (data.status==200) {
					 					This.listData = data.data.list||[];
					 					
					 					This.cnt = data.data.cnt||0;
					 				}else{
					 					$alert(data.info);
					 				};
					 				This.boolean = false;
					 			},
					 			error : function(code){
			                    	This.boolean = false;
			                        $alert('网络错误,请稍后再试');
			                        
			                    }
					 		});
				 		},
				 		switchFun:function (data){
				 			this.selected = data.newVal;
				 			this.ajax()
				 		}

				 	},
				 })
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

	})
	</script>
@endsection