import React, { useState, useEffect } from 'react';
import { Table, message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import InvoiceSearchForm from '../components/InvoiceSearchForm';
import InvoiceStatusTag from '../components/InvoiceStatusTag';
import InvoiceAmountDisplay from '../components/InvoiceAmountDisplay';
import InvoiceActionButtons from '../components/InvoiceActionButtons';
import InvoiceDetailModal from '../components/InvoiceDetailModal';
import RedInvoiceModal from '../components/RedInvoiceModal';

// 模拟数据导入
import invoiceRecordsData from '../../../mock/invoice/invoiceRecords.json';

const RecordsManagement = () => {
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
  });
  const [searchParams, setSearchParams] = useState({});
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [redInvoiceModalVisible, setRedInvoiceModalVisible] = useState(false);

  // 初始化数据
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (params = {}) => {
    setLoading(true);
    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const data = invoiceRecordsData.invoiceRecords.map(item => ({
        ...item,
        key: item.id
      }));
      
      setTableData(data);
      setPagination(prev => ({
        ...prev,
        total: invoiceRecordsData.totalCount
      }));
    } catch (error) {
      message.error('数据加载失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (values) => {
    setSearchParams(values);
    setPagination(prev => ({ ...prev, current: 1 }));
    loadData(values);
    message.success('查询完成');
  };

  const handleReset = () => {
    setSearchParams({});
    setPagination(prev => ({ ...prev, current: 1 }));
    loadData();
  };

  const handleExport = (params) => {
    message.success('导出功能开发中...');
  };

  const handleView = (record) => {
    setSelectedInvoice(record);
    setDetailModalVisible(true);
  };

  const handleDownload = (record) => {
    message.success(`开始下载发票：${record.invoiceNo}`);
  };

  const handleRetry = (record) => {
    Modal.confirm({
      title: '确认重试开票',
      content: `确定要重试开票吗？流水号：${record.orderCode}`,
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        try {
          message.loading('正在重试开票...', 2);
          // 模拟重试API
          await new Promise(resolve => setTimeout(resolve, 2000));
          message.success('重试开票成功');
          loadData(searchParams);
        } catch (error) {
          message.error('重试开票失败');
        }
      }
    });
  };

  const handleResend = (record) => {
    Modal.confirm({
      title: '确认重发邮件',
      content: `确定要重新发送发票邮件吗？\n邮箱：${record.emailAddress}`,
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        try {
          message.loading('正在发送邮件...', 2);
          await new Promise(resolve => setTimeout(resolve, 2000));
          message.success('邮件发送成功');
        } catch (error) {
          message.error('邮件发送失败');
        }
      }
    });
  };

  const handleEdit = (record) => {
    message.info('编辑功能开发中...');
  };

  const handleRedInvoice = (record) => {
    setSelectedInvoice(record);
    setRedInvoiceModalVisible(true);
  };

  const handleRedInvoiceSubmit = async (formData) => {
    try {
      message.loading('正在提交红冲申请...', 2);
      await new Promise(resolve => setTimeout(resolve, 2000));
      message.success('红冲申请提交成功');
      setRedInvoiceModalVisible(false);
      loadData(searchParams);
    } catch (error) {
      message.error('红冲申请提交失败');
    }
  };

  const handleTableChange = (pag, filters, sorter) => {
    setPagination(pag);
    loadData({ ...searchParams, ...pag });
  };

  const columns = [
    {
      title: '发票流水号',
      dataIndex: 'orderCode',
      width: 160,
      fixed: 'left'
    },
    {
      title: '发票号码',
      dataIndex: 'invoiceNo',
      width: 180,
      render: (text) => text || <span style={{ color: '#ccc' }}>暂无</span>
    },
    {
      title: '购买方名称',
      dataIndex: 'buyerName',
      width: 200,
      ellipsis: true
    },
    {
      title: '开票金额',
      dataIndex: 'totalAmountWithTax',
      width: 120,
      align: 'right',
      render: (value, record) => (
        <InvoiceAmountDisplay 
          totalWithTax={value}
          amount={record.totalAmount}
          tax={record.totalTax}
        />
      )
    },
    {
      title: '开票状态',
      dataIndex: 'invoiceStatus',
      width: 100,
      render: (value) => <InvoiceStatusTag status={value} />
    },
    {
      title: '发票类型',
      dataIndex: 'invoiceType',
      width: 140,
      render: (value) => value === '01' ? '增值税普通发票' : '增值税电子普通发票'
    },
    {
      title: '油站名称',
      dataIndex: 'oilStationName',
      width: 160,
      ellipsis: true
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 160
    },
    {
      title: '开票时间',
      dataIndex: 'invoiceTime',
      width: 160,
      render: (text) => text || <span style={{ color: '#ccc' }}>暂无</span>
    },
    {
      title: '操作员',
      dataIndex: 'operatorName',
      width: 100
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      fixed: 'right',
      render: (_, record) => (
        <InvoiceActionButtons
          record={record}
          onView={handleView}
          onDownload={handleDownload}
          onRetry={handleRetry}
          onResend={handleResend}
          onEdit={handleEdit}
          onRedInvoice={handleRedInvoice}
        />
      )
    }
  ];

  return (
    <div>
      <InvoiceSearchForm
        onSearch={handleSearch}
        onReset={handleReset}
        onExport={handleExport}
        loading={loading}
      />

      <Table
        columns={columns}
        dataSource={tableData}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        scroll={{ x: 'max-content' }}
        size="middle"
      />

      <InvoiceDetailModal
        visible={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        invoiceData={selectedInvoice}
        onDownload={handleDownload}
        onResendEmail={handleResend}
      />

      <RedInvoiceModal
        visible={redInvoiceModalVisible}
        onCancel={() => setRedInvoiceModalVisible(false)}
        onOk={handleRedInvoiceSubmit}
        originalInvoice={selectedInvoice}
      />
    </div>
  );
};

export default RecordsManagement;