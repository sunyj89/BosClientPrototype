import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Modal, Form, Input, Select, DatePicker, message, Tag, Divider, Row, Col } from 'antd';
import { PlusOutlined, EyeOutlined, SearchOutlined, FileTextOutlined } from '@ant-design/icons';
import moment from 'moment';
import './index.css';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

// 模拟油枪数据
const guns = [
  { id: 'G001', name: '1号油枪', tankName: '1号油罐', oilType: '92#汽油', position: 'A1', station: '中石化XX加油站' },
  { id: 'G002', name: '2号油枪', tankName: '1号油罐', oilType: '92#汽油', position: 'A2', station: '中石化XX加油站' },
  { id: 'G003', name: '3号油枪', tankName: '2号油罐', oilType: '95#汽油', position: 'B1', station: '中石化XX加油站' },
  { id: 'G004', name: '4号油枪', tankName: '2号油罐', oilType: '95#汽油', position: 'B2', station: '中石化XX加油站' },
  { id: 'G005', name: '5号油枪', tankName: '3号油罐', oilType: '0#柴油', position: 'C1', station: '中石化XX加油站' },
  { id: 'G006', name: '6号油枪', tankName: '4号油罐', oilType: '0#柴油', position: 'C2', station: '中石化XX加油站' },
  { id: 'G007', name: '7号油枪', tankName: '5号油罐', oilType: '98#汽油', position: 'D1', station: '中石化XX加油站' },
];

// 模拟检查项目
const inspectionItems = [
  { id: 'I001', name: '油枪外观检查', description: '检查油枪外观是否有损坏、变形等问题' },
  { id: 'I002', name: '油枪密封性检查', description: '检查油枪是否有漏油现象' },
  { id: 'I003', name: '油枪计量精度检查', description: '检查油枪计量是否准确' },
  { id: 'I004', name: '油枪自动跳枪功能检查', description: '检查油枪自动跳枪功能是否正常' },
  { id: 'I005', name: '油枪流量检查', description: '检查油枪流量是否符合标准' },
  { id: 'I006', name: '油枪管线检查', description: '检查油枪管线是否有老化、破损等问题' },
];

