import React, { useState, useEffect, useMemo } from 'react';
import { 
  Card, 
  Input, 
  Tree, 
  Typography, 
  Space, 
  Table,
  Tabs,
  Empty,
  Badge,
  Tag,
  Collapse,
  Statistic
} from 'antd';
import { 
  SearchOutlined, 
  FileOutlined, 
  FolderOutlined, 
  DatabaseOutlined,
  CodeOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Panel } = Collapse;

const SiteMap = () => {
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [searchResults, setSearchResults] = useState([]);

  // 完整的站点地图数据
  const navigationData = [
    {
      title: '仪表盘',
      key: 'dashboard',
      path: '/dashboard',
      file: 'src/pages/Dashboard.js',
      dependencies: [
        { type: 'CSS', path: 'src/pages/Dashboard.css' },
        { type: '模拟数据', path: 'src/mock/dashboard/statistics.json' },
        { type: '组件', path: 'src/components/charts/LineChart.js' },
        { type: '组件', path: 'src/components/charts/BarChart.js' }
      ],
      children: []
    },
    {
      title: '供应商管理',
      key: 'supplier',
      children: [
        {
          title: '供应商列表',
          key: 'supplier_list',
          path: '/supplier',
          file: 'src/pages/supplier/index.js',
          dependencies: [
            { type: 'CSS', path: 'src/pages/supplier/index.css' },
            { type: '服务', path: 'src/services/supplier.js' },
            { type: '模拟数据', path: 'src/mock/supplier/suppliers.json' }
          ]
        },
        {
          title: '油品供应商',
          key: 'supplier_oil',
          path: '/supplier/oil',
          file: 'src/pages/supplier/OilSupplier.js',
          dependencies: [
            { type: '服务', path: 'src/services/supplier.js' },
            { type: '模拟数据', path: 'src/mock/supplier/oilSuppliers.json' }
          ]
        },
        {
          title: '商品供应商',
          key: 'supplier_goods',
          path: '/supplier/goods',
          file: 'src/pages/supplier/GoodsSupplier.js',
          dependencies: [
            { type: '服务', path: 'src/services/supplier.js' },
            { type: '模拟数据', path: 'src/mock/supplier/goodsSuppliers.json' }
          ]
        }
      ]
    },
    {
      title: '油站管理',
      key: 'station',
      children: [
        {
          title: '油站列表',
          key: 'station_list',
          path: '/station',
          file: 'src/pages/station/index.js',
          dependencies: [
            { type: 'CSS', path: 'src/pages/station/index.css' },
            { type: '服务', path: 'src/pages/station/services/stationService.js' },
            { type: '组件', path: 'src/pages/station/components/StationForm.js' },
            { type: '模拟数据', path: 'src/mock/station/stations.json' },
            { type: '模拟数据', path: 'src/mock/station/orgData.json' }
          ]
        },
        {
          title: '员工管理',
          key: 'station_organization',
          path: '/station/organization',
          file: 'src/pages/station/EmployeeManagement.js',
          dependencies: [
            { type: '组件', path: 'src/pages/station/components/EmployeeAuditDrawer.js' },
            { type: '模拟数据', path: 'src/mock/station/employees.json' },
            { type: '模拟数据', path: 'src/mock/station/orgData.json' }
          ]
        }
      ]
    },
    {
      title: '油品管理',
      key: 'oil',
      children: [
        {
          title: '油罐管理',
          key: 'oil_tank',
          path: '/oil/tank',
          file: 'src/pages/oil/tank/index.js',
          dependencies: [
            { type: 'CSS', path: 'src/pages/oil/tank/index.css' },
            { type: '服务', path: 'src/services/tankService.js' },
            { type: '组件', path: 'src/pages/oil/tank/components/TankForm.js' },
            { type: '模拟数据', path: 'src/mock/oil/tanks.json' }
          ]
        },
        {
          title: '油枪管理',
          key: 'oil_gun',
          path: '/oil/gun',
          file: 'src/pages/oil/gun/index.js',
          dependencies: [
            { type: '服务', path: 'src/services/gunService.js' },
            { type: '组件', path: 'src/pages/oil/gun/components/GunForm.js' },
            { type: '模拟数据', path: 'src/mock/oil/guns.json' }
          ]
        },
        {
          title: '油枪自检记录',
          key: 'oil_gun_inspection',
          path: '/oil/gun/inspection',
          file: 'src/pages/oil/gun/inspection/index.js',
          dependencies: [
            { type: '服务', path: 'src/services/gunInspectionService.js' },
            { type: '组件', path: 'src/pages/oil/gun/inspection/components/InspectionForm.js' },
            { type: '模拟数据', path: 'src/mock/oil/gunInspections.json' },
            { type: '模拟数据', path: 'src/mock/station/orgData.json' }
          ]
        },
        {
          title: '油品密度',
          key: 'oil_density',
          path: '/oil/density',
          file: 'src/pages/oil/density/index.js',
          dependencies: [
            { type: '服务', path: 'src/services/densityService.js' },
            { type: '组件', path: 'src/pages/oil/density/components/DensityForm.js' },
            { type: '模拟数据', path: 'src/mock/oil/densities.json' }
          ]
        }
      ]
    },
    {
      title: '采购管理',
      key: 'purchase',
      children: [
        {
          title: '油品配送管理',
          key: 'purchase_oil_delivery',
          path: '/purchase/oil-delivery',
          file: 'src/pages/purchase/oil-delivery/Layout.js',
          dependencies: [
            { type: 'CSS', path: 'src/pages/purchase/oil-delivery/layout.css' },
            { type: '服务', path: 'src/services/deliveryService.js' },
            { type: '模拟数据', path: 'src/mock/purchase/deliveries.json' }
          ],
          children: [
            {
              title: '配送计划',
              key: 'purchase_oil_delivery_plan',
              path: '/purchase/oil-delivery/plan',
              file: 'src/pages/purchase/oil-delivery/DeliveryPlan.js',
              dependencies: [
                { type: '组件', path: 'src/pages/purchase/oil-delivery/components/PlanForm.js' },
                { type: '模拟数据', path: 'src/mock/purchase/plans.json' }
              ]
            },
            {
              title: '计划详情',
              key: 'purchase_oil_delivery_plan_detail',
              path: '/purchase/oil-delivery/plan-detail',
              file: 'src/pages/purchase/oil-delivery/DeliveryPlanDetail.js',
              dependencies: [
                { type: '组件', path: 'src/pages/purchase/oil-delivery/components/PlanDetail.js' },
                { type: '模拟数据', path: 'src/mock/purchase/planDetails.json' }
              ]
            },
            {
              title: '计划统计',
              key: 'purchase_oil_delivery_plan_stats',
              path: '/purchase/oil-delivery/plan-stats',
              file: 'src/pages/purchase/oil-delivery/DeliveryPlanStats.js',
              dependencies: [
                { type: '组件', path: 'src/components/charts/BarChart.js' },
                { type: '模拟数据', path: 'src/mock/purchase/planStats.json' }
              ]
            },
            {
              title: '小额配送',
              key: 'purchase_oil_delivery_small',
              path: '/purchase/oil-delivery/small',
              file: 'src/pages/purchase/oil-delivery/SmallDelivery.js',
              dependencies: [
                { type: '组件', path: 'src/pages/purchase/oil-delivery/components/SmallDeliveryForm.js' },
                { type: '模拟数据', path: 'src/mock/purchase/smallDeliveries.json' }
              ]
            },
            {
              title: '小额配送统计',
              key: 'purchase_oil_delivery_small_stats',
              path: '/purchase/oil-delivery/small-stats',
              file: 'src/pages/purchase/oil-delivery/SmallDeliveryStats.js',
              dependencies: [
                { type: '组件', path: 'src/components/charts/PieChart.js' },
                { type: '模拟数据', path: 'src/mock/purchase/smallDeliveryStats.json' }
              ]
            }
          ]
        },
        {
          title: '油品损耗管理',
          key: 'purchase_oil_loss',
          path: '/purchase/oil-loss',
          file: 'src/pages/purchase/oil-delivery/OilLossLayout.js',
          dependencies: [
            { type: 'CSS', path: 'src/pages/purchase/oil-delivery/oilLossLayout.css' },
            { type: '服务', path: 'src/services/oilLossService.js' },
            { type: '模拟数据', path: 'src/mock/purchase/losses.json' }
          ],
          children: [
            {
              title: '损耗订单',
              key: 'purchase_oil_loss_order',
              path: '/purchase/oil-loss/order',
              file: 'src/pages/purchase/oil-delivery/OilLossOrder.js',
              dependencies: [
                { type: '组件', path: 'src/pages/purchase/oil-delivery/components/LossOrderForm.js' },
                { type: '模拟数据', path: 'src/mock/purchase/lossOrders.json' }
              ]
            },
            {
              title: '损耗汇总',
              key: 'purchase_oil_loss_summary',
              path: '/purchase/oil-loss/summary',
              file: 'src/pages/purchase/oil-delivery/OilLossSummary.js',
              dependencies: [
                { type: '组件', path: 'src/components/tables/SummaryTable.js' },
                { type: '模拟数据', path: 'src/mock/purchase/lossSummaries.json' }
              ]
            },
            {
              title: '损耗分析',
              key: 'purchase_oil_loss_analysis',
              path: '/purchase/oil-loss/analysis',
              file: 'src/pages/purchase/oil-delivery/OilLossAnalysis.js',
              dependencies: [
                { type: '组件', path: 'src/components/charts/LineChart.js' },
                { type: '模拟数据', path: 'src/mock/purchase/lossAnalysis.json' }
              ]
            },
            {
              title: '损耗成本',
              key: 'purchase_oil_loss_cost',
              path: '/purchase/oil-loss/cost',
              file: 'src/pages/purchase/oil-delivery/OilLossCost.js',
              dependencies: [
                { type: '组件', path: 'src/components/charts/BarChart.js' },
                { type: '模拟数据', path: 'src/mock/purchase/lossCosts.json' }
              ]
            },
            {
              title: '溢油订单',
              key: 'purchase_oil_loss_overflow_order',
              path: '/purchase/oil-loss/overflow-order',
              file: 'src/pages/purchase/oil-delivery/OilOverflowOrder.js',
              dependencies: [
                { type: '组件', path: 'src/pages/purchase/oil-delivery/components/OverflowOrderForm.js' },
                { type: '模拟数据', path: 'src/mock/purchase/overflowOrders.json' }
              ]
            },
            {
              title: '溢油汇总',
              key: 'purchase_oil_loss_overflow_summary',
              path: '/purchase/oil-loss/overflow-summary',
              file: 'src/pages/purchase/oil-delivery/OilOverflowSummary.js',
              dependencies: [
                { type: '组件', path: 'src/components/tables/SummaryTable.js' },
                { type: '模拟数据', path: 'src/mock/purchase/overflowSummaries.json' }
              ]
            }
          ]
        },
        {
          title: '油品采购订单',
          key: 'purchase_oil_order',
          path: '/purchase/oil-order',
          file: 'src/pages/purchase/oil-order/index.js',
          dependencies: [
            { type: 'CSS', path: 'src/pages/purchase/oil-order/index.css' },
            { type: '服务', path: 'src/services/oilOrderService.js' },
            { type: '组件', path: 'src/pages/purchase/oil-order/components/OrderForm.js' },
            { type: '模拟数据', path: 'src/mock/purchase/oilOrders.json' }
          ]
        }
      ]
    },
    {
      title: '销售管理',
      key: 'sales',
      children: [
        {
          title: '油品销售管理',
          key: 'sales_oil',
          path: '/sales/oil',
          file: 'src/pages/sales/oil/OilSalesManagement.js',
          dependencies: [
            { type: 'CSS', path: 'src/pages/sales/oil/oilSales.css' },
            { type: '服务', path: 'src/services/oilSalesService.js' },
            { type: '模拟数据', path: 'src/mock/sales/oilSales.json' }
          ],
          children: [
            {
              title: '订单查询',
              key: 'sales_oil_query_order',
              path: '/sales/oil/query/order',
              file: 'src/pages/sales/oil/query/order.js',
              dependencies: [
                { type: '组件', path: 'src/pages/sales/oil/components/OrderSearch.js' },
                { type: '模拟数据', path: 'src/mock/sales/orders.json' }
              ]
            },
            {
              title: '详情查询',
              key: 'sales_oil_query_detail',
              path: '/sales/oil/query/detail',
              file: 'src/pages/sales/oil/query/detail.js',
              dependencies: [
                { type: '组件', path: 'src/pages/sales/oil/components/DetailView.js' },
                { type: '模拟数据', path: 'src/mock/sales/orderDetails.json' }
              ]
            },
            {
              title: '控制流',
              key: 'sales_oil_query_control',
              path: '/sales/oil/query/control',
              file: 'src/pages/sales/oil/query/control.js',
              dependencies: [
                { type: '组件', path: 'src/pages/sales/oil/components/ControlFlowChart.js' },
                { type: '模拟数据', path: 'src/mock/sales/controlFlows.json' }
              ]
            },
            {
              title: '废弃订单',
              key: 'sales_oil_query_abandoned',
              path: '/sales/oil/query/abandoned',
              file: 'src/pages/sales/oil/query/abandoned.js',
              dependencies: [
                { type: '组件', path: 'src/pages/sales/oil/components/AbandonedList.js' },
                { type: '模拟数据', path: 'src/mock/sales/abandonedOrders.json' }
              ]
            }
          ]
        },
        {
          title: '油品价格管理',
          key: 'sales_oil_price',
          path: '/sales/oil/price',
          file: 'src/pages/sales/oil/price/index.js',
          dependencies: [
            { type: 'CSS', path: 'src/pages/sales/oil/price/price.css' },
            { type: '服务', path: 'src/services/oilPriceService.js' },
            { type: '模拟数据', path: 'src/mock/sales/oilPrices.json' }
          ],
          children: [
            {
              title: '添加价格',
              key: 'sales_oil_price_add',
              path: '/sales/oil/price/add',
              file: 'src/pages/sales/oil/price/add.js',
              dependencies: [
                { type: '组件', path: 'src/pages/sales/oil/price/components/PriceForm.js' },
                { type: '模拟数据', path: 'src/mock/sales/oilTypes.json' }
              ]
            },
            {
              title: '编辑价格',
              key: 'sales_oil_price_edit',
              path: '/sales/oil/price/edit/:id',
              file: 'src/pages/sales/oil/price/edit.js',
              dependencies: [
                { type: '组件', path: 'src/pages/sales/oil/price/components/PriceForm.js' },
                { type: '模拟数据', path: 'src/mock/sales/oilTypes.json' }
              ]
            },
            {
              title: '价格详情',
              key: 'sales_oil_price_detail',
              path: '/sales/oil/price/detail/:id',
              file: 'src/pages/sales/oil/price/detail.js',
              dependencies: [
                { type: '组件', path: 'src/pages/sales/oil/price/components/PriceDetail.js' },
                { type: '模拟数据', path: 'src/mock/sales/priceDetails.json' }
              ]
            },
            {
              title: '价格审批',
              key: 'sales_oil_price_approval',
              path: '/sales/oil/price/approval/:id',
              file: 'src/pages/sales/oil/price/approval.js',
              dependencies: [
                { type: '组件', path: 'src/pages/sales/oil/price/components/ApprovalForm.js' },
                { type: '模拟数据', path: 'src/mock/sales/priceApprovals.json' }
              ]
            },
            {
              title: '价格申请',
              key: 'sales_oil_price_application',
              path: '/sales/oil/price/application',
              file: 'src/pages/sales/oil/price/application.js',
              dependencies: [
                { type: '组件', path: 'src/pages/sales/oil/price/components/ApplicationForm.js' },
                { type: '模拟数据', path: 'src/mock/sales/priceApplications.json' }
              ]
            }
          ]
        },
        {
          title: '销售任务目标',
          key: 'sales_oil_target',
          path: '/sales/oil/target/application',
          file: 'src/pages/sales/oil/target/application.js'
        },
        {
          title: '数据冲正管理',
          key: 'sales_oil_correction',
          path: '/sales/oil/correction',
          file: 'src/pages/sales/oil/correction/index.js'
        },
        {
          title: '油品直销管理',
          key: 'sales_oil_direct',
          path: '/sales/oil/direct',
          file: 'src/pages/sales/oil/direct/index.js',
          children: [
            {
              title: '创建订单',
              key: 'sales_oil_direct_create',
              path: '/sales/oil/direct/create',
              file: 'src/pages/sales/oil/direct/create-order.js'
            },
            {
              title: '订单详情',
              key: 'sales_oil_direct_order_detail',
              path: '/sales/oil/direct/order-detail',
              file: 'src/pages/sales/oil/direct/order-detail.js'
            }
          ]
        },
        {
          title: '商品销售管理',
          key: 'sales_goods',
          path: '/sales/goods',
          file: 'src/pages/sales/goods/GoodsSalesManagement.js',
          children: [
            {
              title: '销售详情',
              key: 'sales_goods_detail',
              path: '/sales/goods/detail',
              file: 'src/pages/sales/goods/detail.js'
            },
            {
              title: '价格调整',
              key: 'sales_goods_price_adjustment',
              path: '/sales/goods/price-adjustment',
              file: 'src/pages/sales/goods/price-adjustment.js'
            },
            {
              title: '价格历史',
              key: 'sales_goods_price_history',
              path: '/sales/goods/price-history',
              file: 'src/pages/sales/goods/price-history.js'
            },
            {
              title: '日报表',
              key: 'sales_goods_daily_report',
              path: '/sales/goods/daily-report',
              file: 'src/pages/sales/goods/daily-report.js'
            },
            {
              title: '销售排名',
              key: 'sales_goods_ranking',
              path: '/sales/goods/ranking',
              file: 'src/pages/sales/goods/ranking.js'
            },
            {
              title: '销售绩效',
              key: 'sales_goods_performance',
              path: '/sales/goods/performance',
              file: 'src/pages/sales/goods/performance.js'
            },
            {
              title: '组织任务',
              key: 'sales_goods_organization_task',
              path: '/sales/goods/organization-task',
              file: 'src/pages/sales/goods/organization-task.js'
            }
          ]
        }
      ]
    },
    {
      title: '油品库存管理',
      key: 'inventory',
      children: [
        {
          title: '进油管理',
          key: 'inventory_oil_input',
          path: '/inventory/oil-input',
          file: 'src/pages/inventory/oil-input/OilInput.js'
        },
        {
          title: '油品调拨',
          key: 'inventory_oil_transfer',
          path: '/inventory/oil-transfer',
          file: 'src/pages/inventory/oil-transfer/OilTransfer.js'
        },
        {
          title: '库存查询',
          key: 'inventory_inventory_query',
          path: '/inventory/inventory-query',
          file: 'src/pages/inventory/inventory-query/InventoryQuery.js'
        },
        {
          title: '自用油申请',
          key: 'inventory_self_use',
          path: '/inventory/self-use',
          file: 'src/pages/inventory/self-use/SelfUse.js'
        },
        {
          title: '回灌油申请',
          key: 'inventory_refill',
          path: '/inventory/refill',
          file: 'src/pages/inventory/refill/Refill.js'
        }
      ]
    },
    {
      title: '配送管理',
      key: 'delivery',
      children: [
        {
          title: '承运单位',
          key: 'supplier_transport',
          path: '/supplier/transport',
          file: '未实现'
        },
        {
          title: '运费结算单',
          key: 'purchase_transport_settlement',
          path: '/purchase/transport-settlement',
          file: '未实现'
        },
        {
          title: '运费明细',
          key: 'purchase_transport_details',
          path: '/purchase/transport-details',
          file: '未实现'
        },
        {
          title: '油库管理',
          key: 'oil_depot',
          path: '/oil/depot',
          file: '未实现'
        },
        {
          title: '油库距离管理',
          key: 'oil_depot_distance',
          path: '/oil/depot/distance',
          file: '未实现'
        }
      ]
    },
    {
      title: '设备管理',
      key: 'device',
      children: [
        {
          title: '液位仪管理',
          key: 'device_list',
          path: '/device',
          file: 'src/pages/device/DeviceManagement.js'
        }
      ]
    },
    {
      title: '商品管理',
      key: 'goods',
      children: [
        {
          title: '商品类别',
          key: 'goods_category',
          path: '/goods/category',
          file: 'src/pages/goods/GoodsCategoryManagement.js'
        },
        {
          title: '库存管理',
          key: 'goods_inventory',
          path: '/goods/inventory',
          file: 'src/pages/goods/GoodsInventoryManagement.js'
        },
        {
          title: '价格调整',
          key: 'goods_price',
          path: '/goods/price',
          file: 'src/pages/goods/GoodsPriceManagement.js'
        }
      ]
    },
    {
      title: '会员管理',
      key: 'membership',
      children: [
        {
          title: '会员卡管理',
          key: 'membership_card',
          path: '/membership/card',
          file: 'src/pages/membership/MemberCardManagement.js'
        },
        {
          title: '积分管理',
          key: 'membership_points',
          path: '/membership/points',
          file: 'src/pages/membership/MemberPointsManagement.js'
        }
      ]
    },
    {
      title: '报表管理',
      key: 'report',
      children: [
        {
          title: '销售报表',
          key: 'report_sales',
          path: '/report/sales',
          file: 'src/pages/report/SalesReport.js'
        },
        {
          title: '库存报表',
          key: 'report_inventory',
          path: '/report/inventory',
          file: 'src/pages/report/InventoryReport.js'
        },
        {
          title: '会员报表',
          key: 'report_member',
          path: '/report/member',
          file: 'src/pages/report/MemberReport.js'
        },
        {
          title: '商品采购报表',
          key: 'report_purchase',
          path: '/report/purchase',
          file: 'src/pages/report/PurchaseReport.js'
        },
        {
          title: '商品销售报表',
          key: 'report_goods-sales',
          path: '/report/goods-sales',
          file: 'src/pages/report/GoodsSalesReport.js'
        },
        {
          title: '油品密度报表',
          key: 'report_density',
          path: '/report/density',
          file: 'src/pages/report/DensityReport.js'
        }
      ]
    },
    {
      title: '系统管理',
      key: 'system',
      children: [
        {
          title: '工作流程管理',
          key: 'system_workflow',
          path: '/system/workflow',
          file: '未实现',
          dependencies: [
            { type: '状态', path: '功能尚未实现' }
          ]
        },
        {
          title: '网站地图',
          key: 'system_sitemap',
          path: '/system/sitemap',
          file: 'src/pages/system/sitemap/SiteMap.js',
          dependencies: [
            { type: '组件', path: 'antd组件库: Tree, Table, Tabs等' },
            { type: '工具', path: 'react-router-dom: Link, useLocation' }
          ]
        }
      ]
    }
  ];

  // 将扁平的数据转换为树形结构
  const generateTreeNodes = (data) => {
    return data.map(item => {
      const title = (
        <Space>
          <span>{item.title}</span>
          {item.path && (
            <Link to={item.path} style={{ fontSize: '12px', color: '#1890ff' }}>
              (访问页面)
            </Link>
          )}
        </Space>
      );
      
      if (item.children && item.children.length > 0) {
        return {
          title,
          key: item.key,
          path: item.path,
          file: item.file,
          children: generateTreeNodes(item.children),
        };
      }
      
      return {
        title,
        key: item.key,
        path: item.path,
        file: item.file,
      };
    });
  };

  // 递归找到所有匹配节点及其路径
  const searchTree = (data, searchText) => {
    const results = [];
    
    const traverse = (node, parentTitle = '') => {
      // 组合完整路径名称
      const fullTitle = parentTitle 
        ? `${parentTitle} > ${node.title}` 
        : node.title;
      
      // 检查标题、路径或文件是否匹配
      const matchesTitle = node.title.toLowerCase().includes(searchText.toLowerCase());
      const matchesPath = node.path && node.path.toLowerCase().includes(searchText.toLowerCase());
      const matchesFile = node.file && node.file.toLowerCase().includes(searchText.toLowerCase());
      
      if (matchesTitle || matchesPath || matchesFile) {
        results.push({
          key: node.key,
          title: fullTitle,
          path: node.path || '-',
          file: node.file || '-',
        });
      }
      
      // 遍历子节点
      if (node.children && node.children.length > 0) {
        node.children.forEach(child => traverse(child, fullTitle));
      }
    };
    
    data.forEach(node => traverse(node));
    return results;
  };

  // 处理搜索值变化
  useEffect(() => {
    if (searchValue) {
      const results = searchTree(navigationData, searchValue);
      setSearchResults(results);
      
      // 找出所有匹配项的父节点键，以便自动展开
      const matchedKeys = results.map(item => item.key);
      setExpandedKeys(matchedKeys);
      setAutoExpandParent(true);
    } else {
      setSearchResults([]);
      setExpandedKeys([]);
    }
  }, [searchValue]);

  // 处理展开/收起
  const onExpand = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  // 搜索结果表格列
  const columns = [
    {
      title: '页面路径',
      dataIndex: 'title',
      key: 'title',
      width: '20%',
    },
    {
      title: '访问地址',
      dataIndex: 'path',
      key: 'path',
      width: '15%',
      render: (path) => (
        path !== '-' ? (
          <Link to={path}>{path}</Link>
        ) : (
          <Text type="secondary">无路径</Text>
        )
      ),
    },
    {
      title: '主文件位置',
      dataIndex: 'file',
      key: 'file',
      width: '20%',
    },
    {
      title: 'CSS/依赖/数据文件',
      dataIndex: 'dependencies',
      key: 'dependencies',
      width: '45%',
      render: (dependencies) => {
        if (!dependencies || dependencies.length === 0) {
          return <Text type="secondary">无额外依赖</Text>;
        }
        
        return (
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {dependencies.map((dep, index) => (
              <li key={index}>
                <Text>{dep.type}: {dep.path}</Text>
              </li>
            ))}
          </ul>
        );
      },
    },
  ];

  // 处理扁平化所有文件路径
  const getAllFiles = useMemo(() => {
    const files = [];
    
    const extractFiles = (data) => {
      data.forEach(item => {
        // 添加主文件
        if (item.file && item.file !== '未实现') {
          files.push({
            path: item.file,
            type: 'JS',
            pageTitle: item.title,
            pagePath: item.path
          });
        }
        
        // 添加依赖文件
        if (item.dependencies) {
          item.dependencies.forEach(dep => {
            // 排除非文件路径的描述
            if (dep.path && !dep.path.includes('组件库') && !dep.path.includes(':')) {
              files.push({
                path: dep.path,
                type: dep.type,
                pageTitle: item.title,
                pagePath: item.path
              });
            }
          });
        }
        
        // 递归处理子项
        if (item.children && item.children.length > 0) {
          extractFiles(item.children);
        }
      });
    };
    
    extractFiles(navigationData);
    return files;
  }, [navigationData]);
  
  // 文件类型统计
  const fileStatistics = useMemo(() => {
    const stats = {
      JS: 0,
      CSS: 0,
      '模拟数据': 0,
      '服务': 0,
      '组件': 0,
      '工具': 0,
      total: 0
    };
    
    getAllFiles.forEach(file => {
      if (stats[file.type] !== undefined) {
        stats[file.type]++;
      }
      stats.total++;
    });
    
    return stats;
  }, [getAllFiles]);
  
  // 按目录结构组织文件
  const fileTree = useMemo(() => {
    const tree = {};
    
    getAllFiles.forEach(file => {
      const parts = file.path.split('/');
      let current = tree;
      
      // 构建目录树
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) {
          current[parts[i]] = {};
        }
        current = current[parts[i]];
      }
      
      // 添加文件
      const fileName = parts[parts.length - 1];
      if (!current[fileName]) {
        current[fileName] = {
          type: file.type,
          pageTitle: file.pageTitle,
          pagePath: file.pagePath
        };
      } else if (Array.isArray(current[fileName])) {
        current[fileName].push({
          type: file.type,
          pageTitle: file.pageTitle,
          pagePath: file.pagePath
        });
      } else {
        current[fileName] = [
          current[fileName],
          {
            type: file.type,
            pageTitle: file.pageTitle,
            pagePath: file.pagePath
          }
        ];
      }
    });
    
    return tree;
  }, [getAllFiles]);
  
  // 渲染文件树的递归函数
  const renderFileTree = (tree, path = '') => {
    return Object.keys(tree).map(key => {
      const currentPath = path ? `${path}/${key}` : key;
      
      // 如果是对象且没有type属性，则是目录
      if (typeof tree[key] === 'object' && !tree[key].type) {
        return (
          <Panel 
            header={
              <Space>
                <FolderOutlined />
                <Text strong>{key}</Text>
                <Badge count={Object.keys(tree[key]).length} style={{ backgroundColor: '#52c41a' }} />
              </Space>
            }
            key={currentPath}
          >
            <Collapse ghost>
              {renderFileTree(tree[key], currentPath)}
            </Collapse>
          </Panel>
        );
      } else {
        // 是文件
        const fileInfo = tree[key];
        const fileInfoArray = Array.isArray(fileInfo) ? fileInfo : [fileInfo];
        
        return (
          <Panel 
            header={
              <Space>
                <FileOutlined />
                <Text>{key}</Text>
                {fileInfoArray.map((info, idx) => (
                  <Tag color={getTagColor(info.type)} key={idx}>
                    {info.type}
                  </Tag>
                ))}
              </Space>
            }
            key={currentPath}
          >
            {fileInfoArray.map((info, idx) => (
              <Paragraph key={idx}>
                <Text type="secondary">用于页面: </Text>
                {info.pagePath ? (
                  <Link to={info.pagePath}>{info.pageTitle}</Link>
                ) : (
                  <Text>{info.pageTitle}</Text>
                )}
              </Paragraph>
            ))}
          </Panel>
        );
      }
    });
  };
  
  // 获取标签颜色
  const getTagColor = (type) => {
    const colorMap = {
      'JS': 'blue',
      'CSS': 'magenta',
      '模拟数据': 'gold',
      '服务': 'green',
      '组件': 'purple',
      '工具': 'cyan'
    };
    
    return colorMap[type] || 'default';
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>网站地图</Title>
      <Text type="secondary" style={{ marginBottom: '24px', display: 'block' }}>
        查看系统中所有页面的路径和对应文件，包括JS文件、CSS文件、依赖文件和模拟数据文件，帮助您更好地了解系统结构。
      </Text>
      
      <Card style={{ marginBottom: '24px' }}>
        <Input
          placeholder="输入关键词搜索页面、路径或文件"
          prefix={<SearchOutlined />}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          style={{ marginBottom: '16px' }}
          allowClear
        />
        
        <Tabs defaultActiveKey="1">
          <TabPane tab="功能导航" key="1">
            {searchValue && searchResults.length === 0 ? (
              <Empty description="未找到匹配的页面" />
            ) : (
              <Tree
                showLine
                onExpand={onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                treeData={generateTreeNodes(navigationData)}
              />
            )}
          </TabPane>
          <TabPane tab="搜索结果" key="2">
            {searchValue ? (
              <Table 
                columns={columns} 
                dataSource={searchResults}
                rowKey="key"
                pagination={false}
                size="middle"
              />
            ) : (
              <Empty description="请输入关键词搜索" />
            )}
          </TabPane>
          <TabPane tab="文件目录" key="3">
            <Card style={{ marginBottom: '16px' }}>
              <Space size="large">
                <Statistic 
                  title="总文件数" 
                  value={fileStatistics.total} 
                  suffix="个" 
                  style={{ marginRight: '20px' }}
                />
                <Statistic title="JS文件" value={fileStatistics.JS} suffix="个" />
                <Statistic title="CSS文件" value={fileStatistics.CSS} suffix="个" />
                <Statistic title="模拟数据" value={fileStatistics['模拟数据']} suffix="个" />
                <Statistic title="服务文件" value={fileStatistics['服务']} suffix="个" />
                <Statistic title="组件文件" value={fileStatistics['组件']} suffix="个" />
              </Space>
            </Card>
            
            <Collapse defaultActiveKey={['src']}>
              {renderFileTree(fileTree)}
            </Collapse>
          </TabPane>
          <TabPane tab="依赖关系" key="4">
            <Collapse>
              {navigationData.map(module => (
                <Panel 
                  header={
                    <Space>
                      <Text strong>{module.title}</Text>
                      <Badge 
                        count={
                          module.children 
                            ? module.children.length 
                            : 0
                        } 
                        style={{ backgroundColor: '#108ee9' }} 
                      />
                    </Space>
                  } 
                  key={module.key}
                >
                  {module.children && module.children.length > 0 ? (
                    module.children.map(page => (
                      <Card 
                        title={
                          <Space>
                            <Text>{page.title}</Text>
                            {page.path && (
                              <Link to={page.path} style={{ fontSize: '12px' }}>
                                ({page.path})
                              </Link>
                            )}
                          </Space>
                        }
                        style={{ marginBottom: '16px' }}
                        key={page.key}
                        size="small"
                      >
                        <Paragraph>
                          <Text strong>主文件: </Text> 
                          <Text code>{page.file}</Text>
                        </Paragraph>
                        
                        {page.dependencies && page.dependencies.length > 0 ? (
                          <>
                            <Text strong>依赖项:</Text>
                            <ul style={{ margin: 0 }}>
                              {page.dependencies.map((dep, idx) => (
                                <li key={idx}>
                                  <Tag color={getTagColor(dep.type)}>{dep.type}</Tag>
                                  <Text code>{dep.path}</Text>
                                </li>
                              ))}
                            </ul>
                          </>
                        ) : (
                          <Text type="secondary">无额外依赖</Text>
                        )}
                      </Card>
                    ))
                  ) : (
                    module.file ? (
                      <Paragraph>
                        <Text strong>主文件: </Text>
                        <Text code>{module.file}</Text>
                      </Paragraph>
                    ) : (
                      <Empty description="无子页面" />
                    )
                  )}
                </Panel>
              ))}
            </Collapse>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default SiteMap; 