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
  InputNumber,
  DatePicker,
  Descriptions,
  Row,
  Col,
  Divider,
  Card
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  PlusOutlined, 
  EditOutlined, 
  EyeOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import mockData from '../../../../mock/oil/oil-price.json';
import oilMasterData from '../../../../mock/oil/master-data.json';
import stationData from '../../../../mock/station/stationData.json';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

const OilPriceAdjustment = ({ setLoading }) => {
  const [form] = Form.useForm();
  const [modalForm] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [modalType, setModalType] = useState('create'); // create, edit, view
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [stationTreeData, setStationTreeData] = useState([]);
  const [oilOptions, setOilOptions] = useState([]);
  const [selectedStations, setSelectedStations] = useState([]);
  const [selectedOils, setSelectedOils] = useState([]);
  const [ndrcPrices, setNdrcPrices] = useState([]);
  const [priceAdjustments, setPriceAdjustments] = useState([]);

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

    // 设置油品选项
    setOilOptions(oilMasterData.oilList);
  };

  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      // 加载调价单历史数据
      setDataSource(mockData.priceAdjustmentOrders || []);
      setLoading(false);
    }, 800);
  };

  // 处理省份变化，加载发改委价格
  const handleProvinceChange = (province) => {
    if (province) {
      // 只加载江西省的发改委价格
      const provincePrices = mockData.ndrcPriceList.filter(item => 
        item.province === province
      );
      setNdrcPrices(provincePrices);
      message.success(`已加载${province}省最新发改委价格`);
    } else {
      setNdrcPrices([]);
    }
  };

  // 生成价格调整表格数据 - 选择站点后自动列出所有油品
  const generatePriceAdjustments = () => {
    const adjustments = [];
    
    selectedStations.forEach(stationId => {
      // 获取该油站所有有效的油品价格
      const stationPrices = mockData.oilPriceList.filter(
        item => item.stationId === stationId &&
                item.approvalStatus === '审批通过' && 
                item.priceStatus === '生效'
      );
      
      stationPrices.forEach(priceRecord => {
        const station = stationData.stations.find(s => s.id === stationId);
        const oil = oilOptions.find(o => o.code === priceRecord.oilCode);
        
        if (station && oil) {
          adjustments.push({
            key: `${stationId}-${priceRecord.oilCode}`,
            stationId,
            stationName: station.name,
            oilCode: priceRecord.oilCode,
            oilName: oil.name,
            currentPrice: priceRecord.listPrice,
            newPrice: priceRecord.listPrice // 默认为当前价格
          });
        }
      });
    });
    
    setPriceAdjustments(adjustments);
  };

  // 按油品分组的价格设置
  const handleOilPriceChange = (oilCode, newPrice) => {
    const updatedAdjustments = priceAdjustments.map(item =>
      item.oilCode === oilCode ? { ...item, newPrice } : item
    );
    setPriceAdjustments(updatedAdjustments);
  };

  // 获取按油品分组的数据
  const getOilGroupedData = () => {
    if (!priceAdjustments || priceAdjustments.length === 0) {
      return [];
    }
    
    const grouped = {};
    priceAdjustments.forEach(item => {
      if (!item || !item.oilCode) return; // 安全检查
      
      if (!grouped[item.oilCode]) {
        grouped[item.oilCode] = {
          oilCode: item.oilCode,
          oilName: item.oilName || '',
          stations: [],
          suggestedPrice: item.currentPrice || 0 // 建议价格为第一个当前价格
        };
      }
      grouped[item.oilCode].stations.push({
        stationId: item.stationId || '',
        stationName: item.stationName || '',
        currentPrice: item.currentPrice || 0
      });
    });
    return Object.values(grouped);
  };

  // 处理油站选择变化 - 选择站点后自动生成所有油品价格
  const handleStationChange = (stations) => {
    setSelectedStations(stations);
    if (stations && stations.length > 0) {
      // 延迟生成，避免过于频繁的更新
      setTimeout(generatePriceAdjustments, 100);
    } else {
      setPriceAdjustments([]);
    }
  };

  // 更新单个价格调整的新价格
  const handlePriceChange = (key, newPrice) => {
    const updatedAdjustments = priceAdjustments.map(item =>
      item.key === key ? { ...item, newPrice } : item
    );
    setPriceAdjustments(updatedAdjustments);
  };

  // 生成12位调价单ID（字母+数字）
  const generateAdjustmentId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'PA'; // Price Adjustment前缀
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleSearch = (values) => {
    setLoading(true);
    setTimeout(() => {
      let filteredData = [...(mockData.priceAdjustmentOrders || [])];
      
      if (values.adjustmentId) {
        filteredData = filteredData.filter(item => 
          item.adjustmentId.includes(values.adjustmentId)
        );
      }
      
      if (values.status) {
        filteredData = filteredData.filter(item => 
          item.status === values.status
        );
      }
      
      if (values.operator) {
        filteredData = filteredData.filter(item => 
          item.operator.includes(values.operator)
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

  const handleCreate = () => {
    setModalType('create');
    setSelectedRecord(null);
    setIsModalVisible(true);
    setSelectedStations([]);
    setSelectedOils([]);
    setNdrcPrices([]);
    setPriceAdjustments([]);
    modalForm.resetFields();
  };

  const handleEdit = (record) => {
    setModalType('edit');
    setSelectedRecord(record);
    setIsModalVisible(true);
    
    // 设置表单初始值
    modalForm.setFieldsValue({
      adjustmentName: record.adjustmentName,
      adjustmentType: record.adjustmentType,
      adjustmentReason: record.adjustmentReason,
      effectiveTime: record.effectiveTime ? moment(record.effectiveTime) : null
    });
    
    // 设置价格调整数据
    if (record.priceAdjustments && record.priceAdjustments.length > 0) {
      setPriceAdjustments(record.priceAdjustments);
      // 从价格调整数据中提取站点ID
      const stationIds = [...new Set(record.priceAdjustments.map(item => item.stationId))];
      setSelectedStations(stationIds);
      modalForm.setFieldsValue({
        stationIds: stationIds
      });
    }
  };

  const handleView = (record) => {
    setSelectedRecord(record);
    setIsViewModalVisible(true);
  };

  const handleDelete = (record) => {
    if (record.status === '审批中') {
      message.warning('审批中的调价单不能删除');
      return;
    }
    
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除调价单 ${record.adjustmentId} 吗？`,
      onOk() {
        setLoading(true);
        setTimeout(() => {
          const updatedData = dataSource.filter(item => item.id !== record.id);
          setDataSource(updatedData);
          message.success('删除成功');
          setLoading(false);
        }, 500);
      }
    });
  };

  // 处理表单提交（保存或提交审核）
  const handleModalSubmit = (submitType) => {
    modalForm.validateFields().then(values => {
      // 验证是否有价格调整数据
      if (priceAdjustments.length === 0) {
        message.error('请先选择调价站点');
        return;
      }
      
      setLoading(true);
      setTimeout(() => {
        const formattedValues = {
          ...values,
          effectiveTime: values.effectiveTime ? values.effectiveTime.format('YYYY-MM-DD HH:mm:ss') : null
        };

        if (modalType === 'create') {
          const newRecord = {
            ...formattedValues,
            id: `ADJ${Date.now()}`,
            adjustmentId: generateAdjustmentId(),
            createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            operator: '当前用户',
            status: submitType === 'submit' ? '审批中' : '待提交',
            priceAdjustments: priceAdjustments // 保存价格调整详情
          };
          
          setDataSource([newRecord, ...dataSource]);
          message.success(submitType === 'submit' ? '调价单已提交审核' : '调价单保存成功');
        } else if (modalType === 'edit') {
          const updatedData = dataSource.map(item => 
            item.id === selectedRecord.id 
              ? { 
                  ...item, 
                  ...formattedValues, 
                  updateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                  priceAdjustments: priceAdjustments
                }
              : item
          );
          setDataSource(updatedData);
          message.success('调价单修改成功');
        }
        setIsModalVisible(false);
        setLoading(false);
      }, 800);
    }).catch(error => {
      console.error('表单验证失败:', error);
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleViewModalClose = () => {
    setIsViewModalVisible(false);
    setSelectedRecord(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case '待提交':
        return 'blue';
      case '审批中':
        return 'orange';
      case '审批通过':
        return 'green';
      case '被驳回':
        return 'red';
      case '已执行':
        return 'purple';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: '调价单号',
      dataIndex: 'adjustmentId',
      key: 'adjustmentId',
      width: 150,
      fixed: 'left'
    },
    {
      title: '调价单名称',
      dataIndex: 'adjustmentName',
      key: 'adjustmentName',
      width: 180
    },
    {
      title: '调价方式',
      dataIndex: 'adjustmentType',
      key: 'adjustmentType',
      width: 100
    },
    {
      title: '调价原因',
      dataIndex: 'adjustmentReason',
      key: 'adjustmentReason',
      width: 200
    },

    {
      title: '预计生效时间',
      dataIndex: 'effectiveTime',
      key: 'effectiveTime',
      width: 160
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
      width: 100
    },
    {
      title: '操作',
      key: 'action',
      width: 240,
      fixed: 'right',
      render: (_, record) => {
        const { status } = record;
        return (
          <Space size="small">
            <Button
              type="primary"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            >
              查看
            </Button>
            {/* 待提交：可编辑、可删除 */}
            {status === '待提交' && (
              <>
                <Button
                  type="primary"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(record)}
                >
                  编辑
                </Button>
                <Button
                  type="primary"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(record)}
                >
                  删除
                </Button>
              </>
            )}
            {/* 被驳回：可编辑，不可删除 */}
            {status === '被驳回' && (
              <Button
                type="primary"
                size="small"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
              >
                编辑
              </Button>
            )}
            {/* 审批中、审批通过：只能查看 */}
          </Space>
        );
      }
    }
  ];

  const ndrcColumns = [
    {
      title: '油品名称',
      dataIndex: 'oilName',
      key: 'oilName',
      width: 150
    },
    {
      title: '当前价格(元/升)',
      dataIndex: 'currentPrice',
      key: 'currentPrice',
      width: 130,
      align: 'right',
      render: (price) => `¥${price.toFixed(2)}`
    },
    {
      title: '生效时间',
      dataIndex: 'effectiveTime',
      key: 'effectiveTime',
      width: 160
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === '生效' ? 'green' : 'orange'}>{status}</Tag>
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
        <Form.Item name="adjustmentId" label="调价单号">
          <Input
            placeholder="请输入调价单号"
            style={{ width: 150 }}
            allowClear
          />
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Select
            placeholder="请选择状态"
            style={{ width: 120 }}
            allowClear
          >
            <Option value="待提交">待提交</Option>
            <Option value="审批中">审批中</Option>
            <Option value="审批通过">审批通过</Option>
            <Option value="被驳回">被驳回</Option>
            <Option value="已执行">已执行</Option>
          </Select>
        </Form.Item>
        <Form.Item name="operator" label="操作人">
          <Input
            placeholder="请输入操作人"
            style={{ width: 120 }}
            allowClear
          />
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

      {/* 操作区域 */}
      <div style={{ marginBottom: 16 }}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleCreate}
          size="middle"
        >
          新建调价单
        </Button>
      </div>

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

      {/* 新建/编辑调价单弹窗 */}
      <Modal
        title={modalType === 'create' ? '新建调价单' : '编辑调价单'}
        open={isModalVisible}
        onCancel={handleModalCancel}
        width={1400}
        destroyOnClose
        footer={modalType === 'create' ? [
          <Button key="cancel" onClick={handleModalCancel}>
            取消
          </Button>,
          <Button key="save" onClick={() => handleModalSubmit('save')}>
            保存
          </Button>,
          <Button key="submit" type="primary" onClick={() => handleModalSubmit('submit')}>
            提交审核
          </Button>
        ] : [
          <Button key="cancel" onClick={handleModalCancel}>
            取消
          </Button>,
          <Button key="save" type="primary" onClick={() => handleModalSubmit('save')}>
            保存修改
          </Button>
        ]}
      >
        <Form
          form={modalForm}
          layout="vertical"
        >
          {/* 基本信息 */}
          <Card title="基本信息" size="small" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="调价单ID">
                  <Input 
                    value={modalType === 'create' ? generateAdjustmentId() : selectedRecord?.adjustmentId}
                    disabled
                    style={{ background: '#f5f5f5' }}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="adjustmentName"
                  label="调价单名称"
                  rules={[{ required: true, message: '请输入调价单名称' }]}
                >
                  <Input placeholder="请输入调价单名称" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="adjustmentType"
                  label="调价方式"
                  rules={[{ required: true, message: '请选择调价方式' }]}
                >
                  <Select placeholder="请选择调价方式">
                    <Option value="批量调价">批量调价</Option>
                    <Option value="单站调价">单站调价</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="effectiveTime"
                  label="预计生效时间"
                  rules={[{ required: true, message: '请选择预计生效时间' }]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    showTime
                    placeholder="请选择预计生效时间"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="province"
                  label="省份筛选"
                >
                  <Select 
                    placeholder="选择省份查看发改委价格" 
                    onChange={handleProvinceChange}
                    allowClear
                  >
                    <Option value="江西">江西省</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="adjustmentReason"
                  label="调价原因"
                  rules={[{ required: true, message: '请输入调价原因' }]}
                >
                  <Input placeholder="请输入调价原因" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* 发改委价格参考 */}
          {ndrcPrices.length > 0 && (
            <Card 
              title="发改委最新价格参考（江西省）" 
              size="small" 
              style={{ marginBottom: 16 }}
            >
              <Table
                columns={[
                  {
                    title: '油品名称',
                    dataIndex: 'oilName',
                    key: 'oilName',
                    width: 150
                  },
                  {
                    title: '当前价格(元/升)',
                    dataIndex: 'currentPrice',
                    key: 'currentPrice',
                    width: 130,
                    align: 'right',
                    render: (price) => `¥${(price || 0).toFixed(2)}`
                  },
                  {
                    title: '生效时间',
                    dataIndex: 'effectiveTime',
                    key: 'effectiveTime',
                    width: 160
                  },
                  {
                    title: '状态',
                    dataIndex: 'status',
                    key: 'status',
                    width: 100,
                    render: (status) => (
                      <Tag color={status === '生效' ? 'green' : 'orange'}>{status}</Tag>
                    )
                  }
                ]}
                dataSource={ndrcPrices}
                rowKey="id"
                pagination={false}
                size="small"
              />
            </Card>
          )}

          {/* 选择调价站点 */}
          <Card title="选择调价站点" size="small" style={{ marginBottom: 16 }}>
            <Form.Item
              name="stationIds"
              rules={[{ required: true, message: '请选择要调价的油站' }]}
            >
              <TreeSelect
                placeholder="请选择要调价的油站（支持多选）"
                allowClear
                multiple
                treeData={stationTreeData}
                showSearch
                treeDefaultExpandAll
                onChange={handleStationChange}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Card>

          {/* 价格调整详情 */}
          {priceAdjustments.length > 0 && (
            <Card title="价格调整详情" size="small" style={{ marginBottom: 16 }}>
              <Table
                columns={[
                  {
                    title: '油站名称',
                    dataIndex: 'stationName',
                    key: 'stationName',
                    width: 140,
                    fixed: 'left'
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
                    title: '当前价格(元/升)',
                    dataIndex: 'currentPrice',
                    key: 'currentPrice',
                    width: 130,
                    align: 'right',
                    render: (price) => `¥${(price || 0).toFixed(2)}`
                  },
                  {
                    title: '新价格(元/升)',
                    dataIndex: 'newPrice',
                    key: 'newPrice',
                    width: 150,
                    align: 'right',
                    render: (price, record) => (
                      <InputNumber
                        value={price}
                        onChange={(value) => handlePriceChange(record.key, value || 0)}
                        step={0.01}
                        precision={2}
                        min={0}
                        size="small"
                        style={{ width: '100%' }}
                        placeholder="请输入新价格"
                      />
                    )
                  },
                  {
                    title: '调整幅度',
                    key: 'adjustment',
                    width: 100,
                    align: 'right',
                    render: (_, record) => {
                      const currentPrice = record.currentPrice || 0;
                      const newPrice = record.newPrice || 0;
                      const adjustment = newPrice - currentPrice;
                      const color = adjustment > 0 ? 'red' : adjustment < 0 ? 'green' : 'gray';
                      return (
                        <span style={{ color }}>
                          {adjustment > 0 ? '+' : ''}{adjustment.toFixed(2)}
                        </span>
                      );
                    }
                  }
                ]}
                dataSource={priceAdjustments}
                rowKey="key"
                pagination={false}
                size="small"
                scroll={{ x: 'max-content', y: 400 }}
              />
            </Card>
          )}
        </Form>
      </Modal>

      {/* 查看详情弹窗 */}
      <Modal
        title="调价单详情"
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
          <>
            <Descriptions column={2} bordered style={{ marginBottom: 16 }}>
              <Descriptions.Item label="调价单号">{selectedRecord.adjustmentId}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={getStatusColor(selectedRecord.status)}>
                  {selectedRecord.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="调价单名称" span={2}>
                {selectedRecord.adjustmentName}
              </Descriptions.Item>
              <Descriptions.Item label="调价方式">{selectedRecord.adjustmentType}</Descriptions.Item>
              <Descriptions.Item label="调价原因">{selectedRecord.adjustmentReason}</Descriptions.Item>
              <Descriptions.Item label="预计生效时间">{selectedRecord.effectiveTime}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{selectedRecord.createTime}</Descriptions.Item>
              <Descriptions.Item label="操作人">{selectedRecord.operator}</Descriptions.Item>
            </Descriptions>
            
            {/* 价格调整详情表格 */}
            {selectedRecord.priceAdjustments && selectedRecord.priceAdjustments.length > 0 && (
              <Card title="价格调整详情" size="small">
                <Table
                  columns={[
                    {
                      title: '油站名称',
                      dataIndex: 'stationName',
                      key: 'stationName',
                      width: 140
                    },
                    {
                      title: '油品名称',
                      dataIndex: 'oilName',
                      key: 'oilName',
                      width: 140
                    },
                    {
                      title: '调整前价格(元/升)',
                      dataIndex: 'currentPrice',
                      key: 'currentPrice',
                      width: 140,
                      align: 'right',
                      render: (price) => `¥${price.toFixed(2)}`
                    },
                    {
                      title: '调整后价格(元/升)',
                      dataIndex: 'newPrice',
                      key: 'newPrice',
                      width: 140,
                      align: 'right',
                      render: (price) => `¥${price.toFixed(2)}`
                    },
                    {
                      title: '调整幅度',
                      key: 'adjustment',
                      width: 100,
                      align: 'right',
                      render: (_, record) => {
                        const adjustment = record.newPrice - record.currentPrice;
                        const color = adjustment > 0 ? 'red' : adjustment < 0 ? 'green' : 'gray';
                        return (
                          <span style={{ color }}>
                            {adjustment > 0 ? '+' : ''}{adjustment.toFixed(2)}
                          </span>
                        );
                      }
                    }
                  ]}
                  dataSource={selectedRecord.priceAdjustments}
                  rowKey="key"
                  pagination={false}
                  size="small"
                  scroll={{ y: 400 }}
                />
              </Card>
            )}
          </>
        )}
      </Modal>
    </div>
  );
};

export default OilPriceAdjustment;