import React, { useState } from 'react';
import { Card, Row, Col, Breadcrumb, Statistic, Button, Select, TreeSelect } from 'antd';
import { 
  BarChartOutlined, 
  LineChartOutlined, 
  PieChartOutlined, 
  AreaChartOutlined,
  DownloadOutlined,
  PrinterOutlined,
  ReloadOutlined,
  TableOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';

const ReportManagement = () => {
  const navigate = useNavigate();
  const [selectedOrg, setSelectedOrg] = useState('company-0');

  // 模拟组织结构数据
  const orgData = {
    key: 'company-0',
    title: '总公司',
    value: 'company-0',
    children: Array.from({ length: 7 }, (_, i) => ({
      key: `branch-${i}`,
      title: `分公司 ${i + 1}`,
      value: `branch-${i}`,
      children: Array.from({ length: 10 }, (_, j) => ({
        key: `station-${i}-${j}`,
        title: `加油站 ${i + 1}-${j + 1}`,
        value: `station-${i}-${j}`,
      }))
    }))
  };

  // 销售趋势图配置
  const salesTrendOption = {
    title: {
      text: '近7天销售趋势'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['销售额', '交易笔数']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['3月7日', '3月8日', '3月9日', '3月10日', '3月11日', '3月12日', '3月13日']
    },
    yAxis: [
      {
        type: 'value',
        name: '销售额(元)'
      },
      {
        type: 'value',
        name: '交易笔数',
        axisLabel: {
          formatter: '{value} 笔'
        }
      }
    ],
    series: [
      {
        name: '销售额',
        type: 'line',
        data: [12500, 13200, 14100, 13800, 15200, 16300, 15800],
        yAxisIndex: 0,
        smooth: true
      },
      {
        name: '交易笔数',
        type: 'line',
        data: [125, 132, 141, 138, 152, 163, 158],
        yAxisIndex: 1,
        smooth: true
      }
    ]
  };

  // 销售构成图配置
  const salesCompositionOption = {
    title: {
      text: '销售构成分析'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      data: ['油品销售', '便利店销售', '洗车服务', '其他服务']
    },
    series: [
      {
        name: '销售额',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 68500, name: '油品销售' },
          { value: 15200, name: '便利店销售' },
          { value: 8300, name: '洗车服务' },
          { value: 3500, name: '其他服务' }
        ]
      }
    ]
  };

  // 导航到各个报表页面
  const navigateToReport = (path) => {
    navigate(path);
  };

  // 处理组织选择变化
  const handleOrgChange = (value) => {
    setSelectedOrg(value);
  };

  return (
    <div>
      <div className="page-header">
        <h2>报表管理</h2>
      </div>

      {/* 组织筛选 */}
      <Card style={{ marginBottom: 16 }}>
        <Row align="middle">
          <Col span={6}>
            <span style={{ marginRight: 8 }}>选择组织:</span>
            <TreeSelect
              style={{ width: 280 }}
              value={selectedOrg}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={[orgData]}
              placeholder="请选择组织"
              treeDefaultExpandAll
              onChange={handleOrgChange}
            />
          </Col>
          <Col span={18} style={{ textAlign: 'right' }}>
            <Button 
              type="primary" 
              icon={<ReloadOutlined />} 
              style={{ marginRight: 8 }}
            >
              刷新数据
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 统计数据卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日销售额"
              value={15800}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix="¥"
              suffix="元"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日交易笔数"
              value={158}
              valueStyle={{ color: '#1890ff' }}
              suffix="笔"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="本月销售额"
              value={356500}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix="¥"
              suffix="元"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="本月交易笔数"
              value={3565}
              valueStyle={{ color: '#1890ff' }}
              suffix="笔"
            />
          </Card>
        </Col>
      </Row>

      {/* 图表展示 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Card title="销售趋势">
            <ReactECharts option={salesTrendOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="销售构成">
            <ReactECharts option={salesCompositionOption} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>

      {/* 报表入口 */}
      <Row gutter={16}>
        <Col span={6}>
          <Card 
            hoverable
            onClick={() => navigateToReport('/report/sales')}
            cover={
              <div style={{ 
                background: '#1890ff', 
                height: 120, 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center' 
              }}>
                <BarChartOutlined style={{ fontSize: 48, color: '#fff' }} />
              </div>
            }
          >
            <Card.Meta 
              title="销售报表" 
              description="查看销售数据统计、分析和趋势" 
            />
            <div style={{ marginTop: 16, textAlign: 'right' }}>
              <Button type="primary" size="small" onClick={(e) => {
                e.stopPropagation();
                navigateToReport('/report/sales');
              }}>
                查看报表
              </Button>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card 
            hoverable
            onClick={() => navigateToReport('/report/inventory')}
            cover={
              <div style={{ 
                background: '#52c41a', 
                height: 120, 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center' 
              }}>
                <LineChartOutlined style={{ fontSize: 48, color: '#fff' }} />
              </div>
            }
          >
            <Card.Meta 
              title="库存报表" 
              description="查看库存变动、周转率和预警信息" 
            />
            <div style={{ marginTop: 16, textAlign: 'right' }}>
              <Button type="primary" size="small" onClick={(e) => {
                e.stopPropagation();
                navigateToReport('/report/inventory');
              }}>
                查看报表
              </Button>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card 
            hoverable
            onClick={() => navigateToReport('/report/member')}
            cover={
              <div style={{ 
                background: '#fa8c16', 
                height: 120, 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center' 
              }}>
                <PieChartOutlined style={{ fontSize: 48, color: '#fff' }} />
              </div>
            }
          >
            <Card.Meta 
              title="会员报表" 
              description="查看会员消费、积分和等级分布" 
            />
            <div style={{ marginTop: 16, textAlign: 'right' }}>
              <Button type="primary" size="small" onClick={(e) => {
                e.stopPropagation();
                navigateToReport('/report/member');
              }}>
                查看报表
              </Button>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card 
            hoverable
            onClick={() => navigateToReport('/report/station-inventory')}
            cover={
              <div style={{ 
                background: '#13c2c2', 
                height: 120, 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center' 
              }}>
                <TableOutlined style={{ fontSize: 48, color: '#fff' }} />
              </div>
            }
          >
            <Card.Meta 
              title="9003油站进销存日报表" 
              description="查看油站进销存详细数据和汇总分析" 
            />
            <div style={{ marginTop: 16, textAlign: 'right' }}>
              <Button type="primary" size="small" onClick={(e) => {
                e.stopPropagation();
                navigateToReport('/report/station-inventory');
              }}>
                查看报表
              </Button>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card 
            hoverable
            onClick={() => navigateToReport('/report/station-sales-monthly')}
            cover={
              <div style={{ 
                background: '#52c41a', 
                height: 120, 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center' 
              }}>
                <BarChartOutlined style={{ fontSize: 48, color: '#fff' }} />
              </div>
            }
          >
            <Card.Meta 
              title="9020油站销售月报表" 
              description="查看油站销售数据和分公司汇总分析" 
            />
            <div style={{ marginTop: 16, textAlign: 'right' }}>
              <Button type="primary" size="small" onClick={(e) => {
                e.stopPropagation();
                navigateToReport('/report/station-sales-monthly');
              }}>
                查看报表
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 第二行报表入口 */}
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={6}>
          <Card 
            hoverable
            onClick={() => navigateToReport('/report/financial')}
            cover={
              <div style={{ 
                background: '#722ed1', 
                height: 120, 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center' 
              }}>
                <AreaChartOutlined style={{ fontSize: 48, color: '#fff' }} />
              </div>
            }
          >
            <Card.Meta 
              title="财务报表" 
              description="查看收支明细、利润和财务分析" 
            />
            <div style={{ marginTop: 16, textAlign: 'right' }}>
              <Button type="primary" size="small" onClick={(e) => {
                e.stopPropagation();
                navigateToReport('/report/financial');
              }}>
                查看报表
              </Button>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card 
            hoverable
            onClick={() => navigateToReport('/report/purchase')}
            cover={
              <div style={{ 
                background: '#eb2f96', 
                height: 120, 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center' 
              }}>
                <BarChartOutlined style={{ fontSize: 48, color: '#fff' }} />
              </div>
            }
          >
            <Card.Meta 
              title="采购报表" 
              description="查看采购数据、供应商分析" 
            />
            <div style={{ marginTop: 16, textAlign: 'right' }}>
              <Button type="primary" size="small" onClick={(e) => {
                e.stopPropagation();
                navigateToReport('/report/purchase');
              }}>
                查看报表
              </Button>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card 
            hoverable
            onClick={() => navigateToReport('/report/goods-sales')}
            cover={
              <div style={{ 
                background: '#f5222d', 
                height: 120, 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center' 
              }}>
                <PieChartOutlined style={{ fontSize: 48, color: '#fff' }} />
              </div>
            }
          >
            <Card.Meta 
              title="商品销售报表" 
              description="查看商品销售数据和排行" 
            />
            <div style={{ marginTop: 16, textAlign: 'right' }}>
              <Button type="primary" size="small" onClick={(e) => {
                e.stopPropagation();
                navigateToReport('/report/goods-sales');
              }}>
                查看报表
              </Button>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card 
            hoverable
            onClick={() => navigateToReport('/report/density')}
            cover={
              <div style={{ 
                background: '#faad14', 
                height: 120, 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center' 
              }}>
                <LineChartOutlined style={{ fontSize: 48, color: '#fff' }} />
              </div>
            }
          >
            <Card.Meta 
              title="密度报表" 
              description="查看油品密度数据和分析" 
            />
            <div style={{ marginTop: 16, textAlign: 'right' }}>
              <Button type="primary" size="small" onClick={(e) => {
                e.stopPropagation();
                navigateToReport('/report/density');
              }}>
                查看报表
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 报表操作 */}
      <Row style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="常用操作">
            <Button 
              type="primary" 
              icon={<DownloadOutlined />} 
              style={{ marginRight: 8 }}
            >
              导出报表
            </Button>
            <Button 
              icon={<PrinterOutlined />}
            >
              打印报表
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ReportManagement; 