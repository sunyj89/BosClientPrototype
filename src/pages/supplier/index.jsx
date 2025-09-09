import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import OilSupplierManagement from './oil';
import GoodsSupplierManagement from './goods';
import SupplierPortal from './portal';
import WinningQuotation from './winning-quotation';

const SupplierRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/supplier/oil" />} />
      <Route path="/oil" element={<OilSupplierManagement />} />
      <Route path="/goods" element={<GoodsSupplierManagement />} />
      <Route path="/portal" element={<SupplierPortal />} />
      <Route path="/winning-quotation" element={<WinningQuotation />} />
    </Routes>
  );
};

export default SupplierRoutes; 