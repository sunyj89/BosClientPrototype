import React, { useState, useEffect } from 'react';
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
  Alert,
  Spin
} from 'antd';
import { 
  SaveOutlined, 
  RollbackOutlined, 
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useNavigate, useParams, Link } from 'react-router-dom';
import moment from 'moment';

const { Option } = Select;

const EditOilPrice = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [oldPrice, setOldPrice] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  // 获取价格调整详情
  useEffect(() => {
    const fetchPriceDetail = async () => {
      setInitialLoading(true);
      try {
        // 模拟网络请求延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 模拟价格调整详情数据
        const mockDetail = {
          priceNo: 'PRC20231121001',
          station: '油站2',
          oilType: '95#汽油',
          oldPrice: 8.38,
          newPrice: 8.58,
          effectiveDate: '2023-11-25',
          status: '待生效',
          creator: '张三',
          createTime: '2023-11-21 10:15:30',
          remark: '根据市场价格波动进行调整'
        };
        
        // 设置表单初始值
        form.setFieldsValue({
          station: mockDetail.station,
          oilType: mockDetail.oilType,
          oldPrice: mockDetail.oldPrice,
          newPrice: mockDetail.newPrice,
          effectiveDate: moment(mockDetail.effectiveDate),
          remark: mockDetail.remark
        });
        
        setOldPrice(mockDetail.oldPrice);
      } catch (error) {
        console.error('获取价格调整详情失败:', error);
        message.error('获取价格调整详情失败');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchPriceDetail();
  }, [form, id]);

  // 表单提交
  const handleSubmit = (values) => {
    console.log('提交的数据:', values);
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      message.success('价格调整单更新成功');
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
    // 重置为初始加载的数据
    form.resetFields();
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
        <Breadcrumb.Item>编辑价格调整</Breadcrumb.Item>
      </Breadcrumb>

      {/* 提示信息 */}
      <Alert
        message="编辑价格调整说明"
        description="您可以修改新价格、生效日期和备注信息。油站和油品类型不可修改，如需调整请创建新的价格调整单。"
        type="info"
        showIcon
        icon={<ExclamationCircleOutlined />}
        style={{ marginBottom: 16 }}
      />

      {/* 表单卡片 */}
      <Spin spinning={initialLoading}>
        <Card title="编辑价格调整" bordered={false}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name="station"
                  label="油站"
                >
                  <Select disabled>
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
                >
                  <Select disabled>
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
                    parser={value => value.replace(/¥\s?|(,*)/g, '')}
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
                    parser={value => value.replace(/¥\s?|(,*)/g, '')}
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
      </Spin>
    </div>
  );
};

export default EditOilPrice; 