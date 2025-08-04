import React, { useState } from 'react';
import { Card, Spin } from 'antd';
import DensityDataTab from './components/DensityDataTab';
import './index.css';

/**
 * 油品密度管理页面
 * 展示油品密度数据信息
 */
const OilDensity = () => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="oil-density-container">
      <Card>
        <Spin spinning={loading}>
          <DensityDataTab />
        </Spin>
      </Card>
    </div>
  );
};

export default OilDensity; 