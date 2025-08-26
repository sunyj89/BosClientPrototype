@extends('layout/master')

@section('header')
    <link rel="stylesheet" type="text/css" href="/css/wcc.css?v={{config('constants.wcc_file_version')}}">
    <link rel="stylesheet" type="text/css"
          href="/css/Integral/ruleList.css?v={{config('constants.wcc_file_version')}}">
    <link rel="stylesheet" type="text/css"
          href="/css/Integral/integralcommon.css?v={{config('constants.wcc_file_version')}}">
    <link rel="stylesheet" type="text/css"
          href="/css/wcc-element-ui/index.css?v={{config('constants.wcc_file_version')}}">
    <link rel="stylesheet" type="text/css"
          href="/css/wcc-element-ui/wcc.css?v={{config('constants.wcc_file_version')}}">
@endsection

@section('content')

@endsection

@section('footer')
    <script type="text/javascript" src="/js/vendor/jquery/jquery.js?v={{config('constants.wcc_file_version')}}"></script>
    <script type="text/javascript" src="/js/wcc-element-ui/vue.js?v={{config('constants.wcc_file_version')}}"></script>
    <script type="text/javascript" src="/js/wcc-element-ui/index.js?v={{config('constants.wcc_file_version')}}"></script>
    <script type="text/javascript">
      $(function () {
        new Vue({
          el: '',
          data() {
            return {

            }
          },
          mounted() {

          },
          methods: {},
          computed: {},
          watch: {}
        })
      })
    </script>
@endsection