import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Row, 
  Col, 
  Select, 
  Button, 
  Table, 
  Space, 
  Modal, 
  message,
  Input,
  InputNumber,
  DatePicker,
  TreeSelect
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  PlusOutlined, 
  ExportOutlined,
  QuestionCircleOutlined,
  EyeOutlined,
  EditOutlined
} from '@ant-design/icons';

const { Option } = Select;

// 构建树状数据
const buildStationTree = () => {
  const treeData = [];
  
  stationData.branches.forEach(branch => {
    const branchNode = {
      title: branch.name,
      value: branch.id,
      key: branch.id,
      children: []
    };
    
    // 找到该分公司下的服务区
    const serviceAreas = stationData.serviceAreas.filter(sa => sa.branchId === branch.id);
    
    serviceAreas.forEach(serviceArea => {
      const serviceAreaNode = {
        title: serviceArea.name,
        value: serviceArea.id,
        key: serviceArea.id,
        children: []
      };
      
      // 找到该服务区下的油站
      const stations = stationData.stations.filter(station => station.serviceAreaId === serviceArea.id);
      
      stations.forEach(station => {
        serviceAreaNode.children.push({
          title: station.name,
          value: station.id,
          key: station.id,
          isLeaf: true
        });
      });
      
      if (serviceAreaNode.children.length > 0) {
        branchNode.children.push(serviceAreaNode);
      }
    });
    
    if (branchNode.children.length > 0) {
      treeData.push(branchNode);
    }
  });
  
  return treeData;
};

// 临时内联数据 - 树状结构
const stationData = {
  branches: [
    { id: "BR001", name: "赣中分公司", code: "01" },
    { id: "BR002", name: "赣东北分公司", code: "02" },
    { id: "BR003", name: "赣南分公司", code: "03" },
    { id: "BR004", name: "赣北分公司", code: "04" },
    { id: "BR005", name: "赣东分公司", code: "05" }
  ],
  serviceAreas: [
    { id: "SA001", name: "南昌服务区", branchId: "BR001", code: "01" },
    { id: "SA002", name: "进贤服务区", branchId: "BR001", code: "02" },
    { id: "SA003", name: "上饶服务区", branchId: "BR002", code: "01" },
    { id: "SA004", name: "铅山服务区", branchId: "BR002", code: "02" },
    { id: "SA005", name: "赣州服务区", branchId: "BR003", code: "01" },
    { id: "SA006", name: "瑞金服务区", branchId: "BR003", code: "02" },
    { id: "SA007", name: "九江服务区", branchId: "BR004", code: "01" },
    { id: "SA008", name: "湖口服务区", branchId: "BR004", code: "02" },
    { id: "SA009", name: "鹰潭服务区", branchId: "BR005", code: "01" },
    { id: "SA010", name: "贵溪服务区", branchId: "BR005", code: "02" }
  ],
  stations: [
    { id: "ST001", name: "南昌高速服务区加油站", serviceAreaId: "SA001" },
    { id: "ST002", name: "上饶高速服务区加油站", serviceAreaId: "SA003" },
    { id: "ST003", name: "赣州高速服务区加油站", serviceAreaId: "SA005" },
    { id: "ST004", name: "九江高速服务区加油站", serviceAreaId: "SA007" },
    { id: "ST005", name: "鹰潭高速服务区加油站", serviceAreaId: "SA009" }
  ]
};

