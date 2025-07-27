import React from 'react';
import { Modal, Button, Descriptions, Tag } from 'antd';

const OilReceiptViewModal = ({ visible, onClose, record }) => {
  if (!record) return null;

  // 状态颜色配置
  const getStatusColor = (status) => {
    const statusColors = {
      '草稿': 'default',
      '已提交': 'blue',
      '待审批': 'orange',
      '已审批': 'green'
    };
    return statusColors[status] || 'default';
  };

  return (
    <Modal
      title="入库卸油单详情"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          关闭
        </Button>
      ]}
      width={900}
    >
      {/* 基本信息 */}
      <Descriptions column={2} bordered>
        <Descriptions.Item label="单据编号">{record.receiptNumber}</Descriptions.Item>
        <Descriptions.Item label="单据状态">
          <Tag color={getStatusColor(record.status)}>
            {record.status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="入库站点">{record.stationName}</Descriptions.Item>
        <Descriptions.Item label="到站时间">{record.arrivalTime}</Descriptions.Item>
        <Descriptions.Item label="关联采购申请单">{record.procurementApplicationNumber || '-'}</Descriptions.Item>
        <Descriptions.Item label="关联出库单编号">{record.deliveryOrderNumber || '-'}</Descriptions.Item>
        <Descriptions.Item label="油库名称">{record.warehouseName}</Descriptions.Item>
        <Descriptions.Item label="油库代码">{record.warehouseCode}</Descriptions.Item>
        <Descriptions.Item label="供应商名称">{record.supplierName}</Descriptions.Item>
        <Descriptions.Item label="承运商名称">{record.carrierName}</Descriptions.Item>
        <Descriptions.Item label="承运车辆车牌">{record.vehicleNumber}</Descriptions.Item>
        <Descriptions.Item label="驾驶员">{record.driverName}</Descriptions.Item>
      </Descriptions>

      {/* 油品信息 */}
      <div style={{ 
        fontSize: 16, 
        fontWeight: 'bold', 
        marginBottom: 16,
        marginTop: 24,
        borderBottom: '1px solid #f0f0f0',
        paddingBottom: 8
      }}>
        油品信息
      </div>
      <Descriptions column={3} bordered size="small">
        <Descriptions.Item label="油品名称">{record.oilType}</Descriptions.Item>
        <Descriptions.Item label="原发重量(kg)">{record.originalWeight?.toLocaleString()}</Descriptions.Item>
        <Descriptions.Item label="实发温度(℃)">{record.actualTemperature}</Descriptions.Item>
        <Descriptions.Item label="原发体积Vt(L)">{record.originalVolumeVt?.toLocaleString()}</Descriptions.Item>
        <Descriptions.Item label="实发体积Vt(L)">{record.actualVolumeVt?.toLocaleString()}</Descriptions.Item>
        <Descriptions.Item label="实发密度(kg/L)">{record.actualDensity}</Descriptions.Item>
        <Descriptions.Item label="原发体积V20(L)">{record.originalVolumeV20?.toLocaleString()}</Descriptions.Item>
        <Descriptions.Item label="实发体积V20(L)">{record.actualVolumeV20?.toLocaleString()}</Descriptions.Item>
        <Descriptions.Item label="出库铅封号">{record.sealNumber}</Descriptions.Item>
      </Descriptions>

      {/* 地罐验收数据 */}
      <div style={{ 
        fontSize: 16, 
        fontWeight: 'bold', 
        marginBottom: 16,
        marginTop: 24,
        borderBottom: '1px solid #f0f0f0',
        paddingBottom: 8
      }}>
        地罐验收数据
      </div>
      <Descriptions column={3} bordered size="small">
        <Descriptions.Item label="油罐号">{record.tankNumber}</Descriptions.Item>
        <Descriptions.Item label="油水总高度(mm)">{record.totalHeight?.toLocaleString()}</Descriptions.Item>
        <Descriptions.Item label="水高(mm)">{record.waterHeight?.toLocaleString()}</Descriptions.Item>
        <Descriptions.Item label="罐内温度(℃)">{record.tankTemperature}</Descriptions.Item>
        <Descriptions.Item label="油水总体积(L)">{record.totalVolume?.toLocaleString()}</Descriptions.Item>
        <Descriptions.Item label="水体积(L)">{record.waterVolume?.toLocaleString()}</Descriptions.Item>
        <Descriptions.Item label="存油体积Vt(L)">{record.oilVolumeVt?.toLocaleString()}</Descriptions.Item>
        <Descriptions.Item label="存油体积V20(L)">{record.oilVolumeV20?.toLocaleString()}</Descriptions.Item>
        <Descriptions.Item label="卸油期间付油体积(L)">{record.unloadingPeriodVolume?.toLocaleString() || '-'}</Descriptions.Item>
      </Descriptions>

      {/* 验收和损溢数据 */}
      <div style={{ 
        fontSize: 16, 
        fontWeight: 'bold', 
        marginBottom: 16,
        marginTop: 24,
        borderBottom: '1px solid #f0f0f0',
        paddingBottom: 8
      }}>
        验收和损溢数据
      </div>
      <Descriptions column={3} bordered size="small">
        <Descriptions.Item label="油罐实收体积Vt(L)">{record.tankReceivedVolume?.toLocaleString()}</Descriptions.Item>
        <Descriptions.Item label="油罐实收体积V20(L)">{record.tankReceivedVolumeV20?.toLocaleString()}</Descriptions.Item>
        <Descriptions.Item label="地罐验收量Vt(L)">{record.tankAcceptanceVolume?.toLocaleString()}</Descriptions.Item>
        <Descriptions.Item label="地罐验收量V20(L)">{record.tankAcceptanceVolumeV20?.toLocaleString()}</Descriptions.Item>
        <Descriptions.Item label="卸后高度(mm)">{record.afterUnloadingHeight?.toLocaleString()}</Descriptions.Item>
        <Descriptions.Item label="卸后重量(kg)">{record.afterUnloadingWeight?.toLocaleString()}</Descriptions.Item>
        <Descriptions.Item label="卸油后罐温(℃)">{record.afterUnloadingTemperature}</Descriptions.Item>
        <Descriptions.Item label="动态密度(kg/L)">{record.dynamicDensity}</Descriptions.Item>
        <Descriptions.Item label="验收损益量Vt(L)">{record.acceptanceLossVt}</Descriptions.Item>
        <Descriptions.Item label="验收损益率Vt(‰)">{record.acceptanceLossRateVt}</Descriptions.Item>
        <Descriptions.Item label="验收损益量V20(L)">{record.acceptanceLossV20}</Descriptions.Item>
        <Descriptions.Item label="验收损益率V20(‰)">{record.acceptanceLossRateV20}</Descriptions.Item>
        <Descriptions.Item label="超损率(%)">{record.excessLossRate}</Descriptions.Item>
        <Descriptions.Item label="回空铅封号">{record.returnSealNumber}</Descriptions.Item>
      </Descriptions>

      {/* 其他信息 */}
      <div style={{ 
        fontSize: 16, 
        fontWeight: 'bold', 
        marginBottom: 16,
        marginTop: 24,
        borderBottom: '1px solid #f0f0f0',
        paddingBottom: 8
      }}>
        其他信息
      </div>
      <Descriptions column={2} bordered size="small">
        <Descriptions.Item label="创建时间">{record.createTime}</Descriptions.Item>
        <Descriptions.Item label="操作员">{record.operator}</Descriptions.Item>
        <Descriptions.Item label="验收备注信息" span={2}>
          {record.acceptanceNotes || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="特殊情况及超损原因分析" span={2}>
          {record.specialSituationAnalysis || '-'}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default OilReceiptViewModal;