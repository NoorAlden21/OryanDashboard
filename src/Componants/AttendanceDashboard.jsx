import React from 'react';
import { useNavigate } from 'react-router-dom';  
import { Users, ChevronRight, Loader2, AlertTriangle } from 'lucide-react';
import { useGetAttendanceClassroomsQuery } from '../Slice/AttendanceSlice'; 

const ClassroomCard = ({ classroom, onClick }) => (
  <button
    onClick={onClick}
    className="w-full bg-white p-6 rounded-xl shadow-md border border-slate-200 hover:border-primary hover:shadow-lg transition-all flex justify-between items-center text-right"
  >
    <div>
      <h3 className="text-xl font-bold text-textMain">{classroom.name}</h3>
      <p className="text-slate-500">{classroom.class_type.name} - {classroom.year}</p>
    </div>
    <ChevronRight className="text-slate-400" size={24} />
  </button>
);

const AttendanceDashboard = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetAttendanceClassroomsQuery();

  const handleClassroomSelect = (classroomId) => {
    navigate(`/attendance/record/${classroomId}`);
  };

  return (
    <div className="p-8 bg-neutral min-h-screen" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-textMain tracking-tight">تسجيل الحضور والغياب</h1>
          <p className="mt-2 text-lg text-slate-500">اختر صفاً دراسياً لبدء تسجيل حضور وغياب الطلاب.</p>
          {data?.today && <p className="mt-1 text-sm font-semibold text-primary">التاريخ اليوم: {data.today}</p>}
        </header>

        {isLoading && (
          <div className="flex justify-center p-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        )}

        {isError && (
          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <AlertTriangle className="h-12 w-12 text-error mx-auto" />
            <h3 className="mt-4 text-xl font-bold text-error">حدث خطأ</h3>
            <p className="mt-2 text-slate-500">{error?.data?.message || "لم نتمكن من تحميل قائمة الصفوف."}</p>
          </div>
        )}

        {data && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.classrooms.map(classroom => (
              <ClassroomCard 
                key={classroom.id} 
                classroom={classroom} 
                onClick={() => handleClassroomSelect(classroom.id)} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceDashboard;