// 模拟检查记录数据
const initialInspections = [
  {
    id: 'INS20230401001',
    gunId: 'G001',
    gunName: '1号油枪',
    inspectionDate: '2023-04-01',
    inspector: '张三',
    result: '合格',
    issues: '',
    remarks: '正常使用',
    items: [
      { itemId: 'I001', itemName: '油枪外观检查', result: '合格', remarks: '外观完好' },
      { itemId: 'I002', itemName: '油枪密封性检查', result: '合格', remarks: '无漏油现象' },
      { itemId: 'I003', itemName: '油枪计量精度检查', result: '合格', remarks: '计量精度在允许范围内' },
      { itemId: 'I004', itemName: '油枪自动跳枪功能检查', result: '合格', remarks: '自动跳枪功能正常' },
      { itemId: 'I005', itemName: '油枪流量检查', result: '合格', remarks: '流量正常' },
      { itemId: 'I006', itemName: '油枪管线检查', result: '合格', remarks: '管线完好' },
    ],
    station: '中石化XX加油站',
  },
  {
    id: 'INS20230401002',
    gunId: 'G002',
    gunName: '2号油枪',
    inspectionDate: '2023-04-01',
    inspector: '张三',
    result: '合格',
    issues: '',
    remarks: '正常使用',
    items: [
      { itemId: 'I001', itemName: '油枪外观检查', result: '合格', remarks: '外观完好' },
      { itemId: 'I002', itemName: '油枪密封性检查', result: '合格', remarks: '无漏油现象' },
      { itemId: 'I003', itemName: '油枪计量精度检查', result: '合格', remarks: '计量精度在允许范围内' },
      { itemId: 'I004', itemName: '油枪自动跳枪功能检查', result: '合格', remarks: '自动跳枪功能正常' },
      { itemId: 'I005', itemName: '油枪流量检查', result: '合格', remarks: '流量正常' },
      { itemId: 'I006', itemName: '油枪管线检查', result: '合格', remarks: '管线完好' },
    ],
    station: '中石化XX加油站',
  },
  {
    id: 'INS20230415001',
    gunId: 'G003',
    gunName: '3号油枪',
    inspectionDate: '2023-04-15',
    inspector: '李四',
    result: '不合格',
    issues: '油枪密封性不合格，存在漏油现象',
    remarks: '需要维修',
    items: [
      { itemId: 'I001', itemName: '油枪外观检查', result: '合格', remarks: '外观完好' },
      { itemId: 'I002', itemName: '油枪密封性检查', result: '不合格', remarks: '存在漏油现象' },
      { itemId: 'I003', itemName: '油枪计量精度检查', result: '合格', remarks: '计量精度在允许范围内' },
      { itemId: 'I004', itemName: '油枪自动跳枪功能检查', result: '合格', remarks: '自动跳枪功能正常' },
      { itemId: 'I005', itemName: '油枪流量检查', result: '合格', remarks: '流量正常' },
      { itemId: 'I006', itemName: '油枪管线检查', result: '合格', remarks: '管线完好' },
    ],
    station: '中石化XX加油站',
  },
  {
    id: 'INS20230415002',
    gunId: 'G004',
    gunName: '4号油枪',
    inspectionDate: '2023-04-15',
    inspector: '李四',
    result: '合格',
    issues: '',
    remarks: '正常使用',
    items: [
      { itemId: 'I001', itemName: '油枪外观检查', result: '合格', remarks: '外观完好' },
      { itemId: 'I002', itemName: '油枪密封性检查', result: '合格', remarks: '无漏油现象' },
      { itemId: 'I003', itemName: '油枪计量精度检查', result: '合格', remarks: '计量精度在允许范围内' },
      { itemId: 'I004', itemName: '油枪自动跳枪功能检查', result: '合格', remarks: '自动跳枪功能正常' },
      { itemId: 'I005', itemName: '油枪流量检查', result: '合格', remarks: '流量正常' },
      { itemId: 'I006', itemName: '油枪管线检查', result: '合格', remarks: '管线完好' },
    ],
    station: '中石化XX加油站',
  },
  {
    id: 'INS20230501001',
    gunId: 'G005',
    gunName: '5号油枪',
    inspectionDate: '2023-05-01',
    inspector: '王五',
    result: '不合格',
    issues: '油枪流量不合格，流量过低',
    remarks: '需要维修',
    items: [
      { itemId: 'I001', itemName: '油枪外观检查', result: '合格', remarks: '外观完好' },
      { itemId: 'I002', itemName: '油枪密封性检查', result: '合格', remarks: '无漏油现象' },
      { itemId: 'I003', itemName: '油枪计量精度检查', result: '合格', remarks: '计量精度在允许范围内' },
      { itemId: 'I004', itemName: '油枪自动跳枪功能检查', result: '合格', remarks: '自动跳枪功能正常' },
      { itemId: 'I005', itemName: '油枪流量检查', result: '不合格', remarks: '流量过低' },
      { itemId: 'I006', itemName: '油枪管线检查', result: '合格', remarks: '管线完好' },
    ],
    station: '中石化XX加油站',
  },
];

