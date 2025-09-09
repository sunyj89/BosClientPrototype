import React, { useState, useEffect } from 'react';
import { Card, Steps, Button, Breadcrumb, message, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import BasicInfoForm from './components/BasicInfoForm';
import RulesConfigForm from './components/RulesConfigForm';
import mockData from '../../../mock/marketing/price-discount-config.json';

const EditDiscountConfig = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟加载数据
    setTimeout(() => {
      const data = mockData.discountConfigList.find(item => item.id === id);
      if (data) {
        setFormData(data);
      }
      setLoading(false);
    }, 500);
  }, [id]);

  const steps = [
    {
      title: '基础信息配置',
      content: <BasicInfoForm onNext={handleNextStep} initialData={formData} isEdit />
    },
    {
      title: '优惠规则设置',
      content: <RulesConfigForm onPrev={handlePrevStep} onFinish={handleFinish} basicInfo={formData} isEdit />
    }
  ];

  function handleNextStep(data) {
    setFormData({ ...formData, ...data });
    setCurrentStep(currentStep + 1);
  }

  function handlePrevStep() {
    setCurrentStep(currentStep - 1);
  }

  function handleFinish(finalData) {
    // 这里应该提交数据到后端
    console.log('Final Edit Data:', finalData);
    const needApproval = formData?.approvalStatus === '审批通过';
    message.success(needApproval ? '优惠配置修改成功，已提交审批' : '优惠配置修改成功');
    navigate('/marketing/price-discount-config');
  }

  const handleBack = () => {
    navigate('/marketing/price-discount-config');
  };

  if (loading) {
    return (
      <div className="price-discount-config-container">
        <Card>
          <Spin size="large" style={{ display: 'block', textAlign: 'center', padding: '50px' }} />
        </Card>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="price-discount-config-container">
        <Card>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p>配置不存在</p>
            <Button onClick={handleBack}>返回列表</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="price-discount-config-container">
      <div className="breadcrumb-container">
        <Breadcrumb>
          <Breadcrumb.Item>营销管理</Breadcrumb.Item>
          <Breadcrumb.Item>价格优惠配置</Breadcrumb.Item>
          <Breadcrumb.Item>编辑配置</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBack}
          >
            返回列表
          </Button>
        </div>

        <div className="step-form-container">
          <Steps current={currentStep} items={steps.map(item => ({ title: item.title }))} />
          <div className="step-content">
            {steps[currentStep].content}
          </div>
        </div>
      </Card>
      
      {/* 备注信息 */}
      <div className="demo-note">
        <p>备注：这是面包屑分步编辑页面的演示。可以修改基础信息和优惠规则。</p>
        <p>权限控制：审批通过的配置修改后需要重新审批。</p>
      </div>
    </div>
  );
};

export default EditDiscountConfig;
