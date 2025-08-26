@extends('layout/master')

@section('header')
    <link rel="stylesheet" href="/css/wecar.css?v={{config('constants.wcc_file_version')}}" />
    <link rel="stylesheet" href="/css/RefuelDiscount/refuelDiscount.css?v={{config('constants.wcc_file_version')}}" />
    <link rel="stylesheet" href="/css/wcc.css?v={{config('constants.wcc_file_version')}}" />
    <link rel="stylesheet" href="/css/wcc-element-ui/index.css?v={{config('constants.wcc_file_version')}}">
    <link rel="stylesheet" href="/css/wcc-element-ui/wcc.css?v={{config('constants.wcc_file_version')}}">
@endsection


@section('content')
    <div class="createContainer" id="createBox">

        <div class="createContainer_lineBox">
            <div class="createContainer_lineBox_left"><span>*</span>活动名称</div>
            <div class="createContainer_lineBox_right">
                <input class="createContainer_lineBox_input wcc_input" v-on:focus="error_obj.create_name=false" v-bind:class="{error_mess:error_obj.create_name}"  type="text" placeholder="请输入活动名称" v-model="create_name" />
            </div>
        </div>

        <div class="createContainer_lineBox">
            <div class="createContainer_lineBox_left"><span>*</span>活动有效期</div>
            <div class="createContainer_lineBox_right">
                <div class="wcc_selectStation_box wcc_time wcc_width343" itshow="0">
                    <i class="wcc_calendar"></i>
                    <div class="input_box">
                        <input id="timeSelect" type="text" />
                    </div>
                </div>
            </div>
            <span v-if="flagtimeavaliable" style="color:#E51143;position: absolute;top: 100px;left: 520px;" class="prompt_discount"><i>&#xe66c;</i>活动期内已存在满减活动</span>
        </div>

        <div class="createContainer_lineBox" v-if="is_group">
            <div class="createContainer_lineBox_left"><span>*</span>活动油站</div>
            <div class="createContainer_lineBox_right createContainer_lineBox_right_uni">
                <select-radio v-bind:add="station_list_arr1" select="请选择要添加的油站" v-on:selected="checkout_oil" type='2'></select-radio>
            </div>
        </div>

        <div class="createContainer_lineBox">
            <div class="createContainer_lineBox_left"><span>*</span>周期规则</div>
        </div>
        
        <div class="date_selected" >
            <el-radio-group class="flex-start" v-model="radio">
              <el-radio :label="0">无</el-radio>
              <el-radio :label="1">每天</el-radio>
              <el-radio :label="2">每周</el-radio>
              <el-radio :label="3">每月</el-radio>
            </el-radio-group>
            <el-repeat-time-picker
                style="width: 100%"
                @change="change"
                xstyle="width: 280px;"
                value-format="HH:mm:ss"
                :max-length="8"
                v-model="obj"
                :type="radio">
            </el-repeat-time-picker>
        </div>



        <div class="createContainer_lineBox">
            <div class="createContainer_lineBox_left"><span>*</span>参与资格</div>
            <div class="createContainer_lineBox_right">
                <el-radio-group v-model="identify_type">
                    <el-radio :label="0">所有用户</el-radio>
                    <el-radio :label="3">新用户</el-radio>
                </el-radio-group>
            </div>
        </div>
        <div class="createContainer_lineBox">
            <div class="createContainer_lineBox_left"><span>*</span>与券优惠是否同享</div>
            <div class="createContainer_lineBox_right">
                <el-radio-group v-model="discount_with_coupon">
                    <el-radio :label="0">不同享</el-radio>
                    <el-radio :label="1">可同享</el-radio>
                </el-radio-group>
            </div>
        </div>

        <div class="createContainer_lineBox">
            <div class="createContainer_lineBox_left"><span>*</span>与积分抵油是否同享</div>
            <div class="createContainer_lineBox_right">
                <el-radio-group v-model="discount_with_credit">
                    <el-radio :label="0">不同享</el-radio>
                    <el-radio :label="1">可同享</el-radio>
                </el-radio-group>
            </div>
        </div>

        <div class="createContainer_lineBox addProjectContainer" isauto="1">
            <div class="createContainer_lineBox_left"><span>*</span></div>
            <div class="createContainer_lineBox_right">

                <template v-for="(bigItem,bigIndex) in use_project">
                    <div class="ruleContainer_top">
                        <!-- <div class="ruleContainer_title">规则@{{Number(bigIndex)+1}}</div> -->
                        <div class="ruleContainer">
                            <div class="ruleContainer_box ruleContainer_box_float">
                                <div class="ruleContainer_block">
                                    <em class="ruleContainer_block_em">油品规则</em>
                                    <template v-if="bigIndex == 0">
                                        <select-radio v-bind:add="oil_type_array" v-bind:disabled="use_project.length > 1" select="请选择油品" v-on:selected="fn_getOilData(bigItem,arguments[0])" v-bind:search-input="0"></select-radio>
                                    </template>
                                    <template v-else>
                                        <select-radio v-bind:add="[{name:'选中油品',val:1,}]" select="请选择" v-on:selected="bigItem.oil_type = arguments[0].val" v-bind:search-input="0" v-bind:radio="0"></select-radio>
                                    </template>
                                    <template v-if="bigItem.oil_type == 1">
                                        <template v-if="oil_array.length">
                                            <select-radio class="w200" v-bind:add="checkOilFun(bigItem)" select="请选择" v-on:selected="(bigItem.oil_selected = []),ev_selectOil(arguments[0],bigItem.oil_selected)" type='2' v-bind:model="model"></select-radio>
                                        </template>
                                        <template v-else>
                                            <div class="wcc_selectStation_box"><em>请选择</em></div>
                                        </template>
                                    </template>
                                </div>
                            </div>
                            <div class="ruleContainer_box ruleContainer_box_float ruleContainer_box_float_t">
                                <div class="ruleContainer_block">
                                    <!-- <em class="ruleContainer_block_em">限制类型</em> -->
                                    <select-radio v-bind:add="checkLimitTypeFun(bigItem)" v-bind:radio="bigItem.index" v-bind:select="'请选择'" v-on:selected="checkout_litmit(bigItem,arguments[0])" v-bind:search-input="0" v-bind:model="model"></select-radio>

                                   
                                </div>
                                
                            </div>
                            
                            <template  v-for="(item,index) in bigItem.condition">
                                <div class="ruleContainer_box">
                                    <i class="ruleContainer_block">
                                        <em v-bind:style="{ opacity : index == 0 ? 1 : 0 }">梯度立减&nbsp;&nbsp;</em>
                                        <!-- <em>消费</em> -->
                                        大于等于<input class="wcc_input wcc_input_up" type="number" v-on:focus="item.error=false" v-bind:class="{error_mess:item.error}" v-model="item.min_money" v-bind:placeholder="(index * 100).toFixed(2) +''" />
                                        <div class="ruleContainer_center">小于</div>
                                        <input class="wcc_input wcc_input_up_2" type="number" v-on:focus="item.error=false" v-bind:class="{error_mess:item.error}" v-model="item.max_money" v-bind:placeholder="((index * 100) + 100.00).toFixed(2) +''" />
                                        <i>@{{bigItem.limit_type == -1 ? '元/升，' : bigItem.limit_type == 3 ? '升，' : '元，'}}</i>
                                        <i v-if="bigItem.limit_type == 4">每升直降</i>
                                        <i v-else>整单立减</i>
                                        <input class="wcc_input wcc_input_up_3" type="number" v-on:focus="item.error=false" v-bind:class="{error_mess:item.error}" v-model="item.discount_price" v-bind:placeholder=" '0' +''" />
                                        <i>元</i>
                                        <div class="ruleContainer_buttonAll">
                                            <template v-if="bigItem.condition.length < 2">
                                                <div class="ruleContainer_button ruleContainer_button_add" v-on:click="ev_addRewardCondition(bigIndex,index)">添加</div>
                                            </template>
                                            <!-- <template v-else-if="bigItem.condition.length > 7">
                                                <div class="ruleContainer_button ruleContainer_button_del" v-on:click="ev_deleteRewardCondition(bigIndex,index)">删除</div>
                                            </template> -->
                                            <template v-else>
                                                <div class="ruleContainer_button ruleContainer_button_add" v-on:click="ev_addRewardCondition(bigIndex,index)">添加</div>
                                                <div class="ruleContainer_button ruleContainer_button_del" v-on:click="ev_deleteRewardCondition(bigIndex,index)">删除</div>
                                            </template>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                        <template v-if="use_project[0].oil_type == 1">
                            <div class="ruleContainer_function ruleContainer_function_new_position">
                                <!-- <template v-if="use_project.length < 2">
                                    <div class="ruleContainer_function_add" v-on:click="ev_addProject(bigIndex)">添加</div>
                                </template>
                                <template v-else-if="use_project.length > 4">
                                    <div class="ruleContainer_function_del" v-on:click="ev_deleteProject(bigIndex)">删除</div>
                                </template>
                                <template v-else>
                                    <div class="ruleContainer_function_add" v-on:click="ev_addProject(bigIndex)">添加</div>
                                    <div class="ruleContainer_function_del" v-on:click="ev_deleteProject(bigIndex)">删除</div>
                                </template> -->
                                <template v-if="use_project.length > 1">
                                    <div class="ruleContainer_function_del ruleContainer_function_del_new" v-on:click="ev_deleteProject(bigIndex)"><i>&#xe66f;</i></div>
                                </template>
                            </div>
                        </template>
                    </div>
                </template>
                <template v-if="use_project[0].oil_type == 1">
                <template v-if="use_project.length < 4">
                    <div class="ruleContainer_function ruleContainer_function_new">
                        <div class="ruleContainer_function_add ruleContainer_function_add_new" v-on:click="ev_addProject()">添加</div>
                    </div>
                </template>
                </template>
            </div>
        </div>



        <div class="createContainer_lineBox">
            <div class="createContainer_lineBox_left"><span>*</span>优惠次数限制</div>
            <div class="createContainer_lineBox_right">
                <em>用户每日最多可获得</em>
                <input style="width:15%;margin:0 10px;text-align:center;" v-on:focus="error_obj.count_day_number=false" v-bind:class="{error_mess:error_obj.count_day_number}" class="createContainer_lineBox_input wcc_input" type="number" max="999" placeholder="整数" v-on:keydown="ev_numberInputLimit($event,true)" v-model=" count_day_number"  v-on:input="count_day_number = count_day_number>999? 999 : count_day_number;" value="count_day_number" />
                <em>次优惠，用户本次活动最多可获得</em>
                <input style="width:15%;margin:0 10px;text-align:center;" v-on:focus="error_obj.count_number=false" v-bind:class="{error_mess:error_obj.count_number}" class="createContainer_lineBox_input wcc_input" type="number" max="999" placeholder="整数" v-on:keydown="ev_numberInputLimit($event,true)" v-model=" count_number"  v-on:input="count_number = count_number>999? 999 : count_number;" value="count_number" />
                <em>次优惠</em>
            </div>
        </div>


        <div class="createContainer_lineBox" style="margin-top:50px;">
            <div class="submitButton wcc_btn_fat_green" v-on:click="ev_submit" style="margin-left:140px;">创建</div>
        </div>
    </div>
@endsection



@section('footer')
    <script>
        var is_group={!! json_encode($is_group) !!};
        var station_list={!! json_encode($station_list) !!};
        var station_list_arr=[];
        {{--var driver_types = {!! json_encode($driver_types) !!};--}}
        {{--var levels = {!! json_encode($levels) !!};--}}
        if(Object.prototype.toString.call(station_list)==='[object Object]'){
            for(var key in station_list){
                station_list_arr.push({name:station_list[key].stname,id:station_list[key].stid});
            }
        }
    </script>
    <script src="/js/wcc-element-ui/vue.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/wcc-element-ui/index.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/wecar.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/vue_component.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/RefuelDiscount/RefuelDiscount.js?v={{config('constants.wcc_file_version')}}"></script>
@endsection
