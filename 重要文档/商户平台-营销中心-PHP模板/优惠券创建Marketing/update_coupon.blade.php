@extends('layout/master')
@section('header')
    <link rel="stylesheet" href="/js/vendor/bootstrap/css/bootstrap.min.css?v={{config('constants.wcc_file_version')}}">
    <link rel="stylesheet" href="/css/Marketing/config.css?v={{config('constants.wcc_file_version')}}" />
@endsection

@section('content')
    <div class="wrapper">
        <div class="config_info">
            {{--基本信息--}}
            <div class="title font-orange">基本信息：</div>
            <div class="unit_box clear sign">
                <div class="lf_box">券名：</div>
                <div class="rt_box">
                    <input type="text" id="coupon_name" placeholder="请输入抵用券名称" maxlength="30" value="{{$coupon_info['coupon_name']}}">
                </div>
            </div>
            <div class="unit_box clear sign">
                <div class="lf_box">券类型：</div>
                <div class="rt_box">
                    @foreach($coupon_types as $coupon_type)
                        @if( $coupon_type->type_id == $coupon_info['type'][0] )
                            <label class="fixed_label"><input type="radio" name="coupon_type" value="{{ $coupon_type->type_id }}" checked><span>{{ $coupon_type->type_name }}</span></label>
                        @else
                            <label class="fixed_label"><input type="radio" name="coupon_type" value="{{ $coupon_type->type_id }}"><span>{{ $coupon_type->type_name }}</span></label>
                        @endif
                    @endforeach
                </div>
            </div>
            <div class="unit_box clear sign">
                <div class="lf_box">面额类型：</div>
                <div class="rt_box">
                    @if( $coupon_info['price_type'] == 1 )
                        <label class="block_label"><input type="radio" name="price_type" value="1" checked><span>固定<input class="inline_input" type="tel" id="fixed_input" maxlength="5" value="{{$coupon_info['price_rule']['price']}}">元</span></label>
                        <label class="block_label"><input type="radio" name="price_type" value="2"><span>随机<input class="inline_input" type="tel" id="min_input" maxlength="5" disabled>元 ~<input class="inline_input" type="tel" id="max_input" maxlength="5" disabled>元</span></label>
                    @else
                        <label class="block_label"><input type="radio" name="price_type" value="1"><span>固定<input class="inline_input" type="tel" id="fixed_input" maxlength="5" disabled>元</span></label>
                        <label class="block_label"><input type="radio" name="price_type" value="2" checked><span>随机<input class="inline_input" type="tel" id="min_input" maxlength="5" value="{{$coupon_info['price_rule']['min_price']}}" >元 ~<input class="inline_input" type="tel" id="max_input" maxlength="5" value="{{$coupon_info['price_rule']['max_price']}}" >元</span></label>
                    @endif
                </div>
            </div>


            {{--            //非油使用条件--}}
            <div class="unit_box clear sign amount_limit @if( $coupon_info['type'][0] != 3 ) c_hide @endif">
                <?php
                $retailLimit = [];
                if (count($coupon_info['limit']) <= 1) {
                    $retailLimit = reset($coupon_info['limit'])['amount_limit'];
                } else {
                    $temp = 0;
                    foreach ($coupon_info['limit'] as $key => $item) {
                        if (!$temp) {
                            $temp = $item['amount_limit'];
                            $retailLimit = $temp;
                        } else {
                            if ($item['amount_limit'] <= $temp) {
                                $temp = $item['amount_limit'];
                                $retailLimit = $temp;
                            }
                        }
                    }
                }
                ?>
                <div class="lf_box">使用条件：</div>
                <div class="rt_box">
                    <div class="oil_box">
                        <div class="condition_choose clear">
                            <div class="price_condition">
                                付款满<input type="tel" min="0" class="price_input" value="{{ $retailLimit }}" >元可用
                            </div>
                        </div>
                    </div>

                </div>
            </div>


            {{--            油品使用条件--}}
            <div class="unit_box clear sign condition_box @if( $coupon_info['type'][0] != 2 ) c_hide @endif">
                <div class="lf_box">使用条件：</div>
                <div class="rt_box">
                    @if( $coupon_info['type'][0] == 2 )
                        <div class="oil_box">
                            <?php $i = 1;?>
                            @foreach($coupon_info['limit'] as $items )
                                <div class="condition_choose clear">
                                    <div class="oil_select select" type="0">
                                        <div class="oil_select_title" choose_oil_id="{{$items['product_id']}}">{{$items['name']}}</div>
                                        <div class="oil_list">
                                            <div class="oil_unit @if( count($coupon_info['limit']) > 1 ) c_hide @endif" data-id="0">不限</div>
                                            @foreach($oils as $oil)
                                                <div class="oil_unit" data-id="{{ $oil['oil_id'] }}">{{ $oil['oil_name'] }}</div>
                                            @endforeach
                                        </div>
                                    </div>
                                    <div class="type_select select" type="0">
                                        <div class="type_select_title" choose_limit_type="{{$items['limit_type']}}">{{$items['type_name']}}</div>
                                        <div class="type_list">
                                            <div class="type_unit" data-limit_type="1">原价</div>
                                            <div class="type_unit" data-limit_type="2">实付</div>
                                            <div class="type_unit" data-limit_type="3">升数</div>
                                        </div>
                                    </div>
                                    <div class="price_condition">
                                        满<input type="tel" min="0" class="price_input" maxlength="4" value="{{$items['amount_limit']}}">元/升
                                    </div>
                                    @if ($i == 1)
                                        <a href="javascript:;" class="add_condition">添加</a>
                                    @else
                                        <a href="javascript:;" class="delete_condition">删除</a>
                                    @endif
                                    <?php $i++;?>
                                </div>
                            @endforeach
                        </div>
                    @else
                        <div class="oil_box">
                            <div class="condition_choose clear">
                                <div class="oil_select select" type="0">
                                    <div class="oil_select_title" choose_oil_id="-1">请选择油号</div>
                                    <div class="oil_list">
                                        <div class="oil_unit" data-id="0">不限</div>
                                        @foreach($oils as $oil)
                                            <div class="oil_unit" data-id="{{ $oil['oil_id'] }}">{{ $oil['oil_name'] }}</div>
                                        @endforeach
                                    </div>
                                </div>
                                <div class="type_select select" type="0">
                                    <div class="type_select_title" choose_limit_type="1">原价</div>
                                    <div class="type_list">
                                        <div class="type_unit" data-limit_type="1">原价</div>
                                        <div class="type_unit" data-limit_type="2">实付</div>
                                        <div class="type_unit" data-limit_type="3">升数</div>
                                    </div>
                                </div>
                                <div class="price_condition">
                                    满<input type="tel" min="0" class="price_input" maxlength="4">元/升
                                </div>
                                <a href="javascript:;" class="add_condition">添加</a>
                            </div>
                        </div>
                    @endif
                    <div class="oil_state">存在多条使用条件时，用户只需满足其中一个条件即可使用营销券</div>
                </div>
            </div>
            <div class="unit_box clear sign">
                <div class="lf_box">有效日期：</div>
                <div class="rt_box">
                    @if( $coupon_info['validate_days']['validate_type'] == 2 )
                        <label class="block_label"><input type="radio" name="date_type" value="2" checked><span>时间段内<input class="inline_input" type="text" id="timeRange"></span></label>
                        <label class="block_label"><input type="radio" name="date_type" value="1"><span>自领取之日<input class="inline_input" type="tel" id="valid_day" maxlength="3" disabled>内有效</span></label>
                    @else
                        <label class="block_label"><input type="radio" name="date_type" value="2"><span>时间段内<input class="inline_input" type="text" id="timeRange" disabled></span></label>
                        <label class="block_label"><input type="radio" name="date_type" value="1" checked><span>自领取之日<input class="inline_input" type="tel" id="valid_day" maxlength="3" value="{{$coupon_info['validate_days']['validate_days']}}">天内有效</span></label>
                    @endif
                </div>
            </div>

            @if($is_group)
                <div class="unit_box clear sign">
                    <div class="lf_box">可用范围：</div>
                    <div class="rt_box">
                        @if( count($select_station ) == count($station_list) )
                            <span class="group_name" id="group_name">集团下全部油站</span>
                            <a class="edit_group" href="javascript:;">修改</a>
                        @elseif ( count($select_station) > 3)
                            <span class="group_name" id="group_name">{{reset($select_station)}}等<span class="font-orange">{{count($select_station)}}</span>家油站</span>
                            <a class="edit_group" href="javascript:;">修改</a>
                        @else
                            <span class="group_name" id="group_name">{{join(' ', $select_station)}}</span>
                            <a class="edit_group" href="javascript:;">修改</a>
                        @endif
                    </div>
                </div>
            @endif

            @if( $coupon_info['type'][0] == 2 )
                <div class="unit_box clear sign c_hide" id="goods_box" able="0">
                    <div class="lf_box">可兑换商品：</div>
                    <div class="rt_box">
                        <div class="goods_name" id="goods_name">请选择相应的商品</div><a class="edit_goods" href="javascript:;">修改</a>
                    </div>
                </div>
                <div class="unit_box clear sign c_hide" id="extra_box">
                    <div class="lf_box">可兑换商品：</div>
                    <div class="rt_box">
                        <span class="extra_name">洗车券</span><a class="edit_extra" href="javascript:;">修改</a>
                    </div>
                </div>
            @elseif( $coupon_info['type'][0] == 3)
                @if (isset($coupon_info['retail']))
                    <div class="unit_box clear sign" id="goods_box" able="1">
                        <div class="lf_box">可兑换商品：</div>
                        <div class="rt_box">
                            <?php
                            $retailCount = 0;
                            foreach ($coupon_info['retail'] as $retail) {
                                foreach ($retail as $tem) {
                                    $retailCount++;
                                }
                            }
                            ?>
                            @if( $retailCount <= 3 )
                                <span class="goods_name" id="goods_name">
                                @foreach($coupon_info['retail'] as $items)
                                        @foreach($items as $item)
                                            {{$item['prod_name']}}
                                        @endforeach
                                    @endforeach
                                </span>
                                <a class="edit_goods" href="javascript:;">修改</a>
                            @else
                                <span class="goods_name" id="goods_name">{{reset($coupon_info['retail'])[0]['prod_name']}}等<span class="font-orange">{{ $retailCount }}</span>件商品<a class="edit_goods" href="javascript:;">修改</a></span>
                            @endif
                        </div>
                    </div>
                    <div class="unit_box clear sign c_hide" id="extra_box">
                        <div class="lf_box">可兑换商品：</div>
                        <div class="rt_box">
                            <span class="extra_name">洗车券</span><a class="edit_extra" href="javascript:;">修改</a>
                        </div>
                    </div>
                @else
                    <div class="unit_box clear sign" id="goods_box" able="1">
                        <div class="lf_box">可兑换商品：</div>
                        <div class="rt_box">
                            <div class="goods_name" id="goods_name">请选择相应的商品</div>
                            <a class="edit_goods" href="javascript:;">添加</a>
                        </div>
                    </div>
                @endif
            @else
                <div class="unit_box clear sign c_hide" id="goods_box" able="0">
                    <div class="lf_box">可兑换商品：</div>
                    <div class="rt_box">
                        <div class="goods_name" id="goods_name">请选择相应的商品</div><a class="edit_goods" href="javascript:;">修改</a>
                    </div>
                </div>
                <div class="unit_box clear sign c_hide" id="extra_box">
                    <div class="lf_box">可兑换商品：</div>
                    <div class="rt_box">
                        <span class="extra_name">洗车券</span><a class="edit_extra" href="javascript:;">修改</a>
                    </div>
                </div>
            @endif

            <div class="unit_box clear sign">
                <div class="lf_box">可用平台：</div>
                <div class="rt_box">
                    @if( $is_general_coupon==1 )
                        @if( isset($coupon_info['platform'][2]))
                            <label class="fixed_label"><input is="1" checked  type="checkbox" name="platform" value="{{ \App\Logic\CouponLogic::COUPON_PLATFORM_ONLINE }}"><span>{{ \App\Model\Coupon::getPlatformValue(\App\Logic\CouponLogic::COUPON_PLATFORM_ONLINE) }}</span></label>

                        @else

                            <label class="fixed_label"><input is="1"  type="checkbox" name="platform" value="{{ \App\Logic\CouponLogic::COUPON_PLATFORM_ONLINE }}"><span>{{ \App\Model\Coupon::getPlatformValue(\App\Logic\CouponLogic::COUPON_PLATFORM_ONLINE) }}</span></label>
                        @endif

                        @if( isset($coupon_info['platform'][3]) )
                            <label class="fixed_label"><input checked is="1"  type="checkbox" name="platform" value="{{ \App\Logic\CouponLogic::COUPON_PLATFORM_XX }}"><span> {{ \App\Model\Coupon::getPlatformValue(\App\Logic\CouponLogic::COUPON_PLATFORM_XX) }} </span></label>

                        @else
                            <label class="fixed_label"><input is="1"  type="checkbox" name="platform" value="{{ \App\Logic\CouponLogic::COUPON_PLATFORM_XX }}"><span> {{ \App\Model\Coupon::getPlatformValue(\App\Logic\CouponLogic::COUPON_PLATFORM_XX) }} </span></label>
                        @endif



                    @elseif( isset($coupon_info['platform'][2]) )
                        <label class="fixed_label"><input type="checkbox" is="0" name="platform" value="{{ \App\Logic\CouponLogic::COUPON_PLATFORM_ONLINE }}" checked><span>{{ \App\Model\Coupon::getPlatformValue(\App\Logic\CouponLogic::COUPON_PLATFORM_ONLINE) }}</span></label>
                        <label class="fixed_label"><input type="checkbox" is="0" name="platform" value="{{ \App\Logic\CouponLogic::COUPON_PLATFORM_XX }}" disabled><span class="c_btn_disabled"> {{ \App\Model\Coupon::getPlatformValue(\App\Logic\CouponLogic::COUPON_PLATFORM_XX) }} </span></label>
                    @elseif( isset($coupon_info['platform'][3]) )
                        <label class="fixed_label"><input type="checkbox" is="0" name="platform" value="{{ \App\Logic\CouponLogic::COUPON_PLATFORM_ONLINE }}" disabled><span class="c_btn_disabled">{{ \App\Model\Coupon::getPlatformValue(\App\Logic\CouponLogic::COUPON_PLATFORM_ONLINE) }}</span></label>
                        <label class="fixed_label"><input type="checkbox" is="0" name="platform" value="{{ \App\Logic\CouponLogic::COUPON_PLATFORM_XX }}" checked><span>{{ \App\Model\Coupon::getPlatformValue(\App\Logic\CouponLogic::COUPON_PLATFORM_ONLINE) }}</span></label>
                    @else
                        很抱歉，由于原平台不再支持修改。请您重新创建一张新券，谢谢。
                    @endif

                </div>
            </div>

            @if( $coupon_info['type'][0] != 2 )

                <div id="limit_type_top" style="display:none">

                    @else

                        <div id="limit_type_top">

                        @endif
                        <!-- <div id="limit_type_top"> -->

                            <div class="unit_box clear sign" id="limit_type_box">
                                <div class="lf_box">限制类型：</div>
                                <div class="rt_box">
                                    <label class="fixed_label"><input type="radio" name="limit_type" value="0" {{ $limit_type == 0 ? 'checked' : '' }}><span>不限</span></label>
                                    <br>
                                    <label class="fixed_label"><input type="radio" name="limit_type" value="1" {{ $limit_type == 1 ? 'checked' : '' }} ><span>仅以下选中的身份/可用</span></label>
                                    <br>
                                    <label class="fixed_label"><input type="radio" name="limit_type" value="2" {{ $limit_type == 2 ? 'checked' : '' }}><span>仅以下选中的身份/不可用</span></label>
                                </div>
                            </div>

                            @if($driver_types)
                                @if( $coupon_info['type'][0] == 2 )
                                    @if( $limit_type == 0 )
                                        <div class="unit_box clear sign unit_box_clear" id="identify_box" style="display:none">
                                            @else
                                                <div class="unit_box clear sign unit_box_clear" id="identify_box">
                                                @endif
                                                <!-- <div class="unit_box clear sign" id="identify_box"> -->
                                                    <div class="lf_box">认证身份：</div>
                                                    <div class="rt_box">
                                                        @if( count($coupon_info['identify']) == 0 )
                                                            @foreach($driver_types as $driver_type)
                                                                <label class="fixed_label"><input type="checkbox" name="identify" value="{{ $driver_type->sub_type_id }}"><span>{{ $driver_type->sub_type_name }}</span></label>
                                                            @endforeach
                                                        @else
                                                            @foreach($driver_types as $driver_type)
                                                                <label class="fixed_label"><input type="checkbox" name="identify" @if(isset($coupon_info['identify'][$driver_type->sub_type_id])) checked @endif value="{{ $driver_type->sub_type_id }}"><span>{{ $driver_type->sub_type_name }}</span></label>
                                                            @endforeach
                                                        @endif
                                                    </div>
                                                </div>
                                                @else
                                                    <div class="unit_box clear sign unit_box_clear" id="identify_box" style="display: none;">
                                                        <div class="lf_box">认证身份：</div>
                                                        <div class="rt_box">
                                                            @foreach($driver_types as $driver_type)
                                                                <label class="fixed_label"><input type="checkbox" name="identify" value="{{ $driver_type->sub_type_id }}"><span>{{ $driver_type->sub_type_name }}</span></label>
                                                            @endforeach
                                                        </div>
                                                    </div>
                                                @endif
                                            @endif

                                            @if ($levels)
                                                @if( $coupon_info['type'][0] == 2 )
                                                    @if( $limit_type == 0 )

                                                        <div class="unit_box clear sign unit_box_clear" id="level_box" style="display:none">

                                                            @else

                                                                <div class="unit_box clear sign unit_box_clear" id="level_box">

                                                                @endif
                                                                <!-- <div class="unit_box clear sign" id="level_box"> -->
                                                                    <div class="lf_box">等级身份：</div>
                                                                    <div class="rt_box">
                                                                        @if( count($coupon_info['level']) == 0 )
                                                                            @foreach($levels as $level)
                                                                                <label class="fixed_label"><input type="checkbox" name="level" value="{{ $level->id }}"><span>{{ $level->level_name }}</span></label>
                                                                            @endforeach
                                                                        @else
                                                                            @foreach($levels as $level)
                                                                                <label class="fixed_label"><input type="checkbox" name="level"  @if(isset($coupon_info['level'][$level->id])) checked @endif value="{{ $level->id }}"><span>{{ $level->level_name }}</span></label>
                                                                            @endforeach
                                                                        @endif
                                                                        @if(!$use_tag)
                                                                            <div class="oil_state">以上身份只需满足其中一个，限制类型就会生效。</div>
                                                                        @endif


                                                                    </div>
                                                                </div>
                                                                @else
                                                                    <div class="unit_box clear sign unit_box_clear" id="level_box" style="display: none">
                                                                        <div class="lf_box">等级身份：</div>
                                                                        <div class="rt_box">
                                                                            @foreach($levels as $level)
                                                                                <label class="fixed_label"><input type="checkbox" name="level" value="{{ $level->id }}"><span>{{ $level->level_name }}</span></label>
                                                                            @endforeach
                                                                            @if(!$use_tag)
                                                                                <div class="oil_state">以上身份只需满足其中一个，限制类型就会生效。</div>
                                                                            @endif

                                                                        </div>
                                                                    </div>
                                                                @endif
                                                            @endif

                                                        </div>

                                                        @if($use_tag)
                                                            @if( $coupon_info['type'][0] == 2 )
                                                                @if( $limit_type == 0 )
                                                                    <div class="unit_box clear sign unit_box_clear" id="use_tag_box" style="display:none">
                                                                        @else
                                                                            <div class="unit_box clear sign unit_box_clear" id="use_tag_box">
                                                                            @endif
                                                                            <!-- <div class="unit_box clear sign" id="identify_box"> -->
                                                                                <div class="lf_box">自定义身份：</div>
                                                                                <div class="rt_box">
                                                                                    @if( count($coupon_info['use_tag']) == 0 )
                                                                                        @foreach($use_tag as $driver_type)
                                                                                            <label class="fixed_label"><input type="checkbox" name="use" value="{{ $driver_type->id }}"><span>{{ $driver_type->name }}</span></label>
                                                                                        @endforeach
                                                                                    @else
                                                                                        @foreach($use_tag as $driver_type)
                                                                                            <label class="fixed_label"><input type="checkbox" name="use"   @if(isset($coupon_info['use_tag'][$driver_type->id])) checked @endif value="{{ $driver_type->id }}"><span>{{ $driver_type->name }}</span></label>
                                                                                        @endforeach
                                                                                    @endif
                                                                                    <div class="oil_state">以上身份只需满足其中一个，限制类型就会生效。</div>
                                                                                </div>

                                                                            </div>
                                                                            @else
                                                                                <div class="unit_box clear sign unit_box_clear" id="use_tag_box" style="display: none;">
                                                                                    <div class="lf_box">自定义身份：</div>
                                                                                    <div class="rt_box">
                                                                                        @foreach($use_tag as $driver_type)
                                                                                            <label class="fixed_label"><input type="checkbox" name="use" value="{{ $driver_type->id }}"><span>{{ $driver_type->name }}</span></label>
                                                                                        @endforeach
                                                                                        <div class="oil_state">以上身份只需满足其中一个，限制类型就会生效。</div>
                                                                                    </div>
                                                                                </div>
                                                                            @endif
                                                                        @endif



                                                                        <div class="unit_box clear sign" style="display: none;">
                                                                            <div class="lf_box">描述：</div>
                                                                            <div class="rt_box">
                                                                                <div class="group_name"><input type="text" id="description" maxlength="15"></div>
                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                                    <div class="group_box c_hide">
                                                                        <div class="font-orange">优惠券展示（微信公众号）</div>
                                                                        <div class="coupon_preview">
                                                                            <div class="group_foot_top clear">
                                                                                <div class="lf_cell">
                                                                                    <img src="https://fs.weicheche.cn/images/st_logos/logo_gasstation_others.png" alt="">
                                                                                </div>
                                                                                <div class="rt_cell">
                                                                                    <div class="group_name">钓鱼岛集团</div>
                                                                                    <div class="group_coupon_name">营销券金额或券名</div>
                                                                                </div>
                                                                            </div>
                                                                            <div class="group_foot_box clear">
                                                                                <div class="lf_cell">使用时间段</div>
                                                                                <div class="rt_cell">字段</div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="foot_box">
                                                                        <div class="c_btn" id="save" type="1">保存</div>
                                                                    </div>
                                        </div>
                                        @endsection

                            @section('elastic')
                                {{--可选择油站弹窗--}}
                                @if ($is_group)
                                    <div class="confirm station_confirm">
                                        <div class="content_box station_box">
                                            <div class="top_box">
                                                <div class="c_title sign">修改油站范围</div>
                                                <div class="close"></div>
                                            </div>
                                            <div class="main_box">
                                                <div class="station_list_box clear">
                                                    @foreach($station_list as $v)
                                                        <label class="std_unit_box">
                                                            <input type="checkbox" name="station_name" @if(isset($select_station[$v->stid])) checked @endif >
                                                            <div class="station_name" data-id="{{ $v->stid }}">{{ $v->stname }}</div>
                                                        </label>
                                                    @endforeach
                                                </div>
                                                <div class="select_all">
                                                    <div class="c_btn selectAll" type="1">全选</div>
                                                </div>
                                            </div>
                                            <div class="foot_box">
                                                <div class="c_btn cancel" type="0" id="cancel_station">取消</div>
                                                <div class="c_btn sure" type="1">确定</div>
                                            </div>
                                        </div>
                                    </div>
                                @endif

                                {{--可兑换弹窗--}}
                                {{--单站--}}
                                @if(!$is_group)
                                    <div class="confirm choice_confirm exchange_confirm"  type="1">
                                        <div class="content_box single_box">
                                            <div class="top_box">
                                                <div class="c_title sign">选择可兑换的商品</div>
                                                <div class="close"></div>
                                            </div>
                                            <div class="main_box">
                                                <div class="choice_top_box">
                                                    <div class="choice_box">
                                                        <div class="choice_title">品类</div>
                                                        <div class="select kind_choice" type="0">
                                                            <div class="select_title" select_id="0">请选择品类</div>
                                                            <div class="select_list">
                                                                <div class="select_item kind_item" data-id="0">全部</div>
                                                                @foreach($retail_class as $v)
                                                                    <div class="select_item kind_item" data-id="{{ $v->id }}">{{ $v->name }}</div>
                                                                @endforeach
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="j_choice_box">
                                                        <div class="choice_title">搜索</div>
                                                        <div class="text" >
                                                            <input type="tel" name="" value="" placeholder="请输入条形码">
                                                            <div class="bottom" id="choice_box_bottom">确认</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="choice_main_box">
                                                    <div class="list_box select_able_box">
                                                        <div class="list_title">可选择商品 <label class="select_all_retails">全选</label></div>
                                                        <div class="list_content">
                                                        </div>
                                                    </div>
                                                    <div class="list_box" id="single_select_box">
                                                        <div class="list_title">已选择商品</div>
                                                        <div class="list_content show_box">
                                                            @if( $coupon_info['type'][0] == 3 && isset($coupon_info['retail']))
                                                                @foreach( $coupon_info['retail'] as $items )
                                                                    @foreach($items as $item)
                                                                        <div class="list_unit_box" data-id="{{$item['prod_id']}}">
                                                                            <img src="{{$item['prod_thumbnail_url']}}">
                                                                            <div class="goods_desc">
                                                                                <p class="goods_name">{{$item['prod_name']}}</p>
                                                                                <p class="goods_price font-orange">¥&nbsp;<span class="prod_price">{{$item['prod_curr_price']}}</span></p>
                                                                                <a href="javascript:;" class="remove_btn">删除</a>
                                                                            </div>
                                                                        </div>
                                                                    @endforeach
                                                                @endforeach
                                                            @endif
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="foot_box">
                                                <div class="c_btn cancel" type="0">取消</div>
                                                <div class="c_btn sure" type="1">确定</div>
                                            </div>
                                        </div>
                                    </div>
                                @else
                                    {{--集团--}}
                                    <div class="confirm choice_confirm exchange_confirm" type="2">
                                        <div class="content_box group_std_box">
                                            <div class="top_box">
                                                <div class="c_title sign">选择可兑换的商品</div>
                                                <div class="close"></div>
                                            </div>
                                            <div class="main_box">
                                                <div class="choice_top_box">
                                                    <div class="choice_box">
                                                        <div class="choice_title">油站</div>
                                                        <div class="select std_choice" type="0">
                                                            @foreach($select_station as $k => $v)
                                                                <div class="select_title" select_id="{{$k}}">{{$v}}</div>
                                                                <?php break;?>
                                                            @endforeach
                                                            <div class="select_list" id="select_station_list">
                                                                @foreach($select_station as $k => $v)
                                                                    <div class="select_item station_item" data-id="{{ $k }}">{{ $v }}</div>
                                                                @endforeach
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="choice_box">
                                                        <div class="choice_title">品类</div>
                                                        <div class="select kind_choice" type="0">
                                                            <div class="select_title" select_id="0">请选择品类</div>
                                                            <div class="select_list">
                                                                <div class="select_item kind_item" data-id="0">全部</div>
                                                                @foreach($retail_class as $v)
                                                                    <div class="select_item kind_item" data-id="{{ $v->id }}">{{ $v->name }}</div>
                                                                @endforeach
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="j_choice_box j_choice_box_margin">
                                                    <div class="choice_title">搜索</div>
                                                    <div class="text" >
                                                        <input type="tel" name="" value="" placeholder="请输入条形码">
                                                        <div class="bottom" id="choice_box_bottom">确认</div>
                                                    </div>
                                                </div>
                                                <div class="choice_main_box">
                                                    <div class="list_box select_able_box">
                                                        <div class="list_title">可选择商品<label class="select_all_retails">全选</label></div>
                                                        <div class="list_content">

                                                        </div>
                                                    </div>
                                                    <div class="list_box">
                                                        <div class="list_title">已选择商品</div>
                                                        <div class="list_content show_box" id="group_select_box">
                                                            @foreach($station_list as $v)
                                                                <div class="group_choice_box" data-stid="{{ $v->stid }}">
                                                                    <p class="station_title" data-stid="{{ $v->stid }}">{{ $v->stname }}</p>
                                                                    <div class="station_select_unit_box">
                                                                        @if(isset($coupon_info['retail'][$v->stid]))
                                                                            @foreach($coupon_info['retail'][$v->stid] as $value)
                                                                                <div class="choice_items" data-id="{{$value['prod_id']}}">
                                                                                    <img src="{{$value['prod_thumbnail_url']}}">
                                                                                    <div class="goods_desc">
                                                                                        <p class="goods_name">{{$value['prod_name']}}</p>
                                                                                        <p class="goods_price font-orange">¥&nbsp;<span class="prod_price">{{$value['prod_curr_price']}}</span></p>
                                                                                        <a href="javascript:;" class="remove_btn">删除</a>
                                                                                    </div>
                                                                                </div>
                                                                            @endforeach
                                                                            <div class="choice_items no_choice_items" style="display: none">
                                                                                <p class="no_choice">未选择商品</p>
                                                                            </div>
                                                                        @else
                                                                            <div class="choice_items no_choice_items">
                                                                                <p class="no_choice">未选择商品</p>
                                                                            </div>
                                                                        @endif
                                                                    </div>
                                                                </div>
                                                            @endforeach
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="foot_box">
                                                <div class="c_btn cancel" type="0">取消</div>
                                                <div class="c_btn sure" type="1">确定</div>
                                            </div>
                                        </div>
                                    </div>
                                @endif

                                {{--可兑换异业商品--}}
                                {{--单站--}}
                                @if(!$is_group)
                                    <div class="confirm choice_confirm extra_confirm" type="1">
                                        <div class="content_box single_box">
                                            <div class="top_box">
                                                <div class="c_title sign">选择可兑换的商品</div>
                                                <div class="close"></div>
                                            </div>
                                            <div class="main_box">
                                                <div class="choice_top_box">
                                                    <div class="choice_box">
                                                        <div class="choice_title">品类</div>
                                                        <div class="select kind_choice" type="0">
                                                            <div class="select_title">请选择油站</div>
                                                            <div class="select_list">
                                                                <div class="select_item">中国钓鱼岛第一加油站</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="choice_main_box">
                                                    <div class="list_box">
                                                        <div class="list_title">可选择商品</div>
                                                        <div class="list_content">
                                                            <label class="list_unit_box goods_list_box">
                                                                <input type="checkbox" name="goods">
                                                                <img src="/img/ic_notice_remind.png" alt="">
                                                                <div class="goods_desc">
                                                                    <p class="goods_name">老挝古树散装生茶100g</p>
                                                                    <p class="goods_price font-orange">&yen;&nbsp;88.00</p>
                                                                </div>
                                                            </label>
                                                            <label class="list_unit_box goods_list_box">
                                                                <input type="checkbox" name="goods">
                                                                <img src="/img/ic_notice_remind.png" alt="">
                                                                <div class="goods_desc">
                                                                    <p class="goods_name">老挝古树散装生茶100g</p>
                                                                    <p class="goods_price font-orange">&yen;&nbsp;88.00</p>
                                                                </div>
                                                            </label>
                                                            <label class="list_unit_box goods_list_box">
                                                                <input type="checkbox" name="goods">
                                                                <img src="/img/ic_notice_remind.png" alt="">
                                                                <div class="goods_desc">
                                                                    <p class="goods_name">老挝古树散装生茶100g</p>
                                                                    <p class="goods_price font-orange">&yen;&nbsp;88.00</p>
                                                                </div>
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div class="list_box">
                                                        <div class="list_title">已选择商品</div>
                                                        <div class="list_content show_box"></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="foot_box">
                                                <div class="c_btn cancel" type="0">取消</div>
                                                <div class="c_btn sure" type="1">确定</div>
                                            </div>
                                        </div>
                                    </div>
                                @endif
                            @endsection

                            @section('footer')
                                {{--条件单元--}}
                                <script type="text/html" id="addCondition_unit">
                                    <div class="condition_choose clear">
                                        <div class="oil_select select" type="0">
                                            <div class="oil_select_title" choose_oil_id="-1">请选择油号</div>
                                            <div class="oil_list">
                                                @foreach($oils as $oil)
                                                    <div class="oil_unit" data-id="{{ $oil['oil_id'] }}">{{ $oil['oil_name'] }}</div>
                                                @endforeach
                                            </div>
                                        </div>
                                        <div class="type_select select" type="0">
                                            <div class="type_select_title" choose_limit_type="1">原价</div>
                                            <div class="type_list">
                                                <div class="type_unit" data-limit_type="1">原价</div>
                                                <div class="type_unit" data-limit_type="2">实付</div>
                                                <div class="type_unit" data-limit_type="3">升数</div>
                                            </div>
                                        </div>
                                        <div class="price_condition">
                                            满<input type="number" min="0" class="price_input">元/升
                                        </div>
                                        <a href="javascript:;" class="delete_condition">删除</a>
                                    </div>
                                </script>
                                <script>
                                    var coupon_info = {!! json_encode($coupon_info) !!};
                                    var is_group = {{$is_group}},
                                        select_station = {!! json_encode($select_station) !!},
                                        driver_types = {{$driver_types ? 1 : 0 }},
                                        levels   = {{$levels ? 1 : 0 }} ,
                                        use_tag   = {{$use_tag ? 1 : 0 }};
                                    var black_fun_arr = {!! json_encode($black_privilege_arr)  !!};
                                </script>
                                <script type="text/javascript" src="/js/vendor/Plug/Plug.js"></script>
                                <script src="/js/Marketing/btnControl.js?v={{config('constants.wcc_file_version')}}"></script>
                                <script src="/js/Marketing/modify_coupon.js?v={{config('constants.wcc_file_version')}}"></script>
@endsection