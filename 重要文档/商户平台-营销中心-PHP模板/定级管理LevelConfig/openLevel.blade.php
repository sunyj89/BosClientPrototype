<!--已废弃-->
@extends('layout/master')

@section('header')
<link rel="stylesheet" href="/css/wcc.css?v={{config('constants.wcc_file_version')}}">
<style>
    .prompt_1{
        font-size:14px;
        color:#333333;
        margin-top:215px;
        margin-bottom:20px;
        text-align:center;
    }
    .prompt_2{
        text-align:center;
    }
    .prompt_3{
        margin-top:200px;
        font-size:30px;
        text-align:center;
    }
    .error-info{
        padding: 25px 30px;
        font-size: 15px;
        text-align: center;
        position: absolute;
        left: 50%;
        top: 215px;
        -webkit-transform: translate(-50%,0);
        -moz-transform: translate(-50%,0);
        -ms-transform: translate(-50%,0);
        -o-transform: translate(-50%,0);
        transform: translate(-50%,0);
    }
    .error-info p{
        margin: 5px 0;
    }
</style>
@endsection

@section('content')
    @if($type==1)
        <div class="error-info">
            <p class="info font-normal">{{$content}}</p>
        </div>
    @endif
    @if($type==2)
        <p class="prompt_1">该商户暂未开启定级配置</p>
        <p class="prompt_2"><button class="wcc_btn_thin_bor_ash" id="open">立即开启</button></p>
    @endif
@endsection

@section('footer')
<script>
    $(document).ready(function() {
        var height = $(window).height();
        $('body').css('height', height);
    });
    $('#open').click(function(){
        $.ajax({
            url:'/LevelConfig/openLevel',
            type:'POST',
            success:function(data){
                if(data.status==200){
                    window.location.reload()
                }else{
                    layer.msg(data.info);
                }
            },
            error:function(){
                layer.msg('服务出错，请刷新试试')
            }
        })
    })
</script>
@endsection