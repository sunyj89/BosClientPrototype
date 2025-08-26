@extends('layout/master')

@section('header')
	<link rel="stylesheet" type="text/css" href="/css/wcc.css">
	<!-- <link rel="stylesheet" href="/js/vendor/bootstrap/css/bootstrap.min.css?v={{config('constants.wcc_file_version')}}"> -->
	<link rel="stylesheet" href="/css/common/common.css?v={{config('constants.wcc_file_version')}}">
<style>
	.outTabs {
		padding: 10px 30px;
	}
	.el-tabs--left .el-tabs__item.is-left {
		text-align: left;
	}
	.tmpText {
		padding: 15px 20px;
		font-weight: bold;
	}
	.tmp_menu {
		width: 200px;
		border: 1px solid #ccc;
		background: #FBFBFB;
	}
	.tmp_center {
		width: 500px;
	}
	.el-color-picker{
		height: 25px;
		width: 25px;
		position: absolute;
		margin-top: 6px;
		margin-left: -15px;
	}
	.el-color-picker__trigger{
		height: 25px;
		width: 25px;
		padding: 2px;
	}
	.tmp_warn {
		line-height:18px;
		display:inline-block;
		position: absolute;
	}
	.tmp_right {
		position: relative;
		width: 300px;
		margin: 50px 0 0 40px;
		padding: 25px 20px;
		border: 1px solid #DCDCDC;
	}
	.right_head {
		font-weight: bold;
		font-size: 18px;
	}
	.right_head2 {
		color: #999;
		margin-top: 5px;
		margin-bottom: 20px;
	}
	.right_info {
		padding: 2px 0;
	}
	.right_botm {
		position: absolute;
		bottom: 50px;
		left: 50%;
		transform: translateX(-50%);
	}
	.right_btn {
		background: #fff;
		color: #32AF50;
		border:1px solid #32AF50;
	}
	.right_btn:hover {
		background: #fff;
		color: #32AF50;
	}

	/* 数量统计 */
	.tab2_head {
		height: 100px;
		display: flex;
	}
	.head_inner {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 200px;
		height: 80px;
		padding: 10px;
		color: #999;
	}
	.inner_border {
		width: 1px;
		height: 40px;
		background: #EAEAEA;
	}
	.inner_num {
		margin-top: 10px;
	}
	.inner_num span {
		color: #0096F6;
		font-size: 32px;
		font-weight: bold;
	}
	.tab2_menu {
		width: 160px;
		border: 1px solid #ccc;
		background: #FBFBFB;
	}
</style>
@endsection

@section('content')

