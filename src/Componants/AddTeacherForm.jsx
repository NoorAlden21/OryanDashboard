 

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAddTeachersMutation } from '../Slice/TeachersSlice'; 
import { useGetClassTypeSubjectMutation } from '../Slice/ClassTypeSubjectSlice';  
import { User, Phone, Lock, Calendar, VenetianMask, Book, ChevronLeft, Loader2, GraduationCap } from 'lucide-react';


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
                className="w-full border border-slate-300 p-3 pl-10 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition duration-200 text-right bg-white appearance-none"
                required={required}
            >
                {children}
            </select>
        </div>
    </div>
);

const AddTeacherForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '', phone_number: '', password: '', password_confirmation: '',
    gender: '', birth_date: '', department: '', class_type_subjects: [],
  });

  const [groupedSubjects, setGroupedSubjects] = useState({});
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [addTeachers] = useAddTeachersMutation();
  const [getClassTypeSubject] = useGetClassTypeSubjectMutation();

  const departmentOptions = [
    'arabic', 'english', 'math', 'physics', 'chemistry', 'biology', 
    'french', 'history', 'geography', 'philosophy', 'religion'
  ];

  useEffect(() => {
    setIsLoadingSubjects(true);
    getClassTypeSubject().unwrap()
      .then(response => setGroupedSubjects(response.groups || {}))
      .catch(() => toast.error("فشل في جلب المواد الدراسية."))
      .finally(() => setIsLoadingSubjects(false));
  }, [getClassTypeSubject]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (e) => {
    const subjectId = parseInt(e.target.value);
    setFormData((prev) => {
      const newSubjects = e.target.checked
        ? [...prev.class_type_subjects, subjectId]
        : prev.class_type_subjects.filter((id) => id !== subjectId);
      return { ...prev, class_type_subjects: newSubjects };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
      toast.error('كلمة السر غير متطابقة.');
      return;
    }
    setIsSubmitting(true);
    try {
      await addTeachers(formData).unwrap();
      toast.success('تم إضافة المعلم بنجاح!');
      navigate('/teachers');
    } catch (error) {
      toast.error(error.data?.message || 'حدث خطأ أثناء إضافة المعلم.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 bg-neutral min-h-screen">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-textMain tracking-tight">إضافة معلم جديد</h1>
          <p className="mt-2 text-lg text-slate-500">أدخل بيانات المعلم والمواد التي يدرسها لإضافته إلى النظام.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8" dir="rtl">
          <FormSection title="المعلومات الشخصية" icon={<User size={20} />}>
            <FormField id="name" name="name" label="اسم المعلم" value={formData.name} onChange={handleChange} icon={<User size={16} />} />
            <FormField id="phone_number" name="phone_number" label="رقم الجوال" value={formData.phone_number} onChange={handleChange} icon={<Phone size={16} />} />
            <FormField id="password" name="password" label="كلمة المرور" type="password" value={formData.password} onChange={handleChange} icon={<Lock size={16} />} />
            <FormField id="password_confirmation" name="password_confirmation" label="تأكيد كلمة المرور" type="password" value={formData.password_confirmation} onChange={handleChange} icon={<Lock size={16} />} />
            <FormSelect id="gender" name="gender" label="الجنس" value={formData.gender} onChange={handleChange} icon={<VenetianMask size={16} />}>
              <option value="">اختر الجنس</option><option value="male">ذكر</option><option value="female">أنثى</option>
            </FormSelect>
            <FormField id="birth_date" name="birth_date" label="تاريخ الميلاد" type="date" value={formData.birth_date} onChange={handleChange} icon={<Calendar size={16} />} />
            
            <div className="md:col-span-2">
              <FormSelect id="department" name="department" label="القسم" value={formData.department} onChange={handleChange} icon={<GraduationCap size={16} />}>
                <option value="">اختر القسم</option>
                {departmentOptions.map(option => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </FormSelect>
            </div>
          </FormSection>

          <FormSection title="المواد الدراسية" icon={<Book size={20} />}>
            {isLoadingSubjects ? (
              <div className="md:col-span-2 text-center py-5 text-slate-500 flex items-center justify-center">
                {/* استخدام اللون الأساسي للتحميل */}
                <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
                جاري تحميل المواد الدراسية...
              </div>
            ) : Object.keys(groupedSubjects).length > 0 ? (
              Object.entries(groupedSubjects).map(([grade, subjects]) => (
                <div key={grade} className="md:col-span-2 mb-2 last:mb-0">
                  <h4 className="text-md font-semibold text-textMain mb-3">{grade}</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {subjects.map((subject) => (
                      <label key={subject.classtypesubject_id} htmlFor={`subject-${subject.classtypesubject_id}`} className="flex items-center space-x-2 space-x-reverse cursor-pointer p-2 rounded-md hover:bg-neutral transition-colors">
                        <input type="checkbox" id={`subject-${subject.classtypesubject_id}`} value={subject.classtypesubject_id} checked={formData.class_type_subjects.includes(subject.classtypesubject_id)} onChange={handleSubjectChange} className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded" />
                        <span className="text-textMain text-sm pr-2">{subject.subject_name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="md:col-span-2 text-center py-5 text-slate-500">لا توجد مواد دراسية متاحة.</p>
            )}
          </FormSection>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 bg-white text-textMain rounded-lg hover:bg-slate-50 border border-slate-300 flex items-center transition-colors">
              <ChevronLeft size={20} className="ml-1" /> العودة
            </button>
            <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark flex items-center justify-center disabled:bg-primary/50 shadow-sm transition-colors">
              {isSubmitting ? <Loader2 className="animate-spin mr-2" size={20} /> : 'إضافة المعلم'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTeacherForm;
