import React, { useState } from 'react';
import { Card, Form, Input, Button, Table, Space, DatePicker, Select, InputNumber, Row, Col, Divider, Drawer, Modal, message, Radio } from 'antd';
import { PlusOutlined, SearchOutlined, ReloadOutlined, EyeOutlined, EditOutlined, CheckOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

const DeliveryPlan = () => {
  const [form] = Form.useForm();
  const [approvalForm] = Form.useForm();
  const [detailForm] = Form.useForm();
  const [editForm] = Form.useForm();
  
  // 状态管理
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [loading, setLoading] = useState(false);

  // 模拟数据
  const mockData = Array.from({ length: 20 }).map((_, index) => ({
    key: index,
    planNo: `DP${String(2023001 + index).padStart(6, '0')}`,
    applyDate: `2023-${Math.floor(index / 3) + 1}-${(index % 28) + 1}`,
    station: `油站${(index % 5) + 1}`,
    oilType: ['92#汽油', '95#汽油', '98#汽油', '0#柴油'][index % 4],
    planQuantity: Math.floor(5000 + Math.random() * 10000),
    deliveryTime: `2023-${Math.floor(index / 3) + 1}-${(index % 28) + 2}`,
    status: ['待审批', '已审批', '已驳回', '已完成'][index % 4],
    remark: index % 2 === 0 ? '常规配送' : '',
    approver: index % 4 === 1 ? '张经理' : '',
    approvalDate: index % 4 === 1 ? `2023-${Math.floor(index / 3) + 1}-${(index % 28) + 2}` : '',
    approvalRemark: index % 4 === 1 ? '符合配送要求' : (index % 4 === 2 ? '配送量超出限制' : ''),
  }));

  const columns = [
    {
      title: '申请单号',
      dataIndex: 'planNo',
      key: 'planNo',
    },
    {
      title: '申请日期',
      dataIndex: 'applyDate',
      key: 'applyDate',
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
      title: '计划配送量(L)',
      dataIndex: 'planQuantity',
      key: 'planQuantity',
    },
    {
      title: '配送时间',
      dataIndex: 'deliveryTime',
      key: 'deliveryTime',
    },
    {
      title: '审批状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        let color = 'default';
        if (text === '已审批') color = 'green';
        else if (text === '已驳回') color = 'red';
        else if (text === '已完成') color = 'blue';
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

  // 查看详情
  const handleViewDetail = (record) => {
    setCurrentRecord(record);
    detailForm.setFieldsValue({
      planNo: record.planNo,
      applyDate: record.applyDate,
      station: record.station,
      oilType: record.oilType,
      planQuantity: record.planQuantity,
      deliveryTime: record.deliveryTime,
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
      planNo: record.planNo,
      applyDate: record.applyDate,
      station: record.station,
      oilType: record.oilType,
      planQuantity: record.planQuantity,
      deliveryTime: record.deliveryTime,
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
      planNo: record.planNo,
      applyDate: record.applyDate,
      station: record.station,
      oilType: record.oilType,
      planQuantity: record.planQuantity,
      deliveryTime: record.deliveryTime,
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
    <div>
      <Card title="配送计划申请单">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8} lg={6} xl={6}>
              <Form.Item name="planNo" label="申请单号">
                <Input placeholder="请输入申请单号" prefix={<SearchOutlined />} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={6}>
              <Form.Item name="dateRange" label="申请日期">
                <RangePicker style={{ width: '100%' }} placeholder={['开始日期', '结束日期']} />
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

        <Divider />

        <Table 
          columns={columns} 
          dataSource={mockData} 
          scroll={{ x: 'max-content' }}
          pagination={{ 
            showSizeChanger: true, 
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
          loading={loading}
        />
      </Card>

      {/* 审批抽屉 */}
      <Drawer
        title="配送计划审批"
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
              <Form.Item name="planNo" label="申请单号">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="applyDate" label="申请日期">
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
              <Form.Item name="planQuantity" label="计划配送量(L)">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="deliveryTime" label="配送时间">
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
        title="配送计划详情"
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
              <Form.Item name="planNo" label="申请单号">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="applyDate" label="申请日期">
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
              <Form.Item name="planQuantity" label="计划配送量(L)">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="deliveryTime" label="配送时间">
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
          {currentRecord && (currentRecord.status === '已审批' || currentRecord.status === '已驳回') && (
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
        title="编辑配送计划"
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
                name="planNo" 
                label="申请单号"
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="applyDate" 
                label="申请日期"
              >
                <Input disabled />
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
                name="planQuantity" 
                label="计划配送量(L)"
                rules={[{ required: true, message: '请输入计划配送量' }]}
              >
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="deliveryTime" 
                label="配送时间"
                rules={[{ required: true, message: '请选择配送时间' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="remark" label="备注">
            <TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DeliveryPlan; 