import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, Radio, InputNumber, TreeSelect, message, Steps, Button, Space, Divider, Card, Row, Col, Upload, Image } from 'antd';
import { InfoCircleOutlined, UploadOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import LevelConfigTable from './LevelConfigTable';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;
const { Step } = Steps;

const RuleConfigModal = ({ visible, editingRule, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [levelConfigData, setLevelConfigData] = useState([]);
  const [ruleImages, setRuleImages] = useState([]);
  
  // 模拟数据
  const [stationOptions, setStationOptions] = useState([]);
  const [memberGroupOptions, setMemberGroupOptions] = useState([]);

  useEffect(() => {
    if (visible) {
      loadFormData();
      loadOptionsData();
      if (editingRule) {
        setFormValues(editingRule);
      } else {
        form.resetFields();
        setCurrentStep(0);
        setLevelConfigData([]);
        setRuleImages([]);
      }
    }
  }, [visible, editingRule]);

  const loadFormData = async () => {
    // 加载表单初始数据
  };

  const loadOptionsData = async () => {
    // 模拟加载油站数据
    const mockStations = [
      { id: 'ST001', title: '赣中分公司-服务区A-油站001', value: 'ST001', key: 'ST001' },
      { id: 'ST002', title: '赣中分公司-服务区A-油站002', value: 'ST002', key: 'ST002' },
      { id: 'ST003', title: '赣中分公司-服务区B-油站003', value: 'ST003', key: 'ST003' },
      { id: 'ST004', title: '赣东北分公司-服务区A-油站001', value: 'ST004', key: 'ST004' },
    ];
    setStationOptions(mockStations);

    // 模拟加载会员组数据
    const mockMemberGroups = [
      { id: 'MG001', title: 'VIP客户组', value: 'MG001', key: 'MG001' },
      { id: 'MG002', title: '企业客户组', value: 'MG002', key: 'MG002' },
      { id: 'MG003', title: '内部员工组', value: 'MG003', key: 'MG003' },
    ];
    setMemberGroupOptions(mockMemberGroups);
  };

  const setFormValues = (rule) => {
    form.setFieldsValue({
      ruleName: rule.ruleName,
      effectivePeriod: [
        moment(rule.effectivePeriod.startTime),
        moment(rule.effectivePeriod.endTime)
      ],
      description: rule.description,
      // 其他字段...
    });
    
    // 设置规则图片
    if (rule.ruleImages) {
      setRuleImages(rule.ruleImages);
    }
  };
  
  const getDisplayText = (field, value) => {
    const displayMap = {
      ratingPeriod: {
        'naturalMonth': '按自然月',
        '15days': '按15天',
        '30days': '按30天',
        '60days': '按60天',
        '90days': '按90天'
      }
    };
    
    return displayMap[field]?.[value] || value;
  };
  
  const handleImageChange = ({ fileList }) => {
    setRuleImages(fileList);
  };
  
  const beforeImageUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件!');
      return false;
    }
    
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('图片大小不能超过5MB!');
      return false;
    }
    
    return true;
  };

  const handleNext = async () => {
    try {
      const values = await form.validateFields();
      if (currentStep === 0) {
        // 验证基础配置
        setCurrentStep(1);
      } else if (currentStep === 1) {
        // 验证等级配置
        if (levelConfigData.length < 3) {
          message.error('至少需要配置3个等级');
          return;
        }
        if (levelConfigData.length > 5) {
          message.error('最多只能配置5个等级');
          return;
        }
        setCurrentStep(2);
      }
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSave = async (isDraft = false) => {
    try {
      setLoading(true);
      const baseValues = await form.validateFields();
      
      if (!isDraft && levelConfigData.length === 0) {
        message.error('请配置至少3个会员等级');
        return;
      }

      const saveData = {
        ...baseValues,
        levelConfig: levelConfigData,
        ruleImages: ruleImages,
        isDraft,
        effectivePeriod: {
          startTime: baseValues.effectivePeriod[0].format('YYYY-MM-DD HH:mm:ss'),
          endTime: baseValues.effectivePeriod[1].format('YYYY-MM-DD HH:mm:ss')
        }
      };

      console.log('保存数据:', saveData);
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success(isDraft ? '草稿保存成功' : '规则保存成功');
      onSuccess();
    } catch (error) {
      message.error('保存失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    Modal.confirm({
      title: '确认取消',
      content: '当前编辑内容将丢失，确定要取消吗？',
      onOk: onCancel
    });
  };

  const renderBasicConfig = () => (
    <div>
      <Card title="规则基础信息" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="ruleName"
              label="规则名称"
              rules={[{ required: true, message: '请输入规则名称' }]}
            >
              <Input placeholder="例如：2025年Q4会员冲刺活动" maxLength={50} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="effectivePeriod"
              label="规则生效周期"
              rules={[{ required: true, message: '请选择生效周期' }]}
            >
              <RangePicker
                style={{ width: '100%' }}
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder={['开始时间', '结束时间']}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="description" label="规则描述">
              <TextArea 
                rows={3} 
                placeholder="请描述此规则的用途和目标"
                maxLength={200}
                showCount
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card title="定级条件配置" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="consumptionMetric"
              label="消费统计口径"
              rules={[{ required: true, message: '请选择消费统计口径' }]}
              tooltip="用于会员等级评定的依据"
            >
              <Radio.Group>
                <Radio value="fuelVolume">油品消费升数</Radio>
                <Radio value="fuelAmount">油品消费实付金额</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="ratingPeriod"
              label="定级周期"
              rules={[{ required: true, message: '请选择定级周期' }]}
              tooltip="系统自动重新定级的时间周期"
            >
              <Select placeholder="请选择定级周期">
                <Option value="naturalMonth">按自然月</Option>
                <Option value="15days">按15天</Option>
                <Option value="30days">按30天</Option>
                <Option value="60days">按60天</Option>
                <Option value="90days">按90天</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="applicableStations"
              label="适用油站"
              rules={[{ required: true, message: '请选择适用油站' }]}
              tooltip="选择哪些油站的消费计入等级统计"
            >
              <TreeSelect
                style={{ width: '100%' }}
                placeholder="请选择适用油站"
                allowClear
                multiple
                treeCheckable
                showCheckedStrategy={TreeSelect.SHOW_PARENT}
                treeData={stationOptions}
                treeDefaultExpandAll
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="excludedMemberGroups"
              label="排除的会员组"
              tooltip="这些会员组内的会员不参与此次定级规则"
            >
              <Select
                mode="multiple"
                placeholder="请选择要排除的会员组（可选）"
                style={{ width: '100%' }}
                options={memberGroupOptions}
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card title="升降级规则" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="upgradeMode"
              label="升降级模式"
              rules={[{ required: true, message: '请选择升降级模式' }]}
              initialValue="strictRevaluation"
            >
              <Radio.Group>
                <Radio value="strictRevaluation">
                  <div style={{ maxWidth: '600px' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>严格重评定</div>
                    <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.5' }}>
                      <div>• <strong>核心逻辑：</strong>用户等级并非永久，每个周期根据上一完整周期的消费表现重新评定</div>
                      <div>• <strong>升级处理：</strong>立即发放新等级的优惠券、积分，享受新等级价格优惠权益</div>
                      <div>• <strong>保级处理：</strong>重新发放一次该等级的优惠券和积分作为忠诚度奖励</div>
                      <div>• <strong>降级处理：</strong>失去原等级权益，转为享受新等级权益（若有），不发放奖励</div>
                      <div>• <strong>权益生效：</strong>新等级在整个新周期内保持有效，直至下一周期重新评定</div>
                      <div>• <strong>退款处理：</strong>退款时撤回相关权益，实时重新计算等级并调整</div>
                    </div>
                  </div>
                </Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
      </Card>
    </div>
  );

  const renderLevelConfig = () => (
    <div>
      <div style={{ marginBottom: 16, padding: '12px', background: '#f0f9ff', borderRadius: '4px' }}>
        <InfoCircleOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
        <span>请配置3-5个会员等级，系统将根据消费门槛自动判定会员等级</span>
      </div>
      
      <LevelConfigTable
        data={levelConfigData}
        onChange={setLevelConfigData}
        consumptionMetric={form.getFieldValue('consumptionMetric')}
      />
    </div>
  );

  const renderPreview = () => {
    const baseValues = form.getFieldsValue();
    
    return (
      <div>
        <Card title="规则预览" style={{ marginBottom: 16 }}>
          <Row gutter={24}>
            {/* 左侧：规则信息 */}
            <Col span={16}>
              <div style={{ background: '#fafafa', padding: '16px', borderRadius: '4px' }}>
                <h4>基础配置</h4>
                <p>规则名称: {baseValues.ruleName}</p>
                <p>统计口径: {baseValues.consumptionMetric === 'fuelVolume' ? '油品消费升数' : '油品消费实付金额'}</p>
                <p>定级周期: {getDisplayText('ratingPeriod', baseValues.ratingPeriod)}</p>
                
                <h4 style={{ marginTop: '16px' }}>等级配置</h4>
                <p>共配置 {levelConfigData.length} 个等级</p>
                {levelConfigData.map((level, index) => (
                  <div key={index} style={{ marginLeft: '16px' }}>
                    • {level.levelName}: {level.consumptionThreshold > 0 ? `${level.consumptionThreshold}${baseValues.consumptionMetric === 'fuelVolume' ? '升' : '元'}` : '无门槛'}
                  </div>
                ))}
                
                <h4 style={{ marginTop: '16px' }}>规则说明</h4>
                <p>{baseValues.description || '暂无描述'}</p>
              </div>
            </Col>
            
            {/* 右侧：图片预览 */}
            <Col span={8}>
              <Card title="规则图示" size="small">
                {ruleImages.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {ruleImages.map((image, index) => (
                      <Image
                        key={index}
                        src={image.url || image.thumbUrl}
                        alt={`规则图示${index + 1}`}
                        style={{ width: '100%', maxHeight: '120px', objectFit: 'cover' }}
                      />
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                    暂无图片
                  </div>
                )}
              </Card>
            </Col>
          </Row>
        </Card>
        
        {/* 添加定级规则维护区域 */}
        <Card title="定级规则维护" style={{ marginBottom: 16 }}>
          <Form layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="规则图示上传">
                  <Upload
                    listType="picture-card"
                    fileList={ruleImages}
                    onChange={handleImageChange}
                    beforeUpload={beforeImageUpload}
                    multiple
                  >
                    {ruleImages.length >= 6 ? null : (
                      <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>上传图片</div>
                      </div>
                    )}
                  </Upload>
                  <div style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>
                    支持JPG、PNG格式，建议尺寸800x600，单张不超过5MB，最多6张
                  </div>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="规则说明维护">
                  <Input.TextArea
                    rows={4}
                    placeholder="请输入详细的定级规则说明，帮助用户更好理解等级升级条件"
                    maxLength={500}
                    showCount
                    value={form.getFieldValue('description')}
                    onChange={(e) => form.setFieldsValue({ description: e.target.value })}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    );
  };

  const steps = [
    { title: '基础配置', content: renderBasicConfig() },
    { title: '等级配置', content: renderLevelConfig() },
    { title: '预览确认', content: renderPreview() }
  ];

  return (
    <Modal
      title={editingRule ? '编辑定级规则' : '新建定级规则'}
      open={visible}
      onCancel={handleCancel}
      width={1200}
      footer={null}
      destroyOnClose
    >
      <Steps current={currentStep} style={{ marginBottom: 24 }}>
        {steps.map((step, index) => (
          <Step key={index} title={step.title} />
        ))}
      </Steps>

      <Form
        form={form}
        layout="vertical"
        preserve={false}
      >
        <div style={{ minHeight: '400px' }}>
          {steps[currentStep].content}
        </div>
      </Form>

      <Divider />
      
      <div style={{ textAlign: 'right' }}>
        <Space>
          {currentStep > 0 && (
            <Button onClick={handlePrev}>
              上一步
            </Button>
          )}
          {currentStep < steps.length - 1 ? (
            <Button type="primary" onClick={handleNext}>
              下一步
            </Button>
          ) : (
            <>
              <Button onClick={() => handleSave(true)} loading={loading}>
                保存草稿
              </Button>
              <Button type="primary" onClick={() => handleSave(false)} loading={loading}>
                提交规则
              </Button>
            </>
          )}
        </Space>
      </div>
    </Modal>
  );
};

export default RuleConfigModal;