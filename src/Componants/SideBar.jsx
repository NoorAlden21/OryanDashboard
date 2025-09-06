

// import React from 'react';
// import { NavLink, useLocation } from 'react-router-dom';

// import {
//   LayoutDashboard,
//   Users,
//   GraduationCap,
//   School,
//   Library,
//   BookOpen,
//   LogOut,
//   Shield,   
// } from 'lucide-react';

// import {
//   mainRoute,
//   student,
//   teachers,
//   classRoom,
//   classType,
//   subject,
//   teacherSchedule,
//   attendance
// } from '../data/data.jsx';

// const NavItem = ({ to, icon, children }) => {
//   const location = useLocation();
//   const isActive = location.pathname === to;

//   return (
//     <li>
//       <NavLink
//         to={to}
//         className={`
//           flex items-center p-3 my-1 rounded-lg text-neutral 
//           transition-all duration-200 ease-in-out
//           hover:bg-primary-dark hover:text-white
//           ${isActive ? 'bg-primary-dark text-white font-bold shadow-inner' : ''}
//         `}
//       >
//         {React.cloneElement(icon, { className: isActive ? 'text-accent' : 'text-neutral' })}
//         <span className="mr-4 text-sm font-medium hidden lg:block">{children}</span>
//       </NavLink>
//     </li>
//   );
// };

// export default function SideBar() {
//   return (
//     <aside className="
//       bg-primary text-neutral 
//       h-screen w-20 lg:w-64 
//       fixed top-0 right-0 
//       flex flex-col 
//       shadow-xl z-40 
//       transition-all duration-300 ease-in-out
//     ">
      
//       <div className="flex items-center justify-center p-4 h-20 border-b border-primary-light">
//         <div className="p-2 bg-accent rounded-full">
//           <Shield size={28} className="text-primary" />
//         </div>
//         <h1 className="text-xl font-black mr-3 hidden lg:block text-white">نظامي</h1>
//       </div>

//       <nav className="flex-grow px-3 py-4">
//         <ul className="space-y-1">
//           <NavItem to={mainRoute} icon={<LayoutDashboard size={20} />}>نظرة عامة</NavItem>
//                     <NavItem to={teacherSchedule} icon={<LayoutDashboard size={20} />}>جدول الاساتذة</NavItem>

//           <NavItem to={student} icon={<Users size={20} />}>الطلاب</NavItem>
//           <NavItem to={teachers} icon={<GraduationCap size={20} />}>المعلمين</NavItem>
//           <NavItem to={classRoom} icon={<School size={20} />}>الفصول الدراسية</NavItem>
//           <NavItem to={classType} icon={<Library size={20} />}>أنواع الفصول</NavItem>
//           <NavItem to={subject} icon={<BookOpen size={20} />}>المواد الدراسية</NavItem>
//                     <NavItem to={attendance} icon={<BookOpen size={20} />}>الغيابات</NavItem>

//         </ul>
//       </nav>

//       {/* قسم تسجيل الخروج */}
//       <div className="px-3 py-4 border-t border-primary-light">
//         <a
//           href="#" 
//           className="
//             flex items-center p-3 rounded-lg text-neutral
//             transition-colors duration-200 
//             hover:bg-error/20 hover:text-error
//           "
//         >
//           <LogOut size={20} />
//           <span className="mr-4 text-sm font-medium hidden lg:block">تسجيل الخروج</span>
//         </a>
//       </div>
//     </aside>
//   );
// }


import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

// ✅ 1. استيراد صورة اللوغو من مجلد assets
import MainLogo from '../assets/main_logo.png'; 

import {
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  Library,
  BookOpen,
  LogOut,
  // Shield, // لم نعد بحاجة إلى هذه الأيقونة هنا
} from 'lucide-react';

import {
  mainRoute,
  student,
  teachers,
  classRoom,
  classType,
  subject,
  teacherSchedule,
  attendance
} from '../data/data.jsx';

const NavItem = ({ to, icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <li>
      <NavLink
        to={to}
        className={`
          flex items-center p-3 my-1 rounded-lg text-neutral 
          transition-all duration-200 ease-in-out
          hover:bg-primary-dark hover:text-white
          ${isActive ? 'bg-primary-dark text-white font-bold shadow-inner' : ''}
        `}
      >
        {React.cloneElement(icon, { className: isActive ? 'text-accent' : 'text-neutral' })}
        <span className="mr-4 text-sm font-medium hidden lg:block">{children}</span>
      </NavLink>
    </li>
  );
};

export default function SideBar() {
  return (
    <aside className="
      bg-primary text-neutral 
      h-screen w-20 lg:w-64 
      fixed top-0 right-0 
      flex flex-col 
      shadow-xl z-40 
      transition-all duration-300 ease-in-out
    ">
      
      <div className="flex items-center justify-center p-4 h-20 border-b border-primary-light">
        {/* ✅ 2. استبدال الأيقونة بعنصر الصورة */}
        <img 
          src={MainLogo} 
          alt="شعار النظام" 
          className="w-10 h-10 object-contain" // يمكنك تعديل الحجم حسب الحاجة
        />
        <h1 className="text-xl font-black mr-3 hidden lg:block text-white">نظامي</h1>
      </div>

      <nav className="flex-grow px-3 py-4">
        <ul className="space-y-1">
          <NavItem to={mainRoute} icon={<LayoutDashboard size={20} />}>نظرة عامة</NavItem>
          <NavItem to={teacherSchedule} icon={<LayoutDashboard size={20} />}>جدول الاساتذة</NavItem>
          <NavItem to={student} icon={<Users size={20} />}>الطلاب</NavItem>
          <NavItem to={teachers} icon={<GraduationCap size={20} />}>المعلمين</NavItem>
          <NavItem to={classRoom} icon={<School size={20} />}>الفصول الدراسية</NavItem>
          <NavItem to={classType} icon={<Library size={20} />}>أنواع الفصول</NavItem>
          <NavItem to={subject} icon={<BookOpen size={20} />}>المواد الدراسية</NavItem>
          <NavItem to={attendance} icon={<BookOpen size={20} />}>الغيابات</NavItem>
        </ul>
      </nav>

      {/* قسم تسجيل الخروج */}
      <div className="px-3 py-4 border-t border-primary-light">
        <a
          href="#" 
          className="
            flex items-center p-3 rounded-lg text-neutral
            transition-colors duration-200 
            hover:bg-error/20 hover:text-error
          "
        >
          <LogOut size={20} />
          <span className="mr-4 text-sm font-medium hidden lg:block">تسجيل الخروج</span>
        </a>
      </div>
    </aside>
  );
}
