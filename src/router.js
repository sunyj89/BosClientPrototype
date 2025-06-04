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
import OilOrder from './pages/purchase/oil-order';
import NonOilPurchaseOrder from './pages/purchase/non-oil-purchase-order';
import NonOilPurchaseRequest from './pages/purchase/non-oil-purchase-request';
import OilPurchasePriceManagement from './pages/purchase/oil-purchase-price-management';
import OilInquiryManagement from './pages/purchase/oil-inquiry-management';

// 供应商管理
import OilSupplierManagement from './pages/supplier/OilSupplierManagement';
import GoodsSupplierManagement from './pages/supplier/GoodsSupplier';
import SupplierPortal from './pages/supplier/SupplierPortal';
import WinningQuotation from './pages/supplier/WinningQuotation';

// 商品管理
import GoodsManagement from './pages/goods/GoodsManagement';
import GoodsCategoryManagement from './pages/goods/GoodsCategoryManagement';
import GoodsInventoryManagement from './pages/goods/GoodsInventoryManagement';
import GoodsPriceManagement from './pages/goods/GoodsPriceManagement';

// 会员管理
import MembershipManagement from './pages/membership/MembershipManagement';
import MemberCardManagement from './pages/membership/MemberCardManagement';
import MemberPointsManagement from './pages/membership/MemberPointsManagement';

// 报表管理
import ReportManagement from './pages/report/ReportManagement';
import SalesReport from './pages/report/SalesReport';
import InventoryReport from './pages/report/InventoryReport';
import MemberReport from './pages/report/MemberReport';
import PurchaseReport from './pages/report/PurchaseReport';
import GoodsSalesReport from './pages/report/GoodsSalesReport';
import DensityReport from './pages/report/DensityReport';

// 油站管理
import StationManagement from './pages/station/index';

// 设备管理
import DeviceManagementNew from './pages/device/DeviceManagement';
import DeviceDetailNew from './pages/device/DeviceDetail';

// 系统管理
import SystemManagement from './pages/system/SystemManagement';
import SiteMap from './pages/system/sitemap/SiteMap';

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

// 油罐管理
import TankManagement from './pages/oil/tank/index';
import GunManagement from './pages/oil/gun/index';
import GunInspection from './pages/oil/gun/inspection/index';
import GunChangeManagement from './pages/oil/gun/change/index';
import OilDensity from './pages/oil/density/index';

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

// 油品库存管理
import InventoryManagement from './pages/inventory/InventoryManagement';
import InventoryOilInput from './pages/inventory/oil-input/OilInput';
import OilTransfer from './pages/inventory/oil-transfer/OilTransfer';
import InventoryQuery from './pages/inventory/inventory-query/InventoryQuery';
import SelfUse from './pages/inventory/self-use/SelfUse';
import Refill from './pages/inventory/refill/Refill';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* 供应商管理路由 */}
      <Route path="/supplier">
        <Route index element={<Navigate to="/supplier/oil" />} />
        <Route path="oil" element={<OilSupplierManagement />} />
        <Route path="goods" element={<GoodsSupplierManagement />} />
        <Route path="portal" element={<SupplierPortal />} />
        <Route path="winning-quotation" element={<WinningQuotation />} />
      </Route>
      
      {/* 油站管理路由 */}
      <Route path="/station">
        <Route index element={<StationManagement />} />
      </Route>
      
      {/* 设备管理路由 */}
      <Route path="/device">
        <Route index element={<DeviceManagementNew />} />
        <Route path=":id" element={<DeviceDetailNew />} />
      </Route>
      
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
        
        {/* 油品采购订单 */}
        <Route path="oil-order" element={<OilOrder />} />
        
        {/* 非油品采购申请 */}
        <Route path="non-oil-purchase-request" element={<NonOilPurchaseRequest />} />
        
        {/* 非油品采购订单 */}
        <Route path="non-oil-purchase-order" element={<NonOilPurchaseOrder />} />
        
        {/* 油品进价管理 */}
        <Route path="oil-purchase-price-management" element={<OilPurchasePriceManagement />} />
        
        {/* 油品询价管理 */}
        <Route path="oil-inquiry-management" element={<OilInquiryManagement />} />
      </Route>
      
      {/* 商品管理路由 */}
      <Route path="/goods">
        <Route index element={<GoodsManagement />} />
        <Route path="category" element={<GoodsCategoryManagement />} />
        <Route path="inventory" element={<GoodsInventoryManagement />} />
        <Route path="price" element={<GoodsPriceManagement />} />
      </Route>
      
      {/* 会员管理路由 */}
      <Route path="/membership">
        <Route index element={<MembershipManagement />} />
        <Route path="card" element={<MemberCardManagement />} />
        <Route path="points" element={<MemberPointsManagement />} />
      </Route>
      
      {/* 报表管理路由 */}
      <Route path="/report">
        <Route index element={<ReportManagement />} />
        <Route path="sales" element={<SalesReport />} />
        <Route path="inventory" element={<InventoryReport />} />
        <Route path="member" element={<MemberReport />} />
        <Route path="purchase" element={<PurchaseReport />} />
        <Route path="goods-sales" element={<GoodsSalesReport />} />
        <Route path="density" element={<DensityReport />} />
      </Route>
      
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
      
      {/* 油罐管理路由 */}
      <Route path="/oil">
        <Route path="tank" element={<TankManagement />} />
        <Route path="gun" element={<GunManagement />} />
        <Route path="gun/inspection" element={<GunInspection />} />
        <Route path="gun/change" element={<GunChangeManagement />} />
        <Route path="density" element={<OilDensity />} />
      </Route>
      
      {/* 系统管理路由 */}
      <Route path="/system" element={<SystemManagement />} />
      <Route path="/system/sitemap" element={<SiteMap />} />
      
      {/* 油品库存管理路由 */}
      <Route path="/inventory">
        <Route index element={<InventoryManagement />} />
        <Route path="oil-input" element={<InventoryOilInput />} />
        <Route path="oil-transfer" element={<OilTransfer />} />
        <Route path="inventory-query" element={<InventoryQuery />} />
        <Route path="self-use" element={<SelfUse />} />
        <Route path="refill" element={<Refill />} />
      </Route>
      
      {/* 404页面 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter; 

