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
  Divider,
  Typography,
  Upload,
  Radio,
  Spin,
  Tag,
  Tooltip
} from 'antd';
import { 
  SaveOutlined, 
  RollbackOutlined, 
  UploadOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  QuestionCircleOutlined,
  DollarOutlined,
  FileTextOutlined,
  CheckOutlined
} from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// 油品调价申请单组件
const OilPriceApplication = () => {
  // 状态定义
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentPrices, setCurrentPrices] = useState({});
  const [fileList, setFileList] = useState([]);
  const [adjustmentType, setAdjustmentType] = useState('single');
  const navigate = useNavigate();

  // 初始化数据
  useEffect(() => {
    fetchInitialData();
  }, []);

  // 获取初始数据
  const fetchInitialData = () => {
    setLoading(true);
    // 模拟API请求获取油站和油品类型数据
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  // 表单提交处理
  const handleSubmit = (values) => {
    console.log('提交的数据:', values);
    setSubmitting(true);
    
    // 模拟API请求提交数据
    setTimeout(() => {
      message.success('油品调价申请单提交成功！');
      setSubmitting(false);
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
  };

  // 调整类型变更处理
  const handleAdjustmentTypeChange = (e) => {
    setAdjustmentType(e.target.value);
    form.resetFields(['oilStations', 'oilTypes', 'adjustments']);
  };

  // 文件上传配置
  const uploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  // 渲染页面
  return (
    <div className="oil-price-application">
      {/* 提示信息 */}
      <Alert
        message="油品调价申请说明"
        description="请填写完整的油品调价申请信息。您可以选择单站调价或多站联调方式。系统会自动获取当前价格并计算变动率。申请单提交后需要经过审批流程才能生效。"
        type="info"
        showIcon
        icon={<ExclamationCircleOutlined />}
        style={{ marginBottom: 16 }}
      />

      {/* 主内容区 */}
      <Card title="油品调价申请单" bordered={false}>
        <Spin spinning={loading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              adjustmentType: 'single',
              effectiveDate: moment().add(1, 'days'),
              adjustmentReason: '市场价格波动',
              urgentLevel: 'normal'
            }}
          >
            {/* 基本信息 */}
            <Title level={5}>基本信息</Title>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item
                  name="applicationNo"
                  label="申请单号"
                >
                  <Input disabled placeholder="系统自动生成" prefix={<FileTextOutlined />} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item
                  name="applicant"
                  label="申请人"
                >
                  <Input disabled defaultValue="当前用户" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item
                  name="applicationDate"
                  label="申请日期"
                >
                  <DatePicker 
                    style={{ width: '100%' }} 
                    disabled 
                    defaultValue={moment()} 
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item
                  name="urgentLevel"
                  label="紧急程度"
                  rules={[{ required: true, message: '请选择紧急程度' }]}
                >
                  <Select placeholder="请选择紧急程度">
                    <Option value="high">
                      <Tag color="red">紧急</Tag>
                    </Option>
                    <Option value="normal">
                      <Tag color="blue">普通</Tag>
                    </Option>
                    <Option value="low">
                      <Tag color="green">低</Tag>
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Divider style={{ margin: '16px 0' }} />

            {/* 调价信息 */}
            <Title level={5}>调价信息</Title>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item
                  name="adjustmentType"
                  label="调价类型"
                  rules={[{ required: true, message: '请选择调价类型' }]}
                >
                  <Radio.Group onChange={handleAdjustmentTypeChange}>
                    <Radio value="single">单站调价</Radio>
                    <Radio value="multiple">多站联调</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item
                  name="effectiveDate"
                  label="生效日期"
                  rules={[{ required: true, message: '请选择生效日期' }]}
                >
                  <DatePicker 
                    style={{ width: '100%' }} 
                    disabledDate={(current) => current && current < moment().endOf('day')}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item
                  name="effectiveTime"
                  label="生效时间"
                  rules={[{ required: true, message: '请选择生效时间' }]}
                >
                  <Select placeholder="请选择生效时间">
                    <Option value="00:00">00:00</Option>
                    <Option value="06:00">06:00</Option>
                    <Option value="12:00">12:00</Option>
                    <Option value="18:00">18:00</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item
                  name="adjustmentReason"
                  label="调价原因"
                  rules={[{ required: true, message: '请选择调价原因' }]}
                >
                  <Select placeholder="请选择调价原因">
                    <Option value="市场价格波动">市场价格波动</Option>
                    <Option value="成本变动">成本变动</Option>
                    <Option value="促销活动">促销活动</Option>
                    <Option value="政策调整">政策调整</Option>
                    <Option value="其他">其他</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* 根据调价类型显示不同的表单项 */}
            {adjustmentType === 'single' ? (
              <div className="single-adjustment">
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item
                      name="oilStation"
                      label="油站"
                      rules={[{ required: true, message: '请选择油站' }]}
                    >
                      <Select 
                        placeholder="请选择油站" 
                        showSearch
                        optionFilterProp="children"
                      >
                        <Option value="station1">油站一</Option>
                        <Option value="station2">油站二</Option>
                        <Option value="station3">油站三</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                
                <Form.List name="adjustments">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <Row gutter={[16, 16]} key={key} style={{ marginBottom: 8 }}>
                          <Col xs={24} sm={12} md={6} lg={4}>
                            <Form.Item
                              {...restField}
                              name={[name, 'oilType']}
                              label="油品类型"
                              rules={[{ required: true, message: '请选择油品类型' }]}
                            >
                              <Select placeholder="请选择油品类型">
                                <Option value="oil1">92#汽油</Option>
                                <Option value="oil2">95#汽油</Option>
                                <Option value="oil3">98#汽油</Option>
                                <Option value="oil4">0#柴油</Option>
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={12} md={6} lg={4}>
                            <Form.Item
                              {...restField}
                              name={[name, 'currentPrice']}
                              label="当前价格(元/L)"
                            >
                              <InputNumber
                                style={{ width: '100%' }}
                                disabled
                                precision={2}
                                formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\¥\s?|(,*)/g, '')}
                                placeholder="自动获取"
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={12} md={6} lg={4}>
                            <Form.Item
                              {...restField}
                              name={[name, 'newPrice']}
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
                          <Col xs={24} sm={12} md={6} lg={4}>
                            <Form.Item
                              {...restField}
                              name={[name, 'changeRate']}
                              label="变动率(%)"
                            >
                              <InputNumber
                                style={{ width: '100%' }}
                                disabled
                                precision={2}
                                formatter={value => {
                                  if (value >= 0) {
                                    return `+${value}%`;
                                  }
                                  return `${value}%`;
                                }}
                                parser={value => value.replace('%', '')}
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={12} md={6} lg={4}>
                            <Form.Item
                              {...restField}
                              name={[name, 'remark']}
                              label="备注"
                            >
                              <Input placeholder="请输入备注" />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={12} md={6} lg={4} style={{ display: 'flex', alignItems: 'center' }}>
                            <Form.Item label=" " colon={false}>
                              <Button 
                                type="text" 
                                danger 
                                icon={<MinusCircleOutlined />} 
                                onClick={() => remove(name)}
                              >
                                删除
                              </Button>
                            </Form.Item>
                          </Col>
                        </Row>
                      ))}
                      <Form.Item>
                        <Button 
                          type="dashed" 
                          onClick={() => add()} 
                          block 
                          icon={<PlusOutlined />}
                        >
                          添加油品调价
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </div>
            ) : (
              <div className="multiple-adjustment">
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Form.Item
                      name="oilStations"
                      label="油站选择"
                      rules={[{ required: true, message: '请选择油站' }]}
                    >
                      <Select 
                        mode="multiple" 
                        placeholder="请选择油站" 
                        style={{ width: '100%' }}
                        showSearch
                        optionFilterProp="children"
                      >
                        <Option value="station1">油站一</Option>
                        <Option value="station2">油站二</Option>
                        <Option value="station3">油站三</Option>
                        <Option value="station4">油站四</Option>
                        <Option value="station5">油站五</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                
                <Form.List name="multiAdjustments">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <Row gutter={[16, 16]} key={key} style={{ marginBottom: 8 }}>
                          <Col xs={24} sm={12} md={6} lg={4}>
                            <Form.Item
                              {...restField}
                              name={[name, 'oilType']}
                              label="油品类型"
                              rules={[{ required: true, message: '请选择油品类型' }]}
                            >
                              <Select placeholder="请选择油品类型">
                                <Option value="oil1">92#汽油</Option>
                                <Option value="oil2">95#汽油</Option>
                                <Option value="oil3">98#汽油</Option>
                                <Option value="oil4">0#柴油</Option>
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={12} md={6} lg={4}>
                            <Form.Item
                              {...restField}
                              name={[name, 'adjustmentMethod']}
                              label="调整方式"
                              rules={[{ required: true, message: '请选择调整方式' }]}
                            >
                              <Select placeholder="请选择调整方式">
                                <Option value="fixed">固定价格</Option>
                                <Option value="percentage">百分比</Option>
                                <Option value="amount">固定金额</Option>
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={12} md={6} lg={4}>
                            <Form.Item
                              {...restField}
                              name={[name, 'adjustmentValue']}
                              label="调整值"
                              rules={[
                                { required: true, message: '请输入调整值' },
                                { type: 'number', message: '请输入有效数字' }
                              ]}
                            >
                              <InputNumber
                                style={{ width: '100%' }}
                                precision={2}
                                placeholder="请输入调整值"
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={12} md={6} lg={4}>
                            <Form.Item
                              {...restField}
                              name={[name, 'remark']}
                              label="备注"
                            >
                              <Input placeholder="请输入备注" />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={12} md={6} lg={4} style={{ display: 'flex', alignItems: 'center' }}>
                            <Form.Item label=" " colon={false}>
                              <Button 
                                type="text" 
                                danger 
                                icon={<MinusCircleOutlined />} 
                                onClick={() => remove(name)}
                              >
                                删除
                              </Button>
                            </Form.Item>
                          </Col>
                        </Row>
                      ))}
                      <Form.Item>
                        <Button 
                          type="dashed" 
                          onClick={() => add()} 
                          block 
                          icon={<PlusOutlined />}
                        >
                          添加油品调价
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </div>
            )}

            <Divider style={{ margin: '16px 0' }} />

            {/* 附加信息 */}
            <Title level={5}>附加信息</Title>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Form.Item
                  name="detailedReason"
                  label="详细原因"
                  rules={[{ required: true, message: '请输入详细原因' }]}
                >
                  <TextArea rows={4} placeholder="请详细说明调价原因" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="attachments"
                  label="附件"
                  extra="支持上传调价依据相关文件，如市场调研报告、成本分析等"
                >
                  <Upload {...uploadProps}>
                    <Button icon={<UploadOutlined />}>上传附件</Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>

            {/* 表单操作按钮 */}
            <Divider style={{ margin: '16px 0' }} />
            <Row>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Space>
                  <Button icon={<RollbackOutlined />} onClick={handleBack}>
                    返回
                  </Button>
                  <Button icon={<CheckOutlined />} onClick={handleReset}>
                    重置
                  </Button>
                  <Button 
                    type="primary" 
                    icon={<SaveOutlined />} 
                    loading={submitting}
                    htmlType="submit"
                  >
                    提交申请
                  </Button>
                </Space>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Card>
    </div>
  );
};

export default OilPriceApplication; 