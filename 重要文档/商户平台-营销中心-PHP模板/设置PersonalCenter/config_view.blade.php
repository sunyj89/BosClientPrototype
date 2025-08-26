@extends('layout/master')

@section('header')
	<link rel="stylesheet" type="text/css" href="/css/wcc.css">
	<link rel="stylesheet" type="text/css" href="/css/personalCenter/index.css">
	<script src="/js/sortable.js?v={{config('constants.wcc_file_version')}}"></script>
	<script src="/js/vuedraggable.js?v={{config('constants.wcc_file_version')}}"></script>

@endsection

@section('content')

    <div class="layout" id="app" v-cloak>
		<div class="phone-personal">
			<div class="phone-box">


				<!---新版-->
			
				<div class="newPerson">
					<div class="header">
						<div class="headerInfo">
							<div class="headerInfo_name">
								<img src="https://fs1.weicheche.cn/wechat_public/icon_head.png" class="headerInfo_nameHead">
								
								<span v-if="isShowPhone==1">138****8888</span>
								<span v-else>13888888888</span>
								
							</div>
							<div class="headerInfo_phone">@{{oil.name}} </div>
							
						</div>

						<div class="headerInfo_btn" >签到</div>
					</div>

					<div class="personInfo">
						
						<div class="personInfo_item">
							<div class="personInfo_item_name" >6265</div>
							<div class="personInfo_item_num">积分</div>
							<span class="personInfo_item_line"></span>
						</div>
						<div class="personInfo_item" >
							<div class="personInfo_item_name" >¥100</div>
							<div class="personInfo_item_num">加油卡余额</div>
							<span class="personInfo_item_line"></span>
						</div>
						<div class="personInfo_item">
							<div class="personInfo_item_name"><img class="personInfo_item_code" src="https://fs1.weicheche.cn/wechat_public/icon_user_code.png" alt=""></div>
							<div class="personInfo_item_num">会员码</div>
						</div>
					</div>


					<div  class="newSwiper">
						<!--背景图片-->
						<el-carousel trigger="click" height="128px" arrow="always" :autoplay="false"  indicator-position="none" @change="changeCarouse" ref="carousel">
						<el-carousel-item v-for="(item, index) in cardSetting" :key="index">
							<!--背景图片-->
							<img v-if="item.config.background.type==0" :src="getCardListById(item.sort).card" alt="">
							<img class="swiperImg" v-else-if="item.config.background.type==2"  :src="item.config.background.url" alt="">
							<div class="cardBg"  v-else :style="{'background-color':item.config.background.value}"></div>

							<div class="newVip-icon"  >
								<img  src="https://fs1.weicheche.cn/wechat_public/icon_vip.png" >
								<span :style="{'color':item.config.font.value}">@{{activeName}}</span>
							</div>

							<div class="newVip-btn"  >
								<img  src="https://fs1.weicheche.cn/wechat_public/btn_vip.png" >
							</div>

							<div class="newVip-info" :style="{'color':item.config.font.value}" >
								尊享专属会员优惠
							</div>
							</el-carousel-item>
					</el-carousel>
					</div>

				</div>

				

				<!--卡组显示-->
				<div class="swiper" v-if="0">
					<el-carousel trigger="click" height="128px" arrow="always" :autoplay="false"  indicator-position="none" @change="changeCarouse" ref="carousel">
						<el-carousel-item v-for="(item, index) in cardSetting" :key="index">
							<!--背景图片-->
							<img v-if="item.config.background.type==0" :src="getCardListById(item.sort).card" alt="">
							<img v-else-if="item.config.background.type==2"  :src="item.config.background.url" alt="">
							<div class="cardBg"  v-else :style="{'background-color':item.config.background.value}"></div>


							<div class="vip-phone" :style="{'color':item.config.font.value}">188****8888</div>
							<div class="vip-icon" v-if="getCardListById(item.sort).icon" >
								<img  :src="getCardListById(item.sort).icon" >
								<span>@{{cardSetting[index].level_name}}</span>
							</div>
							<div class="vip-QRcode">
								<img v-if="item.config.qrcode.type==0" :src="cardVIPQRcode[0]" alt="">
								<img v-else :src="cardVIPQRcode[1]" alt="">
							</div>
							<div class="vip-info" :style="{'color':item.config.font.value}">
								<div class="integral">积分：<span>8888</span></div>
								<div class="balance">余额：<span>888.00元</span></div>
							</div>
							<div class="vip-btn-sign" :style="{'background':item.config.signin.background,'color':item.config.signin.font,'display':item.config.signin.isvalid?'block':'none'}">签到</div>
						</el-carousel-item>
					</el-carousel>
				</div>

				<!--ICON-->
				<ul class="icon-list">
					<draggable v-model="gridData"  :component-data="getComponentData()">
						<li v-for="(item, index) in gridData" v-if="item.isvalid" :key="index">
							<img :src="item.icon" alt=""/>
							<span>@{{item.name}}</span>
							<span class="remark">@{{item.remark || ""}}</span>
						</li>
					</draggable>
				</ul>
		
				<!--BANNER-->
				<div class="banner">
					<el-carousel class="banner-list" autoplay="true"  height="99px" :autoplay="true"  indicator-position="none" >
						<el-carousel-item v-for="(item,index) in bannerData" :key="index">
							<img :title="item.name" :src="item.image"/>
						</el-carousel-item>
					</el-carousel>
				</div>
			</div>

		</div>

        <div class="vip-setting">
			<div class="vip-title">会员卡设置</div>
			<el-tabs type="border-card" v-model="activeName" @tab-click="handleClick" :style="{width: '670px'}">
				<el-tab-pane :label="item.level_name" :name="item.level_name" v-for="(item, index) in cardSetting" :key="index">

					<div class="setting-cell">
						<div class="setting-title">卡背景设置</div>
						<el-radio-group v-model="item.config.background.type" @change="changeType" fill="#32AF50" text-color="#ffffff">
							<el-radio :label="0">默认</el-radio>
							<el-radio :label="1">自定义背景色 
								<div class="set-bg-color"  v-if="item.config.background.type == 1">
									<el-color-picker class="set-bg-picker" v-model="item.config.background.value" @change="changeType"></el-color-picker>
								</div>
							</el-radio>
							<el-radio :label="2">自定义背景图片</el-radio>
						</el-radio-group>
					</div>
			
					<!-- 自定义背景图片 -->
					<div class="set-bg-img" v-if="item.config.background.type == 2">
						<el-upload
							class="avatar-uploader"
							action="/Img/uploadActivityImgToUpyun"
							:show-file-list="false"
							:on-success="(res)=>{ return backgroundAvatarSuccess(res,item)}"
							:before-upload="beforeAvatarUpload">
							<img v-if="item.config.background.url && item.config.background.url.indexOf('http') >=0 "  :src="item.config.background.url" class="avatar">
							<i  v-else class="el-icon-plus avatar-uploader-icon"></i>
							<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过200kb，图片尺寸为670*266像素</div>
						</el-upload>
					</div>
					<div class="setting-cell" v-if="0">
						<div class="setting-title">卡字体颜色</div>
						<el-radio-group v-model="item.config.font.type" @change="changeType(item,'font')" fill="#32AF50" text-color="#ffffff">
							<el-radio :label="0">默认</el-radio>
							<el-radio :label="1">自定义</el-radio>
						</el-radio-group>
						<div class="set-font-color" v-if="item.config.font.type == 1">
							<el-color-picker v-model="item.config.font.value" @change="changeType"></el-color-picker>
						</div>
					</div>
					<div class="setting-cell" v-if="0">
						<div class="setting-title">二维码颜色</div>
						<el-radio-group v-model="item.config.qrcode.type" @change="changeType" fill="#32AF50" text-color="#000000">
							<el-radio :label="0">白色</el-radio>
							<el-radio :label="1">黑色</el-radio>
						</el-radio-group>
					</div>
					
				
					<div class="setting-cell" v-if="0">
						<div class="setting-title sign-in-title">签到按钮颜色</div>
						<el-radio-group v-model="item.config.signin.backgroundValue" @change="changeType(item,'signinBackground')" fill="#32AF50" text-color="#ffffff">
							<el-radio :label="0">默认</el-radio>
							<el-radio :label="1">自定义</el-radio>
						</el-radio-group>
						<div class="set-font-color" v-if="item.config.signin.backgroundValue=='1'">
							<el-color-picker v-model="item.config.signin.background" @change="changeType"></el-color-picker>
						</div>
					</div>
					<div class="setting-cell" v-if="0">
						<div class="setting-title sign-in-title">签到字体颜色</div>
						<el-radio-group v-model="item.config.signin.fontValue" @change="changeType(item,'signinFont')" fill="#32AF50" text-color="#ffffff">
							<el-radio :label="0">默认</el-radio>
							<el-radio :label="1">自定义</el-radio>
						</el-radio-group>
						<div class="set-font-color" v-if="item.config.signin.fontValue=='1'">
							<el-color-picker v-model="item.config.signin.font" @change="changeType"></el-color-picker>
						</div>
					</div>
					
				</el-tab-pane>
			</el-tabs>
			<div class="set-btn setting-icon">
				<div class="vip-title">手机号显示</div>
				<el-radio-group v-model="isShowPhone" fill="#32AF50" @change="changeShowPhone" text-color="#ffffff">
					<el-radio label="0">全部显示</el-radio>
					<el-radio label="1">隐藏中间4位</el-radio>
				</el-radio-group>
			</div>
			<div class="set-btn setting-icon">
				<div class="vip-title">九宫格</div>
				<el-button type="primary" plain  @click="dialogTableVisible = true">设置九宫格</el-button>
				<span>鼠标拖动九宫格内容可调整图标顺序</span>
			</div>
			<div class="set-btn setting-banner">
				<div class="vip-title">banner</div>
				<el-button type="primary" plain @click="dialogBannerVisible = true">设置banner</el-button>
			</div>
			<div class="confirm-btn">
				<el-button type="primary" @click="ajaxSubmit">保存</el-button>
				<el-button plain>取消</el-button>
			</div>
		</div>




		<!-- 九宫格弹窗 -->
		<el-dialog title="九宫格" append-to-body :close-on-click-modal="false" width="1220px" :visible.sync="dialogTableVisible">
			<el-button type="primary" @click="addCarIncon">新增</el-button>
			<el-table :data="gridData">
				<el-table-column property="name" label="名字" width="160"></el-table-column>
				<el-table-column property="remark" label="备注" width="160">
					<template   slot-scope="scope">            
						<span>@{{scope.row.remark || " "}}</span>
					</template>
				</el-table-column>
				<el-table-column property="icon" label="图标" width="100">
					<template   slot-scope="scope">            
						<img :src="scope.row.icon"  min-width="37" height="37" />
					</template>
				</el-table-column>
				<el-table-column property="link" label="链接地址" width="400">
						<template   slot-scope="scope">            
							<div v-if="!scope.row.isDisable">
								@{{scope.row.link}}
							</div>
							<div v-else>
								系统指定
							</div>
						</template>
				</el-table-column>
				<el-table-column property="isvalid" label="是否启用" width="100">
					<template   slot-scope="scope">            
						<el-switch v-if="!scope.row.isDisable"  @change="changeType" v-model="scope.row.isvalid"  active-color="#13ce66" inactive-color="#d1d1d1">
						</el-switch>
						<div v-else>
							默认启用
						</div>
					</template>
				</el-table-column>
				<el-table-column property="address" label="排序" width="100">
					<template slot-scope="scope">
						<i class="el-icon-top" v-show="scope.$index!=0" @click="upMove(scope.$index)"></i>
						<i class="el-icon-bottom" v-show="scope.$index!=gridData.length-1" @click="downMove(scope.$index)"></i>
					</template>
				</el-table-column>
				<el-table-column property="address" label="操作" width="160">
					<template  slot-scope="scope">
						<el-button type="text" @click="eidtCarIncon(scope.$index)">编辑</el-button>
						<el-button v-if="!scope.row.isDisable" type="text" @click="removeCarIcon(scope.$index)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-dialog>



		<el-dialog :title="title" append-to-body width="800px" height="500px" :close-on-click-modal="false"  :visible.sync="dialogFormVisible">
			<el-form :model="form">
				<el-form-item label="标题" :label-width="formLabelWidth">
					<div style="width:300px">
						<el-input v-if="group_id==1 || group_id==1870 || group_id==1895"	type="text"	placeholder="请输入内容" v-model="form.name"	maxlength="25" show-word-limit></el-input>
						<el-input v-else type="text" placeholder="请输入内容" v-model="form.name" maxlength="6" show-word-limit></el-input>
					</div>
				</el-form-item>
		
				<el-form-item label="备注" :label-width="formLabelWidth">
					<div style="width:300px">
						<el-input	type="text"	placeholder="请输入备注"	v-model="form.remark"	maxlength="8"
								show-word-limit	>
					</div>
				</el-form-item>

			<el-form-item label="图标" :label-width="formLabelWidth">
				<span class="selectIconBox">
					<img v-if="carIconIndex>=-1" :src="selectIcon" @click="showIconList"> 
					<img v-else :src="uploadIcon" @click="showIconList"> 
						
					<ul  class="iconList" v-show="isShowIconList">
						
						<li :class="carIconIndex==index?'on':'' " @click="selectCarIcon(index,item)" v-for="(item,index) in carIcon">
							<img :src="item.pic">
						</li>
						<li class="uploadBox">
							<el-upload
								class="avatar-uploader"
								action="/Img/uploadActivityImgToUpyun"
								:show-file-list="false"
								:on-success="handleIconSuccess"
								:before-upload="beforeAvatarUpload">
								<i  class="el-icon-plus icon-uploader-icon"></i>
							</el-upload>
						</li>
					</ul>
					
				</span>
				<a v-if="isEdit" class="btn_rest" @click="restIcon">恢复默认</a>
			</el-form-item>
			<el-form-item label="链接地址" :label-width="formLabelWidth">
				<div style="width:300px">
					<el-input :disabled="form.isDisable"  v-model="form.link"  autocomplete="off"></el-input>
				</div>
			</el-form-item>
				
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="createIcon">确 定</el-button>
			</div>
		</el-dialog>




		<!-- 九宫格弹窗 -->
		<el-dialog title="banner" append-to-body width="1060px" :close-on-click-modal="false" :visible.sync="dialogBannerVisible">
			<el-button type="primary" @click="addBanner">新增</el-button>
			<el-table :data="bannerData">
				<el-table-column property="name" label="标题" width="250"></el-table-column>
				<el-table-column property="image" label="图片">
					<template   slot-scope="scope">            
						<img :src="scope.row.image"  min-width="37" height="37" />
					</template>
				</el-table-column>
				<el-table-column property="link" label="链接地址" width="250"></el-table-column>
				<el-table-column property="isvalid" label="是否启用">
					<template   slot-scope="scope">            
						<el-switch  v-model="scope.row.isvalid"  @change="changeType"  active-color="#13ce66" inactive-color="#d1d1d1">
						</el-switch>
					
					</template>
				</el-table-column>
				<el-table-column property="address" label="排序">
					<template slot-scope="scope">
						<i class="el-icon-top" v-show="scope.$index!=0" @click="upBannerMove(scope.$index)"></i>
						<i class="el-icon-bottom" v-show="scope.$index!=bannerData.length-1" @click="downBannerMove(scope.$index)"></i>
					</template>
				</el-table-column>
				<el-table-column property="address" label="操作">
					<template v-if="!scope.row.isDisable" slot-scope="scope">
						<el-button type="text" @click="eidtBanner(scope.$index)">编辑</el-button>
						<el-button type="text" @click="removeBanner(scope.$index)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-dialog>


		<el-dialog :title="bannerTitle" append-to-body  width="800px"  :close-on-click-modal="false"  :visible.sync="dialogAddBannerVisible">
			<el-form :model="bannerForm">
				<el-form-item label="标题" :label-width="formLabelWidth">
					<div style="width:300px">
					
						<el-input	type="text"	placeholder="请输入标题"	v-model="bannerForm.name"	maxlength="12"
							show-word-limit	>
					</div>
					
				</el-form-item>
			
				<el-form-item label="图片" :label-width="formLabelWidth">
					<div >
					<el-upload
						class="avatar-uploader"
						action="/Img/uploadActivityImgToUpyun"
						:show-file-list="false"
						accept=".jpg, .png"
						:on-success="handleAvatarSuccess"
						:before-upload="beforeAvatarUpload">
						<img v-if="bannerForm.image"  :src="bannerForm.image" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过200kb，图片尺寸为670*204像素</div>
					</div>
					
				</el-form-item>
				
				<el-form-item label="链接地址" :label-width="formLabelWidth">
					<div style="width:300px">
						<el-input placeholder="请输入链接地址" v-model="bannerForm.link">
						</el-input>
					</div>
				</el-form-item>
				
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogAddBannerVisible = false">取 消</el-button>
				<el-button type="primary" @click="createBanner">确 定</el-button>
			</div>
		</el-dialog>



	</div>

