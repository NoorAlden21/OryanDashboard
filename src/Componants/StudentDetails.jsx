

import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetStudentByIdQuery } from '../Slice/StudentsSlice';
import StudentDetailsCard from './StudentDetailsCard';
import { Loader2, AlertTriangle } from 'lucide-react';

const StudentDetails = () => {
  const { id } = useParams(); 
  const { data: studentData, isLoading, isError } = useGetStudentByIdQuery(id);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
        <p className="mt-4 text-lg text-slate-500">جاري تحميل بيانات الطالب...</p>
      </div>
    );
  }

  if (isError || !studentData?.student) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] bg-red-50/50 rounded-lg p-8">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <h3 className="mt-4 text-xl font-bold text-red-700">خطأ في التحميل</h3>
        <p className="mt-2 text-red-600">لم نتمكن من العثور على بيانات الطالب. يرجى التأكد من صحة الرابط.</p>
      </div>
    );
  }

  return <StudentDetailsCard student={studentData.student} />;
};

export default StudentDetails;