<div id="templateApp">
	<el-tabs v-model="activeName" class="outTabs">
		<el-tab-pane label="模板消息设置" name="1">
			<div style="display:flex;">
				<el-menu default-active="1100" class="tmp_menu">
					<div class="tmpText">我的模板</div>
					<el-menu-item v-for="(v,i) in menus_one" :index="v.index" @click="clickTmp(v)">
						<span slot="title">@{{ v.name }}</span>
					</el-menu-item>
				</el-menu>

				<div class="tmp_center">
					<el-form :model="ruleForm" status-icon ref="ruleForm" label-width="100px" class="demo-ruleForm">
						<div class="tmpText">模板消息设置</div>
						<el-form-item label="备注内容">
							<el-input type="textarea" v-model="ruleForm.remark"  maxlength="150" show-word-limit :rows="6"></el-input>
						</el-form-item>
						<el-form-item label="备注颜色">
							<el-radio v-model="ruleForm.color" label="1">默认</el-radio>
  							<el-radio v-model="ruleForm.color" label="2">自定义颜色</el-radio>
							<el-color-picker v-model="ruleForm.color1"></el-color-picker>
						</el-form-item>
						<el-form-item label="跳转链接">
							<el-radio v-model="ruleForm.link_type" label="0">不跳转</el-radio>
  							<el-radio v-model="ruleForm.link_type" label="1">第三方应用</el-radio>
  							<el-radio v-model="ruleForm.link_type" label="2">固定链接</el-radio>
						</el-form-item>
						<el-form-item label="链接地址">
							<el-input v-model="ruleForm.link_url" :disabled="ruleForm.link_type==0" placeholder="请输入链接地址" style="width: 300px;"></el-input>
						</el-form-item>
						<el-form-item label="发送测试" v-show="false">
							<el-input v-model="ruleForm.phone" placeholder="请输入手机号" style="width: 180px;"></el-input>
							<i class="el-icon-warning warning-icon" style="color: #F6A722;"></i>	
							<div class="tmp_warn">用于接受测试模板消息<br>请先确认关注公众号</div>
						</el-form-item>
						<el-form-item>
							<el-button @click="">取消</el-button>
							<el-button type="primary" @click="submit" :disabled="showBtn">确认</el-button>
						</el-form-item>
					</el-form>
				</div>

				<div class="tmp_right">
					<div class="right_head">微信支付成功通知</div>
					<div class="right_head2"></div>
					<!-- <div class="right_info">充值时间：2022年12月25日 12:25:25</div>
					<div class="right_info">充值地址：中国钓鱼岛加油站</div>
					<div class="right_info">充值金额：1000元</div>
					<div class="right_info">账户余额：1234元</div> -->
					<div class="right_info">
						<span id="remark"></span>
					</div>
					<div style="height: 70px;"></div>
					<div class="right_botm">
						<el-button type="primary" class="right_btn" @click="showEffect">预览效果</el-button>
					</div>
				</div>
			</div>
		</el-tab-pane>
		<el-tab-pane label="点击数量统计" name="2" v-if="false">
			<div class="tab2_head">
				<div class="head_inner">
					<div>
						<div>总点击量</div>
						<div class="inner_num"><span>8000</span>人</div>
					</div>
					<div class="inner_border"></div>
				</div>
				<div class="head_inner">
					<div>
						<div>广告1点击量</div>
						<div class="inner_num"><span>1000</span>人</div>
					</div>
					<div class="inner_border"></div>
				</div>
				<div class="head_inner">
					<div>
						<div>广告2点击量</div>
						<div class="inner_num"><span>6000</span>人</div>
					</div>
					<div class="inner_border"></div>
				</div>
				<div class="head_inner">
					<div>
						<div>广告3点击量</div>
						<div class="inner_num"><span>1000</span>人</div>
					</div>
				</div>
			</div>
			<div style="display: flex;">
				<el-menu default-active="1" class="tab2_menu">
					<el-menu-item index="1" @click="clickLogs(1)">
						<span slot="title">全部点击记录</span>
					</el-menu-item>
					<el-menu-item index="2" @click="clickLogs(2)">
						<span slot="title">广告1</span>
					</el-menu-item>
					<el-menu-item index="3" @click="clickLogs(3)">
						<span slot="title">广告2</span>
					</el-menu-item>
					<el-menu-item index="4" @click="clickLogs(4)">
						<span slot="title">广告3</span>
					</el-menu-item>
				</el-menu>
				<el-table :data="tableData" style="width: 100%">
					<el-table-column align="center" prop="phone" label="手机" width="120"></el-table-column>
					<el-table-column align="center" prop="user" label="用户ID" width="180"></el-table-column>
					<el-table-column align="center" prop="time" label="点击时间" width="180"></el-table-column>
					<el-table-column align="center" prop="logs" label="生成日志" width="180"></el-table-column>
					<el-table-column ></el-table-column>
				</el-table>
			</div>
			<el-pagination
				style="margin: 10px 0 0 0;"
				background
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="page"
				:page-sizes="[10, 20, 30, 40]"
				:page-size="sizes"
				layout="prev, pager, next, sizes, total"
				:total="400">
			</el-pagination>
		</el-tab-pane>
  	</el-tabs>

	


</div>

@endsection

