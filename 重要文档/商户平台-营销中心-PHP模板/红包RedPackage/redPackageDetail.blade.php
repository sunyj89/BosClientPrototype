@extends('layout/master')

@section('header')
    <link rel="stylesheet" href="/css/common/common.css?v={{config('constants.wcc_file_version')}}" />
    <link rel="stylesheet" href="/css/RedPackage/redPackageDetail.css?v={{config('constants.wcc_file_version')}}" />
    <link href="/css/Setting/ruleManage.css?v={{config('constants.wcc_file_version')}}" rel="stylesheet">
@endsection


@section('content')
    <div class="container clear">
        {{--左侧栏--}}
        <div class="left_content">
            <img class="template_img" src="" />
            <div class="activity_title"></div>
            <div class="top_logo">
                <img class="station_logo" src="" />
                <span class="top_logo_str"></span>
                {{--<img src="/img/ic_hongbao_h5_weicheche.png" alt="">--}}
            </div>
            <div class="h5_titleContainer" ittype="CouponsGiftInfo">
                <div class="h5_titleContainer_mainTitle">活动主标语</div>
                <div class="h5_titleContainer_otheTitle">领个红包更优惠</div>
            </div>
            <div class="blank_con"></div>
            <div class="bot_rule">
                <div class="station_rule"></div>
            </div>
        </div>
        {{--右侧栏--}}
        <div class="right_content">
            {{--上部信息--}}
            <div class="top_box">
                <div class="unit_cell">
                    <div class="lf_content">红包名称</div>
                    <div class="rt_content activityName"></div>
                </div>
                <div class="unit_cell">
                    <div class="lf_content">页面标题</div>
                    <div class="rt_content package_name"></div>
                </div>
                <div class="unit_cell">
                    <div class="lf_content">红包类型</div>
                    <div class="rt_content package_type"></div>
                </div>
                <div class="unit_cell">
                    <div class="lf_content">红包效期</div>
                    <div class="rt_content package_validity"></div>
                </div>
                <div class="unit_cell">
                    <div class="lf_content">周期规律</div>
                    <div class="rt_content rule_type"></div>
                </div>
                <div class="unit_cell">
                    <div class="lf_content">领取用户</div>
                    <div class="rt_content user_type"></div>
                </div>
                <div class="unit_cell">
                    <div class="lf_content">重复领取</div>
                    <div class="rt_content repeat_type"></div>
                </div>
                <div class="unit_cell">
                    <div class="lf_content">能否分享</div>
                    <div class="rt_content package_share"></div>
                </div>
                <div class="unit_cell is_free" style="display: none;">
                    <div class="lf_content">是否免费</div>
                    <div class="rt_content if_free"></div>
                </div>
                <div class="unit_cell">
                    <div class="lf_content">次数限制</div>
                    <div class="rt_content times_limit"></div>
                </div>
                <div class="unit_cell">
                    <div class="lf_content">活动状态</div>
                    <div class="rt_content package_status"></div>
                </div>
                <div class="unit_cell">
                    <div class="lf_content">活动条件</div>
                    <div class="rt_content package_limit"></div>
                </div>
                <div class="unit_cell">
                    <div class="lf_content">主标语</div>
                    <div class="rt_content package_mainTitle"></div>
                </div>
                <div class="unit_cell">
                    <div class="lf_content">副标语</div>
                    <div class="rt_content package_otheTitle"></div>
                </div>
                <div class="unit_cell link_cell">
                    <div class="lf_content">活动链接</div>
                    <div class="rt_content activity_link"></div>
                </div>
                <div class="unit_cell link_cell qr_code_cell">
                    <div class="lf_content">活动二维码</div>
                    <div class="rt_content activity_code">
                        <div id="qr_code"></div>
                        <div id="download_code">下载二维码</div>
                    </div>
                </div>
            </div>
            {{--中部信息--}}
            <div class="center_box">
                <div class="package_summary"></div>
                <table class="coupon_table">
                    <thead>
                        <tr>
                            <td>营销券名称</td>
                            <td>券额</td>
                            <td>发放数量</td>
                            <td>操作</td>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
            </div>
            {{--底部按钮--}}
            <div class="bot_box clear">

            </div>

        </div>
    </div>



    <script type="text/html" id="opVerTpl">
        <div class="rule-form-body rule-set">
            <div class="form-div">
                <label class="form-span">
                    请输入操作密码
                </label>
                <div class="form-right">
                    <input type="password" class="redpackage-input-text" name="op" >
                </div>
            </div>
            <div class="form-div">
                <label class="form-span" style="display: none">

                </label>
                <div class="form-right" style="display: none">
                    <label><input type="checkbox" name="readme" value="1"> 30分钟内不再输入操作密码</label>
                </div>
            </div>
        </div>
    </script>
@endsection

@section('elastic')
    {{--营销券详情--}}
    <div class="modal dialog">
        <div class="dialog_content">
            <div class="top_cell">
                <span class="prompt">营销券详情</span><span class="dialog_close"></span>
            </div>
            <div class="center_cell">

            </div>
        </div>
    </div>
    {{--弹窗--}}
    <div class="pop dialog" type="0">
        <div class="dialog_content">
            <div class="top_cell">
                <span class="prompt">提示</span><span class="dialog_close"></span>
            </div>
            <div class="center_cell">
                <div class="dialog_icon" type="0"></div>
                <div class="dialog_text">
                    <p class="dialog_title">标题</p>
                    <p class="dialog_state">内容</p>
                </div>
                <div class="dialog_btn">
                    <div class="bot_btn">
                        <input type="button" class="cancel" value="取消">
                        <input type="button" class="sure_btn" id="btn-sure" value="确定" able="1">
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="time dialog" type="0">
        <div class="dialog_content">
            <div class="top_cell">
                <span class="prompt">延迟活动</span><span class="dialog_close"></span>
            </div>
            <div class="center_cell">
                <div class="time_input">
                    <span>延迟活动时间至</span><input type="text" id="dateTime">
                </div>
                <div class="dialog_btn">
                    <div class="bot_btn">
                        <input type="button" class="cancel" value="取消">
                        <input type="button" class="sure_btn" id="delay_btn" value="确定" able="1">
                    </div>
                </div>
            </div>
        </div>
    </div>
    {{--toast--}}
    <div class="Toast">
        <div class="toast_content">
            <div class="toast_icon"></div>
            <div class="toast_text">删除成功</div>
        </div>
    </div>
@endsection

@section('footer')
    <script src="/js/common/clipboard.min.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/vendor/qrcode/qrcode.min.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/RedPackage/redPackageDetail.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/wecar.js?v={{config('constants.wcc_file_version')}}"></script>
@endsection
