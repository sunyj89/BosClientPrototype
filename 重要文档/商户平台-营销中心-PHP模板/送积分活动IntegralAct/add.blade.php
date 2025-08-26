@extends('layout/master')

@section('header')
    <link rel="stylesheet" type="text/css" href="/css/wcc.css?v={{config('constants.wcc_file_version')}}">
    <link rel="stylesheet" type="text/css" href="/css/wcc-element-ui/index.css?v={{config('constants.wcc_file_version')}}">
    <link rel="stylesheet" type="text/css" href="/css/wcc-element-ui/wcc.css?v={{config('constants.wcc_file_version')}}">
    <style>
        #integral-create{
            padding-top:40px;
        }
        #integral-create .link{
            display:inline-block;
            width:380px;
            padding-right:30px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .upload-wrap{
            position: relative;
            margin-left: 20px;
        }
        .upload-wrap #imgUpload{
            position: absolute;
            left: 0;
            top: 0;
            font-size:0;
            width: 98px;
            height: 40px;
            opacity: 0;
            cursor: pointer;
        }
    </style>
@endsection

@section('content')
    <div class="content-wrap" id="integral-create" v-cloak>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" class="demo-ruleForm">
            <el-form-item label="活动名称" prop="title">
                <el-input v-model="ruleForm.title" placeholder="请输入活动名称" style="width:380px" maxlength="15" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="活动有效期" prop="date">
                <el-date-picker
                    style="width:380px"
                    type="datetimerange"
                    v-model="ruleForm.date"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :default-time="['00:00:00','23:59:59']"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="活动图片URL" prop="img_url">
                <div style="display:flex;">
                    <el-input v-model="ruleForm.img_url" disabled placeholder="请上传图片生成URL，图片不得超过2M" style="width:380px"></el-input>
                    <div class="upload-wrap">
                        <el-button type="primary">点击上传</el-button>
                        <input type="file" @change="uploadImage" id="imgUpload" name="file" accept="image/png,image/jpeg">
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="积分类型" prop="points">
                固定积分  积 <el-input v-model="ruleForm.points" oninput="value=value.replace(/[^0-9]/g,'')" style="width:80px"></el-input> 分
            </el-form-item>
            <el-form-item>
                <!-- <el-button @click="submitForm('ruleForm')">取 消</el-button> -->
                <el-button type="primary" :disabled="!submitAble" @click="submitForm('ruleForm')">保 存</el-button>
            </el-form-item>
            <el-form-item label="活动链接" v-if="activeUrl">
                <div style="display: flex;align-items: center;">
                    <span class="link">@{{activeUrl}}</span>
                    <el-link id="copy-code" type="success" :underline="false" :data-clipboard-text="activeUrl" @click="copyLink">复制链接</el-link>
                </div>
            </el-form-item>
            <el-form-item label="活动二维码" v-if="download_url">
                <div style="display: flex;align-items: flex-end;">
                    <div id="qrcode" style="margin-right:20px"></div>
                    <el-link type="success" :underline="false" download :href="download_url">下载二维码</el-link>
                </div>
            </el-form-item>
        </el-form>
    </div>
@endsection

