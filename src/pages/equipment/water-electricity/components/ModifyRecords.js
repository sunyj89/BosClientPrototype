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
  Tag,
  TreeSelect
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  ExportOutlined,
  EyeOutlined
} from '@ant-design/icons';

const { Option } = Select;

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

// 临时内联数据
const waterElectricityData = {
  modifyRecords: [
    {
      "id": "MR001",
      "recordNumber": "SDJ2024070001",
      "operationType": "编辑",
      "operatorName": "张师傅",
      "operateTime": "2024-07-15T09:30:00Z",
      "description": "修正水表1交班数",
      "changes": "水表1交班数从1280.3修正为1280.5",
      "approvalStatus": "已审批",
      "approver": "李主管",
      "approvalTime": "2024-07-15T10:00:00Z",
      "approvalRemark": "数据修正准确"
    },
    {
      "id": "MR002",
      "recordNumber": "SDJ2024070002",
      "operationType": "新增",
      "operatorName": "李师傅",
      "operateTime": "2024-07-15T16:30:00Z",
      "description": "创建中班交接记录",
      "changes": "新建中班水电表交接记录",
      "approvalStatus": "审批中",
      "approver": "",
      "approvalTime": "",
      "approvalRemark": ""
    },
    {
      "id": "MR003",
      "recordNumber": "SDJ2024070003",
      "operationType": "编辑",
      "operatorName": "陈师傅",
      "operateTime": "2024-07-15T08:30:00Z",
      "description": "修正电表2走字数",
      "changes": "电表2走字数从49.6修正为49.8",
      "approvalStatus": "已审批",
      "approver": "赵主管",
      "approvalTime": "2024-07-15T09:00:00Z",
      "approvalRemark": "计算正确"
    }
  ]
};

