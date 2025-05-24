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
import deliveryLocations from '../../../mock/purchase/oil-inquiry/deliveryLocations.json';

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
  { value: '尿素', label: '尿素' },
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

  // 渲染状态信息
  const renderStatusInfo = () => {
    if (mode === 'view' && record && record.status !== '草稿') {
      return (
        <>
          <Divider orientation="left">状态信息</Divider>
          <div style={{ padding: '16px 0' }}>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <div>创建人：{record.createdBy}</div>
              </Col>
              <Col span={8}>
                <div>创建时间：{record.createTime}</div>
              </Col>
              <Col span={8}>
                <div>当前状态：
                  <Tag color={
                    record.status === '草稿' ? 'default' : 
                    record.status === '待发布' ? 'blue' : 
                    record.status === '询价中' ? 'geekblue' : 
                    record.status === '已取消' ? 'red' : 
                    record.status === '报价结束' ? 'orange' : 
                    record.status === '询价完成' ? 'green' : 'default'
                  }>
                    {record.status}
                  </Tag>
                </div>
              </Col>
            </Row>

            {record.status === '询价完成' && record.completedTime && (
              <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                <Col span={8}>
                  <div>完成时间：{record.completedTime}</div>
                </Col>
                <Col span={8}>
                  <div>中标供应商：{record.winnerSupplier || '未设置'}</div>
                </Col>
                <Col span={8}>
                  <div>最终价格：{record.finalPrice ? `${record.finalPrice}元/吨` : '未设置'}</div>
                </Col>
              </Row>
            )}

            {record.status === '已取消' && record.cancelReason && (
              <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                <Col span={24}>
                  <div>取消原因：{record.cancelReason}</div>
                </Col>
              </Row>
            )}
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
          保存草稿
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          onClick={() => {
            form.validateFields()
              .then(values => {
                handleSubmit({ ...values, status: '待发布' });
              })
              .catch(info => {
                console.log('验证失败:', info);
              });
          }}
        >
          保存并待发布
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
              record?.status === '待发布' ? 'blue' : 
              record?.status === '询价中' ? 'geekblue' : 
              record?.status === '已取消' ? 'red' : 
              record?.status === '报价结束' ? 'orange' : 
              record?.status === '询价完成' ? 'green' : 'default'
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
              name="deliveryLocation"
              label="期望到货地点"
              rules={[{ required: true, message: '请选择期望到货地点' }]}
            >
              <Select
                showSearch
                placeholder="请选择期望到货地点"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {deliveryLocations.map(location => (
                  <Option key={location.id} value={location.name}>
                    {location.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

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

      {renderStatusInfo()}
    </Modal>
  );
};

export default InquiryForm; 