const waterElectricityData = {
  handoverRecords: [
    {
      "id": "HE001",
      "recordNumber": "SDJ2024070001",
      "stationId": "ST001",
      "stationName": "南昌高速服务区加油站",
      "shift": "早班",
      "waterMeter1": {
        "startReading": 1250.5,
        "endReading": 1280.3,
        "consumption": 29.8
      },
      "waterMeter2": {
        "startReading": 890.2,
        "endReading": 920.1,
        "consumption": 29.9
      },
      "totalWaterConsumption": 59.7,
      "electricMeter1": {
        "startReading": 4560.8,
        "endReading": 4620.5,
        "consumption": 59.7
      },
      "electricMeter2": {
        "startReading": 3200.3,
        "endReading": 3250.9,
        "consumption": 50.6
      },
      "totalElectricConsumption": 110.3,
      "handoverPerson": "张师傅",
      "takeoverPerson": "李师傅",
      "creator": "王班长",
      "remark": "早班交接正常，设备运行良好",
      "createTime": "2024-07-15T08:00:00Z"
    },
    {
      "id": "HE002",
      "recordNumber": "SDJ2024070002",
      "stationId": "ST001",
      "stationName": "南昌高速服务区加油站",
      "shift": "中班",
      "waterMeter1": {
        "startReading": 1280.3,
        "endReading": 1310.8,
        "consumption": 30.5
      },
      "waterMeter2": {
        "startReading": 920.1,
        "endReading": 950.6,
        "consumption": 30.5
      },
      "totalWaterConsumption": 61.0,
      "electricMeter1": {
        "startReading": 4620.5,
        "endReading": 4680.2,
        "consumption": 59.7
      },
      "electricMeter2": {
        "startReading": 3250.9,
        "endReading": 3300.4,
        "consumption": 49.5
      },
      "totalElectricConsumption": 109.2,
      "handoverPerson": "李师傅",
      "takeoverPerson": "王师傅",
      "creator": "王班长",
      "remark": "中班用水量略有增加",
      "createTime": "2024-07-15T16:00:00Z"
    }
  ]
};

