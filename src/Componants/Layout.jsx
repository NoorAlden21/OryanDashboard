


import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SideBar from './SideBar'; 

export default function Layout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/"; // افترضت أن مسار تسجيل الدخول هو "/"

  if (isLoginPage) {
    return <Outlet />;
  }

  return (
    <div className="bg-slate-50 min-h-screen" dir="rtl">
      
      <SideBar />
      
   
      <main className="mr-20 lg:mr-64 transition-all duration-300 ease-in-out">
        
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>

      </main>
    </div>
  );
}

