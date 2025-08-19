import React, { useState, useEffect } from 'react';
import { Form, Select, InputNumber, Button, Space, Row, Col, message, List, Card, Divider, Tooltip } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import oilMasterData from '../../../../mock/oil/master-data.json';

const { Option } = Select;

const RulesConfigForm = ({ onPrev, onFinish, basicInfo, isEdit = false }) => {
  const [form] = Form.useForm();
  const [rules, setRules] = useState((basicInfo && basicInfo.rules) || []);
  const [oilOptions, setOilOptions] = useState([]);
  
  useEffect(() => {
    if (oilMasterData && oilMasterData.oilList) {
      setOilOptions(oilMasterData.oilList);
    }

    if (isEdit && basicInfo) {
      form.setFieldsValue({
        calculateMethod: basicInfo.calculateMethod,
        discountForm: basicInfo.discountForm,
        dailyLimit: basicInfo.dailyLimit,
        totalLimit: basicInfo.totalLimit
      });
      setRules(basicInfo.rules || []);
    }
  }, [basicInfo, isEdit, form]);

  const handleFinish = (values) => {
    if (rules.length === 0) {
      message.error('请至少配置一条优惠规则');
      return;
    }
    const finalData = { ...basicInfo, ...values, rules };
    message.success('优惠规则配置完成');
    onFinish(finalData);
  };
  
  const handleAddOilRule = () => {
    form.validateFields(['selectedOil']).then(values => {
      const { selectedOil } = values;
      const oil = oilOptions.find(o => o.code === selectedOil);
      
      if ((rules || []).some(rule => rule.oilCode === selectedOil)) {
        message.warning('该油品已配置规则，请直接编辑');
        return;
      }

      if (oil) {
        setRules([...rules, { 
          oilCode: oil.code, 
          oilName: oil.name, 
          conditions: [{ rangeType: '升数', minAmount: 0, maxAmount: 50000, discountValue: 0, unit: '元/升' }] 
        }]);
        form.resetFields(['selectedOil']);
      }
    });
  };

  const handleAddCondition = (oilCode) => {
    const newRules = (rules || []).map(rule => {
      if (rule.oilCode === oilCode) {
        if (rule.conditions.length >= 10) {
          message.warning('同一油品最多添加10条优惠规则');
          return rule;
        }
        return {
          ...rule,
          conditions: [...rule.conditions, { rangeType: '升数', minAmount: 0, maxAmount: 50000, discountValue: 0, unit: '元/升' }]
        };
      }
      return rule;
    });
    setRules(newRules);
  };

  const handleRemoveCondition = (oilCode, conditionIndex) => {
    const newRules = (rules || []).map(rule => {
      if (rule.oilCode === oilCode) {
        if (rule.conditions.length === 1) {
          // 如果只剩最后一条，则删除整个油品规则
          return null;
        }
        return {
          ...rule,
          conditions: rule.conditions.filter((_, index) => index !== conditionIndex)
        };
      }
      return rule;
    }).filter(Boolean);
    setRules(newRules);
  };

  const handleConditionChange = (oilCode, conditionIndex, field, value) => {
    const newRules = (rules || []).map(rule => {
      if (rule.oilCode === oilCode) {
        const newConditions = (rule.conditions || []).map((cond, index) => {
          if (index === conditionIndex) {
            const updatedCond = { ...cond, [field]: value };
            if (field === 'rangeType') {
              updatedCond.unit = value === '金额' ? '折扣' : '元/升';
            }
            return updatedCond;
          }
          return cond;
        });
        return { ...rule, conditions: newConditions };
      }
      return rule;
    });
    setRules(newRules);
  };

  return (
    <div>
      <h3>第二步：配置优惠规则</h3>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="calculateMethod"
              label="优惠计算方式"
              rules={[{ required: true, message: '请选择计算方式' }]}
            >
              <Select placeholder="请选择计算方式">
                <Option value="按原价">按原价</Option>
                <Option value="按升数">按升数</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="discountForm"
              label="优惠形式"
              rules={[{ required: true, message: '请选择优惠形式' }]}
            >
              <Select placeholder="请选择优惠形式">
                <Option value="每升直降">每升直降</Option>
                <Option value="折扣优惠">折扣优惠</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="dailyLimit"
              label="每日限制次数"
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="不填表示不限制"
                min={1}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="totalLimit"
              label="活动总限制次数"
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="不填表示不限制"
                min={1}
              />
            </Form.Item>
          </Col>
        </Row>
        
        <Divider />

        <h4>设置油品优惠规则</h4>
        
        <Row gutter={16} align="bottom">
          <Col span={18}>
            <Form.Item
              name="selectedOil"
              label="选择油品添加规则"
              rules={[{ required: rules.length === 0, message: '请至少选择一个油品' }]}
            >
              <Select
                showSearch
                placeholder="搜索并选择油品"
                optionFilterProp="children"
              >
                {oilOptions.map(oil => (
                  <Option key={oil.code} value={oil.code}>{oil.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item>
              <Button 
                type="dashed" 
                onClick={handleAddOilRule} 
                icon={<PlusOutlined />}
                block
              >
                添加油品规则
              </Button>
            </Form.Item>
          </Col>
        </Row>
        
        <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '16px' }}>
          {rules && rules.map((rule, ruleIndex) => (
            <Card key={rule.oilCode} title={rule.oilName} style={{ marginBottom: 16 }}>
              {rule.conditions && rule.conditions.map((condition, conditionIndex) => (
                <Row key={conditionIndex} gutter={16} align="middle" style={{ marginBottom: 8 }}>
                  <Col span={5}>
                    <Select value={condition.rangeType} onChange={(value) => handleConditionChange(rule.oilCode, conditionIndex, 'rangeType', value)}>
                      <Option value="金额">金额(元)</Option>
                      <Option value="升数">升数(升)</Option>
                    </Select>
                  </Col>
                  <Col span={5}>
                    <InputNumber
                      placeholder="最小范围"
                      value={condition.minAmount}
                      onChange={(value) => handleConditionChange(rule.oilCode, conditionIndex, 'minAmount', value)}
                      min={0}
                      style={{ width: '100%' }}
                    />
                  </Col>
                  <Col span={5}>
                    <InputNumber
                      placeholder="最大范围"
                      value={condition.maxAmount}
                      onChange={(value) => handleConditionChange(rule.oilCode, conditionIndex, 'maxAmount', value)}
                      min={condition.minAmount + 1}
                      style={{ width: '100%' }}
                    />
                  </Col>
                  <Col span={5}>
                    <InputNumber
                      placeholder="优惠值"
                      value={condition.discountValue}
                      onChange={(value) => handleConditionChange(rule.oilCode, conditionIndex, 'discountValue', value)}
                      min={0}
                      max={condition.unit === '元/升' ? 10 : 1}
                      step={0.01}
                      addonAfter={condition.unit}
                      style={{ width: '100%' }}
                    />
                  </Col>
                  <Col span={4}>
                    <Space>
                      {conditionIndex === rule.conditions.length - 1 && (
                        <Tooltip title="添加分级">
                          <Button 
                            icon={<PlusOutlined />} 
                            onClick={() => handleAddCondition(rule.oilCode)}
                          />
                        </Tooltip>
                      )}
                      <Tooltip title="删除">
                        <Button 
                          icon={<DeleteOutlined />} 
                          danger
                          onClick={() => handleRemoveCondition(rule.oilCode, conditionIndex)}
                        />
                      </Tooltip>
                    </Space>
                  </Col>
                </Row>
              ))}
            </Card>
          ))}
        </div>

        <div className="step-actions" style={{ marginTop: 24 }}>
          <Space>
            <Button onClick={onPrev}>
              上一步
            </Button>
            <Button type="primary" htmlType="submit">
              完成配置
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  );
};

export default RulesConfigForm;