const HandoverRecords = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [guideModalVisible, setGuideModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setData(waterElectricityData.handoverRecords);
      setFilteredData(waterElectricityData.handoverRecords);
      setLoading(false);
    }, 500);
  };

  const handleSearch = (values) => {
    let filtered = [...data];
    
    if (values.stationId) {
      filtered = filtered.filter(item => item.stationId === values.stationId);
    }
    
    setFilteredData(filtered);
  };

  const handleReset = () => {
    form.resetFields();
    setFilteredData(data);
  };

  const showGuideModal = () => {
    setGuideModalVisible(true);
  };

  const handleExport = () => {
    if (filteredData.length === 0) {
      message.warning('没有数据可导出');
      return;
    }

    const headers = [
      '记录单编号', '所属油站', '班次', 
      '水表1接班数', '水表1交班数', '水表1走字数',
      '水表2接班数', '水表2交班数', '水表2走字数',
      '本班水表总度数', '电表1接班数', '电表1交班数', '电表1走字数',
      '电表2接班数', '电表2交班数', '电表2走字数',
      '本班电表总度数', '交班人', '接班人', '创建人', '备注', '创建时间'
    ];

    const csvContent = [
      headers.join(','),
      ...filteredData.map(record => [
        record.recordNumber,
        record.stationName,
        record.shift,
        record.waterMeter1.startReading,
        record.waterMeter1.endReading,
        record.waterMeter1.consumption,
        record.waterMeter2.startReading,
        record.waterMeter2.endReading,
        record.waterMeter2.consumption,
        record.totalWaterConsumption,
        record.electricMeter1.startReading,
        record.electricMeter1.endReading,
        record.electricMeter1.consumption,
        record.electricMeter2.startReading,
        record.electricMeter2.endReading,
        record.electricMeter2.consumption,
        record.totalElectricConsumption,
        record.handoverPerson,
        record.takeoverPerson,
        record.creator,
        record.remark,
        new Date(record.createTime).toLocaleString()
      ].join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `水电表交接明细_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openRecordForm = (record = null) => {
    setEditingRecord(record);
    setIsEdit(!!record);
    setModalVisible(true);
  };

  const handleFormSubmit = (values) => {
    if (isEdit) {
      // 更新记录
      const updatedData = data.map(item => 
        item.id === editingRecord.id ? { 
          ...item, 
          ...values,
          stationName: stationData.stations.find(s => s.id === values.stationId)?.name || item.stationName
        } : item
      );
      setData(updatedData);
      setFilteredData(updatedData);
      message.success('记录更新成功');
    } else {
      // 新增记录
      const selectedStation = stationData.stations.find(s => s.id === values.stationId);
      const newRecord = {
        id: `HE${String(data.length + 1).padStart(3, '0')}`,
        recordNumber: `SDJ${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(data.length + 1).padStart(4, '0')}`,
        ...values,
        stationName: selectedStation?.name || '',
        createTime: new Date().toISOString()
      };
      const newData = [...data, newRecord];
      setData(newData);
      setFilteredData(newData);
      message.success('记录创建成功');
    }
    setModalVisible(false);
    setEditingRecord(null);
    setIsEdit(false);
  };

  const columns = [
    {
      title: '记录单编号',
      dataIndex: 'recordNumber',
      key: 'recordNumber',
      width: 150,
    },
    {
      title: '所属油站',
      dataIndex: 'stationName',
      key: 'stationName',
      width: 200,
    },
    {
      title: '班次',
      dataIndex: 'shift',
      key: 'shift',
      width: 100,
    },
    {
      title: '水表1',
      children: [
        {
          title: '接班数',
          dataIndex: ['waterMeter1', 'startReading'],
          key: 'waterMeter1Start',
          width: 100,
        },
        {
          title: '交班数',
          dataIndex: ['waterMeter1', 'endReading'],
          key: 'waterMeter1End',
          width: 100,
        },
        {
          title: '走字数',
          dataIndex: ['waterMeter1', 'consumption'],
          key: 'waterMeter1Consumption',
          width: 100,
        }
      ]
    },
    {
      title: '水表2',
      children: [
        {
          title: '接班数',
          dataIndex: ['waterMeter2', 'startReading'],
          key: 'waterMeter2Start',
          width: 100,
        },
        {
          title: '交班数',
          dataIndex: ['waterMeter2', 'endReading'],
          key: 'waterMeter2End',
          width: 100,
        },
        {
          title: '走字数',
          dataIndex: ['waterMeter2', 'consumption'],
          key: 'waterMeter2Consumption',
          width: 100,
        }
      ]
    },
    {
      title: '本班水表总度数',
      dataIndex: 'totalWaterConsumption',
      key: 'totalWaterConsumption',
      width: 120,
    },
    {
      title: '电表1',
      children: [
        {
          title: '接班数',
          dataIndex: ['electricMeter1', 'startReading'],
          key: 'electricMeter1Start',
          width: 100,
        },
        {
          title: '交班数',
          dataIndex: ['electricMeter1', 'endReading'],
          key: 'electricMeter1End',
          width: 100,
        },
        {
          title: '走字数',
          dataIndex: ['electricMeter1', 'consumption'],
          key: 'electricMeter1Consumption',
          width: 100,
        }
      ]
    },
    {
      title: '电表2',
      children: [
        {
          title: '接班数',
          dataIndex: ['electricMeter2', 'startReading'],
          key: 'electricMeter2Start',
          width: 100,
        },
        {
          title: '交班数',
          dataIndex: ['electricMeter2', 'endReading'],
          key: 'electricMeter2End',
          width: 100,
        },
        {
          title: '走字数',
          dataIndex: ['electricMeter2', 'consumption'],
          key: 'electricMeter2Consumption',
          width: 100,
        }
      ]
    },
    {
      title: '本班电表总度数',
      dataIndex: 'totalElectricConsumption',
      key: 'totalElectricConsumption',
      width: 120,
    },
    {
      title: '交班人',
      dataIndex: 'handoverPerson',
      key: 'handoverPerson',
      width: 100,
    },
    {
      title: '接班人',
      dataIndex: 'takeoverPerson',
      key: 'takeoverPerson',
      width: 100,
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
      width: 100,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 150,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => openRecordForm(record)}
          >
            查看
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openRecordForm(record)}
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* 筛选区域 */}
      <div style={{ background: 'white', padding: '16px', marginBottom: '16px' }}>
        <Form
          form={form}
          layout="inline"
          onFinish={handleSearch}
          style={{ marginBottom: '16px' }}
        >
          <Row gutter={16} style={{ width: '100%' }}>
            <Col span={6}>
              <Form.Item name="stationId" label="所属油站">
                <TreeSelect
                  placeholder="请选择油站"
                  style={{ width: '100%' }}
                  treeData={buildStationTree()}
                  treeDefaultExpandAll
                  allowClear
                  showSearch
                  treeNodeFilterProp="title"
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item style={{ width: '100%', textAlign: 'right' }}>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                查询
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => openRecordForm()}>
                新建
              </Button>
              <Button type="primary" icon={<ExportOutlined />} onClick={handleExport}>
                导出
              </Button>
              <Button icon={<QuestionCircleOutlined />} onClick={showGuideModal}>
                填写指引
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>

      {/* 表格区域 */}
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        loading={loading}
        scroll={{ x: 'max-content' }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
      />

      {/* 填写指引弹窗 */}
      <Modal
        title="填写指引"
        open={guideModalVisible}
        onCancel={() => setGuideModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setGuideModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={600}
      >
        <div style={{ lineHeight: '1.8' }}>
          <p><strong>1.</strong> 本记录反应加油站水申表班次交接情况，作为核算每班次水电使用情况的依据，由交班人员填写，接班人员签字确认，在加油站保存。</p>
          <p><strong>2.</strong> 走字一交班字码一接班字码。</p>
          <p><strong>3.</strong> 本班总度数:为多个表走字数之和。</p>
          <p><strong>4.</strong> 主管部门可以根据加油站水电表数量增减表格列数，以达到管理需求。</p>
        </div>
      </Modal>

      {/* 记录表单弹窗 */}
      <Modal
        title={isEdit ? '编辑记录' : '新建记录'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingRecord(null);
          setIsEdit(false);
        }}
        footer={null}
        width={800}
      >
        <HandoverRecordForm
          record={editingRecord}
          isEdit={isEdit}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setModalVisible(false);
            setEditingRecord(null);
            setIsEdit(false);
          }}
        />
      </Modal>
    </div>
  );
};

// 记录表单组件
const HandoverRecordForm = ({ record, isEdit, onSubmit, onCancel }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
  }, [record, form]);

  const handleSubmit = (values) => {
    // 自动计算走字数
    const calculatedValues = {
      ...values,
      waterMeter1: {
        ...values.waterMeter1,
        consumption: values.waterMeter1?.endReading && values.waterMeter1?.startReading 
          ? values.waterMeter1.endReading - values.waterMeter1.startReading 
          : values.waterMeter1?.consumption || 0
      },
      waterMeter2: {
        ...values.waterMeter2,
        consumption: values.waterMeter2?.endReading && values.waterMeter2?.startReading 
          ? values.waterMeter2.endReading - values.waterMeter2.startReading 
          : values.waterMeter2?.consumption || 0
      },
      electricMeter1: {
        ...values.electricMeter1,
        consumption: values.electricMeter1?.endReading && values.electricMeter1?.startReading 
          ? values.electricMeter1.endReading - values.electricMeter1.startReading 
          : values.electricMeter1?.consumption || 0
      },
      electricMeter2: {
        ...values.electricMeter2,
        consumption: values.electricMeter2?.endReading && values.electricMeter2?.startReading 
          ? values.electricMeter2.endReading - values.electricMeter2.startReading 
          : values.electricMeter2?.consumption || 0
      },
      totalWaterConsumption: 
        ((values.waterMeter1?.endReading && values.waterMeter1?.startReading 
          ? values.waterMeter1.endReading - values.waterMeter1.startReading 
          : values.waterMeter1?.consumption || 0) +
        (values.waterMeter2?.endReading && values.waterMeter2?.startReading 
          ? values.waterMeter2.endReading - values.waterMeter2.startReading 
          : values.waterMeter2?.consumption || 0)),
      totalElectricConsumption: 
        ((values.electricMeter1?.endReading && values.electricMeter1?.startReading 
          ? values.electricMeter1.endReading - values.electricMeter1.startReading 
          : values.electricMeter1?.consumption || 0) +
        (values.electricMeter2?.endReading && values.electricMeter2?.startReading 
          ? values.electricMeter2.endReading - values.electricMeter2.startReading 
          : values.electricMeter2?.consumption || 0))
    };
    onSubmit(calculatedValues);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
    >
      <Row gutter={16}>
                 <Col span={12}>
           <Form.Item name="stationId" label="所属油站" rules={[{ required: true }]}>
             <TreeSelect
               placeholder="请选择油站"
               style={{ width: '100%' }}
               treeData={buildStationTree()}
               treeDefaultExpandAll
               allowClear
               showSearch
               treeNodeFilterProp="title"
             />
           </Form.Item>
         </Col>
        <Col span={12}>
          <Form.Item name="shift" label="班次" rules={[{ required: true }]}>
            <Select placeholder="请选择班次">
              <Option value="早班">早班</Option>
              <Option value="中班">中班</Option>
              <Option value="晚班">晚班</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name={['waterMeter1', 'startReading']} label="水表1接班数" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} placeholder="请输入接班数" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name={['waterMeter1', 'endReading']} label="水表1交班数" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} placeholder="请输入交班数" />
          </Form.Item>
        </Col>
                 <Col span={8}>
           <Form.Item name={['waterMeter1', 'consumption']} label="水表1走字数">
             <InputNumber style={{ width: '100%' }} placeholder="自动计算" disabled />
           </Form.Item>
         </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name={['waterMeter2', 'startReading']} label="水表2接班数" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} placeholder="请输入接班数" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name={['waterMeter2', 'endReading']} label="水表2交班数" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} placeholder="请输入交班数" />
          </Form.Item>
        </Col>
                 <Col span={8}>
           <Form.Item name={['waterMeter2', 'consumption']} label="水表2走字数">
             <InputNumber style={{ width: '100%' }} placeholder="自动计算" disabled />
           </Form.Item>
         </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name={['electricMeter1', 'startReading']} label="电表1接班数" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} placeholder="请输入接班数" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name={['electricMeter1', 'endReading']} label="电表1交班数" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} placeholder="请输入交班数" />
          </Form.Item>
        </Col>
                 <Col span={8}>
           <Form.Item name={['electricMeter1', 'consumption']} label="电表1走字数">
             <InputNumber style={{ width: '100%' }} placeholder="自动计算" disabled />
           </Form.Item>
         </Col>
      </Row>

             <Row gutter={16}>
         <Col span={8}>
           <Form.Item name={['electricMeter2', 'startReading']} label="电表2接班数" rules={[{ required: true }]}>
             <InputNumber style={{ width: '100%' }} placeholder="请输入接班数" />
           </Form.Item>
         </Col>
         <Col span={8}>
           <Form.Item name={['electricMeter2', 'endReading']} label="电表2交班数" rules={[{ required: true }]}>
             <InputNumber style={{ width: '100%' }} placeholder="请输入交班数" />
           </Form.Item>
         </Col>
         <Col span={8}>
           <Form.Item name={['electricMeter2', 'consumption']} label="电表2走字数">
             <InputNumber style={{ width: '100%' }} placeholder="自动计算" disabled />
           </Form.Item>
         </Col>
       </Row>

       <Row gutter={16}>
         <Col span={12}>
           <Form.Item name="totalWaterConsumption" label="本班水表总度数">
             <InputNumber style={{ width: '100%' }} placeholder="自动计算" disabled />
           </Form.Item>
         </Col>
         <Col span={12}>
           <Form.Item name="totalElectricConsumption" label="本班电表总度数">
             <InputNumber style={{ width: '100%' }} placeholder="自动计算" disabled />
           </Form.Item>
         </Col>
       </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="handoverPerson" label="交班人" rules={[{ required: true }]}>
            <Input placeholder="请输入交班人" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="takeoverPerson" label="接班人" rules={[{ required: true }]}>
            <Input placeholder="请输入接班人" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="creator" label="创建人" rules={[{ required: true }]}>
            <Input placeholder="请输入创建人" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="remark" label="备注">
        <Input.TextArea rows={3} placeholder="请输入备注信息" />
      </Form.Item>

      <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
        <Space>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" htmlType="submit">
            {isEdit ? '更新' : '创建'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default HandoverRecords; 