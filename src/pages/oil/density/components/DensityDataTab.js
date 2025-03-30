import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Form, 
  Input, 
  Button, 
  Select, 
  DatePicker, 
  Space, 
  Tag, 
  message,
  Divider,
  Modal,
  InputNumber,
  Row,
  Col
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  PlusOutlined, 
  EditOutlined
} from '@ant-design/icons';
import OrgTreeSelect from './OrgTreeSelect';
import { fetchDensityData, submitDensityAdjustment } from '../services/api';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

/**
 * 油品密度数据标签页组件
 */
const DensityDataTab = () => {
  // 状态定义
  const [densityList, setDensityList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchForm] = Form.useForm();
  const [adjustForm] = Form.useForm();
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [adjustModalVisible, setAdjustModalVisible] = useState(false);
  const [applyModalVisible, setApplyModalVisible] = useState(false);

  // 初始加载数据
  useEffect(() => {
    loadDensityData();
  }, []);

  // 加载密度数据
  const loadDensityData = async () => {
    setLoading(true);
    try {
      const data = await fetchDensityData();
      setDensityList(data);
      setFilteredList(data);
    } catch (error) {
      message.error('获取油品密度数据失败');
      console.error('获取油品密度数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 处理查询
  const handleSearch = (values) => {
    setLoading(true);
    
    // 构建查询参数
    const params = {
      stationIds: values.stationIds,
      oilType: values.oilType,
      tankNo: values.tankNo,
      deliveryOrderNo: values.deliveryOrderNo,
      status: values.status,
      dateRange: values.dateRange
    };
    
    // 调用API查询
    fetchDensityData(params)
      .then(data => {
        setFilteredList(data);
        message.success(`查询成功，共找到 ${data.length} 条记录`);
      })
      .catch(error => {
        message.error('查询失败');
        console.error('查询失败:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 重置查询表单
  const handleReset = () => {
    searchForm.resetFields();
    setFilteredList(densityList);
  };

  // 显示密度调整弹窗
  const showAdjustModal = (record) => {
    setSelectedRecord(record);
    adjustForm.setFieldsValue({
      stationName: record.stationName,
      tankNo: record.tankNo,
      oilType: record.oilType,
      originalDensity: record.density,
      adjustedDensity: record.density,
      v20Density: record.v20Density || record.density,
      temperature: record.temperature,
      deliveryOrderNo: record.deliveryOrderNo,
      reason: '',
      updateType: '手工修改'
    });
    setAdjustModalVisible(true);
  };

  // 显示密度调整申请弹窗
  const showApplyModal = () => {
    adjustForm.setFieldsValue({
      stationName: '',
      tankNo: '',
      oilType: '',
      originalDensity: null,
      adjustedDensity: null,
      v20Density: null,
      temperature: null,
      deliveryOrderNo: '',
      reason: '',
      updateType: '手工修改'
    });
    setApplyModalVisible(true);
  };

  // 关闭密度调整弹窗
  const handleAdjustCancel = () => {
    setAdjustModalVisible(false);
    setSelectedRecord(null);
    adjustForm.resetFields();
  };

  // 关闭密度调整申请弹窗
  const handleApplyCancel = () => {
    setApplyModalVisible(false);
    adjustForm.resetFields();
  };

  // 提交密度调整申请
  const handleAdjustSubmit = () => {
    adjustForm.validateFields()
      .then(values => {
        setLoading(true);
        
        // 构建申请数据
        const data = {
          densityId: selectedRecord ? selectedRecord.id : null,
          stationId: selectedRecord ? selectedRecord.stationId : values.stationId,
          stationName: selectedRecord ? selectedRecord.stationName : values.stationName,
          tankId: selectedRecord ? selectedRecord.tankId : values.tankId,
          tankNo: selectedRecord ? selectedRecord.tankNo : values.tankNo,
          oilType: selectedRecord ? selectedRecord.oilType : values.oilType,
          originalDensity: selectedRecord ? selectedRecord.density : values.originalDensity,
          adjustedDensity: values.adjustedDensity,
          v20Density: values.v20Density,
          temperature: values.temperature,
          reason: values.reason,
          deliveryOrderNo: selectedRecord ? selectedRecord.deliveryOrderNo : values.deliveryOrderNo,
          updateType: values.updateType,
          applicant: '当前用户', // 实际应用中应该从登录用户信息获取
        };
        
        // 提交申请
        submitDensityAdjustment(data)
          .then(result => {
            if (result.success) {
              message.success('密度调整申请提交成功');
              setAdjustModalVisible(false);
              setApplyModalVisible(false);
              setSelectedRecord(null);
              adjustForm.resetFields();
              loadDensityData(); // 重新加载数据
            } else {
              message.error('密度调整申请提交失败');
            }
          })
          .catch(error => {
            message.error('密度调整申请提交失败');
            console.error('密度调整申请提交失败:', error);
          })
          .finally(() => {
            setLoading(false);
          });
      })
      .catch(error => {
        console.error('表单验证失败:', error);
      });
  };

  // 表格列定义
  const columns = [
    {
      title: '油站',
      dataIndex: 'stationName',
      key: 'stationName',
      width: 180,
    },
    {
      title: '油品',
      dataIndex: 'oilType',
      key: 'oilType',
      width: 100,
    },
    {
      title: '油罐编号',
      dataIndex: 'tankNo',
      key: 'tankNo',
      width: 100,
    },
    {
      title: '卸油单号',
      dataIndex: 'deliveryOrderNo',
      key: 'deliveryOrderNo',
      width: 150,
    },
    {
      title: '密度(kg/L)',
      dataIndex: 'density',
      key: 'density',
      width: 100,
      render: (text, record) => `${text} (${record.temperature}℃)`,
    },
    {
      title: 'V20密度',
      dataIndex: 'v20Density',
      key: 'v20Density',
      width: 100,
      render: (text) => text || '-',
    },
    {
      title: '更新方式',
      dataIndex: 'updateType',
      key: 'updateType',
      width: 100,
      render: (text) => text || '自动更新',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (text) => {
        let color = 'green';
        if (text === '异常') {
          color = 'red';
        } else if (text === '待确认') {
          color = 'orange';
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 150,
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
      width: 100,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => showAdjustModal(record)}
          >
            调整
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="density-data-tab">
      {/* 查询表单 */}
      <Form
        form={searchForm}
        name="density_search"
        layout="inline"
        onFinish={handleSearch}
        className="density-form density-form-inline"
      >
        <Row gutter={[16, 16]} style={{ width: '100%' }}>
          <Col span={8}>
            <Form.Item
              name="stationIds"
              label="组织油站"
              style={{ width: '100%' }}
            >
              <OrgTreeSelect placeholder="请选择组织或油站" />
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              name="oilType"
              label="油品类型"
              style={{ width: '100%' }}
            >
              <Select placeholder="请选择油品类型" allowClear>
                <Option value="92#汽油">92#汽油</Option>
                <Option value="95#汽油">95#汽油</Option>
                <Option value="98#汽油">98#汽油</Option>
                <Option value="0#柴油">0#柴油</Option>
              </Select>
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              name="tankNo"
              label="油罐编号"
              style={{ width: '100%' }}
            >
              <Input placeholder="请输入油罐编号" allowClear />
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              name="deliveryOrderNo"
              label="卸油单号"
              style={{ width: '100%' }}
            >
              <Input placeholder="请输入卸油单号" allowClear />
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              name="status"
              label="状态"
              style={{ width: '100%' }}
            >
              <Select placeholder="请选择状态" allowClear>
                <Option value="正常">正常</Option>
                <Option value="异常">异常</Option>
                <Option value="待确认">待确认</Option>
              </Select>
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              name="dateRange"
              label="时间范围"
              style={{ width: '100%' }}
            >
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          
          <Col span={24} style={{ textAlign: 'right' }}>
            <Form.Item>
              <Space>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  icon={<SearchOutlined />}
                >
                  查询
                </Button>
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={handleReset}
                >
                  重置
                </Button>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={showApplyModal}
                >
                  密度调整申请
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      
      <Divider style={{ margin: '16px 0' }} />
      
      {/* 数据表格 */}
      <Table
        columns={columns}
        dataSource={filteredList}
        rowKey="id"
        loading={loading}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
          defaultPageSize: 10,
          pageSizeOptions: ['10', '20', '50'],
        }}
        scroll={{ x: 'max-content' }}
        className="density-table"
      />
      
      {/* 密度调整弹窗 */}
      <Modal
        title="油品密度调整"
        open={adjustModalVisible}
        onCancel={handleAdjustCancel}
        onOk={handleAdjustSubmit}
        confirmLoading={loading}
        width={600}
      >
        <Form
          form={adjustForm}
          layout="vertical"
          className="density-form"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="stationName"
                label="油站"
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="tankNo"
                label="油罐编号"
              >
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="oilType"
                label="油品类型"
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="deliveryOrderNo"
                label="卸油单号"
              >
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="originalDensity"
                label="原密度(kg/L)"
              >
                <InputNumber style={{ width: '100%' }} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="adjustedDensity"
                label="调整后密度(kg/L)"
                rules={[
                  { required: true, message: '请输入调整后密度' },
                  { 
                    type: 'number', 
                    min: 0.7, 
                    max: 0.9, 
                    message: '密度值应在0.7-0.9之间' 
                  }
                ]}
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  step={0.001} 
                  precision={3} 
                  placeholder="请输入密度值"
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="temperature"
                label="温度(℃)"
                rules={[
                  { required: true, message: '请输入温度' },
                  { 
                    type: 'number', 
                    min: -10, 
                    max: 50, 
                    message: '温度值应在-10-50之间' 
                  }
                ]}
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  step={1} 
                  precision={0} 
                  placeholder="请输入温度"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="v20Density"
                label="V20密度(kg/L)"
                rules={[
                  { required: true, message: '请输入V20密度' },
                  { 
                    type: 'number', 
                    min: 0.7, 
                    max: 0.9, 
                    message: 'V20密度值应在0.7-0.9之间' 
                  }
                ]}
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  step={0.001} 
                  precision={3} 
                  placeholder="请输入V20密度值"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="updateType"
                label="更新方式"
                rules={[{ required: true, message: '请选择更新方式' }]}
              >
                <Select placeholder="请选择更新方式">
                  <Option value="手工修改">手工修改</Option>
                  <Option value="自动更新">自动更新</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}></Col>
          </Row>
          
          <Form.Item
            name="reason"
            label="调整原因"
            rules={[{ required: true, message: '请输入调整原因' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="请输入密度调整原因"
              maxLength={200}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 密度调整申请弹窗 */}
      <Modal
        title="油品密度调整申请"
        open={applyModalVisible}
        onCancel={handleApplyCancel}
        onOk={handleAdjustSubmit}
        confirmLoading={loading}
        width={600}
      >
        <Form
          form={adjustForm}
          layout="vertical"
          className="density-form"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="stationName"
                label="油站"
                rules={[{ required: true, message: '请选择油站' }]}
              >
                <OrgTreeSelect placeholder="请选择油站" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="tankNo"
                label="油罐编号"
                rules={[{ required: true, message: '请输入油罐编号' }]}
              >
                <Input placeholder="请输入油罐编号" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="oilType"
                label="油品类型"
                rules={[{ required: true, message: '请选择油品类型' }]}
              >
                <Select placeholder="请选择油品类型">
                  <Option value="92#汽油">92#汽油</Option>
                  <Option value="95#汽油">95#汽油</Option>
                  <Option value="98#汽油">98#汽油</Option>
                  <Option value="0#柴油">0#柴油</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="deliveryOrderNo"
                label="卸油单号"
                rules={[{ required: true, message: '请输入卸油单号' }]}
              >
                <Input placeholder="请输入卸油单号" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="originalDensity"
                label="原密度(kg/L)"
                rules={[
                  { required: true, message: '请输入原密度' },
                  { 
                    type: 'number', 
                    min: 0.7, 
                    max: 0.9, 
                    message: '密度值应在0.7-0.9之间' 
                  }
                ]}
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  step={0.001} 
                  precision={3} 
                  placeholder="请输入原密度值"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="adjustedDensity"
                label="调整后密度(kg/L)"
                rules={[
                  { required: true, message: '请输入调整后密度' },
                  { 
                    type: 'number', 
                    min: 0.7, 
                    max: 0.9, 
                    message: '密度值应在0.7-0.9之间' 
                  }
                ]}
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  step={0.001} 
                  precision={3} 
                  placeholder="请输入密度值"
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="temperature"
                label="温度(℃)"
                rules={[
                  { required: true, message: '请输入温度' },
                  { 
                    type: 'number', 
                    min: -10, 
                    max: 50, 
                    message: '温度值应在-10-50之间' 
                  }
                ]}
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  step={1} 
                  precision={0} 
                  placeholder="请输入温度"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="v20Density"
                label="V20密度(kg/L)"
                rules={[
                  { required: true, message: '请输入V20密度' },
                  { 
                    type: 'number', 
                    min: 0.7, 
                    max: 0.9, 
                    message: 'V20密度值应在0.7-0.9之间' 
                  }
                ]}
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  step={0.001} 
                  precision={3} 
                  placeholder="请输入V20密度值"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="updateType"
                label="更新方式"
                rules={[{ required: true, message: '请选择更新方式' }]}
              >
                <Select placeholder="请选择更新方式">
                  <Option value="手工修改">手工修改</Option>
                  <Option value="自动更新">自动更新</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}></Col>
          </Row>
          
          <Form.Item
            name="reason"
            label="调整原因"
            rules={[{ required: true, message: '请输入调整原因' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="请输入密度调整原因"
              maxLength={200}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DensityDataTab; 