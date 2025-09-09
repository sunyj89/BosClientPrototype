import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Space,
  Row,
  Col,
  DatePicker,
  InputNumber,
  Radio,
  Divider,
  Card,
  TreeSelect,
  message,
  Switch,
  Descriptions,
  Tag
} from 'antd';
import {
  SaveOutlined,
  CloseOutlined
} from '@ant-design/icons';
import moment from 'moment';
import stationData from '../../../../mock/station/stationData.json';
import oilTransferData from '../../../../mock/purchase/oil-procurement/oilTransferData.json';

const { Option } = Select;
const { TextArea } = Input;

const OilTransferForm = ({ mode, initialValues, onSubmit, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [transferType, setTransferType] = useState('出库');
  const [tankDataAuto, setTankDataAuto] = useState(true);

  // 初始化表单数据
  useEffect(() => {
    if (initialValues) {
      const formData = {
        ...initialValues,
        plannedOutboundTime: initialValues.plannedOutboundTime ? moment(initialValues.plannedOutboundTime) : null,
        actualOutboundTime: initialValues.actualOutboundTime ? moment(initialValues.actualOutboundTime) : null
      };
      form.setFieldsValue(formData);
      if (initialValues.transferType) {
        setTransferType(initialValues.transferType);
      }
    } else {
      // 新建时生成单据编号
      const transferNumber = `TR${moment().format('YYYYMMDD')}${String(Date.now()).slice(-4)}`;
      form.setFieldsValue({
        transferNumber,
        transferType: '出库',
        status: '草稿',
        plannedOutboundTime: moment().add(2, 'hours')
      });
    }
  }, [initialValues, form]);

  // 构建油站树形数据
  const buildStationTreeData = () => {
    if (!stationData.branches || !stationData.serviceAreas || !stationData.stations) {
      return [];
    }

    return stationData.branches.map(branch => ({
      title: branch.name,
      value: branch.name,
      key: branch.id,
      children: stationData.serviceAreas
        .filter(serviceArea => serviceArea.branchId === branch.id)
        .map(serviceArea => ({
          title: serviceArea.name,
          value: serviceArea.name,
          key: serviceArea.id,
          children: stationData.stations
            .filter(station => station.serviceAreaId === serviceArea.id)
            .map(station => ({
              title: station.name,
              value: `${branch.name}-${serviceArea.name}-${station.name}`,
              key: station.id
            }))
        }))
    }));
  };

  // 调拨单类型变化
  const handleTransferTypeChange = (value) => {
    setTransferType(value);
  };

  // 自动计算函数
  const calculateDensity = () => {
    const originalWeight = form.getFieldValue('originalWeight');
    const actualVolumeVt = form.getFieldValue('actualVolumeVt');
    if (originalWeight && actualVolumeVt) {
      const density = (originalWeight / actualVolumeVt).toFixed(3);
      form.setFieldsValue({ actualDensity: parseFloat(density) });
    }
  };

  const calculateTransferAmount = () => {
    const actualVolumeVt = form.getFieldValue('actualVolumeVt');
    const transferPrice = form.getFieldValue('transferPrice');
    if (actualVolumeVt && transferPrice) {
      const amount = (actualVolumeVt * transferPrice).toFixed(2);
      form.setFieldsValue({ transferAmount: parseFloat(amount) });
    }
  };

  const calculateOutboundLoss = () => {
    const originalVolumeVt = form.getFieldValue('originalVolumeVt');
    const tankAcceptanceVolumeVt = form.getFieldValue('tankAcceptanceVolumeVt');
    
    if (originalVolumeVt && tankAcceptanceVolumeVt) {
      const lossVt = originalVolumeVt - tankAcceptanceVolumeVt;
      const lossRateVt = ((lossVt / originalVolumeVt) * 1000).toFixed(1);
      form.setFieldsValue({
        outboundLossVt: lossVt.toFixed(1),
        outboundLossRateVt: parseFloat(lossRateVt)
      });
    }

    const originalVolumeV20 = form.getFieldValue('originalVolumeV20');
    const tankAcceptanceVolumeV20 = form.getFieldValue('tankAcceptanceVolumeV20');
    
    if (originalVolumeV20 && tankAcceptanceVolumeV20) {
      const lossV20 = originalVolumeV20 - tankAcceptanceVolumeV20;
      const lossRateV20 = ((lossV20 / originalVolumeV20) * 1000).toFixed(1);
      form.setFieldsValue({
        outboundLossV20: lossV20.toFixed(1),
        outboundLossRateV20: parseFloat(lossRateV20)
      });
    }
  };

  const calculateExcessLossRate = () => {
    const outboundLossRateVt = form.getFieldValue('outboundLossRateVt');
    const allowedErrorRate = 0.3; // 全局固定值0.3%
    
    if (outboundLossRateVt !== undefined) {
      const excessLossRate = Math.max(0, outboundLossRateVt - allowedErrorRate);
      form.setFieldsValue({ excessLossRate: excessLossRate.toFixed(2) });
    }
  };

  // 表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      // 转换日期格式
      const submitData = {
        ...values,
        plannedOutboundTime: values.plannedOutboundTime ? values.plannedOutboundTime.format('YYYY-MM-DD HH:mm:ss') : null,
        // 实际出库时间：如果为空且不是查看模式，则自动填写当前时间
        actualOutboundTime: values.actualOutboundTime 
          ? values.actualOutboundTime.format('YYYY-MM-DD HH:mm:ss') 
          : (mode !== 'view' ? moment().format('YYYY-MM-DD HH:mm:ss') : null)
      };

      await onSubmit(submitData);
    } catch (error) {
      message.error('请检查表单填写是否完整');
    } finally {
      setLoading(false);
    }
  };

  const isReadOnly = mode === 'view';

  // 查看模式的详情展示组件
  const ViewDetails = () => {
    const data = initialValues || {};
    
    // 状态标签颜色
    const getStatusColor = (status) => {
      const colors = {
        '草稿': 'default',
        '已提交': 'blue',
        '待审批': 'orange',
        '已审批': 'green'
      };
      return colors[status] || 'default';
    };

    return (
      <div>
        {/* 单据基本信息 */}
        <Descriptions
          title="单据基本信息"
          column={2}
          bordered
          style={{ marginBottom: 24 }}
        >
          <Descriptions.Item label="调拨单编号">{data.transferNumber}</Descriptions.Item>
          <Descriptions.Item label="调拨单类型">{data.transferType}</Descriptions.Item>
          <Descriptions.Item label="调拨范围">{data.transferScope}</Descriptions.Item>
          <Descriptions.Item label="单据状态">
            <Tag color={getStatusColor(data.status)}>{data.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">{data.createTime}</Descriptions.Item>
          <Descriptions.Item label="操作员">{data.operator}</Descriptions.Item>
        </Descriptions>

        {/* 出库数据信息 */}
        <div style={{ 
          fontSize: 16, 
          fontWeight: 'bold', 
          marginBottom: 16,
          borderBottom: '1px solid #f0f0f0',
          paddingBottom: 8
        }}>
          出库数据信息
        </div>
        <Descriptions
          column={2}
          bordered
          style={{ marginBottom: 24 }}
        >
          <Descriptions.Item label="出库油站名称">{data.outboundStationName}</Descriptions.Item>
          <Descriptions.Item label="计划出库时间">{data.plannedOutboundTime}</Descriptions.Item>
          <Descriptions.Item label="实际出库时间">{data.actualOutboundTime}</Descriptions.Item>
          <Descriptions.Item label="承运商名称">{data.carrierName}</Descriptions.Item>
          <Descriptions.Item label="承运商代码">{data.carrierCode}</Descriptions.Item>
          <Descriptions.Item label="承运车辆车牌">{data.vehicleNumber}</Descriptions.Item>
          <Descriptions.Item label="驾驶员姓名">{data.driverName}</Descriptions.Item>
          <Descriptions.Item label="行程距离">{data.travelDistance ? `${data.travelDistance} KM` : ''}</Descriptions.Item>
          <Descriptions.Item label="油品名称">{data.oilType}</Descriptions.Item>
          <Descriptions.Item label="油罐编号">{data.tankNumber}</Descriptions.Item>
        </Descriptions>

        {/* 油品数据信息 */}
        <div style={{ 
          fontSize: 16, 
          fontWeight: 'bold', 
          marginBottom: 16,
          borderBottom: '1px solid #f0f0f0',
          paddingBottom: 8
        }}>
          油品数据信息
        </div>
        <Descriptions
          column={3}
          bordered
          size="small"
          style={{ marginBottom: 24 }}
        >
          <Descriptions.Item label="原发重量(kg)">{data.originalWeight?.toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="实发温度(℃)">{data.actualTemperature}</Descriptions.Item>
          <Descriptions.Item label="原发体积Vt(L)">{data.originalVolumeVt?.toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="实发体积Vt(L)">{data.actualVolumeVt?.toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="原发体积V20(L)">{data.originalVolumeV20?.toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="实发体积V20(L)">{data.actualVolumeV20?.toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="实发密度(kg/L)">{data.actualDensity}</Descriptions.Item>
          <Descriptions.Item label="调拨单价(元)">{data.transferPrice}</Descriptions.Item>
          <Descriptions.Item label="调拨总金额(元)">{data.transferAmount?.toLocaleString()}</Descriptions.Item>
        </Descriptions>

        {/* 入库站点信息 */}
        <div style={{ 
          fontSize: 16, 
          fontWeight: 'bold', 
          marginBottom: 16,
          borderBottom: '1px solid #f0f0f0',
          paddingBottom: 8
        }}>
          入库站点信息
        </div>
        <Descriptions
          column={2}
          bordered
          style={{ marginBottom: 24 }}
        >
          <Descriptions.Item label="入库油站名称">{data.inboundStationName}</Descriptions.Item>
          <Descriptions.Item label="油站油罐编号">{data.inboundTankNumber}</Descriptions.Item>
          <Descriptions.Item label="入库油站地址" span={2}>{data.inboundStationAddress}</Descriptions.Item>
          <Descriptions.Item label="联系人">{data.inboundContactPerson}</Descriptions.Item>
          <Descriptions.Item label="联系电话">{data.inboundContactPhone}</Descriptions.Item>
        </Descriptions>

        {/* 地罐库存数据 */}
        <div style={{ 
          fontSize: 16, 
          fontWeight: 'bold', 
          marginBottom: 16,
          borderBottom: '1px solid #f0f0f0',
          paddingBottom: 8
        }}>
          地罐库存数据
        </div>
        <Descriptions
          column={3}
          bordered
          size="small"
          style={{ marginBottom: 24 }}
        >
          <Descriptions.Item label="地罐验收量Vt(L)">{data.tankAcceptanceVolumeVt?.toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="地罐验收量V20(L)">{data.tankAcceptanceVolumeV20?.toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="出库后高度(mm)">{data.outboundAfterHeight?.toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="出库后重量(kg)">{data.outboundAfterWeight?.toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="出库后罐温(℃)">{data.outboundAfterTemperature}</Descriptions.Item>
          <Descriptions.Item label="出库损益量Vt(L)">{data.outboundLossVt}</Descriptions.Item>
          <Descriptions.Item label="出库损益率Vt(‰)">{data.outboundLossRateVt}</Descriptions.Item>
          <Descriptions.Item label="出库损益量V20(L)">{data.outboundLossV20}</Descriptions.Item>
          <Descriptions.Item label="出库损益率V20(‰)">{data.outboundLossRateV20}</Descriptions.Item>
          <Descriptions.Item label="出库允许误差率(%)">{data.allowedErrorRate}</Descriptions.Item>
          <Descriptions.Item label="超损率(%)">{data.excessLossRate}</Descriptions.Item>
          <Descriptions.Item label="出库铅封号">{data.outboundSealNumber}</Descriptions.Item>
          <Descriptions.Item label="负责人">{data.responsiblePerson}</Descriptions.Item>
        </Descriptions>

        {/* 备注信息 */}
        {data.remarks && (
          <Descriptions
            column={1}
            bordered
          >
            <Descriptions.Item label="备注信息">{data.remarks}</Descriptions.Item>
          </Descriptions>
        )}
      </div>
    );
  };

  // 如果是查看模式，直接返回详情展示
  if (isReadOnly) {
    return (
      <div>
        <ViewDetails />
        <Row justify="end" style={{ marginTop: 24 }}>
          <Button onClick={onCancel}>关闭</Button>
        </Row>
      </div>
    );
  }

  return (
    <Form
      form={form}
      layout="vertical"
      disabled={isReadOnly}
    >
      {/* 单据基本信息部分 */}
      <Card title="单据基本信息" size="small" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="transferNumber"
              label="调拨单编号"
              rules={[{ required: true, message: '请输入调拨单编号' }]}
            >
              <Input placeholder="系统自动生成" disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="transferType"
              label="调拨单类型"
              rules={[{ required: true, message: '请选择调拨单类型' }]}
            >
              <Radio.Group onChange={(e) => handleTransferTypeChange(e.target.value)}>
                <Radio value="出库">出库</Radio>
                <Radio value="入库" disabled>入库（暂不支持）</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="transferScope"
              label="调拨范围"
              rules={[{ required: true, message: '请选择调拨范围' }]}
            >
              <Select placeholder="请选择调拨范围">
                {oilTransferData.transferScopeList.map(scope => (
                  <Option key={scope.value} value={scope.value}>
                    {scope.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* 出库调拨单内容 */}
      {transferType === '出库' && (
        <>
          {/* 出库数据部分 */}
          <Card title="出库数据部分" size="small" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="outboundStationName"
                  label="出库油站名称"
                  rules={[{ required: true, message: '请选择出库油站' }]}
                >
                  <TreeSelect
                    placeholder="请选择出库油站"
                    treeData={buildStationTreeData()}
                    allowClear
                    showSearch
                    treeDefaultExpandAll={false}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="plannedOutboundTime"
                  label="计划出库时间"
                  rules={[{ required: true, message: '请选择计划出库时间' }]}
                >
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="请选择计划出库时间"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="actualOutboundTime"
                  label="实际出库时间"
                  tooltip="系统自动填写，不可手动编辑"
                >
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="系统自动填写"
                    style={{ width: '100%' }}
                    disabled
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={6}>
                <Form.Item
                  name="carrierName"
                  label="承运商名称"
                  rules={[{ required: true, message: '请选择承运商' }]}
                >
                  <Select placeholder="请选择承运商">
                    {oilTransferData.carrierList.map(carrier => (
                      <Option key={carrier} value={carrier}>
                        {carrier}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="carrierCode"
                  label="承运商代码"
                >
                  <Input placeholder="请输入承运商代码" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="vehicleNumber"
                  label="承运车辆车牌"
                  rules={[{ required: true, message: '请输入车牌号' }]}
                >
                  <Input placeholder="请输入车牌号" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="driverName"
                  label="驾驶员姓名"
                  rules={[{ required: true, message: '请输入驾驶员姓名' }]}
                >
                  <Input placeholder="请输入驾驶员姓名" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="travelDistance"
                  label="行程距离(KM)"
                >
                  <InputNumber placeholder="请输入行程距离" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="oilType"
                  label="油品名称"
                  rules={[{ required: true, message: '请选择油品名称' }]}
                >
                  <Select placeholder="请选择油品名称">
                    <Option value="92#汽油">92#汽油</Option>
                    <Option value="95#汽油">95#汽油</Option>
                    <Option value="98#汽油">98#汽油</Option>
                    <Option value="0#柴油">0#柴油</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="tankNumber"
                  label="油罐编号"
                  rules={[{ required: true, message: '请输入油罐编号' }]}
                >
                  <Input placeholder="请输入油罐编号" />
                </Form.Item>
              </Col>
            </Row>

            <Divider />

            <Row gutter={16}>
              <Col span={6}>
                <Form.Item
                  name="originalWeight"
                  label="原发重量(kg)"
                  rules={[{ required: true, message: '请输入原发重量' }]}
                >
                  <InputNumber
                    placeholder="请输入原发重量"
                    style={{ width: '100%' }}
                    onChange={calculateDensity}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="actualTemperature"
                  label="实发温度t(℃)"
                  rules={[{ required: true, message: '请输入实发温度' }]}
                >
                  <InputNumber placeholder="请输入实发温度" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="originalVolumeVt"
                  label="原发体积Vt(L)"
                  rules={[{ required: true, message: '请输入原发体积Vt' }]}
                >
                  <InputNumber placeholder="请输入原发体积Vt" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="actualVolumeVt"
                  label="实发体积Vt(L)"
                  rules={[{ required: true, message: '请输入实发体积Vt' }]}
                >
                  <InputNumber
                    placeholder="请输入实发体积Vt"
                    style={{ width: '100%' }}
                    onChange={() => {
                      calculateDensity();
                      calculateTransferAmount();
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={6}>
                <Form.Item
                  name="originalVolumeV20"
                  label="原发体积V20(L)"
                  rules={[{ required: true, message: '请输入原发体积V20' }]}
                >
                  <InputNumber placeholder="请输入原发体积V20" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="actualVolumeV20"
                  label="实发体积V20(L)"
                  rules={[{ required: true, message: '请输入实发体积V20' }]}
                >
                  <InputNumber placeholder="请输入实发体积V20" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="actualDensity"
                  label="实发密度(kg/L)"
                >
                  <InputNumber placeholder="自动计算" style={{ width: '100%' }} disabled />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="transferPrice"
                  label="调拨单价(元)"
                  rules={[{ required: true, message: '请输入调拨单价' }]}
                >
                  <InputNumber
                    placeholder="请输入调拨单价"
                    style={{ width: '100%' }}
                    onChange={calculateTransferAmount}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="transferAmount"
                  label="调拨总金额(元)"
                >
                  <InputNumber placeholder="自动计算" style={{ width: '100%' }} disabled />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* 入库站点数据部分 */}
          <Card title="入库站点数据部分" size="small" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="inboundStationName"
                  label="入库油站名称"
                  rules={[{ required: true, message: '请选择入库油站' }]}
                >
                  <TreeSelect
                    placeholder="请选择入库油站"
                    treeData={buildStationTreeData()}
                    allowClear
                    showSearch
                    treeDefaultExpandAll={false}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="inboundTankNumber"
                  label="油站油罐编号"
                  rules={[{ required: true, message: '请输入油站油罐编号' }]}
                >
                  <Input placeholder="请输入油站油罐编号" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="inboundStationAddress"
                  label="入库油站地址"
                  rules={[{ required: true, message: '请输入入库油站地址' }]}
                >
                  <Input placeholder="请输入入库油站地址" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="inboundContactPerson"
                  label="联系人"
                  rules={[{ required: true, message: '请输入联系人姓名' }]}
                >
                  <Input placeholder="请输入联系人姓名" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="inboundContactPhone"
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
          </Card>

          {/* 出库地罐库存数据部分 */}
          <Card 
            title={
              <Space>
                <span>出库地罐库存数据部分</span>
                <span style={{ fontSize: '12px', color: '#666' }}>
                  数据是否为液位仪自动取数：
                  <Switch
                    size="small"
                    checked={tankDataAuto}
                    onChange={setTankDataAuto}
                    checkedChildren="是"
                    unCheckedChildren="否"
                  />
                </span>
              </Space>
            }
            size="small"
            style={{ marginBottom: 16 }}
          >
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="tankAcceptanceVolumeVt"
                  label="地罐验收量Vt(L)"
                  rules={[{ required: true, message: '请输入地罐验收量Vt' }]}
                >
                  <InputNumber
                    placeholder="请输入地罐验收量Vt"
                    style={{ width: '100%' }}
                    onChange={calculateOutboundLoss}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="tankAcceptanceVolumeV20"
                  label="地罐验收量V20(L)"
                  rules={[{ required: true, message: '请输入地罐验收量V20' }]}
                >
                  <InputNumber
                    placeholder="请输入地罐验收量V20"
                    style={{ width: '100%' }}
                    onChange={calculateOutboundLoss}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="outboundAfterHeight"
                  label="出库后高度(mm)"
                  rules={[{ required: true, message: '请输入出库后高度' }]}
                >
                  <InputNumber placeholder="请输入出库后高度" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="outboundAfterWeight"
                  label="出库后重量(kg)"
                  rules={[{ required: true, message: '请输入出库后重量' }]}
                >
                  <InputNumber placeholder="请输入出库后重量" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="outboundAfterTemperature"
                  label="出库后罐温(℃)"
                  rules={[{ required: true, message: '请输入出库后罐温' }]}
                >
                  <InputNumber placeholder="请输入出库后罐温" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={6}>
                <Form.Item
                  name="outboundLossVt"
                  label="出库损益量Vt(L)"
                >
                  <InputNumber placeholder="自动计算" style={{ width: '100%' }} disabled />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="outboundLossRateVt"
                  label="出库损益率Vt(‰)"
                >
                  <InputNumber
                    placeholder="自动计算"
                    style={{ width: '100%' }}
                    disabled
                    onChange={calculateExcessLossRate}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="outboundLossV20"
                  label="出库损益量V20(L)"
                >
                  <InputNumber placeholder="自动计算" style={{ width: '100%' }} disabled />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="outboundLossRateV20"
                  label="出库损益率V20(‰)"
                >
                  <InputNumber placeholder="自动计算" style={{ width: '100%' }} disabled />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="allowedErrorRate"
                  label="出库允许误差率(%)"
                  initialValue={0.3}
                >
                  <InputNumber value={0.3} disabled style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="excessLossRate"
                  label="超损率(%)"
                >
                  <InputNumber placeholder="自动计算" style={{ width: '100%' }} disabled />
                </Form.Item>
              </Col>
            </Row>

            <Divider />

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="outboundSealNumber"
                  label="出库铅封号"
                >
                  <Input placeholder="请输入出库铅封号" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="responsiblePerson"
                  label="负责人"
                >
                  <Input placeholder="请输入负责人" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="remarks"
                  label="备注信息"
                >
                  <TextArea rows={3} placeholder="请输入备注信息" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </>
      )}

      {/* 按钮区域 */}
      <Row justify="end">
        <Space>
          <Button icon={<CloseOutlined />} onClick={onCancel}>
            {isReadOnly ? '关闭' : '取消'}
          </Button>
          {!isReadOnly && (
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSubmit}
              loading={loading}
            >
              保存
            </Button>
          )}
        </Space>
      </Row>
    </Form>
  );
};

export default OilTransferForm; 