const GunInspection = () => {
  const [inspections, setInspections] = useState(initialInspections);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState([]);
  const [filteredInspections, setFilteredInspections] = useState(initialInspections);
  const [itemResults, setItemResults] = useState({});

  useEffect(() => {
    let filtered = inspections;

    // 按文本搜索
    if (searchText) {
      filtered = filtered.filter(
        (inspection) =>
          inspection.gunName.toLowerCase().includes(searchText.toLowerCase()) ||
          inspection.inspector.toLowerCase().includes(searchText.toLowerCase()) ||
          inspection.result.toLowerCase().includes(searchText.toLowerCase()) ||
          inspection.id.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // 按日期范围过滤
    if (dateRange && dateRange.length === 2 && dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].format('YYYY-MM-DD');
      const endDate = dateRange[1].format('YYYY-MM-DD');
      filtered = filtered.filter(
        (inspection) => inspection.inspectionDate >= startDate && inspection.inspectionDate <= endDate
      );
    }

    setFilteredInspections(filtered);
  }, [searchText, dateRange, inspections]);

  const showAddModal = () => {
    form.resetFields();
    // 初始化检查项目结果
    const initialItemResults = {};
    inspectionItems.forEach(item => {
      initialItemResults[item.id] = {
        result: '合格',
        remarks: ''
      };
    });
    setItemResults(initialItemResults);
    setIsModalVisible(true);
  };

  const showDetailModal = (record) => {
    setSelectedInspection(record);
    setIsDetailModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDetailCancel = () => {
    setIsDetailModalVisible(false);
  };

  const handleItemResultChange = (itemId, field, value) => {
    setItemResults(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value
      }
    }));
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      setLoading(true);
      setTimeout(() => {
        // 获取选中油枪的信息
        const selectedGun = guns.find(gun => gun.id === values.gunId);
        
        // 构建检查项目数据
        const items = inspectionItems.map(item => ({
          itemId: item.id,
          itemName: item.name,
          result: itemResults[item.id].result,
          remarks: itemResults[item.id].remarks
        }));
        
        // 判断整体结果
        const hasFailedItem = items.some(item => item.result === '不合格');
        const overallResult = hasFailedItem ? '不合格' : '合格';
        
        // 构建问题描述
        const issues = hasFailedItem 
          ? items
              .filter(item => item.result === '不合格')
              .map(item => `${item.itemName}不合格，${item.remarks}`)
              .join('；')
          : '';
        
        // 创建新的检查记录
        const newInspection = {
          id: `INS${moment().format('YYYYMMDD')}${String(inspections.length + 1).padStart(3, '0')}`,
          gunId: values.gunId,
          gunName: selectedGun.name,
          inspectionDate: values.inspectionDate.format('YYYY-MM-DD'),
          inspector: values.inspector,
          result: overallResult,
          issues: issues,
          remarks: values.remarks,
          items: items,
          station: selectedGun.station,
        };
        
        setInspections([newInspection, ...inspections]);
        message.success('检查记录已添加');
        setLoading(false);
        setIsModalVisible(false);
      }, 500);
    });
  };

  const columns = [
    {
      title: '检查单号',
      dataIndex: 'id',
      key: 'id',
      width: 150,
    },
    {
      title: '油枪名称',
      dataIndex: 'gunName',
      key: 'gunName',
      width: 120,
    },
    {
      title: '检查日期',
      dataIndex: 'inspectionDate',
      key: 'inspectionDate',
      width: 120,
    },
    {
      title: '检查人员',
      dataIndex: 'inspector',
      key: 'inspector',
      width: 100,
    },
    {
      title: '检查结果',
      dataIndex: 'result',
      key: 'result',
      width: 100,
      render: (text) => {
        const color = text === '合格' ? 'green' : 'red';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '问题描述',
      dataIndex: 'issues',
      key: 'issues',
      width: 250,
      ellipsis: true,
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
      width: 150,
      ellipsis: true,
    },
    {
      title: '所属加油站',
      dataIndex: 'station',
      key: 'station',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          size="small"
          onClick={() => showDetailModal(record)}
        >
          详情
        </Button>
      ),
    },
  ];

  return (
    <div className="gun-inspection">
      <Card
        title="油枪检查记录"
        extra={
          <Space>
            <Input
              placeholder="搜索检查记录"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            <RangePicker
              onChange={setDateRange}
              placeholder={['开始日期', '结束日期']}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={showAddModal}
            >
              新增检查
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredInspections}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1300 }}
        />
      </Card>

      {/* 新增检查记录表单 */}
      <Modal
        title="新增检查记录"
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        confirmLoading={loading}
        width={800}
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item
            name="gunId"
            label="选择油枪"
            rules={[{ required: true, message: '请选择油枪' }]}
          >
            <Select placeholder="请选择油枪">
              {guns.map(gun => (
                <Option key={gun.id} value={gun.id}>{`${gun.name} (${gun.oilType})`}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="inspectionDate"
            label="检查日期"
            rules={[{ required: true, message: '请选择检查日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="inspector"
            label="检查人员"
            rules={[{ required: true, message: '请输入检查人员' }]}
          >
            <Input placeholder="请输入检查人员" />
          </Form.Item>
          
          <Divider>检查项目</Divider>
          
          {inspectionItems.map(item => (
            <div key={item.id} className="inspection-item">
              <div className="item-header">
                <h4>{item.name}</h4>
                <p className="item-description">{item.description}</p>
              </div>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label="检查结果"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                  >
                    <Select
                      defaultValue="合格"
                      onChange={(value) => handleItemResultChange(item.id, 'result', value)}
                    >
                      <Option value="合格">合格</Option>
                      <Option value="不合格">不合格</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item
                    label="备注"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                  >
                    <Input
                      placeholder="请输入备注"
                      onChange={(e) => handleItemResultChange(item.id, 'remarks', e.target.value)}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          ))}
          
          <Divider />
          
          <Form.Item
            name="remarks"
            label="整体备注"
          >
            <TextArea rows={3} placeholder="请输入整体备注" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 检查记录详情 */}
      <Modal
        title="检查记录详情"
        open={isDetailModalVisible}
        onCancel={handleDetailCancel}
        footer={[
          <Button key="back" onClick={handleDetailCancel}>
            关闭
          </Button>,
          <Button
            key="print"
            type="primary"
            icon={<FileTextOutlined />}
            onClick={() => message.info('打印功能开发中')}
          >
            打印报告
          </Button>,
        ]}
        width={800}
      >
        {selectedInspection && (
          <div className="inspection-detail">
            <div className="detail-header">
              <Row gutter={24}>
                <Col span={8}>
                  <div className="detail-item">
                    <span className="label">检查单号:</span>
                    <span className="value">{selectedInspection.id}</span>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="detail-item">
                    <span className="label">油枪名称:</span>
                    <span className="value">{selectedInspection.gunName}</span>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="detail-item">
                    <span className="label">所属加油站:</span>
                    <span className="value">{selectedInspection.station}</span>
                  </div>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={8}>
                  <div className="detail-item">
                    <span className="label">检查日期:</span>
                    <span className="value">{selectedInspection.inspectionDate}</span>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="detail-item">
                    <span className="label">检查人员:</span>
                    <span className="value">{selectedInspection.inspector}</span>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="detail-item">
                    <span className="label">检查结果:</span>
                    <span className="value">
                      <Tag color={selectedInspection.result === '合格' ? 'green' : 'red'}>
                        {selectedInspection.result}
                      </Tag>
                    </span>
                  </div>
                </Col>
              </Row>
              {selectedInspection.issues && (
                <Row>
                  <Col span={24}>
                    <div className="detail-item">
                      <span className="label">问题描述:</span>
                      <span className="value">{selectedInspection.issues}</span>
                    </div>
                  </Col>
                </Row>
              )}
              {selectedInspection.remarks && (
                <Row>
                  <Col span={24}>
                    <div className="detail-item">
                      <span className="label">备注:</span>
                      <span className="value">{selectedInspection.remarks}</span>
                    </div>
                  </Col>
                </Row>
              )}
            </div>

            <Divider>检查项目详情</Divider>

            <Table
              dataSource={selectedInspection.items}
              rowKey="itemId"
              pagination={false}
              columns={[
                {
                  title: '检查项目',
                  dataIndex: 'itemName',
                  key: 'itemName',
                  width: 200,
                },
                {
                  title: '检查结果',
                  dataIndex: 'result',
                  key: 'result',
                  width: 100,
                  render: (text) => {
                    const color = text === '合格' ? 'green' : 'red';
                    return <Tag color={color}>{text}</Tag>;
                  },
                },
                {
                  title: '备注',
                  dataIndex: 'remarks',
                  key: 'remarks',
                },
              ]}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default GunInspection; 