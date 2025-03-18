import React, { useState } from 'react';
import { Card, Form, Input, Button, Table, Space, DatePicker, Select, Row, Col, Divider, Tag, Drawer, Radio, message, Modal } from 'antd';
import { SearchOutlined, ReloadOutlined, ExportOutlined, PrinterOutlined, EyeOutlined, EditOutlined, CheckOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

const OilOverflowOrder = () => {
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
  const [exportLoading, setExportLoading] = useState(false);
  const [printLoading, setPrintLoading] = useState(false);

  // 模拟数据
  const mockData = Array.from({ length: 20 }).map((_, index) => ({
    key: index,
    orderNo: `OF${String(2023001 + index).padStart(6, '0')}`,
    orderDate: `2023-${Math.floor(index / 3) + 1}-${(index % 28) + 1}`,
    station: `油站${(index % 5) + 1}`,
    oilType: ['92#汽油', '95#汽油', '98#汽油', '0#柴油'][index % 4],
    planQuantity: Math.floor(5000 + Math.random() * 10000),
    actualQuantity: Math.floor(5050 + Math.random() * 10200),
    overflowQuantity: Math.floor(50 + Math.random() * 200),
    overflowRate: (Math.random() * 2).toFixed(2),
    status: ['待审核', '已审核', '已驳回'][index % 3],
    remark: index % 3 === 0 ? '温度变化导致' : '',
    reason: index % 3 === 0 ? '温度变化' : (index % 3 === 1 ? '运输过程' : '计量误差'),
    approver: index % 3 === 1 ? '张经理' : '',
    approvalDate: index % 3 === 1 ? `2023-${Math.floor(index / 3) + 1}-${(index % 28) + 2}` : '',
    approvalRemark: index % 3 === 1 ? '属于正常超溢范围' : (index % 3 === 2 ? '超溢率过高，需要调查' : ''),
  }));

  const columns = [
    {
      title: '订单编号',
      dataIndex: 'orderNo',
      key: 'orderNo',
    },
    {
      title: '订单日期',
      dataIndex: 'orderDate',
      key: 'orderDate',
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
      title: '计划数量(L)',
      dataIndex: 'planQuantity',
      key: 'planQuantity',
    },
    {
      title: '实际数量(L)',
      dataIndex: 'actualQuantity',
      key: 'actualQuantity',
    },
    {
      title: '超溢数量(L)',
      dataIndex: 'overflowQuantity',
      key: 'overflowQuantity',
      render: (text) => <span style={{ color: 'green' }}>{text}</span>,
    },
    {
      title: '超溢率(%)',
      dataIndex: 'overflowRate',
      key: 'overflowRate',
      render: (text) => <span style={{ color: 'green' }}>{text}%</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        if (text === '待审核') {
          return <Tag color="blue">{text}</Tag>;
        } else if (text === '已审核') {
          return <Tag color="green">{text}</Tag>;
        } else if (text === '已驳回') {
          return <Tag color="red">{text}</Tag>;
        }
        return text;
      }
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
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
          {record.status === '待审核' && (
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
                审核
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  // 处理查询
  const onFinish = (values) => {
    console.log('查询条件:', values);
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      message.success('查询成功');
      setLoading(false);
    }, 1000);
  };

  // 重置表单
  const onReset = () => {
    form.resetFields();
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

  // 批量打印
  const handlePrint = () => {
    setPrintLoading(true);
    // 模拟打印过程
    setTimeout(() => {
      message.success('批量打印成功');
      setPrintLoading(false);
    }, 1500);
  };

  // 查看详情
  const handleViewDetail = (record) => {
    setCurrentRecord(record);
    detailForm.setFieldsValue({
      orderNo: record.orderNo,
      orderDate: record.orderDate,
      station: record.station,
      oilType: record.oilType,
      planQuantity: record.planQuantity,
      actualQuantity: record.actualQuantity,
      overflowQuantity: record.overflowQuantity,
      overflowRate: record.overflowRate,
      reason: record.reason,
      remark: record.remark,
      status: record.status,
      approver: record.approver,
      approvalDate: record.approvalDate,
      approvalRemark: record.approvalRemark,
    });
    setDetailVisible(true);
  };

  // 编辑记录
  const handleEdit = (record) => {
    setCurrentRecord(record);
    editForm.setFieldsValue({
      orderNo: record.orderNo,
      orderDate: record.orderDate,
      station: record.station,
      oilType: record.oilType,
      planQuantity: record.planQuantity,
      actualQuantity: record.actualQuantity,
      reason: record.reason,
      remark: record.remark,
    });
    setEditVisible(true);
  };

  // 提交编辑
  const handleEditSubmit = () => {
    editForm.validateFields().then(values => {
      console.log('编辑提交的数据:', values);
      // 模拟API请求
      setTimeout(() => {
        message.success('编辑成功');
        setEditVisible(false);
      }, 1000);
    }).catch(errorInfo => {
      console.log('表单验证失败:', errorInfo);
    });
  };

  // 审核操作
  const handleApproval = (record) => {
    setCurrentRecord(record);
    approvalForm.setFieldsValue({
      orderNo: record.orderNo,
      orderDate: record.orderDate,
      station: record.station,
      oilType: record.oilType,
      planQuantity: record.planQuantity,
      actualQuantity: record.actualQuantity,
      overflowQuantity: record.overflowQuantity,
      overflowRate: record.overflowRate,
      reason: record.reason,
      remark: record.remark,
      approvalResult: 'approved',
      approvalRemark: '',
    });
    setDrawerVisible(true);
  };

  // 提交审核
  const handleApprovalSubmit = () => {
    approvalForm.validateFields().then(values => {
      console.log('审核提交的数据:', values);
      // 模拟API请求
      setTimeout(() => {
        message.success('审核提交成功');
        setDrawerVisible(false);
      }, 1000);
    }).catch(errorInfo => {
      console.log('表单验证失败:', errorInfo);
    });
  };

  return (
    <div>
      <Card title="进货超溢订单">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8} lg={6} xl={6}>
              <Form.Item name="orderNo" label="订单编号">
                <Input placeholder="请输入订单编号" prefix={<SearchOutlined />} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={6}>
              <Form.Item name="dateRange" label="订单日期">
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
            <Col xs={24} sm={12} md={8} lg={6} xl={6}>
              <Form.Item name="status" label="状态">
                <Select style={{ width: '100%' }} placeholder="请选择状态" allowClear>
                  <Option value="pending">待审核</Option>
                  <Option value="approved">已审核</Option>
                  <Option value="rejected">已驳回</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
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
            <Col xs={24} sm={12} md={12} lg={12} xl={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Form.Item>
                <Space>
                  <Button icon={<PrinterOutlined />} onClick={handlePrint} loading={printLoading}>
                    批量打印
                  </Button>
                  <Button icon={<ExportOutlined />} onClick={handleExport} loading={exportLoading}>
                    导出
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

      {/* 审核抽屉 */}
      <Drawer
        title="订单审核"
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
              <Form.Item name="orderNo" label="订单编号">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="orderDate" label="订单日期">
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
              <Form.Item name="planQuantity" label="计划数量(L)">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="actualQuantity" label="实际数量(L)">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item name="overflowQuantity" label="超溢数量(L)">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="overflowRate" label="超溢率(%)">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="reason" label="超溢原因">
            <Input disabled />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <TextArea rows={2} disabled />
          </Form.Item>
          <Divider />
          <Form.Item 
            name="approvalResult" 
            label="审核结果" 
            rules={[{ required: true, message: '请选择审核结果' }]}
          >
            <Radio.Group>
              <Radio value="approved">通过</Radio>
              <Radio value="rejected">驳回</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item 
            name="approvalRemark" 
            label="审核意见"
            rules={[{ required: true, message: '请填写审核意见' }]}
          >
            <TextArea rows={4} placeholder="请输入审核意见" />
          </Form.Item>
        </Form>
      </Drawer>

      {/* 详情模态框 */}
      <Modal
        title="订单详情"
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
              <Form.Item name="orderNo" label="订单编号">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="orderDate" label="订单日期">
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
              <Form.Item name="planQuantity" label="计划数量(L)">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="actualQuantity" label="实际数量(L)">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item name="overflowQuantity" label="超溢数量(L)">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="overflowRate" label="超溢率(%)">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="reason" label="超溢原因">
            <Input disabled />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <TextArea rows={2} disabled />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Input disabled />
          </Form.Item>
          {currentRecord && currentRecord.status !== '待审核' && (
            <>
              <Divider />
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item name="approver" label="审核人">
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="approvalDate" label="审核日期">
                    <Input disabled />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="approvalRemark" label="审核意见">
                <TextArea rows={3} disabled />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>

      {/* 编辑模态框 */}
      <Modal
        title="编辑订单"
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
                name="orderNo" 
                label="订单编号"
                rules={[{ required: true, message: '请输入订单编号' }]}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="orderDate" 
                label="订单日期"
                rules={[{ required: true, message: '请选择订单日期' }]}
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
                label="计划数量(L)"
                rules={[{ required: true, message: '请输入计划数量' }]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="actualQuantity" 
                label="实际数量(L)"
                rules={[{ required: true, message: '请输入实际数量' }]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item 
            name="reason" 
            label="超溢原因"
            rules={[{ required: true, message: '请选择超溢原因' }]}
          >
            <Select style={{ width: '100%' }} placeholder="请选择超溢原因">
              <Option value="温度变化">温度变化</Option>
              <Option value="运输过程">运输过程</Option>
              <Option value="计量误差">计量误差</Option>
              <Option value="其他原因">其他原因</Option>
            </Select>
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OilOverflowOrder; 