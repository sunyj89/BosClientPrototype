import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  TreeSelect,
  Row,
  Col,
  message,
  Button
} from 'antd';
import dayjs from 'dayjs';

// 导入模拟数据
import stationData from '../../../../mock/station/stationData.json';

const { Option } = Select;
const { TextArea } = Input;

const ProcurementApplicationForm = ({ 
  visible, 
  onCancel, 
  onSubmit, 
  initialData, 
  mode = 'create' // 'create' or 'edit'
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);

  // 油品选项（模拟数据）
  const oilOptions = [
    { code: '100001', name: '92号汽油国V', shortName: '92#汽油' },
    { code: '100002', name: '92号汽油国VIA', shortName: '92#汽油VIA' },
    { code: '100003', name: '95号汽油国V', shortName: '95#汽油' },
    { code: '100004', name: '95号汽油国VIA', shortName: '95#汽油VIA' },
    { code: '100005', name: '0号柴油国V', shortName: '0#柴油' },
    { code: '100006', name: '98号汽油国VIA', shortName: '98#汽油' },
    { code: '100007', name: '尿素', shortName: '尿素' }
  ];

  // 生成组织树数据
  const generateOrgTreeData = () => {
    const branches = stationData.branches || [];
    const serviceAreas = stationData.serviceAreas || [];
    const stations = stationData.stations || [];

    return branches.map(branch => ({
      title: branch.name,
      value: branch.id,
      key: branch.id,
      selectable: false,
      children: serviceAreas
        .filter(sa => sa.branchId === branch.id)
        .map(serviceArea => ({
          title: serviceArea.name,
          value: serviceArea.id,
          key: serviceArea.id,
          selectable: false,
          children: stations
            .filter(station => station.serviceAreaId === serviceArea.id)
            .map(station => ({
              title: station.name,
              value: station.id,
              key: station.id,
              selectable: true,
              station: station
            }))
        }))
    }));
  };

  // 处理油站选择
  const handleStationChange = (value) => {
    if (value) {
      // 查找选中的油站信息
      const stations = stationData.stations || [];
      const station = stations.find(s => s.id === value);
      if (station) {
        setSelectedStation(station);
        // 自动填充收货地址
        form.setFieldsValue({
          deliveryAddress: station.address
        });
      }
    } else {
      setSelectedStation(null);
      form.setFieldsValue({
        deliveryAddress: ''
      });
    }
  };

  // 生成申请编号
  const generateApplicationNumber = () => {
    const now = dayjs();
    const dateStr = now.format('YYYYMMDD');
    const timeStr = now.format('HHmmss');
    return `PA${dateStr}${timeStr}`;
  };

  // 初始化表单数据
  useEffect(() => {
    if (visible) {
      if (mode === 'edit' && initialData) {
        // 编辑模式，填充现有数据
        const formData = {
          applicationNumber: initialData.applicationNumber,
          stationId: initialData.stationId,
          oilCode: initialData.oilCode,
          quantity: initialData.quantity,
          expectedDeliveryTime: initialData.expectedDeliveryTime ? dayjs(initialData.expectedDeliveryTime) : null,
          applicantName: initialData.applicantName,
          applicantPhone: initialData.applicantPhone,
          deliveryAddress: initialData.deliveryAddress
        };
        
        form.setFieldsValue(formData);
        
        // 设置选中的油站
        if (initialData.stationId) {
          const stations = stationData.stations || [];
          const station = stations.find(s => s.id === initialData.stationId);
          setSelectedStation(station);
        }
      } else {
        // 创建模式，重置表单
        form.resetFields();
        setSelectedStation(null);
        
        // 设置默认申请编号
        form.setFieldsValue({
          applicationNumber: generateApplicationNumber()
        });
      }
    }
  }, [visible, mode, initialData, form]);

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
             // 组装提交数据
       const now = dayjs();
       const submitData = {
         id: mode === 'create' ? values.applicationNumber : initialData?.id,
         ...values,
         expectedDeliveryTime: values.expectedDeliveryTime?.format('YYYY-MM-DD HH:mm:ss'),
         // 添加油站相关信息
         stationName: selectedStation?.name,
         stationCode: selectedStation?.stationCode,
         branchId: selectedStation?.branchId,
         branchName: selectedStation?.branchName,
         serviceAreaId: selectedStation?.serviceAreaId,
         serviceAreaName: selectedStation?.serviceAreaName,
         // 添加油品信息
         oilName: oilOptions.find(oil => oil.code === values.oilCode)?.name,
         shortName: oilOptions.find(oil => oil.code === values.oilCode)?.shortName,
         unit: '吨',
         // 添加状态和时间信息
         status: mode === 'create' ? '草稿' : initialData?.status || '草稿',
         createTime: mode === 'create' ? now.format('YYYY-MM-DD HH:mm:ss') : initialData?.createTime,
         updateTime: now.format('YYYY-MM-DD HH:mm:ss'),
         createdBy: mode === 'create' ? '当前用户' : initialData?.createdBy || '当前用户',
         // 申请人信息
         applicantName: values.applicantName || '当前用户',
         applicantPhone: values.applicantPhone || '',
         // 审批进度
         approvalProgress: mode === 'create' ? [
           {
             step: 1,
             stepName: '站长申请',
             approver: '当前用户',
             approveTime: '',
             status: '草稿',
             remark: '草稿状态，未提交'
           }
         ] : initialData?.approvalProgress || []
       };

      setTimeout(() => {
        setLoading(false);
        message.success(`${mode === 'create' ? '创建' : '编辑'}成功`);
        onSubmit(submitData);
        onCancel();
      }, 1000);
      
    } catch (error) {
      setLoading(false);
      console.error('表单验证失败:', error);
    }
  };

  const title = mode === 'create' ? '创建油品采购申请' : '编辑油品采购申请';

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          {mode === 'create' ? '创建' : '保存'}
        </Button>
      ]}
      width={800}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          quantity: 1,
          unit: '吨'
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="applicationNumber"
              label="采购申请编号"
              rules={[{ required: true, message: '请输入采购申请编号' }]}
            >
              <Input placeholder="系统自动生成" disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="stationId"
              label="申请油站"
              rules={[{ required: true, message: '请选择申请油站' }]}
            >
              <TreeSelect
                placeholder="请选择申请油站"
                treeData={generateOrgTreeData()}
                onChange={handleStationChange}
                showSearch
                treeNodeFilterProp="title"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="oilCode"
              label="油品类型"
              rules={[{ required: true, message: '请选择油品类型' }]}
            >
              <Select placeholder="请选择油品类型">
                {oilOptions.map(oil => (
                  <Option key={oil.code} value={oil.code}>
                    {oil.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="quantity"
              label="申请数量（吨）"
              rules={[
                { required: true, message: '请输入申请数量' },
                { type: 'number', min: 0.1, message: '数量必须大于0.1吨' }
              ]}
            >
              <InputNumber
                placeholder="请输入申请数量"
                min={0.1}
                max={1000}
                step={0.1}
                precision={1}
                style={{ width: '100%' }}
                addonAfter="吨"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="expectedDeliveryTime"
              label="期望到货时间"
              rules={[{ required: true, message: '请选择期望到货时间' }]}
            >
              <DatePicker
                showTime
                placeholder="请选择期望到货时间"
                style={{ width: '100%' }}
                format="YYYY-MM-DD HH:mm:ss"
                disabledDate={(current) => current && current < dayjs().startOf('day')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="applicantName"
              label="申请人姓名"
              rules={[{ required: true, message: '请输入申请人姓名' }]}
            >
              <Input placeholder="请输入申请人姓名" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="applicantPhone"
              label="联系电话"
              rules={[
                { required: true, message: '请输入联系电话' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
              ]}
            >
              <Input placeholder="请输入联系电话" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="deliveryAddress"
              label="收货地址"
              rules={[{ required: true, message: '请输入收货地址' }]}
            >
              <TextArea
                placeholder="请输入收货地址（选择油站后自动填充）"
                rows={3}
              />
            </Form.Item>
          </Col>
        </Row>

        {selectedStation && (
          <Row gutter={16}>
            <Col span={24}>
              <div style={{
                background: '#f6f6f6',
                padding: '12px',
                borderRadius: '6px',
                marginBottom: '16px'
              }}>
                <div><strong>选中油站信息：</strong></div>
                <div>油站名称：{selectedStation.name}</div>
                <div>油站编码：{selectedStation.stationCode}</div>
                <div>所属分公司：{selectedStation.branchName}</div>
                <div>所属服务区：{selectedStation.serviceAreaName}</div>
              </div>
            </Col>
          </Row>
        )}
      </Form>
    </Modal>
  );
};

export default ProcurementApplicationForm; 