import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import SpinPage from './pages/SpinPage/SpinPage';
import PutInfoPage from './pages/PutInfoPage/PutInfoPage';
import DeliveryPage from './pages/DeliveryPage/DeliveryPage';
import BringPackagePage from './pages/BringPackagePage/BringPackagePage';
import AdminLayout from './pages/Admin/AdminLayout';
import DataPage from './pages/Admin/DataPage';
import GameDataPage from './pages/Admin/GameDataPage';
import DeliveryLinksPage from './pages/Admin/DeliveryLinksPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/spin" element={<SpinPage />} />
        <Route path="/putinfo" element={<PutInfoPage />} />
        <Route path="/delivery" element={<DeliveryPage />} />
        <Route path="/bringpackage" element={<BringPackagePage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="data" replace />} />
          <Route path="data" element={<DataPage />} />
          <Route path="gamedata" element={<GameDataPage />} />
          <Route path="deliverylinks" element={<DeliveryLinksPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;