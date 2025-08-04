import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Row, 
  Col, 
  Select, 
  Button, 
  Table, 
  Space, 
  Modal, 
  message,
  Descriptions,
  Tag,
  TreeSelect
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  ExportOutlined,
  QuestionCircleOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { DatePicker } from 'antd';

const { Option } = Select;
const { MonthPicker } = DatePicker;

// 构建树状数据
const buildStationTree = () => {
  const treeData = [];
  
  stationData.branches.forEach(branch => {
    const branchNode = {
      title: branch.name,
      value: branch.id,
      key: branch.id,
      children: []
    };
    
    // 找到该分公司下的服务区
    const serviceAreas = stationData.serviceAreas.filter(sa => sa.branchId === branch.id);
    
    serviceAreas.forEach(serviceArea => {
      const serviceAreaNode = {
        title: serviceArea.name,
        value: serviceArea.id,
        key: serviceArea.id,
        children: []
      };
      
      // 找到该服务区下的油站
      const stations = stationData.stations.filter(station => station.serviceAreaId === serviceArea.id);
      
      stations.forEach(station => {
        serviceAreaNode.children.push({
          title: station.name,
          value: station.id,
          key: station.id,
          isLeaf: true
        });
      });
      
      if (serviceAreaNode.children.length > 0) {
        branchNode.children.push(serviceAreaNode);
      }
    });
    
    if (branchNode.children.length > 0) {
      treeData.push(branchNode);
    }
  });
  
  return treeData;
};

// 临时内联数据 - 树状结构
const stationData = {
  branches: [
    { id: "BR001", name: "赣中分公司", code: "01" },
    { id: "BR002", name: "赣东北分公司", code: "02" },
    { id: "BR003", name: "赣南分公司", code: "03" },
    { id: "BR004", name: "赣北分公司", code: "04" },
    { id: "BR005", name: "赣东分公司", code: "05" }
  ],
  serviceAreas: [
    { id: "SA001", name: "南昌服务区", branchId: "BR001", code: "01" },
    { id: "SA002", name: "进贤服务区", branchId: "BR001", code: "02" },
    { id: "SA003", name: "上饶服务区", branchId: "BR002", code: "01" },
    { id: "SA004", name: "铅山服务区", branchId: "BR002", code: "02" },
    { id: "SA005", name: "赣州服务区", branchId: "BR003", code: "01" },
    { id: "SA006", name: "瑞金服务区", branchId: "BR003", code: "02" },
    { id: "SA007", name: "九江服务区", branchId: "BR004", code: "01" },
    { id: "SA008", name: "湖口服务区", branchId: "BR004", code: "02" },
    { id: "SA009", name: "鹰潭服务区", branchId: "BR005", code: "01" },
    { id: "SA010", name: "贵溪服务区", branchId: "BR005", code: "02" }
  ],
  stations: [
    { id: "ST001", name: "南昌高速服务区加油站", serviceAreaId: "SA001" },
    { id: "ST002", name: "上饶高速服务区加油站", serviceAreaId: "SA003" },
    { id: "ST003", name: "赣州高速服务区加油站", serviceAreaId: "SA005" },
    { id: "ST004", name: "九江高速服务区加油站", serviceAreaId: "SA007" },
    { id: "ST005", name: "鹰潭高速服务区加油站", serviceAreaId: "SA009" }
  ]
};

