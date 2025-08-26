@extends('layout/master')


@section('header')
<link rel="stylesheet" href="/css/Marketing/config.css?v={{config('constants.wcc_file_version')}}" />
@endsection


@section('content')
<!-- header -->
@include ('common/marketing_header')
{!! $_header !!}

<div class="clear-fix"></div>

<div class="page-body">
    <div class="tab-content">
        <div class="tab-pane active" id="edit">
            <div class="content-block">
            </div>
        </div>
    </div>
    <div class="clear-fix"></div>
</div>
<div id="pager" class="pagination"></div>
<div class="clear-fix"></div>

@endsection

@section('footer')
<script src="/js/Marketing/config.js?v={{config('constants.wcc_file_version')}}"></script>
@endsection
