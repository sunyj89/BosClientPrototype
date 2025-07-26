import React, { useState, useEffect } from 'react';
import { Card, Tabs, Spin, Form, Row, Col, Input, Select, Button, Space, Table, Checkbox, Modal, Descriptions, Tag, message, Tooltip, DatePicker } from 'antd';
import { SearchOutlined, ReloadOutlined, ExportOutlined, EyeOutlined, SettingOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import moment from 'moment';
import './index.css';
import memberData from '../../mock/member/memberData.json';
import * as XLSX from 'xlsx';

const { Option } = Select;
const { RangePicker } = DatePicker;

const MemberCenter = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('memberData');
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [memberDetailVisible, setMemberDetailVisible] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [columnSettingVisible, setColumnSettingVisible] = useState(false);
  const [consumptionForm] = Form.useForm();
  const [couponForm] = Form.useForm();
  const [filteredConsumption, setFilteredConsumption] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [memberStatsData, setMemberStatsData] = useState([]);
  const [dailyRegistrationData, setDailyRegistrationData] = useState([]);
  const [statsForm] = Form.useForm();
  const [dateRange, setDateRange] = useState([]);
  const [selectedDailyRows, setSelectedDailyRows] = useState([]);
  const [selectedDailyRowKeys, setSelectedDailyRowKeys] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState({
    memberName: true,
    customerLevel: true,
    customerIdentity: true,
    pointsBalance: true,
    cardNumber: true,
    storedValueBalance: true,
    lastConsumptionTime: true
  });

  // 模拟数据加载
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setDataSource(memberData);
      setFilteredData(memberData);
      
      // 生成会员统计数据
      generateMemberStats();
      
      setLoading(false);
    }, 500);
  }, []);

  // 生成会员统计数据
  const generateMemberStats = (startDate = null, endDate = null) => {
    // 如果没有指定日期范围，默认使用近7天
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(end.getTime() - 6 * 24 * 60 * 60 * 1000);
    
    const dates = [];
    const dailyNewMembers = [];
    const cumulativeMembers = [];
    const dailyRegistrationDetails = [];
    
    // 计算日期范围内的天数
    const daysDiff = Math.ceil((end - start) / (24 * 60 * 60 * 1000)) + 1;
    
    for (let i = 0; i < daysDiff; i++) {
      const date = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()];
      
      dates.push(dateStr);
      
      // 模拟每日新增会员数
      const newMembersCount = Math.floor(Math.random() * 50) + 10;
      dailyNewMembers.push(newMembersCount);
      
      // 累计会员数
      const previousCumulative = i === 0 ? 1500 : cumulativeMembers[cumulativeMembers.length - 1] || 1500;
      cumulativeMembers.push(previousCumulative + newMembersCount);
      
      // 每日注册明细
      const dayDetails = memberData.filter((_, index) => index < Math.min(newMembersCount, 5)).map((member, index) => ({
        ...member,
        dailyRegistrationDate: dateStr,
        dailyIndex: index + 1
      }));
      
      dailyRegistrationDetails.push({
        date: dateStr,
        dayName,
        newMembersCount,
        cumulativeCount: previousCumulative + newMembersCount,
        details: dayDetails
      });
    }
    
    setMemberStatsData({
      dates,
      dailyNewMembers,
      cumulativeMembers
    });
    
    setDailyRegistrationData(dailyRegistrationDetails);
  };

  // 处理日期范围筛选
  const handleDateRangeFilter = (values) => {
    if (values.dateRange) {
      const [startDate, endDate] = values.dateRange;
      setDateRange([startDate, endDate]);
      generateMemberStats(startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
    }
  };

  // 重置日期筛选
  const handleDateRangeReset = () => {
    statsForm.resetFields();
    setDateRange([]);
    setSelectedDailyRows([]);
    setSelectedDailyRowKeys([]);
    generateMemberStats(); // 恢复默认7天数据
  };

  // 导出每日注册明细
  const handleExportDailyData = () => {
    if (selectedDailyRows.length === 0) {
      message.warning('请选择要导出的数据');
      return;
    }

    // 展开所有选中日期的会员明细
    const allMemberDetails = [];
    selectedDailyRows.forEach(dayRecord => {
      dayRecord.details.forEach(member => {
        allMemberDetails.push({
          '注册日期': dayRecord.date,
          '会员ID': member.memberId,
          '会员姓名': member.memberName,
          '手机号': member.phoneNumber,
          '注册渠道': member.registrationChannel || '未知',
          '顾客等级': member.customerLevel,
          '顾客身份': member.customerIdentity,
          '积分余额': member.pointsBalance,
          '电子储值卡余额': member.storedValueBalance,
          '中石化加油卡卡号': member.cardNumber || '',
          '车牌号': member.licensePlate || ''
        });
      });
    });

    if (allMemberDetails.length === 0) {
      message.warning('选中的日期没有会员明细数据');
      return;
    }

    const ws = XLSX.utils.json_to_sheet(allMemberDetails);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '会员注册明细');
    
    const dateRangeStr = selectedDailyRows.length === 1 
      ? selectedDailyRows[0].date 
      : `${selectedDailyRows[0].date}_至_${selectedDailyRows[selectedDailyRows.length - 1].date}`;
    
    XLSX.writeFile(wb, `会员注册明细_${dateRangeStr}.xlsx`);
    message.success(`导出成功，共导出 ${allMemberDetails.length} 条会员记录`);
  };

  // 搜索处理
  const handleSearch = (values) => {
    setLoading(true);
    setTimeout(() => {
      let filtered = memberData;
      
      if (values.phoneNumber) {
        filtered = filtered.filter(item => 
          item.phoneNumber.includes(values.phoneNumber)
        );
      }
      
      if (values.cardNumber) {
        filtered = filtered.filter(item => 
          item.cardNumber && item.cardNumber.includes(values.cardNumber)
        );
      }
      
      setFilteredData(filtered);
      setLoading(false);
    }, 300);
  };

  // 重置搜索
  const handleReset = () => {
    form.resetFields();
    setFilteredData(memberData);
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };

  // 查看会员详情
  const handleViewDetail = (record) => {
    setCurrentMember(record);
    setFilteredConsumption(record.consumptionHistory || []);
    setFilteredCoupons(record.coupons || []);
    consumptionForm.resetFields();
    couponForm.resetFields();
    setMemberDetailVisible(true);
  };

  // 筛选消费记录
  const handleConsumptionFilter = (values) => {
    if (!currentMember || !currentMember.consumptionHistory) return;
    
    let filtered = currentMember.consumptionHistory;
    
    if (values.dateRange) {
      const [startDate, endDate] = values.dateRange;
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate >= startDate.toDate() && recordDate <= endDate.toDate();
      });
    }
    
    setFilteredConsumption(filtered);
  };

  // 重置消费记录筛选
  const handleConsumptionReset = () => {
    consumptionForm.resetFields();
    setFilteredConsumption(currentMember?.consumptionHistory || []);
  };

  // 筛选优惠券
  const handleCouponFilter = (values) => {
    if (!currentMember || !currentMember.coupons) return;
    
    let filtered = currentMember.coupons;
    
    if (values.couponName) {
      filtered = filtered.filter(coupon => 
        coupon.name.includes(values.couponName)
      );
    }
    
    setFilteredCoupons(filtered);
  };

  // 重置优惠券筛选
  const handleCouponReset = () => {
    couponForm.resetFields();
    setFilteredCoupons(currentMember?.coupons || []);
  };

  // 导出Excel
  const handleExport = () => {
    if (selectedRows.length === 0) {
      message.warning('请选择要导出的数据');
      return;
    }

    const exportData = selectedRows.map(row => ({
      '会员ID': row.memberId,
      '手机号': row.phoneNumber,
      '会员姓名': row.memberName,
      '顾客等级': row.customerLevel,
      '顾客身份': row.customerIdentity,
      '积分余额': row.pointsBalance,
      '中石化加油卡卡号': row.cardNumber || '',
      '电子储值卡余额': row.storedValueBalance,
      '注册时间': row.registrationTime,
      '最近消费时间': row.lastConsumptionTime
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '会员数据');
    XLSX.writeFile(wb, `会员数据_${new Date().toISOString().split('T')[0]}.xlsx`);
    message.success('导出成功');
  };

  // 手机号脱敏处理
  const maskPhoneNumber = (phoneNumber) => {
    if (!phoneNumber || phoneNumber.length !== 11) return phoneNumber;
    return phoneNumber.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  };

  // 消费记录表格列配置
  const consumptionColumns = [
    {
      title: '消费站点',
      dataIndex: 'stationName',
      key: 'stationName',
      width: 180,
    },
    {
      title: '订单编号',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      width: 140,
    },
    {
      title: '油品应付',
      dataIndex: 'oilAmount',
      key: 'oilAmount',
      width: 100,
      render: (text) => text ? `¥${text.toFixed(2)}` : '-',
    },
    {
      title: '油品名称',
      dataIndex: 'oilProductName',
      key: 'oilProductName',
      width: 100,
    },
    {
      title: '非油品应付',
      dataIndex: 'nonOilAmount',
      key: 'nonOilAmount',
      width: 110,
      render: (text) => text ? `¥${text.toFixed(2)}` : '-',
    },
    {
      title: '实付金额',
      dataIndex: 'actualAmount',
      key: 'actualAmount',
      width: 100,
      render: (text) => `¥${text.toFixed(2)}`,
    },
    {
      title: '优惠金额',
      dataIndex: 'discountAmount',
      key: 'discountAmount',
      width: 100,
      render: (text) => text ? `¥${text.toFixed(2)}` : '-',
    },
    {
      title: '支付方式',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 120,
      render: (text) => {
        const colorMap = {
          '现金': 'green',
          '移动支付': 'blue',
          '电子储值卡': 'purple',
          '中石化IC卡': 'orange'
        };
        return <Tag color={colorMap[text] || 'default'}>{text}</Tag>;
      },
    },
    {
      title: '订单创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 140,
    },
    {
      title: '支付完成时间',
      dataIndex: 'paymentTime',
      key: 'paymentTime',
      width: 140,
      render: (text) => text || '-',
    },
    {
      title: '订单状态',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      width: 100,
      render: (text) => {
        const colorMap = {
          '订单取消': 'red',
          '待支付': 'orange',
          '已支付': 'green',
          '退款中': 'blue',
          '已退款': 'purple'
        };
        return <Tag color={colorMap[text] || 'default'}>{text}</Tag>;
      },
    },
  ];

  // 优惠券表格列配置
  const couponColumns = [
    {
      title: '优惠券名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
    },
    {
      title: '有效期',
      dataIndex: 'expireDate',
      key: 'expireDate',
      width: 120,
    },
    {
      title: '优惠券面值',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (text) => text > 0 ? `¥${text.toFixed(2)}` : '无面值',
    },
    {
      title: '优惠券状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (text) => {
        const colorMap = {
          '未使用': 'green',
          '已使用': 'default',
          '已过期': 'red'
        };
        return <Tag color={colorMap[text] || 'default'}>{text}</Tag>;
      },
    },
  ];

  // 会员统计图表配置
  const memberStatsOption = {
    title: {
      text: dateRange.length > 0 ? '会员注册趋势' : '近7天会员注册趋势',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['每日新增会员', '累计会员'],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: ['10%', '10%'],
      data: memberStatsData.dates || [],
      axisLabel: {
        rotate: memberStatsData.dates && memberStatsData.dates.length > 10 ? 45 : 0,
        fontSize: 10
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '每日新增',
        position: 'left',
        axisLine: {
          lineStyle: {
            color: '#32AF50'
          }
        },
        axisLabel: {
          formatter: '{value} 人'
        }
      },
      {
        type: 'value',
        name: '累计会员',
        position: 'right',
        axisLine: {
          lineStyle: {
            color: '#1890ff'
          }
        },
        axisLabel: {
          formatter: '{value} 人'
        }
      }
    ],
    series: [
      {
        name: '每日新增会员',
        type: 'line',
        yAxisIndex: 0,
        data: memberStatsData.dailyNewMembers || [],
        lineStyle: {
          color: '#32AF50',
          width: 3
        },
        itemStyle: {
          color: '#32AF50'
        },
        symbol: 'circle',
        symbolSize: 6,
        smooth: true,
        label: {
          show: memberStatsData.dates && memberStatsData.dates.length <= 15,
          position: 'top',
          fontSize: 10,
          color: '#32AF50'
        }
      },
      {
        name: '累计会员',
        type: 'bar',
        yAxisIndex: 1,
        data: memberStatsData.cumulativeMembers || [],
        itemStyle: {
          color: '#1890ff'
        },
        barWidth: '40%',
        label: {
          show: memberStatsData.dates && memberStatsData.dates.length <= 10,
          position: 'top',
          fontSize: 10,
          color: '#1890ff'
        }
      },
    ],
  };

  // 每日注册明细表格列配置
  const dailyRegistrationColumns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 120,
    },
    {
      title: '当日新增',
      dataIndex: 'newMembersCount',
      key: 'newMembersCount',
      width: 100,
      render: (text) => <Tag color="green">{text} 人</Tag>,
    },
    {
      title: '累计会员',
      dataIndex: 'cumulativeCount',
      key: 'cumulativeCount',
      width: 100,
      render: (text) => <Tag color="blue">{text} 人</Tag>,
    },
    {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => {
            Modal.info({
              title: `${record.date} 新增会员明细`,
              width: 800,
              content: (
                <Table
                  columns={[
                    { title: '会员ID', dataIndex: 'memberId', key: 'memberId' },
                    { title: '会员姓名', dataIndex: 'memberName', key: 'memberName' },
                    { title: '手机号', dataIndex: 'phoneNumber', key: 'phoneNumber', render: (text) => maskPhoneNumber(text) },
                    { title: '注册渠道', dataIndex: 'registrationChannel', key: 'registrationChannel' },
                  ]}
                  dataSource={record.details}
                  rowKey="memberId"
                  pagination={{ pageSize: 5 }}
                  size="small"
                />
              ),
            });
          }}
        >
          查看明细
        </Button>
      ),
    },
  ];

  // 表格列配置
  const getColumns = () => {
    const baseColumns = [
      {
        title: '手机号',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
        width: 120,
        render: (text) => maskPhoneNumber(text),
      },
      {
        title: '会员ID',
        dataIndex: 'memberId',
        key: 'memberId',
        width: 120,
      },
      {
        title: '注册时间',
        dataIndex: 'registrationTime',
        key: 'registrationTime',
        width: 120,
      }
    ];

    const conditionalColumns = [
      {
        title: '会员姓名',
        dataIndex: 'memberName',
        key: 'memberName',
        width: 100,
        visible: visibleColumns.memberName,
      },
      {
        title: '顾客等级',
        dataIndex: 'customerLevel',
        key: 'customerLevel',
        width: 100,
        visible: visibleColumns.customerLevel,
        render: (text) => {
          const colorMap = {
            '普通': 'default',
            '银卡': 'silver',
            '金卡': 'gold', 
            '铂金': 'purple',
            '钻石': 'blue'
          };
          return <Tag color={colorMap[text] || 'default'}>{text}</Tag>;
        },
      },
      {
        title: '顾客身份',
        dataIndex: 'customerIdentity',
        key: 'customerIdentity',
        width: 120,
        visible: visibleColumns.customerIdentity,
      },
      {
        title: '积分余额',
        dataIndex: 'pointsBalance',
        key: 'pointsBalance',
        width: 100,
        visible: visibleColumns.pointsBalance,
        render: (text) => text?.toLocaleString() || 0,
      },
      {
        title: '中石化加油卡卡号',
        dataIndex: 'cardNumber',
        key: 'cardNumber',
        width: 150,
        visible: visibleColumns.cardNumber,
        render: (text) => text || '-',
      },
      {
        title: '电子储值卡余额',
        dataIndex: 'storedValueBalance',
        key: 'storedValueBalance',
        width: 130,
        visible: visibleColumns.storedValueBalance,
        render: (text) => `¥${text?.toFixed(2) || '0.00'}`,
      },
      {
        title: '最近消费时间',
        dataIndex: 'lastConsumptionTime',
        key: 'lastConsumptionTime',
        width: 130,
        visible: visibleColumns.lastConsumptionTime,
      }
    ];

    const operationColumn = {
      title: '操作',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          查看
        </Button>
      ),
    };

    return [
      ...baseColumns,
      ...conditionalColumns.filter(col => col.visible),
      operationColumn
    ];
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      if (selected) {
        setSelectedRowKeys(filteredData.map(item => item.memberId));
        setSelectedRows(filteredData);
      } else {
        setSelectedRowKeys([]);
        setSelectedRows([]);
      }
    },
  };

  const tabItems = [
    {
      key: 'memberData',
      label: '会员数据',
      children: (
        <div>
          {/* 筛选区域 */}
          <Form
            form={form}
            layout="inline"
            onFinish={handleSearch}
            style={{ marginBottom: 16 }}
          >
            <Row gutter={16} style={{ width: '100%' }}>
              <Col span={24}>
                <Space wrap style={{ width: '100%' }}>
                  <Form.Item name="phoneNumber" label="手机号">
                    <Input placeholder="请输入手机号" style={{ width: 200 }} />
                  </Form.Item>
                  <Form.Item name="cardNumber" label="中石化IC卡号">
                    <Input placeholder="请输入卡号" style={{ width: 200 }} />
                  </Form.Item>
                </Space>
              </Col>
              <Col span={24}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                      查询
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={handleReset}>
                      重置
                    </Button>
                  </Space>
                  <Space>
                    <Button 
                      icon={<ExportOutlined />} 
                      onClick={handleExport}
                      disabled={selectedRowKeys.length === 0}
                    >
                      导出Excel ({selectedRowKeys.length})
                    </Button>
                    <Tooltip title="自定义列显示">
                      <Button 
                        icon={<SettingOutlined />} 
                        onClick={() => setColumnSettingVisible(true)}
                      />
                    </Tooltip>
                  </Space>
                </div>
              </Col>
            </Row>
          </Form>

          {/* 数据表格 */}
          <Table
            rowSelection={rowSelection}
            columns={getColumns()}
            dataSource={filteredData}
            rowKey="memberId"
            pagination={{
              total: filteredData.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
            }}
            scroll={{ x: 'max-content' }}
            size="middle"
          />
        </div>
      ),
    },
    {
      key: 'memberStats',
      label: '会员统计',
      children: (
        <div>
          {/* 日期筛选区域 */}
          <Card style={{ marginBottom: 16 }}>
            <Form
              form={statsForm}
              layout="inline"
              onFinish={handleDateRangeFilter}
              style={{ marginBottom: 0 }}
            >
              <Form.Item name="dateRange" label="日期范围">
                <RangePicker 
                  style={{ width: 250 }} 
                  placeholder={['开始日期', '结束日期']}
                  onCalendarChange={(dates) => {
                    if (dates && dates.length === 2 && dates[0] && dates[1]) {
                      const diffDays = Math.abs(dates[1].diff(dates[0], 'days'));
                      if (diffDays > 100) {
                        message.warning('查询范围不能超过100天');
                        return false;
                      }
                    }
                  }}
                />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                    查询
                  </Button>
                  <Button icon={<ReloadOutlined />} onClick={handleDateRangeReset}>
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Form>
            <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
              * 最大查询范围：100天，数据更新频率：每天1点更新前一天数据
            </div>
          </Card>

          {/* 会员注册趋势图 */}
          <Row gutter={16}>
            <Col span={16}>
              <Card title="会员注册趋势" className="dashboard-card">
                <ReactECharts 
                  option={memberStatsOption} 
                  style={{ height: 350 }} 
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card title="统计概览" className="dashboard-card">
                <div style={{ padding: '20px 0', textAlign: 'center' }}>
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 32, fontWeight: 'bold', color: '#32AF50' }}>
                      {memberStatsData.cumulativeMembers ? memberStatsData.cumulativeMembers[memberStatsData.cumulativeMembers.length - 1] : 0}
                    </div>
                    <div style={{ fontSize: 14, color: '#666' }}>当前累计会员</div>
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                      {memberStatsData.dailyNewMembers ? memberStatsData.dailyNewMembers[memberStatsData.dailyNewMembers.length - 1] : 0}
                    </div>
                    <div style={{ fontSize: 14, color: '#666' }}>今日新增会员</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 'bold', color: '#fa8c16' }}>
                      {memberStatsData.dailyNewMembers ? Math.round(memberStatsData.dailyNewMembers.reduce((a, b) => a + b, 0) / memberStatsData.dailyNewMembers.length) : 0}
                    </div>
                    <div style={{ fontSize: 14, color: '#666' }}>日均新增会员</div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          {/* 每日注册明细 */}
          <Row style={{ marginTop: 16 }}>
            <Col span={24}>
              <Card 
                title="每日注册明细" 
                className="dashboard-card"
                extra={
                  <Button 
                    icon={<ExportOutlined />} 
                    onClick={handleExportDailyData}
                    disabled={selectedDailyRowKeys.length === 0}
                  >
                    导出明细 ({selectedDailyRowKeys.length})
                  </Button>
                }
              >
                <Table
                  rowSelection={{
                    selectedRowKeys: selectedDailyRowKeys,
                    onChange: (selectedRowKeys, selectedRows) => {
                      setSelectedDailyRowKeys(selectedRowKeys);
                      setSelectedDailyRows(selectedRows);
                    },
                    onSelectAll: (selected, selectedRows, changeRows) => {
                      if (selected) {
                        setSelectedDailyRowKeys(dailyRegistrationData.map(item => item.date));
                        setSelectedDailyRows(dailyRegistrationData);
                      } else {
                        setSelectedDailyRowKeys([]);
                        setSelectedDailyRows([]);
                      }
                    },
                  }}
                  columns={dailyRegistrationColumns}
                  dataSource={dailyRegistrationData}
                  rowKey="date"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
                  }}
                  size="middle"
                />
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
  ];

  return (
    <div className="member-center-container">
      <Card>
        <Spin spinning={loading}>
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            size="large"
            tabBarStyle={{ marginBottom: '16px' }}
            items={tabItems}
          />
        </Spin>
      </Card>

      {/* 会员详情弹窗 */}
      <Modal
        title="会员详情"
        open={memberDetailVisible}
        onCancel={() => setMemberDetailVisible(false)}
        footer={null}
        width={1040}
      >
        {currentMember && (
          <div>
            <Descriptions title="基本信息" bordered column={2}>
              <Descriptions.Item label="会员ID">{currentMember.memberId}</Descriptions.Item>
              <Descriptions.Item label="手机号">{currentMember.phoneNumber}</Descriptions.Item>
              <Descriptions.Item label="会员姓名">{currentMember.memberName}</Descriptions.Item>
              <Descriptions.Item label="顾客等级">
                <Tag color={
                  currentMember.customerLevel === '普通' ? 'default' :
                  currentMember.customerLevel === '银卡' ? 'silver' :
                  currentMember.customerLevel === '金卡' ? 'gold' :
                  currentMember.customerLevel === '铂金' ? 'purple' : 'blue'
                }>
                  {currentMember.customerLevel}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="顾客身份">{currentMember.customerIdentity}</Descriptions.Item>
              <Descriptions.Item label="车牌号">{currentMember.licensePlate || '-'}</Descriptions.Item>
              <Descriptions.Item label="注册渠道">
                <Tag color={
                  currentMember.registrationChannel === '微信小程序' ? 'green' :
                  currentMember.registrationChannel === '微信公众号' ? 'blue' :
                  currentMember.registrationChannel === '支付宝小程序' ? 'orange' :
                  currentMember.registrationChannel === '线下注册' ? 'purple' :
                  currentMember.registrationChannel === '中石化卡绑定注册' ? 'red' : 'default'
                }>
                  {currentMember.registrationChannel || '未知'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="注册时间">{currentMember.registrationTime}</Descriptions.Item>
              <Descriptions.Item label="最近消费时间">{currentMember.lastConsumptionTime}</Descriptions.Item>
            </Descriptions>

            <Descriptions title="第三方账号信息" bordered column={2} style={{ marginTop: 16 }}>
              <Descriptions.Item label="微信小程序OPENID">{currentMember.wechatMiniOpenId || '-'}</Descriptions.Item>
              <Descriptions.Item label="微信公众号OPENID">{currentMember.wechatPublicOpenId || '-'}</Descriptions.Item>
              <Descriptions.Item label="支付宝OPENID">{currentMember.alipayOpenId || '-'}</Descriptions.Item>
              <Descriptions.Item label="绑定状态">
                <Space>
                  {currentMember.wechatMiniOpenId && <Tag color="green">微信小程序</Tag>}
                  {currentMember.wechatPublicOpenId && <Tag color="blue">微信公众号</Tag>}
                  {currentMember.alipayOpenId && <Tag color="orange">支付宝</Tag>}
                  {!currentMember.wechatMiniOpenId && !currentMember.wechatPublicOpenId && !currentMember.alipayOpenId && <Tag color="default">未绑定</Tag>}
                </Space>
              </Descriptions.Item>
            </Descriptions>

            <Descriptions title="账户信息" bordered column={2} style={{ marginTop: 16 }}>
              <Descriptions.Item label="积分余额">{currentMember.pointsBalance?.toLocaleString() || 0}</Descriptions.Item>
              <Descriptions.Item label="优惠券数量">{currentMember.couponCount || 0} 张</Descriptions.Item>
              <Descriptions.Item label="电子卡余额(本金)">¥{currentMember.storedValuePrincipal?.toFixed(2) || '0.00'}</Descriptions.Item>
              <Descriptions.Item label="电子卡余额(赠金)">¥{currentMember.storedValueBonus?.toFixed(2) || '0.00'}</Descriptions.Item>
              <Descriptions.Item label="电子储值卡总余额">¥{currentMember.storedValueBalance?.toFixed(2) || '0.00'}</Descriptions.Item>
              <Descriptions.Item label="中石化加油卡卡号">{currentMember.cardNumber || '-'}</Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 16 }}>
              <h3 style={{ marginBottom: 16 }}>优惠券明细</h3>
              <Form
                form={couponForm}
                layout="inline"
                onFinish={handleCouponFilter}
                style={{ marginBottom: 16 }}
              >
                <Form.Item name="couponName" label="优惠券名称">
                  <Input placeholder="请输入优惠券名称" style={{ width: 200 }} />
                </Form.Item>
                <Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                      查询
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={handleCouponReset}>
                      重置
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
              <Table
                columns={couponColumns}
                dataSource={filteredCoupons}
                rowKey={(record, index) => index}
                pagination={{
                  pageSize: 5,
                  showSizeChanger: false,
                  showQuickJumper: false,
                  showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
                }}
                scroll={{ x: 'max-content' }}
                size="small"
              />
            </div>

            <div style={{ marginTop: 16 }}>
              <h3 style={{ marginBottom: 16 }}>消费记录</h3>
              <Form
                form={consumptionForm}
                layout="inline"
                onFinish={handleConsumptionFilter}
                style={{ marginBottom: 16 }}
              >
                <Form.Item name="dateRange" label="时间范围">
                  <RangePicker style={{ width: 250 }} />
                </Form.Item>
                <Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                      查询
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={handleConsumptionReset}>
                      重置
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
              <Table
                columns={consumptionColumns}
                dataSource={filteredConsumption}
                rowKey={(record, index) => index}
                pagination={{
                  pageSize: 5,
                  showSizeChanger: false,
                  showQuickJumper: false,
                  showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
                }}
                scroll={{ x: 'max-content' }}
                size="small"
              />
            </div>
          </div>
        )}
      </Modal>

      {/* 列设置弹窗 */}
      <Modal
        title="自定义列显示"
        open={columnSettingVisible}
        onOk={() => setColumnSettingVisible(false)}
        onCancel={() => setColumnSettingVisible(false)}
        width={400}
      >
        <div>
          <p style={{ marginBottom: 16, color: '#666' }}>
            固定列：手机号、会员ID、注册时间
          </p>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Checkbox
              checked={visibleColumns.memberName}
              onChange={(e) => setVisibleColumns({...visibleColumns, memberName: e.target.checked})}
            >
              会员姓名
            </Checkbox>
            <Checkbox
              checked={visibleColumns.customerLevel}
              onChange={(e) => setVisibleColumns({...visibleColumns, customerLevel: e.target.checked})}
            >
              顾客等级
            </Checkbox>
            <Checkbox
              checked={visibleColumns.customerIdentity}
              onChange={(e) => setVisibleColumns({...visibleColumns, customerIdentity: e.target.checked})}
            >
              顾客身份
            </Checkbox>
            <Checkbox
              checked={visibleColumns.pointsBalance}
              onChange={(e) => setVisibleColumns({...visibleColumns, pointsBalance: e.target.checked})}
            >
              积分余额
            </Checkbox>
            <Checkbox
              checked={visibleColumns.cardNumber}
              onChange={(e) => setVisibleColumns({...visibleColumns, cardNumber: e.target.checked})}
            >
              中石化加油卡卡号
            </Checkbox>
            <Checkbox
              checked={visibleColumns.storedValueBalance}
              onChange={(e) => setVisibleColumns({...visibleColumns, storedValueBalance: e.target.checked})}
            >
              电子储值卡余额
            </Checkbox>
            <Checkbox
              checked={visibleColumns.lastConsumptionTime}
              onChange={(e) => setVisibleColumns({...visibleColumns, lastConsumptionTime: e.target.checked})}
            >
              最近消费时间
            </Checkbox>
          </Space>
        </div>
      </Modal>
    </div>
  );
};

export default MemberCenter; 