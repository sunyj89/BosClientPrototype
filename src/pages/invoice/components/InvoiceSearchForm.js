import React from 'react';
import { Form, Input, Select, DatePicker, Button, Space, Card, Divider } from 'antd';
import { SearchOutlined, ReloadOutlined, ExportOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;

const InvoiceSearchForm = ({ 
  onSearch, 
  onReset, 
  onExport,
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

  const handleExport = () => {
    const values = form.getFieldsValue();
    onExport?.(values);
  };

  return (
    <Card className="filter-card" style={{ marginBottom: 16 }}>
      <Form 
        form={form} 
        layout="inline" 
        onFinish={handleSearch}
        style={{ marginBottom: 16 }}
      >
        <Form.Item name="orderCode" label="流水号" style={{ width: 180, marginBottom: 8 }}>
          <Input placeholder="请输入发票流水号" />
        </Form.Item>
        
        <Form.Item name="invoiceNo" label="发票号码" style={{ width: 180, marginBottom: 8 }}>
          <Input placeholder="请输入发票号码" />
        </Form.Item>
        
        <Form.Item name="buyerName" label="购买方" style={{ width: 180, marginBottom: 8 }}>
          <Input placeholder="请输入购买方名称" />
        </Form.Item>
        
        <Form.Item name="invoiceStatus" label="开票状态" style={{ width: 130, marginBottom: 8 }}>
          <Select placeholder="请选择" allowClear>
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
        
        <Form.Item name="invoiceType" label="发票类型" style={{ width: 200, marginBottom: 8 }}>
          <Select placeholder="请选择" allowClear>
            <Option value="01">增值税普通发票</Option>
            <Option value="02">增值税电子普通发票</Option>
          </Select>
        </Form.Item>
        
        <Form.Item name="createTimeRange" label="创建时间" style={{ width: 320, marginBottom: 8 }}>
          <RangePicker format="YYYY-MM-DD" />
        </Form.Item>
        
        <Form.Item name="oilStationName" label="油站名称" style={{ width: 220, marginBottom: 8 }}>
          <Select placeholder="请选择" allowClear>
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
      </Form>
      
      <Divider style={{ margin: '16px 0' }} />
      
      <div style={{ textAlign: 'right' }}>
        <Space>
          <Button 
            type="primary" 
            htmlType="submit" 
            icon={<SearchOutlined />}
            loading={loading}
            onClick={() => form.submit()}
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
          <Button 
            type="primary" 
            icon={<ExportOutlined />} 
            onClick={handleExport}
            style={{ borderRadius: '2px' }}
          >
            导出
          </Button>
        </Space>
      </div>
    </Card>
  );
};

export default InvoiceSearchForm;