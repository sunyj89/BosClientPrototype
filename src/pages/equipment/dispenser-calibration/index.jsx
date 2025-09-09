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
import gunValidationData from '../../../mock/equipment/gunValidationData.json';
import stationData from '../../../mock/station/stationData.json';
import gunData from '../../../mock/station/gunData.json';
import './index.css';

const { Option } = Select;

const GunValidation = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('validation');
  
  // 校验记录状态
  const [validationData, setValidationData] = useState(gunValidationData.validationRecords);
  const [isValidationModalVisible, setIsValidationModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isGuideModalVisible, setIsGuideModalVisible] = useState(false);
  const [validationForm] = Form.useForm();
  const [editingValidation, setEditingValidation] = useState(null);
  const [viewingValidation, setViewingValidation] = useState(null);
  
  // 修改记录状态
  const [modifyRecords, setModifyRecords] = useState(gunValidationData.modifyRecords);
  const [isModifyModalVisible, setIsModifyModalVisible] = useState(false);
  const [viewingModifyRecord, setViewingModifyRecord] = useState(null);

  // 筛选条件状态
  const [filterForm] = Form.useForm();
  const [filteredData, setFilteredData] = useState(gunValidationData.validationRecords);

  // 同步数据更新
  useEffect(() => {
    setFilteredData(validationData);
  }, [validationData]);

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

  // 获取油品列表
  const getOilTypes = () => {
    const oilTypes = [...new Set(gunData.guns.map(gun => gun.oilType))];
    return oilTypes;
  };

  // 查询功能
  const handleSearch = async () => {
    try {
      const values = await filterForm.validateFields();
      let filtered = [...validationData];

      // 根据筛选条件过滤数据
      if (values.stationId) {
        filtered = filtered.filter(item => item.stationId === values.stationId);
      }
      if (values.oilType) {
        filtered = filtered.filter(item => item.oilType === values.oilType);
      }
      if (values.status) {
        filtered = filtered.filter(item => item.status === values.status);
      }
      if (values.validationNumber) {
        filtered = filtered.filter(item => 
          item.validationNumber.toLowerCase().includes(values.validationNumber.toLowerCase())
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
    setFilteredData(validationData);
    message.success('筛选条件已重置');
  };

  // 导出功能
  const handleExport = async () => {
    try {
      const values = await filterForm.validateFields();
      
      // 获取当前筛选后的数据
      const exportData = filteredData.map(item => ({
        '校验单编号': item.validationNumber,
        '加油枪编号': item.gunCode,
        '油品名称': item.oilType,
        '所属油站': item.stationName,
        '校验原因': item.validationReason,
        '标准金属量器规格容积': item.standardCapacity,
        '加油校验升数(L)': item.validationVolume,
        '量器度数(mm)': item.gaugeReading,
        '标准体积': item.standardVolume,
        '示值误差(‰)': item.indicationError,
        '平均示值误差(‰)': item.validationResult?.averageIndicationError,
        '重复性误差(‰)': item.validationResult?.repeatabilityError,
        '校验时间': item.validationDate,
        '校验人名称': item.validatorName,
        '单据状态': item.status,
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
      link.setAttribute('download', `加油机校验记录_${dayjs().format('YYYYMMDD_HHmmss')}.csv`);
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

  // 校验记录操作
  const handleAddValidation = () => {
    setEditingValidation(null);
    validationForm.resetFields();
    
    // 自动生成校验单编号
    const generateValidationNumber = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const sequence = String(validationData.length + 1).padStart(3, '0');
      return `JYJ${year}${month}${day}${sequence}`;
    };

    validationForm.setFieldsValue({
      validationNumber: generateValidationNumber()
    });
    
    setIsValidationModalVisible(true);
  };

  const handleEditValidation = (record) => {
    setEditingValidation(record);
    validationForm.setFieldsValue({
      ...record,
      validationDate: dayjs(record.validationDate),
      validationNumber: record.validationNumber
    });
    setIsValidationModalVisible(true);
  };

  const handleViewValidation = (record) => {
    setViewingValidation(record);
    setIsViewModalVisible(true);
  };

  const handleValidationSubmit = async () => {
    try {
      const values = await validationForm.validateFields();
      
      const findStationName = (stationId) => {
        const station = stationData.stations.find(s => s.id === stationId);
        return station ? station.name : '';
      };

      // 生成校验单编号
      const generateValidationNumber = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const sequence = String(validationData.length + 1).padStart(3, '0');
        return `JYJ${year}${month}${day}${sequence}`;
      };

      const formattedValues = {
        ...values,
        validationDate: values.validationDate ? values.validationDate.format('YYYY-MM-DD') : null,
        stationName: findStationName(values.stationId),
        validationNumber: editingValidation ? editingValidation.validationNumber : generateValidationNumber(),
        id: editingValidation ? editingValidation.id : `VR${String(validationData.length + 1).padStart(3, '0')}`,
        createTime: editingValidation ? editingValidation.createTime : new Date().toISOString(),
        updateTime: new Date().toISOString()
      };

      if (editingValidation) {
        const updatedData = validationData.map(item => 
          item.id === editingValidation.id ? formattedValues : item
        );
        setValidationData(updatedData);
        setFilteredData(updatedData);
        message.success('校验记录更新成功');
      } else {
        const newData = [...validationData, formattedValues];
        setValidationData(newData);
        setFilteredData(newData);
        message.success('校验记录创建成功');
      }

      setIsValidationModalVisible(false);
      validationForm.resetFields();
    } catch (error) {
      console.error('校验失败:', error);
    }
  };

  const handleDeleteValidation = (record) => {
    const newData = validationData.filter(item => item.id !== record.id);
    setValidationData(newData);
    setFilteredData(newData);
    message.success('删除成功');
  };

  // 修改记录操作
  const handleViewModifyRecord = (record) => {
    setViewingModifyRecord(record);
    setIsModifyModalVisible(true);
  };

  // 校验记录表格列定义
  const validationColumns = [
    {
      title: '校验单编号',
      dataIndex: 'validationNumber',
      key: 'validationNumber',
      width: 150,
    },
    {
      title: '加油枪编号',
      dataIndex: 'gunCode',
      key: 'gunCode',
      width: 120,
    },
    {
      title: '油品名称',
      dataIndex: 'oilType',
      key: 'oilType',
      width: 100,
    },
    {
      title: '所属油站',
      dataIndex: 'stationName',
      key: 'stationName',
      width: 180,
    },
    {
      title: '校验原因',
      dataIndex: 'validationReason',
      key: 'validationReason',
      width: 120,
    },
    {
      title: '标准金属量器规格容积',
      dataIndex: 'standardCapacity',
      key: 'standardCapacity',
      width: 150,
    },
    {
      title: '加油校验升数(L)',
      dataIndex: 'validationVolume',
      key: 'validationVolume',
      width: 120,
    },
    {
      title: '量器度数(mm)',
      dataIndex: 'gaugeReading',
      key: 'gaugeReading',
      width: 120,
    },
    {
      title: '标准体积',
      dataIndex: 'standardVolume',
      key: 'standardVolume',
      width: 100,
    },
    {
      title: '示值误差(‰)',
      dataIndex: 'indicationError',
      key: 'indicationError',
      width: 120,
    },
    {
      title: '平均示值误差(‰)',
      dataIndex: ['validationResult', 'averageIndicationError'],
      key: 'averageIndicationError',
      width: 140,
    },
    {
      title: '重复性误差(‰)',
      dataIndex: ['validationResult', 'repeatabilityError'],
      key: 'repeatabilityError',
      width: 130,
    },
    {
      title: '校验时间',
      dataIndex: 'validationDate',
      key: 'validationDate',
      width: 120,
    },
    {
      title: '校验人名称',
      dataIndex: 'validatorName',
      key: 'validatorName',
      width: 120,
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
            onClick={() => handleViewValidation(record)}
          >
            查看
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditValidation(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这条校验记录吗？"
            onConfirm={() => handleDeleteValidation(record)}
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
      title: '校验单编号',
      dataIndex: 'validationNumber',
      key: 'validationNumber',
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
    <div className="gun-validation-container">
      <Card>
        <Spin spinning={loading}>
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            size="large"
            tabBarStyle={{ marginBottom: '16px' }}
          >
            <Tabs.TabPane 
              tab="加油机校验记录明细" 
              key="validation"
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
                      <Form.Item name="oilType" style={{ marginBottom: 0 }}>
                        <Select placeholder="油品名称" allowClear>
                          {getOilTypes().map(oilType => (
                            <Option key={oilType} value={oilType}>{oilType}</Option>
                          ))}
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
                      <Form.Item name="validationNumber" style={{ marginBottom: 0 }}>
                        <Input
                          placeholder="校验单编号"
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
                        onClick={handleAddValidation}
                      >
                        新增校验记录
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

              {/* 校验记录表格 */}
              <Table
                columns={validationColumns}
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

      {/* 校验记录新增/编辑弹窗 */}
      <Modal
        title={editingValidation ? "编辑校验记录" : "新增校验记录"}
        open={isValidationModalVisible}
        onOk={handleValidationSubmit}
        onCancel={() => setIsValidationModalVisible(false)}
        width={800}
        destroyOnClose
      >
        <Form
          form={validationForm}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="校验单编号"
                name="validationNumber"
                rules={[{ required: true, message: '校验单编号不能为空' }]}
              >
                <Input placeholder="系统自动生成" disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="加油枪编号"
                name="gunCode"
                rules={[{ required: true, message: '请输入加油枪编号' }]}
              >
                <Input placeholder="请输入加油枪编号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="油品名称"
                name="oilType"
                rules={[{ required: true, message: '请选择油品名称' }]}
              >
                <Select placeholder="请选择油品名称">
                  {getOilTypes().map(oilType => (
                    <Option key={oilType} value={oilType}>{oilType}</Option>
                  ))}
                </Select>
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
                label="校验原因"
                name="validationReason"
                rules={[{ required: true, message: '请输入校验原因' }]}
              >
                <Select placeholder="请选择校验原因">
                  <Option value="定期校验">定期校验</Option>
                  <Option value="故障后校验">故障后校验</Option>
                  <Option value="计量异常">计量异常</Option>
                  <Option value="设备维修">设备维修</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="标准金属量器规格容积"
                name="standardCapacity"
                rules={[{ required: true, message: '请输入标准容积' }]}
              >
                <Input placeholder="如：20L" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="加油校验升数(L)"
                name="validationVolume"
                rules={[{ required: true, message: '请输入校验升数' }]}
              >
                <InputNumber
                  placeholder="请输入校验升数"
                  style={{ width: '100%' }}
                  precision={3}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="量器度数(mm)"
                name="gaugeReading"
                rules={[{ required: true, message: '请输入量器度数' }]}
              >
                <InputNumber
                  placeholder="请输入量器度数"
                  style={{ width: '100%' }}
                  precision={1}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="标准体积"
                name="standardVolume"
                rules={[{ required: true, message: '请输入标准体积' }]}
              >
                <InputNumber
                  placeholder="请输入标准体积"
                  style={{ width: '100%' }}
                  precision={3}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="示值误差(‰)"
                name="indicationError"
                rules={[{ required: true, message: '请输入示值误差' }]}
              >
                <InputNumber
                  placeholder="请输入示值误差"
                  style={{ width: '100%' }}
                  precision={1}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="校验时间"
                name="validationDate"
                rules={[{ required: true, message: '请选择校验时间' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="平均示值误差(‰)"
                name={['validationResult', 'averageIndicationError']}
                rules={[{ required: true, message: '请输入平均示值误差' }]}
              >
                <InputNumber
                  placeholder="请输入平均示值误差"
                  style={{ width: '100%' }}
                  precision={1}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="重复性误差(‰)"
                name={['validationResult', 'repeatabilityError']}
                rules={[{ required: true, message: '请输入重复性误差' }]}
              >
                <InputNumber
                  placeholder="请输入重复性误差"
                  style={{ width: '100%' }}
                  precision={1}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="校验人名称"
                name="validatorName"
                rules={[{ required: true, message: '请输入校验人名称' }]}
              >
                <Input placeholder="请输入校验人名称" />
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

      {/* 校验记录查看弹窗 */}
      <Modal
        title="校验记录详情"
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={900}
      >
        {viewingValidation && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="校验单编号">{viewingValidation.validationNumber}</Descriptions.Item>
            <Descriptions.Item label="加油枪编号">{viewingValidation.gunCode}</Descriptions.Item>
            <Descriptions.Item label="油品名称">{viewingValidation.oilType}</Descriptions.Item>
            <Descriptions.Item label="所属油站">{viewingValidation.stationName}</Descriptions.Item>
            <Descriptions.Item label="校验原因">{viewingValidation.validationReason}</Descriptions.Item>
            <Descriptions.Item label="标准金属量器规格容积">{viewingValidation.standardCapacity}</Descriptions.Item>
            <Descriptions.Item label="加油校验升数(L)">{viewingValidation.validationVolume}</Descriptions.Item>
            <Descriptions.Item label="量器度数(mm)">{viewingValidation.gaugeReading}</Descriptions.Item>
            <Descriptions.Item label="标准体积">{viewingValidation.standardVolume}</Descriptions.Item>
            <Descriptions.Item label="示值误差(‰)">{viewingValidation.indicationError}</Descriptions.Item>
            <Descriptions.Item label="平均示值误差(‰)">{viewingValidation.validationResult?.averageIndicationError}</Descriptions.Item>
            <Descriptions.Item label="重复性误差(‰)">{viewingValidation.validationResult?.repeatabilityError}</Descriptions.Item>
            <Descriptions.Item label="校验时间">{viewingValidation.validationDate}</Descriptions.Item>
            <Descriptions.Item label="校验人名称">{viewingValidation.validatorName}</Descriptions.Item>
            <Descriptions.Item label="单据状态">
              <Tag color={viewingValidation.status === '已审批' ? 'green' : viewingValidation.status === '待审批' ? 'orange' : 'default'}>
                {viewingValidation.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">{dayjs(viewingValidation.createTime).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
            {viewingValidation.approvalComment && (
              <Descriptions.Item label="处理意见" span={2}>{viewingValidation.approvalComment}</Descriptions.Item>
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
            <Descriptions.Item label="校验单编号">{viewingModifyRecord.validationNumber}</Descriptions.Item>
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
        width={800}
      >
        <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
          <Alert
            message="加油机校验记录填写规范"
            description="请严格按照以下规范填写加油机校验记录"
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
          <ol style={{ paddingLeft: 20 }}>
            <li><strong>本记录反映加油站加油机校验的情况</strong>，由加油站计量管理人员填写，校验人和分公司分管经理签字确认。</li>
            <li><strong>日期</strong>：按照实际校验时间填写。</li>
            <li><strong>加油枪编号和油品名称</strong>：按实填写。</li>
            <li><strong>校验原因</strong>：填写自检或强检。</li>
            <li><strong>标准金属量器规格容积</strong>：校机使用标准金属量器的规格容积。</li>
            <li><strong>加油机校验升数</strong>：加油机校验的付油升数。</li>
            <li><strong>标准金属量器读数</strong>：填写油品在标准金属量器的高度读数，保留两位小数。</li>
            <li><strong>标准体积</strong>：标准体积=标准金属量器规格容积+(标准金属量器读数一标准金属量器规格容积时高度）X分度量1000，结果保留三位小数。</li>
            <li><strong>示值误差</strong>：示值误差=（加油机校验升数一标准体积）标准体积X1000，保留一位小数。</li>
            <li><strong>校验结果</strong>：
              <ul style={{ marginTop: 8, marginBottom: 8 }}>
                <li>平均示值误差=多次示值误差之和除以校验次数，结果保留一位小数，平均示值误差在士3%。之内，加油机示值误差合格。</li>
                <li>重复性误差=多次示值误差中最大值一示值误差中最小值，重复性误差小于或等于1.5%0，加油机重复性误差合格。</li>
              </ul>
            </li>
            <li><strong>处理意见</strong>：填写对校验不合格加油机的处理意见。</li>
            <li><strong>要求加油站每月至少要进行一次自校</strong></li>
          </ol>
        </div>
      </Modal>
    </div>
  );
};

export default GunValidation; 