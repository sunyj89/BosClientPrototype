import React, { useEffect, useState } from 'react';
import { Form, Input, Select, InputNumber, Button, Space, Row, Col, TreeSelect } from 'antd';

const { Option } = Select;

const OilForm = ({ visible, type, data, onOk, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentOilType, setCurrentOilType] = useState('');
  const isView = type === 'view';

  // 模拟分类数据 - 根据提示词记录修正分类结构
  const categoryTreeData = [
    {
      title: '油品',
      value: '1',
      categoryId: 'OIL',
      level: 1,
      children: [
        {
          title: '汽油',
          value: '1-1',
          categoryId: 'GAS',
          level: 2,
          parentCategoryId: 'OIL',
          parentCategoryName: '油品',
          children: [
            {
              title: '92号',
              value: '1-1-1',
              categoryId: 'GAS92',
              level: 3,
              parentCategoryId: 'GAS',
              parentCategoryName: '汽油',
              oilType: '汽油'
            },
            {
              title: '95号',
              value: '1-1-2',
              categoryId: 'GAS95',
              level: 3,
              parentCategoryId: 'GAS',
              parentCategoryName: '汽油',
              oilType: '汽油'
            },
            {
              title: '98号',
              value: '1-1-3',
              categoryId: 'GAS98',
              level: 3,
              parentCategoryId: 'GAS',
              parentCategoryName: '汽油',
              oilType: '汽油'
            },
            {
              title: '101号',
              value: '1-1-4',
              categoryId: 'GAS101',
              level: 3,
              parentCategoryId: 'GAS',
              parentCategoryName: '汽油',
              oilType: '汽油'
            }
          ]
        },
        {
          title: '柴油',
          value: '1-2',
          categoryId: 'DIESEL',
          level: 2,
          parentCategoryId: 'OIL',
          parentCategoryName: '油品',
          children: [
            {
              title: '10号',
              value: '1-2-1',
              categoryId: 'DIESEL10',
              level: 3,
              parentCategoryId: 'DIESEL',
              parentCategoryName: '柴油',
              oilType: '柴油'
            },
            {
              title: '5号',
              value: '1-2-2',
              categoryId: 'DIESEL5',
              level: 3,
              parentCategoryId: 'DIESEL',
              parentCategoryName: '柴油',
              oilType: '柴油'
            },
            {
              title: '0号',
              value: '1-2-3',
              categoryId: 'DIESEL0',
              level: 3,
              parentCategoryId: 'DIESEL',
              parentCategoryName: '柴油',
              oilType: '柴油'
            },
            {
              title: '-10号',
              value: '1-2-4',
              categoryId: 'DIESEL-10',
              level: 3,
              parentCategoryId: 'DIESEL',
              parentCategoryName: '柴油',
              oilType: '柴油'
            },
            {
              title: '-20号',
              value: '1-2-5',
              categoryId: 'DIESEL-20',
              level: 3,
              parentCategoryId: 'DIESEL',
              parentCategoryName: '柴油',
              oilType: '柴油'
            },
            {
              title: '-35号',
              value: '1-2-6',
              categoryId: 'DIESEL-35',
              level: 3,
              parentCategoryId: 'DIESEL',
              parentCategoryName: '柴油',
              oilType: '柴油'
            }
          ]
        }
      ]
    },
    {
      title: '天然气',
      value: '2',
      categoryId: 'NATURAL_GAS',
      level: 1,
      children: [
        {
          title: '车用天然气',
          value: '2-1',
          categoryId: 'VEHICLE_GAS',
          level: 2,
          parentCategoryId: 'NATURAL_GAS',
          parentCategoryName: '天然气',
          children: [
            {
              title: 'LNG液化天然气',
              value: '2-1-1',
              categoryId: 'LNG',
              level: 3,
              parentCategoryId: 'VEHICLE_GAS',
              parentCategoryName: '车用天然气',
              oilType: '天然气'
            },
            {
              title: 'CNG压缩天然气',
              value: '2-1-2',
              categoryId: 'CNG',
              level: 3,
              parentCategoryId: 'VEHICLE_GAS',
              parentCategoryName: '车用天然气',
              oilType: '天然气'
            }
          ]
        }
      ]
    },
    {
      title: '尾气处理液',
      value: '3',
      categoryId: 'EXHAUST_FLUID',
      level: 1,
      children: [
        {
          title: '柴油机尾气处理液',
          value: '3-1',
          categoryId: 'DIESEL_EXHAUST_FLUID',
          level: 2,
          parentCategoryId: 'EXHAUST_FLUID',
          parentCategoryName: '尾气处理液',
          children: [
            {
              title: '桶装车用尿素',
              value: '3-1-1',
              categoryId: 'BARREL_UREA',
              level: 3,
              parentCategoryId: 'DIESEL_EXHAUST_FLUID',
              parentCategoryName: '柴油机尾气处理液',
              oilType: '尿素'
            },
            {
              title: '散装车用尿素',
              value: '3-1-2',
              categoryId: 'BULK_UREA',
              level: 3,
              parentCategoryId: 'DIESEL_EXHAUST_FLUID',
              parentCategoryName: '柴油机尾气处理液',
              oilType: '尿素'
            }
          ]
        }
      ]
    }
  ];

  // 汽油排放标准
  const gasolineStandards = [
    { value: '国V', label: '国V' },
    { value: '国VIA', label: '国VIA' },
    { value: '国VIB', label: '国VIB' },
    { value: '乙醇E10', label: '乙醇E10' }
  ];

  // 柴油排放标准
  const dieselStandards = [
    { value: '国V', label: '国V' },
    { value: '国VIA', label: '国VIA' },
    { value: '国VIB', label: '国VIB' }
  ];

  // 其他燃料排放标准
  const otherStandards = [
    { value: '国V', label: '国V' },
    { value: '国VIA', label: '国VIA' }
  ];

  // 生成油品名称 - 支持新的分类类型
  const generateOilName = (categoryValue, oilType, emissionLevel) => {
    if (!categoryValue || !emissionLevel) return '';

    const selectedCategory = findCategoryByValue(categoryTreeData, categoryValue);
    if (!selectedCategory) return '';

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
        const oilType = data.oilType || getOilTypeFromCategory(data.categoryKey);
        setCurrentOilType(oilType);
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

  // 从分类获取油品类型
  const getOilTypeFromCategory = (categoryValue) => {
    const category = findCategoryByValue(categoryTreeData, categoryValue);
    return category?.oilType || '';
  };

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
    const selectedCategory = findCategoryByValue(categoryTreeData, value);
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

  // 油品类型选项 - 增加新的类型
  const oilTypeOptions = [
    { label: '汽油', value: '汽油' },
    { label: '柴油', value: '柴油' },
    { label: '天然气', value: '天然气' },
    { label: '尿素', value: '尿素' },
    { label: '其他', value: '其他' }
  ];

  // 排放等级选项
  const emissionLevelOptions = [
    // 汽油排放标准
    { label: '国V', value: '国V' },
    { label: '国VIA', value: '国VIA' },
    { label: '国VIB', value: '国VIB' },
    { label: '乙醇E10', value: '乙醇E10' }
  ];

  // 柴油排放等级选项
  const dieselEmissionOptions = [
    { label: '国V', value: '国V' },
    { label: '国VIA', value: '国VIA' },
    { label: '国VIB', value: '国VIB' }
  ];

  // 根据油品类型获取排放等级选项
  const getEmissionOptions = () => {
    if (currentOilType === '柴油') {
      return dieselEmissionOptions;
    } else if (currentOilType === '汽油') {
      return emissionLevelOptions;
    } else {
      // 天然气和尿素等其他类型不需要排放等级
      return [];
    }
  };

  const handleSubmit = (values) => {
    onOk(values);
    form.resetFields();
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
            <TreeSelect
              style={{ width: '100%' }}
              placeholder="请选择油品分类"
              treeData={categoryTreeData}
              treeDefaultExpandAll
              onChange={handleCategoryChange}
            />
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
            <Select placeholder="请选择油品类型" onChange={handleOilTypeChange}>
              <Option value="汽油">汽油</Option>
              <Option value="柴油">柴油</Option>
              <Option value="天然气">天然气</Option>
              <Option value="尿素">尿素</Option>
              <Option value="其他">其他</Option>
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
            <Select 
              placeholder="请选择排放等级"
              onChange={handleEmissionLevelChange}
              disabled={currentOilType !== '汽油' && currentOilType !== '柴油'}
            >
              {getEmissionOptions().map(standard => (
                <Option key={standard.value} value={standard.value}>
                  {standard.label}
                </Option>
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
            <Input placeholder="系统将根据分类和排放等级自动生成" />
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