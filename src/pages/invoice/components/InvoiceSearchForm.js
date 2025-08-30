import React from 'react';
import { Form, Input, Select, Button, Space, Row, Col } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

const { Option } = Select;

const InvoiceSearchForm = ({ 
  onSearch, 
  onReset,
  loading = false 
}) => {
  const [form] = Form.useForm();

  const handleSearch = (values) => {
    onSearch?.(values);
  };

  const handleReset = () => {
    form.resetFields();
    onReset?.();
  };

  return (
    <div style={{ marginBottom: 16, background: '#fff', padding: '16px', borderRadius: '4px' }}>
      <Form form={form} onFinish={handleSearch}>
        {/* 第一行：筛选条件 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Form.Item name="invoiceNo" label="发票号码">
              <Input placeholder="请输入发票号码" style={{ width: '100%' }} allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="buyerName" label="购方信息">
              <Input placeholder="请输入购买方名称" style={{ width: '100%' }} allowClear />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="invoiceStatus" label="开票状态">
              <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                <Option value="00">待开票</Option>
                <Option value="01">开票中</Option>
                <Option value="02">开票成功</Option>
                <Option value="03">开票失败</Option>
                <Option value="04">已取消</Option>
                <Option value="05">红冲申请中</Option>
                <Option value="06">红冲成功</Option>
                <Option value="07">红冲失败</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="oilStationName" label="开票油站">
              <Select placeholder="请选择油站" style={{ width: '100%' }} allowClear>
                <Option value="昌北收费站服务区加油站">昌北收费站服务区加油站</Option>
                <Option value="德安服务区加油站">德安服务区加油站</Option>
                <Option value="庐山服务区加油站">庐山服务区加油站</Option>
                <Option value="南昌西服务区加油站">南昌西服务区加油站</Option>
                <Option value="新余服务区加油站">新余服务区加油站</Option>
                <Option value="九江服务区加油站">九江服务区加油站</Option>
                <Option value="吉安服务区加油站">吉安服务区加油站</Option>
                <Option value="赣州服务区加油站">赣州服务区加油站</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        
        {/* 第二行：按钮组，右对齐 */}
        <Row gutter={16}>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<SearchOutlined />}
                loading={loading}
                style={{ borderRadius: '2px' }}
              >
                查询
              </Button>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={handleReset}
                style={{ borderRadius: '2px' }}
              >
                重置
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default InvoiceSearchForm;