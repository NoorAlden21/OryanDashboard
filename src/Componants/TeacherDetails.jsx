

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetTeacherByIdQuery } from '../Slice/TeachersSlice';
import { User, Phone, Calendar, VenetianMask, Book, Loader2, AlertTriangle, ChevronLeft } from 'lucide-react';

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center py-3 border-b border-neutral last:border-b-0">
    <div className="flex items-center text-primary w-1/3">
      {icon}
      <span className="mr-2 text-sm font-medium text-slate-500">{label}</span>
    </div>
    <div className="text-textMain font-semibold text-sm w-2/3 text-right">
      {value || <span className="text-slate-400 italic">غير محدد</span>}
    </div>
  </div>
);

const InfoSection = ({ title, children }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
    <h3 className="text-lg font-bold text-textMain mb-3 pb-2 border-b border-neutral">{title}</h3>
    <div className="space-y-1">{children}</div>
  </div>
);

const TeacherDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetTeacherByIdQuery(id);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-slate-500">جاري تحميل بيانات المعلم...</p>
      </div>
    );
  }

  if (isError || !data?.teacher) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] bg-error/10 rounded-lg p-8">
        <AlertTriangle className="h-12 w-12 text-error" />
        <h3 className="mt-4 text-xl font-bold text-error">خطأ في التحميل</h3>
        <p className="mt-2 text-error/80">لم نتمكن من العثور على بيانات المعلم.</p>
      </div>
    );
  }

  const { teacher } = data;
  const { name, phone_number, gender, birth_date, department, teachable_subjects } = teacher;

  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString("ar-EG", { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (error) {
      return "تاريخ غير صالح";
    }
  };

  return (
    <div className="p-8 bg-neutral min-h-screen" dir="rtl">
      <div className="max-w-4xl mx-auto">
        
        {/* زر العودة */}
        <button onClick={() => navigate(-1)} className="mb-6 bg-white text-textMain rounded-lg hover:bg-slate-50 border border-slate-300 flex items-center px-4 py-2 text-sm font-medium transition-colors">
          <ChevronLeft size={20} className="ml-1" /> العودة إلى القائمة
        </button>

        {/* بطاقة المعلم الرئيسية */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-8 flex flex-col sm:flex-row items-center text-center sm:text-right">
          <div className="relative mb-4 sm:mb-0 sm:ml-6">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
              <User size={60} className="text-primary" />
            </div>
            <span className={`absolute bottom-0 right-0 block h-6 w-6 rounded-full border-2 border-white ${gender === 'male' ? 'bg-blue-400' : 'bg-pink-400'}`}></span>
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-textMain">{name}</h2>
            <p className="text-lg text-slate-500 mt-1">قسم {department}</p>
          </div>
        </div>

        {/* شبكة المعلومات */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <InfoSection title="المعلومات الشخصية">
              <InfoRow icon={<User size={16} />} label="الاسم الكامل" value={name} />
              <InfoRow icon={<Phone size={16} />} label="رقم الهاتف" value={phone_number} />
              <InfoRow icon={<VenetianMask size={16} />} label="الجنس" value={gender === "male" ? "ذكر" : "أنثى"} />
              <InfoRow icon={<Calendar size={16} />} label="تاريخ الميلاد" value={formatDate(birth_date)} />
            </InfoSection>
          </div>

          <div className="lg:col-span-1">
            <InfoSection title="المواد الدراسية">
              {teachable_subjects && teachable_subjects.length > 0 ? (
                teachable_subjects.map((item, index) => (
                  <div key={index} className="flex items-center py-2 border-b border-neutral last:border-b-0">
                    <div className="flex items-center text-accent">
                      <Book size={16} />
                      <div className="mr-3">
                        <p className="text-sm font-semibold text-textMain">{item.subject}</p>
                        <p className="text-xs text-slate-400">{item.class_type}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400 text-center py-4">لا توجد مواد مسندة لهذا المعلم.</p>
              )}
            </InfoSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetails;
