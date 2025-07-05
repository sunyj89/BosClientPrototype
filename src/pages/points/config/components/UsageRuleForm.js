import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Select, 
  InputNumber, 
  Switch, 
  Button, 
  Card, 
  Row, 
  Col,
  Table,
  Space,
  Radio,
  Checkbox,
  Divider
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const UsageRuleForm = ({ form, ruleType }) => {
  const [prizes, setPrizes] = useState([
    { key: 1, name: '100积分', type: 'points', probability: 30, quantity: 1000 }
  ]);

  // 奖品类型选项
  const prizeTypes = [
    { value: 'points', label: '积分' },
    { value: 'voucher', label: '代金券' },
    { value: 'product', label: '实物商品' },
    { value: 'service', label: '服务券' }
  ];

  // 油品选项
  const oilTypes = [
    { label: '92#汽油', value: '92' },
    { label: '95#汽油', value: '95' },
    { label: '98#汽油', value: '98' },
    { label: '0#柴油', value: '0' },
    { label: '-10#柴油', value: '-10' }
  ];

  // 商品分类选项
  const productCategories = [
    { label: '饮料', value: 'beverage' },
    { label: '零食', value: 'snack' },
    { label: '日用品', value: 'daily' },
    { label: '汽车用品', value: 'auto' },
    { label: '烟酒', value: 'tobacco' }
  ];

  // 奖品池表格列配置
  const prizeColumns = [
    {
      title: '奖品名称',
      dataIndex: 'name',
      width: 150,
      render: (value, record, index) => (
        <Input
          value={value}
          onChange={(e) => handlePrizeChange(index, 'name', e.target.value)}
          placeholder="奖品名称"
        />
      )
    },
    {
      title: '奖品类型',
      dataIndex: 'type',
      width: 120,
      render: (value, record, index) => (
        <Select
          value={value}
          onChange={(val) => handlePrizeChange(index, 'type', val)}
          placeholder="选择类型"
          style={{ width: '100%' }}
        >
          {prizeTypes.map(type => (
            <Option key={type.value} value={type.value}>
              {type.label}
            </Option>
          ))}
        </Select>
      )
    },
    {
      title: '中奖概率(%)',
      dataIndex: 'probability',
      width: 120,
      render: (value, record, index) => (
        <InputNumber
          value={value}
          onChange={(val) => handlePrizeChange(index, 'probability', val)}
          min={0}
          max={100}
          precision={2}
          style={{ width: '100%' }}
        />
      )
    },
    {
      title: '奖品数量',
      dataIndex: 'quantity',
      width: 120,
      render: (value, record, index) => (
        <InputNumber
          value={value}
          onChange={(val) => handlePrizeChange(index, 'quantity', val)}
          min={1}
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
          onClick={() => removePrize(index)}
          disabled={prizes.length <= 1}
        >
          删除
        </Button>
      )
    }
  ];

  const handlePrizeChange = (index, field, value) => {
    const newPrizes = [...prizes];
    newPrizes[index][field] = value;
    setPrizes(newPrizes);
  };

  const addPrize = () => {
    const newKey = Math.max(...prizes.map(p => p.key)) + 1;
    setPrizes([...prizes, { 
      key: newKey, 
      name: '', 
      type: 'points', 
      probability: 0, 
      quantity: 1 
    }]);
  };

  const removePrize = (index) => {
    if (prizes.length > 1) {
      const newPrizes = prizes.filter((_, i) => i !== index);
      setPrizes(newPrizes);
    }
  };

  // 渲染积分核销规则配置
  const renderRedemptionConfig = () => (
    <div>
      <Card title="全局抵扣规则配置" size="small" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name={['config', 'pointsValue']}
              label="积分现金价值"
              rules={[{ required: true, message: '请设置积分现金价值' }]}
              tooltip="定义多少积分等于1元人民币"
            >
              <InputNumber
                placeholder="请输入积分数量"
                min={1}
                style={{ width: '100%' }}
                addonAfter="积分 = 1元"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={['config', 'globalDiscountLimit']}
              label="全局抵扣上限（按比例）"
              rules={[{ required: true, message: '请设置全局抵扣上限' }]}
              tooltip="每笔订单最多可用积分抵扣总金额的百分比"
            >
              <InputNumber
                placeholder="请输入百分比"
                min={1}
                max={100}
                style={{ width: '100%' }}
                addonAfter="%"
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card title="分类抵扣规则配置" size="small" style={{ marginBottom: 16 }}>
        <Card type="inner" title="油品抵扣规则" size="small" style={{ marginBottom: 12 }}>
          <Form.Item
            name={['config', 'oilTypes']}
            label="适用油品"
            rules={[{ required: true, message: '请选择适用油品' }]}
          >
            <Checkbox.Group options={oilTypes} />
          </Form.Item>
          <Form.Item
            name={['config', 'oilDiscountLimit']}
            label="抵扣上限（按金额）"
            rules={[{ required: true, message: '请设置油品抵扣上限' }]}
            tooltip="单笔加油订单最多可用积分抵扣的固定金额"
          >
            <InputNumber
              placeholder="请输入金额"
              min={1}
              style={{ width: '100%' }}
              addonAfter="元"
            />
          </Form.Item>
        </Card>

        <Card type="inner" title="便利店商品抵扣规则" size="small">
          <Form.Item
            name={['config', 'productCategories']}
            label="适用商品分类"
            rules={[{ required: true, message: '请选择适用商品分类' }]}
          >
            <Checkbox.Group options={productCategories} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={['config', 'productDiscountType']}
                label="抵扣方式"
                rules={[{ required: true, message: '请选择抵扣方式' }]}
              >
                <Radio.Group>
                  <Radio value="ratio">按比例</Radio>
                  <Radio value="amount">按金额</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={['config', 'productDiscountValue']}
                label="抵扣值"
                rules={[{ required: true, message: '请设置抵扣值' }]}
              >
                <InputNumber
                  placeholder="请输入抵扣值"
                  min={1}
                  style={{ width: '100%' }}
                  addonAfter={
                    <Form.Item name={['config', 'productDiscountType']} noStyle>
                      {({ getFieldValue }) => 
                        getFieldValue(['config', 'productDiscountType']) === 'ratio' ? '%' : '元'
                      }
                    </Form.Item>
                  }
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Card>

      <Card title="叠加使用规则配置" size="small">
        <Card type="inner" title="与优惠券叠加" size="small" style={{ marginBottom: 12 }}>
          <Form.Item
            name={['config', 'couponStackRule']}
            label="叠加规则"
            rules={[{ required: true, message: '请选择叠加规则' }]}
          >
            <Radio.Group>
              <Radio value="coupon_first">先券后积分（推荐）</Radio>
              <Radio value="no_stack">不可叠加使用</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name={['config', 'couponStackDesc']}
            label="规则说明"
          >
            <TextArea
              placeholder="请输入规则说明"
              rows={2}
              defaultValue="系统先计算优惠券减免的金额，再用积分抵扣剩余的实付金额"
            />
          </Form.Item>
        </Card>

        <Card type="inner" title="与预付卡叠加" size="small">
          <Form.Item
            name={['config', 'cardStackRule']}
            label="叠加规则"
            rules={[{ required: true, message: '请选择叠加规则' }]}
          >
            <Radio.Group>
              <Radio value="points_first">先积分后卡（推荐）</Radio>
              <Radio value="card_first">先卡后积分</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name={['config', 'cardStackDesc']}
            label="规则说明"
          >
            <TextArea
              placeholder="请输入规则说明"
              rows={2}
              defaultValue="系统先计算积分抵扣的金额，剩余部分再由预付卡余额支付"
            />
          </Form.Item>
        </Card>
      </Card>
    </div>
  );

  // 渲染积分抽奖配置
  const renderLotteryConfig = () => (
    <Card title="积分抽奖配置" size="small">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name={['config', 'costPerDraw']}
            label="单次抽奖消耗积分"
            rules={[{ required: true, message: '请输入单次抽奖消耗积分' }]}
          >
            <InputNumber
              placeholder="请输入消耗积分"
              min={1}
              style={{ width: '100%' }}
              addonAfter="积分/次"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name={['config', 'dailyLimit']}
            label="每日参与上限"
            rules={[{ required: true, message: '请输入每日参与上限' }]}
          >
            <InputNumber
              placeholder="每日最多抽奖次数"
              min={1}
              style={{ width: '100%' }}
              addonAfter="次/天"
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name={['config', 'activityRules']}
        label="活动规则说明"
        rules={[{ required: true, message: '请输入活动规则说明' }]}
      >
        <TextArea
          placeholder="请输入活动规则说明，将显示给用户"
          rows={4}
        />
      </Form.Item>

      <Form.Item label="奖品池配置">
        <Table
          columns={prizeColumns}
          dataSource={prizes}
          pagination={false}
          size="small"
          footer={() => (
            <Button
              type="dashed"
              onClick={addPrize}
              icon={<PlusOutlined />}
              style={{ width: '100%' }}
            >
              添加奖品
            </Button>
          )}
        />
        <div style={{ marginTop: 8, color: '#666', fontSize: '12px' }}>
          提示：所有奖品的中奖概率总和应为100%
        </div>
      </Form.Item>
    </Card>
  );

  // 渲染积分转赠配置
  const renderTransferConfig = () => (
    <Card title="积分转赠配置" size="small">
      <Form.Item
        name={['config', 'enabled']}
        label="功能开关"
        valuePropName="checked"
      >
        <Switch 
          checkedChildren="启用" 
          unCheckedChildren="禁用"
        />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name={['config', 'minTransfer']}
            label="单笔转赠最小值"
            rules={[{ required: true, message: '请输入单笔转赠最小值' }]}
          >
            <InputNumber
              placeholder="最小转赠积分"
              min={1}
              style={{ width: '100%' }}
              addonAfter="积分"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name={['config', 'maxTransfer']}
            label="单笔转赠最大值"
            rules={[{ required: true, message: '请输入单笔转赠最大值' }]}
          >
            <InputNumber
              placeholder="最大转赠积分"
              min={1}
              style={{ width: '100%' }}
              addonAfter="积分"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name={['config', 'dailyLimit']}
            label="每日转赠限制"
            rules={[{ required: true, message: '请输入每日转赠限制' }]}
          >
            <InputNumber
              placeholder="每日转出积分总量上限"
              min={1}
              style={{ width: '100%' }}
              addonAfter="积分/天"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name={['config', 'feeRate']}
            label="手续费率"
            tooltip="按转赠积分的百分比收取手续费"
          >
            <InputNumber
              placeholder="手续费率"
              min={0}
              max={100}
              precision={2}
              style={{ width: '100%' }}
              addonAfter="%"
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name={['config', 'memberLevelRestriction']}
        label="会员等级限制"
        valuePropName="checked"
        tooltip="是否仅限同等级或特定关系的会员之间转赠"
      >
        <Switch 
          checkedChildren="启用" 
          unCheckedChildren="禁用"
        />
      </Form.Item>

      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) => 
          prevValues.config?.memberLevelRestriction !== currentValues.config?.memberLevelRestriction
        }
      >
        {({ getFieldValue }) => {
          const memberLevelRestriction = getFieldValue(['config', 'memberLevelRestriction']);
          
          if (memberLevelRestriction) {
            return (
              <Form.Item
                name={['config', 'restrictionType']}
                label="限制类型"
                rules={[{ required: true, message: '请选择限制类型' }]}
              >
                <Select placeholder="请选择限制类型">
                  <Option value="same_level">仅限同等级会员</Option>
                  <Option value="higher_level">可向高等级会员转赠</Option>
                  <Option value="friend_relation">仅限好友关系</Option>
                </Select>
              </Form.Item>
            );
          }
          return null;
        }}
      </Form.Item>

      <Form.Item
        name={['config', 'transferRules']}
        label="转赠规则说明"
      >
        <TextArea
          placeholder="请输入转赠规则说明，将显示给用户"
          rows={3}
        />
      </Form.Item>
    </Card>
  );

  // 根据规则类型渲染对应的配置表单
  const renderRuleConfig = () => {
    switch (ruleType) {
      case 'lottery':
        return renderLotteryConfig();
      case 'transfer':
        return renderTransferConfig();
      case 'redemption':
        return renderRedemptionConfig();
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

export default UsageRuleForm; 