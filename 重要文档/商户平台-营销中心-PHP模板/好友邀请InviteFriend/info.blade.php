@extends('layout/master')

@section('header')
	<link rel="stylesheet" type="text/css" href="/css/wcc.css?v={{config('constants.wcc_file_version')}}">
	<link rel="stylesheet" type="text/css" href="/css/InviteFriend/InviteFriend.css?v={{config('constants.wcc_file_version')}}">
@endsection

@section('content')
<div id='app' v-cloak >
	<wcc-loading v-show="infoBoolean" type='1'></wcc-loading>
	<ul class="info_list" v-show="!successBoolen" >
		<li  v-for=" (item,index) in listaData" :selecte="index==listaState "  v-on:click="listFun(index,true,item.state)" :state="item.state" v-show=" index < 7 || One.activityType == 1 ">
			<span class="crude font_3_14">@{{item.name}}<span class="crude font_9_12" v-if="item.Vice_name">_@{{item.Vice_name}}</span></span>
			<div  v-if='status!=1'>
				<span class="font_9_12" v-show="item.state == 0">未设置</span>
				<span class="font_9_12" v-show="item.state == 1">设置中</span>
				<span class="font_9_12" v-show="item.state == 2">已设置</span>
				<span class="iconfont"> 
					<i class="iconfont_right" v-show="item.state < 2">&#xe672;</i> 
					<i class="iconfont_right2" v-show="item.state == 2">&#xe67d;</i> 
				</span>
			</div>
		</li>
	</ul>
	<!-- 活动设置 -->
	<div class="info_box clear" :Mask="status" v-show="listaState==0&&!successBoolen">
		<div class="info_box_title mt20">
			活动基础设置
		</div>
		<div class="clear mt20">
			<span class="info_box_left font_3_14">活动时间</span>
			<div  class="info_box_right ml20">
				<div class="wcc_selectStation_box wcc_time wcc_width343" itshow="0">
				    <i class="wcc_calendar"></i>
				    <div class="input_box">
				        <input id="time" type="text" name="" value="" placeholder="">
				    </div>
				</div>
			</div>
		</div>
		<div class="clear mt20">
			<span class="info_box_left font_3_14">活动名称</span>
			<div  class="info_box_right ml20">
				<div class="info_input_limit" >
					<input  class="wcc_input w343" :class="{wcc_input_error : errorOne.activityName}" v-model="One.activityName" v-on:focus=" verify('errorOne','activityName') "  type="text" name="" maxlength="15" v-on:input="limitFun($event.target)"   placeholder="请输入活动名称">
					<span>@{{One.activityName.length}}/15</span>
				</div>
			</div>
		</div>
		<div class="wcc_error_box ml80" v-if="errorOne.activityName">
		    <div class="wcc_error"> 
		        <span class='iconfont'><i>&#xe674;</i></span> 
		        <span>@{{errorOne.activityName}}</span>
		     </div>
		</div>
		<div class="clear mt20">
			<span class="info_box_left font_3_14">活动类型</span>
			<div  class="info_box_right ml20">
				<select-radio v-bind:add="attr" class="w343" v-bind:select="attr[One.activityType]" v-on:selected="activityTypeFun" v-bind:search-input="false" v-bind:radio='One.activityType'></select-radio>
				<div class="info_box_ask wcc_hover">
					? 
					<div class="wcc_tips wcc_tips_right info_wcc_tips_right">
						<div class="font_3_14">1级好友邀请</div>
						<div class="font_9_12">仅展示1级邀请关系，仅奖励1级邀请人，即直接邀请人</div>
						<div class="font_3_14 mt10">2级好友邀请</div>
						<div class="font_9_12">可展示2级邀请关系，可奖励1级邀请人(即直接邀请人)和2级邀请人(即间接邀请人)</div>
					</div>
				</div>
			</div>
		</div> 
		<div class="clear mt20">
			<span class="info_box_left font_3_14">页面标题</span>
			<div  class="info_box_right ml20">
				<div class="info_input_limit" >
					<input  class="wcc_input w167" :class="{wcc_input_error : errorOne.activityNameB}" v-model="One.activityNameLeft" v-on:focus=" verify('errorOne','activityNameB') "  type="text" name="" maxlength="5" v-on:input="limitFun($event.target)"   placeholder="请输入左边标题">
					<span>@{{One.activityNameLeft.length}}/5</span>
				</div>

				|
				<div class="info_input_limit" >
					<input  class="wcc_input w167" :class="{wcc_input_error : errorOne.activityNameB}" v-model="One.activityNameRight" v-on:focus=" verify('errorOne','activityNameB') "  type="text" name="" maxlength="8" v-on:input="limitFun($event.target)"   placeholder="请输入左边标题">
					<span>@{{One.activityNameRight.length}}/8</span>
				</div>
			</div>
		</div> 
		<div class="wcc_error_box ml80" v-if="errorOne.activityNameB">
		    <div class="wcc_error"> 
		        <span class='iconfont'><i>&#xe674;</i></span> 
		        <span>@{{errorOne.activityNameB}}</span>
		     </div>
		</div>
		<div class="clear mt20">
			<span class="info_box_left font_3_14">活动logo</span>
			<div  class="info_box_right ml20">
				<div class="wcc_btn_fat_green">
					<span>更改logo</span>
					<input type="file" name="" v-on:change="fileFun($event.target,'logo')" value="" placeholder="">
				</div>
			</div>
			<img class="wh40 ml10" :src="One.logo || '{{$st_logo}}'" alt="">
		</div>
		<div class="clear">
			<span class="info_box_left font_3_14"></span>
			<span class=" font_9_14 ml20 iconfont">1M以内，格式bmp、png、jpg、gif:尺寸不小于200*200的正方形</span>
		</div>
		
		<div class="clear mt20">
			<span class="info_box_left font_3_14">活动规则</span>
			<div  class="info_box_right2 ml20">
				<textarea class="wcc_textarea w343" :class="{wcc_input_error : errorOne.Rules}" v-on:focus=" verify('errorOne','Rules') " v-model="One.Rules"></textarea>
				<div>
					<span class="wcc_text inline_block"  v-on:click=" One.Rules = ('活动时间：'+One.startTime+' 至 '+One.endTime+'\n'+One.Rules2)">注册模版</span>
					<span class="wcc_text inline_block ml20"  v-on:click=" One.Rules = ('活动时间：'+One.startTime+' 至 '+One.endTime+'\n'+One.Rules3)">加油模版</span>
				</div>
				
			</div>
		</div>
		<div class="wcc_error_box ml80" v-if="errorOne.Rules">
		    <div class="wcc_error"> 
		        <span class='iconfont'><i>&#xe674;</i></span> 
		        <span>@{{errorOne.Rules}}</span>
		     </div>
		</div>
		<div class="info_box_title mt20">
			<!-- <span class='info_wcc_tips_right2'> -->
				页面模板的设置
				<!-- <div class="info_box_ask wcc_hover">
					? 
					<div class="wcc_tips wcc_tips_right info_wcc_tips_right">发出邀请的页面，是每个人活动的主页面，建议在文案上引诱用户参与活动</div>
				</div> -->
			<!-- </span> -->
		</div>
		<div class="clear">
			<div class="info_left_box">
			
				<div class="clear mt20">
					<span class="info_box_left font_3_14">默认模版</span>
					<div  class="info_box_right2 ml20 Template_img" v-on:click="TemplateImgFun($event.target)">
						<div v-for="(item,index) in Template_img" :style="'background-image:url('+item.img+')'"  :index='index' :class="{img_checkbox:index==img_checkbox}">
							<!-- <img   :src="item.img"> -->
						</div>
					</div>
				</div>
				<div class="clear mt20">
					<span class="info_box_left font_3_14">banner图</span>
					<div  class="info_box_right ml20">
						<div class="wcc_btn_fat_green">
							<span>更改</span>
							<input type="file" name="" v-on:change="fileFun($event.target,'banner',true)" value="" placeholder="">
						</div>
					</div>
				</div>
				<div class="clear mt20">
					<span class="info_box_left font_3_14">背景图片</span>
					<div  class="info_box_right ml20">
						<div class="wcc_btn_fat_green">
							<span>更改</span>
							<input type="file" name="" v-on:change="fileFun($event.target,'backgroud_img',true)" value="" placeholder="">
						</div>
					</div>
				</div>
				
			</div>
			<div class="info_right_box">
			
				<div class="info_mobile mt20">
					<div class="info_mobile_title">@{{One.activityNameLeft}} | @{{One.activityNameRight}}</div>
					<div class="info_mobile_content public_scrollBrowser" :style="' background-image: url('+backgroud_img+') '">
						<div class="info_mobile_core">
							<span class="font_9_12">2018-1-29 15:58:40</span>
							<img class="info_mobile_core_img" :src="banner" alt="">
							<div class="font_3_14 align_center mt10">主标语</div>
							<div class="font_9_12 align_center mt10">引导标语</div>
							<div class="font_9_14 align_center mt20">活动规则></div>
							<div class="info_mobile_core_button_box clear mt20">
								<div class="info_mobile_core_button1">
								 	发送邀请链接
								</div>
								<div class="info_mobile_core_button2">
									面对面邀请
								</div>
							</div>
							<div class="font_9_12  mt10 align_center">提示语</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="info_box_title mt20">
			活动基础设置
		</div>
		<div class="clear">
			<div class="info_left_box">
				<div class="clear mt20">
					<span class="info_box_left font_3_14">分享标题</span>
					<div  class="info_box_right ml20">
						<input class="wcc_input w300" type="text" :class="{wcc_input_error : errorOne.shareTitle}" v-on:focus=" verify('errorOne','shareTitle') " v-model="One.shareTitle" placeholder="请填写分享标题" >
					</div>
				</div>
				<div class="wcc_error_box ml80" v-if="errorOne.shareTitle">
				    <div class="wcc_error"> 
				        <span class='iconfont'><i>&#xe674;</i></span> 
				        <span>@{{errorOne.shareTitle}}</span>
				     </div>
				</div> 
				<div class="clear mt20">
					<span class="info_box_left font_3_14">分享内容</span>
					<div  class="info_box_right2 ml20">
						<textarea class="wcc_textarea w300" placeholder="请填写分享内容" :class="{wcc_input_error : errorOne.shareContent}" v-on:focus=" verify('errorOne','shareContent') " v-model="One.shareContent"></textarea>
					</div>
				</div>
				<div class="wcc_error_box ml80" v-if="errorOne.shareContent">
				    <div class="wcc_error"> 
				        <span class='iconfont'><i>&#xe674;</i></span> 
				        <span>@{{errorOne.shareContent}}</span>
				     </div>
				</div> 
				<div class="clear mt20">
					<span class="info_box_left font_3_14">分享logo</span>
					<div  class="info_box_right ml20">
						<div class="wcc_btn_fat_green">
							<span>更改logo</span>
							<input type="file" name="" v-on:change="fileFun($event.target,'shareLogo')" value="" placeholder="">
						</div>
					</div>
				</div>
				<div class="clear">
					<span class="info_box_left font_3_14"></span>
					<span class=" font_9_14 ml20 w300 iconfont">1M以内，格式bmp、png、jpg、gif:尺寸不小于200*200的正方形</span>
				</div>
			</div>
			<div class="info_right_box">

				<div class="font_9_12 mt20">分享给好友</div>
				<div class="info_friends mt20 clear">
					<img class="wh60 info_friends_img_right" :src="One.shareLogo || '{{$st_logo}}'" alt="">
					<div class="nowrap info_friends_title font_3_14">@{{ One.shareTitle || '写点什么呗' }}</div>
					<div class="info_friends_content font_9_12 nowrap2">@{{ One.shareContent || '写点什么呗' }}</div>
				</div>
				<div class="font_9_12 mt20">分享到朋友圈</div>
				<div class="info_friends mt20 clear">
					<img class="wh40 info_friends_img_left" :src="One.shareLogo || '{{$st_logo}}'" alt="">
					<div class="nowrap info_friends_title2 font_3_14">@{{ One.shareTitle || '写点什么呗' }}</div>
				</div>
			</div>
		</div>
		<div class="clear mt40" v-if="status!=1">
			<span class="info_box_left font_3_14"></span>
			<div  class="info_box_right ml20">
				<bottom  :class="{ wcc_btn_fat_allowed : errorOne.BonBoolen , wcc_btn_thin_green : !errorOne.BonBoolen } "  v-on:click="checkTime">下一步</bottom>
			</div>
		</div>
	</div>
	<!-- 1级邀请人_发出邀请 -->
	<div class="info_box clear" :Mask="status" v-show="listaState==1&&!successBoolen">
		<div class="info_box_title mt20">
			发出邀请的资格
		</div>
		<div class="clear mt20">
			<span class="info_box_left font_3_14">谁可以发出邀请</span>
			<div  class="info_box_right ml20">
				<!-- <select-radio v-bind:add="issueInvitation" class="w343" :tempkey="'Two'" v-if="Two.issueInvitationState>-1" v-bind:select="issueInvitation[Two.issueInvitationState]" v-on:selected="selectRadioFun" v-bind:search-input="false" v-bind:radio='Two.issueInvitationState'></select-radio> -->
				<div  class="info_box_right info_box_left ml20 font_9_14">
					<label v-for="(item,index) in issueInvitation" :for="'v_radio'+index" class="wcc_label">
					     <input type="radio" :id="'v_radio'+index" name="v_radio" :checked="Two.issueInvitationState==index" v-model="Two.issueInvitationState" :value='index'>
					       <span class="wcc_label_radio"><i></i></span>
					     <span class='text'>@{{item.name}}</span>
					</label>
				</div>

			</div>
		</div>
		<div class="info_box_title mt20">
			<span class='info_wcc_tips_right2'>
				发出邀请页面的设置
				<div class="info_box_ask wcc_hover">
					? 
					<div class="wcc_tips wcc_tips_right info_wcc_tips_right">发出邀请的页面，是每个人活动的主页面，建议在文案上引诱用户参与活动</div>
				</div>
			</span>
		</div>
		<div class="clear">
			<div class="info_left_box">
				<div class="clear mt20">
					<span class="info_box_left font_3_14">主标语</span>
					<div  class="info_box_right ml20">
						<input class="wcc_input w300" type="text" :class="{wcc_input_error : errorTwo.slogan}" v-model="Two.slogan"  v-on:focus=" verify('errorTwo','slogan') "  name="" value="" placeholder="请输入主标语" >
					</div>
				</div>
				<div class="wcc_error_box ml80" v-if="errorTwo.slogan">
				    <div class="wcc_error"> 
				        <span class='iconfont'><i>&#xe674;</i></span> 
				        <span>@{{errorTwo.slogan}}</span>
				     </div>
				</div> 
				<div class="clear mt20">
					<span class="info_box_left font_3_14">引导标语</span>
					<div  class="info_box_right2 ml20">
						<textarea class="wcc_textarea w300" name="" :class="{wcc_input_error : errorTwo.guide}"  v-model="Two.guide" v-on:focus=" verify('errorTwo','guide') " placeholder="请输入引导标语" ></textarea>
					</div>
				</div>
				<div class="wcc_error_box ml80" v-if="errorTwo.guide">
				    <div class="wcc_error"> 
				        <span class='iconfont'><i>&#xe674;</i></span> 
				        <span>@{{errorTwo.guide}}</span>
				     </div>
				</div> 
				<div class="clear mt20">
					<span class="info_box_left font_3_14">提示语</span>
					<div  class="info_box_right ml20">
						<input class="wcc_input w300" type="text" name="" value="" :class="{wcc_input_error : errorTwo.Hint}"  v-on:focus=" verify('errorTwo','Hint') "  v-model="Two.Hint" placeholder="请输入提示语" >
					</div>
				</div>
				<div class="wcc_error_box ml80" v-if="errorTwo.Hint">
				    <div class="wcc_error"> 
				        <span class='iconfont'><i>&#xe674;</i></span> 
				        <span>@{{errorTwo.Hint}}</span>
				     </div>
				</div> 
			</div>
			<div class="info_right_box">
				<div class="info_mobile mt20">
					<div class="info_mobile_title">@{{One.activityNameLeft}} | @{{One.activityNameRight}}</div>
					<div class="info_mobile_content public_scrollBrowser" :style="' background-image: url('+backgroud_img+') '">
						<div class="info_mobile_core">
							<span class="font_9_12">2018-1-29 15:58:40</span>
							<img class="info_mobile_core_img" :src="banner" alt="">
							<div class="font_3_14 align_center mt10">@{{Two.slogan || '写点主标语呗'}}</div>
							<div class="font_9_12 align_center mt10">@{{Two.guide  || '写点引导标语呗'}}</div>
							<div class="font_9_14 align_center mt20">活动规则></div>
							<div class="info_mobile_core_button_box clear mt20">
								<div class="info_mobile_core_button1">
								 	发送邀请链接
								</div>
								<div class="info_mobile_core_button2">
									面对面邀请
								</div>
							</div>
							<div class="font_9_12  mt10 align_center">@{{Two.Hint  || '写点提示语呗'}}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="clear mt40" v-if="status!=1">
			<span class="info_box_left font_3_14"></span>
			<div  class="info_box_right ml20">
				<bottom class="wcc_btn_thin_bor_ash" v-on:click="listFun(0)">上一步</bottom>
				<bottom :class="{ wcc_btn_fat_allowed : errorOne.BonBoolen , wcc_btn_thin_green : !errorOne.BonBoolen } " v-on:click="checkB" >下一步</bottom>
			</div>
		</div>
	</div>
	<!-- 1级邀请人_好友接受邀请 -->
	<div class="info_box clear" :Mask="status" v-show="listaState==2&&!successBoolen">
		<div class="info_box_title mt20">
			奖励设置
		</div>
		<div class="clear mt20">
			<span class="info_box_left font_3_14">奖励类型</span>
			<div  class="info_box_right info_box_left ml20 font_9_14">
				好友接受邀请时，给直接邀请人发放的奖励
			</div>
		</div>
		<div class="clear mt20">
			<span class="info_box_left font_3_14">奖励内容</span>
			<div  class="info_box_right ml20 box">
				<div>
					<select-radio v-bind:add="awardSetting" class="w185" v-if="Three.issueInvitationState>-1" tempkey="Three" v-bind:select="issueInvitation[Three.issueInvitationState]" v-on:selected="selectRadioFun" v-bind:search-input="false" v-bind:radio='Three.issueInvitationState'></select-radio>
				</div>
				<div class="ml20" v-show="Three.issueInvitationState == 1">
					<span>@{{Three.awardSettingVoucher.length}}种，共@{{Three.awardSettingVoucher.total}}张</span>
					<div class="wcc_btn_thin_bor_ash" v-on:click="ev_showCouponBox('awardSettingVoucher')">抵用券设置</div>
				</div>
				<div class="ml20" v-show="Three.issueInvitationState == 2">
					<span>奖励</span>
					<input type="text" :value="Three.awardSettingIntegral" v-on:input="ev_numberInputLimit($event.target , 'awardSettingIntegral')" class="wcc_input w60" >
					<span>个积分</span>
				</div>
				<div class="ml20" v-show="Three.issueInvitationState == 3">
					<span>奖励</span>
					<input type="text"  :value="Three.awardSettingExperience" v-on:input="ev_numberInputLimit($event.target , 'awardSettingExperience')" class="wcc_input w60" >
					<span>个积分和经验值</span>
				</div>

			</div>
		</div> 

		<div class="wcc_error_box ml80" v-if="errorThree.reward">
		    <div class="wcc_error"> 
		        <span class='iconfont'><i>&#xe674;</i></span> 
		        <span>@{{errorThree.reward}}</span>
		     </div>
		</div>




		<div class="info_box_title mt20">
			提醒通知设置
		</div>
		<div class="clear mt20">
			<span class="info_box_left font_3_14">奖励类型</span>
			<div  class="info_box_right info_box_left ml20  font_9_14">
				好友接受邀请时，给直接邀请人发放的通知，引导直接邀请人关注引导其好友完成邀请
			</div>
		</div> 
		
		<div class="clear mt20">
			<span class="info_box_left font_3_14">是否通知</span>
			<div  class="info_box_right ml20">
				<label for="info_radio" class="info_radio_box">
					<input id="info_radio" type="checkbox" :checked="!!Three.checkbox"  v-model="Three.checkbox" v-on:click="Three.checkbox==1?Three.checkbox==0:Three.checkbox==1;verify('errorThree','Rules')"  >
					<div class="info_radio"></div>
				</label>
			</div>
		</div>
		<div class="clear mt10" v-show="Three.checkbox">
			<span class="info_box_left font_3_14"></span>
			<div  class="info_box_right2 ml20">
				<textarea class="wcc_textarea w300" v-model="Three.Rules"   v-on:focus=" verify('errorThree','Rules') "></textarea>
			</div>
		</div>
		<div class="clear mt10" v-show="Three.checkbox">
			<span class="info_box_left font_3_14"></span>
			<div  class="info_box_right2 ml20 font_9_14">
				<span class="wcc_text inline_block" v-on:click="Three.Rules = Three.Rules2">恢复默认</span>
				<span class="ml20">点击右侧标签可插入变量：</span>
				<span class="wcc_text_green" v-on:click="Three.Rules += '{phont_str}'">{受邀人手机尾号}</span>
				<span class="ml20 wcc_text_green" v-on:click="Three.Rules += '{address}'">{油站名称}</span>
			</div>
		</div>
		<div class="wcc_error_box ml80" v-if="errorThree.Rules">
		    <div class="wcc_error"> 
		        <span class='iconfont'><i>&#xe674;</i></span> 
		        <span>@{{errorThree.Rules}}</span>
		     </div>
		</div> 
		<div class="clear mt40" v-if="status!=1">
			<span class="info_box_left font_3_14"></span>
			<div  class="info_box_right ml20">
				<bottom class="wcc_btn_thin_bor_ash" v-on:click="listFun(1)">上一步</bottom>
				<bottom :class="{ wcc_btn_fat_allowed : errorThree.BonBoolen , wcc_btn_thin_green : !errorThree.BonBoolen } " v-on:click="checkC" >下一步</bottom>
			</div>
		</div>
	</div>
	<!-- 1级邀请人_好友完成邀请 -->
	<div class="info_box clear" :Mask="status" v-show="listaState==3&&!successBoolen">
		<div class="info_box_title mt20">
			1级成功邀请奖励设置	
		</div>
		<div class="clear mt20">
			<span class="info_box_left font_3_14">奖励类型</span>
			<div  class="info_box_right info_box_left ml20 font_9_14">
				用户邀请的好友完成邀请时，给直接邀请人发放的奖励
			</div>
		</div>
		<div class="clear mt20">
			<span class="info_box_left font_3_14">奖励内容</span>
			<div  class="info_box_right ml20 box2" style="max-width:500px;">
				<div v-if="is_baoJi==1">
					<select-radio v-if="Four.issueInvitationState>-1" v-bind:add="awardSettingB" class="w185" tempkey="Four"  v-bind:select="awardSettingB[Four.issueInvitationState]" v-on:selected="selectRadioFun" v-bind:search-input="false" v-bind:radio='Four.issueInvitationState'></select-radio>
				</div>
				<div v-else>
					<select-radio v-if="Four.issueInvitationState>-1" v-bind:add="awardSetting" class="w185" tempkey="Four"  v-bind:select="awardSetting[Four.issueInvitationState]" v-on:selected="selectRadioFun" v-bind:search-input="false" v-bind:radio='Four.issueInvitationState'></select-radio>
				</div>
				<div class="ml20" v-show="Four.issueInvitationState == 1">
					<span>@{{Four.awardSettingVoucher.length}}种，共@{{Four.awardSettingVoucher.total}}张</span>
					<div class="wcc_btn_thin_bor_ash" v-on:click="ev_showCouponBox('awardSettingVoucher')">抵用券设置</div>
				</div>
				<div class="ml20" v-show="Four.issueInvitationState == 2">
					<span>奖励</span>
					<input type="text"  :value="Four.awardSettingIntegral" v-on:input="ev_numberInputLimit($event.target , 'awardSettingIntegral')" class="wcc_input w60" >
					<span>个积分</span>
				</div>
				<div class="ml20" v-show="Four.issueInvitationState == 3">
					<span>奖励</span>
					<input type="text" name=""  :value="Four.awardSettingExperience"  v-on:input="ev_numberInputLimit($event.target , 'awardSettingExperience')" class="wcc_input w60" >
					<span>个积分和经验值</span>
				</div>
				<div class="ml20 clear w555" style='position:relative' v-show="Four.issueInvitationState == 4">
					<div class='created_Reappearance'>
						<select-radio class="w180" :model="true" v-bind:add="moneyAttr" v-on:selected="moneyFun" v-bind:select="moneyAttr[Four.cashIndex] || '没有红包请创建'" ></select-radio>
						<span  class="wcc_error" v-if="moneyAttr.length&&moneyAttr[Four.cashIndex].name =='暂无数据'">暂无可用的微信现金红包，请联系客户经理配置</span>
						<!-- <span class="wcc_text_green" v-on:click="open">创建红包</span> -->
					</div>
					
				</div>

			</div>
		</div>
		<div class="wcc_error_box ml80" v-if="errorFour.reward">
		    <div class="wcc_error">  
		        <span class='iconfont'><i>&#xe674;</i></span> 
		        <span>@{{errorFour.reward}}</span>
		     </div>
		</div> 
		<div class="info_box_title mt20">
			1级成功邀请通知设置
		</div>
		<div class="clear mt20">
			<span class="info_box_left font_3_14">奖励类型</span>
			<div  class="info_box_right info_box_left ml20  font_9_14">
				用户邀请的好友完成邀请时，给直接邀请人发放通知
			</div>
		</div> 
		
		<div class="clear mt20">
			<span class="info_box_left font_3_14">是否通知</span>
			<div  class="info_box_right ml20">
				<label for="info_radio2" class="info_radio_box">
					<input id="info_radio2" type="checkbox" :checked="!!Four.checkbox"  v-model="Four.checkbox" v-on:click="Four.checkbox==1?Four.checkbox==0:Four.checkbox==1;verify('errorFour','Rules')"  >
					<div class="info_radio"></div>
				</label>
			</div>
		</div>
		<div class="clear mt10" v-show="Four.checkbox">
			<span class="info_box_left font_3_14"></span>
			<div  class="info_box_right2 ml20" >
				<textarea class="wcc_textarea w300" name="" v-model="Four.Rules"></textarea>
			</div>
		</div>
		<div class="clear mt10" v-show="Four.checkbox">
			<span class="info_box_left font_3_14"></span>
			<div  class="info_box_right2 ml20 font_9_14">
				<span class="wcc_text inline_block" v-on:click="Four.Rules = Four.Rules2" >恢复默认</span>
				<span class="ml20">点击右侧标签可插入变量：</span>
				<span class="wcc_text_green"  v-on:click="Four.Rules += '{processed_phone_str}' ">{受邀人手机尾号}</span>
				<span class="ml20 wcc_text_green" v-on:click="Four.Rules += '{phont_str}' ">{油站名称}</span>
			</div>
		</div>
		<div class="wcc_error_box ml80" v-if="errorFour.Rules">
		    <div class="wcc_error"> 
		        <span class='iconfont'><i>&#xe674;</i></span> 
		        <span>@{{errorFour.Rules}}</span>
		     </div>
		</div>


		<div class="info_box_title mt20">
			1级成功邀请阶梯奖励设置
		</div> 
		<div class="clear mt20">
			<span class="info_box_left font_3_14">奖励类型</span>
			<div  class="info_box_right info_box_left ml20  font_9_14">
				直接邀请人成功邀请好友的数量达到一定阶梯时，给直接邀请人发放阶梯奖励
			</div>
		</div> 
		<div class="clear mt20">
			<span class="info_box_left font_3_14">是否奖励</span>
			<div  class="info_box_right ml20">
				<label for="info_radio1" class="info_radio_box">
					<div>
						<input id="info_radio1" type="checkbox" v-on:focus=" verify('errorFour','rewardAttr') " :checked="!!Four.rewardCheckbox"  v-model="Four.rewardCheckbox"  v-on:click="Four.rewardCheckbox==1?Four.rewardCheckbox==0:Four.rewardCheckbox==1;verify('errorFour','rewardAttr')"  >
						<div class="info_radio"></div>
					</div>
				</label>
			</div>
		</div>

		<div v-show="Four.rewardCheckbox" class="clear mt10" v-for=" (item,index) in Four.rewardAttr ">
			<!-- <span class="info_box_left font_3_14"></span> -->
			<div  class="info_box_right2 wcc_text_red1_none  font_9_14 box" >
				成功邀请第<input type="text" v-model="item.condition" :value="item.condition" v-on:focus=" verify('errorFour','rewardAttr') "   v-on:input="ev_numberInputLimit($event.target , 'condition' ,item)" class="wcc_input w60"> 人，
				
				<select-radio  v-bind:add="awardSetting2" class="w185 ml20 mr20" v-bind:select="awardSetting2[item.type]" :tempkey="index" v-on:selected="successfulLadderRewardFUN" v-bind:search-input="false" v-bind:radio='item.type'></select-radio>
				<div class="ml20" v-show="item.type == 0">
					<span>@{{item.data.length}}种，共@{{item.data.total}}张</span>
					<div class="wcc_btn_thin_bor_ash" v-on:click="ev_showCouponBox('rewardAttr',index)">抵用券设置</div>
				</div>
				<div class="ml20" v-show="item.type == 1">
					<span>奖励</span>
					<input type="text" name=""  :value="item.number" v-on:focus=" verify('errorFour','rewardAttr') "  v-on:input="ev_numberInputLimit($event.target ,'number',item)" class="wcc_input w60" >
					<span>个积分</span>
				</div>
				<div class="ml20" v-show="item.type == 2">
					<span>奖励</span>
					<input type="text" name=""  :value="item.number" v-on:focus=" verify('errorFour','rewardAttr') "  v-on:input="ev_numberInputLimit($event.target , 'number',item)" class="wcc_input w60" >
					<span>个积分和经验值</span>
				</div>
				<div v-if="status!=1" class="wcc,_text_green ml20" v-on:click="add(item,'rewardAttr',index)">添加</div>
				<div v-if="status!=1&&Four.rewardAttr.length>1" class="wcc_text_red ml20" v-on:click="rewardDelete(item,'rewardAttr',index)" >删除</div>
			</div>
		</div>
		<div class="wcc_error_box ml80" v-if="errorFour.rewardAttr">
		    <div class="wcc_error"> 
		        <span class='iconfont'><i>&#xe674;</i></span> 
		        <span>@{{errorFour.rewardAttr}}</span>
		     </div>
		</div>

		<div class="clear mt40" v-if="status!=1">
			<span class="info_box_left font_3_14"></span>
			<div  class="info_box_right ml20">
				<bottom class="wcc_btn_thin_bor_ash" v-on:click="listFun(2)">上一步</bottom>
				<bottom :class="{ wcc_btn_fat_allowed : errorFour.BonBoolen , wcc_btn_thin_green : !errorFour.BonBoolen } " v-on:click="checkD" >下一步</bottom>
			</div>
		</div>
	</div>
	<!-- 受邀人_收到邀请 -->
	<div class="info_box clear" :Mask="status" v-show="listaState==4&&!successBoolen">
		<div class="info_box_title mt20">
			 收到邀请的资格设置
		</div>
		<div class="clear mt20">
			<span class="info_box_left font_3_14">谁可以收到邀请</span>
			<div  class="info_box_right info_box_left ml20 font_9_14">
				<label for="radio1" class="wcc_label">
				     <input type="radio" id="radio1" name="taxyer_type2" :checked="Five.radio==1?'checked':false" v-model="Five.radio"  value='1' >
				       <span class="wcc_label_radio"><i></i></span>
				     <span class='text'>未注册过集团会员的用户</span>
				</label>
				<label for="radio2" class="wcc_label">
				     <input type="radio" id="radio2" name="taxyer_type2" :checked="Five.radio==2?'checked':false" v-model="Five.radio" value='2'>
				       <span class="wcc_label_radio"><i></i></span>
				     <span class='text'>未加过油的用户</span>
				</label>
			</div>
		</div>
		<div class="info_box_title mt20">
			 收到邀请时页面设置
		</div> 
		<div class="clear">
			<div class="info_left_box">
				<div class="clear mt20">
					<span class="info_box_left font_3_14">主标语</span>
					<div  class="info_box_right ml20">
						<input class="wcc_input w300" type="text" :class="{wcc_input_error : errorFive.slogan}" v-model="Five.slogan"  v-on:focus=" verify('errorFive','slogan') "  name="" value="" placeholder="请输入主标语" >
					</div>
				</div>
				<div class="wcc_error_box ml80" v-if="errorFive.slogan">
				    <div class="wcc_error"> 
				        <span class='iconfont'><i>&#xe674;</i></span> 
				        <span>@{{errorFive.slogan}}</span>
				     </div>
				</div> 
				<div class="clear mt20">
					<span class="info_box_left font_3_14">引导标语</span>
					<div  class="info_box_right2 ml20">
						<textarea class="wcc_textarea w300" name="" :class="{wcc_input_error : errorFive.guide}"  v-model="Five.guide" v-on:focus=" verify('errorFive','guide') " placeholder="请输入引导标语" ></textarea>
					</div>
				</div>
				<div class="wcc_error_box ml80" v-if="errorFive.guide">
				    <div class="wcc_error"> 
				        <span class='iconfont'><i>&#xe674;</i></span> 
				        <span>@{{errorFive.guide}}</span>
				     </div>
				</div> 
				<div class="clear mt20">
					<span class="info_box_left font_3_14">提示语</span>
					<div  class="info_box_right ml20">
						<input class="wcc_input w300" type="text" name="" value="" :class="{wcc_input_error : errorFive.Hint}"  v-on:focus=" verify('errorFive','Hint') "  v-model="Five.Hint" placeholder="请输入提示语" >
					</div>
				</div>
				<div class="wcc_error_box ml80" v-if="errorFive.Hint">
				    <div class="wcc_error"> 
				        <span class='iconfont'><i>&#xe674;</i></span> 
				        <span>@{{errorFive.Hint}}</span>
				     </div>
				</div>
			</div>
			<div class="info_right_box">
				<div class="info_mobile mt20">
					<div class="info_mobile_title">@{{One.activityNameLeft}} | @{{One.activityNameRight}}</div>
					<div class="info_mobile_content public_scrollBrowser" :style="' background-image: url('+backgroud_img+') '">
						<div class="info_mobile_core">
							<span class="font_9_12">2018-1-29 15:58:40</span>
							<img class="info_mobile_core_img" :src="banner" alt="">
							<div class="font_3_14 align_center mt10">@{{Five.slogan || '写点主标语呗'}}</div>
							<div class="font_9_12 align_center mt10">@{{Five.guide  || '写点引导标语呗'}}</div>
							<div class="font_9_14 align_center mt20">活动规则></div>
							<div class="font_9_14 align_center mt20">你的手机号: 158*****552</div>
							<div class="info_mobile_core_button_box clear mt20">
								<div class="info_mobile_core_button3">
								 	@{{Five.slogan|| '写点主标语呗'}}
								</div>
							</div>
							<div class="font_9_12  mt10 align_center">@{{Five.Hint  || '写点提示语呗'}}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="clear mt40" v-if="status!=1">
			<span class="info_box_left font_3_14"></span>
			<div  class="info_box_right ml20">
				<bottom class="wcc_btn_thin_bor_ash" v-on:click="listFun(3)">上一步</bottom>
				<bottom :class="{ wcc_btn_fat_allowed : errorFive.BonBoolen , wcc_btn_thin_green : !errorFive.BonBoolen } " v-on:click="checkE" >下一步</bottom>
			
			</div>
		</div>
	</div>
	<!-- 受邀人__接受邀请 -->
	<div class="info_box clear" :Mask="status" v-show="listaState==5&&!successBoolen">
		<div class="info_box_title mt20">
			受邀奖励设置
			<div class="info_box_ask wcc_hover">
				? 
				<div class="wcc_tips wcc_tips_right info_wcc_tips_right">发出邀请的页面，是每个人活动的主页面，建议在文案上引诱用户参与活动</div>
			</div>
		</div>
		<div class="clear mt20">
			<span class="info_box_left font_3_14">奖励类型</span>
			<div  class="info_box_right info_box_left ml20 font_9_14">
				受邀人接受了好友邀请时，给受邀人发放奖励
			</div>
		</div>

		<div class="clear mt20">
			<span class="info_box_left font_3_14">奖励内容</span>
			<div  class="info_box_right ml20 box2" style="max-width:630px; height: auto;">
				<div style="height: 40px;">
					<select-radio v-bind:add="awardSetting3" v-if="Six.issueInvitationState>-1" class="w185" tempkey="Six" v-bind:select="awardSetting3[Six.issueInvitationState]" v-on:selected="selectRadioFun" v-bind:search-input="false" v-bind:radio='Six.issueInvitationState'></select-radio>
				</div>
				<div class="ml20" v-show="Six.issueInvitationState == 1">
					<span>@{{Six.awardSettingVoucher.length}}种，共@{{Six.awardSettingVoucher.total}}张</span>
					<div class="wcc_btn_thin_bor_ash" v-on:click="ev_showCouponBox('awardSettingVoucher')">抵用券设置</div>
				</div>
				<div class="ml20" v-show="Six.issueInvitationState == 2">
					<span>奖励</span>
					<input type="text" :value="Six.awardSettingIntegral" v-on:input="ev_numberInputLimit($event.target , 'awardSettingIntegral')" class="wcc_input w60" >
					<span>个积分</span>
				</div>
				<div class="ml20" v-show="Six.issueInvitationState == 3">
					<span>奖励</span>
					<input type="text" name="" :value="Six.awardSettingExperience" v-on:input="ev_numberInputLimit($event.target , 'awardSettingExperience')" class="wcc_input w60" >
					<span>个积分和经验值</span>
				</div>
				<div class="ml20 clear w555" v-show="Six.issueInvitationState == 4">
					<div class='created_Reappearance' :class="{mt20:index>0}" v-for="(item , index ) in Six.aiscount">
						<span class='text'>按</span><select-radio class="w160" 
						v-bind:model="true" 
						v-bind:add="item.oilAttr" 
						v-bind:select="item.oilAttr[item.index]"
						v-bind:radio='item.index'
						v-on:selected="selectAiscountFun"
						v-bind:tempkey="index" 
						></select-radio>
						<span  class='text'>优惠</span><input  type='text' class="wcc_input w54 text" :value="item.money" v-on:blur="Number(item.money)<1?item.money=1:item.money"  v-on:input="ev_numberInputLimit($event.target , 'money',item)"><span  class='text'>毛/升</span>
						<span v-if="index==0" class="wcc_add" v-on:click="addAiscount">添加</span>
						<span v-else class="wcc_text_green" v-on:click="deleteAiscount(index)">删除</span>
					</div>
					
				</div>
			</div>
		</div>

		<div class="wcc_error_box ml80" v-show="errorSix.reward">
		    <div class="wcc_error"> 
		        <span class='iconfont'><i>&#xe674;</i></span> 
		        <span>@{{errorSix.reward}}</span>
		     </div>
		</div>
		<div class="info_box_title mt20">
			 邀请通知设置
			 <div class="info_box_ask wcc_hover">
				? 
				<div class="wcc_tips wcc_tips_right info_wcc_tips_right">发出邀请的页面，是每个人活动的主页面，建议在文案上引诱用户参与活动</div>
			</div>
		</div>

		<div class="clear mt20">
			<span class="info_box_left font_3_14">奖励类型</span>
			<div  class="info_box_right info_box_left ml20 font_9_14">
				受邀人接受了好友邀请时，给受邀人发放通知，引导受邀人去完成邀请;一般适用于邀请好友去加油的模式
			</div>
		</div>
		<div class="clear mt20">
			<span class="info_box_left font_3_14">是否通知</span>
			<div  class="info_box_right ml20">
				<label for="info_radioSix" class="info_radio_box" v-on:click="Six.checkbox==1?Six.checkbox=0:Six.checkbox=1;verify('errorSix','Rules')">
					<input id="info_radioSix" type="checkbox" :checked="!!Six.checkbox"  v-model="Six.checkbox"   >
					<div class="info_radio"></div>
				</label>
			</div>
		</div>
		<div class="clear mt10" v-show="Six.checkbox">
			<span class="info_box_left font_3_14" ></span>
			<div  class="info_box_right2 ml20">
				<textarea class="wcc_textarea w300" v-model="Six.Rules"   v-on:focus=" verify('errorSix','Rules') "></textarea>
			</div>
		</div>
		<div class="clear mt10" v-show="Six.checkbox">
			<span class="info_box_left font_3_14"></span>
			<div  class="info_box_right2 ml20 font_9_14">
				<span class="wcc_text inline_block" v-on:click="Three.Rules = Three.Rules2">恢复默认</span>
				<span class="ml20">点击右侧标签可插入变量：</span>
				<span class="wcc_text_green" v-on:click="Three.Rules += '{processed_phone_str}'">{直接邀请人手机尾号}</span>
				<span class="ml20 wcc_text_green" v-on:click="Three.Rules += '{address}'">{油站/集团名称}</span>
			</div>
		</div>
		<div class="wcc_error_box ml80" v-if="Six.checkbox==1&&errorSix.Rules">
		    <div class="wcc_error"> 
		        <span class='iconfont'><i>&#xe674;</i></span> 
		        <span>@{{errorSix.Rules}}</span>
		     </div>
		</div>



		<div class="info_box_title mt20">
			 收到邀请后页面设置
			 <div class="info_box_ask wcc_hover">
				? 
				<div class="wcc_tips wcc_tips_right info_wcc_tips_right">收到邀请的页面，是受邀人收到邀请时看到的页面，建议在文案上引诱用户接收邀请</div>
			</div>
		</div>
		<div class="clear">
			<div class="info_left_box">
				<div class="clear mt20">
					<span class="info_box_left font_3_14 w80">主标语</span>
					<div  class="info_box_right ml20">
						<input class="wcc_input w300" type="text" :class="{wcc_input_error : errorSix.slogan}" v-model="Six.slogan"  v-on:focus=" verify('errorSix','slogan') "  name="" value="" placeholder="请输入主标语" >
					</div>
				</div>
				<div class="wcc_error_box ml80" v-if="errorSix.slogan">
				    <div class="wcc_error"> 
				        <span class='iconfont'><i>&#xe674;</i></span> 
				        <span>@{{errorSix.slogan}}</span>
				     </div>
				</div> 
				<div class="clear mt20">
					<span class="info_box_left font_3_14 w80">引导标语</span>
					<div  class="info_box_right2 ml20">
						<textarea class="wcc_textarea w300" name="" :class="{wcc_input_error : errorSix.guide}"  v-model="Six.guide" v-on:focus=" verify('errorSix','guide') " placeholder="请输入引导标语" ></textarea>
					</div>
				</div>
				<div class="wcc_error_box ml80" v-if="errorSix.guide">
				    <div class="wcc_error"> 
				        <span class='iconfont'><i>&#xe674;</i></span> 
				        <span>@{{errorSix.guide}}</span>
				     </div>
				</div> 
				<div class="clear mt20">
					<span class="info_box_left font_3_14 w80">提示语(默认)</span>
					<div  class="info_box_right ml20">
						<input class="wcc_input w300" type="text" name="" value="" disabled="disabled" v-model="Five.Hint" placeholder="请输入提示语" >
					</div>
				</div>
				<div class="clear mt10">
					<span class="info_box_left font_3_14 w80"></span>
					<div  class="info_box_right ml20 font_9_12">
						请到上一步"受邀人设置_收到邀请时"的页面设置
					</div>
				</div>
				
			</div>
			<div class="info_right_box">
				<div class="info_mobile mt20">
					<div class="info_mobile_title">@{{One.activityNameLeft}} | @{{One.activityNameRight}}</div>
					<div class="info_mobile_content public_scrollBrowser" :style="' background-image: url('+backgroud_img+') '">
						<div class="info_mobile_core">
							<span class="font_9_12">2018-1-29 15:58:40</span>
							<img class="info_mobile_core_img" :src="banner" alt="">
							<div class="font_3_14 align_center mt10">@{{Six.slogan || '写点主标语呗'}}</div>
							<div class="font_9_12 align_center mt10">@{{Six.guide  || '写点引导标语呗'}}</div>
							<div class="font_9_14 align_center mt20">活动规则></div>
							<div class="font_9_14 align_center mt20">你的手机号: 158*****552</div>
							<div class="info_mobile_core_button_box clear mt20">
								<div class="info_mobile_core_button3">
								 	@{{Six.slogan || '写点主标语呗'}}
								</div>
							</div>
							<div class="font_9_12  mt10 align_center">@{{Five.Hint  || '写点提示语呗'}}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="clear mt40" v-if="status!=1">
			<span class="info_box_left font_3_14"></span>
			<div  class="info_box_right ml20">
				<bottom class="wcc_btn_thin_bor_ash" v-on:click="listFun(4)">上一步</bottom>
				<bottom :class="{ wcc_btn_fat_allowed : errorSix.BonBoolen , wcc_btn_thin_green : !errorSix.BonBoolen } " v-on:click="checkF" >下一步</bottom>
			</div>
		</div>
	</div>
	<!-- 受邀人_完成邀请 -->
	<div class="info_box clear" :Mask="status" v-show="listaState==6&&!successBoolen">
		<div class="info_box_title mt20">
			完成邀请的条件设置
			<div class="info_box_ask wcc_hover">
				? 
				<div class="wcc_tips wcc_tips_right info_wcc_tips_right">发出邀请的页面，是每个人活动的主页面，建议在文案上引诱用户参与活动</div>
			</div>
		</div>
		<template v-if="is_baoJi==1||Seven.radio==4">
			<div class="clear mt20">
				<span class="info_box_left font_3_14">怎么完成邀请</span>
				<div  class="info_box_right info_box_left ml20 font_9_14">
					注册成为集团会员并进行加油
				</div>
			</div>
		</template>
		<template v-else>
			<div class="clear mt20">
				<span class="info_box_left font_3_14">怎么完成邀请</span>
				<div  class="info_box_right info_box_left ml20 font_9_14">
					<label for="radio3" class="wcc_label">
						<input type="radio" id="radio3" name="taxyer_type1" :checked="Seven.radio==1?'checked':false" v-model="Seven.radio"  value='1'>
						<span class="wcc_label_radio"><i></i></span>
						<span class='text'>在受邀页面注册成为集团会员（即点击接收邀请后即可完成邀请）</span>
					</label>
				</div>
			</div>
			<div class="clear">
				<span class="info_box_left font_3_14" style="width:6em;"></span>
				<div  class="info_box_right info_box_left ml20 font_9_14">
					<label for="radio4" class="wcc_label">
						<input type="radio" id="radio4" name="taxyer_type1" :checked="Seven.radio==2?'checked':false" v-model="Seven.radio"  value='2'>
						<span class="wcc_label_radio"><i></i></span>
						<span class='text'>在有效期内加油滿足一定条件</span>
					</label>
				</div>
			</div>
		</template>

		<div class="clear mt20"  v-if="Seven.radio==2">
			<span class="info_box_left font_3_14">邀请有效时间</span>
			<div  class="info_box_right ml20 box">
				在接收邀请的<input  :value="Seven.dayNumber" v-on:focus="verify('errorSeven','dayNumber');errorSeven.threshold='';errorSeven.BonBoolen=false;" v-on:input="ev_numberInputLimit($event.target ,'dayNumber',Seven)" class="wcc_input w80" type="text">天内
			</div>
		</div> 
		<div class="wcc_error_box ml80" v-if="errorSeven.dayNumber">
		    <div class="wcc_error"> 
		        <span class='iconfont'><i>&#xe674;</i></span> 
		        <span>@{{errorSeven.dayNumber}}</span>
		     </div>
		</div>
		<div class="clear mt20" v-for="(item,index) in Seven.threshold" v-if="Seven.radio==2">
			<span class="info_box_left font_3_14 w84" v-if="index==0">加油门槛</span>
			<span class="info_box_left font_3_14 w84"  v-else></span>
			<div  class="info_box_right2 ml20 box" >
				<div class="box">
					<select-radio v-bind:add="OilGetOil" :tempkey="index" v-if="index==0"  model="true" class="w167" v-bind:select="OilGetOil[item.limit_id]" v-on:selected="OilGetOilSelect" v-bind:search-input="false" v-bind:radio='item.limit_id'></select-radio>
					<select-radio v-bind:add="OilGetOilB" :tempkey="index" v-else model="true" class="w167" v-bind:select="OilGetOilB[item.limit_id]" v-on:selected="OilGetOilSelect" v-bind:search-input="false" v-bind:radio='item.limit_id'></select-radio>
					<select-radio v-bind:add="typeSelect" :tempkey="index" class="w167 ml20" v-bind:select="typeSelect[item.limit_type]" v-on:selected="typeSelectFun" v-bind:search-input="false" v-bind:radio='item.limit_type'></select-radio>
					<div class="ml20">满</div><input type="text" name="" v-on:focus="errorSeven.threshold='';errorSeven.BonBoolen=false" v-on:input="ev_numberInputLimit($event.target ,'limit_amount',item,true)"  class="wcc_input w60 mlr5" :value="item.limit_amount" placeholder="">元/升
					<span class="wcc_text_green ml20" v-on:click="thresholdAdd(index)" >添加</span>
					<span class="wcc_text_green wcc_text_red ml20" v-on:click="rewardDelete(item,'threshold',index)" v-if="Seven.threshold.length>1">删除</span>
				</div>
			</div>
		</div>
		<div class="wcc_error_box ml80" v-if="Seven.radio==2&&errorSeven.threshold">
		    <div class="wcc_error"> 
		        <span class='iconfont'><i>&#xe674;</i></span> 
		        <span>@{{errorSeven.threshold}}</span>
		     </div>
		</div>
		<!-- <div class="info_box_title mt20">
			 邀请通知设置
			 <div class="info_box_ask wcc_hover">
				? 
				<div class="wcc_tips wcc_tips_right info_wcc_tips_right">发出邀请的页面，是每个人活动的主页面，建议在文案上引诱用户参与活动</div>
			</div>
		</div> -->

		<!-- <div class="clear mt20">
			<span class="info_box_left font_3_14">奖励类型</span>
			<div  class="info_box_right info_box_left ml20 font_9_14">
				用户完成邀请时，给受邀人发放通知，引导受邀人去完成邀请
			</div>
		</div>
		<div class="clear mt20">
			<span class="info_box_left font_3_14">是否通知</span>
			<div  class="info_box_right ml20">
				<label for="info_radio6" class="info_radio_box">
					<input id="info_radio6" type="checkbox" :checked="!!Seven.checkbox"  v-model="Seven.checkbox" v-on:click="Seven.checkbox==1?Three.checkbox==0:Seven.checkbox==1;verify('errorSeven','Rules')"  >
					<div class="info_radio"></div>
				</label>
			</div>
		</div>
		<div class="clear mt10" v-show="Seven.checkbox">
			<span class="info_box_left font_3_14"></span>
			<div  class="info_box_right2 ml20">
				<textarea class="wcc_textarea w300" v-model="Seven.Rules"   v-on:focus=" verify('errorSeven','Rules') "></textarea>
			</div>
		</div>
		<div class="clear mt10" v-show="Seven.checkbox">
			<span class="info_box_left font_3_14"></span>
			<div  class="info_box_right2 ml20 font_9_14">
				<span class="wcc_text inline_block" v-on:click="Seven.Rules = Seven.Rules2">恢复默认</span>
				<span class="ml20">点击右侧标签可插入变量：</span>
				<span class="wcc_text_green" v-on:click="Seven.Rules += '{porcessed_phont_str}'">{1级邀请人手机尾号}</span>
				<span class="ml20 wcc_text_green" v-on:click="Seven.Rules += '{address}'">{油站名称}</span>
			</div>
		</div>
		<div class="wcc_error_box ml80" v-if="Seven.checkbox==1&&errorSeven.Rules">
		    <div class="wcc_error"> 
		        <span class='iconfont'><i>&#xe674;</i></span> 
		        <span>@{{errorSeven.Rules}}</span>
		     </div>
		</div> -->

		<div class="clear mt40" v-if="status!=1">
			<span class="info_box_left font_3_14"></span>
			<div  class="info_box_right ml20">
				<bottom class="wcc_btn_thin_bor_ash" v-on:click="listFun(5)">上一步</bottom>
				<bottom :class="{ wcc_btn_fat_allowed : errorSeven.BonBoolen , wcc_btn_thin_green : !errorSeven.BonBoolen } " v-on:click="checkG" > @{{One.activityType == 0?'提交':'下一步'}}</bottom>
			</div>
		</div>
	</div>
	<!-- 2级邀请人_好友成功邀请其他好友 -->
	<div class="info_box clear" :Mask="status" v-show="listaState==7&&!successBoolen">
		<div class="info_box_title mt20">
			2级邀奖励设置
			<div class="info_box_ask wcc_hover">
				? 
				<div class="wcc_tips wcc_tips_right info_wcc_tips_right">发出邀请的页面，是每个人活动的主页面，建议在文案上引诱用户参与活动</div>
			</div>
		</div>
		<div class="clear mt20">
			<span class="info_box_left font_3_14">奖励类型</span>
			<div  class="info_box_right info_box_left ml20 font_9_14">
				成功邀请来的好友，成功邀请了他的好友时给间接邀请人发放的奖励
			</div>
		</div>
				<div class="clear mt20">
			<span class="info_box_left font_3_14">奖励内容</span>
			<div  class="info_box_right ml20 box">
				<div>
					<select-radio v-bind:add="awardSetting" class="w185" v-if="Eight.issueInvitationState>-1" tempkey="Eight" v-bind:select="issueInvitation[Six.issueInvitationState]" v-on:selected="selectRadioFun" v-bind:search-input="false" v-bind:radio='Six.issueInvitationState'></select-radio>
				</div>
				<div class="ml20" v-show="Eight.issueInvitationState == 1">
					<span>@{{Eight.awardSettingVoucher.length}}种，共@{{Eight.awardSettingVoucher.total}}张</span>
					<div class="wcc_btn_thin_bor_ash" v-on:click="ev_showCouponBox('awardSettingVoucher')">抵用券设置</div>
				</div>
				<div class="ml20" v-show="Eight.issueInvitationState == 2">
					<span>奖励</span>
					<input type="text" :value="Eight.awardSettingIntegral" v-on:input="ev_numberInputLimit($event.target , 'awardSettingIntegral')" class="wcc_input w60" >
					<span>个积分</span>
				</div>
				<div class="ml20" v-show="Eight.issueInvitationState == 3">
					<span>奖励</span>
					<input type="text" name="" :value="Eight.awardSettingExperience" v-on:input="ev_numberInputLimit($event.target , 'awardSettingExperience')" class="wcc_input w60" >
					<span>个积分和经验值</span>
				</div>

			</div>
		</div> 

		<div class="wcc_error_box ml80" v-if="errorEight.reward">
		    <div class="wcc_error"> 
		        <span class='iconfont'><i>&#xe674;</i></span> 
		        <span>@{{errorEight.reward}}</span>
		     </div>
		</div> 

		<div class="clear mt40" v-if="status!=1">
			<span class="info_box_left font_3_14"></span>
			<div  class="info_box_right ml20">
				<bottom class="wcc_btn_thin_bor_ash" v-on:click="listFun(6)">上一步</bottom>
				<bottom :class="{ wcc_btn_fat_allowed : errorEight.BonBoolen , wcc_btn_thin_green : !errorEight.BonBoolen } " v-on:click="checkH" >提交</bottom>
			</div>
		</div>
	</div>
	<div class="create-success-box" v-show="successBoolen">
		<div class="created-link">
			<div class="created-header">
				<div class="created-succ-icon"><i class="fonticon">&#xe65a;</i></div>
				<div class="created-title">创建成功</div>
			</div>
			<div>
				活动链接<input id="scan_code" class="wcc_input created-activity-link created_activity_link" type="text" :value="successBoolen"><a class="copy-link-btn" v-on:click="$.copy(successBoolen)" href="javascript:;">复制</a>
			</div>
			<div  class="mt20 wcc_btn_fat_box">
				<a class="wcc_btn_fat_bor_green mr10 " :href="'/InviteFriend/info?id='+activity_id">好友邀请详情</a>
				<a class="wcc_btn_fat_bor_ash ml10" href="/InviteFriend/lists">好友邀请列表页</a>
			</div>
		</div>
		<div class="share-list-box" style="text-align: center;">
			<div class="share-box">
				<div class="share-box-title">
					设置公众号
				</div>
				<div class="share-sub-title">
					将活动链接设置到公众号菜单，让更多人参与活动
				</div>
				<div class="share-tip-img">
					<img src="https://fs1.weicheche.cn/activity/origin/2018030311170320491.png" alt="">
				</div>
				<div class="share-box-footer">
					<a class="wcc_btn_fat_bor_green" href="/Weixin/menu" target="_blank">将活动设置到公众号菜单</a>
				</div>
			</div>
			<div class="share-box">
				<div class="share-box-title">
					活动二维码
				</div>
				<div class="share-sub-title">
					下载活动二维码并打印，通过扫码让更多用户参与活动
				</div>
				<div class="share-tip-img">
					<div class="activity_code">

					</div>
				</div>
				<div class="share-box-footer">
					<a class="wcc_btn_fat_bor_green" id="download_qrcode" href="" download="活动二维码.png">下载二维码</a>
				</div>
			</div>
		</div>
	</div>




