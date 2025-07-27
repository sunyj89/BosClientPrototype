import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

// 采购管理
import OilDeliveryLayout from './pages/purchase/oil-delivery/Layout';
import OilLossLayout from './pages/purchase/oil-delivery/OilLossLayout';
import DeliveryPlan from './pages/purchase/oil-delivery/DeliveryPlan';
import DeliveryPlanDetail from './pages/purchase/oil-delivery/DeliveryPlanDetail';
import DeliveryPlanStats from './pages/purchase/oil-delivery/DeliveryPlanStats';
import SmallDelivery from './pages/purchase/oil-delivery/SmallDelivery';
import SmallDeliveryStats from './pages/purchase/oil-delivery/SmallDeliveryStats';
import OilLossOrder from './pages/purchase/oil-delivery/OilLossOrder';
import OilLossSummary from './pages/purchase/oil-delivery/OilLossSummary';
import OilLossAnalysis from './pages/purchase/oil-delivery/OilLossAnalysis';
import OilLossCost from './pages/purchase/oil-delivery/OilLossCost';
import OilOverflowOrder from './pages/purchase/oil-delivery/OilOverflowOrder';
import OilOverflowSummary from './pages/purchase/oil-delivery/OilOverflowSummary';

import OilInquiryManagement from './pages/purchase/oil-inquiry-management';
import OilProcurementManagement from './pages/purchase/oil-procurement-management';
import NonOilProcurement from './pages/purchase/non-oil-procurement';

// 物流管理
import OilWarehouseDelivery from './pages/logistics/oil-warehouse-delivery';

// 供应商管理
import SupplierRoutes from './pages/supplier';

// 商品管理
import GoodsManagement from './pages/goods';
import CategoryManagement from './pages/goods/category';
import ProductMaintenance from './pages/goods/maintenance';
import ComboProduct from './pages/goods/combo';
import GoodsInventoryManagement from './pages/goods/inventory';
import GoodsPriceManagement from './pages/goods/pricing';
import GoodsPurchaseManagement from './pages/goods/purchase';
import ProductMasterData from './pages/goods/master-data';



// 会员中心
import MemberCenter from './pages/member';
import PersonalCenterConfig from './pages/member/personal-center-config';
import MemberFeedbackEvaluation from './pages/member/feedback-evaluation';

// 数字化运营分析
import DataAnalysisCenter from './pages/analytics/data-center';
import CustomerCenter from './pages/analytics/customer-center';
import RiskCenter from './pages/analytics/risk-center';
import AnalyticsDashboard from './pages/analytics/dashboard';

// 积分管理
import PointsRoutes from './pages/points';

// 营销中心
import CouponConfig from './pages/marketing/coupon-config';
import ActivityConfig from './pages/marketing/activity-config';
import MemberReferral from './pages/marketing/member-referral';
import ItemMarketing from './pages/marketing/item-marketing';
import OrderMarketing from './pages/marketing/order-marketing';
import MemberIdentity from './pages/marketing/member-identity';
import MemberLevel from './pages/marketing/member-level';



// 油站管理
import StationRoutes from './pages/station';

// 液位仪管理（已移到设备管理下）
import LiquidLevelMeterManagement from './pages/equipment/liquid-level-meter';
import LiquidLevelMeterDetail from './pages/equipment/liquid-level-meter/components/DeviceDetail';



// 报表管理
import ShiftHandoverReport from './pages/report/shift-handover';
import OilSalesReport from './pages/report/oil-sales';
import OilInventoryReport from './pages/report/oil-inventory';

// 设备管理
import EquipmentArchive from './pages/equipment/archive';
import DispenserCalibration from './pages/equipment/dispenser-calibration';
import GeneratorOperation from './pages/equipment/generator-operation';
import WaterElectricityRecords from './pages/equipment/water-electricity';

// 支付管理
import PaymentMethods from './pages/payment/methods';
import SettlementChannel from './pages/payment/settlement';
import OneclickConfig from './pages/payment/oneclick';
import ContactlessConfig from './pages/payment/contactless';
import QRCodeConfig from './pages/payment/qrcode';

// 组织架构管理
import OrganizationManagement from './pages/organization';
import RoleConfiguration from './pages/organization/role-configuration';

// 安全管理
import InspectionManagement from './pages/security/inspection-management';
import ArchiveManagement from './pages/security/archive-management';
import MaintenanceManagement from './pages/security/maintenance-management';

// 损溢管理
import LossManagement from './pages/loss';

// 销售管理
import SalesManagement from './pages/sales/SalesManagement';
import OilSalesManagement from './pages/sales/oil/OilSalesManagement';
import GoodsSalesManagement from './pages/sales/goods/GoodsSalesManagement';
import OilSalesLayout from './pages/sales/oil/Layout';
import GoodsSalesLayout from './pages/sales/goods/Layout';
import OrderList from './pages/sales/oil/query/order';
import OrderDetail from './pages/sales/oil/query/detail';
import ControlFlow from './pages/sales/oil/query/control';
import AbandonedOrder from './pages/sales/oil/query/abandoned';

