import { useEffect } from 'react';

const ASSET_BASE = `${process.env.PUBLIC_URL}/dashboard-assets`;

function addCss(id, href) {
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

export default function useDashboardAssets() {
  useEffect(() => {
    document.body.classList.add('dashboard-page');

    addCss('dashboard-mdi-css', `${ASSET_BASE}/vendors/mdi/css/materialdesignicons.min.css`);
    addCss('dashboard-ti-css', `${ASSET_BASE}/vendors/ti-icons/css/themify-icons.css`);
    addCss('dashboard-vendor-css', `${ASSET_BASE}/vendors/css/vendor.bundle.base.css`);
    addCss('dashboard-fa-css', `${ASSET_BASE}/vendors/font-awesome/css/font-awesome.min.css`);
    addCss('dashboard-main-css', `${ASSET_BASE}/css/style.css`);
    addCss('dashboard-isolation-css', `${process.env.PUBLIC_URL}/dashboard-isolation.css`);

    return () => {
      document.body.classList.remove('dashboard-page');
      [
        'dashboard-mdi-css',
        'dashboard-ti-css',
        'dashboard-vendor-css',
        'dashboard-fa-css',
        'dashboard-main-css',
        'dashboard-isolation-css',
      ].forEach((id) => document.getElementById(id)?.remove());
    };
  }, []);
}
