
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useGetTeacherByIdQuery, useUpdateTeacherMutation } from '../Slice/TeachersSlice'; 
import { User, Phone, Calendar, VenetianMask, ChevronLeft, Loader2, AlertTriangle } from 'lucide-react';


const FormSection = ({ title, icon, children }) => (
  <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
    <h3 className="text-xl font-bold text-textMain mb-5 flex items-center border-b border-neutral pb-3">
      {React.cloneElement(icon, { className: "text-primary" })}
      <span className="mr-3">{title}</span>
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
      {children}
    </div>
  </section>
);

const FormField = ({ id, name, label, value, onChange, type = "text", placeholder = "", icon, required = true }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">{icon}</span>
      <input
        id={id} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full border border-slate-300 p-3 pl-10 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition duration-200 text-right bg-white"
        required={required}
      />
    </div>
  </div>
);

const FormSelect = ({ id, name, label, value, onChange, children, icon, required = true }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
        <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">{icon}</span>
            <select
                id={id} name={name} value={value} onChange={onChange}
                // استخدام لون التركيز الأساسي
                className="w-full border border-slate-300 p-3 pl-10 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition duration-200 text-right bg-white appearance-none"
                required={required}
            >
                {children}
            </select>
        </div>
    </div>
);


const EditTeacherForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    gender: '',
    birth_date: '',
    department: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: teacherData, isLoading: isLoadingTeacher, isError } = useGetTeacherByIdQuery(id);
  const [updateTeacher] = useUpdateTeacherMutation();

  useEffect(() => {
    if (teacherData?.teacher) {
      const { teacher } = teacherData;
      setFormData({
        name: teacher.name || '',
        phone_number: teacher.phone_number || '',
        gender: teacher.gender || '',
        birth_date: teacher.birth_date ? teacher.birth_date.split('T')[0] : '',
        department: teacher.department || '',
      });
    }
  }, [teacherData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = {
      name: formData.name,
      phone_number: formData.phone_number,
      gender: formData.gender,
      birth_date: formData.birth_date,
    };
    try {
      await updateTeacher({ id, ...payload }).unwrap();
      toast.success('تم تحديث بيانات المعلم بنجاح!');
      navigate('/teachers');
    } catch (error) {
      console.error("Update Error:", error);
      toast.error(error.data?.message || 'حدث خطأ أثناء تحديث المعلم.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingTeacher) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        {/* استخدام اللون الأساسي للتحميل */}
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-slate-500">جاري تحميل بيانات المعلم...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] bg-error/10 rounded-lg p-8">
        {/* استخدام لون الخطأ */}
        <AlertTriangle className="h-12 w-12 text-error" />
        <h3 className="mt-4 text-xl font-bold text-error">خطأ في التحميل</h3>
        <p className="mt-2 text-error/80">لم نتمكن من العثور على بيانات المعلم.</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-neutral min-h-screen">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          {/* استخدام لون النص الرئيسي */}
          <h1 className="text-4xl font-extrabold text-textMain tracking-tight">تعديل بيانات المعلم</h1>
          <p className="mt-2 text-lg text-slate-500">تحديث المعلومات الشخصية للمعلم.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8" dir="rtl">
          <FormSection title="معلومات المعلم" icon={<User size={20} />}>
            <FormField id="name" name="name" label="اسم المعلم" value={formData.name} onChange={handleChange} icon={<User size={16} />} />
            <FormField id="phone_number" name="phone_number" label="رقم الجوال" value={formData.phone_number} onChange={handleChange} icon={<Phone size={16} />} />
            <FormSelect id="gender" name="gender" label="الجنس" value={formData.gender} onChange={handleChange} icon={<VenetianMask size={16} />}>
              <option value="">اختر الجنس</option><option value="male">ذكر</option><option value="female">أنثى</option>
            </FormSelect>
            <FormField id="birth_date" name="birth_date" label="تاريخ الميلاد" type="date" value={formData.birth_date} onChange={handleChange} icon={<Calendar size={16} />} />
          </FormSection>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 bg-white text-textMain rounded-lg hover:bg-slate-50 border border-slate-300 flex items-center transition-colors">
              <ChevronLeft size={20} className="ml-1" /> العودة
            </button>
            {/* استخدام اللون الأساسي لزر الحفظ */}
            <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark flex items-center justify-center disabled:bg-primary/50 shadow-sm transition-colors">
              {isSubmitting ? <Loader2 className="animate-spin mr-2" size={20} /> : 'حفظ التعديلات'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTeacherForm;
