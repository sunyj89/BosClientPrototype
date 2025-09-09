import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Form, 
  Input, 
  Select, 
  Space, 
  Modal, 
  message, 
  Tag, 
  TreeSelect,
  Descriptions,
  Row,
  Col
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  EyeOutlined
} from '@ant-design/icons';
import mockData from '../../../../mock/oil/oil-price.json';
import oilMasterData from '../../../../mock/oil/master-data.json';
import stationData from '../../../../mock/station/stationData.json';

const { Option } = Select;

const OilPriceQuery = ({ setLoading }) => {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [stationTreeData, setStationTreeData] = useState([]);

  useEffect(() => {
    initializeData();
    loadData();
  }, []);

  // 初始化基础数据
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
      // 只显示审批通过且生效中的油价数据
      const effectivePrices = mockData.oilPriceList.filter(
        item => item.approvalStatus === '审批通过' && item.priceStatus === '生效'
      );
      setDataSource(effectivePrices);
      setLoading(false);
    }, 800);
  };

  const handleSearch = (values) => {
    setLoading(true);
    setTimeout(() => {
      // 只显示审批通过且生效中的油价数据
      let filteredData = mockData.oilPriceList.filter(
        item => item.approvalStatus === '审批通过' && item.priceStatus === '生效'
      );
      
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
      
      if (values.oilType) {
        filteredData = filteredData.filter(item => 
          item.oilType === values.oilType
        );
      }
      


      setDataSource(filteredData);
      setLoading(false);
    }, 500);
  };

  const handleReset = () => {
    form.resetFields();
    loadData();
  };

  const handleView = (record) => {
    setSelectedRecord(record);
    setIsViewModalVisible(true);
  };

  const handleViewModalClose = () => {
    setIsViewModalVisible(false);
    setSelectedRecord(null);
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
      title: '油品编号',
      dataIndex: 'oilCode',
      key: 'oilCode',
      width: 100
    },
    {
      title: '油品名称',
      dataIndex: 'oilName',
      key: 'oilName',
      width: 140
    },
    {
      title: '油品类型',
      dataIndex: 'oilType',
      key: 'oilType',
      width: 100,
      render: (text) => {
        const colorMap = {
          '汽油': 'red',
          '柴油': 'blue',
          '天然气': 'green',
          '尿素': 'purple'
        };
        return <Tag color={colorMap[text] || 'default'}>{text}</Tag>;
      }
    },
    {
      title: '挂牌价格(元/升)',
      dataIndex: 'listPrice',
      key: 'listPrice',
      width: 130,
      align: 'right',
      render: (price) => `¥${price.toFixed(2)}`
    },
    {
      title: '发改委指导价(元/升)',
      dataIndex: 'ndrcPrice',
      key: 'ndrcPrice',
      width: 150,
      align: 'right',
      render: (price) => `¥${price.toFixed(2)}`
    },

    {
      title: '价格生效时间',
      dataIndex: 'effectiveTime',
      key: 'effectiveTime',
      width: 160
    },
    {
      title: '维护时间',
      dataIndex: 'maintainTime',
      key: 'maintainTime',
      width: 160
    },
    {
      title: '维护人',
      dataIndex: 'maintainer',
      key: 'maintainer',
      width: 100
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            查看
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div>
      {/* 筛选区域 */}
      <Form
        form={form}
        layout="inline"
        onFinish={handleSearch}
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
          <Input
            placeholder="请输入油品名称"
            style={{ width: 140 }}
            allowClear
          />
        </Form.Item>
        <Form.Item name="oilType" label="油品类型">
          <Select
            placeholder="请选择油品类型"
            style={{ width: 120 }}
            allowClear
          >
            <Option value="汽油">汽油</Option>
            <Option value="柴油">柴油</Option>
            <Option value="天然气">天然气</Option>
            <Option value="尿素">尿素</Option>
          </Select>
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

      {/* 查看详情弹窗 */}
      <Modal
        title="油价详情"
        open={isViewModalVisible}
        onCancel={handleViewModalClose}
        footer={[
          <Button key="close" onClick={handleViewModalClose}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {selectedRecord && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="油站名称">{selectedRecord.stationName}</Descriptions.Item>
            <Descriptions.Item label="分公司">{selectedRecord.branchName}</Descriptions.Item>
            <Descriptions.Item label="油品编号">{selectedRecord.oilCode}</Descriptions.Item>
            <Descriptions.Item label="油品名称">{selectedRecord.oilName}</Descriptions.Item>
            <Descriptions.Item label="油品类型">
              <Tag color={
                selectedRecord.oilType === '汽油' ? 'red' : 
                selectedRecord.oilType === '柴油' ? 'blue' : 
                selectedRecord.oilType === '天然气' ? 'green' : 'purple'
              }>
                {selectedRecord.oilType}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label="挂牌价格">¥{selectedRecord.listPrice.toFixed(2)}/升</Descriptions.Item>
            <Descriptions.Item label="发改委指导价">¥{selectedRecord.ndrcPrice.toFixed(2)}/升</Descriptions.Item>
            <Descriptions.Item label="价格生效时间">{selectedRecord.effectiveTime}</Descriptions.Item>
            <Descriptions.Item label="维护时间">{selectedRecord.maintainTime}</Descriptions.Item>
            <Descriptions.Item label="维护人">{selectedRecord.maintainer}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default OilPriceQuery;
