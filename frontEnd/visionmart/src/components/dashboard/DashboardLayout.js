import { Navigate, Outlet } from 'react-router-dom';
import { useState } from 'react';
import useDashboardAssets from './hooks/useDashboardAssets';
import { useAuth } from '../../context/AuthContext';
import DashboardSidebar from './shared/DashboardSidebar';
import DashboardNavbar from './shared/DashboardNavbar';
import DashboardFooter from './shared/DashboardFooter';

function DashboardLayout() {
  useDashboardAssets();
  const { user, loading, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) return <div className="p-5 text-center">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!['admin', 'seller'].includes(user?.role)) return <Navigate to="/" replace />;

  return (
    <div className={`dashboard-scope container-scroller ${sidebarOpen ? 'sidebar-icon-only' : ''}`}>
      <DashboardSidebar />
      <div className="container-fluid page-body-wrapper">
        <DashboardNavbar onToggleSidebar={() => setSidebarOpen((v) => !v)} />
        <div className="main-panel">
          <div className="content-wrapper d-flex flex-column min-vh-100">
  
            <div className="flex-grow-1">
              <Outlet />
            </div>

            <DashboardFooter />

        </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