const waterElectricityData = {
  monthlyReports: [
    {
      "id": "MR001",
      "stationId": "ST001",
      "stationName": "南昌高速服务区加油站",
      "reportMonth": "2024-07",
      "waterRecords": {
        "waterMeter1": {
          "startReading": 1250.5,
          "endReading": 1310.8,
          "consumption": 60.3
        },
        "waterMeter2": {
          "startReading": 890.2,
          "endReading": 950.6,
          "consumption": 60.4
        },
        "totalConsumption": 120.7,
        "oilVolume": 150.5,
        "waterPerTon": 0.80
      },
      "electricRecords": {
        "electricMeter1": {
          "startReading": 4560.8,
          "endReading": 4680.2,
          "consumption": 119.4
        },
        "electricMeter2": {
          "startReading": 3200.3,
          "endReading": 3300.4,
          "consumption": 100.1
        },
        "totalConsumption": 219.5,
        "oilVolume": 150.5,
        "electricPerTon": 1.46
      },
      "generateTime": "2024-07-31T23:59:59Z"
    },
    {
      "id": "MR002",
      "stationId": "ST002",
      "stationName": "上饶高速服务区加油站",
      "reportMonth": "2024-07",
      "waterRecords": {
        "waterMeter1": {
          "startReading": 980.5,
          "endReading": 1040.8,
          "consumption": 60.3
        },
        "waterMeter2": {
          "startReading": 650.8,
          "endReading": 710.9,
          "consumption": 60.1
        },
        "totalConsumption": 120.4,
        "oilVolume": 120.8,
        "waterPerTon": 1.00
      },
      "electricRecords": {
        "electricMeter1": {
          "startReading": 3800.2,
          "endReading": 3920.5,
          "consumption": 120.3
        },
        "electricMeter2": {
          "startReading": 2600.5,
          "endReading": 2700.8,
          "consumption": 100.3
        },
        "totalConsumption": 220.6,
        "oilVolume": 120.8,
        "electricPerTon": 1.83
      },
      "generateTime": "2024-07-31T23:59:59Z"
    }
  ]
};

