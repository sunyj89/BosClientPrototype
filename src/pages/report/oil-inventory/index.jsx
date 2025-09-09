import React, { useState, useEffect } from 'react';
import { Card, Form, DatePicker, Button, Table, Spin, Space, Row, Col, TreeSelect, message, Pagination } from 'antd';
import { SearchOutlined, ReloadOutlined, DownloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import oilInventoryReportData from '../../../mock/report/oilInventoryReportData.json';
import './index.css';

const { RangePicker } = DatePicker;

const OilInventoryReport = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [selectedStations, setSelectedStations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [allStationsData, setAllStationsData] = useState([]);

  // 默认日期范围（2025-01-15 到 2025-01-27，共13天）
  const defaultDateRange = [
    dayjs('2025-01-15'),
    dayjs('2025-01-27')
  ];

  // 初始化数据
  useEffect(() => {
    // 设置默认日期范围
    form.setFieldsValue({
      dateRange: defaultDateRange
    });
    handleSearch();
  }, []);

  // 计算合计数据
  const calculateSummary = (stationData) => {
    const summary = {
      date: '合计',
      type: 'summary',
      purchase: {
        volume: { gasoline92: 0, gasoline95: 0, diesel0: 0, urea: 0 },
        tons: { gasoline92: 0, gasoline95: 0, diesel0: 0, urea: 0 }
      },
      sales: {
        volume: {
          gasoline92: { cash: 0, icCard: 0, mobile: 0, total: 0 },
          gasoline95: { cash: 0, icCard: 0, mobile: 0, total: 0 },
          diesel0: { cash: 0, icCard: 0, mobile: 0, total: 0 },
          urea: { cash: 0, icCard: 0, mobile: 0, total: 0 }
        },
        amount: {
          gasoline92: { cash: 0, icCard: 0, mobile: 0, total: 0 },
          gasoline95: { cash: 0, icCard: 0, mobile: 0, total: 0 },
          diesel0: { cash: 0, icCard: 0, mobile: 0, total: 0 },
          urea: { cash: 0, icCard: 0, mobile: 0, total: 0 }
        },
        tons: { gasoline92: 0, gasoline95: 0, diesel0: 0, urea: 0 }
      },
      inventory: {
        volume: { gasoline92: 0, gasoline95: 0, diesel0: 0, urea: 0 },
        tons: { gasoline92: 0, gasoline95: 0, diesel0: 0, urea: 0 }
      }
    };

    // 只计算日常数据，排除月初库存
    const dailyData = stationData.filter(item => item.type === 'daily');
    
    dailyData.forEach(item => {
      // 进货数据累加
      Object.keys(summary.purchase.volume).forEach(key => {
        summary.purchase.volume[key] += item.purchase.volume[key] || 0;
        summary.purchase.tons[key] += item.purchase.tons[key] || 0;
      });

      // 销售数据累加
      Object.keys(summary.sales.volume).forEach(oilType => {
        Object.keys(summary.sales.volume[oilType]).forEach(paymentType => {
          summary.sales.volume[oilType][paymentType] += item.sales.volume[oilType][paymentType] || 0;
          summary.sales.amount[oilType][paymentType] += item.sales.amount[oilType][paymentType] || 0;
        });
        summary.sales.tons[oilType] += item.sales.tons[oilType] || 0;
      });
    });

    // 库存数据取最后一天的数据
    if (dailyData.length > 0) {
      const lastDayData = dailyData[dailyData.length - 1];
      summary.inventory = { ...lastDayData.inventory };
    }

    return summary;
  };

  // 处理查询
  const handleSearch = () => {
    setLoading(true);
    
    setTimeout(() => {
      const formValues = form.getFieldsValue();
      let filteredData = oilInventoryReportData.inventoryData;

      // 根据油站筛选
      if (formValues.stationIds && formValues.stationIds.length > 0) {
        const stationIds = formValues.stationIds.filter(id => id.startsWith('ST'));
        filteredData = filteredData.filter(item => stationIds.includes(item.stationId));
      }

      // 根据日期范围筛选（这里简化处理，实际应该根据日期筛选data数组中的记录）
      if (formValues.dateRange && formValues.dateRange.length > 0) {
        // TODO: 实现日期范围筛选逻辑
      }

      // 为每个油站添加合计行
      const dataWithSummary = filteredData.map(station => ({
        ...station,
        data: [...station.data, calculateSummary(station.data)]
      }));

      setAllStationsData(dataWithSummary);
      
      // 设置当前页数据（每页显示一个油站）
      if (dataWithSummary.length > 0) {
        setReportData(dataWithSummary[currentPage - 1] ? [dataWithSummary[currentPage - 1]] : []);
      } else {
        setReportData([]);
      }
      
      setLoading(false);
    }, 1000);
  };

  // 处理分页变化
  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (allStationsData.length > 0) {
      setReportData(allStationsData[page - 1] ? [allStationsData[page - 1]] : []);
    }
  };

  // 重置表单
  const handleReset = () => {
    form.resetFields();
    form.setFieldsValue({
      dateRange: defaultDateRange
    });
    setSelectedStations([]);
    setCurrentPage(1);
    handleSearch();
  };

  // 导出当前数据
  const handleExport = () => {
    message.success('正在导出当前筛选结果的数据...');
  };

  // 导出汇总数据
  const handleSummaryExport = () => {
    message.success('正在导出所有查询结果的汇总数据...');
  };

  // 获取表格列定义
  const getColumns = () => {
    return [
      {
        title: '日期',
        dataIndex: 'date',
        key: 'date',
        width: 120,
        fixed: 'left',
                 render: (text, record) => {
           if (text === '月初库存') {
             return <strong style={{ color: '#1890ff' }}>{text}</strong>;
           } else if (text === '合计') {
             return <strong style={{ color: '#000' }}>{text}</strong>;
           }
           return text;
         },
      },
      {
        title: '进货升数（升）',
        children: [
          {
            title: '92号汽油(Ⅴ)',
            dataIndex: ['purchase', 'volume', 'gasoline92'],
            key: 'purchaseVolume92',
            width: 100,
            render: (text) => text ? text.toLocaleString() : '-',
          },
          {
            title: '95号清洁汽油(Ⅴ)',
            dataIndex: ['purchase', 'volume', 'gasoline95'],
            key: 'purchaseVolume95',
            width: 120,
            render: (text) => text ? text.toLocaleString() : '-',
          },
          {
            title: '0号车用柴油(Ⅴ)',
            dataIndex: ['purchase', 'volume', 'diesel0'],
            key: 'purchaseVolumeDiesel',
            width: 120,
            render: (text) => text ? text.toLocaleString() : '-',
          },
          {
            title: '车用尾气处理液',
            dataIndex: ['purchase', 'volume', 'urea'],
            key: 'purchaseVolumeUrea',
            width: 100,
            render: (text) => text ? text.toLocaleString() : '-',
          },
        ],
      },
      {
        title: '进货吨数（吨）',
        children: [
          {
            title: '92号汽油(Ⅴ)',
            dataIndex: ['purchase', 'tons', 'gasoline92'],
            key: 'purchaseTons92',
            width: 100,
            render: (text) => text ? text.toFixed(2) : '-',
          },
          {
            title: '95号清洁汽油(Ⅴ)',
            dataIndex: ['purchase', 'tons', 'gasoline95'],
            key: 'purchaseTons95',
            width: 120,
            render: (text) => text ? text.toFixed(2) : '-',
          },
          {
            title: '0号车用柴油(Ⅴ)',
            dataIndex: ['purchase', 'tons', 'diesel0'],
            key: 'purchaseTonsDiesel',
            width: 120,
            render: (text) => text ? text.toFixed(2) : '-',
          },
          {
            title: '车用尾气处理液',
            dataIndex: ['purchase', 'tons', 'urea'],
            key: 'purchaseTonesUrea',
            width: 100,
            render: (text) => text ? text.toFixed(2) : '-',
          },
        ],
      },
      {
        title: '销售升数（升）',
        children: [
          {
            title: '92号汽油(Ⅴ)',
            children: [
              {
                title: '现金',
                dataIndex: ['sales', 'volume', 'gasoline92', 'cash'],
                key: 'salesVolume92Cash',
                width: 80,
                render: (text) => text ? text.toLocaleString() : '-',
              },
              {
                title: '中石化IC卡',
                dataIndex: ['sales', 'volume', 'gasoline92', 'icCard'],
                key: 'salesVolume92IC',
                width: 100,
                render: (text) => text ? text.toLocaleString() : '-',
              },
              {
                title: '移动支付',
                dataIndex: ['sales', 'volume', 'gasoline92', 'mobile'],
                key: 'salesVolume92Mobile',
                width: 80,
                render: (text) => text ? text.toLocaleString() : '-',
              },
              {
                title: '合计',
                dataIndex: ['sales', 'volume', 'gasoline92', 'total'],
                key: 'salesVolume92Total',
                width: 80,
                render: (text) => text ? text.toLocaleString() : '-',
              },
            ],
          },
          {
            title: '95号清洁汽油(Ⅴ)',
            children: [
              {
                title: '现金',
                dataIndex: ['sales', 'volume', 'gasoline95', 'cash'],
                key: 'salesVolume95Cash',
                width: 80,
                render: (text) => text ? text.toLocaleString() : '-',
              },
              {
                title: '中石化IC卡',
                dataIndex: ['sales', 'volume', 'gasoline95', 'icCard'],
                key: 'salesVolume95IC',
                width: 100,
                render: (text) => text ? text.toLocaleString() : '-',
              },
              {
                title: '移动支付',
                dataIndex: ['sales', 'volume', 'gasoline95', 'mobile'],
                key: 'salesVolume95Mobile',
                width: 80,
                render: (text) => text ? text.toLocaleString() : '-',
              },
              {
                title: '合计',
                dataIndex: ['sales', 'volume', 'gasoline95', 'total'],
                key: 'salesVolume95Total',
                width: 80,
                render: (text) => text ? text.toLocaleString() : '-',
              },
            ],
          },
          {
            title: '0号车用柴油(Ⅴ)',
            children: [
              {
                title: '现金',
                dataIndex: ['sales', 'volume', 'diesel0', 'cash'],
                key: 'salesVolumeDieselCash',
                width: 80,
                render: (text) => text ? text.toLocaleString() : '-',
              },
              {
                title: '中石化IC卡',
                dataIndex: ['sales', 'volume', 'diesel0', 'icCard'],
                key: 'salesVolumeDieselIC',
                width: 100,
                render: (text) => text ? text.toLocaleString() : '-',
              },
              {
                title: '移动支付',
                dataIndex: ['sales', 'volume', 'diesel0', 'mobile'],
                key: 'salesVolumeDieselMobile',
                width: 80,
                render: (text) => text ? text.toLocaleString() : '-',
              },
              {
                title: '合计',
                dataIndex: ['sales', 'volume', 'diesel0', 'total'],
                key: 'salesVolumeDieselTotal',
                width: 80,
                render: (text) => text ? text.toLocaleString() : '-',
              },
            ],
          },
          {
            title: '车用尾气处理液',
            children: [
              {
                title: '现金',
                dataIndex: ['sales', 'volume', 'urea', 'cash'],
                key: 'salesVolumeUreaCash',
                width: 80,
                render: (text) => text ? text.toLocaleString() : '-',
              },
              {
                title: '中石化IC卡',
                dataIndex: ['sales', 'volume', 'urea', 'icCard'],
                key: 'salesVolumeUreaIC',
                width: 100,
                render: (text) => text ? text.toLocaleString() : '-',
              },
              {
                title: '移动支付',
                dataIndex: ['sales', 'volume', 'urea', 'mobile'],
                key: 'salesVolumeUreaMobile',
                width: 80,
                render: (text) => text ? text.toLocaleString() : '-',
              },
              {
                title: '合计',
                dataIndex: ['sales', 'volume', 'urea', 'total'],
                key: 'salesVolumeUreaTotal',
                width: 80,
                render: (text) => text ? text.toLocaleString() : '-',
              },
            ],
          },
        ],
      },
      {
        title: '销售金额（元）',
        children: [
          {
            title: '92号汽油(Ⅴ)',
            children: [
              {
                title: '现金',
                dataIndex: ['sales', 'amount', 'gasoline92', 'cash'],
                key: 'salesAmount92Cash',
                width: 80,
                render: (text) => text ? `¥${text.toLocaleString()}` : '-',
              },
              {
                title: '中石化IC卡',
                dataIndex: ['sales', 'amount', 'gasoline92', 'icCard'],
                key: 'salesAmount92IC',
                width: 100,
                render: (text) => text ? `¥${text.toLocaleString()}` : '-',
              },
              {
                title: '移动支付',
                dataIndex: ['sales', 'amount', 'gasoline92', 'mobile'],
                key: 'salesAmount92Mobile',
                width: 80,
                render: (text) => text ? `¥${text.toLocaleString()}` : '-',
              },
              {
                title: '合计',
                dataIndex: ['sales', 'amount', 'gasoline92', 'total'],
                key: 'salesAmount92Total',
                width: 80,
                render: (text) => text ? `¥${text.toLocaleString()}` : '-',
              },
            ],
          },
          {
            title: '95号清洁汽油(Ⅴ)',
            children: [
              {
                title: '现金',
                dataIndex: ['sales', 'amount', 'gasoline95', 'cash'],
                key: 'salesAmount95Cash',
                width: 80,
                render: (text) => text ? `¥${text.toLocaleString()}` : '-',
              },
              {
                title: '中石化IC卡',
                dataIndex: ['sales', 'amount', 'gasoline95', 'icCard'],
                key: 'salesAmount95IC',
                width: 100,
                render: (text) => text ? `¥${text.toLocaleString()}` : '-',
              },
              {
                title: '移动支付',
                dataIndex: ['sales', 'amount', 'gasoline95', 'mobile'],
                key: 'salesAmount95Mobile',
                width: 80,
                render: (text) => text ? `¥${text.toLocaleString()}` : '-',
              },
              {
                title: '合计',
                dataIndex: ['sales', 'amount', 'gasoline95', 'total'],
                key: 'salesAmount95Total',
                width: 80,
                render: (text) => text ? `¥${text.toLocaleString()}` : '-',
              },
            ],
          },
          {
            title: '0号车用柴油(Ⅴ)',
            children: [
              {
                title: '现金',
                dataIndex: ['sales', 'amount', 'diesel0', 'cash'],
                key: 'salesAmountDieselCash',
                width: 80,
                render: (text) => text ? `¥${text.toLocaleString()}` : '-',
              },
              {
                title: '中石化IC卡',
                dataIndex: ['sales', 'amount', 'diesel0', 'icCard'],
                key: 'salesAmountDieselIC',
                width: 100,
                render: (text) => text ? `¥${text.toLocaleString()}` : '-',
              },
              {
                title: '移动支付',
                dataIndex: ['sales', 'amount', 'diesel0', 'mobile'],
                key: 'salesAmountDieselMobile',
                width: 80,
                render: (text) => text ? `¥${text.toLocaleString()}` : '-',
              },
              {
                title: '合计',
                dataIndex: ['sales', 'amount', 'diesel0', 'total'],
                key: 'salesAmountDieselTotal',
                width: 80,
                render: (text) => text ? `¥${text.toLocaleString()}` : '-',
              },
            ],
          },
          {
            title: '车用尾气处理液',
            children: [
              {
                title: '现金',
                dataIndex: ['sales', 'amount', 'urea', 'cash'],
                key: 'salesAmountUreaCash',
                width: 80,
                render: (text) => text ? `¥${text.toLocaleString()}` : '-',
              },
              {
                title: '中石化IC卡',
                dataIndex: ['sales', 'amount', 'urea', 'icCard'],
                key: 'salesAmountUreaIC',
                width: 100,
                render: (text) => text ? `¥${text.toLocaleString()}` : '-',
              },
              {
                title: '移动支付',
                dataIndex: ['sales', 'amount', 'urea', 'mobile'],
                key: 'salesAmountUreaMobile',
                width: 80,
                render: (text) => text ? `¥${text.toLocaleString()}` : '-',
              },
              {
                title: '合计',
                dataIndex: ['sales', 'amount', 'urea', 'total'],
                key: 'salesAmountUreaTotal',
                width: 80,
                render: (text) => text ? `¥${text.toLocaleString()}` : '-',
              },
            ],
          },
        ],
      },
      {
        title: '销售吨数（吨）',
        children: [
          {
            title: '92号汽油(Ⅴ)',
            dataIndex: ['sales', 'tons', 'gasoline92'],
            key: 'salesTons92',
            width: 100,
            render: (text) => text ? text.toFixed(2) : '-',
          },
          {
            title: '95号清洁汽油(Ⅴ)',
            dataIndex: ['sales', 'tons', 'gasoline95'],
            key: 'salesTons95',
            width: 120,
            render: (text) => text ? text.toFixed(2) : '-',
          },
          {
            title: '0号车用柴油(Ⅴ)',
            dataIndex: ['sales', 'tons', 'diesel0'],
            key: 'salesTonsDiesel',
            width: 120,
            render: (text) => text ? text.toFixed(2) : '-',
          },
          {
            title: '车用尾气处理液',
            dataIndex: ['sales', 'tons', 'urea'],
            key: 'salesTonsUrea',
            width: 100,
            render: (text) => text ? text.toFixed(2) : '-',
          },
        ],
      },
      {
        title: '库存升数（升）',
        children: [
          {
            title: '92号汽油(Ⅴ)',
            dataIndex: ['inventory', 'volume', 'gasoline92'],
            key: 'inventoryVolume92',
            width: 100,
            render: (text) => text ? text.toLocaleString() : '-',
          },
          {
            title: '95号清洁汽油(Ⅴ)',
            dataIndex: ['inventory', 'volume', 'gasoline95'],
            key: 'inventoryVolume95',
            width: 120,
            render: (text) => text ? text.toLocaleString() : '-',
          },
          {
            title: '0号车用柴油(Ⅴ)',
            dataIndex: ['inventory', 'volume', 'diesel0'],
            key: 'inventoryVolumeDiesel',
            width: 120,
            render: (text) => text ? text.toLocaleString() : '-',
          },
          {
            title: '车用尾气处理液',
            dataIndex: ['inventory', 'volume', 'urea'],
            key: 'inventoryVolumeUrea',
            width: 100,
            render: (text) => text ? text.toLocaleString() : '-',
          },
        ],
      },
      {
        title: '库存吨数（吨）',
        children: [
          {
            title: '92号汽油(Ⅴ)',
            dataIndex: ['inventory', 'tons', 'gasoline92'],
            key: 'inventoryTons92',
            width: 100,
            render: (text) => text ? text.toFixed(2) : '-',
          },
          {
            title: '95号清洁汽油(Ⅴ)',
            dataIndex: ['inventory', 'tons', 'gasoline95'],
            key: 'inventoryTons95',
            width: 120,
            render: (text) => text ? text.toFixed(2) : '-',
          },
          {
            title: '0号车用柴油(Ⅴ)',
            dataIndex: ['inventory', 'tons', 'diesel0'],
            key: 'inventoryTonsDiesel',
            width: 120,
            render: (text) => text ? text.toFixed(2) : '-',
          },
          {
            title: '车用尾气处理液',
            dataIndex: ['inventory', 'tons', 'urea'],
            key: 'inventoryTonesUrea',
            width: 100,
            render: (text) => text ? text.toFixed(2) : '-',
          },
        ],
      },
    ];
  };

  // 获取当前油站的数据
  const getCurrentStationData = () => {
    if (reportData.length === 0) return [];
    return reportData[0].data;
  };

  return (
    <div className="oil-inventory-report-container">
      <Card>
        <Spin spinning={loading}>
          {/* 筛选区域 */}
          <Form
            form={form}
            layout="inline"
            onFinish={handleSearch}
            className="search-form"
          >
            <Row gutter={[16, 16]} style={{ width: '100%' }}>
              <Col xs={24} sm={12} md={7}>
                <Form.Item name="stationIds" label="选择油站">
                  <TreeSelect
                    style={{ width: '100%' }}
                    treeData={oilInventoryReportData.organizationTree}
                    placeholder="请选择油站"
                    treeCheckable
                    showCheckedStrategy={TreeSelect.SHOW_PARENT}
                    onChange={setSelectedStations}
                    value={selectedStations}
                    allowClear
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={7}>
                <Form.Item name="dateRange" label="查询日期">
                  <RangePicker
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={10}>
                <Form.Item>
                  <Space>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<SearchOutlined />}
                    >
                      查询
                    </Button>
                    <Button
                      icon={<ReloadOutlined />}
                      onClick={handleReset}
                    >
                      重置
                    </Button>
                    <Button
                      type="primary"
                      icon={<DownloadOutlined />}
                      onClick={handleExport}
                    >
                      导出当前
                    </Button>
                    <Button
                      type="primary"
                      icon={<DownloadOutlined />}
                      onClick={handleSummaryExport}
                    >
                      导出汇总数据
                    </Button>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>

          {/* 当前油站信息 */}
          {reportData.length > 0 && (
            <div className="station-info">
              <h3>
                {reportData[0].stationName} ({reportData[0].branchName})
              </h3>
            </div>
          )}

          {/* 数据表格 */}
          <Table
            columns={getColumns()}
            dataSource={getCurrentStationData()}
            scroll={{ x: 'max-content' }}
            pagination={false}
            bordered
            size="small"
            rowKey="date"
            rowClassName={(record) => {
              if (record.type === 'monthStart') {
                return 'month-start-row';
              } else if (record.type === 'summary') {
                return 'summary-row';
              }
              return '';
            }}
          />

          {/* 分页器 */}
          {allStationsData.length > 1 && (
            <div className="pagination-container">
              <Pagination
                current={currentPage}
                total={allStationsData.length}
                pageSize={1}
                onChange={handlePageChange}
                showSizeChanger={false}
                showQuickJumper
                showTotal={(total) => `共 ${total} 个油站`}
              />
            </div>
          )}
        </Spin>
      </Card>

      {/* 演示备注信息 */}
      <Card title="演示数据说明" style={{ marginTop: '24px' }}>
        <p>为方便演示，当前报表使用的是模拟数据，具体说明如下：</p>
        <ul>
          <li>
            <strong>数据覆盖油站：</strong>
            <ul>
              <li>南昌高速服务区加油站 (ST001) - 赣中分公司</li>
              <li>上饶高速服务区加油站 (ST002) - 赣东北分公司</li>
            </ul>
          </li>
          <li>
            <strong>默认查询时间：</strong>
            <ul>
              <li><strong>日期范围：</strong> 2025-01-15 至 2025-01-27（13天数据）</li>
              <li><strong>特殊数据：</strong> 每个油站都包含"月初库存"数据行</li>
              <li><strong>合计数据：</strong> 表格最后一行显示查询期间的合计数据</li>
            </ul>
          </li>
          <li>
            <strong>油品类型：</strong>
            <ul>
              <li>92号汽油(Ⅴ)</li>
              <li>95号清洁汽油(Ⅴ)</li>
              <li>0号车用柴油(Ⅴ)</li>
              <li>车用尾气处理液</li>
            </ul>
          </li>
          <li>
            <strong>功能提示：</strong>
            <ul>
              <li>支持多选油站，每页显示一个油站的详细数据</li>
              <li>使用分页器可以切换查看不同油站的数据</li>
              <li>表格第一行为"月初库存"（蓝色），最后一行为"合计"（红色）</li>
              <li>"导出当前"导出当前页油站数据，"导出汇总数据"导出所有筛选油站的汇总</li>
            </ul>
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default OilInventoryReport; 