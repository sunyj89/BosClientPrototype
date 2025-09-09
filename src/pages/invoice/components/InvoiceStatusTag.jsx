import React from 'react';
import { Tag } from 'antd';

const InvoiceStatusTag = ({ status }) => {
  const statusMap = {
    '00': { text: '待开票', color: 'orange' },
    '01': { text: '开票中', color: 'blue' },
    '02': { text: '开票成功', color: 'green' },
    '03': { text: '开票失败', color: 'red' },
    '04': { text: '已取消', color: 'gray' },
    '05': { text: '红冲申请中', color: 'purple' },
    '06': { text: '红冲成功', color: 'magenta' },
    '07': { text: '红冲失败', color: 'volcano' }
  };
  
  const config = statusMap[status] || { text: status, color: 'default' };
  
  return <Tag color={config.color}>{config.text}</Tag>;
};

export default InvoiceStatusTag;