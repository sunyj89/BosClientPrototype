import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Steps, 
  Form, 
  Input, 
  Radio, 
  Checkbox, 
  Select, 
  TreeSelect,
  InputNumber, 
  Button, 
  Space, 
  Row, 
  Col, 
  Card, 
  DatePicker, 
  TimePicker, 
  message,
  Divider
} from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { getStationList } from '../services/api';
import { generateCouponId } from '../utils/utils';

const { TextArea } = Input;

const { Step } = Steps;
const { Option } = Select;
const { RangePicker } = DatePicker;

const CouponCreateModal = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [stationList, setStationList] = useState([]);
  const [couponData, setCouponData] = useState({});

  // 步骤配置
  const steps = [
    {
      title: '优惠券基本信息',
      description: '设置优惠券基础配置',
    },
    {
      title: '时间设置',
      description: '设置有效期和使用限制',
    },
  ];

  // 油品选项
  const oilTypes = [
    { value: '92#', label: '92#汽油' },
    { value: '95#', label: '95#汽油' },
    { value: '98#', label: '98#汽油' },
    { value: '0#', label: '0#柴油' },
    { value: 'urea', label: '尿素' },
  ];

  // 加载油站数据
  const loadStationData = async () => {
    try {
      const response = await getStationList();
      setStationList(response.data || []);
    } catch (error) {
      console.error('加载油站数据失败:', error);
    }
  };

  // 处理TreeSelect选择变化
  const handleStationSelectChange = (value, labelList, extra) => {
    // 安全检查
    if (!value || !Array.isArray(value)) {
      form.setFieldsValue({ stationIds: [] });
      return;
    }

    const { triggerNode, checked } = extra || {};
    let finalValues = [...value];

    // 确保stationList数据存在
    if (!stationList.serviceAreas || !stationList.stations) {
      finalValues = finalValues.filter(v => v && typeof v === 'string' && !v.startsWith('branch_') && !v.startsWith('serviceArea_'));
      form.setFieldsValue({ stationIds: finalValues });
      return;
    }

    if (triggerNode && triggerNode.type) {
      if (triggerNode.type === 'branch') {
        // 选择分公司时，获取该分公司下所有正常油站
        const branchId = triggerNode.originalId;
        const branchServiceAreas = stationList.serviceAreas.filter(sa => sa && sa.branchId === branchId);
        const branchStations = stationList.stations.filter(station => 
          station && branchServiceAreas.some(sa => sa.id === station.serviceAreaId) && station.status === '正常'
        );
        
        if (checked) {
          // 添加该分公司下所有正常油站
          const stationIds = branchStations.map(station => station.id).filter(id => id);
          finalValues = [...new Set([
            ...finalValues.filter(v => v && typeof v === 'string' && !v.startsWith('branch_')), 
            ...stationIds
          ])];
        } else {
          // 移除该分公司下所有油站
          const stationIds = branchStations.map(station => station.id).filter(id => id);
          finalValues = finalValues.filter(v => 
            v && typeof v === 'string' && !stationIds.includes(v) && !v.startsWith('branch_')
          );
        }
      } else if (triggerNode.type === 'serviceArea') {
        // 选择服务区时，获取该服务区下所有正常油站
        const serviceAreaId = triggerNode.originalId;
        const areaStations = stationList.stations.filter(station => 
          station && station.serviceAreaId === serviceAreaId && station.status === '正常'
        );
        
        if (checked) {
          // 添加该服务区下所有正常油站
          const stationIds = areaStations.map(station => station.id).filter(id => id);
          finalValues = [...new Set([
            ...finalValues.filter(v => v && typeof v === 'string' && !v.startsWith('serviceArea_')), 
            ...stationIds
          ])];
        } else {
          // 移除该服务区下所有油站
          const stationIds = areaStations.map(station => station.id).filter(id => id);
          finalValues = finalValues.filter(v => 
            v && typeof v === 'string' && !stationIds.includes(v) && !v.startsWith('serviceArea_')
          );
        }
      }
    }

    // 过滤掉分公司和服务区的值，只保留具体油站ID
    finalValues = finalValues.filter(v => 
      v && typeof v === 'string' && !v.startsWith('branch_') && !v.startsWith('serviceArea_')
    );
    
    // 更新表单字段
    form.setFieldsValue({ stationIds: finalValues });
  };

  // 构建树形数据
  const buildStationTreeData = () => {
    if (!stationList || !stationList.branches || !stationList.serviceAreas || !stationList.stations) {
      return [];
    }

    return stationList.branches.filter(branch => branch && branch.id).map(branch => {
      // 找到该分公司下的服务区
      const branchServiceAreas = stationList.serviceAreas.filter(sa => sa && sa.branchId === branch.id);
      
      const children = branchServiceAreas.map(serviceArea => {
        // 找到该服务区下的油站
        const areaStations = stationList.stations.filter(station => 
          station && station.serviceAreaId === serviceArea.id
        );
        
        const stationChildren = areaStations.map(station => ({
          title: `${station.name || '未知油站'} ${station.status !== '正常' ? `(${station.status || '状态未知'})` : ''}`,
          value: station.id,
          key: station.id,
          isLeaf: true,
          disabled: station.status !== '正常', // 非正常状态的油站不可选
          type: 'station'
        }));

        return {
          title: `${serviceArea.name || '未知服务区'} (${areaStations.length}个油站)`,
          value: `serviceArea_${serviceArea.id}`, // 添加前缀区分类型
          key: `serviceArea_${serviceArea.id}`,
          children: stationChildren,
          type: 'serviceArea',
          originalId: serviceArea.id
        };
      });

      // 计算该分公司下所有正常油站数量
      const normalStationsCount = stationList.stations.filter(station => 
        station && branchServiceAreas.some(sa => sa && sa.id === station.serviceAreaId) && station.status === '正常'
      ).length;

      return {
        title: `${branch.name || '未知分公司'} (${normalStationsCount}个正常油站)`,
        value: `branch_${branch.id}`, // 添加前缀区分类型
        key: `branch_${branch.id}`,
        children: children,
        type: 'branch',
        originalId: branch.id
      };
    });
  };

  // 生成优惠券ID
  const generateNewCouponId = () => {
    const couponId = generateCouponId();
    form.setFieldsValue({ couponId });
  };

  // 下一步
  const handleNext = async () => {
    try {
      const values = await form.validateFields();
      setCouponData({ ...couponData, ...values });
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 上一步
  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  // 保存
  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const finalData = { ...couponData, ...values };
      
      // TODO: 调用API保存优惠券
      console.log('保存优惠券数据:', finalData);
      
      message.success('优惠券创建成功');
      onSuccess();
      handleCancel();
    } catch (error) {
      message.error('创建失败');
    } finally {
      setLoading(false);
    }
  };

  // 取消
  const handleCancel = () => {
    form.resetFields();
    setCurrentStep(0);
    setCouponData({});
    onCancel();
  };

  // 初始化
  useEffect(() => {
    if (visible) {
      loadStationData();
      generateNewCouponId();
    }
  }, [visible]);

  // 渲染步骤1：基本信息
  const renderStep1 = () => (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        stationRestriction: 'all', // 默认全选油站
        couponId: generateCouponId(),
        usageConditions: [], // 初始化使用条件为空数组
        dailyTimeSlots: [],
        weeklyTimeSlots: [],
        monthlyTimeSlots: [],
      }}
    >
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            name="couponId"
            label="优惠券ID"
            rules={[{ required: true, message: '请输入优惠券ID' }]}
          >
            <Input disabled placeholder="自动生成" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="name"
            label="券名称"
            rules={[{ required: true, message: '请输入券名称' }]}
          >
            <Input placeholder="请输入券名称" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            name="type"
            label="券类型"
            rules={[{ required: true, message: '请选择券类型' }]}
          >
            <Radio.Group>
              <Radio value="oil">油品券</Radio>
              <Radio value="goods">非油券</Radio>
              <Radio value="recharge">充值赠金券</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="usageScenario"
            label="使用场景"
            rules={[{ required: true, message: '请选择使用场景' }]}
          >
            <Checkbox.Group>
              <Checkbox value="online">线上核销</Checkbox>
              <Checkbox value="offline">线下核销</Checkbox>
            </Checkbox.Group>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="paymentRestriction"
        label="支付方式限制"
        rules={[{ required: true, message: '请选择支付方式限制' }]}
      >
        <Radio.Group>
          <Radio value="none">不限制</Radio>
          <Radio value="card_only">仅电子储值卡可用</Radio>
          <Radio value="card_exclude">电子储值卡不可用</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        name="stationRestriction"
        label="油站限制"
        rules={[{ required: true, message: '请选择油站限制' }]}
      >
        <Radio.Group>
          <Radio value="all">全部油站</Radio>
          <Radio value="selected">指定油站</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) => 
          prevValues.stationRestriction !== currentValues.stationRestriction
        }
      >
        {({ getFieldValue }) => {
          return getFieldValue('stationRestriction') === 'selected' && (
            <Form.Item
              name="stationIds"
              label="选择油站"
              rules={[{ required: true, message: '请选择油站' }]}
            >
              <Form.Item noStyle shouldUpdate={(prev, curr) => prev.stationIds !== curr.stationIds}>
                {({ getFieldValue }) => {
                  const selectedStationIds = getFieldValue('stationIds') || [];
                  const validStationIds = selectedStationIds.filter(id => 
                    id && typeof id === 'string' && !id.startsWith('branch_') && !id.startsWith('serviceArea_')
                  );
                  
                  if (validStationIds.length > 0) {
                    return (
                      <div style={{ 
                        marginBottom: '8px', 
                        padding: '8px 12px', 
                        background: '#f6ffed', 
                        border: '1px solid #b7eb8f',
                        borderRadius: '4px',
                        fontSize: '13px',
                        color: '#389e0d'
                      }}>
                        ✅ 已选择 <strong>{validStationIds.length}</strong> 个油站
                      </div>
                    );
                  }
                  return null;
                }}
              </Form.Item>
              <TreeSelect
                multiple
                showSearch
                style={{ width: '100%' }}
                placeholder="请选择油站（支持多选分公司、服务区或具体油站）"
                allowClear
                treeCheckable
                showCheckedStrategy={TreeSelect.SHOW_CHILD}
                treeCheckStrictly={false}
                treeDefaultExpandAll={false}
                treeExpandedKeys={undefined}
                searchPlaceholder="搜索分公司、服务区或油站名称"
                filterTreeNode={(search, node) => {
                  return node.title && node.title.toLowerCase().indexOf(search.toLowerCase()) >= 0;
                }}
                onChange={handleStationSelectChange}
                treeData={buildStationTreeData()}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeNodeFilterProp="title"
                maxTagCount="responsive"
                                tagRender={(props) => {
                  const { label, value, closable, onClose } = props;
                  
                  // 安全检查：确保value存在且为字符串
                  if (!value || typeof value !== 'string') {
                    return null;
                  }
                  
                  // 只显示具体油站名称，不显示分公司和服务区
                  if (value.startsWith('branch_') || value.startsWith('serviceArea_')) {
                    return null;
                  }
                  
                  // 获取油站详细信息
                  const station = stationList.stations?.find(s => s.id === value);
                  const displayName = station ? `${station.name}` : (label || value);
                  
                  return (
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        margin: '2px',
                        background: '#f0f0f0',
                        borderRadius: '4px',
                        fontSize: '12px',
                        maxWidth: '150px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                      title={displayName}
                    >
                      {displayName}
                      {closable && (
                        <span
                          style={{ marginLeft: '4px', cursor: 'pointer' }}
                          onClick={onClose}
                        >
                          ×
                        </span>
                      )}
                    </span>
                  );
                }}
               />
               <div style={{ 
                 marginTop: '8px', 
                 fontSize: '12px', 
                 color: '#666',
                 lineHeight: '1.4'
               }}>
                 <div>📍 <strong>选择说明：</strong></div>
                 <div>• 选择<strong>分公司</strong>：自动包含该分公司下所有正常油站</div>
                 <div>• 选择<strong>服务区</strong>：自动包含该服务区下所有正常油站</div>
                 <div>• 选择<strong>具体油站</strong>：仅包含选中的油站</div>
                 <div>• 支持<strong>搜索</strong>：可按名称快速查找</div>
               </div>
            </Form.Item>
          );
        }}
      </Form.Item>



      <Form.Item label="使用限制">
        <Form.List name="usageConditions">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} style={{ marginBottom: 12, padding: 12, border: '1px solid #d9d9d9', borderRadius: 6, backgroundColor: '#fafafa' }}>
                  <Row gutter={8} align="middle">
                    <Col span={6}>
                      <Form.Item
                        {...restField}
                        name={[name, 'oilType']}
                        style={{ marginBottom: 0 }}
                        rules={[{ required: true, message: '请选择油品' }]}
                      >
                        <Select placeholder="请选择油品" size="small">
                          <Option value="92#">国五92#车用汽油</Option>
                          <Option value="95#">国五95#车用汽油</Option>
                          <Option value="98#">国五98#车用汽油</Option>
                          <Option value="0#">国五0#车用柴油</Option>
                          <Option value="urea">尿素</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item
                        {...restField}
                        name={[name, 'conditionType']}
                        style={{ marginBottom: 0 }}
                        rules={[{ required: true, message: '请选择条件类型' }]}
                      >
                        <Select placeholder="条件类型" size="small">
                          <Option value="original">原价</Option>
                          <Option value="actual">实付</Option>
                          <Option value="volume">升数</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={1} style={{ textAlign: 'center', paddingTop: 4 }}>
                      <span style={{ fontSize: '14px' }}>满</span>
                    </Col>
                    <Col span={4}>
                      <Form.Item
                        {...restField}
                        name={[name, 'value']}
                        style={{ marginBottom: 0 }}
                        rules={[{ required: true, message: '请输入条件值' }]}
                      >
                        <InputNumber 
                          min={0} 
                          style={{ width: '100%' }} 
                          size="small"
                          placeholder="金额"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={7} style={{ textAlign: 'left', paddingTop: 4 }}>
                      <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) => {
                          const prevCondition = prevValues.usageConditions?.[name]?.conditionType;
                          const currentCondition = currentValues.usageConditions?.[name]?.conditionType;
                          return prevCondition !== currentCondition;
                        }}
                      >
                        {({ getFieldValue }) => {
                          const conditionType = getFieldValue(['usageConditions', name, 'conditionType']);
                          const couponType = getFieldValue('type'); // 获取优惠券类型
                          
                          let unit = '';
                          if (conditionType === 'original' || conditionType === 'actual') {
                            unit = '元';
                            // 如果是油品券，显示升数选项
                            if (couponType === 'oil') {
                              unit += ' (升)';
                            }
                          } else if (conditionType === 'volume') {
                            unit = '升';
                          }
                          return <span style={{ fontSize: '12px', color: '#666' }}>{unit}</span>;
                        }}
                      </Form.Item>
                    </Col>
                    <Col span={2} style={{ textAlign: 'center', paddingTop: 4 }}>
                      <Button 
                        type="text" 
                        danger 
                        size="small"
                        onClick={() => remove(name)}
                        style={{ 
                          padding: 0, 
                          minWidth: 'auto',
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="删除此条件"
                      >
                        删除
                      </Button>
                    </Col>
                  </Row>
                </div>
              ))}
              <Form.Item style={{ marginBottom: 0 }}>
                <Button 
                  type="dashed" 
                  onClick={() => add()} 
                  block 
                  icon={<PlusOutlined />}
                  size="small"
                >
                  添加
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form.Item>

      <Form.Item
        name="amountType"
        label="券面额类型"
        rules={[{ required: true, message: '请选择券面额类型' }]}
      >
        <Radio.Group>
          <Radio value="fixed">固定金额</Radio>
          <Radio value="random">随机金额</Radio>
          <Radio value="discount">固定折扣</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) => 
          prevValues.amountType !== currentValues.amountType
        }
      >
        {({ getFieldValue }) => {
          const amountType = getFieldValue('amountType');
          
          if (amountType === 'fixed') {
            return (
              <Form.Item
                name="fixedAmount"
                label="固定金额（元）"
                rules={[{ required: true, message: '请输入固定金额' }]}
              >
                <InputNumber min={0} style={{ width: 200 }} />
              </Form.Item>
            );
          }
          
          if (amountType === 'random') {
            return (
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="randomAmountMin"
                    label="最小金额（元）"
                    rules={[{ required: true, message: '请输入最小金额' }]}
                  >
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="randomAmountMax"
                    label="最大金额（元）"
                    rules={[{ required: true, message: '请输入最大金额' }]}
                  >
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
            );
          }
          
          if (amountType === 'discount') {
            return (
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="discountRate"
                    label="折扣（几折）"
                    rules={[{ required: true, message: '请输入折扣' }]}
                  >
                    <InputNumber min={0.1} max={9.9} step={0.1} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="maxDiscountAmount"
                    label="最大优惠金额（元）"
                  >
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
            );
          }
          
          return null;
        }}
      </Form.Item>
    </Form>
  );

  // 渲染步骤2：时间设置
  const renderStep2 = () => (
    <Form
      form={form}
      layout="vertical"
    >
      <Form.Item
        name="validityType"
        label="券有效期"
        rules={[{ required: true, message: '请选择有效期类型' }]}
      >
        <Radio.Group>
          <Radio value="range">时间范围</Radio>
          <Radio value="days_from_receive">自领取之日起指定天数内有效</Radio>
          <Radio value="days_from_date">自领取之日起，第几天生效，有效期几天</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) => 
          prevValues.validityType !== currentValues.validityType
        }
      >
        {({ getFieldValue }) => {
          const validityType = getFieldValue('validityType');
          
          if (validityType === 'range') {
            return (
              <Form.Item
                name="validityRange"
                label="有效期范围"
                rules={[{ required: true, message: '请选择有效期范围' }]}
              >
                <RangePicker showTime style={{ width: '100%' }} />
              </Form.Item>
            );
          }
          
          if (validityType === 'days_from_receive') {
            return (
              <Form.Item
                name="validityDays"
                label="有效天数"
                rules={[{ required: true, message: '请输入有效天数' }]}
              >
                <InputNumber min={1} addonAfter="天" style={{ width: 200 }} />
              </Form.Item>
            );
          }
          
          if (validityType === 'days_from_date') {
            return (
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="effectiveDays"
                    label="第几天生效"
                    rules={[{ required: true, message: '请输入生效天数' }]}
                  >
                    <InputNumber min={1} addonAfter="天" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="validityDaysFromEffective"
                    label="有效期"
                    rules={[{ required: true, message: '请输入有效期' }]}
                  >
                    <InputNumber min={1} addonAfter="天" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
            );
          }
          
          return null;
        }}
      </Form.Item>

      <Form.Item
        name="timeRestrictionType"
        label="时间限制"
        rules={[{ required: true, message: '请选择时间限制类型' }]}
      >
        <Radio.Group>
          <Radio value="anytime">有效期内可用</Radio>
          <Radio value="specific_allow">设置指定时间可用</Radio>
          <Radio value="specific_disallow">设置指定时间不可用</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) => 
          prevValues.timeRestrictionType !== currentValues.timeRestrictionType
        }
      >
        {({ getFieldValue }) => {
          const timeRestrictionType = getFieldValue('timeRestrictionType');
          
          if (timeRestrictionType === 'specific_allow' || timeRestrictionType === 'specific_disallow') {
            return (
              <>
                <Form.Item
                  name="timeRestrictionPattern"
                  label="重复模式"
                  rules={[{ required: true, message: '请选择重复模式' }]}
                >
                  <Select placeholder="请选择重复模式">
                    <Option value="daily">每日重复</Option>
                    <Option value="weekly">每周重复</Option>
                    <Option value="monthly">每月重复</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) => 
                    prevValues.timeRestrictionPattern !== currentValues.timeRestrictionPattern
                  }
                >
                  {({ getFieldValue }) => {
                    const pattern = getFieldValue('timeRestrictionPattern');
                    
                    if (pattern === 'daily') {
                      return (
                        <Form.List name="dailyTimeSlots">
                          {(fields, { add, remove }) => (
                            <>
                              {fields.map(({ key, name, ...restField }) => (
                                <div key={key} style={{ 
                                  marginBottom: 12, 
                                  padding: 12, 
                                  border: '1px solid #d9d9d9', 
                                  borderRadius: 6, 
                                  backgroundColor: '#fafafa' 
                                }}>
                                  <Row gutter={8} align="middle">
                                    <Col span={8}>
                                      <Form.Item
                                        {...restField}
                                        name={[name, 'startTime']}
                                        style={{ marginBottom: 0 }}
                                        rules={[{ required: true, message: '请选择开始时间' }]}
                                      >
                                        <TimePicker placeholder="开始时间" format="HH:mm:ss" size="small" />
                                      </Form.Item>
                                    </Col>
                                    <Col span={2} style={{ textAlign: 'center' }}>
                                      <span>至</span>
                                    </Col>
                                    <Col span={8}>
                                      <Form.Item
                                        {...restField}
                                        name={[name, 'endTime']}
                                        style={{ marginBottom: 0 }}
                                        rules={[{ required: true, message: '请选择结束时间' }]}
                                      >
                                        <TimePicker placeholder="结束时间" format="HH:mm:ss" size="small" />
                                      </Form.Item>
                                    </Col>
                                    <Col span={6} style={{ textAlign: 'center' }}>
                                      <Button 
                                        type="text" 
                                        danger 
                                        size="small"
                                        onClick={() => remove(name)}
                                        style={{ 
                                          padding: 0, 
                                          minWidth: 'auto',
                                          width: 24,
                                          height: 24,
                                          borderRadius: '50%',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center'
                                        }}
                                        title="删除此时间段"
                                      >
                                        删除
                                      </Button>
                                      {fields.length > 1 && (
                                        <span style={{ fontSize: '12px', color: '#f5222d', marginLeft: 8 }}>
                                          存在时间段重复
                                        </span>
                                      )}
                                    </Col>
                                  </Row>
                                </div>
                              ))}
                              <Form.Item style={{ marginBottom: 0 }}>
                                <Button 
                                  type="dashed" 
                                  onClick={() => add()} 
                                  block 
                                  icon={<PlusOutlined />}
                                  size="small"
                                  disabled={fields.length >= 5}
                                >
                                  添加时间段（最多5个）
                                </Button>
                              </Form.Item>
                            </>
                          )}
                        </Form.List>
                      );
                    }
                    
                    if (pattern === 'weekly') {
                      return (
                        <Form.List name="weeklyTimeSlots">
                          {(fields, { add, remove }) => (
                            <>
                              {fields.map(({ key, name, ...restField }) => (
                                <div key={key} style={{ 
                                  marginBottom: 12, 
                                  padding: 12, 
                                  border: '1px solid #d9d9d9', 
                                  borderRadius: 6, 
                                  backgroundColor: '#fafafa' 
                                }}>
                                  <Row gutter={8} align="middle">
                                    <Col span={24}>
                                      <Form.Item
                                        {...restField}
                                        name={[name, 'weekdays']}
                                        label="选择星期"
                                        style={{ marginBottom: 8 }}
                                        rules={[{ required: true, message: '请选择星期' }]}
                                      >
                                        <Checkbox.Group>
                                          <Row>
                                            <Col span={3}><Checkbox value={1}>一</Checkbox></Col>
                                            <Col span={3}><Checkbox value={2}>二</Checkbox></Col>
                                            <Col span={3}><Checkbox value={3}>三</Checkbox></Col>
                                            <Col span={3}><Checkbox value={4}>四</Checkbox></Col>
                                            <Col span={3}><Checkbox value={5}>五</Checkbox></Col>
                                            <Col span={3}><Checkbox value={6}>六</Checkbox></Col>
                                            <Col span={3}><Checkbox value={0}>日</Checkbox></Col>
                                          </Row>
                                        </Checkbox.Group>
                                      </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                      <Form.Item
                                        {...restField}
                                        name={[name, 'startTime']}
                                        style={{ marginBottom: 0 }}
                                        rules={[{ required: true, message: '请选择开始时间' }]}
                                      >
                                        <TimePicker placeholder="开始时间" format="HH:mm:ss" size="small" />
                                      </Form.Item>
                                    </Col>
                                    <Col span={2} style={{ textAlign: 'center' }}>
                                      <span>至</span>
                                    </Col>
                                    <Col span={8}>
                                      <Form.Item
                                        {...restField}
                                        name={[name, 'endTime']}
                                        style={{ marginBottom: 0 }}
                                        rules={[{ required: true, message: '请选择结束时间' }]}
                                      >
                                        <TimePicker placeholder="结束时间" format="HH:mm:ss" size="small" />
                                      </Form.Item>
                                    </Col>
                                    <Col span={6} style={{ textAlign: 'center' }}>
                                      <Button 
                                        type="text" 
                                        danger 
                                        size="small"
                                        onClick={() => remove(name)}
                                        style={{ 
                                          padding: 0, 
                                          minWidth: 'auto',
                                          width: 24,
                                          height: 24,
                                          borderRadius: '50%',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center'
                                        }}
                                        title="删除此时间段"
                                      >
                                        删除
                                      </Button>
                                    </Col>
                                  </Row>
                                </div>
                              ))}
                              <Form.Item style={{ marginBottom: 0 }}>
                                <Button 
                                  type="dashed" 
                                  onClick={() => add()} 
                                  block 
                                  icon={<PlusOutlined />}
                                  size="small"
                                  disabled={fields.length >= 5}
                                >
                                  添加时间段（最多5个）
                                </Button>
                              </Form.Item>
                            </>
                          )}
                        </Form.List>
                      );
                    }
                    
                    if (pattern === 'monthly') {
                      return (
                        <Form.List name="monthlyTimeSlots">
                          {(fields, { add, remove }) => (
                            <>
                              {fields.map(({ key, name, ...restField }) => (
                                <div key={key} style={{ 
                                  marginBottom: 12, 
                                  padding: 12, 
                                  border: '1px solid #d9d9d9', 
                                  borderRadius: 6, 
                                  backgroundColor: '#fafafa' 
                                }}>
                                  <Row gutter={8} align="middle">
                                    <Col span={24}>
                                      <Form.Item
                                        {...restField}
                                        name={[name, 'days']}
                                        label="选择日期"
                                        style={{ marginBottom: 8 }}
                                        rules={[{ required: true, message: '请选择日期' }]}
                                      >
                                        <Checkbox.Group>
                                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                                            {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                                              <Checkbox key={day} value={day}>{day}</Checkbox>
                                            ))}
                                          </div>
                                        </Checkbox.Group>
                                      </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                      <Form.Item
                                        {...restField}
                                        name={[name, 'startTime']}
                                        style={{ marginBottom: 0 }}
                                        rules={[{ required: true, message: '请选择开始时间' }]}
                                      >
                                        <TimePicker placeholder="开始时间" format="HH:mm:ss" size="small" />
                                      </Form.Item>
                                    </Col>
                                    <Col span={2} style={{ textAlign: 'center' }}>
                                      <span>至</span>
                                    </Col>
                                    <Col span={8}>
                                      <Form.Item
                                        {...restField}
                                        name={[name, 'endTime']}
                                        style={{ marginBottom: 0 }}
                                        rules={[{ required: true, message: '请选择结束时间' }]}
                                      >
                                        <TimePicker placeholder="结束时间" format="HH:mm:ss" size="small" />
                                      </Form.Item>
                                    </Col>
                                    <Col span={6} style={{ textAlign: 'center' }}>
                                      <Button 
                                        type="text" 
                                        danger 
                                        size="small"
                                        onClick={() => remove(name)}
                                        style={{ 
                                          padding: 0, 
                                          minWidth: 'auto',
                                          width: 24,
                                          height: 24,
                                          borderRadius: '50%',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center'
                                        }}
                                        title="删除此时间段"
                                      >
                                        删除
                                      </Button>
                                      {fields.length > 1 && (
                                        <span style={{ fontSize: '12px', color: '#f5222d', marginLeft: 8 }}>
                                          存在时间段重复
                                        </span>
                                      )}
                                    </Col>
                                  </Row>
                                </div>
                              ))}
                              <Form.Item style={{ marginBottom: 0 }}>
                                <Button 
                                  type="dashed" 
                                  onClick={() => add()} 
                                  block 
                                  icon={<PlusOutlined />}
                                  size="small"
                                  disabled={fields.length >= 5}
                                >
                                  添加时间段（最多5个）
                                </Button>
                              </Form.Item>
                            </>
                          )}
                        </Form.List>
                      );
                    }
                    
                    return null;
                  }}
                </Form.Item>
              </>
            );
          }
          
          return null;
        }}
      </Form.Item>

      <Form.Item
        name="description"
        label="使用说明"
        rules={[{ required: true, message: '请输入使用说明' }]}
      >
        <TextArea rows={4} placeholder="请输入使用说明" />
      </Form.Item>
    </Form>
  );

  // 渲染当前步骤内容
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderStep1();
      case 1:
        return renderStep2();
      default:
        return null;
    }
  };

  return (
    <Modal
      title="创建优惠券"
      open={visible}
      onCancel={handleCancel}
      width={800}
      footer={null}
      destroyOnClose
    >
      <Steps current={currentStep} style={{ marginBottom: 24 }}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} description={item.description} />
        ))}
      </Steps>

      <div style={{ minHeight: 400 }}>
        {renderStepContent()}
      </div>

      <Divider />

      <div style={{ textAlign: 'right' }}>
        <Space>
          {currentStep > 0 && (
            <Button onClick={handlePrev}>
              上一步
            </Button>
          )}
          {currentStep < steps.length - 1 && (
            <Button type="primary" onClick={handleNext}>
              下一步
            </Button>
          )}
          {currentStep === steps.length - 1 && (
            <Button type="primary" loading={loading} onClick={handleSave}>
              保存
            </Button>
          )}
          <Button onClick={handleCancel}>
            取消
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default CouponCreateModal; 