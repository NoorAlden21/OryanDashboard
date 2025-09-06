

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Calendar, VenetianMask, GraduationCap, Hash, Users, UserSquare, ChevronLeft } from 'lucide-react';

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center py-3 border-b border-slate-100 last:border-b-0">
    <div className="flex items-center text-slate-500 w-1/3">
      {icon}
      <span className="mr-2 text-sm font-medium">{label}</span>
    </div>
    <div className="text-slate-800 font-semibold text-sm w-2/3 text-right">
      {value || <span className="text-slate-400 italic">غير محدد</span>}
    </div>
  </div>
);

const InfoSection = ({ title, children }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
    <h3 className="text-lg font-bold text-slate-800 mb-3 pb-2 border-b border-slate-200">{title}</h3>
    <div className="space-y-1">
      {children}
    </div>
  </div>
);

const StudentDetailsCard = ({ student }) => {
  const navigate = useNavigate();

  if (!student) {
    return null; 
  }

  const { name, phone_number, gender, birthDate, profile } = student;

  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ar-EG", { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (error) {
      return "تاريخ غير صالح";
    }
  };

  const getClassroomName = () => {
    return profile?.classroom?.name || null;
  };

  return (
    <div dir="rtl">
      <button onClick={() => navigate(-1)} className="mb-6 bg-white text-slate-700 rounded-lg hover:bg-slate-50 border border-slate-300 flex items-center px-4 py-2 text-sm font-medium">
        <ChevronLeft size={20} className="ml-1" /> العودة إلى القائمة
      </button>

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-8 flex flex-col sm:flex-row items-center text-center sm:text-right">
        <div className="relative mb-4 sm:mb-0 sm:ml-6">
          <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center">
            <User size={60} className="text-indigo-500" />
          </div>
          <span className={`absolute bottom-0 right-0 block h-6 w-6 rounded-full border-2 border-white ${gender === 'male' ? 'bg-blue-400' : 'bg-pink-400'}`}></span>
        </div>
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">{name}</h2>
          <p className="text-lg text-slate-500 mt-1">
            {profile?.level ? `المستوى ${profile.level}` : 'المستوى غير محدد'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <InfoSection title="المعلومات الشخصية">
            <InfoRow icon={<User size={16} />} label="الاسم الكامل" value={name} />
            <InfoRow icon={<Phone size={16} />} label="رقم الهاتف" value={phone_number} />
            <InfoRow icon={<VenetianMask size={16} />} label="الجنس" value={gender === "male" ? "ذكر" : "أنثى"} />
            <InfoRow icon={<Calendar size={16} />} label="تاريخ الميلاد" value={formatDate(birthDate)} />
          </InfoSection>

          <InfoSection title="المعلومات الأكاديمية">
            <InfoRow icon={<GraduationCap size={16} />} label="المستوى" value={profile?.level} />
            <InfoRow icon={<Hash size={16} />} label="الفصل الدراسي" value={getClassroomName()} />
            <InfoRow icon={<Calendar size={16} />} label="سنة التسجيل" value={profile?.enrollmentYear} />
          </InfoSection>
        </div>

        <div className="lg:col-span-1">
          <InfoSection title="معلومات ولي الأمر">
            <InfoRow icon={<UserSquare size={16} />} label="الاسم" value={profile?.parent?.name} />
            <InfoRow icon={<Phone size={16} />} label="رقم الهاتف" value={profile?.parent?.phone_number} />
          </InfoSection>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsCard;