@section('footer')
<script src="/js/wcc-element-ui/vue.js?v={{config('constants.wcc_file_version')}}"></script>
<script src="/js/wcc-element-ui/index.js?v={{config('constants.wcc_file_version')}}"></script>
<script src="/js/vendor/bootstrap/js/bootstrap.min.js?v={{config('constants.wcc_file_version')}}"></script>
<script src="/js/vendor/moment/moment.min.js?v={{config('constants.wcc_file_version')}}"></script>
<script>

	new Vue({
		el: '#templateApp',
		data() {
			return {
				activeName: '1', //标签页
				menus_one:[ // 菜单一
					{
						index: '1100',
						name: '微信支付成功通知'
					},
					{
						index: '1200',
						name: '积分变动通知'
					},
					{
						index: '3001',
						name: '券发放通知'
					},
				],
				index_one: '1100',// 菜单一
				index_two: '1',// 菜单二
				group_id: '{{$group_id}}',
				ruleForm: {
					remark: '',
					color: '1',
					color1: '#32AF50',
					link_type: '0',
					link_url: '',
				},
				tableData: [
					{
						phone: '18712345678',
						user: '21042504648685046486',
						time: '2022/12/25 14:30:20',
						logs: '2022/12/25 14:30:20',
					},
					{
						phone: '18712345678',
						user: '21042504648685046486',
						time: '2022/12/25 14:30:20',
						logs: '2022/12/25 14:30:20',
					},
					{
						phone: '18712345678',
						user: '21042504648685046486',
						time: '2022/12/25 14:30:20',
						logs: '2022/12/25 14:30:20',
					},
					{
						phone: '18712345678',
						user: '21042504648685046486',
						time: '2022/12/25 14:30:20',
						logs: '2022/12/25 14:30:20',
					},
					{
						phone: '18712345678',
						user: '21042504648685046486',
						time: '2022/12/25 14:30:20',
						logs: '2022/12/25 14:30:20',
					},
				],
				page: 1, //分页
				sizes: 10,
				showBtn: false, // 确认按钮
			}
		},
		mounted() {
			this.getTplRemark()
		},
		watch: {
			'ruleForm.link_type'() {
				if(this.ruleForm.link_type == 0) {
					this.ruleForm.link_url = ''
				}
			}
		},
		methods:{
			// 获取模板
			getTplRemark() {
				let that = this
				let form = {}
				form.group_id = this.group_id
				form.business_type = this.index_one
				$.ajax({
					url: '/Weixin/getTplRemark',
					method: 'post',
					data: form,
					dataType: 'json',
					success: function (res) {
						if(res.status != 200) return that.$message.error(res.info)
						if(res.data.remark) that.ruleForm.remark = decodeURI(res.data.remark)
						if(res.data.link_type) that.ruleForm.link_type = String(res.data.link_type)
						if(res.data.link_url) that.ruleForm.link_url = res.data.link_url
						if(res.data.color) {
							if(res.data.color == '#333333') {
								that.ruleForm.color='1'
							}else {
								that.ruleForm.color='2' 
								that.ruleForm.color1 = res.data.color
							}
						}
					},
					error: function () {
						that.$message.error('网络错误');
					}
				})
			},
			// 点击我的模板
			clickTmp(val) {
				// console.log(val);
				this.ruleForm.remark = ''
				this.ruleForm.color = '1'
				this.ruleForm.color1 = '#32AF50'
				this.ruleForm.link_type = '0'
				this.ruleForm.link_url = ''
				this.ruleForm.phone = ''
				this.index_one = val.index
				document.getElementsByClassName('right_head')[0].innerHTML = val.name
				document.getElementById('remark').innerHTML = ''
				console.log(this.index_one);
				this.getTplRemark()
			},
			// 预览效果
			showEffect() {
				document.getElementById('remark').innerText = this.ruleForm.remark
				if(this.ruleForm.color == 1){
					document.getElementById('remark').style.color = '#333'
				} else {
					document.getElementById('remark').style.color = this.ruleForm.color1
				}
			},
			// 确认
			submit() {
				if(!this.ruleForm.remark) return this.$message.warning('请填写备注内容')
				if(this.ruleForm.phone) {
					let sj = /^1[3-9]\d{9}$/
					if(!sj.test(this.ruleForm.phone)) return this.$message.warning('请填写正确的手机号码')
				}
				let form = {}
				form.group_id = this.group_id
				form.business_type = this.index_one
				form.remark = encodeURI(this.ruleForm.remark)
				if(this.ruleForm.color == 1){
					form.color = '#333333'
				} else {
					form.color = this.ruleForm.color1
				}
				form.link_type = this.ruleForm.link_type
				form.link_url = this.ruleForm.link_url
				if(form.link_type == 0) {
					delete form.link_type
					delete form.link_url
				}
				console.log('form',form);

				this.showBtn = true
				let that = this
				$.ajax({
					url: '/Weixin/setTplRemark',
					method: 'post',
					data: form,
					dataType: 'json',
					success: function (res) {
						that.showBtn = false
						if(res.status != 200) return that.$message.error(res.info)
						that.$message.success('设置成功')
					},
					error: function () {
						that.$message.error('网络错误');
						that.showBtn = false
					}
				})
			},
			// 点击记录
			clickLogs(val) {
				console.log(val);
				this.index_two = val
			},
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
			}
		}
	})

</script>
@endsection 