// 油品价格管理
import OilPriceManagement from './pages/sales/oil/price/index';
import AddOilPrice from './pages/sales/oil/price/add';
import EditOilPrice from './pages/sales/oil/price/edit';
import OilPriceDetail from './pages/sales/oil/price/detail';
import OilPriceApproval from './pages/sales/oil/price/approval';
import OilPriceApplication from './pages/sales/oil/price/application';

// 油品销售任务目标
import TargetApplication from './pages/sales/oil/target/application';

// 油罐管理 - 迁移到station目录
import TankManagement from './pages/station/tank/index';
import GunManagement from './pages/station/gun/index';


import OilDensity from './pages/oil/density/index';
import OilMasterData from './pages/oil/master-data/index';

// 数据冲正管理
import CorrectionManagement from './pages/sales/oil/correction/index';

// 油品直销管理
import DirectSalesManagement from './pages/sales/oil/direct/index';
import DirectSalesOrderDetail from './pages/sales/oil/direct/order-detail';
import CreateDirectSalesOrder from './pages/sales/oil/direct/create-order';

// 商品销售管理
import GoodsSalesDetail from './pages/sales/goods/detail';
import PriceAdjustment from './pages/sales/goods/price-adjustment';
import PriceHistory from './pages/sales/goods/price-history';
import DailyReport from './pages/sales/goods/daily-report';
import SalesRanking from './pages/sales/goods/ranking';
import SalesPerformance from './pages/sales/goods/performance';
import OrganizationTask from './pages/sales/goods/organization-task';



