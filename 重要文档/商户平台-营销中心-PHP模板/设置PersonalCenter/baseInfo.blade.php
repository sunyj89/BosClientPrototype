@extends('layout/master')


@section('header')
    <link rel="stylesheet" href="/js/vendor/bootstrap/css/bootstrap.min.css?v={{config('constants.wcc_file_version')}}">
    <link rel="stylesheet" href="/css/common/common.css?v={{config('constants.wcc_file_version')}}" />
    <link rel="stylesheet" href="/css/Setting/baseInfo.css?v={{config('constants.wcc_file_version')}}" />

@endsection

@section('content')
<div class="clear-fix"></div>

<div class="page-body" id="app">
	<div class="tab-content">
		<div class="tab-pane active" id="baseInfo">

            <input type="hidden" name="out">
            <input type="hidden" name="store">
            <input type="hidden" name="toilet">
            <input type="hidden" name="oil">
            <input type="hidden" name="repair">
            <input type="hidden" name="wash">
            <input type="hidden" name="ad">

            <table style="text-align: left;" class="station_info">
                <tr>
                    <td>油站名称：</td>
                    <td>{{ $base_info->stname }}</td>
                </tr>
                {{--<tr>--}}
                    {{--<td>所属品牌：</td>--}}
                    {{--<td>--}}
                        {{--<span>--}}
                            {{--{{ $base_info->type }}--}}
                        {{--</span>--}}
                        {{--@if($base_info->type_img)--}}
                            {{--<img src="{{ $base_info->type_img }}" alt="品牌Logo" width="30">--}}
                        {{--@endif--}}
                    {{--</td>--}}
                {{--</tr>--}}
                <tr>
                    <td>所属城市：</td>
                    <td>
                        <div id="element_id">
                            <form class="form-inline">
                                <select class="province form-control" data-value="{{ $base_info->province }}" data-orig_province="{{ $base_info->province }}"></select>
                                @if (strpos($base_info->province, '市'))
                                    <select class="city form-control" data-value="{{ $base_info->district }}" data-orig_city="{{ $base_info->district }}"></select>
                                @else
                                    <select class="city form-control" data-value="{{ $base_info->city }}" data-orig_city="{{ $base_info->city }}"></select>
                                @endif
                            </form>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>油站地址：</td>
                    <td>
                        <input type="text" class="form-control" name="address" data-orig_address="{{ $base_info->address }}" value="{{ $base_info->address }}">
                    </td>
                </tr>
                <tr>
                    <td>油站电话：</td>
                    <td>
                        <input type="text" maxlength="13" class="form-control phone" name="phone" data-orig_phone="{{ $base_info->phone }}" value="{{ $base_info->phone }}">
                    </td>
                </tr>
               
            </table>

            
            <div class="content-block">
                <h5 class="content-title">油站logo：</h5>
                <div class="content-area">
                <el-upload
							class="logo-uploader"
							action="/Img/uploadActivityImgToUpyun"
							:show-file-list="false"
							:on-success="(res)=>{ return backgroundAvatarSuccess(res,'logo')}"
							:before-upload="beforeAvatarUpload">
							<img v-if="uploader.logo"  :src="uploader.logo" class="avatar">
							<i  v-else class="el-icon-plus avatar-uploader-icon"></i>
							<div slot="tip" class="el-upload__tip">建议尺寸100*100px，比例为1:1，格式png、jpg，20kb以内</div>
						</el-upload>
                  </div>
            </div>

            <?php
                $getTypeInfo = function($type) use ($img_info) {
                    return \App\Model\StationAlbum::getTypeInfoByResult($img_info, $type);
                };
                $outInfo = $getTypeInfo(\App\Model\StationAlbum::TYPE_OUT_LOCATION);    // 外景
                $store   = $getTypeInfo(\App\Model\StationAlbum::TYPE_STORE);           // 便利店
                $toilet  = $getTypeInfo(\App\Model\StationAlbum::TYPE_TOILET);          // 卫生间
                $oilInfo = $getTypeInfo(\App\Model\StationAlbum::TYPE_OIL);             // 挂牌油价
                $repair  = $getTypeInfo(\App\Model\StationAlbum::TYPE_REPAIR);          // 维修店
                $wash    = $getTypeInfo(\App\Model\StationAlbum::TYPE_WASH);            // 洗车店
                $adView  = $getTypeInfo(\App\Model\StationAlbum::TYPE_AD);              // 广告页
                //当值不存在的时候赋值一个空的变量
                if (empty($outInfo->imgurl)){
                    $outInfo = new stdClass();
                    $outInfo->imgurl = '';
                }
            ?>

            <div v-if="0" class="img-block out-location require">
                        @if ($outInfo)
                            <a href="{{ $outInfo->imgurl }}" target="_blank">
                                <img src="{{ $outInfo->imgurl }}" alt="外景">
                                <span class="btn btn-primary fileinput-button">
                                    <span>上传</span>
                                    <input type="file" id="fileupload" accept="image/png,image/gif,image/jpeg,image/bmp" name="file" multiple>
                                </span>
                            </a>
                        @else
                            <a href="javascript:void(0);" target="_blank" class="no-img">
                                <img src="" alt="外景图">
                                <span class="btn btn-primary fileinput-button">
                                    <span>上传</span>
                                    <input type="file" id="fileupload" accept="image/png,image/gif,image/jpeg,image/bmp" name="file" multiple>
                                </span>
                            </a>
                        @endif
                        <p>
                            外景图(必拍)
                        </p>
                    </div>
            <div class="content-block">
                <h5 class="content-title">油站详情图：</h5>
                <div class="content-area">
                <el-upload
							class="avatar-uploader"
							action="/Img/uploadActivityImgToUpyun"
							:show-file-list="false"
							:on-success="(res)=>{ return backgroundAvatarSuccess(res,'detail')}"
							:before-upload="beforeAvatarUpload">
							<img v-if="uploader.detail"  :src="uploader.detail" class="avatar">
							<i  v-else class="el-icon-plus avatar-uploader-icon"></i>
							<div slot="tip" class="el-upload__tip">建议尺寸750*322px，比例为21:9，格式png、jpg，200kb以内</div>
						</el-upload>
                    
                    
                   
                </div>
            </div>
            <div class="content-block" >
                <h5 class="content-title">优惠促销信息</h5>
                <el-form ref="form"  label-width="80px">
                    <el-form-item :label="'优惠'+(index+1)" style="text-align:left" v-for="(item,index) in infoList" :key="index">
                        <el-input style="width:500px" v-model="item.value"></el-input> 
                        <el-button type="text" @click="addInfo" v-if="index==0">添加</el-button> 
                        <el-button type="text" @click="delInfo(index)">删除</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <div class="content-block">
                <h5 class="content-title">燃油进货凭证</h5>
                <div class="content-area">
                    @if($cert_info)
                        @foreach($cert_info as $key => $item)
                            <div class="img-cert img-cert-info{{ $key }} cert-info" data-cert_id="{{ $item->cert_rid}}">
                                <a href="{{ $item->imgurl }}" class="a-block" target="_blank">
                                    <i class="glyphicon glyphicon-trash" data-cert-info="img-cert-info{{ $key }}" data-cert_id="{{ $item->cert_rid}}"></i>
                                    <img src="{{ $item->imgurl }}" alt="燃油进货凭证">
                                    <span class="btn btn-primary fileinput-button">
                                        <span>上传</span>
                                        <input type="file" id="fileupload" accept="image/png,image/gif,image/jpeg,image/bmp" name="file" multiple>
                                    </span>
                                </a>
                            </div>
                            <input type="hidden" name="img-cert-info{{ $key }}" class="cert-input-link" data-cert_id="{{ $item->cert_rid}}">
                        @endforeach
                    @endif

                    <div class="img-cert img-add">
                        <a href="javascript:void(0);" target="_blank" class="no-img">
                        </a>
                    </div>

                    <div class="clear-fix"></div>
                </div>
            </div>

         
            

            <hr>
            

			@if($products)
                <hr>
                <div class="content-block">
                    <h5 class="content-title">团购信息</h5>
                    <div class="content-area">
                        <table class="table table-striped">
                            <tr>
                                <th>加油站名称</th>
                                <th>类型</th>
                                <th>券名</th>
                                <th>现价</th>
                            </tr>
                            @foreach ($products as $p)
                            <tr>
                                <td>
                                    {{$base_info->stname}}
                                </td>
                                <td>
                                    {{$p->oiltype}}
                                </td>
                                <td>
                                    {{$p->spname}}
                                </td>
                                <td>
                                    &yen;{{$p->currprice}}
                                </td>
                            </tr>
                            @endforeach
                        </table>
                    </div>
                </div>
			@endif

            @if($base_info->show_promotion)
            <div class="content-block">
                <h5 class="content-title">加油卡信息配置</h5>
                <div class="set-title" style="display: flex;align-items: center;margin-bottom: 10px;">
                    <span style="width: 100px;">功能名称：</span>
                    <input class="form-control function-name" value="{{ $base_info->promotion->title }}" type="text" placeholder="请输入功能名称">
                </div>
                <div class="set-title" style="display: flex;align-items: center;">
                    <span style="width: 100px;">功能说明：</span>
                    <textarea class="form-control text-area function-text" type="textarea" placeholder="请输入200个字以内的功能说明">{{ $base_info->promotion->desc }}</textarea>
                </div>
            </div>
            @endif
		</div>
	</div>
    <button class="btn btn-success save_submit" style="margin-bottom: 15px; background: #15b374;">保存并提交</button>
	<div class="clear-fix"></div>
