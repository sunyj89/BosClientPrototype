import React, { useState } from 'react';
import { Card, Steps, Button, Space, Breadcrumb, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import BasicInfoForm from './components/BasicInfoForm';
import RulesConfigForm from './components/RulesConfigForm';

const CreateDiscountConfig = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});

  const steps = [
    {
      title: '基础信息配置',
      content: <BasicInfoForm onNext={handleNextStep} initialData={formData} />
    },
    {
      title: '优惠规则设置',
      content: <RulesConfigForm onPrev={handlePrevStep} onFinish={handleFinish} basicInfo={formData} />
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
    // 最终数据包含所有步骤的信息
    console.log('Final Data:', finalData);
    message.success('优惠配置创建成功，已提交审批');
    navigate('/marketing/price-discount-config');
  }

  const handleBack = () => {
    navigate('/marketing/price-discount-config');
  };

  return (
    <div className="price-discount-config-container">
      <div className="breadcrumb-container">
        <Breadcrumb>
          <Breadcrumb.Item>营销管理</Breadcrumb.Item>
          <Breadcrumb.Item>价格优惠配置</Breadcrumb.Item>
          <Breadcrumb.Item>新建配置</Breadcrumb.Item>
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
        <p>备注：这是面包屑分步创建页面的演示。第一步配置基础信息，第二步设置优惠规则。</p>
        <p>功能说明：支持多站点选择、多油品配置、分级优惠规则设置等。</p>
      </div>
    </div>
  );
};

export default CreateDiscountConfig;
