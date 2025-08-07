import React, { useState } from 'react';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="no-print">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="no-print">
            <MobileHeader onMenuClick={() => setSidebarOpen(true)} />
        </div>
        <main className="container mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
            {children}
        </main>
      </div>
    </div>
  );
};
export default Layout;