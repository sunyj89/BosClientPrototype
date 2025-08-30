import React, { useState, useEffect } from 'react';
import { Modal, Steps, Form, Input, Radio, Select, DatePicker, TimePicker, Checkbox, InputNumber, Upload, Button, message, Card, Table, Space, Tag, Row, Col } from 'antd';
import { PlusOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import redPackageData from '../../../../mock/marketing/redPackageActivityData.json';
import couponData from '../../../../mock/marketing/couponData.json';

const { Step } = Steps;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const CreateRedPackageModal = ({ visible, onCancel, onSuccess, editData }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedCoupons, setSelectedCoupons] = useState([]);
  const [packageCount, setPackageCount] = useState(1000);
  const [previewData, setPreviewData] = useState({});

  const isEdit = !!editData;

  useEffect(() => {
    if (visible) {
      if (isEdit) {
        // 编辑模式，填充表单数据
        const formData = {
          activityType: editData.activityType,
          activityName: editData.activityName,
          pageTitle: editData.pageTitle,
          stationName: editData.stationName,
          mainTitle: editData.mainTitle,
          validityType: editData.validityType,
          validityDays: editData.validityDays,
          cycleType: editData.cycleType,
          identityType: editData.identityType,
          levelType: editData.levelType,
          userType: editData.userType,
          repeatType: editData.repeatType,
          shareType: editData.shareType,
          ifFree: editData.ifFree,
          eachCost: editData.eachCost,
          timesLimit: editData.timesLimit,
          isNeedPlate: editData.isNeedPlate,
          activityRules: editData.activityRules
        };
        
        if (editData.validityType === 'fixed_time') {
          formData.dateRange = [moment(editData.startTime), moment(editData.endTime)];
        }
        
        form.setFieldsValue(formData);
        setSelectedCoupons(editData.coupons || []);
        setPackageCount(editData.packageCount);
      } else {
        // 新建模式，重置表单
        form.resetFields();
        setSelectedCoupons([]);
        setPackageCount(1000);
        setCurrentStep(0);
      }
    }
  }, [visible, editData, isEdit, form]);

  const steps = [
    { title: '活动设置', description: '基本信息配置' },
    { title: '选择营销券', description: '选择红包内容' },
    { title: '红包设置', description: '数量和预算' },
    { title: '确认信息', description: '预览和提交' }
  ];

  // 步骤1：红包基本属性
  const renderActivitySettings = () => (
    <div style={{ marginBottom: 24 }}>
      <div style={{ 
        background: '#fff', 
        padding: '16px 24px', 
        borderBottom: '1px solid #f0f0f0',
        fontSize: '16px',
        fontWeight: 'bold'
      }}>
        红包基本属性
      </div>
      <div style={{ background: '#fff', padding: '24px' }}>
        <Row gutter={[24, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item name="activityType" label="红包类型" rules={[{ required: true }]}>
              <Radio.Group>
                <Radio value="normal">普通红包</Radio>
                <Radio value="fission">裂变红包</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item name="activityName" label="红包名称" rules={[{ required: true, max: 30 }]}>
              <Input placeholder="请输入红包名称" maxLength={30} showCount />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item name="validityType" label="红包有效期" rules={[{ required: true }]}>
              <Radio.Group>
                <Radio value="fixed_time">固定时间</Radio>
                <Radio value="relative_days">相对天数</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item noStyle shouldUpdate={(prev, curr) => prev.validityType !== curr.validityType}>
              {({ getFieldValue }) => {
                const validityType = getFieldValue('validityType');
                if (validityType === 'fixed_time') {
                  return (
                    <Form.Item name="dateRange" label="时间范围" rules={[{ required: true }]}>
                      <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
                    </Form.Item>
                  );
                } else if (validityType === 'relative_days') {
                  return (
                    <Form.Item name="validityDays" label="有效天数" rules={[{ required: true }]}>
                      <InputNumber min={1} max={365} placeholder="天" style={{ width: '100%' }} addonAfter="天" />
                    </Form.Item>
                  );
                }
                return <div style={{ height: 32 }}></div>;
              }}
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item name="cycleType" label="周期规则" rules={[{ required: true }]}>
              <Select placeholder="请选择周期规则">
                <Option value="none">无</Option>
                <Option value="daily">每天</Option>
                <Option value="weekly">每周</Option>
                <Option value="monthly">每月</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item name="userType" label="领取用户" rules={[{ required: true }]}>
              <Radio.Group>
                <Radio value={2}>所有用户</Radio>
                <Radio value={1}>未加油用户</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col xs={24} sm={8} md={6}>
            <Form.Item name="repeatType" label="重复领取" rules={[{ required: true }]}>
              <Radio.Group>
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Form.Item name="shareType" label="能否分享" rules={[{ required: true }]}>
              <Radio.Group>
                <Radio value={2}>可以分享</Radio>
                <Radio value={1}>不可分享</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Form.Item name="ifFree" label="是否免费" rules={[{ required: true }]}>
              <Radio.Group>
                <Radio value={1}>免费</Radio>
                <Radio value={2}>花钱换购</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item name="timesLimit" label="次数限制" rules={[{ required: true }]}>
              <InputNumber min={1} max={999} placeholder="次" style={{ width: '100%' }} addonAfter="次" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item noStyle shouldUpdate={(prev, curr) => prev.ifFree !== curr.ifFree}>
          {({ getFieldValue }) => {
            const ifFree = getFieldValue('ifFree');
            return ifFree === 2 ? (
              <Row gutter={[24, 16]}>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item name="eachCost" label="每个红包价格" rules={[{ required: true }]}>
                    <InputNumber min={0.01} max={5000} precision={2} placeholder="元" style={{ width: '100%' }} addonAfter="元" />
                  </Form.Item>
                </Col>
              </Row>
            ) : null;
          }}
        </Form.Item>

        <Row gutter={[24, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item name="isNeedPlate" label="是否需要车牌号" rules={[{ required: true }]}>
              <Radio.Group>
                <Radio value={0}>否</Radio>
                <Radio value={1}>是</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
      </div>
    </div>
  );

  // 步骤2：页面内容配置
  const renderPageSettings = () => (
    <div style={{ marginBottom: 24 }}>
      <div style={{ 
        background: '#fff', 
        padding: '16px 24px', 
        borderBottom: '1px solid #f0f0f0',
        fontSize: '16px',
        fontWeight: 'bold'
      }}>
        页面内容设置
      </div>
      <div style={{ background: '#fff', padding: '24px' }}>
        <Row gutter={[24, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item name="pageTitle" label="页面标题" rules={[{ required: true, max: 30 }]}>
              <Input placeholder="请输入页面标题" maxLength={30} showCount />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item name="stationName" label="油站名称" rules={[{ required: true, max: 30 }]}>
              <Input placeholder="请输入油站名称" maxLength={30} showCount />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item name="mainTitle" label="主标语" rules={[{ required: true, max: 30 }]}>
              <Input placeholder="请输入主标语" maxLength={30} showCount />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item name="stationLogo" label="油站标志">
              <Upload
                name="logo"
                listType="picture-card"
                showUploadList={false}
                beforeUpload={() => false}
                style={{ width: '100%' }}
              >
                <div style={{ width: 100, height: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <UploadOutlined style={{ fontSize: 20, marginBottom: 8 }} />
                  <div>上传图片</div>
                </div>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col span={24}>
            <Form.Item name="activityRules" label="活动规则" rules={[{ required: true }]}>
              <TextArea 
                placeholder="请输入活动规则，建议不超过200个字" 
                autoSize={{ minRows: 4, maxRows: 6 }}
                maxLength={500}
                showCount
              />
            </Form.Item>
          </Col>
        </Row>
      </div>
    </div>
  );

  // 步骤3：营销券选择
  const renderCouponSelection = () => {
    const couponColumns = [
      { 
        title: '券名', 
        dataIndex: 'name', 
        key: 'name',
        ellipsis: true,
        width: 200
      },
      { 
        title: '券ID', 
        dataIndex: 'couponId', 
        key: 'couponId',
        width: 150
      },
      { 
        title: '券额', 
        dataIndex: 'amount', 
        key: 'amount', 
        render: val => `¥${val}`,
        width: 100
      },
      { 
        title: '券类型', 
        dataIndex: 'type', 
        key: 'type',
        width: 120
      },
      { 
        title: '操作', 
        key: 'action',
        width: 100,
        render: (_, record) => {
          const isSelected = selectedCoupons.some(c => c.couponId === record.couponId);
          return (
            <Button 
              type={isSelected ? 'default' : 'primary'}
              size="small"
              onClick={() => handleCouponToggle(record)}
              style={{ borderRadius: '2px' }}
            >
              {isSelected ? '取消' : '选择'}
            </Button>
          );
        }
      }
    ];

    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ 
            background: '#fff', 
            padding: '16px 24px', 
            borderBottom: '1px solid #f0f0f0',
            fontSize: '16px',
            fontWeight: 'bold'
          }}>
            可选营销券
          </div>
          <div style={{ background: '#fff', padding: '16px' }}>
            <Table
              size="small"
              dataSource={couponData.list.slice(0, 10)}
              columns={couponColumns}
              rowKey="couponId"
              pagination={{
                pageSize: 5,
                size: 'small',
                showTotal: (total) => `共 ${total} 条`
              }}
              scroll={{ y: 240 }}
            />
          </div>
        </div>

        {selectedCoupons.length > 0 && (
          <div>
            <div style={{ 
              background: '#fff', 
              padding: '16px 24px', 
              borderBottom: '1px solid #f0f0f0',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              已选择营销券 ({selectedCoupons.length})
            </div>
            <div style={{ background: '#fff', padding: '16px' }}>
              <Table
                size="small"
                dataSource={selectedCoupons}
                rowKey="couponId"
                pagination={false}
                columns={[
                  { 
                    title: '券名', 
                    dataIndex: 'name', 
                    key: 'name',
                    ellipsis: true
                  },
                  { 
                    title: '券额', 
                    dataIndex: 'amount', 
                    key: 'amount', 
                    render: val => `¥${val}`,
                    width: 100
                  },
                  { 
                    title: '每个红包包含数量', 
                    key: 'count',
                    width: 180,
                    render: (_, record, index) => (
                      <InputNumber
                        min={1}
                        max={10}
                        defaultValue={1}
                        onChange={(value) => handleCouponCountChange(index, value)}
                        addonAfter="张"
                        style={{ width: '120px' }}
                      />
                    )
                  },
                  {
                    title: '操作',
                    key: 'action',
                    width: 80,
                    render: (_, record) => (
                      <Button 
                        type="primary" 
                        danger 
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => handleCouponRemove(record)}
                        style={{ borderRadius: '2px' }}
                      >
                        移除
                      </Button>
                    )
                  }
                ]}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  // 步骤4：红包设置
  const renderPackageSettings = () => {
    const totalBudget = calculateTotalBudget();
    
    return (
      <div style={{ marginBottom: 24 }}>
        <div style={{ 
          background: '#fff', 
          padding: '16px 24px', 
          borderBottom: '1px solid #f0f0f0',
          fontSize: '16px',
          fontWeight: 'bold'
        }}>
          红包发行设置
        </div>
        <div style={{ background: '#fff', padding: '24px' }}>
          <Row gutter={[24, 16]}>
            <Col xs={24} sm={12} md={8}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontWeight: 'bold', marginBottom: 8, display: 'block' }}>发行红包数量：</label>
                <InputNumber
                  min={1}
                  max={100000}
                  value={packageCount}
                  onChange={setPackageCount}
                  style={{ width: '100%' }}
                  addonAfter="个"
                />
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontWeight: 'bold', marginBottom: 8, display: 'block' }}>总预算：</label>
                <div style={{ 
                  padding: '6px 12px',
                  background: '#fff2e8',
                  border: '1px solid #ffb84d',
                  borderRadius: '4px',
                  fontSize: 18, 
                  fontWeight: 'bold', 
                  color: '#f5222d'
                }}>
                  ¥{totalBudget.toLocaleString()}
                </div>
              </div>
            </Col>
          </Row>

          {selectedCoupons.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <h4 style={{ marginBottom: 16 }}>红包内容预览</h4>
              <Table
                size="small"
                dataSource={selectedCoupons}
                rowKey="couponId"
                pagination={false}
                columns={[
                  { title: '券名', dataIndex: 'name', key: 'name', ellipsis: true },
                  { title: '券额', dataIndex: 'amount', key: 'amount', render: val => `¥${val}`, width: 100 },
                  { title: '每个红包数量', dataIndex: 'couponCount', key: 'couponCount', render: val => `${val || 1}张`, width: 120 },
                  { 
                    title: '总发放数量', 
                    key: 'totalCount',
                    width: 120,
                    render: (_, record) => `${((record.couponCount || 1) * packageCount).toLocaleString()}张`
                  }
                ]}
                style={{ background: '#fff' }}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  // 步骤5：确认信息
  const renderConfirmInfo = () => {
    const formValues = form.getFieldsValue();
    const totalBudget = calculateTotalBudget();

    return (
      <div style={{ marginBottom: 24 }}>
        <div style={{ 
          background: '#fff', 
          padding: '16px 24px', 
          borderBottom: '1px solid #f0f0f0',
          fontSize: '16px',
          fontWeight: 'bold'
        }}>
          活动信息确认
        </div>
        <div style={{ background: '#fff', padding: '24px' }}>
          <Row gutter={[24, 16]}>
            <Col xs={24} sm={12}>
              <div style={{ marginBottom: 12 }}><strong>红包类型：</strong>{formValues.activityType === 'normal' ? '普通红包' : '裂变红包'}</div>
              <div style={{ marginBottom: 12 }}><strong>红包名称：</strong>{formValues.activityName}</div>
              <div style={{ marginBottom: 12 }}><strong>页面标题：</strong>{formValues.pageTitle}</div>
              <div style={{ marginBottom: 12 }}><strong>主标语：</strong>{formValues.mainTitle}</div>
              <div style={{ marginBottom: 12 }}><strong>红包数量：</strong>{packageCount}个</div>
            </Col>
            <Col xs={24} sm={12}>
              <div style={{ marginBottom: 12 }}><strong>有效期类型：</strong>{formValues.validityType === 'fixed_time' ? '固定时间' : '相对天数'}</div>
              <div style={{ marginBottom: 12 }}><strong>领取用户：</strong>{formValues.userType === 1 ? '未加油用户' : '所有用户'}</div>
              <div style={{ marginBottom: 12 }}><strong>重复领取：</strong>{formValues.repeatType === 1 ? '是' : '否'}</div>
              <div style={{ marginBottom: 12 }}><strong>能否分享：</strong>{formValues.shareType === 2 ? '可以分享' : '不可分享'}</div>
              <div style={{ marginBottom: 12 }}>
                <strong>总预算：</strong>
                <span style={{ fontSize: 16, fontWeight: 'bold', color: '#f5222d' }}>¥{totalBudget.toLocaleString()}</span>
              </div>
            </Col>
          </Row>

          {selectedCoupons.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <h4 style={{ marginBottom: 16 }}>包含营销券</h4>
              <Table
                size="small"
                dataSource={selectedCoupons}
                rowKey="couponId"
                pagination={false}
                columns={[
                  { title: '券名', dataIndex: 'name', key: 'name', ellipsis: true },
                  { title: '券额', dataIndex: 'amount', key: 'amount', render: val => `¥${val}`, width: 100 },
                  { title: '每个红包数量', dataIndex: 'couponCount', key: 'couponCount', render: val => `${val || 1}张`, width: 120 }
                ]}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleCouponToggle = (coupon) => {
    const isSelected = selectedCoupons.some(c => c.couponId === coupon.couponId);
    if (isSelected) {
      setSelectedCoupons(prev => prev.filter(c => c.couponId !== coupon.couponId));
    } else {
      setSelectedCoupons(prev => [...prev, { ...coupon, couponCount: 1 }]);
    }
  };

  const handleCouponRemove = (coupon) => {
    setSelectedCoupons(prev => prev.filter(c => c.couponId !== coupon.couponId));
  };

  const handleCouponCountChange = (index, value) => {
    setSelectedCoupons(prev => {
      const newList = [...prev];
      newList[index] = { ...newList[index], couponCount: value };
      return newList;
    });
  };

  const calculateTotalBudget = () => {
    return selectedCoupons.reduce((total, coupon) => {
      return total + (coupon.amount * (coupon.couponCount || 1) * packageCount);
    }, 0);
  };

  const handleNext = async () => {
    if (currentStep === 0 || currentStep === 1) {
      try {
        await form.validateFields();
        setCurrentStep(prev => prev + 1);
      } catch (error) {
        console.log('表单验证失败:', error);
      }
    } else if (currentStep === 2) {
      if (selectedCoupons.length === 0) {
        message.error('请至少选择一张营销券');
        return;
      }
      setCurrentStep(prev => prev + 1);
    } else if (currentStep === 3) {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      const formValues = await form.validateFields();
      
      const activityData = {
        id: isEdit ? editData.id : `RP${Date.now()}`,
        ...formValues,
        coupons: selectedCoupons,
        packageCount,
        totalBudget: calculateTotalBudget(),
        statistics: isEdit ? editData.statistics : {
          participantCount: 0,
          issuedCount: 0,
          usedCount: 0,
          totalAmount: 0,
          usedAmount: 0
        },
        createTime: isEdit ? editData.createTime : moment().format('YYYY-MM-DD HH:mm:ss'),
        updateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        status: isEdit ? editData.status : 'pending'
      };

      // 处理有效期
      if (formValues.validityType === 'fixed_time' && formValues.dateRange) {
        activityData.startTime = formValues.dateRange[0].format('YYYY-MM-DD HH:mm:ss');
        activityData.endTime = formValues.dateRange[1].format('YYYY-MM-DD HH:mm:ss');
      }

      setLoading(true);
      
      // 模拟API调用
      setTimeout(() => {
        setLoading(false);
        onSuccess(activityData);
        handleCancel();
      }, 1000);

    } catch (error) {
      console.log('提交失败:', error);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setCurrentStep(0);
    form.resetFields();
    setSelectedCoupons([]);
    setPackageCount(1000);
    onCancel();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div style={{ background: '#f5f5f5', borderRadius: '4px', overflow: 'hidden' }}>
            {renderActivitySettings()}
            {renderPageSettings()}
          </div>
        );
      case 1:
        return (
          <div style={{ background: '#f5f5f5', borderRadius: '4px', overflow: 'hidden' }}>
            {renderCouponSelection()}
          </div>
        );
      case 2:
        return (
          <div style={{ background: '#f5f5f5', borderRadius: '4px', overflow: 'hidden' }}>
            {renderPackageSettings()}
          </div>
        );
      case 3:
        return (
          <div style={{ background: '#f5f5f5', borderRadius: '4px', overflow: 'hidden' }}>
            {renderConfirmInfo()}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      title={isEdit ? '编辑红包活动' : '创建红包活动'}
      open={visible}
      onCancel={handleCancel}
      width={1200}
      style={{ top: 20 }}
      footer={
        <div style={{ textAlign: 'right', padding: '16px 0' }}>
          {currentStep > 0 && (
            <Button onClick={handlePrev} style={{ marginRight: 8, borderRadius: '2px' }}>
              上一步
            </Button>
          )}
          <Button onClick={handleCancel} style={{ marginRight: 8, borderRadius: '2px' }}>
            取消
          </Button>
          <Button 
            type="primary" 
            onClick={handleNext}
            loading={loading}
            style={{ borderRadius: '2px' }}
          >
            {currentStep === 3 ? (isEdit ? '保存修改' : '创建活动') : '下一步'}
          </Button>
        </div>
      }
    >
      <div style={{ padding: '0 0 16px 0' }}>
        <Steps current={currentStep} style={{ marginBottom: 32 }}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} description={item.description} />
          ))}
        </Steps>

        <Form form={form} layout="vertical">
          {renderStepContent()}
        </Form>
      </div>
    </Modal>
  );
};

export default CreateRedPackageModal;