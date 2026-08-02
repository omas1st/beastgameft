import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = () => {
  const location = useLocation();

  return (
    <div className="admin-layout">
      <header className="admin-topbar">
        <h2 className="admin-logo">GameContest Admin</h2>
        <nav className="admin-nav-links">
          <Link
            to="/admin/data"
            className={location.pathname.includes('/admin/data') ? 'active' : ''}
          >
            Game Data
          </Link>
          <Link
            to="/admin/gamedata"
            className={location.pathname.includes('/admin/gamedata') ? 'active' : ''}
          >
            Prizes (Gifts)
          </Link>
          <Link
            to="/admin/deliverylinks"
            className={location.pathname.includes('/admin/deliverylinks') ? 'active' : ''}
          >
            Delivery Links
          </Link>
        </nav>
      </header>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;