</div>

@endsection


@section('elastic')
    <div class="couponSelectContainer" id="couponSelect" style="display:none" v-show="show">
        <div class="couponSelectContainer_box">
            <div class="couponSelectContainer_title">
                <em>添加劵规则</em>
                <div class="couponSelectContainer_close" v-on:click="show = 0">×</div>
            </div>
            <div class="couponSelectContainer_content">
                <div class="couponSelectContainer_content_list">

                    <template if="coupon_array.length" v-for="(item,key) in coupon_array">
                        <div class="couponSelectContainer_content_list_box" v-on:mouseenter.stop="ev_hoverCoupon($event,item,key)" v-on:mouseleave.stop="ev_hoveroutCoupon">
                            <div class="couponSelectContainer_content_list_block">
                                <div class="wcc_selectStation_listBlock" v-bind:isselect="Number(item.is_vue_selected)">
                                    <label class="wcc_label_checkbox">
                                        <input type="checkbox" v-bind:checked="Boolean(item.is_vue_selected)" v-on:change="ev_selectedCoupon($event,item,key)" />
                                        <div class="wcc_checkbox"><span>&#xe67d;</span></div>
                                    </label>
                                    <span class="wcc_selectStation_text" v-bind:title="item.coupon_name"> @{{ item.length }}--@{{item.coupon_name.length > 16 ? item.coupon_name.slice(0,15) + '...' : item.coupon_name}}</span>
                                </div>
                                <template v-if="item.is_vue_selected">
                                    <div class="couponSelectContainer_content_list_countBox">
                                        <input class="wcc_input" type="number" v-model="transmit_array[item.coupon_id].count" v-on:input="ev_changeCouponNumber($event,item.coupon_id)" v-on:keydown="ev_numberInputLimit($event)" />
                                        <span>张</span>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </template>

                </div>
                <div class="couponSelectContainer_content_detail" v-show="coupon_detail.length">
                    <div class="couponSelectContainer_content_detail_title">优惠券信息</div>
                    <template v-for="item in coupon_detail">
                        <div class="couponSelectContainer_content_detail_block">
                            <div class="couponSelectContainer_content_detail_block_left">@{{item.name}}:</div>
                            <div class="couponSelectContainer_content_detail_block_right" v-html="item.value"></div>
                        </div>
                    </template>
                </div>
            </div>
            <div class="couponSelectContainer_footer">
                <div class="wcc_btn_fat_green" v-on:click="show = 0">确定</div>
            </div>
        </div>
    </div>
@endsection


@section('footer')
	<script>
	var st_logo = '{{$st_logo}}';
	var station_select = '{!!json_encode($station_arr_selected)!!}';
	var with_group_id = "{{$with_group_id}}";
	
		// console.log(ostn_id,group_id)
	</script>
	<script src="/js/jquery.qrcode.min.js?v={{config('constants.wcc_file_version')}}"></script>
	<script src="/js/vue_component.js?v={{config('constants.wcc_file_version')}}"></script>
	<script src="/js/vendor/Plug/Plug.js?v={{config('constants.wcc_file_version')}}"></script>
	<script src="/js/InviteFriend/info.js?v={{config('constants.wcc_file_version')}}"></script>
@endsection