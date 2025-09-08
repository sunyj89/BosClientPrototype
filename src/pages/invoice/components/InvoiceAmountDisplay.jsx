import React from 'react';

const InvoiceAmountDisplay = ({ 
  amount, 
  tax, 
  totalWithTax, 
  showDetail = false 
}) => {
  return (
    <div>
      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1890ff' }}>
        ¥{totalWithTax?.toFixed(2) || '0.00'}
      </div>
      {showDetail && (
        <div style={{ fontSize: '12px', color: '#666' }}>
          <div>不含税: ¥{amount?.toFixed(2) || '0.00'}</div>
          <div>税额: ¥{tax?.toFixed(2) || '0.00'}</div>
        </div>
      )}
    </div>
  );
};

export default InvoiceAmountDisplay;