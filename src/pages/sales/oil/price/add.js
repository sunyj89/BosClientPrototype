import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Space, 
  DatePicker, 
  Select, 
  Row, 
  Col, 
  message,
  InputNumber,
  Breadcrumb,
  Alert
} from 'antd';
import { 
  SaveOutlined, 
  RollbackOutlined, 
  CheckOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';

const { Option } = Select;

const AddOilPrice = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [oldPrice, setOldPrice] = useState(null);
  const navigate = useNavigate();

  // 表单提交
  const handleSubmit = (values) => {
    console.log('提交的数据:', values);
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      message.success('价格调整单创建成功');
      setLoading(false);
      navigate('/sales/oil/price');
    }, 1500);
  };

  // 返回列表页
  const handleBack = () => {
    navigate('/sales/oil/price');
  };

  // 重置表单
  const handleReset = () => {
    form.resetFields();
    setOldPrice(null);
  };

  // 油站和油品类型变更时获取当前价格
  const handleStationOrOilTypeChange = (value, field) => {
    const station = field === 'station' ? value : form.getFieldValue('station');
    const oilType = field === 'oilType' ? value : form.getFieldValue('oilType');
    
    if (station && oilType) {
      // 模拟API请求获取当前价格
      setLoading(true);
      setTimeout(() => {
        // 模拟不同油站和油品类型的价格
        const mockPrices = {
          '油站1': {
            '92#汽油': 7.85,
            '95#汽油': 8.35,
            '98#汽油': 9.15,
            '0#柴油': 7.45
          },
          '油站2': {
            '92#汽油': 7.88,
            '95#汽油': 8.38,
            '98#汽油': 9.18,
            '0#柴油': 7.48
          },
          '油站3': {
            '92#汽油': 7.82,
            '95#汽油': 8.32,
            '98#汽油': 9.12,
            '0#柴油': 7.42
          },
          '油站4': {
            '92#汽油': 7.86,
            '95#汽油': 8.36,
            '98#汽油': 9.16,
            '0#柴油': 7.46
          },
          '油站5': {
            '92#汽油': 7.84,
            '95#汽油': 8.34,
            '98#汽油': 9.14,
            '0#柴油': 7.44
          }
        };
        
        const price = mockPrices[station]?.[oilType] || null;
        setOldPrice(price);
        form.setFieldsValue({ oldPrice: price });
        setLoading(false);
      }, 500);
    }
  };

  return (
    <div>
      {/* 面包屑导航 */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <Link to="/dashboard">首页</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/sales">销售管理</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/sales/oil">油品销售管理</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/sales/oil/price">价格管理</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>新增价格调整</Breadcrumb.Item>
      </Breadcrumb>

      {/* 提示信息 */}
      <Alert
        message="新增价格调整说明"
        description="请填写完整的价格调整信息，包括油站、油品类型、新价格和生效日期。系统会自动获取当前价格。价格调整单创建后状态为待生效，需要经过审批后才能生效。"
        type="info"
        showIcon
        icon={<ExclamationCircleOutlined />}
        style={{ marginBottom: 16 }}
      />

      {/* 表单卡片 */}
      <Card title="新增价格调整" bordered={false}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            effectiveDate: null
          }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="station"
                label="油站"
                rules={[{ required: true, message: '请选择油站' }]}
              >
                <Select 
                  placeholder="请选择油站" 
                  onChange={(value) => handleStationOrOilTypeChange(value, 'station')}
                  loading={loading}
                >
                  <Option value="油站1">油站1</Option>
                  <Option value="油站2">油站2</Option>
                  <Option value="油站3">油站3</Option>
                  <Option value="油站4">油站4</Option>
                  <Option value="油站5">油站5</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="oilType"
                label="油品类型"
                rules={[{ required: true, message: '请选择油品类型' }]}
              >
                <Select 
                  placeholder="请选择油品类型" 
                  onChange={(value) => handleStationOrOilTypeChange(value, 'oilType')}
                  loading={loading}
                >
                  <Option value="92#汽油">92#汽油</Option>
                  <Option value="95#汽油">95#汽油</Option>
                  <Option value="98#汽油">98#汽油</Option>
                  <Option value="0#柴油">0#柴油</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="effectiveDate"
                label="生效日期"
                rules={[{ required: true, message: '请选择生效日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="oldPrice"
                label="当前价格(元/L)"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  disabled
                  precision={2}
                  formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\¥\s?|(,*)/g, '')}
                  placeholder="选择油站和油品类型后自动获取"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="newPrice"
                label="新价格(元/L)"
                rules={[
                  { required: true, message: '请输入新价格' },
                  { type: 'number', min: 0, message: '价格不能小于0' }
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  precision={2}
                  formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\¥\s?|(,*)/g, '')}
                  placeholder="请输入新价格"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Form.Item
                name="remark"
                label="备注"
              >
                <Input.TextArea rows={4} placeholder="请输入备注信息" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Space>
                <Button onClick={handleReset} icon={<RollbackOutlined />}>
                  重置
                </Button>
                <Button onClick={handleBack} icon={<RollbackOutlined />}>
                  返回
                </Button>
                <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
                  保存
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default AddOilPrice; 