const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* 供应商管理路由 */}
      <Route path="/supplier/*" element={<SupplierRoutes />} />
      
      {/* 油站管理路由 */}
      <Route path="/station/*" element={<StationRoutes />} />
      
      {/* 旧的设备管理路由已迁移到equipment下 */}
      
      {/* 采购管理路由 */}
      <Route path="/purchase">
        {/* 油品配送管理 */}
        <Route path="oil-delivery" element={<OilDeliveryLayout />}>
          <Route index element={<DeliveryPlan />} />
          <Route path="plan" element={<DeliveryPlan />} />
          <Route path="plan-detail" element={<DeliveryPlanDetail />} />
          <Route path="plan-stats" element={<DeliveryPlanStats />} />
          <Route path="small" element={<SmallDelivery />} />
          <Route path="small-stats" element={<SmallDeliveryStats />} />
        </Route>
        
        {/* 油品损耗管理 */}
        <Route path="oil-loss" element={<OilLossLayout />}>
          <Route index element={<OilLossOrder />} />
          <Route path="order" element={<OilLossOrder />} />
          <Route path="summary" element={<OilLossSummary />} />
          <Route path="analysis" element={<OilLossAnalysis />} />
          <Route path="cost" element={<OilLossCost />} />
          <Route path="overflow-order" element={<OilOverflowOrder />} />
          <Route path="overflow-summary" element={<OilOverflowSummary />} />
        </Route>
        

        
        {/* 油品询价管理 */}
        <Route path="oil-inquiry-management" element={<OilInquiryManagement />} />
        
        {/* 油品采购管理 */}
        <Route path="oil-procurement-management" element={<OilProcurementManagement />} />
        
        {/* 非油商品采购管理 */}
        <Route path="non-oil-procurement" element={<NonOilProcurement />} />
      </Route>
      
      {/* 物流管理路由 */}
      <Route path="/logistics">
        {/* 油库出库管理 */}
        <Route path="oil-warehouse-delivery" element={<OilWarehouseDelivery />} />
      </Route>
      
      {/* 商品管理路由 */}
      <Route path="/goods">
        <Route index element={<GoodsManagement />} />
        <Route path="category" element={<CategoryManagement />} />
        <Route path="maintenance" element={<ProductMaintenance />} />
        <Route path="combo" element={<ComboProduct />} />
        <Route path="master-data" element={<ProductMasterData />} />
        <Route path="inventory" element={<GoodsInventoryManagement />} />
        <Route path="price" element={<GoodsPriceManagement />} />
        <Route path="purchase" element={<GoodsPurchaseManagement />} />
      </Route>
      

      {/* 数字化运营分析路由 */}
      <Route path="/analytics">
        <Route path="data-center" element={<DataAnalysisCenter />} />
        <Route path="customer-center" element={<CustomerCenter />} />
        <Route path="risk-center" element={<RiskCenter />} />
        <Route path="dashboard" element={<AnalyticsDashboard />} />
      </Route>

      {/* 会员中心路由 */}
      <Route path="/member">
        <Route index element={<MemberCenter />} />
        <Route path="personal-center-config" element={<PersonalCenterConfig />} />
        <Route path="feedback-evaluation" element={<MemberFeedbackEvaluation />} />
      </Route>
      
      {/* 积分管理路由 */}
      <Route path="/points/*" element={<PointsRoutes />} />
      

      
      {/* 销售管理路由 */}
      <Route path="/sales">
        <Route index element={<SalesManagement />} />
        
        {/* 油品销售管理 */}
        <Route path="oil" element={<OilSalesLayout />}>
          <Route index element={<OilSalesManagement />} />
          <Route path="query/order" element={<OrderList />} />
          <Route path="query/detail" element={<OrderDetail />} />
          <Route path="query/control" element={<ControlFlow />} />
          <Route path="query/abandoned" element={<AbandonedOrder />} />
          
          {/* 油品价格管理路由 */}
          <Route path="price" element={<OilPriceManagement />} />
          <Route path="price/add" element={<AddOilPrice />} />
          <Route path="price/edit/:id" element={<EditOilPrice />} />
          <Route path="price/detail/:id" element={<OilPriceDetail />} />
          <Route path="price/approval/:id" element={<OilPriceApproval />} />
          <Route path="price/application" element={<OilPriceApplication />} />
          <Route path="price/adjustment-detail" element={<NotFound />} />
          
          {/* 油品销售任务目标路由 */}
          <Route path="target/application" element={<TargetApplication />} />
          
          {/* 数据冲正管理路由 */}
          <Route path="correction" element={<CorrectionManagement />} />
          
          {/* 油品直销管理路由 */}
          <Route path="direct" element={<DirectSalesManagement />} />
          <Route path="direct/create" element={<CreateDirectSalesOrder />} />
          <Route path="direct/order-detail" element={<DirectSalesOrderDetail />} />
          <Route path="direct/order-stats" element={<NotFound />} />
        </Route>
        
        {/* 商品销售管理 */}
        <Route path="goods" element={<GoodsSalesLayout />}>
          <Route index element={<GoodsSalesManagement />} />
          <Route path="detail" element={<GoodsSalesDetail />} />
          <Route path="price-adjustment" element={<PriceAdjustment />} />
          <Route path="price-history" element={<PriceHistory />} />
          <Route path="daily-report" element={<DailyReport />} />
          <Route path="ranking" element={<SalesRanking />} />
          <Route path="performance" element={<SalesPerformance />} />
          <Route path="organization-task" element={<OrganizationTask />} />
        </Route>
      </Route>
      
      {/* 油品管理路由 */}
      <Route path="/oil">
        <Route path="master-data" element={<OilMasterData />} />
        <Route path="density" element={<OilDensity />} />
      </Route>
      
      {/* 报表管理路由 */}
      <Route path="/report">
        <Route path="shift-handover" element={<ShiftHandoverReport />} />
        <Route path="oil-sales" element={<OilSalesReport />} />
        <Route path="oil-inventory" element={<OilInventoryReport />} />
      </Route>
      
      {/* 设备管理路由 */}
      <Route path="/equipment">
        <Route path="archive" element={<EquipmentArchive />} />
        <Route path="dispenser-calibration" element={<DispenserCalibration />} />
        <Route path="generator-operation" element={<GeneratorOperation />} />
        <Route path="water-electricity" element={<WaterElectricityRecords />} />
        {/* 液位仪管理路由 */}
        <Route path="liquid-level-meter">
          <Route index element={<LiquidLevelMeterManagement />} />
          <Route path="detail/:deviceId" element={<LiquidLevelMeterDetail />} />
        </Route>
      </Route>

      {/* 支付管理路由 */}
      <Route path="/payment">
        <Route path="methods" element={<PaymentMethods />} />
        <Route path="settlement" element={<SettlementChannel />} />
        <Route path="oneclick" element={<OneclickConfig />} />
        <Route path="contactless" element={<ContactlessConfig />} />
        <Route path="qrcode" element={<QRCodeConfig />} />
      </Route>

      {/* 安全管理路由 */}
      <Route path="/security">
        <Route path="inspection-management" element={<InspectionManagement />} />
        <Route path="archive-management" element={<ArchiveManagement />} />
        <Route path="maintenance-management" element={<MaintenanceManagement />} />
      </Route>
      
      {/* 组织架构管理路由 */}
      <Route path="/organization">
        <Route index element={<OrganizationManagement />} />
        <Route path="role-configuration" element={<RoleConfiguration />} />
      </Route>
      
      {/* 损溢管理路由 */}
      <Route path="/loss">
        <Route index element={<LossManagement />} />
      </Route>

      {/* 营销中心路由 */}
      <Route path="/marketing">
        <Route path="coupon-config" element={<CouponConfig />} />
        <Route path="activity-config" element={<ActivityConfig />} />
        <Route path="price-discount-config" element={<NotFound />} />
        <Route path="member-identity" element={<MemberIdentity />} />
        <Route path="member-level" element={<MemberLevel />} />
        <Route path="member-referral" element={<MemberReferral />} />
        <Route path="item-marketing" element={<ItemMarketing />} />
        <Route path="order-marketing" element={<OrderMarketing />} />
      </Route>

      
      {/* 404页面 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter; 

