import React from 'react';
import { Routes, Route } from 'react-router-dom';
import OilLossLayout from './oil-delivery/OilLossLayout';
import OilLossOrder from './oil-delivery/OilLossOrder';
import OilLossSummary from './oil-delivery/OilLossSummary';
import OilLossAnalysis from './oil-delivery/OilLossAnalysis';
import OilLossCost from './oil-delivery/OilLossCost';
import OilOverflowOrder from './oil-delivery/OilOverflowOrder';
import OilOverflowSummary from './oil-delivery/OilOverflowSummary';

const OilLoss = () => {
  return (
    <Routes>
      <Route path="/" element={<OilLossLayout />}>
        <Route index element={<OilLossOrder />} />
        <Route path="order" element={<OilLossOrder />} />
        <Route path="summary" element={<OilLossSummary />} />
        <Route path="analysis" element={<OilLossAnalysis />} />
        <Route path="cost" element={<OilLossCost />} />
        <Route path="overflow-order" element={<OilOverflowOrder />} />
        <Route path="overflow-summary" element={<OilOverflowSummary />} />
      </Route>
    </Routes>
  );
};

export default OilLoss; 