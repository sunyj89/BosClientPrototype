import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  InputNumber, 
  Button, 
  Space, 
  Row, 
  Col,
  Modal,
  Typography,
  Divider,
  Tag
} from 'antd';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

// 模拟油品供应商数据
const mockSuppliers = [
  { id: 'SP001', name: '中石化北京分公司', oilType: ['92#汽油', '95#汽油', '98#汽油', '0#柴油'], status: '正常' },
  { id: 'SP002', name: '中石油华东分公司', oilType: ['92#汽油', '95#汽油', '0#柴油'], status: '正常' },
  { id: 'SP003', name: '壳牌(中国)有限公司', oilType: ['92#汽油', '95#汽油', '98#汽油'], status: '正常' },
  { id: 'SP004', name: '中海油能源发展股份有限公司', oilType: ['0#柴油'], status: '正常' },
  { id: 'SP005', name: '中化石油有限公司', oilType: ['92#汽油', '95#汽油', '98#汽油', '0#柴油'], status: '正常' },
];

// 油品类型选项
const oilTypeOptions = [
  { value: '92#汽油', label: '92#汽油' },
  { value: '95#汽油', label: '95#汽油' },
  { value: '98#汽油', label: '98#汽油' },
  { value: '0#柴油', label: '0#柴油' },
];

// 生成询价单号函数
const generateInquiryId = () => {
  const date = moment().format('YYYYMMDD');
  const time = moment().format('HHmmss');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `INQ${date}${time}${random}`;
};

