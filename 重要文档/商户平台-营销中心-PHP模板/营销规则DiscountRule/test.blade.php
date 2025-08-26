<!-- 规则测试 -->
@extends('layout/master')
@section('header')
    <link rel="stylesheet" href="/css/wcc-element-ui/index.css?v={{config('constants.wcc_file_version')}}">
    <link rel="stylesheet" href="/css/wcc-element-ui/wcc.css?v={{config('constants.wcc_file_version')}}">
    <link rel="stylesheet" href="/css/DiscountRule/ruleTest.css?v={{config('constants.wcc_file_version')}}1"/>
@endsection

@section('content')
<div id="ruleTest">
    <div class="formData">
        <el-form label-position="right" :rules="rules" :model="form" ref="form">
            <el-form-item label="交易时间" prop="order_time">
                <el-date-picker
                    v-model="form.order_time"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="选择日期"
                    @change="timeChange">
                </el-date-picker> 
            </el-form-item>
            <el-form-item label="消费油站" prop="checkOliStation">
                <!-- 油站单选 -->
                <el-radio-group v-model="form.checkOliStation" @change="CheckedOliChange" style="display:block;margin-left:77px">
                  <el-radio v-for="(station,index) in station_list" :key="index" :label="station.stid" style="margin-top:10px;margin-bottom:20px">@{{station.stname}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="专车身份" v-show="stationChannel.length" required>
                <el-radio-group v-model="channelType">
                    <el-radio label="1">请选择专车身份</el-radio>
                    <el-radio label="2">无身份用户</el-radio>
                </el-radio-group>
                <div v-show="channelType==1">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll"
                        @change="handleCheckAllChange" style="margin-left:77px">全部身份
                    </el-checkbox>
                    <el-checkbox-group v-model="form.stationChannel" style="margin-left:77px">
                        <el-checkbox v-for="(item,index) in stationChannel" :label="item" :key="index">@{{item.name}}</el-checkbox>
                    </el-checkbox-group>
                </div>
            </el-form-item>
            <el-form-item label="支付方式" prop="checkPayTypeList">
                <el-radio-group v-model="form.checkPayTypeList" @change="changePayType" style="display:block;margin-left:77px">
                  <el-radio v-for="(payType,index) in pay_list" :key="index" :label="payType.BH" style="margin-top:10px;margin-bottom:20px">@{{payType.MC}}</el-radio>
                </el-radio-group>
                <!-- <div class="cardbox" v-show="false">
                    <span class="title">卡名称</span>
                    <el-checkbox :indeterminate="isIndeterminateOfCardTheme" v-model="checkAllOfCardTheme" @change="CheckAllChangeOfCardTheme">全选</el-checkbox>
                    <div style="margin: 0;"></div>
                    <el-checkbox-group v-model="form.cardThemeList">
                        <el-checkbox :label="card_theme.ID" v-for="(card_theme,index) in card_theme_list" :key="'card_theme'+index" >@{{card_theme.Name}}</el-checkbox>
                        
                    </el-checkbox-group>
                    <span class="title">卡类型</span>
                    <el-checkbox :indeterminate="isIndeterminateOfCustomeTrType" v-model="checkAllOfCustomeTrType" @change="CheckAllChangeOfCustomeTrType">全选</el-checkbox>
                    <div style="margin: 0;"></div>
                    <el-checkbox-group v-model="form.customeTrType" >
                        <el-checkbox label="1" >个人卡</el-checkbox>
                        <el-checkbox label="2" >车队卡</el-checkbox>
                        <el-checkbox label="3" >不记名卡</el-checkbox>
                    </el-checkbox-group>
                </div> -->
            </el-form-item>
            <el-form-item label="用户限制" required>
                <el-radio-group v-model="form.userLimit">
                    <el-radio label="0">会员等级</el-radio>
                    <el-radio label="1" v-show="form.showCardTheme">卡组</el-radio>
                    <el-radio label="2" v-show="form.showCardTheme">车队卡</el-radio>
                </el-radio-group>
                <div class="cardbox">
                    <el-radio-group v-if="form.userLimit==0" v-model="form.selectLevelsType">
                        <el-radio label="0">不限</el-radio>
                        <el-radio label="1"> 非会员</el-radio>
                        <el-radio label="2">
                            <el-select v-model="form.selectLevels"  @change="form.selectLevelsType='2'" clearable placeholder="请选择">
                                <el-option
                                    v-for="(item,index) in levels"
                                    :key="'selectLevels'+index"
                                    :label="item.level_name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-radio>
                    </el-radio-group>
                    <el-radio-group v-else-if="form.userLimit==1" v-model="form.selectCustomerGroupType">
                        <el-radio label="0">不限</el-radio>
                        <el-radio label="2">
                            <el-select v-model="form.selectCustomerGroup" filterable @change="form.selectCustomerGroupType='2'"  multiple placeholder="请选择">
                                <el-option
                                    v-for="(item,index) in customer_group_list.dt"
                                    :key="'selectCustomerGroup'+index"
                                    :label="item.CustomerGroupName"
                                    :value="item.ID">
                                </el-option>
                            </el-select>
                        </el-radio>
                    </el-radio-group>
                    <el-radio-group v-else-if="form.userLimit==2" v-model="form.selectCompanyListType">
                        <el-radio label="0">不限</el-radio>
                        <el-radio label="2">
                            <el-select v-model="form.selectCompanyList" filterable @change="form.selectCompanyListType='2'"  multiple placeholder="请选择">
                                <el-option
                                    v-for="(item,index) in company_list.dt"
                                    :key="'selectCompanyList'+index"
                                    :label="item.CompanyName"
                                    :value="item.ID">
                                </el-option>
                            </el-select>
                        </el-radio>
                    </el-radio-group>
                </div>
            </el-form-item>
            <el-form-item label="充值直降">
               <span style="padding:0 10px 0 20px;">充值金额</span><el-input v-model="form.RecentRecharge" style="width:200px;"></el-input> 元
            </el-form-item>
            <el-form-item label="消费商品类型" required label-width="110px">
                <el-checkbox v-model="form.isOil == 1" label="1" @click.native.prevent="onRadioChange('1')">油品</el-checkbox>
                <el-checkbox v-model="form.isNoOil == 1" label="1" @click.native.prevent="onRadioChange2('1')">非油品</el-checkbox>
            </el-form-item>
            <el-form-item label="优惠油品" prop="oilsList" v-show="form.isOil==1">
                <el-radio-group v-model="form.oilsList" style="display:block;margin-left:75px"  @change="CheckedOfOilsChange">
                  <el-radio  v-for="(oil,index) in oils" :key="index" :label="oil" style="margin-top:10px;margin-bottom:20px">@{{oil.oil_name}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- 勾选 油品 + 单一支付方式 -->
            <el-form-item v-show="form.isOil==1  && !form.showMixPay">
                <div class="cardbox">
                    <div>油品信息</div>
                    <div style="margin-left:70px">
                        <el-select v-model="selectType" placeholder="请选择类型" >
                            <el-option
                              v-for="item in selectOption"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                        </el-select>
                        <el-input style="width:224px" v-model="form.num" placeholder="请输入升数"></el-input> @{{ selectType == 0 ? ' 升' : ' 元'}}  
                    </div>
                    <div class="priceCalculate" style="margin-left:70px">
                        <span>单价</span>
                        <span>@{{ price }}元/升</span>
                    </div>
                    <div class="priceResult">
                        <div>计算结果</div>
                        <span style="margin-left:8px">@{{selectType == 1 ? '数量' : '金额'}}</span>
                        <span>@{{ money.toFixed(2) }}@{{selectType == 1 ? '升' : '元'}}</span>
                    </div>                  
                </div>
            </el-form-item>

            <!-- 勾选 油品 + 混合支付方式-->
            <el-form-item v-show="form.isOil==1  && form.showMixPay">
                <div class="cardbox"  style="width:800px">
                    <el-form ref="mixForm" :rules="Mixrules" :model="mixForm" label-width="150px">
                        <el-form-item label="支付方式" prop="payType">
                            <el-select v-model="mixForm.payType.type1" placeholder="请选择支付方式" @change="payTypeChange1">
                                <el-option
                                  v-for="item in mixPayTypeList"
                                  :key="item.BH"
                                  :label="item.MC"
                                  :value="item.BH">
                                </el-option>
                            </el-select>
                            <el-select v-model="mixForm.payType.type2" placeholder="请选择支付方式" @change="payTypeChange2">
                                <el-option
                                  v-for="item in mixPayTypeList"
                                  :key="item.BH"
                                  :label="item.MC"
                                  :value="item.BH">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="按金额" prop="mixPrice" style="margin-top:20px">
                            <el-input v-model="mixForm.mixPrice.price1" placeholder="请输入金额" style="width:222px"></el-input>
                            <el-input v-model="mixForm.mixPrice.price2" placeholder="请输入金额" style="width:222px"></el-input>
                        </el-form-item>
                        <el-form-item label="单价">
                            <div>@{{price}} 元/升</div>
                        </el-form-item>
                        <el-form-item label="计算结果">
                            <div>@{{mixUnitPrice.toFixed(2)}} 升</div>
                        </el-form-item>
                    </el-form>
                </div>
                
            </el-form-item>

            <!-- 勾选 非油品 -->
            <el-form-item v-show="form.isNoOil==1">
                <div class="cardbox">
                    <span>商品信息</span>
                    <el-input v-model="goodsKeyword" placeholder="请输入商品名称/商品条形码" style="width:250px;margin-left:50px"></el-input>
                    <el-button type="primary" @click="searchGoodBtn">搜索</el-button>
                    <div class="prodSearch" style="display:flex">
                        <div class="left" style="width:45%">
                            已选择@{{prodList.length}} 个商品
                                <div v-for="(item,index) in prodList" :key="item.prod_stid">
                                    <div class="prodName">@{{item.prod_name}}</div>
                                    <el-input-number v-model="item.qty" @change="(currentValue, oldValue,)=>{handleChange(currentValue, oldValue,index)}" size="mini" style="width:100px"></el-input-number>
                                    <div class="prodPrice">@{{item.orig_price * item.qty}} 元</div>
                                </div>
                        </div>
                        <div class="right" style="width: 55%;">
                            <el-table
                              ref="multipleTable"
                              :data="goodsData"
                              tooltip-effect="dark"
                              v-loading="goodsLoading"
                              border
                              style="width:100%;margin-top:30px"
                              @selection-change="handleSelectionChange">
                              <el-table-column
                                type="selection"
                                width="55">
                              </el-table-column>
                              <el-table-column
                                prop="NAME"
                                label="商品名称">
                              </el-table-column>
                              <el-table-column
                                prop="BarCode"
                                label="商品编码">
                              </el-table-column>
                            </el-table>
                            <el-pagination
                              background
                              layout="prev, pager, next"
                              :current-page="currentPage"
                              @current-change="handleCurrentChange"
                              :page-size="10"
                              :total="goodTotal">
                            </el-pagination>
                            <div style="margin-top:5px">
                                <el-button @click="toggleSelection()">取消</el-button>
                                <el-button type="primary" @click="getProdList">确定</el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </el-form-item>

            <!-- 查询手机号或者卡号 -->
            <el-form-item v-show="form.showCardTheme" prop="phone">
            <el-select v-model="searchType" placeholder="请选择" style="width:90px" @change="form.phone = ''">
                <el-option v-for="item in searchOption" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
            </el-select>
                <el-input placeholder="请输入手机号" 
                v-model="form.phone" style="width:250px;margin:0 30px 0 0"></el-input>
                <el-button type="primary" @click="searchCardInfo">查询卡信息</el-button>
                <el-table :data="form.showCardInfo" class="showCard" v-loading="showCardLoading">
                    <el-table-column label="卡信息">
                        <el-table-column prop="CardID" label="卡面卡号"></el-table-column>
                        <el-table-column prop="CardName" label="卡名称"></el-table-column>
                        <el-table-column prop="CardType" label="卡类型">
                            <template slot-scope="scope">
                                @{{typeTransform(scope.row.CardType)}}
                            </template>
                        </el-table-column>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submit" class="testBtn">测试</el-button>
            </el-form-item>
        </el-form>
    </div>
    <!-- 卡信息弹窗 -->
    <el-dialog :visible.sync="dialogTableVisible" :append-to-body="true" @close="closeDialog" width="70%">
        <el-table :data="cardInfo" border  v-loading="loading">
            <el-table-column label="请选择" width="70px" align="right">
                <template slot-scope="scope">
                    <el-radio v-model="cardRadio" :label="scope.row">@{{""}}</el-radio>
                </template>
            </el-table-column>
            <el-table-column property="CardID" label="卡面卡号"></el-table-column>
            <el-table-column property="CardName" label="卡名称"></el-table-column>
            <el-table-column property="CardType" label="卡类型">
                <template slot-scope="scope">
                    @{{typeTransform(scope.row.CardType)}}
                </template>
            </el-table-column>
            <el-table-column property="oilName" label="可用油品" width="300px" align="center"></el-table-column>
            <el-table-column property="useStationName" label="可用油站" width="300px" align="center"></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="comfirm">确 定</el-button>
        </div>
    </el-dialog>
    <div class="testResult" v-loading="testLoading">
        <h4 style="margin-bottom:5px">测试结果</h4> 
        <div class="headerTop" v-for="(item,index) in Rsp_RIDStr" :key="index" style="color:rgb(144, 147, 153);font-size:14px;font-weight:700;display:flex;width:650px">
            <span style="border-right:1px solid #EBEEF5">规则ID: @{{item.AID}}</span>
            <span>规则名称: @{{item.RuleName}}</span>
        </div>

        <div class="titleTest">优惠信息:</div>
        <el-table :data="testProdList" border>
            <el-table-column label="商品" prop="name" width="150" ></el-table-column>
            <el-table-column label="折前单价(元)" prop="orig_price" :formatter="formatter"></el-table-column>
            <el-table-column label="折后单价(元)" prop="curr_price" :formatter="formatter"></el-table-column>
            <el-table-column label="折前金额(元)" prop="orig_amount" :formatter="formatter"></el-table-column>
            <el-table-column label="折后金额(元)" prop="curr_amount" :formatter="formatter"></el-table-column>
            <el-table-column label="总优惠" prop="YHJE" width="80"></el-table-column>
        </el-table>

        <div class="titleTest" v-if="giveZS.length">返赠商品:</div>
        <el-table :data="giveZS" border v-if="giveZS.length">
            <el-table-column label="商品条码" prop="GiveCode" ></el-table-column>
            <el-table-column label="商品名称" prop="GiveName" ></el-table-column>
            <el-table-column label="数量" prop="GiveNum" ></el-table-column>
        </el-table>

        <div class="titleTest" v-if="giveCoupon.length">返券:</div>
        <el-table :data="giveCoupon" border v-if="giveCoupon.length">
            <el-table-column label="券ID" prop="GiveCode" ></el-table-column>
            <el-table-column label="券名称" prop="GiveName" ></el-table-column>
            <el-table-column label="数量" prop="GiveNum" ></el-table-column>
        </el-table>
    </div>
    <div class="isUse" v-if="false">
        <div class="flexDiv">
            <div>
                <span>是否包含券优惠</span>
                <span v-if="Rsp_RIDStr.ISUseCoupons" style="padding:20px">@{{Rsp_RIDStr.ISUseCoupons == 1 ? '是' : '否'}}</span>
            </div>
            <div>
                <span>是否包含积分抵现</span>
                <span v-if="Rsp_RIDStr.ISUseBonus" style="padding:20px">@{{Rsp_RIDStr.ISUseBonus == 1 ? '是' : '否'}}</span>
            </div>
        </div>
        
    </div>
    
</div>
@endsection

@section('footer')
    <script src="/js/vendor/daterangepicker/moment.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/wcc-element-ui/vue.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/wcc-element-ui/index.js?v={{config('constants.wcc_file_version')}}"></script>
    <script src="/js/axios.min.js"></script>
    <script>
        new Vue({
            el: '#ruleTest',
            data(){
                let phoneReg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/  
                //电话规则校验
                let phoneRule = (rule, value, callback) => {
                    if(this.showCardTheme && value === ''){
                        callback(new Error('请输入手机号或者卡号'))
                    }else if(this.showCardTheme && this.searchType == 1 && !phoneReg.test(value)){
                        callback(new Error('请输入正确的手机号'))
                    }else{
                        callback()
                    }
                };
                //数量规则校验
                let numRule = (rule, value, callback) =>{
                    console.log(value);
                    if(value === '' || value == undefined){
                        callback(new Error('请输入数量'))
                    }else if(value <= 0){
                        callback(new Error('请输入大于0的数'))
                    }else{
                        callback()
                    }
                }
                //优惠油品选择校验
                let oilsRule = (rule, value, callback) =>{
                    if(this.form.isOil == 1 && value == ''){
                        callback(new Error('请选择优惠油品'))
                    }else{
                        callback()
                    }
                }
                //混合支付方式校验
                let payType = (rule, value, callback) =>{
                    console.log('payType',value);
                    if(value.type1 == ''){
                        callback(new Error('请选择第一种支付方式'))
                    }
                    if(value.type2 == ''){
                        callback(new Error('请选择第二种支付方式'))
                    }
                    if(value.type1 == value.type2){
                        callback(new Error('请不要选择相同的支付方式'))
                    }else{
                        callback()
                    }
                }
                //混合支付价格校验
                let priceRule = (rule, value, callback) =>{
                    console.log('priceRule',value);
                    if(value.price1 == ''){
                        callback(new Error('请输入第一种支付方式的金额'))
                    }
                    if(value.price2 == ''){
                        callback(new Error('请输入第二种支付方式的金额'))
                    }
                    if(!+value.price1){
                        value.price1 = ''
                        callback(new Error('请输入数字'))
                    }else if(!+value.price2){
                        value.price2 = ''
                        callback(new Error('请输入数字'))
                    }else{
                        callback()
                    }
                }
                //去除混合支付方式
                let mixPayTypeList = {!!json_encode($pay_list)!!}
                mixPayTypeList.forEach((item,index)=>{
                    if(item.BH == '99'){
                        mixPayTypeList.splice(index,1)
                    }
                })
                return{
                    station_list: {!!json_encode($station_list)!!} || [], //油站列表
                    // pay_list:{!!json_encode($pay_list)!!} || [], //支付方式列表
                    pay_list: mixPayTypeList || [], //支付方式列表
                    levels:{!!json_encode($levels)!!}, //等级
                    customer_group_list:{!!json_encode($customer_group_list)!!}, //卡组
                    company_list:{!!json_encode($company_list)!!}, //卡车队列表
                    all_oils:{!!json_encode($oils)!!},//油耗
                    card_theme_list :{!!json_encode($card_theme_list)!!}.dt, //卡主题列表
                    oils:[],
                    mixPayTypeList:mixPayTypeList || [],
                    checkAllOli: false, //全选消费油站
                    checkAllOfOils:false, // 全选优惠油品
                    isIndeterminateOli:true, //是否消费油站全选
                    isIndeterminatePayType:true, //是否支付方式全选
                    isIndeterminateOfOils:true, //是否优惠油品全选
                    checkAllOfCardTheme: false, //卡名称是否全选
                    checkAllOfCustomeTrType:false, //卡类型是否全选
                    isIndeterminateOfCustomeTrType: true,
                    isIndeterminateOfCardTheme: true,
                    cardInfo:[], //弹窗卡信息表格
                    dialogTableVisible: false,
                    cardRadio:'', //选择的卡信息
                    loading:false,
                    showCardLoading:false, //选择后展示的卡信息等待效果
                    price:0, //单价
                    // money:0, //金额
                    testResult:'', //测试结果
                    testLoading:false,
                    Rsp_RIDStr:[{
                        AID:'',     //规则ID
                        ISUseBonus:'',  //是否使用积分抵现
                        ISUseCoupons:'',    //是否使用优惠券
                        RuleDiscountMethod:'', 
                        RuleDiscountType:'',
                        RuleName:'',    //规则名称
                        RuleTyep:'',
                        YHJE:'', //总优惠金额
                        }],  //测试结果信息
                    oil_info:{
                        orig_price:'',
                        curr_price:'',
                        orig_amount:'',
                        curr_amount:''
                    },
                    checkOilName:'',    //选中优惠油品的名字
                    testProdList:[
                        // {
                        // name:'',
                        // orig_price:'',  //折前单价
                        // curr_price:'',  //折后单价
                        // orig_amount:'', //折前金额
                        // curr_amount:'', //折后金额
                        // YHJE:'',    //总优惠
                        // }
                    ],
                    giveInfolist:[
                        // {
                        //     GiveCode:'', 
                        //     GiveName:'',
                        //     GiveNum:''
                        // }
                    ], // 测试的赠送
                    giveZS:[], //测试赠送的商品
                    giveCoupon:[],  //测试赠送的券
                    prodType:'', // 赠送的类型 goods coupn

                    selectOption:[{
                            value: '0',
                            label: '按升数'
                        },{
                            value: '1',
                            label: '按金额'
                    }],
                    selectType:'',  //单一支付方式选择类型
                    oilRise:'', //油量升数

                    form:{
                        order_time:'', //交易时间
                        checkOliStation:'', //选择的消费油站
                        checkAllPayType:false, // 全选支付方式
                        userLimit:"0", //默认选择的用户等级
                        selectLevels:'',//选择会员等级
                        selectCustomerGroup:[],//选择卡组
                        selectCompanyList:[],//选择车队卡
                        selectLevelsType:"0",
                        selectCustomerGroupType:"0",
                        selectCompanyListType:"0",
                        oilsList:[],//优惠油品
                        phone:'', //查询的手机号
                        checkPayTypeList:'', //选择的支付方式
                        num:0, //数量
                        showCardInfo:[], //展示的卡信息
                        showCardTheme:false,    //是否显示卡主题
                        showMixPay:false,   //是否是混合支付
                        cardThemeList:[],//卡主题
                        customeTrType:[],//客户类型
                        // commodityType:"0",   //商品类型 油品0 非油品1
                        isOil:'',   //商品类型是否是油品 1
                        isNoOil:'', //商品类型是否是非油品 1
                        stationChannel:[],  //身份限制选择
                        RecentRecharge: 0, // 充值金额
                    },
                    channelType: '2', // 专车身份类型，1是选择专车身份，2是无身份
                    rules:{
                        //交易时间
                        order_time:[
                            {required:true, message:'请输入交易时间', trigger:'change'}
                        ],
                        //消费油站
                        checkOliStation:[
                            {type: 'number', required:true, message:'请选择消费油站', trigger:'change'}
                        ],
                        //专车身份
                        stationChannel:[
                            { required:true, message:'', trigger:'change'}
                        ],
                        //支付方式
                        checkPayTypeList:[
                            {type: 'string', required:true, message:'请选择至少一种支付方式', trigger:'change'}
                        ],
                        //优惠油品
                        oilsList:[
                            {validator: oilsRule, required:true, trigger:'change'}
                        ],
                        //手机号
                        phone:[
                            {validator: phoneRule, required:true, trigger:'change'}
                        ],
                        //数量
                        num:[
                            {validator: numRule, required:true, trigger:'blur'}
                        ]
                    },
                    mixForm:{
                        payType:{
                            type1:'',
                            type2:''
                        },
                        mixPrice:{
                            price1:'',
                            price2:''
                        },
                    },
                    Mixrules:{
                        payType:[
                            {validator:payType,required:true,trigger:'change'}
                        ],
                        mixPrice:[
                            {validator:priceRule,required:true,trigger:'blur'}
                        ]
                    },
                    goodsKeyword:'',    //查询商品信息的keyword
                    goodsData:[
                    ],    //非油商品列表
                    TSgoodsList:[], //暂存非油商品列表
                    prodList:[],    //确定提交的商品列表
                    goodsLoading:false, //非油商品加载中
                    searchOption:[
                        {value:1,label:'手机号'},
                        {value:2,label:'卡号'}
                    ],
                    searchType:1,   //查询类型 1手机号 2卡号
                    stationChannel:[],  //身份限制
                    isIndeterminate:false,   //身份限制全选按钮
                    checkAll:false,     //身份限制是否全选

                    goodTotal:10,    //商品总数
                    currentPage:1,  //商品当前页
                } 
            },
            computed:{
                typeTransform:{ //卡类型转换
                    get(){
                        return function(type){
                            switch(type){   
                                case '1':
                                    return '个人卡'
                                case '2':
                                    return '企业卡'
                                case '3':
                                    return '不记名卡'
                            } 
                        }
                    }
                },
                money:{ //金额
                    get(){
                        if(this.selectType == 0){
                            return this.form.num * this.price 
                        }else{
                            return this.form.num/this.price
                        }
                       
                    },
                    set(v){
                        console.log(v);
                    }
                },
                mixUnitPrice:{  //混合支付的油量 金额/单价
                    get(){
                        return (this.mixForm.mixPrice.price1 + this.mixForm.mixPrice.price2) / this.price || 0
                    },
                    set(v){
                        console.log(v);
                    }
                }    
            },
            created(){
                console.log('oils',this.all_oils);
            },
            watch: {
                // 反选
                'form.stationChannel'(){//专车身份
                    let checkedCount = this.form.stationChannel.length;
                    this.checkAllOfIdentity = checkedCount === this.stationChannel.length;
                    this.isIndeterminate = checkedCount > 0 && checkedCount < this.stationChannel.length;
                },
            },
            methods:{
                formatter(row, column, cellValue){
                    // console.log('cellValue',cellValue);
                    // return cellValue.toFixed(2)
                    return cellValue
                },
                handleCurrentChange(val){
                    console.log(`当前页: ${val}`)
                    this.currentPage = val
                    this.searchGoodBtn()
                },
                //选择油品
                onRadioChange(e){
                    console.log('e',e);
                    if(this.form.isOil == e){
                        this.form.isOil = ''
                        return
                    }
                    this.form.isOil = e
                },
                //选择非油品
                onRadioChange2(e){
                    if(this.form.isNoOil == e){
                        this.form.isNoOil = ''
                        return
                    }
                    this.form.isNoOil = e
                },
                //选择消费油站
                CheckedOliChange(val){
                    console.log('stid',val);
                    this.oils = this.all_oils[val]
                    this.form.oilsList = []
                    if(this.form.order_time){
                        this.getStationChannel()
                    }
                },
                //选择时间
                timeChange(){
                    if(this.form.checkOliStation.length){
                        this.getStationChannel()
                    }
                },
                //支付方式选择
                CheckedPayTypeChange(value){ 
                    let checkedCount = value.length;
                    this.form.checkAllPayType = checkedCount === this.pay_list.length;
                    this.isIndeterminatePayType = checkedCount > 0 && checkedCount < this.pay_list.length;
                },
                // 优惠油品全选
                CheckAllChangeOfOils(val){ 
                    this.form.oilsList = val ? this.oils : [];
                    // this.isIndeterminateOfOils = false;
                },
                // 优惠油品选择
                CheckedOfOilsChange(value){ 
                    console.log('value',value);
                    this.checkOilName = value.oil_name
                    this.price = value.oil_price
                },
                //选择支付方式
                changePayType(val){
                    console.log('val',val)
                    //判断是否是“加油卡”
                    this.form.showCardTheme = val == '3';
                    //判断是否是‘混合支付’
                    this.form.showMixPay = val == '99';
                    
                },
                //混合支付方式1
                payTypeChange1(val){
                    console.log('混合支付方式1',val);
                    //不能选择和支付方式2一样
                    // if(val == this.mixForm.payType.type2){

                    // }
                    
                },
                //混合支付方式2
                payTypeChange2(val){
                    console.log('混合支付方式2',val);
                },
                //卡名称全选
                CheckAllChangeOfCardTheme(val) {
                    var _selectList = [];
                    this.card_theme_list.forEach(function(item){
                        _selectList.push(item.ID)
                    })
                    this.form.cardThemeList = val ? _selectList : [];
                    this.isIndeterminateOfCardTheme = false;
                   
                },
                //专车身份全选
                CheckAllChangeOfCustomeTrType(val){
                    
                    this.form.customeTrType = val ? ["1", "2", "3"] : [];
                    this.isIndeterminateOfCustomeTrType = false;
                },
                //身份限制全选
                handleCheckAllChange(val){
                    this.form.stationChannel = val ? this.stationChannel : [];
                    this.isIndeterminate = false;
                },
                //身份接口
                getStationChannel(){
                    let end_time = moment(new Date(this.form.order_time).getTime() + 1000).format('YYYY-MM-DD HH:mm:ss')
                    console.log('end_time',end_time);
                    axios({
                        method:"POST",
                        url:'/CardMarketing/getStationChannel',
                        data:{
                            stids:[this.form.checkOliStation],
                            start_time: this.form.order_time,
                            end_time,
                        }
                    }).then(res=>{
                        console.log('res',res);
                        if(res.data.status == 200){
                            this.stationChannel = res.data.data
                            // 去除无身份用户
                            if(this.stationChannel && this.stationChannel.length > 0){
                                this.stationChannel.forEach((v,i) => {
                                    if(v.name == '无身份用户'){
                                      this.stationChannel.splice(i,1)
                                    }
                                })
                            }
                        }
                    })
                },
                // 查询卡信息
                searchCardInfo(){ 
                    this.dialogTableVisible = true
                    this.loading = true
                    axios({
                        method:'POST',
                        url:'/CardMarketing/getCardByPhone',
                        data:{
                            phone:this.form.phone,
                            type:this.searchType    //1手机号 2卡号
                        }
                    }).then(res=>{
                        if(res.data.status == 200){
                            this.cardInfo = res.data.data
                        }
                    }).finally(()=>{
                        this.loading = false
                    })
                },
                //关闭弹窗后的回调
                closeDialog(){ 
                    this.cardInfo = []
                },
                //确定选择卡信息
                comfirm(){ 
                    this.dialogTableVisible = false
                    this.showCardLoading = true
                    console.log('当前信息',this.cardRadio);
                    if(this.cardRadio){
                        this.form.showCardInfo = [{
                            CardID:this.cardRadio.CardID,
                            CardName:this.cardRadio.CardName,
                            CardType:this.cardRadio.CardType,
                            UID:this.cardRadio.UID,
                            CardAttribute:this.cardRadio.CardAttribute,
                            RID:this.cardRadio.RID,
                            CompanyID:this.cardRadio.CompanyID,
                            CustomerGroupID:this.cardRadio.CustomerGroup,
                        }]
                    }else{
                        this.form.showCardInfo = []
                    }
                    
                    setTimeout(() => {
                        this.showCardLoading = false
                    }, 500);
                },
                //商品搜索
                searchGoodBtn(){
                    this.goodsData = []
                    this.goodsLoading = true
                    let station_id = this.form.checkOliStation //选择的油站id
                        keyword = this.goodsKeyword             //查询内容

                    // if(station_id == ''){
                    //     console.log('station_id',station_id);
                    //     this.$message.error('请选择油站')
                    //     this.goodsLoading = false
                    //     return
                    // }
                    if(keyword == ''){
                        console.log('keyword',keyword);
                        this.$message.error('请输入商品名称/商品条形码')
                        this.goodsLoading = false
                        return
                    }
                    // axios({
                    //     method:'POST',
                    //     url:'/CardMarketing/getStidGoods',
                    //     data:{
                    //         station_id, //油站id
                    //         keyword,    //查询内容
                    //     }
                    // }).then(res=>{
                    //     console.log('商品res',res);
                    //     this.goodsData = res.data.data
                    // }).finally(()=>{
                    //     this.goodsLoading = false
                    // })
                    axios({
                        method:'POST',
                        url:'/CardMarketing/getGoods',
                        data:{
                            page:this.currentPage,
                            page_size:10,
                            keyword,
                        }
                    }).then(res=>{
                        console.log('商品res',res);
                        this.goodsData = res.data.data.list
                        this.goodTotal = res.data.data.total
                    }).finally(()=>{
                        this.goodsLoading = false
                    })
                },
                //选择暂存
                handleSelectionChange(val){
                    console.log('val',val);
                    this.TSgoodsList = val
                },
                //已选择的商品
                getProdList(){
                    this.TSgoodsList.forEach(item=>{
                        this.prodList.push({
                            id:'', //传空
                            transaction_type:'',    //传空
                            bar_code:item.BarCode,     //条形码
                            qty:1, //数量
                            orig_price:item.DEFAULTPRICE,    //折前单价
                            // orig_amount:item.prod_curr_price,   //折后金额 qty*orig_price 默认为1
                            prod_name:item.NAME,   //名字
                            prod_id:item.ID,
                            GSID:item.GSID,  //商品的GSID
                        })
                    })
                    const res = []
                    //去重
                    this.prodList.forEach(item=>{
                        if (typeof item === "object" && item !== null) {
                          const tmp = res.filter(
                            (i) => i.prod_id === item.prod_id
                          );
                          if (tmp.length === 0) res.push(item);
                        }
                    })
                    console.log('res',res);
                    this.prodList = res
                    this.TSgoodsList = []
                    this.$refs.multipleTable.clearSelection()
                    // this.goodsData = []
                    // this.prodList = this.prodList.concat(this.TSgoodsList)
                },
                //添加商品数量
                handleChange(currentValue,oldValue,index){
                    console.log('currentValue',currentValue);
                    console.log('index',index);
                    if(currentValue == 0){
                        this.$nextTick(()=>{
                            this.prodList.splice(index,1)
                        })
                    }
                },
                // 取消选择
                toggleSelection(){
                    this.$refs.multipleTable.clearSelection()
                },
                //提交测试
                submit(){
                    // if(this.form.showCardInfo.length == 0){
                    //     this.$message({
                    //         message:'请输入手机号并查询卡信息',
                    //         type:'error'
                    //     })
                    //     return 
                    // }
                    if(this.form.selectLevelsType == 2 && this.form.selectLevels == ''){
                        this.$message({
                            message:'请选择会员等级',
                            type:'error'
                        })
                        return
                    }
                    if( !this.form.isOil  && !this.form.isNoOil){
                        this.$message({
                            message:'请选择油品或者非油品',
                            type:'error'
                        })
                        return
                    }
                    if(this.form.showCardTheme && !this.form.showCardInfo.length){
                        this.$message({
                            message:'请选择卡信息',
                            type:'error'
                        })
                        return
                    }
                    this.$refs['form'].validate((valid) => {
                        if(valid){
                            this.submitTest()
                        }else{
                            return false
                        }
                    })
                    
                },
                //测试请求
                submitTest(){ 
                    this.testLoading =true

                    //消费油品
                    let list = this.form.oilsList
                    let oil_info = {
                        oil_code:list.oil_id,
                        orig_price:list.oil_price, //油品单价
                        orig_amount:this.form.num*list.oil_price, //油品总价
                        qty:Number(this.form.num).toFixed(4) //油品数量
                    }
                    //按金额
                    if(this.selectType == 1){
                        oil_info.qty = this.money.toFixed(4)
                        oil_info.orig_amount = this.money*list.oil_price
                    }
                    let oliList = []
                    if(this.form.isOil){
                        oil_info = JSON.stringify(oil_info)
                        oliList.push(oil_info)
                    }
                    console.log(oliList);

                    //卡信息
                    let CustomerGroupID = [] 
                    if(this.cardRadio){
                        this.cardRadio.CustomerGroup.forEach(item=>{
                            CustomerGroupID.push(item.GroupID)
                        })
                        CustomerGroupID = CustomerGroupID.join(',')
                    }

                    //非油品
                    let prodList = []
                    prodList = this.prodList.map(item=>{
                        return {
                            id:0, //传空
                            transaction_type:0, //传空
                            bar_code:item.bar_code, //条形码
                            qty:item.qty, //数量
                            orig_price:item.orig_price, //折前单价
                            orig_amount:item.qty * item.orig_price, //折后金额 qty*orig_price 默认为1
                            name:item.prod_name,   //名字
                            GoodsSortID:item.GSID,     
                        }
                    })
                    
                    //金额
                    let amount = ''
                    if(this.form.checkPayTypeList == 99 && this.form.isOil && !this.form.isOil){    //混合支付 + 油品
                        amount = +this.money + +this.mixForm.mixPrice.price1 + +this.mixForm.mixPrice.price2
                    }else if(this.form.checkPayTypeList != 99 && this.form.isOil && !this.form.isNoOil){  //单一支付 + 油品
                        if(this.selectType == 1){   //按金额
                            amount = this.form.num
                        }else{
                            amount = this.money
                        }
                    }else if(this.form.isNoOil && !this.form.isOil){    //非油
                        this.prodList.forEach(item=>{
                            amount += item.orig_price * item.qty
                        })
                    }else if(this.form.checkPayTypeList != 99 && this.form.isOil && this.form.isNoOil){ //单一支付 + 油品 + 非油品
                        this.prodList.forEach(item=>{
                            amount += item.orig_price * item.qty
                        })
                        if(this.selectType == 1){   //按金额
                            amount = +amount +this.form.num
                        }else{
                            amount = +amount +this.money
                        }
                    }else if(this.form.checkPayTypeList == 99 && this.form.isOil && this.form.isNoOil){ //混合支付 + 油品 + 非油品
                        this.prodList.forEach(item=>{
                            amount += item.orig_price * item.qty
                        })
                        amount = +amount +  (+this.money + +this.mixForm.mixPrice.price1 + +this.mixForm.mixPrice.price2)
                    }
                    console.log('amount',amount);

                    //交易方式
                    let pay_type_list = []
                    if(this.form.checkPayTypeList != 99){   //单一支付
                        pay_type_list = [{
                            pay_type: this.form.checkPayTypeList,
                            amount: amount,
                        }]
                    }else{
                        pay_type_list = [{
                            pay_type: this.mixForm.payType.type1,
                            amount: amount
                        },{
                            pay_type: this.mixForm.payType.type2,
                            amount: amount
                        }]
                    }

                    let data = {
                        amount:amount,                      //金额
                        // pay_type:pay_type_list.join(','),       //支付方式
                        pay_type:pay_type_list,
                        order_time:this.form.order_time,        // 交易时间 y-m-d h:m:s
                        oil_info:oliList,                       //油品信息,json格式
                        CustomerGroupID:CustomerGroupID,
                        station_id:this.form.checkOliStation, //油站id
                        customertGradeID:'',                     //用户等级
                        // prodList:prodList,                       //非油品
                        // IdentityID:IdentityID.join(',')         //身份ID
                        CardType:'',       //卡类型
                        UID:0,
                        CardAttribute:0,
                        RID: 0,
                        CompanyID: 0,
                    }

                    //用户等级
                    if(this.form.selectLevelsType == 0 || this.form.selectLevelsType == 1){
                        data.customertGradeID = 0
                    }else if(this.form.selectLevelsType == 2){
                        data.customertGradeID = this.form.selectLevels
                    }

                    //加油卡类型
                    if(this.form.checkPayTypeList == 3 && this.cardRadio){    //如果选择加油卡 可以使用卡查询
                        data.UID = this.cardRadio.UID
                        data.CardAttribute = this.cardRadio.CardAttribute
                        data.RID = this.cardRadio.RID
                        data.CompanyID = this.cardRadio.CompanyID
                        data.CardType = this.cardRadio.CardType      //卡类型
                        data.CardID = this.cardRadio.CardID         //卡ID
                    }

                    //身份id
                    let IdentityID
                    if(this.channelType == 1){ // 选择专车身份
                        if(this.form.stationChannel){
                            IdentityID = this.form.stationChannel.map(item=>{
                                return item.channel_code
                            })
                            data.IdentityID = IdentityID.join(',')         //身份ID
                        }
                        if(IdentityID.length == 0){
                            this.testLoading = false
                            return this.$message.error('请选择至少一种专车身份')
                        }
                    }else{ // 无身份
                        data.IdentityID = 'tp_-1'
                    }

                    // 充值金额
                    data.RecentRecharge = this.form.RecentRecharge ? this.form.RecentRecharge : 0

                    //非油品
                    if(this.form.isNoOil){
                        data.prodList = prodList                    //非油品
                    }

                    axios({
                        method:"POST",
                        url:'/CardMarketing/ruleTestData',
                        data
                    }).then(res=>{
                        console.log(res);
                        this.testProdList = []
                        this.giveCoupon = []
                        this.giveZS = []
                        this.Rsp_RIDStr = [{
                            AID:'',     //规则ID
                            ISUseBonus:'',  //是否使用积分抵现
                            ISUseCoupons:'',    //是否使用优惠券
                            RuleDiscountMethod:'', 
                            RuleDiscountType:'',
                            RuleName:'',    //规则名称
                            RuleTyep:'',
                            YHJE:'', //总优惠金额
                        }],
                        this.giveInfolist = []
                        if(res.data.status == 200){
                            this.$message({
                                message:res.data.info,
                                type:'success'
                            })
                            this.testResult = res.data.data
                            if(this.testResult.Rsp_RIDStr){
                                this.Rsp_RIDStr = this.testResult.Rsp_RIDStr
                            }
                            console.log(this.testResult);
                            if(res.data.data.oil_info.length ){
                                //油品
                                this.testProdList.push(...res.data.data.oil_info)
                                this.testProdList[0].name = this.checkOilName
                                //优惠金额
                                // this.testProdList[0].YHJE = (this.Rsp_RIDStr.YHJE && res.data.data.oil_info[0].Rsp_RuleName) ? this.Rsp_RIDStr.YHJE.toFixed(2) : '0.00'
                                // this.testProdList[0].YHJE = (res.data.data.oil_info[0].orig_amount - Math.floor(res.data.data.oil_info[0].curr_amount * 100)/100).toFixed(2)
                            }
                            if(res.data.data.prodList.length){
                                res.data.data.prodList.forEach((item,index)=>{
                                    if(item.id ){
                                        //非油品
                                        // item.YHJE =  item.Rsp_RuleName ? this.testResult.Rsp_RIDStr[index].YHJE.toFixed(2) : '0.00'
                                        // item.YHJE = (item.orig_amount - item.curr_amount).toFixed(2)

                                        this.testProdList.push(item) 
                                    }else{
                                        // this.giveInfolist =  item.giveInfolist
                                        // this.prodType = item.ProdType
                                        console.log('ProdType',item.ProdType);
                                        if(item.ProdType == 'Coupon'){
                                            this.giveCoupon = this.giveCoupon.concat(item.giveInfolist)
                                        }else if(item.ProdType && item.ProdType != 'Coupon'){
                                            this.giveZS = this.giveZS.concat(item.giveInfolist)
                                        }
                                    }
                                })
                                
                                console.log('testProdList',this.testProdList);
                                //类型
                                // this.prodType = res.data.data.prodList[0].ProdType
                                //反赠商品
                                // this.giveInfolist = res.data.data.prodList[0].giveInfolist
                            }
                        }else{
                            this.$message({
                                message:res.data.info,
                                type:'error'
                            })
                        }
                        
                    }).catch(error=>{
                        console.log('error',error);
                        this.testProdList = []
                        this.Rsp_RIDStr = [{
                            AID:'',     //规则ID
                            ISUseBonus:'',  //是否使用积分抵现
                            ISUseCoupons:'',    //是否使用优惠券
                            RuleDiscountMethod:'', 
                            RuleDiscountType:'',
                            RuleName:'',    //规则名称
                            RuleTyep:'',
                            YHJE:'', //总优惠金额
                        }],
                        this.giveInfolist = []
                    }).finally(()=>{
                        this.testLoading = false
                    })
                },
            }
        })
    </script>
@endsection