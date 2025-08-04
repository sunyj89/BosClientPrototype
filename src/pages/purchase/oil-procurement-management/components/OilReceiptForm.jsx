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
  message
} from 'antd';
import {
  SaveOutlined,
  CloseOutlined
} from '@ant-design/icons';
import moment from 'moment';
import stationData from '../../../../mock/station/stationData.json';
import procurementData from '../../../../mock/purchase/oil-procurement/procurementApplicationData.json';
import warehouseDeliveryData from '../../../../mock/logistics/warehouseDeliveryData.json';
import unloadingSlipData from '../../../../mock/purchase/oil-procurement/unloadingSlipData.json';

const { Option } = Select;
const { TextArea } = Input;

const OilReceiptForm = ({ mode, initialValues, onSubmit, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [deliveryOrderType, setDeliveryOrderType] = useState('中石化出库单');
  const [linkedProcurement, setLinkedProcurement] = useState(null);
  const [linkedDelivery, setLinkedDelivery] = useState(null);
  const [linkedUnloadingSlip, setLinkedUnloadingSlip] = useState(null);

  // 初始化表单数据
  useEffect(() => {
    if (initialValues) {
      const formData = {
        ...initialValues,
        arrivalTime: initialValues.arrivalTime ? moment(initialValues.arrivalTime) : null
      };
      form.setFieldsValue(formData);
      if (initialValues.procurementApplicationNumber) {
        const procurement = procurementData.procurementApplications.find(
          p => p.applicationNumber === initialValues.procurementApplicationNumber
        );
        setLinkedProcurement(procurement);
      }
    } else {
      // 新建时生成单据编号
      const receiptNumber = `RK${moment().format('YYYYMMDD')}${String(Date.now()).slice(-4)}`;
      form.setFieldsValue({
        receiptNumber,
        arrivalTime: moment(),
        status: '草稿'
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

  // 关联采购申请单变化
  const handleProcurementChange = (value) => {
    if (value) {
      const procurement = procurementData.procurementApplications.find(
        p => p.applicationNumber === value
      );
      setLinkedProcurement(procurement);
    } else {
      setLinkedProcurement(null);
    }
  };

  // 出库单类型变化
  const handleDeliveryOrderTypeChange = (value) => {
    setDeliveryOrderType(value);
    if (value === '中石化出库单') {
      // 清空手工填写的字段
      form.setFieldsValue({
        deliveryNumber: '',
        deliveryOrderNumber: '',
        deliveryDate: null,
        deliveryTime: null,
        warehouseName: '',
        warehouseCode: '',
        supplierName: '',
        carrierName: '',
        carrierCode: '',
        vehicleNumber: '',
        driverName: '',
        travelDistance: null
      });
    }
    setLinkedDelivery(null);
  };

  // 关联卸油单变化
  const handleUnloadingSlipChange = (value) => {
    if (value) {
      const unloadingSlip = unloadingSlipData.unloadingSlips.find(
        slip => slip.slipNumber === value
      );
      if (unloadingSlip) {
        setLinkedUnloadingSlip(unloadingSlip);
        // 自动填充地罐验收计量数据
        form.setFieldsValue({
          tankNumber: unloadingSlip.tankNumber,
          totalHeight: unloadingSlip.tankData.totalHeight,
          waterHeight: unloadingSlip.tankData.waterHeight,
          tankTemperature: unloadingSlip.tankData.tankTemperature,
          totalVolume: unloadingSlip.tankData.totalVolume,
          waterVolume: unloadingSlip.tankData.waterVolume,
          oilVolumeVt: unloadingSlip.tankData.oilVolumeVt,
          oilVolumeV20: unloadingSlip.tankData.oilVolumeV20
        });
      }
    } else {
      setLinkedUnloadingSlip(null);
    }
  };

  // 关联中石化出库单变化
  const handleSinopecDeliveryChange = (value) => {
    if (value) {
      const delivery = warehouseDeliveryData.deliveryOrders.find(
        d => d.deliveryNumber === value
      );
      if (delivery) {
        setLinkedDelivery(delivery);
        // 自动填充出库单信息
        form.setFieldsValue({
          deliveryNumber: delivery.deliveryNumber,
          deliveryOrderNumber: delivery.orderNumber,
          deliveryDate: delivery.deliveryDate ? moment(delivery.deliveryDate) : null,
          deliveryTime: delivery.deliveryTime,
          warehouseName: delivery.warehouseName,
          warehouseCode: delivery.warehouseCode,
          supplierName: delivery.supplierName,
          carrierName: delivery.carrierName,
          carrierCode: delivery.carrierCode,
          vehicleNumber: delivery.vehicleNumber,
          driverName: delivery.driverName,
          travelDistance: delivery.travelDistance,
          oilType: delivery.oilType,
          originalWeight: delivery.originalWeight,
          actualTemperature: delivery.actualTemperature,
          originalVolumeVt: delivery.originalVolumeVt,
          actualVolumeVt: delivery.actualVolumeVt,
          originalVolumeV20: delivery.originalVolumeV20,
          actualVolumeV20: delivery.actualVolumeV20,
          sealNumber: delivery.sealNumber,
          sealOperator: delivery.sealOperator,
          measureOperator: delivery.measureOperator,
          erpNumber: delivery.erpNumber
        });
        
        // 计算实发密度
        if (delivery.originalWeight && delivery.actualVolumeVt) {
          const density = (delivery.originalWeight / delivery.actualVolumeVt).toFixed(3);
          form.setFieldsValue({ actualDensity: parseFloat(density) });
        }
      }
    } else {
      setLinkedDelivery(null);
    }
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

  const calculateAcceptanceLoss = () => {
    const actualDeliveryVolume = form.getFieldValue('actualDeliveryVolume');
    const tankAcceptanceVolume = form.getFieldValue('tankAcceptanceVolume');
    
    if (actualDeliveryVolume && tankAcceptanceVolume) {
      const lossVt = actualDeliveryVolume - tankAcceptanceVolume;
      const lossRateVt = ((lossVt / actualDeliveryVolume) * 1000).toFixed(1);
      form.setFieldsValue({
        acceptanceLossVt: lossVt.toFixed(1),
        acceptanceLossRateVt: parseFloat(lossRateVt)
      });
    }

    const actualVolumeV20 = form.getFieldValue('actualVolumeV20');
    const tankAcceptanceVolumeV20 = form.getFieldValue('tankAcceptanceVolumeV20');
    
    if (actualVolumeV20 && tankAcceptanceVolumeV20) {
      const lossV20 = actualVolumeV20 - tankAcceptanceVolumeV20;
      const lossRateV20 = ((lossV20 / actualVolumeV20) * 1000).toFixed(1);
      form.setFieldsValue({
        acceptanceLossV20: lossV20.toFixed(1),
        acceptanceLossRateV20: parseFloat(lossRateV20)
      });
    }
  };

  const calculateExcessLossRate = () => {
    const acceptanceLossRateVt = form.getFieldValue('acceptanceLossRateVt');
    const allowedErrorRate = 0.3; // 全局固定值0.3%
    
    if (acceptanceLossRateVt !== undefined) {
      const excessLossRate = Math.max(0, acceptanceLossRateVt - allowedErrorRate);
      form.setFieldsValue({ excessLossRate: excessLossRate.toFixed(2) });
    }
  };

  const calculateDynamicDensity = () => {
    const afterUnloadingWeight = form.getFieldValue('afterUnloadingWeight');
    const tankReceivedVolume = form.getFieldValue('tankReceivedVolume');
    
    if (afterUnloadingWeight && tankReceivedVolume) {
      const density = (afterUnloadingWeight / tankReceivedVolume).toFixed(3);
      form.setFieldsValue({ dynamicDensity: parseFloat(density) });
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
        arrivalTime: values.arrivalTime ? values.arrivalTime.format('YYYY-MM-DD HH:mm:ss') : null,
        deliveryDate: values.deliveryDate ? values.deliveryDate.format('YYYY-MM-DD') : null
      };

      await onSubmit(submitData);
    } catch (error) {
      message.error('请检查表单填写是否完整');
    } finally {
      setLoading(false);
    }
  };

  const isReadOnly = mode === 'view';

  return (
    <Form
      form={form}
      layout="vertical"
      disabled={isReadOnly}
    >
      {/* 基本信息部分 */}
      <Card title="单据基本信息" size="small" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="receiptNumber"
              label="单据编号"
              rules={[{ required: true, message: '请输入单据编号' }]}
            >
              <Input placeholder="系统自动生成" disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="stationName"
              label="入库站点"
              rules={[{ required: true, message: '请选择入库站点' }]}
            >
              <TreeSelect
                placeholder="请选择入库站点"
                treeData={buildStationTreeData()}
                allowClear
                showSearch
                treeDefaultExpandAll={false}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="arrivalTime"
              label="到站时间"
              rules={[{ required: true, message: '请选择到站时间' }]}
            >
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="请选择到站时间"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* 关联采购申请部分 */}
      <Card title="关联采购申请部分（非必填）" size="small" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="procurementApplicationNumber" label="关联采购申请单">
              <Select
                placeholder="请选择采购申请单"
                allowClear
                onChange={handleProcurementChange}
              >
                {(procurementData.procurementApplications || []).map(item => (
                  <Option key={item.applicationNumber} value={item.applicationNumber}>
                    {item.applicationNumber}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          {linkedProcurement && (
            <>
              <Col span={8}>
                <Form.Item label="油品名称">
                  <Input value={linkedProcurement.oilType} disabled />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="申请数量（吨）">
                  <Input value={linkedProcurement.quantity} disabled />
                </Form.Item>
              </Col>
            </>
          )}
        </Row>
      </Card>

      {/* 关联出库单数据部分 */}
      <Card title="关联出库单数据部分" size="small" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="deliveryOrderType"
              label="出库单类型"
              rules={[{ required: true, message: '请选择出库单类型' }]}
              initialValue="中石化出库单"
            >
              <Radio.Group onChange={(e) => handleDeliveryOrderTypeChange(e.target.value)}>
                <Radio value="中石化出库单">中石化出库单</Radio>
                <Radio value="第三方出库单">第三方出库单</Radio>
                <Radio value="手工填写">手工填写</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          {deliveryOrderType === '中石化出库单' && (
            <Col span={8}>
              <Form.Item name="sinopecDeliveryNumber" label="选择中石化出库单">
                <Select
                  placeholder="请选择出库单"
                  allowClear
                  onChange={handleSinopecDeliveryChange}
                  showSearch
                >
                  {(warehouseDeliveryData.deliveryOrders || []).map(item => (
                    <Option key={item.deliveryNumber} value={item.deliveryNumber}>
                      {item.deliveryNumber} - {item.oilType}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          )}
        </Row>

        <Divider />

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              name="deliveryNumber"
              label="配送单号"
              rules={deliveryOrderType !== '中石化出库单' ? [{ required: true }] : []}
            >
              <Input placeholder="请输入配送单号" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="deliveryOrderNumber"
              label="出库单号"
              rules={[{ required: true, message: '请输入出库单号' }]}
            >
              <Input placeholder="请输入出库单号" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="deliveryDate"
              label="配送日期"
              rules={[{ required: true, message: '请选择配送日期' }]}
            >
              <DatePicker placeholder="请选择配送日期" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="deliveryTime"
              label="出库时间"
              rules={[{ required: true, message: '请输入出库时间' }]}
            >
              <Input placeholder="请输入出库时间" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              name="warehouseName"
              label="油库名称"
              rules={[{ required: true, message: '请输入油库名称' }]}
            >
              <Input placeholder="请输入油库名称" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="warehouseCode"
              label="油库代码"
              rules={[{ required: true, message: '请输入油库代码' }]}
            >
              <Input placeholder="请输入油库代码" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="supplierName"
              label="供应商名称"
              rules={[{ required: true, message: '请输入供应商名称' }]}
            >
              <Input placeholder="请输入供应商名称" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="carrierName"
              label="承运商名称"
              rules={[{ required: true, message: '请输入承运商名称' }]}
            >
              <Input placeholder="请输入承运商名称" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
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
              label="驾驶员"
              rules={[{ required: true, message: '请输入驾驶员姓名' }]}
            >
              <Input placeholder="请输入驾驶员姓名" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="travelDistance"
              label="行程距离(KM)"
            >
              <InputNumber placeholder="请输入行程距离" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              name="oilType"
              label="油品名称"
              rules={[{ required: true, message: '请输入油品名称' }]}
            >
              <Input placeholder="请输入油品名称" />
            </Form.Item>
          </Col>
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
        </Row>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              name="actualVolumeVt"
              label="实发体积Vt(L)"
              rules={[{ required: true, message: '请输入实发体积Vt' }]}
            >
              <InputNumber
                placeholder="请输入实发体积Vt"
                style={{ width: '100%' }}
                onChange={calculateDensity}
              />
            </Form.Item>
          </Col>
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
        </Row>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              name="sealNumber"
              label="出库铅封号"
              rules={[{ required: true, message: '请输入出库铅封号' }]}
            >
              <Input placeholder="请输入出库铅封号" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="sealOperator"
              label="铅封员"
              rules={[{ required: true, message: '请输入铅封员' }]}
            >
              <Input placeholder="请输入铅封员" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="measureOperator"
              label="计量员"
              rules={[{ required: true, message: '请输入计量员' }]}
            >
              <Input placeholder="请输入计量员" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="erpNumber"
              label="ERP单号"
            >
              <Input placeholder="请输入ERP单号" />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* 入库卸油前地罐验收计量数据部分 */}
      <Card 
        title="入库卸油前地罐验收计量数据部分"
        size="small"
        style={{ marginBottom: 16 }}
      >
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Form.Item name="linkedUnloadingSlip" label="是否关联卸油单">
              <Select
                placeholder="请选择卸油单"
                allowClear
                onChange={handleUnloadingSlipChange}
                showSearch
              >
                {(unloadingSlipData.unloadingSlips || []).map(item => (
                  <Option key={item.slipNumber} value={item.slipNumber}>
                    {item.slipNumber} - {item.oilType} - {item.vehicleNumber}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          {linkedUnloadingSlip && (
            <>
              <Col span={8}>
                <Form.Item label="关联车牌号">
                  <Input value={linkedUnloadingSlip.vehicleNumber} disabled />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="卸油时间">
                  <Input value={`${linkedUnloadingSlip.unloadingDate} ${linkedUnloadingSlip.unloadingTime}`} disabled />
                </Form.Item>
              </Col>
            </>
          )}
        </Row>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              name="tankNumber"
              label="油罐号"
              rules={[{ required: true, message: '请输入油罐号' }]}
            >
              <Input placeholder="请输入油罐号" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="totalHeight"
              label="油水总高度(mm)"
              rules={[{ required: true, message: '请输入油水总高度' }]}
            >
              <InputNumber placeholder="请输入油水总高度" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="waterHeight"
              label="水高(mm)"
              rules={[{ required: true, message: '请输入水高' }]}
            >
              <InputNumber placeholder="请输入水高" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="tankTemperature"
              label="罐内温度(℃)"
              rules={[{ required: true, message: '请输入罐内温度' }]}
            >
              <InputNumber placeholder="请输入罐内温度" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              name="totalVolume"
              label="油水总体积(L)"
              rules={[{ required: true, message: '请输入油水总体积' }]}
            >
              <InputNumber placeholder="请输入油水总体积" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="waterVolume"
              label="水体积(L)"
              rules={[{ required: true, message: '请输入水体积' }]}
            >
              <InputNumber placeholder="请输入水体积" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="oilVolumeVt"
              label="存油体积Vt(L)"
              rules={[{ required: true, message: '请输入存油体积Vt' }]}
            >
              <InputNumber placeholder="请输入存油体积Vt" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="oilVolumeV20"
              label="存油体积V20(L)"
              rules={[{ required: true, message: '请输入存油体积V20' }]}
            >
              <InputNumber placeholder="请输入存油体积V20" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* 验收和损溢数据部分 */}
      <Card 
        title="验收和损溢数据部分"
        size="small"
        style={{ marginBottom: 16 }}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="tankReceivedVolume"
              label="油罐实收体积Vt(L)"
              rules={[{ required: true, message: '请输入油罐实收体积Vt' }]}
            >
              <InputNumber
                placeholder="请输入油罐实收体积Vt"
                style={{ width: '100%' }}
                onChange={calculateDynamicDensity}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="tankReceivedVolumeV20"
              label="油罐实收体积V20(L)"
              rules={[{ required: true, message: '请输入油罐实收体积V20' }]}
            >
              <InputNumber placeholder="请输入油罐实收体积V20" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="unloadingPeriodVolume"
              label="卸油期间付油体积(L)"
            >
              <InputNumber placeholder="请输入卸油期间付油体积" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="tankAcceptanceVolume"
              label="地罐验收量Vt(L)"
              rules={[{ required: true, message: '请输入地罐验收量Vt' }]}
            >
              <InputNumber
                placeholder="请输入地罐验收量Vt"
                style={{ width: '100%' }}
                onChange={calculateAcceptanceLoss}
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
                onChange={calculateAcceptanceLoss}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="afterUnloadingHeight"
              label="卸后高度(mm)"
              rules={[{ required: true, message: '请输入卸后高度' }]}
            >
              <InputNumber placeholder="请输入卸后高度" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="afterUnloadingWeight"
              label="卸后重量(kg)"
              rules={[{ required: true, message: '请输入卸后重量' }]}
            >
              <InputNumber
                placeholder="请输入卸后重量"
                style={{ width: '100%' }}
                onChange={calculateDynamicDensity}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="afterUnloadingTemperature"
              label="卸油后罐温(℃)"
              rules={[{ required: true, message: '请输入卸油后罐温' }]}
            >
              <InputNumber placeholder="请输入卸油后罐温" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="dynamicDensity"
              label="卸油后动态密度(kg/L)"
            >
              <InputNumber placeholder="自动计算" style={{ width: '100%' }} disabled />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              name="acceptanceLossVt"
              label="验收损益量Vt(L)"
            >
              <InputNumber placeholder="自动计算" style={{ width: '100%' }} disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="acceptanceLossRateVt"
              label="验收损益率Vt(‰)"
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
              name="acceptanceLossV20"
              label="验收损益量V20(L)"
            >
              <InputNumber placeholder="自动计算" style={{ width: '100%' }} disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="acceptanceLossRateV20"
              label="验收损益率V20(‰)"
            >
              <InputNumber placeholder="自动计算" style={{ width: '100%' }} disabled />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="allowedErrorRate"
              label="交接允许误差率(%)"
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
          <Col span={8}>
            <Form.Item
              name="returnSealNumber"
              label="回空铅封号"
              rules={[{ required: true, message: '请输入回空铅封号' }]}
            >
              <Input placeholder="请输入回空铅封号" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="acceptanceNotes"
              label="验收备注信息"
            >
              <TextArea rows={3} placeholder="请输入验收备注信息" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="specialSituationAnalysis"
              label="特殊情况及超损原因分析"
            >
              <TextArea rows={3} placeholder="请输入特殊情况及超损原因分析" />
            </Form.Item>
          </Col>
        </Row>
      </Card>

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

export default OilReceiptForm; 