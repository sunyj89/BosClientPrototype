import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { Link } from 'react-router-dom';
import { 
  ShoppingOutlined, 
  AppstoreOutlined, 
  DatabaseOutlined, 
  DollarOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';

const GoodsManagement = () => {
  // 商品类别分布图表配置
  const goodsCategoryChartOption = {
    title: {
      text: '商品类别分布',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 10,
      data: ['饮料', '食品', '日用品', '汽车用品', '其他']
    },
    series: [
      {
        name: '商品数量',
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
          { value: 120, name: '饮料' },
          { value: 80, name: '食品' },
          { value: 60, name: '日用品' },
          { value: 40, name: '汽车用品' },
          { value: 20, name: '其他' }
        ]
      }
    ]
  };

  // 商品销售统计图表配置
  const goodsSalesChartOption = {
    title: {
      text: '近6个月商品销售统计',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['销售金额', '销售数量']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: ['10月', '11月', '12月', '1月', '2月', '3月']
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '金额(元)',
        min: 0,
        position: 'left',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#5470C6'
          }
        },
        axisLabel: {
          formatter: '{value} 元'
        }
      },
      {
        type: 'value',
        name: '数量',
        min: 0,
        position: 'right',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#91CC75'
          }
        },
        axisLabel: {
          formatter: '{value} 件'
        }
      }
    ],
    series: [
      {
        name: '销售金额',
        type: 'bar',
        data: [35000, 38000, 42000, 28000, 32000, 40000],
        yAxisIndex: 0,
      },
      {
        name: '销售数量',
        type: 'line',
        yAxisIndex: 1,
        data: [3500, 3800, 4200, 2800, 3200, 4000]
      }
    ]
  };

  return (
    <div>
      <div className="page-header">
        <h2>商品管理</h2>
      </div>

      {/* 功能卡片区域 */}
      <Row gutter={16}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Link to="/goods/category">
            <Card hoverable className="function-card">
              <div className="card-icon" style={{ backgroundColor: '#1890ff' }}>
                <AppstoreOutlined />
              </div>
              <div className="card-content">
                <h3>商品类别</h3>
                <p>管理商品类别信息</p>
              </div>
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Link to="/goods/inventory">
            <Card hoverable className="function-card">
              <div className="card-icon" style={{ backgroundColor: '#52c41a' }}>
                <DatabaseOutlined />
              </div>
              <div className="card-content">
                <h3>库存管理</h3>
                <p>管理商品库存信息</p>
              </div>
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Link to="/goods/price">
            <Card hoverable className="function-card">
              <div className="card-icon" style={{ backgroundColor: '#faad14' }}>
                <DollarOutlined />
              </div>
              <div className="card-content">
                <h3>价格管理</h3>
                <p>管理商品价格信息</p>
              </div>
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Link to="/goods/purchase">
            <Card hoverable className="function-card">
              <div className="card-icon" style={{ backgroundColor: '#eb2f96' }}>
                <ShoppingCartOutlined />
              </div>
              <div className="card-content">
                <h3>采购管理</h3>
                <p>管理商品采购信息</p>
              </div>
            </Card>
          </Link>
        </Col>
      </Row>

      {/* 统计信息区域 */}
      <Row gutter={16} style={{ marginTop: '20px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="商品总数"
              value={320}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="商品类别数"
              value={15}
              prefix={<AppstoreOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="库存预警商品"
              value={8}
              valueStyle={{ color: '#cf1322' }}
              prefix={<DatabaseOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="本月销售额"
              value={40000}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="元"
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={16} style={{ marginTop: '20px' }}>
        <Col xs={24} md={12}>
          <Card title="商品类别分布">
            <ReactECharts option={goodsCategoryChartOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="商品销售统计">
            <ReactECharts option={goodsSalesChartOption} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default GoodsManagement; 