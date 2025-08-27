import React, { useState, useEffect } from 'react';
import { Card, Form, Select, DatePicker, Button, Table, Spin, Space, Row, Col, TreeSelect, message } from 'antd';
import { SearchOutlined, ReloadOutlined, DownloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import oilSalesReportData from '../../../mock/report/oilSalesReportData.json';
import './index.css';

const { Option } = Select;
const { RangePicker } = DatePicker;

const OilSalesReport = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [timeDimension, setTimeDimension] = useState('daily');
  const [selectedStations, setSelectedStations] = useState([]);

  // 初始化数据
  useEffect(() => {
    handleSearch();
  }, []);

  // 处理查询
  const handleSearch = () => {
    setLoading(true);
    
    // 模拟API调用延迟
    setTimeout(() => {
      const formValues = form.getFieldsValue();
      let data = [];
      
      switch (timeDimension) {
        case 'daily':
          data = oilSalesReportData.dailyData;
          break;
        case 'monthly':
          data = oilSalesReportData.monthlyData;
          break;
        case 'quarterly':
          data = oilSalesReportData.quarterlyData;
          break;
        case 'yearly':
          data = oilSalesReportData.yearlyData;
          break;
        default:
          data = oilSalesReportData.dailyData;
      }

      // 根据油站筛选
      if (formValues.stationIds && formValues.stationIds.length > 0) {
        const stationIds = formValues.stationIds.filter(id => id.startsWith('ST'));
        data = data.filter(item => stationIds.includes(item.stationId));
      }

      // 处理数据，展开油品类型
      const processedData = [];
      data.forEach(record => {
        record.oilSales.forEach((oilSale, index) => {
          processedData.push({
            key: `${record.id}_${index}`,
            ...record,
            ...oilSale,
            rowSpan: index === 0 ? record.oilSales.length : 0,
          });
        });
      });

      setReportData(processedData);
      setLoading(false);
    }, 1000);
  };

  // 重置表单
  const handleReset = () => {
    form.resetFields();
    setTimeDimension('daily');
    setSelectedStations([]);
    handleSearch();
  };

  // 导出数据
  const handleExport = () => {
    // TODO: 实现导出功能
    message.success('正在导出当前页面数据...');
  };
  
  // 汇总数据导出
  const handleSummaryExport = () => {
    // TODO: 实现汇总导出功能
    message.success('正在导出所有查询结果的汇总数据...');
  };

  // 表格总计行
  const renderFooter = (currentPageData) => {
    if (currentPageData.length === 0) return null;

    const total = {
      totalVolume: 0,
      totalAmount: 0,
      paymentMethods: {
        cash: { volume: 0, amount: 0 },
        mobilePayment: { volume: 0, amount: 0 },
        icCard: { volume: 0, amount: 0 },
        electronicCard: { volume: 0, amount: 0 },
        selfUse: { volume: 0, amount: 0 },
        generator: { volume: 0, amount: 0 },
      },
    };

    currentPageData.forEach(item => {
      total.totalVolume += item.totalVolume || 0;
      total.totalAmount += item.totalAmount || 0;
      for (const key in total.paymentMethods) {
        total.paymentMethods[key].volume += item.paymentMethods[key]?.volume || 0;
        total.paymentMethods[key].amount += item.paymentMethods[key]?.amount || 0;
      }
    });

    return (
      <Table.Summary.Row style={{ fontWeight: 'bold', background: '#fafafa' }}>
        <Table.Summary.Cell index={0} colSpan={4}>总计</Table.Summary.Cell>
        <Table.Summary.Cell index={4} />
        <Table.Summary.Cell index={5}>{total.totalVolume.toLocaleString()}</Table.Summary.Cell>
        <Table.Summary.Cell index={6}>{total.paymentMethods.cash.volume.toLocaleString()}</Table.Summary.Cell>
        <Table.Summary.Cell index={7}>{`¥${total.paymentMethods.cash.amount.toLocaleString()}`}</Table.Summary.Cell>
        <Table.Summary.Cell index={8}>{total.paymentMethods.mobilePayment.volume.toLocaleString()}</Table.Summary.Cell>
        <Table.Summary.Cell index={9}>{`¥${total.paymentMethods.mobilePayment.amount.toLocaleString()}`}</Table.Summary.Cell>
        <Table.Summary.Cell index={10}>{total.paymentMethods.icCard.volume.toLocaleString()}</Table.Summary.Cell>
        <Table.Summary.Cell index={11}>{`¥${total.paymentMethods.icCard.amount.toLocaleString()}`}</Table.Summary.Cell>
        <Table.Summary.Cell index={12}>{total.paymentMethods.electronicCard.volume.toLocaleString()}</Table.Summary.Cell>
        <Table.Summary.Cell index={13}>{`¥${total.paymentMethods.electronicCard.amount.toLocaleString()}`}</Table.Summary.Cell>
        <Table.Summary.Cell index={14}>{total.paymentMethods.selfUse.volume.toLocaleString()}</Table.Summary.Cell>
        <Table.Summary.Cell index={15}>{`¥${total.paymentMethods.selfUse.amount.toLocaleString()}`}</Table.Summary.Cell>
        <Table.Summary.Cell index={16}>{total.paymentMethods.generator.volume.toLocaleString()}</Table.Summary.Cell>
        <Table.Summary.Cell index={17}>{`¥${total.paymentMethods.generator.amount.toLocaleString()}`}</Table.Summary.Cell>
        <Table.Summary.Cell index={18}>{`¥${total.totalAmount.toLocaleString()}`}</Table.Summary.Cell>
      </Table.Summary.Row>
    );
  };
  
  // 时间范围校验
  const handleDateChange = (dates) => {
    if (!dates || dates.length === 0) return;
    
    const [start, end] = dates;
    let maxRange;
    let messageText = '';

    switch (timeDimension) {
      case 'daily':
        maxRange = 90;
        if (end.diff(start, 'days') > maxRange) {
          messageText = `日报表查询范围不能超过${maxRange}天`;
        }
        break;
      case 'monthly':
        maxRange = 4;
        if (end.diff(start, 'months') >= maxRange) {
          messageText = `月报表查询范围不能超过${maxRange}个月`;
        }
        break;
      case 'quarterly':
        maxRange = 3 * 4; // 3 years
        if (end.diff(start, 'quarter') >= maxRange) {
          messageText = `季度报表查询范围不能超过3年`;
        }
        break;
      default:
        break;
    }
    
    if (messageText) {
      message.warning(messageText);
      form.setFieldsValue({ dateRange: null });
    }
  };


  // 表格列定义
  const getColumns = () => {
    const baseColumns = [
      {
        title: '时间',
        dataIndex: timeDimension === 'daily' ? 'date' : 
                  timeDimension === 'monthly' ? 'month' :
                  timeDimension === 'quarterly' ? 'quarter' : 'year',
        key: 'time',
        width: 120,
        render: (text, record, index) => ({
          children: text,
          props: {
            rowSpan: record.rowSpan,
          },
        }),
      },
      {
        title: '油站名称',
        dataIndex: 'stationName',
        key: 'stationName',
        width: 180,
        render: (text, record) => ({
          children: text,
          props: {
            rowSpan: record.rowSpan,
          },
        }),
      },
      {
        title: '分公司',
        dataIndex: 'branchName',
        key: 'branchName',
        width: 150,
        render: (text, record) => ({
          children: text,
          props: {
            rowSpan: record.rowSpan,
          },
        }),
      },
      {
        title: '油品类型',
        dataIndex: 'oilType',
        key: 'oilType',
        width: 100,
      },
      {
        title: '销售单价(元/升)',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
        width: 120,
        render: (text) => `¥${text.toFixed(2)}`,
      },
      {
        title: '总销售量(升)',
        dataIndex: 'totalVolume',
        key: 'totalVolume',
        width: 120,
        render: (text) => text.toLocaleString(),
      },
    ];

    // 支付方式列
    const paymentColumns = [
      {
        title: '现金',
        children: [
          {
            title: '销量(升)',
            dataIndex: ['paymentMethods', 'cash', 'volume'],
            key: 'cashVolume',
            width: 100,
            render: (text) => text?.toLocaleString() || '0',
          },
          {
            title: '金额(元)',
            dataIndex: ['paymentMethods', 'cash', 'amount'],
            key: 'cashAmount',
            width: 100,
            render: (text) => `¥${text?.toLocaleString() || '0'}`,
          },
        ],
      },
      {
        title: '移动支付',
        children: [
          {
            title: '销量(升)',
            dataIndex: ['paymentMethods', 'mobilePayment', 'volume'],
            key: 'mobileVolume',
            width: 100,
            render: (text) => text?.toLocaleString() || '0',
          },
          {
            title: '金额(元)',
            dataIndex: ['paymentMethods', 'mobilePayment', 'amount'],
            key: 'mobileAmount',
            width: 100,
            render: (text) => `¥${text?.toLocaleString() || '0'}`,
          },
        ],
      },
      {
        title: '中石化IC卡',
        children: [
          {
            title: '销量(升)',
            dataIndex: ['paymentMethods', 'icCard', 'volume'],
            key: 'icCardVolume',
            width: 100,
            render: (text) => text?.toLocaleString() || '0',
          },
          {
            title: '金额(元)',
            dataIndex: ['paymentMethods', 'icCard', 'amount'],
            key: 'icCardAmount',
            width: 100,
            render: (text) => `¥${text?.toLocaleString() || '0'}`,
          },
        ],
      },
      {
        title: '电子储值卡',
        children: [
          {
            title: '销量(升)',
            dataIndex: ['paymentMethods', 'electronicCard', 'volume'],
            key: 'electronicVolume',
            width: 100,
            render: (text) => text?.toLocaleString() || '0',
          },
          {
            title: '金额(元)',
            dataIndex: ['paymentMethods', 'electronicCard', 'amount'],
            key: 'electronicAmount',
            width: 100,
            render: (text) => `¥${text?.toLocaleString() || '0'}`,
          },
        ],
      },
      {
        title: '自用油',
        children: [
          {
            title: '销量(升)',
            dataIndex: ['paymentMethods', 'selfUse', 'volume'],
            key: 'selfUseVolume',
            width: 100,
            render: (text) => text?.toLocaleString() || '0',
          },
          {
            title: '金额(元)',
            dataIndex: ['paymentMethods', 'selfUse', 'amount'],
            key: 'selfUseAmount',
            width: 100,
            render: (text) => `¥${text?.toLocaleString() || '0'}`,
          },
        ],
      },
      {
        title: '发电用油',
        children: [
          {
            title: '销量(升)',
            dataIndex: ['paymentMethods', 'generator', 'volume'],
            key: 'generatorVolume',
            width: 100,
            render: (text) => text?.toLocaleString() || '0',
          },
          {
            title: '金额(元)',
            dataIndex: ['paymentMethods', 'generator', 'amount'],
            key: 'generatorAmount',
            width: 100,
            render: (text) => `¥${text?.toLocaleString() || '0'}`,
          },
        ],
      },
    ];

    const totalColumn = {
      title: '合计金额(元)',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      fixed: 'right',
      render: (text) => `¥${text?.toLocaleString() || '0'}`,
    };

    return [...baseColumns, ...paymentColumns, totalColumn];
  };

  return (
    <div className="oil-sales-report-container">
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
              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  name="timeDimension"
                  label="时间维度"
                  initialValue="daily"
                >
                  <Select
                    style={{ width: '100%' }}
                    onChange={setTimeDimension}
                  >
                    <Option value="daily">日报表</Option>
                    <Option value="monthly">月报表</Option>
                    <Option value="quarterly">季度报表</Option>
                    <Option value="yearly">年报表</Option>
                  </Select>
                </Form.Item>
              </Col>
              
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="stationIds" label="选择油站">
                  <TreeSelect
                    style={{ width: '100%' }}
                    treeData={oilSalesReportData.organizationTree}
                    placeholder="请选择油站"
                    treeCheckable
                    showCheckedStrategy={TreeSelect.SHOW_PARENT}
                    onChange={setSelectedStations}
                    value={selectedStations}
                    allowClear
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Form.Item name="dateRange" label="时间范围">
                  <RangePicker
                    style={{ width: '100%' }}
                    format={
                      timeDimension === 'daily' ? 'YYYY-MM-DD' :
                      timeDimension === 'monthly' ? 'YYYY-MM' :
                      timeDimension === 'quarterly' ? 'YYYY-[Q]Q' : 'YYYY'
                    }
                    picker={
                      timeDimension === 'daily' ? 'date' :
                      timeDimension === 'monthly' ? 'month' :
                      timeDimension === 'quarterly' ? 'quarter' : 'year'
                    }
                    onChange={handleDateChange}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={4}>
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
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>

          {/* 操作按钮区 */}
          <div className="action-buttons">
            <Space>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleExport}
              >
                导出报表
              </Button>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleSummaryExport}
              >
                汇总数据导出
              </Button>
            </Space>
          </div>

          {/* 数据表格 */}
          <Table
            columns={getColumns()}
            dataSource={reportData}
            scroll={{ x: 'max-content' }}
            pagination={{
              total: reportData.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`,
            }}
            summary={renderFooter}
            bordered
            size="small"
          />
        </Spin>
      </Card>
      
      {/* 演示备注信息 */}
      <Card title="演示数据说明" style={{ marginTop: '24px' }}>
        <p>为方便演示，当前报表使用的是模拟数据，具体说明如下：</p>
        <ul>
          <li>
            <strong>数据覆盖油站：</strong>
            <ul>
              <li>南昌高速服务区加油站 (ST001)</li>
              <li>上饶高速服务区加油站 (ST002)</li>
              <li>赣州高速服务区加油站 (ST003)</li>
              <li>九江高速服务区加油站 (ST004)</li>
            </ul>
          </li>
          <li>
            <strong>时间维度说明：</strong>
            <ul>
              <li><strong>日报表：</strong> 包含 <strong>2025-01-15</strong> 的数据。</li>
              <li><strong>月报表：</strong> 包含 <strong>2025-01</strong> 的数据。</li>
              <li><strong>季度报表：</strong> 包含 <strong>2025-Q1</strong> 的数据。</li>
              <li><strong>年报表：</strong> 包含 <strong>2024</strong> 年的数据。</li>
            </ul>
          </li>
           <li>
            <strong>功能提示：</strong>
            <ul>
              <li>选择日期时，请参考上述数据覆盖范围以确保能查询到数据。</li>
              <li>“汇总数据导出”功能目前仅为前端按钮，未实现完整导出逻辑。</li>
            </ul>
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default OilSalesReport; 