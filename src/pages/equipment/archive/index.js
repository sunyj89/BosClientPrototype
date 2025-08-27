import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Tabs, 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Select, 
  TreeSelect,
  DatePicker, 
  message, 
  Popconfirm,
  Descriptions,
  Tag,
  Row,
  Col,
  Spin
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  SearchOutlined,
  ReloadOutlined,
  ExportOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import equipmentArchiveData from '../../../mock/equipment/equipmentArchiveData.json';
import stationData from '../../../mock/station/stationData.json';

import './index.css';

const { Option } = Select;

const EquipmentArchive = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('archive');
  
  // 设备档案明细状态
  const [archiveData, setArchiveData] = useState([]);
  const [archiveModalVisible, setArchiveModalVisible] = useState(false);
  const [archiveForm] = Form.useForm();
  const [editingArchive, setEditingArchive] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  
  // 修改记录状态
  const [modifyRecords, setModifyRecords] = useState([]);
  const [modifyRecordModalVisible, setModifyRecordModalVisible] = useState(false);
  const [currentModifyRecord, setCurrentModifyRecord] = useState(null);

  // 筛选条件状态
  const [filterForm] = Form.useForm();
  const [filteredData, setFilteredData] = useState([]);

  // 初始化数据
  useEffect(() => {
    fetchArchiveData();
    fetchModifyRecords();
  }, []);

  const fetchArchiveData = () => {
    setLoading(true);
    setTimeout(() => {
      const data = equipmentArchiveData.equipmentArchive;
      setArchiveData(data);
      setFilteredData(data);
      setLoading(false);
    }, 500);
  };

  const fetchModifyRecords = () => {
    setModifyRecords(equipmentArchiveData.modifyRecords);
  };

  // 查询功能
  const handleSearch = async () => {
    try {
      const values = await filterForm.validateFields();
      let filtered = [...archiveData];

      // 根据筛选条件过滤数据
      if (values.searchText) {
        filtered = filtered.filter(item => 
          item.equipmentCode.toLowerCase().includes(values.searchText.toLowerCase()) ||
          item.equipmentName.toLowerCase().includes(values.searchText.toLowerCase())
        );
      }
      if (values.status) {
        filtered = filtered.filter(item => item.status === values.status);
      }
      if (values.stationId) {
        filtered = filtered.filter(item => item.stationId === values.stationId);
      }
      if (values.usageNature) {
        filtered = filtered.filter(item => item.usageNature === values.usageNature);
      }

      setFilteredData(filtered);
      message.success(`查询完成，共找到 ${filtered.length} 条记录`);
    } catch (error) {
      console.error('查询失败:', error);
    }
  };

  // 重置筛选
  const handleReset = () => {
    filterForm.resetFields();
    setFilteredData(archiveData);
    message.success('筛选条件已重置');
  };

  // 导出功能
  const handleExport = async () => {
    try {
      const values = await filterForm.validateFields();
      
      // 获取当前筛选后的数据
      const exportData = filteredData.map(item => ({
        '设备编号': item.equipmentCode,
        '设备名称': item.equipmentName,
        '设备型号': item.model,
        '使用性质': item.usageNature,
        '所属油站': item.stationName,
        '出厂编号': item.serialNumber,
        '购置时间': item.purchaseDate,
        '生产厂家': item.manufacturer,
        '使用状态': item.status,
        '责任人': item.responsiblePerson,
        '创建时间': dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')
      }));

      // 转换为CSV格式
      const headers = Object.keys(exportData[0] || {});
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
      ].join('\n');

      // 创建下载链接
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `设备档案记录_${dayjs().format('YYYYMMDD_HHmmss')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      message.success(`成功导出 ${exportData.length} 条记录`);
    } catch (error) {
      console.error('导出失败:', error);
      message.error('导出失败，请重试');
    }
  };

  // 构建油站树状结构数据
  const buildStationTreeData = () => {
    const treeData = [];
    
    // 按分公司分组构建树状结构
    stationData.branches.forEach(branch => {
      const branchNode = {
        title: branch.name,
        value: `branch_${branch.id}`,
        key: `branch_${branch.id}`,
        selectable: false,
        children: []
      };
      
      // 查找该分公司下的服务区
      const serviceAreas = stationData.serviceAreas.filter(sa => sa.branchId === branch.id);
      
      serviceAreas.forEach(serviceArea => {
        const serviceAreaNode = {
          title: serviceArea.name,
          value: `area_${serviceArea.id}`,
          key: `area_${serviceArea.id}`,
          selectable: false,
          children: []
        };
        
        // 查找该服务区下的加油站
        const stations = stationData.stations.filter(station => station.serviceAreaId === serviceArea.id);
        
        stations.forEach(station => {
          serviceAreaNode.children.push({
            title: station.name,
            value: station.id,
            key: station.id,
            selectable: true
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

  // 设备档案明细操作
  const handleAddArchive = () => {
    setEditingArchive(null);
    archiveForm.resetFields();
    setArchiveModalVisible(true);
  };

  const handleEditArchive = (record) => {
    setEditingArchive(record);
    archiveForm.setFieldsValue({
      ...record,
      purchaseDate: record.purchaseDate ? dayjs(record.purchaseDate) : null,
    });
    setArchiveModalVisible(true);
  };

  const handleViewArchive = (record) => {
    setCurrentRecord(record);
    setViewModalVisible(true);
  };

  const handleDeleteArchive = (record) => {
    const newData = archiveData.filter(item => item.id !== record.id);
    setArchiveData(newData);
    setFilteredData(newData);
    
    // 添加删除记录
    const deleteRecord = {
      id: `MR${Date.now()}`,
      equipmentId: record.id,
      equipmentCode: record.equipmentCode,
      equipmentName: record.equipmentName,
      operationType: '删除',
      operatorName: '当前用户',
      operateTime: new Date().toISOString(),
      description: '删除设备档案',
      changes: '删除设备档案信息'
    };
    setModifyRecords([deleteRecord, ...modifyRecords]);
    
    message.success('删除成功');
  };

  const handleArchiveSubmit = async () => {
    try {
      const values = await archiveForm.validateFields();
      // 查找油站名称的函数
      const findStationName = (stationId) => {
        const station = stationData.stations.find(s => s.id === stationId);
        return station ? station.name : '';
      };

      const formattedValues = {
        ...values,
        purchaseDate: values.purchaseDate ? values.purchaseDate.format('YYYY-MM-DD') : null,
        stationName: findStationName(values.stationId),
      };

      if (editingArchive) {
        // 编辑
        const updatedData = archiveData.map(item => 
          item.id === editingArchive.id 
            ? { 
                ...item, 
                ...formattedValues, 
                updateTime: new Date().toISOString() 
              } 
            : item
        );
        setArchiveData(updatedData);
        setFilteredData(updatedData);
        
        // 添加修改记录
        const modifyRecord = {
          id: `MR${Date.now()}`,
          equipmentId: editingArchive.id,
          equipmentCode: formattedValues.equipmentCode,
          equipmentName: formattedValues.equipmentName,
          operationType: '编辑',
          operatorName: '当前用户',
          operateTime: new Date().toISOString(),
          description: '更新设备档案信息',
          changes: '更新设备基础信息'
        };
        setModifyRecords([modifyRecord, ...modifyRecords]);
        
        message.success('更新成功');
      } else {
        // 新增
        const newRecord = {
          id: `EQ${Date.now()}`,
          ...formattedValues,
          createTime: new Date().toISOString(),
          updateTime: new Date().toISOString()
        };
        setArchiveData([newRecord, ...archiveData]);
        
        // 添加新增记录
        const addRecord = {
          id: `MR${Date.now()}`,
          equipmentId: newRecord.id,
          equipmentCode: formattedValues.equipmentCode,
          equipmentName: formattedValues.equipmentName,
          operationType: '新增',
          operatorName: '当前用户',
          operateTime: new Date().toISOString(),
          description: '新增设备档案',
          changes: '创建设备档案信息'
        };
        setModifyRecords([addRecord, ...modifyRecords]);
        
        message.success('新增成功');
      }
      
      setArchiveModalVisible(false);
      archiveForm.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // 查看修改记录详情
  const handleViewModifyRecord = (record) => {
    setCurrentModifyRecord(record);
    setModifyRecordModalVisible(true);
  };

  // 设备档案明细表格列
  const archiveColumns = [
    {
      title: '设备编号',
      dataIndex: 'equipmentCode',
      key: 'equipmentCode',
      width: 150,
      fixed: 'left',
    },
    {
      title: '设备名称',
      dataIndex: 'equipmentName',
      key: 'equipmentName',
      width: 150,
    },
    {
      title: '设备型号',
      dataIndex: 'model',
      key: 'model',
      width: 120,
    },
    {
      title: '使用性质',
      dataIndex: 'usageNature',
      key: 'usageNature',
      width: 120,
    },
    {
      title: '所属油站',
      dataIndex: 'stationName',
      key: 'stationName',
      width: 180,
    },
    {
      title: '出厂编号',
      dataIndex: 'serialNumber',
      key: 'serialNumber',
      width: 150,
    },
    {
      title: '购置时间',
      dataIndex: 'purchaseDate',
      key: 'purchaseDate',
      width: 120,
    },
    {
      title: '生产厂家',
      dataIndex: 'manufacturer',
      key: 'manufacturer',
      width: 120,
    },
    {
      title: '使用状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const color = status === '在用' ? 'green' : status === '维修中' ? 'orange' : status === '故障' ? 'red' : 'default';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: '责任人',
      dataIndex: 'responsiblePerson',
      key: 'responsiblePerson',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewArchive(record)}
            style={{ minWidth: '60px' }}
          >
            查看
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditArchive(record)}
            style={{ minWidth: '60px' }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个设备档案吗？"
            onConfirm={() => handleDeleteArchive(record)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="primary"
              size="small"
              danger
              icon={<DeleteOutlined />}
              style={{ minWidth: '60px' }}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 修改记录表格列
  const modifyRecordColumns = [
    {
      title: '设备编号',
      dataIndex: 'equipmentCode',
      key: 'equipmentCode',
      width: 150,
    },
    {
      title: '设备名称',
      dataIndex: 'equipmentName',
      key: 'equipmentName',
      width: 150,
    },
    {
      title: '操作类型',
      dataIndex: 'operationType',
      key: 'operationType',
      width: 100,
      render: (type) => {
        const color = type === '新增' ? 'green' : type === '编辑' ? 'blue' : 'red';
        return <Tag color={color}>{type}</Tag>;
      }
    },
    {
      title: '操作人',
      dataIndex: 'operatorName',
      key: 'operatorName',
      width: 120,
    },
    {
      title: '操作时间',
      dataIndex: 'operateTime',
      key: 'operateTime',
      width: 180,
      render: (time) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作描述',
      dataIndex: 'description',
      key: 'description',
      width: 200,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewModifyRecord(record)}
        >
          查看
        </Button>
      ),
    },
  ];

  return (
    <div className="equipment-archive-container">
      <Card>
        <Spin spinning={loading}>
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            size="large"
            tabBarStyle={{ marginBottom: '16px' }}
          >
            <Tabs.TabPane 
              tab="设备档案明细" 
              key="archive"
            >
              {/* 筛选和操作区域 */}
              <Card style={{ marginBottom: 16 }}>
                <Form form={filterForm}>
                  {/* 第一行：筛选条件 */}
                  <Row gutter={16} style={{ marginBottom: 16 }}>
                    <Col span={4}>
                      <Form.Item name="searchText" style={{ marginBottom: 0 }}>
                        <Input
                          placeholder="设备编号/名称"
                          prefix={<SearchOutlined />}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item name="status" style={{ marginBottom: 0 }}>
                        <Select placeholder="使用状态" allowClear>
                          <Option value="在用">在用</Option>
                          <Option value="闲置">闲置</Option>
                          <Option value="故障">故障</Option>
                          <Option value="维修中">维修中</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item name="stationId" style={{ marginBottom: 0 }}>
                        <TreeSelect
                          placeholder="所属油站"
                          allowClear
                          treeData={buildStationTreeData()}
                          style={{ width: '100%' }}
                          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item name="usageNature" style={{ marginBottom: 0 }}>
                        <Select placeholder="使用性质" allowClear>
                          <Option value="营业设备">营业设备</Option>
                          <Option value="储存设备">储存设备</Option>
                          <Option value="监控设备">监控设备</Option>
                          <Option value="应急设备">应急设备</Option>
                          <Option value="计量设备">计量设备</Option>
                          <Option value="安防设备">安防设备</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={8} style={{ textAlign: 'right' }}>
                      <Space>
                        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                          查询
                        </Button>
                        <Button icon={<ReloadOutlined />} onClick={handleReset}>
                          重置
                        </Button>
                      </Space>
                    </Col>
                  </Row>
                </Form>
                
                {/* 第二行：功能按钮 */}
                <Row gutter={16}>
                  <Col span={24}>
                    <Space>
                      <Button 
                        type="primary" 
                        icon={<ExportOutlined />}
                        onClick={handleExport}
                      >
                        导出记录
                      </Button>
                      <Button 
                        type="primary" 
                        icon={<PlusOutlined />}
                        onClick={handleAddArchive}
                      >
                        新增设备
                      </Button>
                    </Space>
                  </Col>
                </Row>
              </Card>

              {/* 设备档案表格 */}
              <Table
                columns={archiveColumns}
                dataSource={filteredData}
                rowKey="id"
                scroll={{ x: 'max-content' }}
                pagination={{
                  total: filteredData.length,
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total) => `共 ${total} 条记录`,
                }}
              />
            </Tabs.TabPane>

            <Tabs.TabPane 
              tab="修改记录" 
              key="modify"
            >
              {/* 修改记录表格 */}
              <Table
                columns={modifyRecordColumns}
                dataSource={modifyRecords}
                rowKey="id"
                scroll={{ x: 'max-content' }}
                pagination={{
                  total: modifyRecords.length,
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total) => `共 ${total} 条记录`,
                }}
              />
            </Tabs.TabPane>
          </Tabs>
        </Spin>
      </Card>

      {/* 新增/编辑设备档案弹窗 */}
      <Modal
        title={editingArchive ? "编辑设备档案" : "新增设备档案"}
        open={archiveModalVisible}
        onCancel={() => setArchiveModalVisible(false)}
        onOk={handleArchiveSubmit}
        width={800}
        okText="确定"
        cancelText="取消"
      >
        <Form
          form={archiveForm}
          layout="vertical"
          initialValues={{
            status: '在用',
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="equipmentCode"
                label="设备编号"
                rules={[{ required: true, message: '请输入设备编号' }]}
              >
                <Input placeholder="请输入设备编号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="equipmentName"
                label="设备名称"
                rules={[{ required: true, message: '请输入设备名称' }]}
              >
                <Input placeholder="请输入设备名称" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="model"
                label="设备型号"
                rules={[{ required: true, message: '请输入设备型号' }]}
              >
                <Input placeholder="请输入设备型号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="usageNature"
                label="使用性质"
                rules={[{ required: true, message: '请选择使用性质' }]}
              >
                <Select placeholder="请选择使用性质">
                  <Option value="营业设备">营业设备</Option>
                  <Option value="储存设备">储存设备</Option>
                  <Option value="监控设备">监控设备</Option>
                  <Option value="应急设备">应急设备</Option>
                  <Option value="计量设备">计量设备</Option>
                  <Option value="安防设备">安防设备</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="stationId"
                label="所属油站"
                rules={[{ required: true, message: '请选择所属油站' }]}
              >
                <TreeSelect
                  placeholder="请选择所属油站"
                  treeData={buildStationTreeData()}
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="serialNumber"
                label="出厂编号"
                rules={[{ required: true, message: '请输入出厂编号' }]}
              >
                <Input placeholder="请输入出厂编号" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="purchaseDate"
                label="购置时间"
                rules={[{ required: true, message: '请选择购置时间' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  placeholder="请选择购置时间"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="manufacturer"
                label="生产厂家"
                rules={[{ required: true, message: '请输入生产厂家' }]}
              >
                <Input placeholder="请输入生产厂家" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label="使用状态"
                rules={[{ required: true, message: '请选择使用状态' }]}
              >
                <Select placeholder="请选择使用状态">
                  <Option value="在用">在用</Option>
                  <Option value="闲置">闲置</Option>
                  <Option value="故障">故障</Option>
                  <Option value="维修中">维修中</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="responsiblePerson"
                label="责任人"
                rules={[{ required: true, message: '请输入责任人' }]}
              >
                <Input placeholder="请输入责任人" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 查看设备档案详情弹窗 */}
      <Modal
        title="设备档案详情"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={900}
      >
        {currentRecord && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="设备编号">{currentRecord.equipmentCode}</Descriptions.Item>
            <Descriptions.Item label="设备名称">{currentRecord.equipmentName}</Descriptions.Item>
            <Descriptions.Item label="设备型号">{currentRecord.model}</Descriptions.Item>
            <Descriptions.Item label="使用性质">{currentRecord.usageNature}</Descriptions.Item>
            <Descriptions.Item label="所属油站">{currentRecord.stationName}</Descriptions.Item>
            <Descriptions.Item label="出厂编号">{currentRecord.serialNumber}</Descriptions.Item>
            <Descriptions.Item label="购置时间">{currentRecord.purchaseDate}</Descriptions.Item>
            <Descriptions.Item label="生产厂家">{currentRecord.manufacturer}</Descriptions.Item>
            <Descriptions.Item label="使用状态">
              <Tag color={currentRecord.status === '在用' ? 'green' : currentRecord.status === '维修中' ? 'orange' : currentRecord.status === '故障' ? 'red' : 'default'}>
                {currentRecord.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="责任人">{currentRecord.responsiblePerson}</Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {dayjs(currentRecord.createTime).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="更新时间">
              {dayjs(currentRecord.updateTime).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* 查看修改记录详情弹窗 */}
      <Modal
        title="修改记录详情"
        open={modifyRecordModalVisible}
        onCancel={() => setModifyRecordModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModifyRecordModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={900}
      >
        {currentModifyRecord && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="设备编号">{currentModifyRecord.equipmentCode}</Descriptions.Item>
            <Descriptions.Item label="设备名称">{currentModifyRecord.equipmentName}</Descriptions.Item>
            <Descriptions.Item label="操作类型">
              <Tag color={currentModifyRecord.operationType === '新增' ? 'green' : currentModifyRecord.operationType === '编辑' ? 'blue' : 'red'}>
                {currentModifyRecord.operationType}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="操作人">{currentModifyRecord.operatorName}</Descriptions.Item>
            <Descriptions.Item label="操作时间">
              {dayjs(currentModifyRecord.operateTime).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="操作描述">{currentModifyRecord.description}</Descriptions.Item>
            <Descriptions.Item label="变更内容" span={2}>{currentModifyRecord.changes}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default EquipmentArchive; 