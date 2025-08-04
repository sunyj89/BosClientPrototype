import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import StationManagement from './management';
import TankManagement from './tank';
import GunManagement from './gun';

const StationRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/station/management" />} />
      <Route path="/management" element={<StationManagement />} />
      <Route path="/tank" element={<TankManagement />} />
      <Route path="/gun" element={<GunManagement />} />
    </Routes>
  );
};

export default StationRoutes; 