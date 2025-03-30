import React, { useState, useEffect } from 'react';
import { Drawer, Form, Input, Select, Button, Row, Col, DatePicker, message, Spin, InputNumber, Space } from 'antd';
import { createStation, updateStation, fetchOrgStructure } from '../services/stationService';
import { STATION_STATUS, OIL_TYPES, FORM_LAYOUT, FORM_TAIL_LAYOUT, FORM_RULES, APPROVAL_STATUS } from '../utils/constants';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

const StationForm = ({ open, initialValues, onClose, onSuccess, parentOrg, branchList }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orgData, setOrgData] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  
  const isEdit = !!initialValues;
  const title = isEdit ? '编辑油站' : '新增油站';

  // 初始化表单数据
  useEffect(() => {
    if (open) {
      form.resetFields();
      fetchOrgData();

      if (isEdit) {
        // 编辑模式，设置初始值
        const formValues = {
          ...initialValues,
          oilTypes: typeof initialValues.oilTypes === 'string' && initialValues.oilTypes 
            ? initialValues.oilTypes.split(', ') 
            : Array.isArray(initialValues.oilTypes) 
              ? initialValues.oilTypes 
              : [],
          createTime: initialValues.createTime ? moment(initialValues.createTime) : null
        };
        form.setFieldsValue(formValues);
      } else {
        // 新增模式，设置默认值
        form.setFieldsValue({
          status: 'NORMAL',
          branchId: parentOrg,
          createTime: moment(),
          gunCount: 0,
          employeeCount: 0
        });
      }
    }
  }, [open, initialValues, form, parentOrg]);

  // 获取组织结构数据
  const fetchOrgData = async () => {
    try {
      setLoading(true);
      // 如果已经传入了branchList，直接使用
      if (branchList && branchList.length > 0) {
        const options = branchList.map(branch => ({
          label: branch.title,
          value: branch.key.replace('branch-', '')
        }));
        setBranchOptions(options);
        setLoading(false);
        return;
      }
      
      // 否则从API获取
      const result = await fetchOrgStructure();
      if (result && result.data) {
        setOrgData(result.data);
        
        // 提取分公司选项
        if (result.data.branches && result.data.branches.length > 0) {
          const options = result.data.branches.map(branch => ({
            label: branch.name,
            value: branch.id
          }));
          setBranchOptions(options);
        }
      }
    } catch (error) {
      message.error('获取组织数据失败');
      console.error('获取组织数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      // 表单验证
      const values = await form.validateFields();
      
      // 格式化提交数据
      const submitData = {
        ...values,
        oilTypes: Array.isArray(values.oilTypes) ? values.oilTypes.join(', ') : (typeof values.oilTypes === 'string' ? values.oilTypes : ''),
        createTime: values.createTime ? values.createTime.format('YYYY-MM-DD HH:mm:ss') : null,
        approvalStatus: APPROVAL_STATUS.PENDING, // 设置为待审批状态
        approvalType: isEdit ? 'update' : 'create', // 标记审批类型
        submitter: '当前用户', // 实际项目中应该从登录用户信息中获取
        submitTime: moment().format('YYYY-MM-DD HH:mm:ss')
      };
      
      setSubmitting(true);
      
      // 提交到服务器
      if (isEdit) {
        await updateStation({
          ...submitData,
          id: initialValues.id
        });
        message.success('油站修改已提交审批');
      } else {
        await createStation(submitData);
        message.success('新油站已提交审批');
      }
      
      // 回调函数
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      if (error.errorFields) {
        message.error('请检查表单填写是否正确');
      } else {
        message.error(isEdit ? '提交审批失败' : '创建油站失败');
        console.error(isEdit ? '提交审批失败:' : '创建油站失败:', error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // 渲染油品类型选项
  const renderOilTypeOptions = () => {
    return Object.entries(OIL_TYPES).map(([key, value]) => (
      <Option key={key} value={value}>
        {value}
      </Option>
    ));
  };

  // 渲染状态选项
  const renderStatusOptions = () => {
    return Object.entries(STATION_STATUS).map(([key, value]) => (
      <Option key={key} value={key}>
        {value}
      </Option>
    ));
  };

  // 渲染分公司选项
  const renderBranchOptions = () => {
    return branchOptions.map(option => (
      <Option key={option.value} value={option.value}>
        {option.label}
      </Option>
    ));
  };

  return (
    <Drawer
      title={title}
      width={600}
      onClose={onClose}
      open={open}
      bodyStyle={{ paddingBottom: 80 }}
      className="station-drawer"
      destroyOnClose={true}
      footer={
        <div className="drawer-footer">
          <Space>
            <Button onClick={onClose}>取消</Button>
            <Button 
              type="primary" 
              onClick={handleSubmit} 
              loading={submitting}
            >
              提交审批
            </Button>
          </Space>
        </div>
      }
    >
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="horizontal"
          {...FORM_LAYOUT}
        >
          <Form.Item
            name="name"
            label="油站名称"
            rules={[FORM_RULES.name]}
          >
            <Input placeholder="请输入油站名称" />
          </Form.Item>
          
          <Form.Item
            name="branchId"
            label="所属分公司"
            rules={[FORM_RULES.select]}
          >
            <Select placeholder="请选择所属分公司">
              {renderBranchOptions()}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="address"
            label="地址"
            rules={[FORM_RULES.required]}
          >
            <TextArea placeholder="请输入详细地址" rows={2} />
          </Form.Item>
          
          <Form.Item
            name="manager"
            label="站长"
            rules={[FORM_RULES.required]}
          >
            <Input placeholder="请输入站长姓名" />
          </Form.Item>
          
          <Form.Item
            name="contact"
            label="联系电话"
            rules={[FORM_RULES.phone]}
          >
            <Input placeholder="请输入联系电话" />
          </Form.Item>
          
          <Form.Item
            name="status"
            label="状态"
            rules={[FORM_RULES.select]}
          >
            <Select placeholder="请选择油站状态">
              {renderStatusOptions()}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="oilTypes"
            label="油品类型"
            rules={[{ ...FORM_RULES.required, type: 'array' }]}
          >
            <Select 
              mode="multiple" 
              placeholder="请选择油品类型"
              optionFilterProp="children"
            >
              {renderOilTypeOptions()}
            </Select>
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="gunCount"
                label="加油枪数"
                labelCol={{ span: 12 }}
                wrapperCol={{ span: 12 }}
                rules={[FORM_RULES.number]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="employeeCount"
                label="员工数"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                rules={[FORM_RULES.number]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="createTime"
            label="创建时间"
            rules={[FORM_RULES.date]}
          >
            <DatePicker 
              showTime 
              format="YYYY-MM-DD HH:mm:ss" 
              style={{ width: '100%' }} 
              disabled={isEdit}
            />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="描述"
          >
            <TextArea placeholder="请输入油站描述" rows={4} />
          </Form.Item>
        </Form>
      </Spin>
    </Drawer>
  );
};

export default StationForm; 
