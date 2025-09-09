import React, { useState, useEffect } from 'react';
import {
  Modal,
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Table,
  Tag,
  Space,
  message,
  Popconfirm,
  Row,
  Col
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  DollarOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import priceHistoryData from '../../../../mock/supplier/priceHistory.json';

const { Option } = Select;
const { TextArea } = Input;

const PriceManagementModal = ({ 
  visible, 
  onCancel, 
  productInfo, 
  supplierInfo 
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [priceHistory, setPriceHistory] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);

  // 从mock数据加载计量单位
  const units = priceHistoryData.units;

  // 根据商品和供应商加载价格历史数据
  const loadPriceHistory = (productId, supplierId) => {
    const supplierData = priceHistoryData.priceHistory[supplierId];
    if (supplierData && supplierData[productId]) {
      const history = supplierData[productId].map(price => ({
        ...price,
        status: getPriceStatus(price.startDate, price.endDate)
      }));
      return history;
    }
    return [];
  };

  useEffect(() => {
    if (visible && productInfo && supplierInfo) {
      // 加载价格历史数据
      const history = loadPriceHistory(productInfo.id, supplierInfo.id);
      setPriceHistory(history);
      // 重置表单
      form.resetFields();
      form.setFieldsValue({
        startDate: dayjs()
      });
      setHasChanges(false);
    }
  }, [visible, productInfo, supplierInfo, form]);

  // 获取价格状态
  const getPriceStatus = (startDate, endDate) => {
    const today = dayjs();
    const start = dayjs(startDate);
    const end = endDate ? dayjs(endDate) : null;

    if (start.isAfter(today)) {
      return 'future';
    } else if (end && end.isBefore(today)) {
      return 'expired';
    } else {
      return 'current';
    }
  };

  // 状态标签配置
  const statusConfig = {
    current: { color: 'success', text: '当前生效' },
    future: { color: 'processing', text: '尚未生效' },
    expired: { color: 'default', text: '已失效' }
  };

  // 添加价格到历史列表
  const handleAddPrice = () => {
    form.validateFields().then(values => {
      const newStartDate = values.startDate.format('YYYY-MM-DD');
      const newEndDate = values.endDate ? values.endDate.format('YYYY-MM-DD') : null;
      
      const newPrice = {
        id: `PH${Date.now()}`,
        productId: productInfo.id,
        supplierId: supplierInfo.id,
        price: parseFloat(values.price),
        unit: values.unit,
        startDate: newStartDate,
        endDate: newEndDate,
        status: getPriceStatus(newStartDate, newEndDate),
        notes: values.notes || '',
        createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        operator: '当前用户' // 实际项目中从登录信息获取
      };

      // 检查价格重叠（不包括即将被更新的当前价格）
      const hasOverlap = priceHistory.some(price => {
        // 如果是将被自动更新的当前价格，则不检查重叠
        if (price.status === 'current' && !price.endDate) {
          return false; // 将被自动更新，不算重叠
        }
        
        const existingStart = dayjs(price.startDate);
        const existingEnd = price.endDate ? dayjs(price.endDate) : dayjs().add(100, 'year');
        const newStart = dayjs(newStartDate);
        const newEnd = newEndDate ? dayjs(newEndDate) : dayjs().add(100, 'year');

        return (
          (newStart.isBefore(existingEnd) || newStart.isSame(existingEnd)) &&
          (newEnd.isAfter(existingStart) || newEnd.isSame(existingStart))
        );
      });

      if (hasOverlap) {
        message.warning('价格生效期与现有价格存在重叠，请检查日期设置');
        return;
      }

      // 价格自动更替逻辑：处理当前生效且无失效日期的价格
      let updatedHistory = [...priceHistory];
      const currentPriceIndex = updatedHistory.findIndex(price => 
        price.status === 'current' && !price.endDate
      );
      
      if (currentPriceIndex !== -1) {
        // 自动设置当前价格的失效日期为新价格生效日期的前一天
        const previousDay = dayjs(newStartDate).subtract(1, 'day').format('YYYY-MM-DD');
        updatedHistory[currentPriceIndex] = {
          ...updatedHistory[currentPriceIndex],
          endDate: previousDay,
          status: getPriceStatus(updatedHistory[currentPriceIndex].startDate, previousDay)
        };
        message.info(`自动将当前价格的失效日期设置为 ${previousDay}`);
      }

      // 添加新价格
      updatedHistory.push(newPrice);
      setPriceHistory(updatedHistory);
      setHasChanges(true);
      
      // 重置表单
      form.resetFields();
      form.setFieldsValue({
        startDate: dayjs()
      });
      
      message.success('价格已添加至历史列表');
    });
  };

  // 删除价格记录
  const handleDeletePrice = (priceId) => {
    const updatedHistory = priceHistory.filter(price => price.id !== priceId);
    setPriceHistory(updatedHistory);
    setHasChanges(true);
    message.success('价格记录已删除');
  };

  // 保存所有更改
  const handleSave = () => {
    setLoading(true);
    
    // 模拟API调用
    setTimeout(() => {
      console.log('保存价格历史:', {
        productId: productInfo.id,
        supplierId: supplierInfo.id,
        priceHistory: priceHistory
      });
      message.success('价格管理保存成功');
      setHasChanges(false);
      setLoading(false);
      onCancel();
    }, 1000);
  };

  // 表格列定义
  const columns = [
    {
      title: '采购价格',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (price) => (
        <span style={{ fontWeight: 500, color: '#1890ff' }}>
          ¥{price.toFixed(2)}
        </span>
      )
    },
    {
      title: '计价单位',
      dataIndex: 'unit',
      key: 'unit',
      width: 100,
      render: (unit) => (
        <Tag color="blue">{unit}</Tag>
      )
    },
    {
      title: '生效日期',
      dataIndex: 'startDate',
      key: 'startDate',
      width: 120,
      render: (date) => date
    },
    {
      title: '失效日期',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 120,
      render: (date) => date || '至今'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const config = statusConfig[status];
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '备注',
      dataIndex: 'notes',
      key: 'notes',
      ellipsis: true,
      render: (notes) => notes || '-'
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      fixed: 'right',
      render: (_, record) => {
        // 只有尚未生效的价格可以删除
        if (record.status === 'future') {
          return (
            <Popconfirm
              title="确定要删除这条价格记录吗？"
              onConfirm={() => handleDeletePrice(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="primary"
                size="small"
                danger
                icon={<DeleteOutlined />}
                style={{ borderRadius: '2px' }}
              >
                删除
              </Button>
            </Popconfirm>
          );
        }
        return <span style={{ color: '#ccc' }}>-</span>;
      }
    }
  ];

  return (
    <Modal
      title={
        <Space>
          <DollarOutlined style={{ color: '#1890ff' }} />
          <span>
            管理采购价格：{productInfo?.productName} - {supplierInfo?.name}
          </span>
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      width={1000}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          关闭
        </Button>,
        <Button 
          key="save" 
          type="primary" 
          loading={loading}
          disabled={!hasChanges}
          onClick={handleSave}
          style={{ borderRadius: '2px' }}
        >
          保存
        </Button>
      ]}
      destroyOnClose
    >
      {/* 核心信息区 */}
      <Card 
        title="商品信息" 
        size="small" 
        style={{ marginBottom: 16 }}
        headStyle={{ backgroundColor: '#f5f5f5', fontSize: '14px', fontWeight: 'bold' }}
      >
        <Row gutter={24}>
          <Col span={8}>
            <div style={{ marginBottom: 8 }}>
              <span style={{ color: '#666' }}>我方SKU：</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 500 }}>
                {productInfo?.ourSku}
              </span>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ marginBottom: 8 }}>
              <span style={{ color: '#666' }}>商品名称：</span>
              <span style={{ fontWeight: 500 }}>{productInfo?.productName}</span>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ marginBottom: 8 }}>
              <span style={{ color: '#666' }}>供应商：</span>
              <span style={{ fontWeight: 500 }}>{supplierInfo?.name}</span>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 新增价格区 */}
      <Card 
        title="新增价格" 
        size="small" 
        style={{ marginBottom: 16 }}
        headStyle={{ backgroundColor: '#f5f5f5', fontSize: '14px', fontWeight: 'bold' }}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name="price"
                label="采购价格"
                rules={[
                  { required: true, message: '请输入采购价格' },
                  { 
                    pattern: /^\d+(\.\d{1,2})?$/, 
                    message: '请输入有效的价格，最多保留2位小数' 
                  }
                ]}
              >
                <Input 
                  placeholder="请输入价格"
                  prefix="¥"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="unit"
                label="计价单位"
                rules={[{ required: true, message: '请选择计价单位' }]}
              >
                <Select placeholder="请选择单位" style={{ width: '100%' }}>
                  {units.map(unit => (
                    <Option key={unit.value} value={unit.value}>
                      {unit.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="startDate"
                label="生效日期"
                rules={[
                  { required: true, message: '请选择生效日期' },
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve();
                      const endDate = form.getFieldValue('endDate');
                      if (endDate && value.isAfter(endDate)) {
                        return Promise.reject(new Error('生效日期不能晚于失效日期'));
                      }
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <DatePicker 
                  placeholder="选择生效日期"
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="endDate"
                label="失效日期"
                rules={[
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve();
                      const startDate = form.getFieldValue('startDate');
                      if (startDate && value.isBefore(startDate)) {
                        return Promise.reject(new Error('失效日期不能早于生效日期'));
                      }
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <DatePicker 
                  placeholder="选择失效日期（可选）"
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={18}>
              <Form.Item
                name="notes"
                label="备注"
              >
                <TextArea 
                  placeholder="请输入备注信息（可选）"
                  rows={2}
                />
              </Form.Item>
            </Col>
            <Col span={6} style={{ display: 'flex', alignItems: 'flex-end' }}>
              <Form.Item style={{ marginBottom: 0, width: '100%' }}>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddPrice}
                  style={{ width: '100%', borderRadius: '2px' }}
                >
                  添加至历史列表
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* 价格历史列表 */}
      <Card 
        title="价格历史列表" 
        size="small"
        headStyle={{ backgroundColor: '#f5f5f5', fontSize: '14px', fontWeight: 'bold' }}
      >
        <Table
          columns={columns}
          dataSource={priceHistory.sort((a, b) => dayjs(b.startDate).valueOf() - dayjs(a.startDate).valueOf())}
          rowKey="id"
          pagination={false}
          scroll={{ x: 700 }}
          size="small"
          locale={{
            emptyText: '暂无价格记录，请在上方添加价格'
          }}
          rowClassName={(record) => {
            if (record.status === 'current') return 'current-price-row';
            if (record.status === 'future') return 'future-price-row';
            return 'expired-price-row';
          }}
        />      
      </Card>
      
      {/* 自定义样式 */}
      <style jsx>{`
        :global(.current-price-row) {
          background-color: #f6ffed !important;
          border-left: 3px solid #52c41a;
        }
        :global(.future-price-row) {
          background-color: #e6f7ff !important;
          border-left: 3px solid #1890ff;
        }
        :global(.expired-price-row) {
          background-color: #f5f5f5 !important;
          color: #999;
        }
        :global(.current-price-row:hover),
        :global(.future-price-row:hover),
        :global(.expired-price-row:hover) {
          background-color: inherit !important;
        }
      `}</style>
    </Modal>
  );
};

export default PriceManagementModal;