import React, { useState, useEffect } from 'react';
import { Form, Input, Select, DatePicker, Button, Space, Row, Col, message, TreeSelect, Radio, Checkbox, TimePicker } from 'antd';
import moment from 'moment';
import stationData from '../../../../mock/station/stationData.json';

const { Option } = Select;
const { RangePicker } = DatePicker;

const BasicInfoForm = ({ onNext, initialData = {}, isEdit = false }) => {
  const [form] = Form.useForm();
  const [stationTreeData, setStationTreeData] = useState([]);
  const [repeatType, setRepeatType] = useState(initialData.repeatType || '不重复');

  useEffect(() => {
    // 构建油站树形数据
    const treeData = stationData.branches.map(branch => ({
      title: branch.name,
      value: branch.id,
      key: branch.id,
      children: stationData.serviceAreas
        .filter(sa => sa.branchId === branch.id)
        .map(serviceArea => ({
          title: serviceArea.name,
          value: serviceArea.id,
          key: serviceArea.id,
          children: stationData.stations
            .filter(station => station.serviceAreaId === serviceArea.id)
            .map(station => ({
              title: station.name,
              value: station.id,
              key: station.id,
              isLeaf: true
            }))
        }))
    }));
    setStationTreeData(treeData);

    // 回显数据
    if (isEdit && initialData) {
      const timeRange = initialData.timeRange || {};
      const formattedData = {
        ...initialData,
        dateRange: timeRange.startDate && timeRange.endDate 
          ? [moment(timeRange.startDate), moment(timeRange.endDate)]
          : null,
        timeRange: timeRange.startTime && timeRange.endTime
          ? [moment(timeRange.startTime, 'HH:mm'), moment(timeRange.endTime, 'HH:mm')]
          : null,
        weekDays: timeRange.weekDays,
        monthDays: timeRange.monthDays
      };
      form.setFieldsValue(formattedData);
    }
  }, [initialData, isEdit, form]);
  
  const handleRepeatTypeChange = (value) => {
    setRepeatType(value);
  };

  const handleFinish = (values) => {
    const { dateRange, timeRange, weekDays, monthDays, ...rest } = values;
    
    const formattedData = {
      ...initialData,
      ...rest,
      timeRange: {
        startDate: dateRange ? dateRange[0].format('YYYY-MM-DD') : null,
        endDate: dateRange ? dateRange[1].format('YYYY-MM-DD') : null,
        startTime: timeRange ? timeRange[0].format('HH:mm') : null,
        endTime: timeRange ? timeRange[1].format('HH:mm') : null,
        weekDays: repeatType === '每周重复' ? weekDays : undefined,
        monthDays: repeatType === '每月重复' ? monthDays : undefined,
      }
    };
    
    message.success('基础信息保存成功');
    onNext(formattedData);
  };

  const dayOptions = Array.from({ length: 31 }, (_, i) => ({
    label: `${i + 1}号`,
    value: i + 1,
  }));
  
  return (
    <div>
      <h3>第一步：配置基础信息</h3>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="配置名称"
              rules={[{ required: true, message: '请输入配置名称' }]}
            >
              <Input placeholder="请输入配置名称" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="discountTarget"
              label="优惠对象"
              rules={[{ required: true, message: '请选择优惠对象' }]}
            >
              <Select placeholder="请选择优惠对象">
                <Option value="新注册会员">新注册会员</Option>
                <Option value="所有会员">所有会员</Option>
                <Option value="VIP会员客户">VIP会员客户</Option>
                <Option value="黄金会员客户">黄金会员客户</Option>
                <Option value="钻石会员客户">钻石会员客户</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="discountType"
              label="优惠类型"
              rules={[{ required: true, message: '请选择优惠类型' }]}
            >
              <Select placeholder="请选择优惠类型">
                <Option value="普通优惠">普通优惠</Option>
                <Option value="渠道优惠">渠道优惠</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="eligibility"
              label="参与资格"
              rules={[{ required: true, message: '请选择参与资格' }]}
            >
              <Radio.Group>
                <Radio value="新注册会员">新注册会员</Radio>
                <Radio value="所有会员">所有会员</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        
        <Form.Item
          name="stationIds"
          label="优惠站点"
          rules={[{ required: true, message: '请选择优惠站点' }]}
        >
          <TreeSelect
            treeData={stationTreeData}
            multiple
            allowClear
            treeCheckable
            showCheckedStrategy={TreeSelect.SHOW_PARENT}
            placeholder="请选择优惠站点"
            style={{ width: '100%' }}
          />
        </Form.Item>
        
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="repeatType"
              label="重复类型"
              rules={[{ required: true, message: '请选择重复类型' }]}
            >
              <Select placeholder="请选择重复类型" onChange={handleRepeatTypeChange}>
                <Option value="不重复">不重复</Option>
                <Option value="每天重复">每天重复</Option>
                <Option value="每周重复">每周重复</Option>
                <Option value="每月重复">每月重复</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="dateRange"
              label="优惠日期范围"
              rules={[{ required: true, message: '请选择优惠日期范围' }]}
            >
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        
        {repeatType === '每周重复' && (
          <Form.Item
            name="weekDays"
            label="选择星期"
            rules={[{ required: true, message: '请选择星期' }]}
          >
            <Checkbox.Group>
              <Checkbox value={1}>周一</Checkbox>
              <Checkbox value={2}>周二</Checkbox>
              <Checkbox value={3}>周三</Checkbox>
              <Checkbox value={4}>周四</Checkbox>
              <Checkbox value={5}>周五</Checkbox>
              <Checkbox value={6}>周六</Checkbox>
              <Checkbox value={7}>周日</Checkbox>
            </Checkbox.Group>
          </Form.Item>
        )}
        
        {repeatType === '每月重复' && (
          <Form.Item
            name="monthDays"
            label="选择日期"
            rules={[{ required: true, message: '请选择日期' }]}
          >
            <Select mode="multiple" placeholder="请选择每月重复的日期" options={dayOptions} />
          </Form.Item>
        )}

        <Form.Item
          name="timeRange"
          label="优惠时间范围"
          rules={[{ required: true, message: '请选择优惠时间范围' }]}
        >
          <TimePicker.RangePicker format="HH:mm" style={{ width: '100%' }} />
        </Form.Item>

        <div className="step-actions">
          <Space>
            <Button type="primary" htmlType="submit">
              下一步
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  );
};

export default BasicInfoForm;