</div>
@endsection

@section('footer')

    <script src="/js/vendor/jquery.cxselect.min.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/Setting/baseInfo.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/vue_component.js?v={{config('constants.wcc_file_version')}}"></script>
    <script>
    var  discount_info = "{{$discount_info}}";
    var detail = "{{$outInfo->imgurl}}";
    console.log(detail)
    var brands = "{{ $brands }}";
    console.log(brands)

	var VM = new Vue({
		el: '#app',
		data() {
			return {
				selectIcon:"/img/personalCenter/icon_add.png",
                uploader:{
                    logo:brands,
                    detail:detail,
                },
                infoList:[]


			}
		},
        mounted(){
            let discountList = discount_info.split("|");
            this.infoList = [];
            discountList.forEach((item)=>{
                this.infoList.push({"value":item})
            })
            
        },
        created() {
            

        },
		methods: {
            addInfo(){
                this.infoList.push({"value":""})
            },

            delInfo(index){
                this.infoList.splice(index,1); 
            },



			

			handleAvatarSuccess(res, file) {
				console.log(res)
				console.log(file)
				if(res.status==200){
					this.bannerForm.image = res.img;
					this.$forceUpdate();
				}else{
					this.$message.error('上传失败，请重试！');
				}
				
			},
			handleIconSuccess(res, file) {
				console.log(res)
				console.log(file)
				if(res.status==200){
					this.uploadIcon = res.img;
					this.carIconIndex = -2;
					this.form.icon = res.img;
					this.isShowIconList = false;
					this.$forceUpdate();
				

				}else{
					this.$message.error('上传失败，请重试！');
				}
				
			},
			backgroundAvatarSuccess(res, item) {
				console.log(res)
				console.log(item)
				if(res.status==200){
                    this.uploader[item] = res.img;
					//item.config.background.url = res.img;
					this.$forceUpdate();
				}else{
					this.$message.error('上传失败，请重试！');
				}
				
			},
			beforeAvatarUpload(file) {
				const isLt2M = file.size / 1024 / 1024 / 1024 < 200;
				if (!isLt2M) {
					this.$message.error('上传banner图片大小不能超过 200K!');
				}
				return isLt2M;
			},


			
            

            

			


			
        },
        
	})
	</script>
@endsection