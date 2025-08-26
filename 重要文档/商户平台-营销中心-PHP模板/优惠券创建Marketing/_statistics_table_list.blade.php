<table class="table table-striped">
    <tr>
        <th>日期</th>
        <th>领取张数（张）</th>
        <th>领取成本（元）</th>
        <th>已使用（张）</th>
        <th>未使用（张）</th>
        <th>已过期（张）</th>
        <th>已弃用（张）</th>
        <th>营销成本（元）</th>
        <th>产出销量（元）</th>
        <th>产出销量（升）</th>
        <th>产出销量（笔）</th>
    </tr>
    @foreach($data as $date => $item)
    <tr>
        <td>{{ $date }}</td>
        <td>{{ $item['send_num'] }}</td>
        <td>{{ \App\Model\InspayFinance::formatPrice($item['send_price']) }}</td>
        <td>{{ $item['use_num'] }}</td>
        <td>{{ $item['unuse_num'] }}</td>
        <td>{{ $item['expire_num'] }}</td>
        <td>{{ $item['invalid_num'] }}</td>
        <td>{{ \App\Model\InspayFinance::formatPrice($item['use_price']) }}</td>
        <td>{{ \App\Model\InspayFinance::formatPrice($item['output_amount']) }}</td>
        <td>{{ $item['output_liter'] }}</td>
        <td>{{ $item['output_count'] }}</td>
    </tr>
    @endforeach
</table>