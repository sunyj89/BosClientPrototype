import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Form, 
  Input, 
  Select, 
  DatePicker,
  Button, 
  Space, 
  Tag, 
  TreeSelect,
  Modal,
  Descriptions
} from 'antd';
import { SearchOutlined, ReloadOutlined, EyeOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import mockData from '../../../../mock/oil/oil-price.json';
import stationData from '../../../../mock/station/stationData.json';

const { Option } = Select;
const { RangePicker } = DatePicker;

const PriceHistory = ({ setLoading }) => {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [stationTreeData, setStationTreeData] = useState([]);

  useEffect(() => {
    initializeData();
    loadData();
  }, []);

  const initializeData = () => {
    // 构建油站树形数据
    const treeData = [
      {
        title: '江西交投化石能源公司',
        value: 'COMPANY',
        selectable: false,
        children: stationData.branches.map(branch => ({
          title: branch.name,
          value: branch.id,
          children: stationData.serviceAreas
            .filter(sa => sa.branchId === branch.id)
            .map(serviceArea => ({
              title: serviceArea.name,
              value: serviceArea.id,
              children: stationData.stations
                .filter(station => station.serviceAreaId === serviceArea.id)
                .map(station => ({
                  title: station.name,
                  value: station.id,
                  isLeaf: true
                }))
            }))
        }))
      }
    ];
    setStationTreeData(treeData);
  };

  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      setDataSource(mockData.priceHistory);
      setLoading(false);
    }, 500);
  };

  const handleSearch = (values) => {
    setLoading(true);
    setTimeout(() => {
      let filteredData = [...mockData.priceHistory];
      
      if (values.stationId) {
        // 如果选择的是分公司或服务区，筛选其下所有油站
        if (values.stationId.startsWith('BR')) {
          const serviceAreas = stationData.serviceAreas.filter(sa => sa.branchId === values.stationId);
          const stationIds = stationData.stations
            .filter(station => serviceAreas.some(sa => sa.id === station.serviceAreaId))
            .map(station => station.id);
          filteredData = filteredData.filter(item => stationIds.includes(item.stationId));
        } else if (values.stationId.startsWith('SA')) {
          const stationIds = stationData.stations
            .filter(station => station.serviceAreaId === values.stationId)
            .map(station => station.id);
          filteredData = filteredData.filter(item => stationIds.includes(item.stationId));
        } else if (values.stationId !== 'COMPANY') {
          filteredData = filteredData.filter(item => item.stationId === values.stationId);
        }
      }
      
      if (values.oilName) {
        filteredData = filteredData.filter(item => 
          item.oilName.includes(values.oilName)
        );
      }
      
      if (values.changeType) {
        filteredData = filteredData.filter(item => 
          item.changeType === values.changeType
        );
      }
      
      if (values.operator) {
        filteredData = filteredData.filter(item => 
          item.operator.includes(values.operator)
        );
      }

      if (values.dateRange && values.dateRange.length === 2) {
        const [startDate, endDate] = values.dateRange;
        filteredData = filteredData.filter(item => {
          const changeTime = new Date(item.changeTime);
          return changeTime >= startDate.startOf('day').toDate() && 
                 changeTime <= endDate.endOf('day').toDate();
        });
      }

      setDataSource(filteredData);
      setLoading(false);
    }, 500);
  };

  const handleReset = () => {
    form.resetFields();
    loadData();
  };

  const handleViewDetail = (record) => {
    setSelectedRecord(record);
    setIsDetailVisible(true);
  };

  const getChangeTypeColor = (type) => {
    switch (type) {
      case '上调':
        return 'red';
      case '下调':
        return 'green';
      case '不变':
        return 'blue';
      default:
        return 'default';
    }
  };

  const getChangeTypeIcon = (type) => {
    switch (type) {
      case '上调':
        return <ArrowUpOutlined style={{ color: '#f5222d' }} />;
      case '下调':
        return <ArrowDownOutlined style={{ color: '#52c41a' }} />;
      default:
        return null;
    }
  };

  const columns = [
    {
      title: '油站名称',
      dataIndex: 'stationName',
      key: 'stationName',
      width: 140,
      fixed: 'left'
    },
    {
      title: '分公司',
      dataIndex: 'branchName',
      key: 'branchName',
      width: 120
    },
    {
      title: '油品名称',
      dataIndex: 'oilName',
      key: 'oilName',
      width: 140
    },
    {
      title: '原价格(元/升)',
      dataIndex: 'oldPrice',
      key: 'oldPrice',
      width: 120,
      align: 'right',
      render: (price) => `¥${price.toFixed(2)}`
    },
    {
      title: '新价格(元/升)',
      dataIndex: 'newPrice',
      key: 'newPrice',
      width: 120,
      align: 'right',
      render: (price) => `¥${price.toFixed(2)}`
    },
    {
      title: '变动类型',
      dataIndex: 'changeType',
      key: 'changeType',
      width: 100,
      render: (type) => (
        <Space>
          {getChangeTypeIcon(type)}
          <Tag color={getChangeTypeColor(type)}>{type}</Tag>
        </Space>
      )
    },
    {
      title: '变动金额(元)',
      dataIndex: 'changeAmount',
      key: 'changeAmount',
      width: 120,
      align: 'right',
      render: (amount, record) => {
        const color = record.changeType === '上调' ? '#f5222d' : record.changeType === '下调' ? '#52c41a' : '#1890ff';
        const prefix = record.changeType === '上调' ? '+' : record.changeType === '下调' ? '-' : '';
        return <span style={{ color }}>{prefix}¥{Math.abs(amount).toFixed(2)}</span>;
      }
    },
    {
      title: '变动原因',
      dataIndex: 'changeReason',
      key: 'changeReason',
      width: 160,
      ellipsis: true
    },
    {
      title: '变动时间',
      dataIndex: 'changeTime',
      key: 'changeTime',
      width: 160
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
      width: 100
    },
    {
      title: '审批人',
      dataIndex: 'approver',
      key: 'approver',
      width: 100
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          查看详情
        </Button>
      )
    }
  ];

  return (
    <div>
      {/* 筛选区域 */}
      <Form
        form={form}
        onFinish={handleSearch}
        layout="inline"
        style={{ marginBottom: 16, background: '#fff', padding: '16px', borderRadius: '4px' }}
      >
        <Form.Item name="stationId" label="公司/油站">
          <TreeSelect
            style={{ width: 200 }}
            placeholder="请选择公司或油站"
            allowClear
            treeData={stationTreeData}
            showSearch
            treeDefaultExpandAll
          />
        </Form.Item>
        <Form.Item name="oilName" label="油品名称">
          <Input placeholder="请输入油品名称" style={{ width: 140 }} allowClear />
        </Form.Item>
        <Form.Item name="changeType" label="变动类型">
          <Select placeholder="请选择变动类型" style={{ width: 120 }} allowClear>
            <Option value="上调">上调</Option>
            <Option value="下调">下调</Option>
            <Option value="不变">不变</Option>
          </Select>
        </Form.Item>
        <Form.Item name="operator" label="操作人">
          <Input placeholder="请输入操作人" style={{ width: 120 }} allowClear />
        </Form.Item>
        <Form.Item name="dateRange" label="变动时间">
          <RangePicker style={{ width: 250 }} />
        </Form.Item>
        <Form.Item style={{ marginLeft: 'auto' }}>
          <Space>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              查询
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>

      {/* 表格区域 */}
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
        scroll={{ x: 'max-content' }}
      />

      {/* 详情弹窗 */}
      <Modal
        title="价格变动详情"
        open={isDetailVisible}
        onCancel={() => setIsDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {selectedRecord && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="油站名称">{selectedRecord.stationName}</Descriptions.Item>
            <Descriptions.Item label="分公司">{selectedRecord.branchName}</Descriptions.Item>
            <Descriptions.Item label="油品名称">{selectedRecord.oilName}</Descriptions.Item>
            <Descriptions.Item label="变动类型">
              <Space>
                {getChangeTypeIcon(selectedRecord.changeType)}
                <Tag color={getChangeTypeColor(selectedRecord.changeType)}>
                  {selectedRecord.changeType}
                </Tag>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="原价格">¥{selectedRecord.oldPrice.toFixed(2)}/升</Descriptions.Item>
            <Descriptions.Item label="新价格">¥{selectedRecord.newPrice.toFixed(2)}/升</Descriptions.Item>
            <Descriptions.Item label="变动金额">
              <span style={{ 
                color: selectedRecord.changeType === '上调' ? '#f5222d' : 
                       selectedRecord.changeType === '下调' ? '#52c41a' : '#1890ff' 
              }}>
                {selectedRecord.changeType === '上调' ? '+' : 
                 selectedRecord.changeType === '下调' ? '-' : ''}
                ¥{Math.abs(selectedRecord.changeAmount).toFixed(2)}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="变动原因" span={2}>
              {selectedRecord.changeReason}
            </Descriptions.Item>
            <Descriptions.Item label="变动时间">{selectedRecord.changeTime}</Descriptions.Item>
            <Descriptions.Item label="操作人">{selectedRecord.operator}</Descriptions.Item>
            <Descriptions.Item label="审批人">{selectedRecord.approver}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default PriceHistory;
