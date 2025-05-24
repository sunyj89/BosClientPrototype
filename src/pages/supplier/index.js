import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SupplierManagement from './SupplierManagement';
import OilSupplierManagement from './OilSupplierManagement';
import GoodsSupplierManagement from './GoodsSupplierManagement';
import TransportUnitManagement from './TransportUnitManagement';
import SupplierPortal from './SupplierPortal';
import WinningQuotation from './WinningQuotation';

const SupplierRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SupplierManagement />} />
      <Route path="/oil" element={<OilSupplierManagement />} />
      <Route path="/goods" element={<GoodsSupplierManagement />} />
      <Route path="/transport" element={<TransportUnitManagement />} />
      <Route path="/portal" element={<SupplierPortal />} />
      <Route path="/winning-quotation" element={<WinningQuotation />} />
    </Routes>
  );
};

export default SupplierRoutes; 