@endsection

@section('footer')
	<script>

	new Vue({
		el: '#app',
		data() {
			return {
				group_id:'{{$group_id}}',
				oil:{
					icon:"https://fs1.weicheche.cn/wechat_public/icon_head.png",
					name:"用户名"
				},
				gridData: [],
				tabIcon:["选择","上传"],
				tabIndex:0,
				bannerData:[],
				activeName: 'silver',
				title:"新建宫格",
				isEdit:false,
				editIndex:-1,
				bannerTitle:"新建banner",
				isBannerEdit:false,
				editBannerIndex:-1,
				cardSetting: [],
				cardList:[
					{
						id:"1",
						card:"/img/personalCenter/card_vip1.png",
						icon:"/img/personalCenter/icon_vip1.png",
					},
					{
						id:"2",
						card:"/img/personalCenter/card_vip2.png",
						icon:"/img/personalCenter/icon_vip2.png",
					},
					{
						id:"3",
						card:"/img/personalCenter/card_vip3.png",
						icon:"/img/personalCenter/icon_vip3.png",
					},
					{
						id:"4",
						card:"/img/personalCenter/card_vip4.png",
						icon:"/img/personalCenter/icon_vip4.png",
					},
					{
						id:"5",
						card:"/img/personalCenter/card_vip5.png",
						icon:"/img/personalCenter/icon_vip5.png",
					},
					{
						id:"6",
						card:"/img/personalCenter/card_vip6.png",
						icon:"/img/personalCenter/icon_vip6.png",
					},
				],
				defaultCardVIP:{
					id:"default",
					card:"/img/personalCenter/card_default.png",
					icon:"",
				},

				cardVIPQRcode: [
					'/img/personalCenter/icon_code_white.png',
					'/img/personalCenter/icon_code_black.png',
				],
				carIcon: [
					{ name: '加油卡', pic: '/img/personalCenter/icon_card.png' },
					{ name: '加油卡', pic: '/img/personalCenter/icon_card1.png' },
					{ name: '加油卡', pic: '/img/personalCenter/icon_card2.png' },
					{ name: '加油卡', pic: '/img/personalCenter/icon_card3.png' },
					{ name: '加油卡', pic: '/img/personalCenter/icon_card4.png' },

					{ name: '优惠券', pic: '/img/personalCenter/icon_coupon.png' },
					{ name: '优惠券', pic: '/img/personalCenter/icon_coupon1.png' },
					{ name: '优惠券', pic: '/img/personalCenter/icon_coupon2.png' },
					{ name: '优惠券', pic: '/img/personalCenter/icon_coupon3.png' },
					{ name: '优惠券', pic: '/img/personalCenter/icon_coupon4.png' },

					{ name: '积分商城', pic: '/img/personalCenter/icon_store.png' },
					{ name: '积分商城', pic: '/img/personalCenter/icon_store1.png' },
					{ name: '积分商城', pic: '/img/personalCenter/icon_store2.png' },
					{ name: '积分商城', pic: '/img/personalCenter/icon_store3.png' },
					{ name: '积分商城', pic: '/img/personalCenter/icon_store4.png' },

					{ name: '邀请好友', pic: '/img/personalCenter/icon_invite.png' },
					{ name: '邀请好友', pic: '/img/personalCenter/icon_invite1.png' },
					{ name: '邀请好友', pic: '/img/personalCenter/icon_invite2.png' },
					{ name: '邀请好友', pic: '/img/personalCenter/icon_invite3.png' },
					{ name: '邀请好友', pic: '/img/personalCenter/icon_invite4.png' },

					{ name: '专属红包', pic: '/img/personalCenter/icon_hongbao.png' },
					{ name: '专属红包', pic: '/img/personalCenter/icon_hongbao1.png' },
					{ name: '专属红包', pic: '/img/personalCenter/icon_hongbao2.png' },
					{ name: '专属红包', pic: '/img/personalCenter/icon_hongbao3.png' },
					{ name: '专属红包', pic: '/img/personalCenter/icon_hongbao4.png' },

					{ name: '运营位置', pic: '/img/personalCenter/icon_yunying.png' },
					{ name: '运营位置', pic: '/img/personalCenter/icon_yunying1.png' },
					{ name: '运营位置', pic: '/img/personalCenter/icon_yunying2.png' },
					{ name: '运营位置', pic: '/img/personalCenter/icon_yunying3.png' },
					{ name: '运营位置', pic: '/img/personalCenter/icon_yunying4.png' },

					{ name: '消费记录', pic: '/img/personalCenter/icon_record.png' },
					{ name: '消费记录', pic: '/img/personalCenter/icon_record1.png' },
					{ name: '消费记录', pic: '/img/personalCenter/icon_record2.png' },
					{ name: '消费记录', pic: '/img/personalCenter/icon_record3.png' },
					{ name: '消费记录', pic: '/img/personalCenter/icon_record4.png' },

					{ name: '发票', pic: '/img/personalCenter/icon_invoice.png' },
					{ name: '发票', pic: '/img/personalCenter/icon_invoice1.png' },
					{ name: '发票', pic: '/img/personalCenter/icon_invoice2.png' },
					{ name: '发票', pic: '/img/personalCenter/icon_invoice3.png' },
					{ name: '发票', pic: '/img/personalCenter/icon_invoice4.png' },

					{ name: '设置', pic: '/img/personalCenter/icon_set.png' },
					{ name: '设置', pic: '/img/personalCenter/icon_set1.png' },
					{ name: '设置', pic: '/img/personalCenter/icon_set2.png' },
					{ name: '设置', pic: '/img/personalCenter/icon_set3.png' },
					{ name: '设置', pic: '/img/personalCenter/icon_set4.png' },

					{ name: '办卡优惠', pic: '/img/personalCenter/icon_banka.png' },
					{ name: '办卡优惠', pic: '/img/personalCenter/icon_banka1.png' },
					{ name: '办卡优惠', pic: '/img/personalCenter/icon_banka2.png' },
					{ name: '办卡优惠', pic: '/img/personalCenter/icon_banka3.png' },
					{ name: '办卡优惠', pic: '/img/personalCenter/icon_banka4.png' },

					{ name: '会员充值', pic: '/img/personalCenter/icon_chognzhi.png' },
					{ name: '会员充值', pic: '/img/personalCenter/icon_chognzhi1.png' },
					{ name: '会员充值', pic: '/img/personalCenter/icon_chognzhi2.png' },
					{ name: '会员充值', pic: '/img/personalCenter/icon_chognzhi3.png' },
					{ name: '会员充值', pic: '/img/personalCenter/icon_chognzhi4.png' },

					{ name: '储值', pic: '/img/personalCenter/icon_chuzhi.png' },
					{ name: '储值', pic: '/img/personalCenter/icon_chuzhi1.png' },
					{ name: '储值', pic: '/img/personalCenter/icon_chuzhi2.png' },
					{ name: '储值', pic: '/img/personalCenter/icon_chuzhi3.png' },
					{ name: '储值', pic: '/img/personalCenter/icon_chuzhi4.png' },

					{ name: '安装ETC', pic: '/img/personalCenter/icon_etc.png' },
					{ name: '安装ETC', pic: '/img/personalCenter/icon_etc1.png' },
					{ name: '安装ETC', pic: '/img/personalCenter/icon_etc2.png' },
					{ name: '安装ETC', pic: '/img/personalCenter/icon_etc3.png' },
					{ name: '安装ETC', pic: '/img/personalCenter/icon_etc4.png' },

					{ name: '介绍', pic: '/img/personalCenter/icon_jieshao.png' },
					{ name: '介绍', pic: '/img/personalCenter/icon_jieshao1.png' },
					{ name: '介绍', pic: '/img/personalCenter/icon_jieshao2.png' },
					{ name: '介绍', pic: '/img/personalCenter/icon_jieshao3.png' },
					{ name: '介绍', pic: '/img/personalCenter/icon_jieshao4.png' },

					{ name: '会员', pic: '/img/personalCenter/icon_vip.png' },
					{ name: '会员', pic: '/img/personalCenter/icon_vip1.png' },
					{ name: '会员', pic: '/img/personalCenter/icon_vip2.png' },
					{ name: '会员', pic: '/img/personalCenter/icon_vip3.png' },
					{ name: '会员', pic: '/img/personalCenter/icon_vip4.png' },

					{ name: '注册专车司机', pic: '/img/personalCenter/icon_zhuache.png' },
					{ name: '注册专车司机', pic: '/img/personalCenter/icon_zhuache1.png' },
					{ name: '注册专车司机', pic: '/img/personalCenter/icon_zhuache2.png' },
					{ name: '注册专车司机', pic: '/img/personalCenter/icon_zhuache3.png' },
					{ name: '注册专车司机', pic: '/img/personalCenter/icon_zhuache4.png' },

					{ name: '车主福利社', pic: '/img/personalCenter/icon_fulishe.png' },
					{ name: '车主福利社', pic: '/img/personalCenter/icon_fulishe1.png' },
					{ name: '车主福利社', pic: '/img/personalCenter/icon_fulishe2.png' },
					{ name: '车主福利社', pic: '/img/personalCenter/icon_fulishe3.png' },
					{ name: '车主福利社', pic: '/img/personalCenter/icon_fulishe4.png' },

					{ name: '车主福利', pic: '/img/personalCenter/icon_fuli.png' },
					{ name: '车主福利', pic: '/img/personalCenter/icon_fuli1.png' },
					{ name: '车主福利', pic: '/img/personalCenter/icon_fuli2.png' },
					{ name: '车主福利', pic: '/img/personalCenter/icon_fuli3.png' },
					{ name: '车主福利', pic: '/img/personalCenter/icon_fuli4.png' },

					{ name: '车队管理', pic: '/img/personalCenter/icon_chedui.png' },
					{ name: '车队管理', pic: '/img/personalCenter/icon_chedui1.png' },
					{ name: '车队管理', pic: '/img/personalCenter/icon_chedui2.png' },
					{ name: '车队管理', pic: '/img/personalCenter/icon_chedui3.png' },
					{ name: '车队管理', pic: '/img/personalCenter/icon_chedui4.png' },

					{ name: '超级会员', pic: '/img/personalCenter/icon_svip1.png' },
					{ name: '超级会员', pic: '/img/personalCenter/icon_svip2.png' },
					{ name: '超级会员', pic: '/img/personalCenter/icon_svip3.png' },
					{ name: '超级会员', pic: '/img/personalCenter/icon_svip4.png' },
					{ name: '超级会员', pic: '/img/personalCenter/icon_svip5.png' },

                    { name: '无感支付', pic: '/img/personalCenter/icon_Insensitivity_orange.png' },
                    { name: '无感支付', pic: '/img/personalCenter/icon_Insensitivity_cyan.png' },
                    { name: '无感支付', pic: '/img/personalCenter/icon_Insensitivity_blue.png' },
                    { name: '无感支付', pic: '/img/personalCenter/icon_Insensitivity_yellow.png' },
                    { name: '无感支付', pic: '/img/personalCenter/icon_Insensitivity_green.png' },

                    { name: '免密管理', pic: '/img/personalCenter/icon_nopassword_orange.png' },
                    { name: '免密管理', pic: '/img/personalCenter/icon_nopassword_cyan.png' },
                    { name: '免密管理', pic: '/img/personalCenter/icon_nopassword_blue.png' },
                    { name: '免密管理', pic: '/img/personalCenter/icon_nopassword_yellow.png' },
                    { name: '免密管理', pic: '/img/personalCenter/icon_nopassword_green.png' },

                    { name: '会员权益', pic: '/img/personalCenter/icon_rights_orange.png' },
                    { name: '会员权益', pic: '/img/personalCenter/icon_rights_cyan.png' },
                    { name: '会员权益', pic: '/img/personalCenter/icon_rights_blue.png' },
                    { name: '会员权益', pic: '/img/personalCenter/icon_rights_yellow.png' },
                    { name: '会员权益', pic: '/img/personalCenter/icon_rights_green.png' },

                    { name: '闪付', pic: '/img/personalCenter/icon_quickpay_orange.png' },
                    { name: '闪付', pic: '/img/personalCenter/icon_quickpay_cyan.png' },
                    { name: '闪付', pic: '/img/personalCenter/icon_quickpay_blue.png' },
                    { name: '闪付', pic: '/img/personalCenter/icon_quickpay_yellow.png' },
                    { name: '闪付', pic: '/img/personalCenter/icon_quickpay_green.png' },

                    { name: '车牌付', pic: '/img/personalCenter/icon_plate_orange.png' },
                    { name: '车牌付', pic: '/img/personalCenter/icon_plate_cyan.png' },
                    { name: '车牌付', pic: '/img/personalCenter/icon_plate_blue.png' },
                    { name: '车牌付', pic: '/img/personalCenter/icon_plate_yellow.png' },
                    { name: '车牌付', pic: '/img/personalCenter/icon_plate_green.png' },

                    { name: '个人资料', pic: '/img/personalCenter/icon_profile_orange.png' },
                    { name: '个人资料', pic: '/img/personalCenter/icon_profile_cyan.png' },
                    { name: '个人资料', pic: '/img/personalCenter/icon_profile_blue.png' },
                    { name: '个人资料', pic: '/img/personalCenter/icon_profile_yellow.png' },
                    { name: '个人资料', pic: '/img/personalCenter/icon_profile_green.png' },

                    { name: '积分兑换', pic: '/img/personalCenter/icon_integral_orange.png' },
                    { name: '积分兑换', pic: '/img/personalCenter/icon_integral_cyan.png' },
                    { name: '积分兑换', pic: '/img/personalCenter/icon_integral_blue.png' },
                    { name: '积分兑换', pic: '/img/personalCenter/icon_integral_yellow.png' },
                    { name: '积分兑换', pic: '/img/personalCenter/icon_integral_green.png' },

                    { name: '超级会员', pic: '/img/personalCenter/icon_svip_orange.png' },
                    { name: '超级会员', pic: '/img/personalCenter/icon_svip_cyan.png' },
                    { name: '超级会员', pic: '/img/personalCenter/icon_svip_blue.png' },
                    { name: '超级会员', pic: '/img/personalCenter/icon_svip_yellow.png' },
                    { name: '超级会员', pic: '/img/personalCenter/icon_svip_green.png' },

                    { name: '加油', pic: '/img/personalCenter/icon_oiling_orange.png' },
                    { name: '加油', pic: '/img/personalCenter/icon_oiling_cyan.png' },
                    { name: '加油', pic: '/img/personalCenter/icon_oiling_blue.png' },
                    { name: '加油', pic: '/img/personalCenter/icon_oiling_yellow.png' },
                    { name: '加油', pic: '/img/personalCenter/icon_oiling_green.png' },

                    { name: '积分商城', pic: '/img/personalCenter/icon_pointmall_orange.png' },
                    { name: '积分商城', pic: '/img/personalCenter/icon_pointmall_cyan.png' },
                    { name: '积分商城', pic: '/img/personalCenter/icon_pointmall_blue.png' },
                    { name: '积分商城', pic: '/img/personalCenter/icon_pointmall_yellow.png' },
                    { name: '积分商城', pic: '/img/personalCenter/icon_pointmall_green.png' },

                    { name: '便利店', pic: '/img/personalCenter/icon_store_orange.png' },
                    { name: '便利店', pic: '/img/personalCenter/icon_store_cyan.png' },
                    { name: '便利店', pic: '/img/personalCenter/icon_store_blue.png' },
                    { name: '便利店', pic: '/img/personalCenter/icon_store_yellow.png' },
                    { name: '便利店', pic: '/img/personalCenter/icon_store_green.png' },
				],
				carIconIndex:-1,
				dialogTableVisible: false,
				dialogFormVisible: false,
				form: {
					name: '',
					link: '',
					icon:"",
					isvalid: true,
					isDisable:true,
				},
				bannerForm:{
					name: '',
					link: '',
					image:"",
					isvalid: true,
				},
				formLabelWidth: '120px',
				_config:{},
				isShowPhone:"1",//默认隐藏

				dialogBannerVisible:false,
				dialogAddBannerVisible:false,
				selectIcon:"/img/personalCenter/icon_add.png",
				isShowIconList:false,
				defaultIcon:"",//默认图标
				uploadIcon:"",

			}
		},
		methods: {
			handleChange() {
				console.log('changed');
			},
			inputChanged(value) {
				this.activeNames = value;
			},
			getComponentData() {
				return {
					on: {
						change: this.handleChange,
						input: this.inputChanged
					},
					attrs:{
						wrap: true
					},
					props: {
						value: this.activeNames
					}
				};
			},
			handleClick(tab, event) {
			
				this.cardLevelName = tab.label;
				this.setActiveItem(tab.index)
			},
			setActiveItem(index){
				this.$refs.carousel.setActiveItem(index)
			},
			// 上移
			upMove(index) {
				console.log(index)
				let newitem = this.gridData.splice(index, 1)
				this.gridData.splice(index - 1, 0, newitem[0])
			},
			// 下移
			downMove(index) {
				console.log(index)
				let newitem = this.gridData.splice(index, 1)
				this.gridData.splice(index + 1, 0, newitem[0])
			},
			addCarIncon(){
				this.title = "新建宫格";
				this.isEdit = false;
				this.form = {
					name: '',
					remark:'',
					link: '',
					icon:"",
					isvalid: true,
					isDisable:false
				};
				this.carIconIndex = -1
				this.dialogFormVisible = true;
				this.isShowIconList = false;
				this.selectIcon="/img/personalCenter/icon_add.png";
				this.uploadIcon = "";
			},
			eidtCarIncon(index) {
				var that = this;
				this.title = "编辑宫格";
				this.isEdit = true;
				this.isShowIconList = false;
				this.editIndex = index;
				
				this.form = {
					name: this.gridData[index].name,
					remark:this.gridData[index].remark,
					link: this.gridData[index].link,
					icon:this.gridData[index].icon,
					isvalid: this.gridData[index].isvalid,
					isDisable:this.gridData[index].isDisable
				};

				var isSameIcon = false;
				this.carIcon.map(function(item,index){
					if(item.pic == that.form.icon){
						isSameIcon = {
							index:index,
							pic:item.pic
						};
					}
				})

				//判断是否有相同的图标
				if(isSameIcon){
					that.carIconIndex = isSameIcon.index;
					that.selectIcon = isSameIcon.pic;
				}else{
					that.carIconIndex = -2;
					that.uploadIcon = that.form.icon;
				}

				this.defaultIcon = {
					selectIcon:this.selectIcon,
					uploadIcon:this.uploadIcon,
					carIconIndex:this.carIconIndex,
				};
				this.dialogFormVisible = true;
			},

			restIcon(){
				
				this.carIconIndex = this.defaultIcon.carIconIndex;
				if(this.carIconIndex >=-1){
					this.selectIcon = this.defaultIcon.selectIcon;
				}else{
					this.uploadIcon = this.defaultIcon.uploadIcon;
				}
				this.$forceUpdate()
			},

			removeCarIcon(index) {
				console.log(index)
				
				this.$confirm('此操作将删除该宫格, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.gridData.splice(index, 1)
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});          
				});
			},


			// 上移
			upBannerMove(index) {
				console.log(index)
				let newitem = this.bannerData.splice(index, 1)
				this.bannerData.splice(index - 1, 0, newitem[0])
			},
			// 下移
			downBannerMove(index) {
				console.log(index)
				let newitem = this.bannerData.splice(index, 1)
				this.bannerData.splice(index + 1, 0, newitem[0])
			},
			addBanner(){
				this.bannerTitle = "新建Banner";
				this.isBannerEdit = false;
				this.bannerForm = {
					name: '',
					link: '',
					image:"",
					isvalid: true
				};
			
				this.dialogAddBannerVisible = true;
			},
			eidtBanner(index) {
				var that = this;
				this.bannerTitle = "编辑Banner";
				this.isBannerEdit = true;
				this.editBannerIndex = index;
				this.bannerForm = {
					name: this.bannerData[index].name,
					link: this.bannerData[index].link,
					image:this.bannerData[index].image,
					isvalid: this.bannerData[index].isvalid
				};
			
				this.dialogAddBannerVisible = true;
			},

			removeBanner(index) {
				console.log(index)
				

				this.$confirm('此操作将删除该banner, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.bannerData.splice(index, 1)
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});          
				});
			},
			
			
			changeCarouse(index){
			    console.log(index)
				this.activeName =this.cardSetting[index].level_name;
            },

            changeType(item,type){
				if(type=="font"){
					//默认字体颜色
					if(item.config.font.type == "0"){
						item.config.font.value = "#ffffff";
					}
				}
				if(type=="signinBackground"){
					//默认按钮背景颜色
					if(item.config.signin.backgroundValue == "0"){
						item.config.signin.background = "#ffffff";
					}
				}
				if(type=="signinFont"){
					//默认按钮背景颜色
					if(item.config.signin.fontValue == "0"){
						item.config.signin.font = "#171717 ";
					}
				}
                this.$forceUpdate()
            },

			changeShowPhone(value){
				this.isShowPhone = value;
				this.$forceUpdate()
			},

			selectCarIcon(index,item){
				this.carIconIndex = index;
				this.form.icon = item.pic;
				this.selectIcon = item.pic;
				this.isShowIconList = false;

				this.uploadIcon = "";
			},

			showIconList(){
				this.isShowIconList = true;
			},


			closeIconList(){
				this.isShowIconList = false;
			},

			createIcon(){
				//做内容检测
				if(!this.form.name){
					layer.msg('请输入标题！');
					return 
				}
				
				if(!this.form.isDisable && !this.form.link){
					layer.msg('请输入链接地址！');
					return 
				}
				if(!this.form.icon){
					layer.msg('请选择图标！');
					return 
				}
				//把内容写入到列表中
				if(this.isEdit){
					
					this.gridData[this.editIndex].name = this.form.name;
					this.gridData[this.editIndex].remark = this.form.remark;
					this.gridData[this.editIndex].link = this.form.link;
					this.gridData[this.editIndex].icon = this.form.icon;
					this.gridData[this.editIndex].isvalid = this.form.isvalid;
					this.gridData[this.editIndex].isDisable = this.form.isDisable;
				}else{
					this.gridData.push(this.form)
				}
				this.$nextTick(() => {
					this.gridData = $.extend(true,[],this.gridData);
					this.$forceUpdate();
					this.dialogFormVisible = false
				});
				
				
			},



			createBanner(){
				//做内容检测
				if(!this.bannerForm.name){
					layer.msg('请输入标题！');
					return 
				}
				if(!this.bannerForm.link){
					layer.msg('请输入链接地址！');
					return 
				}
				if(!this.bannerForm.image){
					layer.msg('请上传banner图片！');
					return 
				}
				//把内容写入到列表中
				if(this.isBannerEdit){
					
					this.bannerData[this.editBannerIndex].name = this.bannerForm.name;
					this.bannerData[this.editBannerIndex].link = this.bannerForm.link;
					this.bannerData[this.editBannerIndex].image = this.bannerForm.image;
					this.bannerData[this.editBannerIndex].isvalid = this.bannerForm.isvalid;
				}else{
					this.bannerData.push(this.bannerForm)
				}
				
				this.$forceUpdate();
				this.dialogAddBannerVisible = false
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
					item.config.background.url = res.img;
					this.$forceUpdate();
				}else{
					this.$message.error('上传失败，请重试！');
				}
				
			},
			beforeAvatarUpload(file) {
				console.log(file);
				if(!['image/jpg','image/jpeg','image/png'].includes(file.type)) {
					this.$message.error('只能上传jpg/png文件，且不超过200kb，图片尺寸为670*204像素');
					return false;
				}

				const isLt2M = file.size / 1024 < 200;
				if (!isLt2M) {
					this.$message.error('上传banner图片大小不能超过 200K!');
				}
				return isLt2M;
			},


			getCardListById(id){
				var list = [];
				list = this.cardList.filter(function(element){
					return element.id == id
				})

				return list.length>0? list[0]:this.defaultCardVIP;
			},
            

            ajaxGetInfo(){
                var that = this;
                $.ajax({
						url: '/PersonalCenter/configQuery',
						method: 'get',
						data: {},
						dataType: 'json',
						success: function (data) {
                            console.log(data)
							if ( 200 == data.status ) {
								that.cardSetting = data.data.members;//会员卡的类型
								
								if(that.cardSetting.length>0){
									that.activeName =that.cardSetting[0].level_name;
								}else{
									that.activeName = "default";

									that.cardSetting=[
										{
											id:"default",
											level_name:"默认设置",
										}
									]
								}
                               

								//九宫格列表
								that.gridData = data.data.personalConfig.table;
								that.gridData.map(function(item){
									if(!item.icon){
										
										var _iconList = that.carIcon.filter(function(_item){ return _item.name == item.name})
										if(_iconList.length>0){
											item.icon =	_iconList[0].pic
										}else{
											item.icon =	that.carIcon[0].pic
										}
									}
									
									item.isvalid = item.isvalid == 1? true : false;
									//item.isDisable = true;
									//item.children = []
								})
								that.bannerData = data.data.personalConfig.banner;
                                //配置“会员卡设置”的初始化值
								var members = data.data.personalConfig.members;//会员卡的类型

								//是否显示手机号
								that.isShowPhone = data.data.personalConfig.isShowPhone || "1";

								var _default = {
										"background": {
											"type": 0,
											"value": "#958181",
											"url": ""
										},
										"font": {
											"type": 0,
											"value": "#ffffff"
										},
										"qrcode": {
											"type": 0,
											"value": "#fff"
										},
										"signin": {
											"isvalid": true,
											"background": "#ffffff",
											"font": "#171717 ",
											"url": "v1/sign/group_id/",
											"backgroundValue": 0,
											"fontValue": 0
										}
                                };
								
								if(members.length==0 || JSON.stringify(members) == "{}"){
                                        members = {
                                            "default": _default
                                        }
                                    }
								
								//判断列表中，是否含有默认的配置  如果没有的话，添加一个默认的配置
								if(!members.hasOwnProperty("default")){
									members["default"] = _default 
								}
                                    
								
                                that.cardSetting.map(function(item){
									
                                    if(members.hasOwnProperty(item.id)){
                                        item.config = JSON.parse(JSON.stringify(members[item.id]));
                                    }else{
                                        item.config = JSON.parse(JSON.stringify(members["default"]));
									}
									
                                    
									if(item.config.signin.hasOwnProperty("backgroundValue")){
										item.config.signin.backgroundValue = item.config.signin.backgroundValue;
									}else{
										item.config.signin.backgroundValue = 0;
									}

									if(item.config.signin.hasOwnProperty("fontValue")){
										item.config.signin.fontValue = item.config.signin.fontValue;
									}else{
										item.config.signin.fontValue = 0;
									}
									
									
									
									item.config.signin.font = item.config.signin.font;
									item.config.signin.isvalid = item.config.signin.isvalid?true:false;
									
                                })
								
								setTimeout(() => {
									that.changeType();
								}, 1);
                                
							} else {
								layer.msg(data.info);
							}
						},
						error: function () {
							layer.msg('网络错误');
						}
					});

            },

			_setSubmitData(){
				var that = this;
				that._config = {
					members:{},
					table:[],
					banner:[],
					isShowPhone:this.isShowPhone,
				};
				that.cardSetting.map(function(item){
					that._config.members[item.id] = item.config
                })

				that._config.table = that.gridData;
				that._config.banner = that.bannerData;
				console.log(that._config)
			},


			ajaxSubmit(){
                var that = this;
				that._setSubmitData();
				
                $.ajax({
						url: '/PersonalCenter/configSave',
						method: 'post',
						data: {
							config:JSON.stringify(that._config)
						},
						dataType: 'json',
						success: function (data) {
                            console.log(data)
							if ( 200 == data.status ) {
								that.$message.success('保存成功！');
								
							} else {
								layer.msg(data.info);
							}
						},
						error: function () {
							layer.msg('网络错误');
						}
					});

            }
        },
        mounted(){
            this.ajaxGetInfo();
        },
		created() {
			let arr = [
				{ num: 1, max: 2 },
				{ num: 2, max: 4 },
				{ num: 5, max: 6 },
				{ num: 7, max: 8 },
			]
			let newnum = null
			arr.forEach((item, index) => {
				item.num
			})
		
		}
	})
	</script>

	<script src="/js/vue_component.js?v={{config('constants.wcc_file_version')}}"></script>


@endsection 