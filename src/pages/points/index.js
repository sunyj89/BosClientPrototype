import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PointsDashboard from './dashboard';
import PointsConfig from './config';
import PointsDetails from './details';
import PointsMall from './mall';
import PointsReports from './reports';

const PointsRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/points/dashboard" />} />
      <Route path="/dashboard" element={<PointsDashboard />} />
      <Route path="/config" element={<PointsConfig />} />
      <Route path="/details" element={<PointsDetails />} />
      <Route path="/mall" element={<PointsMall />} />
      <Route path="/reports" element={<PointsReports />} />
    </Routes>
  );
};

export default PointsRoutes; 