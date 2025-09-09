import React, { useEffect, useState } from 'react';
import { Form, Input, Select, InputNumber, Button, Space, Row, Col, TreeSelect, message } from 'antd';
import * as api from '../../services/api';

const { Option } = Select;

const OilForm = ({ visible, type, data, onOk, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentOilType, setCurrentOilType] = useState('');
  const isView = type === 'view';
  const [oilTypeData, setOilTypeData] = useState([]);
  const [oilStandardData, setOilStandardData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  
  // 生成油品名称 - 支持新的分类类型
  const generateOilName = (categoryValue, oilType, emissionLevel) => {
    if (!categoryValue || !emissionLevel) return '';

    // 获取分类名称（去掉"号"字，因为后面会添加类型）
    let categoryName = selectedCategory.title;
    
    // 根据不同类型生成名称
    if (oilType === '汽油') {
      // 例如：92号汽油国V
      return `${categoryName}${oilType}${emissionLevel}`;
    } else if (oilType === '柴油') {
      // 例如：0号柴油国V
      return `${categoryName}${oilType}${emissionLevel}`;
    } else if (oilType === '天然气') {
      // 例如：LNG液化天然气、CNG压缩天然气
      return `${categoryName}`;
    } else if (oilType === '尿素') {
      // 例如：桶装车用尿素、散装车用尿素
      return `${categoryName}`;
    } else {
      // 其他类型
      return `${categoryName}${oilType}${emissionLevel}`;
    }
  };

  useEffect(() => {
    loadInitData();
    if (visible) {
      if (type === 'create') {
        form.resetFields();
        setCurrentOilType('');
        // 设置默认值
        form.setFieldsValue({
          status: '生效中',
          density: 0.75
        });
      } else if (data) {
        // 编辑时填充数据
        form.setFieldsValue({
          ...data,
          category: data.categoryKey,
          oilType: oilType,
          emissionLevel: data.emissionLevel
        });
      }
    }
  }, [visible, type, data, form]);

  const loadInitData = async () => {
    // 查询油品类型
    api.getDictList('oil_product_type').then(res => {
      if (res.success) {
        setOilTypeData(res.data);
      }
    });

    // 获取油品标准列表
    api.getOilStandardList().then(res => {
      if (res.success) {
        setOilStandardData(res.data);
      }
    });

        // 从 API 获取油品分类列表
    api.getOilCategoryList().then(res => {
      if (res.success) {
        setCategoryData(res.data);
      }
    });
  }


  // 查找分类
  const findCategoryByValue = (treeData, value) => {
    for (const node of treeData) {
      if (node.value === value) {
        return node;
      }
      if (node.children) {
        const found = findCategoryByValue(node.children, value);
        if (found) return found;
      }
    }
    return null;
  };

  // 处理分类选择变化
  const handleCategoryChange = (value) => {

    if (selectedCategory && selectedCategory.oilType) {
      // 自动设置油品类型
      setCurrentOilType(selectedCategory.oilType);
      form.setFieldsValue({
        oilType: selectedCategory.oilType
      });

      // 自动生成油品名称
      const currentValues = form.getFieldsValue();
      if (selectedCategory.oilType === '天然气' || selectedCategory.oilType === '尿素') {
        // 天然气和尿素不需要排放等级
        form.setFieldsValue({ emissionLevel: undefined });
        const generatedName = generateOilName(value, selectedCategory.oilType, '');
        form.setFieldsValue({ name: generatedName });
      } else if (currentValues.emissionLevel) {
        const generatedName = generateOilName(value, selectedCategory.oilType, currentValues.emissionLevel);
        form.setFieldsValue({ name: generatedName });
      }
    }
  };

  // 处理油品类型变化
  const handleOilTypeChange = (value) => {
    setCurrentOilType(value);
    
    // 如果切换到天然气或尿素，清空排放等级
    if (value === '天然气' || value === '尿素') {
      form.setFieldsValue({ emissionLevel: undefined });
    }
    
    const currentValues = form.getFieldsValue();
    if (currentValues.category) {
      // 对于天然气和尿素，直接生成名称，不需要排放等级
      if (value === '天然气' || value === '尿素') {
        const generatedName = generateOilName(currentValues.category, value, '');
        form.setFieldsValue({ name: generatedName });
      } else if (currentValues.emissionLevel) {
        const generatedName = generateOilName(currentValues.category, value, currentValues.emissionLevel);
        form.setFieldsValue({ name: generatedName });
      }
    }
  };

  // 处理排放等级变化
  const handleEmissionLevelChange = (value) => {
    const currentValues = form.getFieldsValue();
    if (currentValues.category && currentValues.oilType) {
      const generatedName = generateOilName(currentValues.category, currentValues.oilType, value);
      form.setFieldsValue({
        name: generatedName
      });
    }
  };

  const handleSubmit = (values) => {
    // 验证财务信息业务逻辑
    if (!values.input_tax_rate) {
      message.error('进项税率为必填项');
      return;
    }
    
    if (!values.output_tax_rate) {
      message.error('销项税率为必填项');
      return;
    }
    
    if (values.input_tax_rate < 0 || values.input_tax_rate > 100) {
      message.error('进项税率必须在0-100之间');
      return;
    }
    
    if (values.output_tax_rate < 0 || values.output_tax_rate > 100) {
      message.error('销项税率必须在0-100之间');
      return;
    }
    
    onOk(values);
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      disabled={isView}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="code"
            label="油品编号"
            rules={[
              { required: true, message: '请输入油品编号' },
              { pattern: /^10\d{4}$/, message: '油品编号为6位数字，以10开头' }
            ]}
          >
            <Input placeholder="请输入6位编号，以10开头" maxLength={6} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="onlineCode"
            label="线上油品编号"
            rules={[{ required: true, message: '请输入线上油品编号' }]}
          >
            <Input placeholder="请输入线上油品编号" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="category"
            label="油品分类"
            rules={[{ required: true, message: '请选择油品分类' }]}
          >
            <Select placeholder="请选择油品分类" allowClear>
              {categoryData.map(item => (
                <Option key={item.id} value={item.id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="oilType"
            label="油品类型"
            rules={[{ required: true, message: '请选择油品类型' }]}
          >
            <Select placeholder="请选择油品分类" allowClear>
              {oilTypeData.map(item => (
                <Option key={item.id} value={item.itemName}>{item.itemName}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="emissionLevel"
            label="排放等级"
            rules={[
              {
                required: currentOilType === '汽油' || currentOilType === '柴油',
                message: '请选择排放等级'
              }
            ]}
          >
            <Select placeholder="请选择排放等级" allowClear>
              {oilStandardData.map(item => (
                <Option key={item.id} value={item.name}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="name"
            label="油品名称"
            rules={[{ required: true, message: '请输入油品名称' }]}
          >
            <Input placeholder="请输入油品名称" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="shortName"
            label="油品简称"
            rules={[{ required: true, message: '请输入油品简称' }]}
          >
            <Input placeholder="请输入油品简称" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="density"
            label="默认密度"
            rules={[{ required: true, message: '请输入默认密度' }]}
          >
            <InputNumber
              placeholder="请输入默认密度"
              min={0.5}
              max={1.0}
              step={0.001}
              precision={3}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
      </Row>

      {/* 财务信息 */}
      <div style={{ 
        margin: '24px 0 16px 0', 
        padding: '12px 16px', 
        background: '#f5f5f5', 
        borderRadius: '4px',
        fontSize: '14px',
        fontWeight: 'bold'
      }}>
        财务信息
      </div>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="input_tax_rate"
            label="进项税（%）"
            rules={[{ required: true, message: '请输入进项税率' }]}
          >
            <InputNumber
              placeholder="请输入进项税率"
              min={0}
              max={100}
              precision={2}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="output_tax_rate"
            label="销项税（%）"
            rules={[{ required: true, message: '请输入销项税率' }]}
          >
            <InputNumber
              placeholder="请输入销项税率"
              min={0}
              max={100}
              precision={2}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="tax_classification"
            label="税收分类"
            rules={[
              {
                pattern: /^\d+$/,
                message: '税收分类只能输入纯数字'
              }
            ]}
          >
            <Input
              placeholder="请输入税收分类编码（纯数字）"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="tax_rate"
            label="税率（%）"
          >
            <InputNumber
              placeholder="请输入税率"
              min={0}
              max={100}
              precision={2}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="erp_product_code"
            label="ERP商品编码"
          >
            <Input
              placeholder="请输入ERP商品编码"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="erp_category_code"
            label="ERP分类编码"
          >
            <Input
              placeholder="请输入ERP分类编码"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
      </Row>

      {!isView && (
        <Form.Item style={{ marginTop: 24, textAlign: 'right' }}>
          <Space>
            <Button onClick={handleCancel}>取消</Button>
            <Button type="primary" htmlType="submit">
              {type === 'create' ? '创建' : '保存'}
            </Button>
          </Space>
        </Form.Item>
      )}

      {isView && (
        <Form.Item style={{ marginTop: 24, textAlign: 'right' }}>
          <Button onClick={handleCancel}>关闭</Button>
        </Form.Item>
      )}
    </Form>
  );
};

export default OilForm; 