const ModifyRecords = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setData(waterElectricityData.modifyRecords);
      setFilteredData(waterElectricityData.modifyRecords);
      setLoading(false);
    }, 500);
  };

  const handleSearch = (values) => {
    let filtered = [...data];
    
    if (values.stationId) {
      // 根据油站ID过滤，这里需要关联查询
      // 在实际应用中，这里需要根据recordNumber关联到具体的油站
      // 目前暂时返回所有记录，后续可以根据实际数据结构调整
      filtered = filtered.filter(item => {
        // 这里可以根据recordNumber的前缀或其他标识来关联油站
        // 例如：SDJ2024070001 可能对应 ST001 油站
        return true; // 暂时返回所有记录
      });
    }
    
    if (values.operationType) {
      filtered = filtered.filter(item => item.operationType === values.operationType);
    }
    
    if (values.approvalStatus) {
      filtered = filtered.filter(item => item.approvalStatus === values.approvalStatus);
    }
    
    setFilteredData(filtered);
  };

  const handleReset = () => {
    form.resetFields();
    setFilteredData(data);
  };

  const handleExport = () => {
    if (filteredData.length === 0) {
      message.warning('没有数据可导出');
      return;
    }

    const headers = [
      '记录单编号', '操作类型', '操作人', '操作时间', '描述', '变更内容',
      '审批状态', '审批人', '审批时间', '审批备注'
    ];

    const csvContent = [
      headers.join(','),
      ...filteredData.map(record => [
        record.recordNumber,
        record.operationType,
        record.operatorName,
        new Date(record.operateTime).toLocaleString(),
        record.description,
        record.changes,
        record.approvalStatus,
        record.approver,
        record.approvalTime ? new Date(record.approvalTime).toLocaleString() : '',
        record.approvalRemark
      ].join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `水电表修改记录_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const showDetail = (record) => {
    setSelectedRecord(record);
    setDetailModalVisible(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case '已审批':
        return 'green';
      case '审批中':
        return 'blue';
      case '已驳回':
        return 'red';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: '记录单编号',
      dataIndex: 'recordNumber',
      key: 'recordNumber',
      width: 150,
    },
    {
      title: '操作类型',
      dataIndex: 'operationType',
      key: 'operationType',
      width: 100,
      render: (text) => (
        <Tag color={text === '新增' ? 'blue' : 'orange'}>
          {text}
        </Tag>
      ),
    },
    {
      title: '操作人',
      dataIndex: 'operatorName',
      key: 'operatorName',
      width: 100,
    },
    {
      title: '操作时间',
      dataIndex: 'operateTime',
      key: 'operateTime',
      width: 150,
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 200,
    },
    {
      title: '变更内容',
      dataIndex: 'changes',
      key: 'changes',
      width: 200,
      ellipsis: true,
    },
    {
      title: '审批状态',
      dataIndex: 'approvalStatus',
      key: 'approvalStatus',
      width: 100,
      render: (text) => (
        <Tag color={getStatusColor(text)}>
          {text}
        </Tag>
      ),
    },
    {
      title: '审批人',
      dataIndex: 'approver',
      key: 'approver',
      width: 100,
    },
    {
      title: '审批时间',
      dataIndex: 'approvalTime',
      key: 'approvalTime',
      width: 150,
      render: (text) => text ? new Date(text).toLocaleString() : '-',
    },
    {
      title: '审批备注',
      dataIndex: 'approvalRemark',
      key: 'approvalRemark',
      width: 150,
      ellipsis: true,
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
            <Col span={6}>
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
            <Col span={6}>
              <Form.Item name="operationType" label="操作类型">
                <Select placeholder="请选择操作类型" style={{ width: '100%' }}>
                  <Option value="新增">新增</Option>
                  <Option value="编辑">编辑</Option>
                  <Option value="删除">删除</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="approvalStatus" label="审批状态">
                <Select placeholder="请选择审批状态" style={{ width: '100%' }}>
                  <Option value="已审批">已审批</Option>
                  <Option value="审批中">审批中</Option>
                  <Option value="已驳回">已驳回</Option>
                </Select>
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

      {/* 详情查看弹窗 */}
      <Modal
        title="修改记录详情"
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
            <div style={{ marginBottom: '24px' }}>
              <h4>基本信息</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <strong>记录单编号：</strong>
                  <span>{selectedRecord.recordNumber}</span>
                </div>
                <div>
                  <strong>操作类型：</strong>
                  <Tag color={selectedRecord.operationType === '新增' ? 'blue' : 'orange'}>
                    {selectedRecord.operationType}
                  </Tag>
                </div>
                <div>
                  <strong>操作人：</strong>
                  <span>{selectedRecord.operatorName}</span>
                </div>
                <div>
                  <strong>操作时间：</strong>
                  <span>{new Date(selectedRecord.operateTime).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h4>变更信息</h4>
              <div style={{ marginBottom: '16px' }}>
                <strong>描述：</strong>
                <p style={{ margin: '8px 0', padding: '8px', background: '#f5f5f5', borderRadius: '4px' }}>
                  {selectedRecord.description}
                </p>
              </div>
              <div>
                <strong>变更内容：</strong>
                <p style={{ margin: '8px 0', padding: '8px', background: '#f5f5f5', borderRadius: '4px' }}>
                  {selectedRecord.changes}
                </p>
              </div>
            </div>

            <div>
              <h4>审批信息</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <strong>审批状态：</strong>
                  <Tag color={getStatusColor(selectedRecord.approvalStatus)}>
                    {selectedRecord.approvalStatus}
                  </Tag>
                </div>
                <div>
                  <strong>审批人：</strong>
                  <span>{selectedRecord.approver || '-'}</span>
                </div>
                <div>
                  <strong>审批时间：</strong>
                  <span>{selectedRecord.approvalTime ? new Date(selectedRecord.approvalTime).toLocaleString() : '-'}</span>
                </div>
                <div>
                  <strong>审批备注：</strong>
                  <span>{selectedRecord.approvalRemark || '-'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ModifyRecords; 