const MonthlyReports = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [guideModalVisible, setGuideModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setData(waterElectricityData.monthlyReports);
      setFilteredData(waterElectricityData.monthlyReports);
      setLoading(false);
    }, 500);
  };

  const handleSearch = (values) => {
    let filtered = [...data];
    
    if (values.stationId) {
      filtered = filtered.filter(item => item.stationId === values.stationId);
    }
    
    if (values.reportMonth) {
      const month = values.reportMonth.format('YYYY-MM');
      filtered = filtered.filter(item => item.reportMonth === month);
    }
    
    setFilteredData(filtered);
  };

  const handleReset = () => {
    form.resetFields();
    setFilteredData(data);
  };

  const showGuideModal = () => {
    setGuideModalVisible(true);
  };

  const handleExport = () => {
    if (filteredData.length === 0) {
      message.warning('没有数据可导出');
      return;
    }

    const headers = [
      '油站名称', '报表月份', 
      '水表1期初数', '水表1期末数', '水表1走字数',
      '水表2期初数', '水表2期末数', '水表2走字数',
      '本月总水表度数', '本月付油量(吨)', '吨油用水量(吨)',
      '电表1期初数', '电表1期末数', '电表1走字数',
      '电表2期初数', '电表2期末数', '电表2走字数',
      '本月总电表度数', '本月付油量(吨)', '吨油用电量(度)', '生成时间'
    ];

    const csvContent = [
      headers.join(','),
      ...filteredData.map(record => [
        record.stationName,
        record.reportMonth,
        record.waterRecords.waterMeter1.startReading,
        record.waterRecords.waterMeter1.endReading,
        record.waterRecords.waterMeter1.consumption,
        record.waterRecords.waterMeter2.startReading,
        record.waterRecords.waterMeter2.endReading,
        record.waterRecords.waterMeter2.consumption,
        record.waterRecords.totalConsumption,
        record.waterRecords.oilVolume,
        record.waterRecords.waterPerTon,
        record.electricRecords.electricMeter1.startReading,
        record.electricRecords.electricMeter1.endReading,
        record.electricRecords.electricMeter1.consumption,
        record.electricRecords.electricMeter2.startReading,
        record.electricRecords.electricMeter2.endReading,
        record.electricRecords.electricMeter2.consumption,
        record.electricRecords.totalConsumption,
        record.electricRecords.oilVolume,
        record.electricRecords.electricPerTon,
        new Date(record.generateTime).toLocaleString()
      ].join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `水电表月报表_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const showDetail = (record) => {
    setSelectedRecord(record);
    setDetailModalVisible(true);
  };

  const columns = [
    {
      title: '油站名称',
      dataIndex: 'stationName',
      key: 'stationName',
      width: 200,
    },
    {
      title: '报表月份',
      dataIndex: 'reportMonth',
      key: 'reportMonth',
      width: 120,
    },
    {
      title: '本月用水记录',
      children: [
        {
          title: '水表1期初数',
          dataIndex: ['waterRecords', 'waterMeter1', 'startReading'],
          key: 'waterMeter1Start',
          width: 120,
        },
        {
          title: '水表1期末数',
          dataIndex: ['waterRecords', 'waterMeter1', 'endReading'],
          key: 'waterMeter1End',
          width: 120,
        },
        {
          title: '水表1走字数',
          dataIndex: ['waterRecords', 'waterMeter1', 'consumption'],
          key: 'waterMeter1Consumption',
          width: 120,
        },
        {
          title: '水表2期初数',
          dataIndex: ['waterRecords', 'waterMeter2', 'startReading'],
          key: 'waterMeter2Start',
          width: 120,
        },
        {
          title: '水表2期末数',
          dataIndex: ['waterRecords', 'waterMeter2', 'endReading'],
          key: 'waterMeter2End',
          width: 120,
        },
        {
          title: '水表2走字数',
          dataIndex: ['waterRecords', 'waterMeter2', 'consumption'],
          key: 'waterMeter2Consumption',
          width: 120,
        },
        {
          title: '本月总水表度数',
          dataIndex: ['waterRecords', 'totalConsumption'],
          key: 'totalWaterConsumption',
          width: 140,
        },
        {
          title: '本月付油量(吨)',
          dataIndex: ['waterRecords', 'oilVolume'],
          key: 'oilVolume',
          width: 140,
        },
        {
          title: '吨油用水量(吨)',
          dataIndex: ['waterRecords', 'waterPerTon'],
          key: 'waterPerTon',
          width: 140,
        }
      ]
    },
    {
      title: '本月用电记录',
      children: [
        {
          title: '电表1期初数',
          dataIndex: ['electricRecords', 'electricMeter1', 'startReading'],
          key: 'electricMeter1Start',
          width: 120,
        },
        {
          title: '电表1期末数',
          dataIndex: ['electricRecords', 'electricMeter1', 'endReading'],
          key: 'electricMeter1End',
          width: 120,
        },
        {
          title: '电表1走字数',
          dataIndex: ['electricRecords', 'electricMeter1', 'consumption'],
          key: 'electricMeter1Consumption',
          width: 120,
        },
        {
          title: '电表2期初数',
          dataIndex: ['electricRecords', 'electricMeter2', 'startReading'],
          key: 'electricMeter2Start',
          width: 120,
        },
        {
          title: '电表2期末数',
          dataIndex: ['electricRecords', 'electricMeter2', 'endReading'],
          key: 'electricMeter2End',
          width: 120,
        },
        {
          title: '电表2走字数',
          dataIndex: ['electricRecords', 'electricMeter2', 'consumption'],
          key: 'electricMeter2Consumption',
          width: 120,
        },
        {
          title: '本月总电表度数',
          dataIndex: ['electricRecords', 'totalConsumption'],
          key: 'totalElectricConsumption',
          width: 140,
        },
        {
          title: '本月付油量(吨)',
          dataIndex: ['electricRecords', 'oilVolume'],
          key: 'electricOilVolume',
          width: 140,
        },
        {
          title: '吨油用电量(度)',
          dataIndex: ['electricRecords', 'electricPerTon'],
          key: 'electricPerTon',
          width: 140,
        }
      ]
    },
    {
      title: '生成时间',
      dataIndex: 'generateTime',
      key: 'generateTime',
      width: 150,
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 80,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => showDetail(record)}
          >
            查看
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* 筛选区域 */}
      <div style={{ background: 'white', padding: '16px', marginBottom: '16px' }}>
        <Form
          form={form}
          layout="inline"
          onFinish={handleSearch}
          style={{ marginBottom: '16px' }}
        >
          <Row gutter={16} style={{ width: '100%' }}>
            <Col span={8}>
              <Form.Item name="stationId" label="所属油站">
                <TreeSelect
                  placeholder="请选择油站"
                  style={{ width: '100%' }}
                  treeData={buildStationTree()}
                  treeDefaultExpandAll
                  allowClear
                  showSearch
                  treeNodeFilterProp="title"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="reportMonth" label="报表月份">
                <MonthPicker placeholder="请选择月份" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item style={{ width: '100%', textAlign: 'right' }}>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                查询
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
              <Button type="primary" icon={<ExportOutlined />} onClick={handleExport}>
                导出
              </Button>
              <Button icon={<QuestionCircleOutlined />} onClick={showGuideModal}>
                填写指引
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>

      {/* 表格区域 */}
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        loading={loading}
        scroll={{ x: 'max-content' }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
      />

      {/* 填写指引弹窗 */}
      <Modal
        title="填写指引"
        open={guideModalVisible}
        onCancel={() => setGuideModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setGuideModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={600}
      >
        <div style={{ lineHeight: '1.8' }}>
          <p><strong>1.</strong> 本报表反应加油站月度水电使用情况，作为上级主管部门考核加油站水电使用情况的依据，由记账人员（核算人员）填写，站长签字确认，在加油站保存一份，上报主管部门一份。</p>
          <p><strong>2.</strong> 走字数=期末数一期初数。</p>
          <p><strong>3.</strong> 本月总度数:为多个表走字数之和。</p>
          <p><strong>4.</strong> 吨油用水（电）量=本月总度数／本月付油量。</p>
          <p><strong>5.</strong> 主管部门可以根据加油站水电表数量增减表格列数，以达到管理需求。</p>
        </div>
      </Modal>

      {/* 详情查看弹窗 */}
      <Modal
        title="月报表详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {selectedRecord && (
          <div>
            <Descriptions title="基本信息" bordered style={{ marginBottom: '24px' }}>
              <Descriptions.Item label="油站名称" span={2}>
                {selectedRecord.stationName}
              </Descriptions.Item>
              <Descriptions.Item label="报表月份" span={1}>
                {selectedRecord.reportMonth}
              </Descriptions.Item>
              <Descriptions.Item label="生成时间" span={3}>
                {new Date(selectedRecord.generateTime).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions title="本月用水记录" bordered style={{ marginBottom: '24px' }}>
              <Descriptions.Item label="水表1期初数">
                {selectedRecord.waterRecords.waterMeter1.startReading}
              </Descriptions.Item>
              <Descriptions.Item label="水表1期末数">
                {selectedRecord.waterRecords.waterMeter1.endReading}
              </Descriptions.Item>
              <Descriptions.Item label="水表1走字数">
                {selectedRecord.waterRecords.waterMeter1.consumption}
              </Descriptions.Item>
              <Descriptions.Item label="水表2期初数">
                {selectedRecord.waterRecords.waterMeter2.startReading}
              </Descriptions.Item>
              <Descriptions.Item label="水表2期末数">
                {selectedRecord.waterRecords.waterMeter2.endReading}
              </Descriptions.Item>
              <Descriptions.Item label="水表2走字数">
                {selectedRecord.waterRecords.waterMeter2.consumption}
              </Descriptions.Item>
              <Descriptions.Item label="本月总水表度数" span={2}>
                <Tag color="blue">{selectedRecord.waterRecords.totalConsumption}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="本月付油量(吨)">
                {selectedRecord.waterRecords.oilVolume}
              </Descriptions.Item>
              <Descriptions.Item label="吨油用水量(吨)">
                <Tag color="green">{selectedRecord.waterRecords.waterPerTon}</Tag>
              </Descriptions.Item>
            </Descriptions>

            <Descriptions title="本月用电记录" bordered>
              <Descriptions.Item label="电表1期初数">
                {selectedRecord.electricRecords.electricMeter1.startReading}
              </Descriptions.Item>
              <Descriptions.Item label="电表1期末数">
                {selectedRecord.electricRecords.electricMeter1.endReading}
              </Descriptions.Item>
              <Descriptions.Item label="电表1走字数">
                {selectedRecord.electricRecords.electricMeter1.consumption}
              </Descriptions.Item>
              <Descriptions.Item label="电表2期初数">
                {selectedRecord.electricRecords.electricMeter2.startReading}
              </Descriptions.Item>
              <Descriptions.Item label="电表2期末数">
                {selectedRecord.electricRecords.electricMeter2.endReading}
              </Descriptions.Item>
              <Descriptions.Item label="电表2走字数">
                {selectedRecord.electricRecords.electricMeter2.consumption}
              </Descriptions.Item>
              <Descriptions.Item label="本月总电表度数" span={2}>
                <Tag color="orange">{selectedRecord.electricRecords.totalConsumption}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="本月付油量(吨)">
                {selectedRecord.electricRecords.oilVolume}
              </Descriptions.Item>
              <Descriptions.Item label="吨油用电量(度)">
                <Tag color="red">{selectedRecord.electricRecords.electricPerTon}</Tag>
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MonthlyReports; 