@extends('layout/master')

@section('header')
    <link rel="stylesheet" href="/css/RefuelAward/refuelAward.css?v={{config('constants.wcc_file_version')}}" />
    <link rel="stylesheet" href="/css/wcc.css?v={{config('constants.wcc_file_version')}}" />
@endsection

@section('content')
    <div class="listContainer" id="listBox">

        <!-- <div class="titleLine_box">
            <div class="titleLine_box_left">活动油站数据</div>
            <div class="titleLine_box_right">
                <div class="searchListInput">
                    {{--<input class="wcc_input" type="text" placeholder="输入要搜索的关键字或者活动ID" maxlength="30" v-model="searchValue" />--}}
                    <div class="searchListInputDel" v-show="Number(searchValue != '')" v-on:click="searchValue = ''">X</div>
                </div>
            </div>
        </div> -->

        <div class="titleLine_box statusTab_top">
            <div class="statusTab_box">
                <div class="statusTab_block" v-bind:isselect="Number(showData.status == 1)" v-on:click="ev_selectDataType(1)">未开始</div>
                <div class="statusTab_block" v-bind:isselect="Number(showData.status == 2)" v-on:click="ev_selectDataType(2)">进行中</div>
                <div class="statusTab_block" v-bind:isselect="Number(showData.status == 3)" v-on:click="ev_selectDataType(3)">已结束</div>
            </div>
        </div>

        <div class="listTable">
            <table class="wcc_table">
                <thead>
                    <tr>
                        <th>活动名称</th>
                        <th>活动ID</th>
                        <th>活动有效期</th>
                        <th>活动详情</th>
                        <th v-if="showData.status>1">参与情况</th>
                    </tr>
                </thead>
                <tbody >
                    <template v-if="showData.data.length > 0">
                        <tr v-for="item in showData.data">
                            <td>@{{item.name}}</td>
                            <td>@{{item.id}}</td>
                            <td>@{{item.start_time}} 至 @{{item.end_time}}</td>
                            <td>
                                <div class="operationContainer">
                                    <a class="operationContainer_edit mlr10" target="_blank" v-bind:href="'/RefuelAward/viewEdit?refuel_id=' + item.id">查看</a>
                                </div>
                            </td>
                            <td v-if="showData.status>1">
                                <div class="operationContainer">
                                    <a class="operationContainer_edit mlr10" target="_blank" v-bind:href="'/RefuelAward/detail?refuel_id=' + item.id+'&name='+item.name">详情</a>
                                    <a class="operationContainer_edit mlr10" target="_blank" v-bind:href="'/RefuelAward/statistics?refuel_id=' + item.id+'&name='+item.name">统计</a>
                                </div>
                            </td>
                        </tr>
                    </template>
                    <template v-else>
                        <tr>
                            <td colspan="5">暂无数据</td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
        <template v-if="showData.length > 10">
            <wcc-page
                    v-bind:size='showData.maxLength'
                    v-bind:page='showData.index'
                    v-bind:common='showData.length'
                    v-on:selected="ev_pageSelectChange"
            ></wcc-page>
        </template>

    </div>
@endsection


@section('footer')
    <script src="/js/vue_component.js?v={{config('constants.wcc_file_version')}}"></script>
    <script>
        $(function(){(function(){
	        var refuelCouponData = [];

            var $container = new Vue({
                el : '#listBox',
                data : {
                    searchValue : '',
                    showData : {
                    	status : 1,
                    	data : [],
                        page : 10,
                    	index : 1,
                        length : 0,
                        maxLength : 0,
                    }
                },
	            watch : {

                },
                methods : {
                	//选择数据类型
                    ev_selectDataType : function(status){
	                    var origin = this.showData.status;
	                    if(origin == status)return;

                        this.ev_getData(1,status,function(){
                        	this.showData.status = status;
                        });
                    },
                	//获取数据
                    ev_getData : function(page,status,callback){
                    	var This = this;
                        if(this.ev_getData.onoff)return;
	                    this.ev_getData.onoff = 1;
	                    v$loading.show('数据加载中','two');

	                    $.ajax({
                            url : '/RefuelAward/getRefuelAwardList',
                            type : 'POST',
                            dataType : 'json',
                            data : {
	                            page : page,
	                            page_size : this.showData.page,
                                status : status ? status : this.showData.status,
                            },
                            success : function(res){
	                            v$loading.hide('two');
	                            This.ev_getData.onoff = 0;

	                            if(res.status == 200){
	                            	if('data' in res && 'list' in res.data && res.data.list){
			                            This.showData.maxLength = Math.ceil(res.data.cnt / This.showData.page);
			                            This.showData.length = res.data.cnt;
			                            This.showData.index = page;
			                            This.showData.data = res.data.list;
                                    }
                                    else {
			                            This.showData.maxLength = 0;
			                            This.showData.length = 0;
			                            This.showData.index = 1;
			                            This.showData.data = [];
                                    }
		                            callback && callback.call(This);
                                }
                                else {
	                            	$alert(res.info);
                                }
                            },
                            error : function(code){
	                            v$loading.hide('two');
	                            This.ev_getData.onoff = 0;
	                            $alert('网络错误，请稍后再试');
                            },
                        });
                    },
                	//改变页数
	                ev_pageSelectChange : function(_selectObj){
                    	var origin = {
                    		page : this.showData.page,
                            index : this.showData.index
                        };
                    	if(this.showData.page != _selectObj.strip){
		                    this.showData.page = _selectObj.strip;
		                    this.ev_getData(1);
		                    return;
                        }
                        this.ev_getData(_selectObj.page);
                    },
                },
                updated : function(){

                },
                mounted : function(){
                    //初始化数据
                    this.ev_getData(this.showData.index);
                },
            });
	        window.vTest = $container;//debug
        })();});

        //弹出信息
        function $alert(msg,_callback){
	        if(layer){
		        layer.open({
			        title : '温馨提示',
			        content : msg,
			        yes : function(index){
				        layer.close(index);
				        _callback && _callback();
			        }
		        });
	        }
	        else {
		        alert(msg);
		        _callback && _callback();
	        }
        }
    </script>
@endsection
