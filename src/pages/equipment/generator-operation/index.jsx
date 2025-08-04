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
  Spin,
  InputNumber,
  Alert
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  SearchOutlined,
  ReloadOutlined,
  ExportOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import generatorOperationData from '../../../mock/equipment/generatorOperationData.json';
import stationData from '../../../mock/station/stationData.json';
import './index.css';

const { Option } = Select;
const { RangePicker } = DatePicker;

const GeneratorOperation = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('operation');
  
  // 运行记录状态
  const [operationData, setOperationData] = useState(generatorOperationData.operationRecords);
  const [isOperationModalVisible, setIsOperationModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isGuideModalVisible, setIsGuideModalVisible] = useState(false);
  const [operationForm] = Form.useForm();
  const [editingOperation, setEditingOperation] = useState(null);
  const [viewingOperation, setViewingOperation] = useState(null);
  
  // 修改记录状态
  const [modifyRecords, setModifyRecords] = useState(generatorOperationData.modifyRecords);
  const [isModifyModalVisible, setIsModifyModalVisible] = useState(false);
  const [viewingModifyRecord, setViewingModifyRecord] = useState(null);

  // 筛选条件状态
  const [filterForm] = Form.useForm();
  const [filteredData, setFilteredData] = useState(generatorOperationData.operationRecords);

  // 同步数据更新
  useEffect(() => {
    setFilteredData(operationData);
  }, [operationData]);

  // 构建油站树状结构数据
  const buildStationTreeData = () => {
    const treeData = [];
    
    stationData.branches.forEach(branch => {
      const branchNode = {
        title: branch.name,
        value: `branch_${branch.id}`,
        key: `branch_${branch.id}`,
        selectable: false,
        children: []
      };
      
      const serviceAreas = stationData.serviceAreas.filter(sa => sa.branchId === branch.id);
      
      serviceAreas.forEach(serviceArea => {
        const serviceAreaNode = {
          title: serviceArea.name,
          value: `area_${serviceArea.id}`,
          key: `area_${serviceArea.id}`,
          selectable: false,
          children: []
        };
        
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

  // 查询功能
  const handleSearch = async () => {
    try {
      const values = await filterForm.validateFields();
      let filtered = [...operationData];

      // 根据筛选条件过滤数据
      if (values.stationId) {
        filtered = filtered.filter(item => item.stationId === values.stationId);
      }
      if (values.operationReason) {
        filtered = filtered.filter(item => item.operationReason === values.operationReason);
      }
      if (values.status) {
        filtered = filtered.filter(item => item.status === values.status);
      }
      if (values.recordNumber) {
        filtered = filtered.filter(item => 
          item.recordNumber.toLowerCase().includes(values.recordNumber.toLowerCase())
        );
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
    setFilteredData(operationData);
    message.success('筛选条件已重置');
  };

  // 导出功能
  const handleExport = async () => {
    try {
      const values = await filterForm.validateFields();
      
      // 获取当前筛选后的数据
      const exportData = filteredData.map(item => ({
        '记录单编号': item.recordNumber,
        '所属油站': item.stationName,
        '运行原因': item.operationReason,
        '运行开始时间': dayjs(item.startTime).format('YYYY-MM-DD HH:mm'),
        '运行结束时间': dayjs(item.endTime).format('YYYY-MM-DD HH:mm'),
        '运行情况': item.operationStatus,
        '本次加油量(L)': item.fuelConsumption,
        '保养后累计运行时间': item.maintenanceAccumulatedTime,
        '单据状态': item.status,
        '创建人': item.creator,
        '站长姓名': item.stationManager,
        '备注': item.remark,
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
      link.setAttribute('download', `发电机运行记录_${dayjs().format('YYYYMMDD_HHmmss')}.csv`);
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

  // 运行记录操作
  const handleAddOperation = () => {
    setEditingOperation(null);
    operationForm.resetFields();
    
    // 自动生成记录单编号
    const generateRecordNumber = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const sequence = String(operationData.length + 1).padStart(3, '0');
      return `FDJ${year}${month}${day}${sequence}`;
    };

    operationForm.setFieldsValue({
      recordNumber: generateRecordNumber()
    });
    
    setIsOperationModalVisible(true);
  };

  const handleEditOperation = (record) => {
    setEditingOperation(record);
    operationForm.setFieldsValue({
      ...record,
      startTime: dayjs(record.startTime),
      endTime: dayjs(record.endTime),
      recordNumber: record.recordNumber
    });
    setIsOperationModalVisible(true);
  };

  const handleViewOperation = (record) => {
    setViewingOperation(record);
    setIsViewModalVisible(true);
  };

  const handleOperationSubmit = async () => {
    try {
      const values = await operationForm.validateFields();
      
      const findStationName = (stationId) => {
        const station = stationData.stations.find(s => s.id === stationId);
        return station ? station.name : '';
      };

      const formattedValues = {
        ...values,
        startTime: values.startTime ? values.startTime.toISOString() : null,
        endTime: values.endTime ? values.endTime.toISOString() : null,
        stationName: findStationName(values.stationId),
        id: editingOperation ? editingOperation.id : `GR${String(operationData.length + 1).padStart(3, '0')}`,
        createTime: editingOperation ? editingOperation.createTime : new Date().toISOString(),
        updateTime: new Date().toISOString()
      };

      if (editingOperation) {
        const updatedData = operationData.map(item => 
          item.id === editingOperation.id ? formattedValues : item
        );
        setOperationData(updatedData);
        setFilteredData(updatedData);
        message.success('运行记录更新成功');
      } else {
        const newData = [...operationData, formattedValues];
        setOperationData(newData);
        setFilteredData(newData);
        message.success('运行记录创建成功');
      }

      setIsOperationModalVisible(false);
      operationForm.resetFields();
    } catch (error) {
      console.error('提交失败:', error);
    }
  };

  const handleDeleteOperation = (record) => {
    const newData = operationData.filter(item => item.id !== record.id);
    setOperationData(newData);
    setFilteredData(newData);
    message.success('删除成功');
  };

  // 修改记录操作
  const handleViewModifyRecord = (record) => {
    setViewingModifyRecord(record);
    setIsModifyModalVisible(true);
  };

  // 运行记录表格列定义
  const operationColumns = [
    {
      title: '记录单编号',
      dataIndex: 'recordNumber',
      key: 'recordNumber',
      width: 150,
    },
    {
      title: '所属油站',
      dataIndex: 'stationName',
      key: 'stationName',
      width: 180,
    },
    {
      title: '运行原因',
      dataIndex: 'operationReason',
      key: 'operationReason',
      width: 120,
    },
    {
      title: '运行开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 150,
      render: (time) => dayjs(time).format('YYYY-MM-DD HH:mm')
    },
    {
      title: '运行结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
      width: 150,
      render: (time) => dayjs(time).format('YYYY-MM-DD HH:mm')
    },
    {
      title: '运行情况',
      dataIndex: 'operationStatus',
      key: 'operationStatus',
      width: 120,
    },
    {
      title: '本次加油量(L)',
      dataIndex: 'fuelConsumption',
      key: 'fuelConsumption',
      width: 130,
    },
    {
      title: '保养后累计运行时间',
      dataIndex: 'maintenanceAccumulatedTime',
      key: 'maintenanceAccumulatedTime',
      width: 150,
    },
    {
      title: '单据状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const colors = {
          '草稿': 'default',
          '待审批': 'orange',
          '已审批': 'green'
        };
        return <Tag color={colors[status]}>{status}</Tag>;
      }
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
      width: 100,
    },
    {
      title: '站长姓名',
      dataIndex: 'stationManager',
      key: 'stationManager',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      render: (time) => dayjs(time).format('YYYY-MM-DD HH:mm:ss')
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
            onClick={() => handleViewOperation(record)}
          >
            查看
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditOperation(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这条运行记录吗？"
            onConfirm={() => handleDeleteOperation(record)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="primary"
              size="small"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 修改记录表格列定义
  const modifyRecordColumns = [
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
      render: (type) => {
        const colors = {
          '新增': 'green',
          '编辑': 'blue',
          '删除': 'red'
        };
        return <Tag color={colors[type]}>{type}</Tag>;
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
      render: (time) => dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '审批状态',
      dataIndex: 'approvalStatus',
      key: 'approvalStatus',
      width: 120,
      render: (status) => {
        const colors = {
          '已审批': 'green',
          '审批中': 'orange',
          '已驳回': 'red'
        };
        return <Tag color={colors[status]}>{status}</Tag>;
      }
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
    <div className="generator-operation-container">
      <Card>
        <Spin spinning={loading}>
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            size="large"
            tabBarStyle={{ marginBottom: '16px' }}
          >
            <Tabs.TabPane 
              tab="发电机运行记录明细" 
              key="operation"
            >
              {/* 筛选和操作区域 */}
              <Card style={{ marginBottom: 16 }}>
                <Form form={filterForm}>
                  {/* 第一行：筛选条件 */}
                  <Row gutter={16} style={{ marginBottom: 16 }}>
                    <Col span={4}>
                      <Form.Item name="stationId" style={{ marginBottom: 0 }}>
                        <TreeSelect
                          placeholder="油站筛选"
                          allowClear
                          treeData={buildStationTreeData()}
                          style={{ width: '100%' }}
                          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item name="operationReason" style={{ marginBottom: 0 }}>
                        <Select placeholder="运行原因" allowClear>
                          <Option value="周保养">周保养</Option>
                          <Option value="发电">发电</Option>
                          <Option value="维修">维修</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item name="status" style={{ marginBottom: 0 }}>
                        <Select placeholder="单据状态" allowClear>
                          <Option value="草稿">草稿</Option>
                          <Option value="待审批">待审批</Option>
                          <Option value="已审批">已审批</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item name="recordNumber" style={{ marginBottom: 0 }}>
                        <Input
                          placeholder="记录单编号"
                          prefix={<SearchOutlined />}
                        />
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
                        onClick={handleAddOperation}
                      >
                        新增运行记录
                      </Button>
                      <Button 
                        icon={<QuestionCircleOutlined />}
                        onClick={() => setIsGuideModalVisible(true)}
                      >
                        填写指引
                      </Button>
                    </Space>
                  </Col>
                </Row>
              </Card>

              {/* 运行记录表格 */}
              <Table
                columns={operationColumns}
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

      {/* 运行记录新增/编辑弹窗 */}
      <Modal
        title={editingOperation ? "编辑运行记录" : "新增运行记录"}
        open={isOperationModalVisible}
        onOk={handleOperationSubmit}
        onCancel={() => setIsOperationModalVisible(false)}
        width={800}
        destroyOnClose
      >
        <Form
          form={operationForm}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="记录单编号"
                name="recordNumber"
                rules={[{ required: true, message: '记录单编号不能为空' }]}
              >
                <Input placeholder="系统自动生成" disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="所属油站"
                name="stationId"
                rules={[{ required: true, message: '请选择所属油站' }]}
              >
                <TreeSelect
                  placeholder="请选择所属油站"
                  treeData={buildStationTreeData()}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="运行原因"
                name="operationReason"
                rules={[{ required: true, message: '请选择运行原因' }]}
              >
                <Select placeholder="请选择运行原因">
                  <Option value="周保养">周保养</Option>
                  <Option value="发电">发电</Option>
                  <Option value="维修">维修</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="运行开始时间"
                name="startTime"
                rules={[{ required: true, message: '请选择运行开始时间' }]}
              >
                <DatePicker 
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  style={{ width: '100%' }}
                  placeholder="请选择开始时间"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="运行结束时间"
                name="endTime"
                rules={[{ required: true, message: '请选择运行结束时间' }]}
              >
                <DatePicker 
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  style={{ width: '100%' }}
                  placeholder="请选择结束时间"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="运行情况"
                name="operationStatus"
                rules={[{ required: true, message: '请输入运行情况' }]}
              >
                <Select placeholder="请选择运行情况">
                  <Option value="正常运行">正常运行</Option>
                  <Option value="应急发电">应急发电</Option>
                  <Option value="维修测试">维修测试</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="本次加油量(L)"
                name="fuelConsumption"
                rules={[{ required: true, message: '请输入本次加油量' }]}
              >
                <InputNumber
                  placeholder="请输入加油量"
                  style={{ width: '100%' }}
                  precision={1}
                  min={0}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="保养后累计运行时间"
                name="maintenanceAccumulatedTime"
                rules={[{ required: true, message: '请输入累计运行时间' }]}
              >
                <InputNumber
                  placeholder="请输入累计运行时间"
                  style={{ width: '100%' }}
                  precision={1}
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="单据状态"
                name="status"
                rules={[{ required: true, message: '请选择单据状态' }]}
              >
                <Select placeholder="请选择单据状态">
                  <Option value="草稿">草稿</Option>
                  <Option value="待审批">待审批</Option>
                  <Option value="已审批">已审批</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="创建人"
                name="creator"
                rules={[{ required: true, message: '请输入创建人' }]}
              >
                <Input placeholder="请输入创建人" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="站长姓名"
                name="stationManager"
                rules={[{ required: true, message: '请输入站长姓名' }]}
              >
                <Input placeholder="请输入站长姓名" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="备注"
            name="remark"
          >
            <Input.TextArea 
              placeholder="请输入备注（可选）" 
              rows={3}
            />
          </Form.Item>
          <Form.Item
            label="处理意见"
            name="approvalComment"
          >
            <Input.TextArea 
              placeholder="请输入处理意见（可选）" 
              rows={3}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 运行记录查看弹窗 */}
      <Modal
        title="运行记录详情"
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={900}
      >
        {viewingOperation && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="记录单编号">{viewingOperation.recordNumber}</Descriptions.Item>
            <Descriptions.Item label="所属油站">{viewingOperation.stationName}</Descriptions.Item>
            <Descriptions.Item label="运行原因">{viewingOperation.operationReason}</Descriptions.Item>
            <Descriptions.Item label="运行开始时间">{dayjs(viewingOperation.startTime).format('YYYY-MM-DD HH:mm')}</Descriptions.Item>
            <Descriptions.Item label="运行结束时间">{dayjs(viewingOperation.endTime).format('YYYY-MM-DD HH:mm')}</Descriptions.Item>
            <Descriptions.Item label="运行情况">{viewingOperation.operationStatus}</Descriptions.Item>
            <Descriptions.Item label="本次加油量(L)">{viewingOperation.fuelConsumption}</Descriptions.Item>
            <Descriptions.Item label="保养后累计运行时间">{viewingOperation.maintenanceAccumulatedTime}</Descriptions.Item>
            <Descriptions.Item label="单据状态">
              <Tag color={viewingOperation.status === '已审批' ? 'green' : viewingOperation.status === '待审批' ? 'orange' : 'default'}>
                {viewingOperation.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="创建人">{viewingOperation.creator}</Descriptions.Item>
            <Descriptions.Item label="站长姓名">{viewingOperation.stationManager}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{dayjs(viewingOperation.createTime).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
            {viewingOperation.remark && (
              <Descriptions.Item label="备注" span={2}>{viewingOperation.remark}</Descriptions.Item>
            )}
            {viewingOperation.approvalComment && (
              <Descriptions.Item label="处理意见" span={2}>{viewingOperation.approvalComment}</Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      {/* 修改记录查看弹窗 */}
      <Modal
        title="修改记录详情"
        open={isModifyModalVisible}
        onCancel={() => setIsModifyModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModifyModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={900}
      >
        {viewingModifyRecord && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="记录单编号">{viewingModifyRecord.recordNumber}</Descriptions.Item>
            <Descriptions.Item label="操作类型">
              <Tag color={viewingModifyRecord.operationType === '新增' ? 'green' : viewingModifyRecord.operationType === '编辑' ? 'blue' : 'red'}>
                {viewingModifyRecord.operationType}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="操作人">{viewingModifyRecord.operatorName}</Descriptions.Item>
            <Descriptions.Item label="操作时间">{dayjs(viewingModifyRecord.operateTime).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
            <Descriptions.Item label="操作描述" span={2}>{viewingModifyRecord.description}</Descriptions.Item>
            <Descriptions.Item label="变更内容" span={2}>{viewingModifyRecord.changes}</Descriptions.Item>
            <Descriptions.Item label="审批状态">
              <Tag color={viewingModifyRecord.approvalStatus === '已审批' ? 'green' : viewingModifyRecord.approvalStatus === '审批中' ? 'orange' : 'red'}>
                {viewingModifyRecord.approvalStatus}
              </Tag>
            </Descriptions.Item>
            {viewingModifyRecord.approver && (
              <Descriptions.Item label="审批人">{viewingModifyRecord.approver}</Descriptions.Item>
            )}
            {viewingModifyRecord.approvalTime && (
              <Descriptions.Item label="审批时间">{dayjs(viewingModifyRecord.approvalTime).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
            )}
            {viewingModifyRecord.approvalRemark && (
              <Descriptions.Item label="审批备注" span={2}>{viewingModifyRecord.approvalRemark}</Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      {/* 填写指引弹窗 */}
      <Modal
        title="填写指引"
        open={isGuideModalVisible}
        onCancel={() => setIsGuideModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsGuideModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={600}
      >
        <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
          <Alert
            message="发电机运行记录填写规范"
            description="请严格按照以下规范填写发电机运行记录"
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
          <ol style={{ paddingLeft: 20 }}>
            <li><strong>本记录反映加油站发电机的运行情况</strong>，由加油站发电机设备管理管理责任人创建和填写。</li>
            <li><strong>日期</strong>：发电机实际运行的当天。</li>
            <li><strong>运行原因</strong>：主要填制周保养、发电、维修等运行原因。</li>
            <li><strong>运行起止时间</strong>：填制发电机启动运行到停止运行的具体时间，精确到分钟。</li>
            <li><strong>运行情况</strong>：填制发电机运行期间的状况。</li>
            <li><strong>本次加油量(L)</strong>：填制本次运行给发电机实际加油量。</li>
          </ol>
        </div>
      </Modal>
    </div>
  );
};

export default GeneratorOperation; 