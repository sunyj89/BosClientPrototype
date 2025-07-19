import React, { useState, useRef, useEffect } from 'react';
import { Card, Tabs, Table, Button, Space, Upload, message, Form, DatePicker, Select, Input, Modal, Descriptions, Tag } from 'antd';
import { UploadOutlined, SearchOutlined, ReloadOutlined, DownloadOutlined, ExportOutlined } from '@ant-design/icons';
import warehouseDeliveryData from '../../../mock/logistics/warehouseDeliveryData.json';
import './index.css';

const { RangePicker } = DatePicker;
const { Option } = Select;

const OilWarehouseDelivery = () => {
  const [activeTab, setActiveTab] = useState('sinopec');
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [searchForm] = Form.useForm();
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  // 初始化数据
  useEffect(() => {
    setTableData(warehouseDeliveryData.sinopecDeliveryData);
  }, []);

  // 显示查看弹窗
  const showViewModal = (record) => {
    setCurrentRecord(record);
    setIsViewModalVisible(true);
  };

  // 关闭查看弹窗
  const closeViewModal = () => {
    setIsViewModalVisible(false);
    setCurrentRecord(null);
  };

  // 处理文件上传
  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target.result;
        const lines = csv.split('\n');
        
        if (lines.length < 2) {
          message.error('文件格式不正确或数据为空');
          return;
        }

        // 解析CSV数据
        const data = [];
        
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim()) {
            const values = lines[i].split(',');
                         const record = {
               id: i,
               deliveryDate: values[0]?.replace(/"/g, ''),
               teamName: values[1]?.replace(/"/g, ''),
               vehicle: values[2]?.replace(/"/g, ''),
               trip: values[3]?.replace(/"/g, ''),
               section: values[4]?.replace(/"/g, ''),
               compartment: values[5]?.replace(/"/g, ''),
               fromStation: values[6]?.replace(/"/g, ''),
               toStation: values[7]?.replace(/"/g, ''),
               tankNo: values[8]?.replace(/"/g, ''),
               oilProduct: values[9]?.replace(/"/g, ''),
               deliveryVolume: values[10]?.replace(/"/g, ''),
               deliveryWeight: values[11]?.replace(/"/g, ''),
               erpNo: values[12]?.replace(/"/g, ''),
               materialVoucherNo: values[13]?.replace(/"/g, ''),
               erpDeliveryTime: values[14]?.replace(/"/g, ''),
               deliveryVolumeERP: values[15]?.replace(/"/g, ''),
               deliveryWeightERP: values[16]?.replace(/"/g, ''),
               fromStationCode: values[17]?.replace(/"/g, ''),
               toStationCode: values[18]?.replace(/"/g, ''),
               isReasonable: values[19]?.replace(/"/g, ''),
               unreasonableReason: values[20]?.replace(/"/g, ''),
               unreasonableReasonRemark: values[21]?.replace(/"/g, ''),
               adjustmentReason: values[22]?.replace(/"/g, ''),
               operator: values[23]?.replace(/"/g, ''),
               belongingUnit: values[24]?.replace(/"/g, ''),
               region: values[25]?.replace(/"/g, ''),
               documentType: values[26]?.replace(/"/g, ''),
               documentSource: values[27]?.replace(/"/g, ''),
               carrierName: values[28]?.replace(/"/g, ''),
               carrierCode: values[29]?.replace(/"/g, ''),
               teamCode: values[30]?.replace(/"/g, ''),
               driver: values[31]?.replace(/"/g, ''),
               distance: values[32]?.replace(/"/g, ''),
               acceptanceTime: values[33]?.replace(/"/g, ''),
               acceptanceVolume: values[34]?.replace(/"/g, ''),
               densityDiff: values[35]?.replace(/"/g, ''),
               orderNo: values[36]?.replace(/"/g, ''),
               deliveryNo: values[37]?.replace(/"/g, ''),
               erpTransmitter: values[38]?.replace(/"/g, ''),
               estimatedFreight: values[39]?.replace(/"/g, ''),
               reasonableFreight: values[40]?.replace(/"/g, ''),
               freightIncrement: values[41]?.replace(/"/g, ''),
               demandNo: values[42]?.replace(/"/g, ''),
               volumeLoadRate: values[43]?.replace(/"/g, ''),
               weightLoadRate: values[44]?.replace(/"/g, ''),
               remark: values[45]?.replace(/"/g, ''),
               deliveryOrderNo: values[46]?.replace(/"/g, ''),
               secondVoucher: values[47]?.replace(/"/g, ''),
               densityVoucher: values[48]?.replace(/"/g, ''),
               importTime: new Date().toLocaleString('zh-CN', {
                 year: 'numeric',
                 month: '2-digit',
                 day: '2-digit',
                 hour: '2-digit',
                 minute: '2-digit',
                 second: '2-digit',
                 hour12: false
               }).replace(/\//g, '-'),
             };
            data.push(record);
          }
        }

        setTableData(data);
        message.success(`成功导入${data.length}条记录`);
      } catch (error) {
        message.error('文件解析失败，请检查文件格式');
        console.error('CSV解析错误:', error);
      }
    };
    
    reader.readAsText(file, 'UTF-8');
    return false; // 阻止默认上传
  };

  // 处理搜索
  const handleSearch = (values) => {
    setLoading(true);
    console.log('搜索条件:', values);
    
    // 模拟搜索延迟
    setTimeout(() => {
      setLoading(false);
      message.success('搜索完成');
    }, 1000);
  };

  // 处理重置
  const handleReset = () => {
    searchForm.resetFields();
    setTableData(warehouseDeliveryData.sinopecDeliveryData);
  };

  // 下载模板
  const downloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/报表模板/中石化油库出库ERP数据模版2025512.csv';
    link.download = '中石化出库单导入模板.csv';
    link.click();
    message.success('模板下载完成');
  };

  // 导出数据
  const exportData = () => {
    if (tableData.length === 0) {
      message.warning('暂无数据可导出');
      return;
    }
    
    // 简单的CSV导出实现
    const headers = [
      '配送日期', '车队名称', '车辆', '趟', '次', '隔舱', '发站地址', '到站地址', 
      '灌号', '油品名称', '配送升数', '配送数量', 'ERP单号', '物料凭证号', 'ERP出库时间',
      '配送升数ERP', '配送数量ERP', '发站代码', '到站代码', '是否合理', '非合理原因',
      '非合理原因备注', '调整原因', '制单人', '到站所属单位', '区域', '单据类型',
      '单据来源', '承运商名称', '承运商代码', '车队代码', '驾驶员', '行程距离',
      '验收时间', '验收升数', '密度差', '订单号', '交货单号', 'ERP传输人', '预估运费',
      '合理运费', '运费增量', '需求单号', '体积满载率', '质量满载率', '备注', '配送单号',
      '二次过账凭证', '密度差凭证', '数据导入时间'
    ];
    
    const csvContent = [
      headers.join(','),
      ...tableData.map(row => [
        row.deliveryDate, row.teamName, row.vehicle, row.trip, row.section,
        row.compartment, row.fromStation, row.toStation, row.tankNo, row.oilProduct,
        row.deliveryVolume, row.deliveryWeight, row.erpNo, row.materialVoucherNo,
        row.erpDeliveryTime, row.deliveryVolumeERP, row.deliveryWeightERP,
        row.fromStationCode, row.toStationCode, row.isReasonable, row.unreasonableReason,
        row.unreasonableReasonRemark, row.adjustmentReason, row.operator,
        row.belongingUnit, row.region, row.documentType, row.documentSource,
        row.carrierName, row.carrierCode, row.teamCode, row.driver, row.distance,
        row.acceptanceTime, row.acceptanceVolume, row.densityDiff, row.orderNo,
        row.deliveryNo, row.erpTransmitter, row.estimatedFreight, row.reasonableFreight,
        row.freightIncrement, row.demandNo, row.volumeLoadRate, row.weightLoadRate,
        row.remark, row.deliveryOrderNo, row.secondVoucher, row.densityVoucher, row.importTime
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `中石化出库单数据_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    message.success('数据导出完成');
  };

  // 表格列定义
  const columns = [
    {
      title: '配送单号',
      dataIndex: 'deliveryOrderNo',
      key: 'deliveryOrderNo',
      width: 150,
      fixed: 'left',
    },
    {
      title: '区域',
      dataIndex: 'region',
      key: 'region',
      width: 80,
    },
    {
      title: '发站地址',
      dataIndex: 'fromStation',
      key: 'fromStation',
      width: 160,
    },
    {
      title: '发站代码',
      dataIndex: 'fromStationCode',
      key: 'fromStationCode',
      width: 100,
    },
    {
      title: '到站地址',
      dataIndex: 'toStation',
      key: 'toStation',
      width: 160,
    },
    {
      title: '到站代码',
      dataIndex: 'toStationCode',
      key: 'toStationCode',
      width: 100,
    },
    {
      title: '油品名称',
      dataIndex: 'oilProduct',
      key: 'oilProduct',
      width: 140,
    },
    {
      title: '配送升数',
      dataIndex: 'deliveryVolume',
      key: 'deliveryVolume',
      width: 120,
      align: 'right',
    },
    {
      title: '验收升数',
      dataIndex: 'acceptanceVolume',
      key: 'acceptanceVolume',
      width: 120,
      align: 'right',
      render: (text) => text || '-',
    },
    {
      title: '承运商名称',
      dataIndex: 'carrierName',
      key: 'carrierName',
      width: 180,
    },
    {
      title: '车队名称',
      dataIndex: 'teamName',
      key: 'teamName',
      width: 140,
    },
    {
      title: '车辆',
      dataIndex: 'vehicle',
      key: 'vehicle',
      width: 120,
    },
    {
      title: '驾驶员',
      dataIndex: 'driver',
      key: 'driver',
      width: 100,
      render: (text) => text || '-',
    },
    {
      title: '行程距离',
      dataIndex: 'distance',
      key: 'distance',
      width: 100,
      align: 'right',
      render: (text) => text ? `${text}km` : '-',
    },
    {
      title: '数据导入时间',
      dataIndex: 'importTime',
      key: 'importTime',
      width: 160,
      render: (text) => text || '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" onClick={() => showViewModal(record)}>
            查看
          </Button>
        </Space>
      ),
    },
  ];

  // Tab内容
  const renderSinopecTab = () => (
    <div>
      {/* 搜索表单 */}
      <Form
        form={searchForm}
        layout="inline"
        onFinish={handleSearch}
        style={{ marginBottom: 16, padding: 16, background: '#fff', borderRadius: 4 }}
      >
        <Form.Item name="dateRange" label="配送日期">
          <RangePicker placeholder={['开始日期', '结束日期']} />
        </Form.Item>
        
        <Form.Item name="teamName" label="车队名称">
          <Select style={{ width: 160 }} placeholder="请选择车队" allowClear>
            <Option value="实华赣州车队">实华赣州车队</Option>
            <Option value="三江上饶车队">三江上饶车队</Option>
            <Option value="江海抚州车队">江海抚州车队</Option>
            <Option value="群顺九江车队">群顺九江车队</Option>
            <Option value="华安萍乡车队">华安萍乡车队</Option>
          </Select>
        </Form.Item>
        
        <Form.Item name="oilProduct" label="油品名称">
          <Select style={{ width: 160 }} placeholder="请选择油品" allowClear>
            <Option value="92号车用汽油(ⅥB)">92号车用汽油(ⅥB)</Option>
            <Option value="95号车用汽油(ⅥB)">95号车用汽油(ⅥB)</Option>
            <Option value="0号车用柴油(Ⅵ)">0号车用柴油(Ⅵ)</Option>
          </Select>
        </Form.Item>
        
        <Form.Item name="erpNo" label="ERP单号">
          <Input placeholder="请输入ERP单号" style={{ width: 160 }} />
        </Form.Item>
        
        <Form.Item name="deliveryOrderNo" label="配送单号">
          <Input placeholder="请输入配送单号" style={{ width: 160 }} />
        </Form.Item>
        
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              查询
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              重置
            </Button>
            <Upload
              beforeUpload={handleFileUpload}
              showUploadList={false}
              accept=".csv"
            >
              <Button type="primary" icon={<UploadOutlined />}>
                导入数据
              </Button>
            </Upload>
            <Button icon={<DownloadOutlined />} onClick={downloadTemplate}>
              下载模板
            </Button>
            <Button icon={<ExportOutlined />} onClick={exportData}>
              导出数据
            </Button>
          </Space>
        </Form.Item>
      </Form>

      {/* 数据表格 */}
      <Table
        columns={columns}
        dataSource={tableData}
        loading={loading}
        rowKey="id"
        scroll={{ x: 'max-content' }}
        pagination={{
          total: tableData.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
        }}
        size="small"
      />
    </div>
  );

  // 渲染查看弹窗
  const renderViewModal = () => (
    <Modal
      title="中石化出库单详情"
      open={isViewModalVisible}
      onCancel={closeViewModal}
      footer={[
        <Button key="close" onClick={closeViewModal}>
          关闭
        </Button>
      ]}
      width={900}
    >
      {currentRecord && (
        <div>
          {/* 基本信息 */}
          <Descriptions column={2} bordered>
            <Descriptions.Item label="配送单号">{currentRecord.deliveryOrderNo}</Descriptions.Item>
            <Descriptions.Item label="配送日期">{currentRecord.deliveryDate}</Descriptions.Item>
            <Descriptions.Item label="区域">{currentRecord.region}</Descriptions.Item>
            <Descriptions.Item label="ERP单号">{currentRecord.erpNo}</Descriptions.Item>
            <Descriptions.Item label="物料凭证号">{currentRecord.materialVoucherNo}</Descriptions.Item>
            <Descriptions.Item label="ERP出库时间">{currentRecord.erpDeliveryTime}</Descriptions.Item>
            <Descriptions.Item label="发站地址">{currentRecord.fromStation}</Descriptions.Item>
            <Descriptions.Item label="发站代码">{currentRecord.fromStationCode}</Descriptions.Item>
            <Descriptions.Item label="到站地址">{currentRecord.toStation}</Descriptions.Item>
            <Descriptions.Item label="到站代码">{currentRecord.toStationCode}</Descriptions.Item>
            <Descriptions.Item label="油品名称">{currentRecord.oilProduct}</Descriptions.Item>
            <Descriptions.Item label="灌号">{currentRecord.tankNo}</Descriptions.Item>
            <Descriptions.Item label="配送升数">{currentRecord.deliveryVolume}</Descriptions.Item>
            <Descriptions.Item label="配送数量">{currentRecord.deliveryWeight}</Descriptions.Item>
            <Descriptions.Item label="配送升数ERP">{currentRecord.deliveryVolumeERP}</Descriptions.Item>
            <Descriptions.Item label="配送数量ERP">{currentRecord.deliveryWeightERP}</Descriptions.Item>
            <Descriptions.Item label="验收时间">{currentRecord.acceptanceTime || '-'}</Descriptions.Item>
            <Descriptions.Item label="验收升数">{currentRecord.acceptanceVolume || '-'}</Descriptions.Item>
            <Descriptions.Item label="密度差">{currentRecord.densityDiff || '-'}</Descriptions.Item>
            <Descriptions.Item label="是否合理">
              <Tag color={currentRecord.isReasonable === '合理' ? 'green' : 'red'}>
                {currentRecord.isReasonable}
              </Tag>
            </Descriptions.Item>
          </Descriptions>

          {/* 运输信息 */}
          <div style={{ 
            fontSize: 16, 
            fontWeight: 'bold', 
            marginBottom: 16,
            marginTop: 24,
            borderBottom: '1px solid #f0f0f0',
            paddingBottom: 8
          }}>
            运输信息
          </div>
          <Descriptions column={3} bordered size="small">
            <Descriptions.Item label="承运商名称">{currentRecord.carrierName}</Descriptions.Item>
            <Descriptions.Item label="承运商代码">{currentRecord.carrierCode}</Descriptions.Item>
            <Descriptions.Item label="车队名称">{currentRecord.teamName}</Descriptions.Item>
            <Descriptions.Item label="车队代码">{currentRecord.teamCode}</Descriptions.Item>
            <Descriptions.Item label="车辆">{currentRecord.vehicle}</Descriptions.Item>
            <Descriptions.Item label="驾驶员">{currentRecord.driver || '-'}</Descriptions.Item>
            <Descriptions.Item label="行程距离">{currentRecord.distance ? `${currentRecord.distance}km` : '-'}</Descriptions.Item>
            <Descriptions.Item label="趟">{currentRecord.trip}</Descriptions.Item>
            <Descriptions.Item label="次">{currentRecord.section}</Descriptions.Item>
            <Descriptions.Item label="隔舱">{currentRecord.compartment}</Descriptions.Item>
            <Descriptions.Item label="体积满载率">{currentRecord.volumeLoadRate ? `${currentRecord.volumeLoadRate}%` : '-'}</Descriptions.Item>
            <Descriptions.Item label="质量满载率">{currentRecord.weightLoadRate ? `${currentRecord.weightLoadRate}%` : '-'}</Descriptions.Item>
          </Descriptions>

          {/* 业务信息 */}
          <div style={{ 
            fontSize: 16, 
            fontWeight: 'bold', 
            marginBottom: 16,
            marginTop: 24,
            borderBottom: '1px solid #f0f0f0',
            paddingBottom: 8
          }}>
            业务信息
          </div>
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="非合理原因">{currentRecord.unreasonableReason || '-'}</Descriptions.Item>
            <Descriptions.Item label="非合理原因备注">{currentRecord.unreasonableReasonRemark || '-'}</Descriptions.Item>
            <Descriptions.Item label="调整原因">{currentRecord.adjustmentReason || '-'}</Descriptions.Item>
            <Descriptions.Item label="制单人">{currentRecord.operator || '-'}</Descriptions.Item>
            <Descriptions.Item label="到站所属单位">{currentRecord.belongingUnit}</Descriptions.Item>
            <Descriptions.Item label="单据类型">{currentRecord.documentType}</Descriptions.Item>
            <Descriptions.Item label="单据来源">{currentRecord.documentSource}</Descriptions.Item>
            <Descriptions.Item label="ERP传输人">{currentRecord.erpTransmitter || '-'}</Descriptions.Item>
            <Descriptions.Item label="预估运费">{currentRecord.estimatedFreight || '-'}</Descriptions.Item>
            <Descriptions.Item label="合理运费">{currentRecord.reasonableFreight || '-'}</Descriptions.Item>
            <Descriptions.Item label="运费增量">{currentRecord.freightIncrement || '-'}</Descriptions.Item>
            <Descriptions.Item label="需求单号">{currentRecord.demandNo || '-'}</Descriptions.Item>
            <Descriptions.Item label="订单号" span={2}>{currentRecord.orderNo || '-'}</Descriptions.Item>
            <Descriptions.Item label="交货单号" span={2}>{currentRecord.deliveryNo || '-'}</Descriptions.Item>
            <Descriptions.Item label="备注" span={2}>{currentRecord.remark || '-'}</Descriptions.Item>
            <Descriptions.Item label="数据导入时间" span={2}>{currentRecord.importTime || '-'}</Descriptions.Item>
          </Descriptions>
        </div>
      )}
    </Modal>
  );

  return (
    <div className="oil-warehouse-delivery-container">
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          size="large"
          tabBarStyle={{ marginBottom: '16px' }}
          items={[
            {
              key: 'sinopec',
              label: '中石化出库单',
              children: renderSinopecTab(),
            },
          ]}
        />
      </Card>
      {renderViewModal()}
    </div>
  );
};

export default OilWarehouseDelivery; 