@section('footer')
    <script src="/js/common/clipboard.min.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/jquery.qrcode.min.js?v={{config('constants.wcc_file_version')}}"></script>
    <script type="text/javascript" src="/js/wcc-element-ui/vue.js?v={{config('constants.wcc_file_version')}}"></script>
    <script type="text/javascript" src="/js/wcc-element-ui/index.js?v={{config('constants.wcc_file_version')}}"></script>
    <script type="text/javascript">
      $(function () {
        new Vue({
          el: '#integral-create',
          data() {
              return{
                  id:"",//修改id
                  submitAble:true,//标志能提交
                ruleForm:{
                    title:"",
                    date:"",
                    points:"",
                    img_url:""
                },
                rules:{
                    title:[
                        {required:true,message:"请输入活动名称",trigger:"blur"}
                    ],
                    date:[
                        {required:true,message:"请选择活动有效期",trigger:"change"}
                    ],
                    img_url:[
                        {required:true,message:"请上传图片",trigger:"change"}
                    ],
                    points:[
                        {required:true,message:"请输入积分",trigger:"blur"}
                    ]
                },
                activeUrl:"",//活动链接
                download_url:"",//二维码下载
              }
          },
          async mounted() {
              this.id = this.getQueryVariable("id");
              if(this.id){
                let res = await this.pointsPartyDetails();
                let {status,info,data} = res;
                if(status == 200){
                    this.ruleForm.title = data.title;
                    this.ruleForm.date = [data.sdate,data.etime];
                    this.ruleForm.img_url = data.img_url;
                    this.ruleForm.points = data.points;
                    this.activeUrl = data.act_url;
                    this.download_url = data.download_url;
                }else{
                    this.$message.error(info);
                }
                this.$nextTick(()=>{
                    $("#qrcode").html("");
                    $("#qrcode").qrcode({
                        width: 200, //宽度
                        height:200, //高度
                        text: this.activeUrl //任意内容
                    })
                })
              }
          },
          methods: {
              //获取URL参数
                getQueryVariable(variable){
                    var query = window.location.search.substring(1);
                    var vars = query.split("&");
                    for (var i=0;i<vars.length;i++) {
                            var pair = vars[i].split("=");
                            if(pair[0] == variable){return pair[1];}
                    }
                    return(false);
                },
                //查看详情
                pointsPartyDetails(){
                    return  this.ajax('post', '/IntegralAct/pointsPartyDetails', {
                        id:this.id
                    })
                },
                //复制链接
                copyLink(){
                    let clipboard = new ClipboardJS("#copy-code");
                    clipboard.on("success", (e) => {
                        this.$message.success("复制成功");
                        // 释放内存
                        clipboard.destroy();
                    });
                    clipboard.on("error", (e) => {
                        // 不支持复制
                        this.$message.error("该浏览器不支持自动复制");
                        // 释放内存
                        clipboard.destroy();
                    });
                },
                //保存
                submitForm(formName){
                    this.$refs[formName].validate(async (valid) => {
                        if (valid) {
                            this.submitAble = false;
                            let params = {};
                            params.title = this.ruleForm.title;
                            params.points = this.ruleForm.points;
                            params.img_url = this.ruleForm.img_url;
                            params.sdate = this.ruleForm.date[0];
                            params.edate = this.ruleForm.date[1];
                            //修改加上id参数
                            if(this.id){
                                params.id = this.id;
                            }
                            let res = null;
                            if(this.id){
                                res = await this.editPointsParty(params);
                            }else{
                                res = await this.addPointsParty(params);
                            }
                            this.submitAble = true;
                            let {status,info,data} = res;
                            if(status == 200){
                                this.$message.success("操作成功！");
                                this.activeUrl = data.url;
                                this.download_url = data.download_url;
                                this.$nextTick(() => {
                                    $("#qrcode").html("");
                                    $("#qrcode").qrcode({
                                        width: 200, //宽度
                                        height:200, //高度
                                        text: data.url, //任意内容
                                    })
                                })
                            }else{
                                this.$message.error(info);
                            }
                        } else {
                            console.log('error submit!!');
                            return false;
                        }
                    });
                },
                addPointsParty(params) {
                    return this.ajax('post', '/IntegralAct/addPointsParty', params);
                },
                editPointsParty(params) {
                    return this.ajax('post', '/IntegralAct/editPointsParty', params);
                },

                //上传图片
                uploadImage () {
                    var that = this;
                    var imgUrl = '';
                    var fd = new FormData();
                    var file = $("#imgUpload")[0].files[0];
                    if ( file != undefined ) {
                        if(file.size > 2*1024*1024){
                            layer.msg('图片太大,请重新上传');
                            return;
                        }
                        fd.append('file', file);
                        if ( file ) {
                            layer.msg('图片上传中');
                        }
                        $.ajax({
                            url: '/Img/uploadDZPImgToUpyun',
                            method : 'post',
                            async : false,
                            contentType : false,
                            processData : false,
                            data: fd,
                            dataType: 'json',
                            success: function (data) {
                                layer.closeAll();
                                if ( 200 == data.status ) {
                                    layer.msg('上传成功！');
                                    that.ruleForm.img_url = data.img;
                                }else {
                                    layer.alert(data.info)
                                }
                            },
                            error : function () {
                                layer.closeAll();
                                layer.alert('网络错误，请稍候重试！');
                            }
                        });
                    }
                },
                //封装请求
                ajax(method, url, data) {
                    return new Promise((resolve, reject) => {
                        $.ajax({
                        type: method,
                        url: url,
                        dataType: "json",
                        data: data,
                        success(res) {
                            resolve(res)
                        },
                        error(err) {
                            reject(err)
                            console.log("request—error")
                        }
                        })
                    })
                }
          }
        })
      })
    </script>
@endsection
