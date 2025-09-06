


import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetSubjectByIdQuery } from '../Slice/SubjectSlice';
import { BookOpen, ChevronLeft, Loader2, AlertTriangle, GraduationCap } from 'lucide-react';

const SubjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: subjectData, isLoading, isError } = useGetSubjectByIdQuery(id);

  return (
    <div className="p-8 bg-neutral min-h-screen">
      {(() => {
        if (isLoading) {
          return (
            <div className="flex flex-col items-center justify-center h-[80vh]">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-lg text-slate-500">جاري تحميل بيانات المادة...</p>
            </div>
          );
        }

        if (isError || !subjectData?.data) {
          return (
            <div className="flex flex-col items-center justify-center h-[80vh] bg-error/10 rounded-lg p-8">
              <AlertTriangle className="h-12 w-12 text-error" />
              <h3 className="mt-4 text-xl font-bold text-error">خطأ في التحميل</h3>
              <p className="mt-2 text-error/80">لم نتمكن من العثور على بيانات المادة الدراسية.</p>
            </div>
          );
        }

        const { name, class_types } = subjectData.data;

        return (
          <div className="max-w-4xl mx-auto" dir="rtl">
            
            {/* زر العودة */}
            <button onClick={() => navigate(-1)} className="mb-6 bg-white text-textMain rounded-lg hover:bg-slate-50 border border-slate-300 flex items-center px-4 py-2 text-sm font-medium transition-colors">
              <ChevronLeft size={20} className="ml-1" /> العودة إلى القائمة
            </button>

            {/* بطاقة المادة الرئيسية */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-8 text-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen size={60} className="text-primary" />
              </div>
              <h2 className="text-4xl font-extrabold text-textMain capitalize">{name}</h2>
              <p className="text-lg text-slate-500 mt-2">
                تُدرّس في {class_types?.length || 0} صفوف دراسية
              </p>
            </div>

            {/* قسم الصفوف الدراسية */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold text-textMain mb-4 pb-3 border-b border-neutral">
                الصفوف التي تُدرّس فيها هذه المادة
              </h3>
              {class_types && class_types.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {class_types.map((classType) => (
                    <div key={classType.id} className="bg-neutral/60 border border-slate-200 rounded-lg p-4 flex items-center">
                      <GraduationCap className="text-primary ml-3" size={20} />
                      <span className="font-medium text-textMain">{classType.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-slate-500 py-8">
                  هذه المادة ليست مرتبطة بأي صف دراسي حاليًا.
                </p>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default SubjectDetails;
