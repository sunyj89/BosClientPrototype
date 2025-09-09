import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Select, 
  InputNumber, 
  Switch, 
  Button, 
  Space, 
  Card, 
  Row, 
  Col,
  Divider,
  Table,
  Checkbox
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const EarningRuleForm = ({ form, ruleType, onRuleTypeChange }) => {
  const [calculationType, setCalculationType] = useState('fixed_ratio');
  const [ladders, setLadders] = useState([
    { key: 1, min: 0, max: 100, reward: 10 }
  ]);

  // 油品类型选项
  const fuelTypes = [
    '92#汽油', '95#汽油', '98#汽油', '0#柴油', '-10#柴油', '-20#柴油'
  ];

  // 会员等级选项
  const memberLevels = [
    '普通会员', '银卡会员', '金卡会员', '钻石会员'
  ];

  // 支付方式选项
  const paymentMethods = [
    'APP支付', '微信/支付宝', '实体卡', '现金'
  ];

  // 商品分类选项
  const productCategories = [
    '饮料', '零食', '汽车用品', '日用品', '烟酒'
  ];

  // 阶梯表格列配置
  const ladderColumns = [
    {
      title: '阶梯',
      dataIndex: 'key',
      width: 60,
      render: (_, __, index) => index + 1
    },
    {
      title: '起始值',
      dataIndex: 'min',
      width: 120,
      render: (value, record, index) => (
        <InputNumber
          value={value}
          onChange={(val) => handleLadderChange(index, 'min', val)}
          min={0}
          precision={2}
          style={{ width: '100%' }}
        />
      )
    },
    {
      title: '结束值',
      dataIndex: 'max',
      width: 120,
      render: (value, record, index) => (
        <InputNumber
          value={value}
          onChange={(val) => handleLadderChange(index, 'max', val)}
          min={0}
          precision={2}
          style={{ width: '100%' }}
        />
      )
    },
    {
      title: '奖励积分',
      dataIndex: 'reward',
      width: 120,
      render: (value, record, index) => (
        <InputNumber
          value={value}
          onChange={(val) => handleLadderChange(index, 'reward', val)}
          min={0}
          style={{ width: '100%' }}
        />
      )
    },
    {
      title: '操作',
      width: 80,
      render: (_, __, index) => (
        <Button
          type="link"
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => removeLadder(index)}
          disabled={ladders.length <= 1}
        >
          删除
        </Button>
      )
    }
  ];

  const handleLadderChange = (index, field, value) => {
    const newLadders = [...ladders];
    newLadders[index][field] = value;
    setLadders(newLadders);
  };

  const addLadder = () => {
    const newKey = Math.max(...ladders.map(l => l.key)) + 1;
    setLadders([...ladders, { key: newKey, min: 0, max: 0, reward: 0 }]);
  };

  const removeLadder = (index) => {
    if (ladders.length > 1) {
      const newLadders = ladders.filter((_, i) => i !== index);
      setLadders(newLadders);
    }
  };

  // 渲染会员行为规则配置
  const renderMemberBehaviorConfig = () => (
    <Card title="会员行为配置" size="small">
      <Form.Item
        name={['config', 'behaviorType']}
        label="行为类型"
        rules={[{ required: true, message: '请选择行为类型' }]}
      >
        <Select placeholder="请选择行为类型">
          <Option value="register">会员注册</Option>
          <Option value="invite">会员邀请</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name={['config', 'rewardPoints']}
        label="奖励积分"
        rules={[{ required: true, message: '请输入奖励积分' }]}
      >
        <InputNumber
          placeholder="请输入奖励积分"
          min={1}
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) => 
          prevValues.config?.behaviorType !== currentValues.config?.behaviorType
        }
      >
        {({ getFieldValue }) => {
          const behaviorType = getFieldValue(['config', 'behaviorType']);
          
          if (behaviorType === 'invite') {
            return (
              <>
                <Form.Item
                  name={['config', 'inviteeReward']}
                  label="被邀请人奖励"
                >
                  <InputNumber
                    placeholder="被邀请人获得的积分"
                    min={0}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
                
                <Form.Item
                  name={['config', 'effectCondition']}
                  label="生效条件"
                >
                  <Select placeholder="请选择生效条件">
                    <Option value="register">注册后立即生效</Option>
                    <Option value="first_purchase">首次消费后生效</Option>
                  </Select>
                </Form.Item>
                
                <Form.Item
                  name={['config', 'inviteLimit']}
                  label="邀请上限"
                  tooltip="每个会员每月最多可通过邀请获得奖励的次数"
                >
                  <InputNumber
                    placeholder="邀请上限次数"
                    min={1}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </>
            );
          }
          return null;
        }}
      </Form.Item>
    </Card>
  );

  // 渲染加油消费规则配置
  const renderFuelConsumptionConfig = () => (
    <Card title="加油消费配置" size="small">
      <Form.Item
        name={['config', 'fuelTypes']}
        label="适用油品"
        rules={[{ required: true, message: '请选择适用油品' }]}
      >
        <Checkbox.Group options={fuelTypes} />
      </Form.Item>

      <Form.Item
        name={['config', 'memberLevels']}
        label="适用会员等级"
        rules={[{ required: true, message: '请选择适用会员等级' }]}
      >
        <Checkbox.Group options={memberLevels} />
      </Form.Item>

      <Form.Item
        name={['config', 'paymentMethods']}
        label="适用支付方式"
        rules={[{ required: true, message: '请选择适用支付方式' }]}
      >
        <Checkbox.Group options={paymentMethods} />
      </Form.Item>

      <Divider />

      <Form.Item
        name={['config', 'calculationType']}
        label="积分计算方式"
        rules={[{ required: true, message: '请选择积分计算方式' }]}
      >
        <Select 
          placeholder="请选择积分计算方式"
          onChange={setCalculationType}
        >
          <Option value="fixed_ratio">按固定比例计算</Option>
          <Option value="ladder_volume">按阶梯升数计算</Option>
          <Option value="ladder_amount">按阶梯金额计算</Option>
        </Select>
      </Form.Item>

      {calculationType === 'fixed_ratio' && (
        <>
          <Form.Item
            name={['config', 'basis']}
            label="计算基准"
            rules={[{ required: true, message: '请选择计算基准' }]}
          >
            <Select placeholder="请选择计算基准">
              <Option value="amount_original">应付金额（优惠前）</Option>
              <Option value="amount_actual">实付金额（优惠后）</Option>
              <Option value="volume">按升数</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name={['config', 'ratio']}
            label="积分系数"
            rules={[{ required: true, message: '请输入积分系数' }]}
            tooltip="每消费1元或每加1升奖励的积分数"
          >
            <InputNumber
              placeholder="积分系数"
              min={0}
              precision={2}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </>
      )}

      {(calculationType === 'ladder_volume' || calculationType === 'ladder_amount') && (
        <>
          {calculationType === 'ladder_amount' && (
            <Form.Item
              name={['config', 'basis']}
              label="计算基准"
              rules={[{ required: true, message: '请选择计算基准' }]}
            >
              <Select placeholder="请选择计算基准">
                <Option value="amount_original">应付金额（优惠前）</Option>
                <Option value="amount_actual">实付金额（优惠后）</Option>
              </Select>
            </Form.Item>
          )}
          
          <Form.Item label="阶梯配置">
            <Table
              columns={ladderColumns}
              dataSource={ladders}
              pagination={false}
              size="small"
              footer={() => (
                <Button
                  type="dashed"
                  onClick={addLadder}
                  icon={<PlusOutlined />}
                  style={{ width: '100%' }}
                >
                  添加阶梯
                </Button>
              )}
            />
          </Form.Item>
        </>
      )}
    </Card>
  );

  // 渲染便利店消费规则配置
  const renderStoreConsumptionConfig = () => (
    <Card title="便利店消费配置" size="small">
      <Form.Item
        name={['config', 'productSelection']}
        label="商品选择方式"
        rules={[{ required: true, message: '请选择商品选择方式' }]}
      >
        <Select placeholder="请选择商品选择方式">
          <Option value="category">按商品分类</Option>
          <Option value="specific">按具体商品</Option>
        </Select>
      </Form.Item>

      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) => 
          prevValues.config?.productSelection !== currentValues.config?.productSelection
        }
      >
        {({ getFieldValue }) => {
          const productSelection = getFieldValue(['config', 'productSelection']);
          
          if (productSelection === 'category') {
            return (
              <Form.Item
                name={['config', 'productCategories']}
                label="适用商品分类"
                rules={[{ required: true, message: '请选择适用商品分类' }]}
              >
                <Checkbox.Group options={productCategories} />
              </Form.Item>
            );
          } else if (productSelection === 'specific') {
            return (
              <Form.Item
                name={['config', 'specificProducts']}
                label="具体商品"
                rules={[{ required: true, message: '请输入具体商品' }]}
                tooltip="请输入商品编码或名称，多个商品用逗号分隔"
              >
                <TextArea
                  placeholder="请输入商品编码或名称，多个商品用逗号分隔"
                  rows={3}
                />
              </Form.Item>
            );
          }
          return null;
        }}
      </Form.Item>

      <Form.Item
        name={['config', 'memberLevels']}
        label="适用会员等级"
        rules={[{ required: true, message: '请选择适用会员等级' }]}
      >
        <Checkbox.Group options={memberLevels} />
      </Form.Item>

      <Form.Item
        name={['config', 'paymentMethods']}
        label="适用支付方式"
        rules={[{ required: true, message: '请选择适用支付方式' }]}
      >
        <Checkbox.Group options={paymentMethods} />
      </Form.Item>

      <Divider />

      <Form.Item
        name={['config', 'calculationType']}
        label="积分计算方式"
        rules={[{ required: true, message: '请选择积分计算方式' }]}
      >
        <Select placeholder="请选择积分计算方式">
          <Option value="fixed_ratio">按固定比例计算</Option>
          <Option value="fixed_amount">按固定数额奖励</Option>
        </Select>
      </Form.Item>

      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) => 
          prevValues.config?.calculationType !== currentValues.config?.calculationType
        }
      >
        {({ getFieldValue }) => {
          const calcType = getFieldValue(['config', 'calculationType']);
          
          if (calcType === 'fixed_ratio') {
            return (
              <>
                <Form.Item
                  name={['config', 'basis']}
                  label="计算基准"
                  rules={[{ required: true, message: '请选择计算基准' }]}
                >
                  <Select placeholder="请选择计算基准">
                    <Option value="amount_original">应付金额（优惠前）</Option>
                    <Option value="amount_actual">实付金额（优惠后）</Option>
                    <Option value="quantity">按件数</Option>
                  </Select>
                </Form.Item>
                
                <Form.Item
                  name={['config', 'ratio']}
                  label="积分系数"
                  rules={[{ required: true, message: '请输入积分系数' }]}
                  tooltip="每消费1元或每购买1件奖励的积分数"
                >
                  <InputNumber
                    placeholder="积分系数"
                    min={0}
                    precision={2}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </>
            );
          } else if (calcType === 'fixed_amount') {
            return (
              <>
                <Form.Item
                  name={['config', 'triggerCondition']}
                  label="触发条件"
                  rules={[{ required: true, message: '请选择触发条件' }]}
                >
                  <Select placeholder="请选择触发条件">
                    <Option value="any">购买任意一件指定商品</Option>
                    <Option value="all">同时购买所有指定商品</Option>
                  </Select>
                </Form.Item>
                
                <Form.Item
                  name={['config', 'rewardPoints']}
                  label="奖励积分"
                  rules={[{ required: true, message: '请输入奖励积分' }]}
                >
                  <InputNumber
                    placeholder="固定奖励积分数"
                    min={1}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </>
            );
          }
          return null;
        }}
      </Form.Item>
    </Card>
  );

  // 根据规则类型渲染对应的配置表单
  const renderRuleConfig = () => {
    switch (ruleType) {
      case 'member_behavior':
        return renderMemberBehaviorConfig();
      case 'fuel_consumption':
        return renderFuelConsumptionConfig();
      case 'store_consumption':
        return renderStoreConsumptionConfig();
      default:
        return null;
    }
  };

  return (
    <div>
      {renderRuleConfig()}
    </div>
  );
};

export default EarningRuleForm; 