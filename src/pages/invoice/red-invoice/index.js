import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Button, 
  Table, 
  Space, 
  message, 
  Modal, 
  Descriptions,
  Tag,
  Divider
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  ExclamationCircleOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons';
import InvoiceAmountDisplay from '../components/InvoiceAmountDisplay';

// 模拟数据导入
import redInvoiceData from '../../../mock/invoice/redInvoiceAndManual.json';

const { RangePicker } = DatePicker;
const { Option } = Select;

const RedInvoiceManagement = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (params = {}) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const data = redInvoiceData.redInvoiceRequests.map(item => ({
        ...item,
        key: item.id
      }));
      
      setTableData(data);
      setPagination(prev => ({
        ...prev,
        total: data.length
      }));
    } catch (error) {
      message.error('数据加载失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (values) => {
    const params = {
      ...values,
      startDate: values.requestTimeRange?.[0]?.format('YYYY-MM-DD'),
      endDate: values.requestTimeRange?.[1]?.format('YYYY-MM-DD')
    };
    delete params.requestTimeRange;
    
    await loadData(params);
    message.success('查询完成');
  };

  const handleReset = () => {
    form.resetFields();
    loadData();
  };

  const handleView = (record) => {
    setSelectedRecord(record);
    setDetailModalVisible(true);
  };

  const handleApprove = (record) => {
    Modal.confirm({
      title: '确认审批通过',
      content: `确定要审批通过这个红冲申请吗？\n红冲流水号：${record.redOrderCode}`,
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        try {
          message.loading('正在处理审批...', 2);
          await new Promise(resolve => setTimeout(resolve, 2000));
          message.success('审批通过，红冲处理中');
          loadData();
        } catch (error) {
          message.error('审批失败');
        }
      }
    });
  };

  const handleReject = (record) => {
    Modal.confirm({
      title: '确认拒绝申请',
      content: `确定要拒绝这个红冲申请吗？\n红冲流水号：${record.redOrderCode}`,
      icon: <ExclamationCircleOutlined />,
      okType: 'danger',
      onOk: async () => {
        try {
          message.loading('正在处理拒绝...', 2);
          await new Promise(resolve => setTimeout(resolve, 2000));
          message.success('已拒绝红冲申请');
          loadData();
        } catch (error) {
          message.error('操作失败');
        }
      }
    });
  };

  const getApprovalStatusTag = (status) => {
    const statusMap = {
      '待审批': { color: 'orange', text: '待审批' },
      '已审批': { color: 'green', text: '已审批' },
      '已拒绝': { color: 'red', text: '已拒绝' }
    };
    const config = statusMap[status] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getProcessStatusTag = (status) => {
    const statusMap = {
      '待处理': { color: 'orange', text: '待处理' },
      '处理中': { color: 'blue', text: '处理中' },
      '红冲成功': { color: 'green', text: '红冲成功' },
      '红冲失败': { color: 'red', text: '红冲失败' },
      '拒绝处理': { color: 'volcano', text: '拒绝处理' }
    };
    const config = statusMap[status] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const columns = [
    {
      title: '红冲流水号',
      dataIndex: 'redOrderCode',
      width: 160,
      fixed: 'left'
    },
    {
      title: '原发票号码',
      dataIndex: 'originalInvoiceNo',
      width: 180
    },
    {
      title: '购买方名称',
      dataIndex: 'buyerName',
      width: 200,
      ellipsis: true
    },
    {
      title: '红冲类型',
      dataIndex: 'requestType',
      width: 100,
      render: (text) => (
        <Tag color={text === '全额红冲' ? 'blue' : 'orange'}>
          {text}
        </Tag>
      )
    },
    {
      title: '红冲金额',
      dataIndex: 'redAmount',
      width: 120,
      align: 'right',
      render: (value) => (
        <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
          ¥{value?.toFixed(2)}
        </span>
      )
    },
    {
      title: '红冲原因',
      dataIndex: 'requestReason',
      width: 140,
      ellipsis: true
    },
    {
      title: '申请时间',
      dataIndex: 'requestTime',
      width: 160
    },
    {
      title: '审批状态',
      dataIndex: 'approvalStatus',
      width: 100,
      render: getApprovalStatusTag
    },
    {
      title: '处理状态',
      dataIndex: 'processStatus',
      width: 100,
      render: getProcessStatusTag
    },
    {
      title: '操作员',
      dataIndex: 'operatorName',
      width: 100
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            size="small"
            onClick={() => handleView(record)}
            style={{ borderRadius: '2px' }}
          >
            查看
          </Button>
          {record.approvalStatus === '待审批' && (
            <>
              <Button 
                type="primary" 
                size="small"
                icon={<CheckOutlined />}
                onClick={() => handleApprove(record)}
                style={{ borderRadius: '2px' }}
              >
                通过
              </Button>
              <Button 
                type="primary"
                size="small"
                danger
                icon={<CloseOutlined />}
                onClick={() => handleReject(record)}
                style={{ borderRadius: '2px' }}
              >
                拒绝
              </Button>
            </>
          )}
        </Space>
      )
    }
  ];

  return (
    <div>
      {/* 搜索区域 */}
      <Card className="filter-card" style={{ marginBottom: 16 }}>
        <Form 
          form={form} 
          layout="inline" 
          onFinish={handleSearch}
          style={{ marginBottom: 16 }}
        >
          <Form.Item name="redOrderCode" label="红冲流水号" style={{ width: 200 }}>
            <Input placeholder="请输入红冲流水号" />
          </Form.Item>
          
          <Form.Item name="originalInvoiceNo" label="原发票号码" style={{ width: 200 }}>
            <Input placeholder="请输入原发票号码" />
          </Form.Item>
          
          <Form.Item name="buyerName" label="购买方" style={{ width: 200 }}>
            <Input placeholder="请输入购买方名称" />
          </Form.Item>
          
          <Form.Item name="approvalStatus" label="审批状态" style={{ width: 120 }}>
            <Select placeholder="请选择" allowClear>
              <Option value="待审批">待审批</Option>
              <Option value="已审批">已审批</Option>
              <Option value="已拒绝">已拒绝</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="processStatus" label="处理状态" style={{ width: 120 }}>
            <Select placeholder="请选择" allowClear>
              <Option value="待处理">待处理</Option>
              <Option value="处理中">处理中</Option>
              <Option value="红冲成功">红冲成功</Option>
              <Option value="红冲失败">红冲失败</Option>
              <Option value="拒绝处理">拒绝处理</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="requestTimeRange" label="申请时间" style={{ width: 300 }}>
            <RangePicker format="YYYY-MM-DD" />
          </Form.Item>
        </Form>
        
        <Divider style={{ margin: '16px 0' }} />
        
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<SearchOutlined />}
              loading={loading}
              onClick={() => form.submit()}
              style={{ borderRadius: '2px' }}
            >
              查询
            </Button>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={handleReset}
              style={{ borderRadius: '2px' }}
            >
              重置
            </Button>
          </Space>
        </div>
      </Card>

      {/* 红冲申请列表 */}
      <Card title="红冲申请列表">
        <Table
          columns={columns}
          dataSource={tableData}
          loading={loading}
          pagination={pagination}
          scroll={{ x: 'max-content' }}
          size="middle"
        />
      </Card>

      {/* 详情弹窗 */}
      <Modal
        title="红冲申请详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
        style={{ borderRadius: '2px' }}
      >
        {selectedRecord && (
          <div>
            <Descriptions title="红冲申请信息" column={2} bordered>
              <Descriptions.Item label="红冲流水号">
                {selectedRecord.redOrderCode}
              </Descriptions.Item>
              <Descriptions.Item label="原订单流水号">
                {selectedRecord.originalOrderCode}
              </Descriptions.Item>
              <Descriptions.Item label="原发票号码">
                {selectedRecord.originalInvoiceNo}
              </Descriptions.Item>
              <Descriptions.Item label="红字发票号码">
                {selectedRecord.redInvoiceNo || '暂无'}
              </Descriptions.Item>
              <Descriptions.Item label="购买方名称">
                {selectedRecord.buyerName}
              </Descriptions.Item>
              <Descriptions.Item label="纳税人识别号">
                {selectedRecord.buyerTaxNo}
              </Descriptions.Item>
              <Descriptions.Item label="红冲类型">
                <Tag color={selectedRecord.requestType === '全额红冲' ? 'blue' : 'orange'}>
                  {selectedRecord.requestType}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="原发票金额">
                <InvoiceAmountDisplay totalWithTax={selectedRecord.originalAmount} />
              </Descriptions.Item>
              <Descriptions.Item label="红冲金额">
                <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
                  ¥{selectedRecord.redAmount?.toFixed(2)}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="红冲原因">
                {selectedRecord.requestReason}
              </Descriptions.Item>
              <Descriptions.Item label="申请时间">
                {selectedRecord.requestTime}
              </Descriptions.Item>
              <Descriptions.Item label="申请人">
                {selectedRecord.operatorName}
              </Descriptions.Item>
              <Descriptions.Item label="审批状态">
                {getApprovalStatusTag(selectedRecord.approvalStatus)}
              </Descriptions.Item>
              <Descriptions.Item label="审批时间">
                {selectedRecord.approvalTime || '暂无'}
              </Descriptions.Item>
              <Descriptions.Item label="审批人">
                {selectedRecord.approverName || '暂无'}
              </Descriptions.Item>
              <Descriptions.Item label="处理状态">
                {getProcessStatusTag(selectedRecord.processStatus)}
              </Descriptions.Item>
              <Descriptions.Item label="红冲时间">
                {selectedRecord.redInvoiceTime || '暂无'}
              </Descriptions.Item>
              <Descriptions.Item label="备注信息" span={2}>
                {selectedRecord.remarks || '无'}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RedInvoiceManagement;