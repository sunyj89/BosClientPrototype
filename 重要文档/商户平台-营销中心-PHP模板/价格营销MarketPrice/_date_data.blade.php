{{--@foreach($channel_detail as $key=>$val)--}}
{{--<div class="cb_title clear">--}}
    {{--<div class="title"><span>{{$val['valid_start_time']}} 至 {{$val['valid_end_time']}}</span></div>--}}
    {{--<div class="status">状态:--}}
        {{--@if($status==1)--}}
        {{--<span class="online">生效中</span>--}}
        {{--@elseif($status==3)--}}
        {{--<span class="future">计划生效</span>--}}
        {{--@elseif($status==2)--}}
        {{--<span class="timeout">已过期</span>--}}
        {{--@endif--}}
    {{--</div>--}}
{{--</div>--}}
{{--<div class="ul_li">--}}
    {{--<li style="width: 182px;">0</li><li style="width: 182px;">1</li><li style="width: 226px;">1</li><li style="width: 410px;">1</li><li style="width: 226px;">1</li><li style="width: 410px;border-right: 1px solid #e2e2e2">1</li>--}}
    {{--<li style="width: 182px;">1</li>--}}
{{--</div>--}}
{{--<table width="100%" class="table channel_table" style="position: relative;">--}}
    {{--@foreach($val['list_data'] as $v)--}}
    {{--<tr>--}}
        {{--<td class="type_name"><div><label><input data-start="{{$val['valid_start_time']}}" data-type="{{$v['type']}}" data-end="{{$val['valid_end_time']}}" type="checkbox" name="rule_id[]" style="display: none" value="{{$v['rule_id']}}"> <span>{{isset($v['type_name'])?$v['type_name']:''}}<br>{{isset($v['sub_type_name'])?$v['sub_type_name']:''}}</span></label></div></td>--}}
        {{--<td class="date_type"><div><span>{{$v['date_type']}}</span></div></td>--}}
        {{--<td class="channel_date">--}}
            {{--<table width="100%" class="date_table">--}}
                {{--@foreach($v['date_data'] as $k1 => $v1)--}}
                {{--<tr>--}}
                    {{--<td class="date_data first @if($k1<1) btop @endif">--}}
                        {{--<p>{{$v1['date_desc']}}</p>--}}
                        {{--<p>{{$v1['time_desc']}}</p>--}}
                    {{--</td>--}}
                    {{--<td class="td_oil @if($k1<1) btop @endif">--}}
                        {{--@foreach($v1['data'] as $v2)--}}
                        {{--<p>{{$v2['sale_desc']}}</p>--}}
                        {{--@endforeach--}}
                    {{--</td>--}}
                {{--</tr>--}}
                {{--@endforeach--}}
            {{--</table>--}}
        {{--</td>--}}
    {{--</tr><tr rowspan="7">1</tr>--}}
    {{--@endforeach--}}

{{--</table>--}}
{{--@endforeach--}}
