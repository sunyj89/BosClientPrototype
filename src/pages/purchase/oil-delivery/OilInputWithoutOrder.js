import React, { useState } from 'react';
import { Card, Form, Input, Button, Table, Space, DatePicker, Select, InputNumber, Tabs, Alert, Row, Col, Drawer, Modal, message, Radio } from 'antd';
import { PlusOutlined, SearchOutlined, ImportOutlined, ExclamationCircleOutlined, ReloadOutlined, EyeOutlined, EditOutlined, CheckOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

const OilInputWithoutOrder = () => {
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [approvalForm] = Form.useForm();
  const [detailForm] = Form.useForm();
  const [editForm] = Form.useForm();
  
  // 状态管理
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  // 模拟数据 - 待审批
  const pendingData = Array.from({ length: 10 }).map((_, index) => ({
    key: `pending-${index}`,
    inputNo: `NI${String(2023001 + index).padStart(6, '0')}`,
    inputDate: `2023-${Math.floor(index / 3) + 1}-${(index % 28) + 1}`,
    station: `油站${(index % 5) + 1}`,
    oilType: ['92#汽油', '95#汽油', '98#汽油', '0#柴油'][index % 4],
    quantity: Math.floor(1000 + Math.random() * 5000),
    temperature: (15 + Math.random() * 10).toFixed(1),
    density: (740 + Math.random() * 60).toFixed(1),
    reason: ['紧急调拨', '临时补充库存', '特殊情况入库', '其他原因'][index % 4],
    status: '待审批',
  }));

  // 模拟数据 - 已入库
  const completedData = Array.from({ length: 10 }).map((_, index) => ({
    key: `completed-${index}`,
    inputNo: `NI${String(2023011 + index).padStart(6, '0')}`,
    inputDate: `2023-${Math.floor(index / 3) + 1}-${(index % 28) + 1}`,
    station: `油站${(index % 5) + 1}`,
    oilType: ['92#汽油', '95#汽油', '98#汽油', '0#柴油'][index % 4],
    quantity: Math.floor(1000 + Math.random() * 5000),
    temperature: (15 + Math.random() * 10).toFixed(1),
    density: (740 + Math.random() * 60).toFixed(1),
    reason: ['紧急调拨', '临时补充库存', '特殊情况入库', '其他原因'][index % 4],
    status: ['已审批', '已入库', '已确认'][index % 3],
    remark: index % 2 === 0 ? '紧急情况处理' : '',
    approver: index % 3 === 0 ? '张经理' : '',
    approvalDate: index % 3 === 0 ? `2023-${Math.floor(index / 3) + 1}-${(index % 28) + 2}` : '',
    approvalRemark: index % 3 === 0 ? '情况属实，同意入库' : '',
  }));

  const columns = [
    {
      title: '入库单号',
      dataIndex: 'inputNo',
      key: 'inputNo',
    },
    {
      title: '入库日期',
      dataIndex: 'inputDate',
      key: 'inputDate',
    },
    {
      title: '油站',
      dataIndex: 'station',
      key: 'station',
    },
    {
      title: '油品类型',
      dataIndex: 'oilType',
      key: 'oilType',
    },
    {
      title: '入库量(L)',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: '温度(℃)',
      dataIndex: 'temperature',
      key: 'temperature',
    },
    {
      title: '密度(kg/m³)',
      dataIndex: 'density',
      key: 'density',
    },
    {
      title: '入库原因',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: '审批状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        let color = 'default';
        if (text === '已审批') color = 'green';
        else if (text === '已入库') color = 'blue';
        else if (text === '已确认') color = 'purple';
        return <span style={{ color: color === 'default' ? 'inherit' : color }}>{text}</span>;
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            size="small" 
            icon={<EyeOutlined />} 
            onClick={() => handleViewDetail(record)}
          >
            查看
          </Button>
          {record.status === '待审批' && (
            <>
              <Button 
                type="link" 
                size="small" 
                icon={<EditOutlined />} 
                onClick={() => handleEdit(record)}
              >
                编辑
              </Button>
              <Button 
                type="link" 
                size="small" 
                icon={<CheckOutlined />} 
                onClick={() => handleApproval(record)}
              >
                审批
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  const onFinish = (values) => {
    console.log('查询条件:', values);
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      message.success('查询成功');
      setLoading(false);
    }, 1000);
  };

  const onReset = () => {
    form.resetFields();
  };

  const onReset2 = () => {
    form2.resetFields();
  };

  // 导出数据
  const handleExport = () => {
    setExportLoading(true);
    // 模拟导出过程
    setTimeout(() => {
      message.success('数据导出成功');
      setExportLoading(false);
    }, 1500);
  };

  // 查看详情
  const handleViewDetail = (record) => {
    setCurrentRecord(record);
    detailForm.setFieldsValue({
      inputNo: record.inputNo,
      inputDate: record.inputDate,
      station: record.station,
      oilType: record.oilType,
      quantity: record.quantity,
      temperature: record.temperature,
      density: record.density,
      reason: record.reason,
      status: record.status,
      remark: record.remark || '',
      approver: record.approver || '',
      approvalDate: record.approvalDate || '',
      approvalRemark: record.approvalRemark || '',
    });
    setDetailVisible(true);
  };

  // 编辑操作
  const handleEdit = (record) => {
    setCurrentRecord(record);
    editForm.setFieldsValue({
      inputNo: record.inputNo,
      inputDate: record.inputDate,
      station: record.station,
      oilType: record.oilType,
      quantity: record.quantity,
      temperature: record.temperature,
      density: record.density,
      reason: record.reason,
      remark: record.remark || '',
    });
    setEditVisible(true);
  };

  // 提交编辑
  const handleEditSubmit = () => {
    editForm.validateFields().then(values => {
      console.log('编辑提交的数据:', values);
      // 模拟API请求
      setTimeout(() => {
        message.success('编辑提交成功');
        setEditVisible(false);
      }, 1000);
    }).catch(errorInfo => {
      console.log('表单验证失败:', errorInfo);
    });
  };

  // 审批操作
  const handleApproval = (record) => {
    setCurrentRecord(record);
    approvalForm.setFieldsValue({
      inputNo: record.inputNo,
      inputDate: record.inputDate,
      station: record.station,
      oilType: record.oilType,
      quantity: record.quantity,
      temperature: record.temperature,
      density: record.density,
      reason: record.reason,
      remark: record.remark || '',
      approvalResult: 'approved',
      approvalRemark: '',
    });
    setDrawerVisible(true);
  };

  // 提交审批
  const handleApprovalSubmit = () => {
    approvalForm.validateFields().then(values => {
      console.log('审批提交的数据:', values);
      // 模拟API请求
      setTimeout(() => {
        message.success('审批提交成功');
        setDrawerVisible(false);
      }, 1000);
    }).catch(errorInfo => {
      console.log('表单验证失败:', errorInfo);
    });
  };

  return (
    <Card title="无单入库">
      <Alert
        message="无单入库是指没有对应配送单的入库操作，需要经过审批才能入库。"
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />
      <Tabs defaultActiveKey="1">
        <TabPane tab="待审批" key="1">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                <Form.Item name="inputNo" label="入库单号">
                  <Input placeholder="请输入入库单号" prefix={<SearchOutlined />} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                <Form.Item name="dateRange" label="入库日期">
                  <RangePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                <Form.Item name="station" label="油站">
                  <Select style={{ width: '100%' }} placeholder="请选择油站" allowClear>
                    <Option value="station1">油站1</Option>
                    <Option value="station2">油站2</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                <Form.Item name="oilType" label="油品类型">
                  <Select style={{ width: '100%' }} placeholder="请选择油品类型" allowClear>
                    <Option value="92#">92#汽油</Option>
                    <Option value="95#">95#汽油</Option>
                    <Option value="98#">98#汽油</Option>
                    <Option value="0#">0#柴油</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />} loading={loading}>
                      查询
                    </Button>
                    <Button onClick={onReset} icon={<ReloadOutlined />}>
                      重置
                    </Button>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>

          <Table 
            columns={columns} 
            dataSource={pendingData} 
            scroll={{ x: 'max-content' }}
            pagination={{ 
              showSizeChanger: true, 
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`
            }}
            loading={loading}
          />
        </TabPane>
        <TabPane tab="已入库" key="2">
          <Form
            form={form2}
            layout="vertical"
            onFinish={onFinish}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                <Form.Item name="inputNo" label="入库单号">
                  <Input placeholder="请输入入库单号" prefix={<SearchOutlined />} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                <Form.Item name="dateRange" label="入库日期">
                  <RangePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                <Form.Item name="station" label="油站">
                  <Select style={{ width: '100%' }} placeholder="请选择油站" allowClear>
                    <Option value="station1">油站1</Option>
                    <Option value="station2">油站2</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                <Form.Item name="oilType" label="油品类型">
                  <Select style={{ width: '100%' }} placeholder="请选择油品类型" allowClear>
                    <Option value="92#">92#汽油</Option>
                    <Option value="95#">95#汽油</Option>
                    <Option value="98#">98#汽油</Option>
                    <Option value="0#">0#柴油</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />} loading={loading}>
                      查询
                    </Button>
                    <Button onClick={onReset2} icon={<ReloadOutlined />}>
                      重置
                    </Button>
                    <Button icon={<ImportOutlined />} onClick={handleExport} loading={exportLoading}>
                      导出
                    </Button>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>

          <Table 
            columns={columns} 
            dataSource={completedData} 
            scroll={{ x: 'max-content' }}
            pagination={{ 
              showSizeChanger: true, 
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`
            }}
            loading={loading}
          />
        </TabPane>
      </Tabs>

      {/* 审批抽屉 */}
      <Drawer
        title="无单入库审批"
        width={600}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        extra={
          <Space>
            <Button onClick={() => setDrawerVisible(false)}>取消</Button>
            <Button type="primary" onClick={handleApprovalSubmit}>
              提交
            </Button>
          </Space>
        }
      >
        <Form
          form={approvalForm}
          layout="vertical"
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item name="inputNo" label="入库单号">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="inputDate" label="入库日期">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item name="station" label="油站">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="oilType" label="油品类型">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item name="quantity" label="入库量(L)">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="temperature" label="温度(℃)">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item name="density" label="密度(kg/m³)">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="reason" label="入库原因">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="remark" label="备注">
            <TextArea rows={2} disabled />
          </Form.Item>
          <Form.Item 
            name="approvalResult" 
            label="审批结果" 
            rules={[{ required: true, message: '请选择审批结果' }]}
          >
            <Radio.Group>
              <Radio value="approved">通过</Radio>
              <Radio value="rejected">驳回</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item 
            name="approvalRemark" 
            label="审批意见"
            rules={[{ required: true, message: '请填写审批意见' }]}
          >
            <TextArea rows={4} placeholder="请输入审批意见" />
          </Form.Item>
        </Form>
      </Drawer>

      {/* 详情模态框 */}
      <Modal
        title="入库单详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            关闭
          </Button>
        ]}
        width={700}
      >
        <Form
          form={detailForm}
          layout="vertical"
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item name="inputNo" label="入库单号">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="inputDate" label="入库日期">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item name="station" label="油站">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="oilType" label="油品类型">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item name="quantity" label="入库量(L)">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="temperature" label="温度(℃)">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item name="density" label="密度(kg/m³)">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="reason" label="入库原因">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item name="status" label="状态">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="remark" label="备注">
            <TextArea rows={2} disabled />
          </Form.Item>
          {currentRecord && currentRecord.status === '已审批' && (
            <>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item name="approver" label="审批人">
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="approvalDate" label="审批日期">
                    <Input disabled />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="approvalRemark" label="审批意见">
                <TextArea rows={3} disabled />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>

      {/* 编辑模态框 */}
      <Modal
        title="编辑入库单"
        open={editVisible}
        onCancel={() => setEditVisible(false)}
        onOk={handleEditSubmit}
        width={700}
      >
        <Form
          form={editForm}
          layout="vertical"
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item 
                name="inputNo" 
                label="入库单号"
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="inputDate" 
                label="入库日期"
                rules={[{ required: true, message: '请选择入库日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item 
                name="station" 
                label="油站"
                rules={[{ required: true, message: '请选择油站' }]}
              >
                <Select style={{ width: '100%' }} placeholder="请选择油站">
                  <Option value="油站1">油站1</Option>
                  <Option value="油站2">油站2</Option>
                  <Option value="油站3">油站3</Option>
                  <Option value="油站4">油站4</Option>
                  <Option value="油站5">油站5</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="oilType" 
                label="油品类型"
                rules={[{ required: true, message: '请选择油品类型' }]}
              >
                <Select style={{ width: '100%' }} placeholder="请选择油品类型">
                  <Option value="92#汽油">92#汽油</Option>
                  <Option value="95#汽油">95#汽油</Option>
                  <Option value="98#汽油">98#汽油</Option>
                  <Option value="0#柴油">0#柴油</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item 
                name="quantity" 
                label="入库量(L)"
                rules={[{ required: true, message: '请输入入库量' }]}
              >
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="temperature" 
                label="温度(℃)"
                rules={[{ required: true, message: '请输入温度' }]}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item 
                name="density" 
                label="密度(kg/m³)"
                rules={[{ required: true, message: '请输入密度' }]}
              >
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="reason" 
                label="入库原因"
                rules={[{ required: true, message: '请选择入库原因' }]}
              >
                <Select style={{ width: '100%' }} placeholder="请选择入库原因">
                  <Option value="紧急调拨">紧急调拨</Option>
                  <Option value="临时补充库存">临时补充库存</Option>
                  <Option value="特殊情况入库">特殊情况入库</Option>
                  <Option value="其他原因">其他原因</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="remark" label="备注">
            <TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default OilInputWithoutOrder; 