const InquiryForm = ({ visible, record, mode, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  const [selectedOilType, setSelectedOilType] = useState('');
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  
  // 表单初始化
  useEffect(() => {
    if (visible) {
      if (mode === 'create') {
        form.resetFields();
        form.setFieldsValue({
          id: generateInquiryId(),
          createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          createdBy: '当前用户'
        });
      } else if (record && (mode === 'edit' || mode === 'view')) {
        const formData = {
          ...record,
          quoteStartTime: record.quoteStartTime ? moment(record.quoteStartTime, 'YYYY-MM-DD HH:mm:ss') : null,
          quoteEndTime: record.quoteEndTime ? moment(record.quoteEndTime, 'YYYY-MM-DD HH:mm:ss') : null,
          expectedDeliveryTime: record.expectedDeliveryTime ? moment(record.expectedDeliveryTime, 'YYYY-MM-DD HH:mm:ss') : null,
          suppliers: record.suppliers ? record.suppliers.map(s => s.id) : []
        };
        form.setFieldsValue(formData);
        setSelectedOilType(record.oilType);
      }
    }
  }, [visible, record, mode, form]);

  // 油品类型变更时更新供应商列表
  useEffect(() => {
    if (selectedOilType) {
      const suppliers = mockSuppliers.filter(
        supplier => supplier.oilType.includes(selectedOilType) && supplier.status === '正常'
      );
      setFilteredSuppliers(suppliers);
    } else {
      setFilteredSuppliers([]);
    }
  }, [selectedOilType]);

  // 油品类型变更处理
  const handleOilTypeChange = (value) => {
    setSelectedOilType(value);
    form.setFieldsValue({ suppliers: [] });
  };

  // 表单提交处理
  const handleSubmit = (values) => {
    const formData = {
      ...values,
      quoteStartTime: values.quoteStartTime ? values.quoteStartTime.format('YYYY-MM-DD HH:mm:ss') : null,
      quoteEndTime: values.quoteEndTime ? values.quoteEndTime.format('YYYY-MM-DD HH:mm:ss') : null,
      expectedDeliveryTime: values.expectedDeliveryTime ? values.expectedDeliveryTime.format('YYYY-MM-DD HH:mm:ss') : null,
      suppliers: values.suppliers ? values.suppliers.map(id => mockSuppliers.find(s => s.id === id)) : []
    };
    onSubmit(formData, mode);
  };

  // 渲染审批流程状态
  const renderApprovalFlow = () => {
    if (mode === 'view' && record && record.status !== '草稿') {
      return (
        <>
          <Divider orientation="left">审批进度</Divider>
          <div style={{ padding: '16px 0' }}>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <div>提交人：{record.createdBy}</div>
              </Col>
              <Col span={8}>
                <div>提交时间：{record.createTime}</div>
              </Col>
              <Col span={8}>
                <div>当前状态：
                  <Tag color={
                    record.status === '待审批' ? 'blue' : 
                    record.status === '已审批' ? 'green' : 
                    record.status === '已发布' ? 'cyan' : 
                    record.status === '已撤回' ? 'red' : 'default'
                  }>
                    {record.status}
                  </Tag>
                </div>
              </Col>
            </Row>

            {record.status === '已审批' || record.status === '已发布' ? (
              <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                <Col span={8}>
                  <div>审批人：王经理</div>
                </Col>
                <Col span={8}>
                  <div>审批时间：{moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss')}</div>
                </Col>
                <Col span={8}>
                  <div>审批意见：同意</div>
                </Col>
              </Row>
            ) : null}

            {record.status === '已发布' ? (
              <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                <Col span={8}>
                  <div>发布人：张经理</div>
                </Col>
                <Col span={8}>
                  <div>发布时间：{moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                </Col>
                <Col span={8}>
                  <div>发布操作：成功</div>
                </Col>
              </Row>
            ) : null}
          </div>
        </>
      );
    }
    return null;
  };

  // 生成底部按钮
  const renderFooterButtons = () => {
    if (mode === 'view') {
      return [
        <Button key="close" onClick={onCancel}>
          关闭
        </Button>
      ];
    }

    if (mode === 'create') {
      return [
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button 
          key="draft" 
          onClick={() => {
            form.validateFields()
              .then(values => {
                handleSubmit({ ...values, status: '草稿' });
              })
              .catch(info => {
                console.log('验证失败:', info);
              });
          }}
        >
          存草稿
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          onClick={() => {
            form.validateFields()
              .then(values => {
                handleSubmit({ ...values, status: '待审批' });
              })
              .catch(info => {
                console.log('验证失败:', info);
              });
          }}
        >
          提交
        </Button>
      ];
    }

    if (mode === 'edit') {
      return [
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button 
          key="save" 
          type="primary"
          onClick={() => {
            form.validateFields()
              .then(values => {
                handleSubmit(values);
              })
              .catch(info => {
                console.log('验证失败:', info);
              });
          }}
        >
          保存
        </Button>
      ];
    }
  };

  // 模态框标题
  const getModalTitle = () => {
    if (mode === 'create') return '创建询价单';
    if (mode === 'edit') return '编辑询价单';
    if (mode === 'view') {
      return (
        <Title level={5}>询价单详情</Title>
      );
    }
    return '';
  };

  return (
    <Modal
      title={getModalTitle()}
      open={visible}
      footer={renderFooterButtons()}
      onCancel={onCancel}
      width={800}
      destroyOnClose={true}
    >
      {mode === 'view' && (
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong>询价单ID：</strong> {record?.id}
          </div>
          <div>
            <strong>状态：</strong> 
            <Tag color={
              record?.status === '草稿' ? 'default' : 
              record?.status === '待审批' ? 'blue' : 
              record?.status === '已审批' ? 'green' : 
              record?.status === '已发布' ? 'cyan' : 
              record?.status === '已撤回' ? 'red' : 'default'
            } style={{ marginLeft: '8px' }}>
              {record?.status}
            </Tag>
          </div>
        </div>
      )}
      
      <Form
        form={form}
        layout="vertical"
        disabled={mode === 'view'}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="id"
              label="询价单编号"
              rules={[{ required: true, message: '请输入询价单编号' }]}
            >
              <Input disabled placeholder="系统自动生成" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="name"
              label="询价单名称"
              rules={[{ required: true, message: '请输入询价单名称' }]}
            >
              <Input placeholder="请输入询价单名称" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="oilType"
              label="油品类型和标号"
              rules={[{ required: true, message: '请选择油品类型' }]}
            >
              <Select 
                placeholder="请选择油品类型" 
                onChange={handleOilTypeChange}
                options={oilTypeOptions}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="quantity"
              label="预计采购数量(吨)"
              rules={[{ required: true, message: '请输入预计采购数量' }]}
            >
              <InputNumber 
                style={{ width: '100%' }} 
                min={1} 
                placeholder="请输入数量" 
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="quoteStartTime"
              label="报价开始时间"
              rules={[{ required: true, message: '请选择报价开始时间' }]}
            >
              <DatePicker 
                style={{ width: '100%' }} 
                showTime 
                format="YYYY-MM-DD HH:mm:ss" 
                placeholder="请选择开始时间"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="quoteEndTime"
              label="报价结束时间"
              rules={[{ required: true, message: '请选择报价结束时间' }]}
            >
              <DatePicker 
                style={{ width: '100%' }} 
                showTime 
                format="YYYY-MM-DD HH:mm:ss" 
                placeholder="请选择结束时间"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="expectedDeliveryTime"
              label="期望到货时间"
              rules={[{ required: true, message: '请选择期望到货时间' }]}
            >
              <DatePicker 
                style={{ width: '100%' }} 
                showTime 
                format="YYYY-MM-DD HH:mm:ss" 
                placeholder="请选择到货时间"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="maxPrice"
              label="最高限价(元/吨)"
              rules={[{ required: true, message: '请输入最高限价' }]}
            >
              <InputNumber 
                style={{ width: '100%' }} 
                min={0} 
                precision={2} 
                placeholder="请输入最高限价" 
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="deliveryAddress"
          label="期望到货地点"
          rules={[{ required: true, message: '请输入期望到货地点' }]}
        >
          <Input placeholder="请输入期望到货地点" />
        </Form.Item>

        <Form.Item
          name="suppliers"
          label="参与询价的供应商"
          rules={[{ required: true, message: '请选择参与询价的供应商' }]}
        >
          <Select
            mode="multiple"
            placeholder="请选择供应商"
            disabled={!selectedOilType}
          >
            {filteredSuppliers.map(supplier => (
              <Option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="remarks"
          label="备注"
        >
          <TextArea rows={4} placeholder="请输入备注信息" />
        </Form.Item>

        <Form.Item name="createTime" hidden>
          <Input />
        </Form.Item>

        <Form.Item name="createdBy" hidden>
          <Input />
        </Form.Item>

        <Form.Item name="status" hidden>
          <Input />
        </Form.Item>
      </Form>

      {renderApprovalFlow()}
    </Modal>
  );
};

export default InquiryForm; 