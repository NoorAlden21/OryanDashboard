

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUpdateStudentMutation, useGetStudentByIdQuery } from '../Slice/StudentsSlice';
import { useGetAllClassRoomMutation } from '../Slice/ClassRoomSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { User, GraduationCap, Phone, Calendar, Users, ChevronLeft, Loader2, AlertTriangle, Briefcase } from 'lucide-react';

const FormSection = ({ title, icon, children }) => (
  <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
    <h3 className="text-xl font-bold text-slate-800 mb-5 flex items-center border-b border-slate-200 pb-3">
      {icon}
      <span className="mr-3">{title}</span>
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
      {children}
    </div>
  </section>
);

const FormField = ({ id, name, label, value, onChange, type = "text", placeholder = "", icon, required = false, disabled = false }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">{icon}</span>
      <input
        id={id} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full border border-slate-300 p-3 pl-10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-right bg-white disabled:bg-slate-50 disabled:cursor-not-allowed"
        required={required} disabled={disabled}
      />
    </div>
  </div>
);

const FormSelect = ({ id, name, label, value, onChange, children, icon, required = false }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
        <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">{icon}</span>
            <select
                id={id} name={name} value={value} onChange={onChange}
                className="w-full border border-slate-300 p-3 pl-10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-right bg-white appearance-none"
                required={required}
            >
                {children}
            </select>
        </div>
    </div>
);


const EditStudentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    parent_name: '', parent_phone_number: '', name: '', phone_number: '',
    gender: '', birth_date: '', level: '', enrollment_year: '', classroom_id: null,
  });

  const [classrooms, setClassrooms] = useState([]);
  const [filteredClassrooms, setFilteredClassrooms] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [updateStudent] = useUpdateStudentMutation();
  const [getAllClassRoom, { isLoading: isLoadingClassrooms }] = useGetAllClassRoomMutation();
  const { data: studentData, isLoading: isLoadingStudent, isError } = useGetStudentByIdQuery(id);

  useEffect(() => {
    getAllClassRoom().unwrap().then(response => setClassrooms(response.classrooms || [])).catch(() => toast.error("فشل جلب الصفوف الدراسية"));
  }, [getAllClassRoom]);

  useEffect(() => {
    if (studentData?.student) {
      const { student } = studentData;
      const profile = student.profile || {};
      const parent = student.profile.parent || {};
      
      setFormData({
        parent_name: parent.name || '',
        parent_phone_number: parent.phone_number || '',
        name: student.name || '', 
        phone_number: student.phone_number || '',
        gender: student.gender || '', 
        birth_date: student.birthDate ? student.birthDate.split('T')[0] : '', 
        level: profile.level || '', 
        enrollment_year: profile.enrollmentYear || '', 
        classroom_id: profile.classroom ? profile.classroom.id : null,
      });
    }
  }, [studentData]);

  useEffect(() => {
    if (formData.level) {
      setFilteredClassrooms(classrooms.filter(c => c.level === formData.level));
    } else {
      setFilteredClassrooms([]);
    }
  }, [formData.level, classrooms]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value === 'null' ? null : value };
    if (name === 'level') {
      newFormData.classroom_id = null;
    }
    setFormData(newFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateStudent({ id, ...formData }).unwrap();
      toast.success('تم تحديث بيانات الطالب بنجاح!');
      navigate('/student');
    } catch (error) {
      toast.error(error.data?.message || 'حدث خطأ أثناء تحديث الطالب.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingStudent) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
        <p className="mt-4 text-lg text-slate-500">جاري تحميل بيانات الطالب...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] bg-red-50/50 rounded-lg p-8">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <h3 className="mt-4 text-xl font-bold text-red-700">خطأ في التحميل</h3>
        <p className="mt-2 text-red-600">لم نتمكن من العثور على بيانات الطالب.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">تعديل بيانات الطالب</h1>
        <p className="mt-2 text-lg text-slate-500">تحديث معلومات الطالب الأكاديمية والشخصية.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8" dir="rtl">
        <FormSection title="معلومات ولي الأمر" icon={<Briefcase size={20} className="text-indigo-600" />}>
          <FormField id="parent_name" name="parent_name" label="اسم ولي الأمر" value={formData.parent_name} onChange={handleChange} icon={<User size={16} />} required={false} />
          <FormField id="parent_phone_number" name="parent_phone_number" label="رقم جوال ولي الأمر" value={formData.parent_phone_number} onChange={handleChange} icon={<Phone size={16} />} required={false} />
        </FormSection>

        <FormSection title="معلومات الطالب" icon={<GraduationCap size={20} className="text-indigo-600" />}>
          <FormField id="name" name="name" label="اسم الطالب" value={formData.name} onChange={handleChange} icon={<User size={16} />} required />
          <FormField id="phone_number" name="phone_number" label="رقم جوال الطالب" value={formData.phone_number} onChange={handleChange} icon={<Phone size={16} />} required />
          <FormSelect id="gender" name="gender" label="الجنس" value={formData.gender} onChange={handleChange} icon={<Users size={16} />} required>
            <option value="">اختر الجنس</option><option value="male">ذكر</option><option value="female">أنثى</option>
          </FormSelect>
          <FormField id="birth_date" name="birth_date" label="تاريخ الميلاد" type="date" value={formData.birth_date} onChange={handleChange} icon={<Calendar size={16} />} required />
          <FormField id="level" name="level" label="المستوى الدراسي" value={formData.level} onChange={handleChange} icon={<GraduationCap size={16} />} required />
          <FormField id="enrollment_year" name="enrollment_year" label="سنة التسجيل" value={formData.enrollment_year} onChange={handleChange} icon={<Calendar size={16} />} required />
          <div className="md:col-span-2">
            <label htmlFor="classroom_id" className="block text-sm font-medium text-slate-600 mb-1">الصف الدراسي (اختياري)</label>
            {isLoadingClassrooms ? (
              <div className="text-center py-3 text-slate-500 bg-slate-100 rounded-lg">جاري تحميل الصفوف...</div>
            ) : formData.level ? (
              filteredClassrooms.length > 0 ? (
                <FormSelect id="classroom_id" name="classroom_id" value={formData.classroom_id || ''} onChange={handleChange} icon={<Users size={16} />} required={false}>
                  <option value="">اختر الصف الدراسي</option>
                  {filteredClassrooms.map(c => <option key={c.id} value={c.id}>{c.name} - {c.year}</option>)}
                </FormSelect>
              ) : (
                <div className="text-center py-3 text-amber-700 bg-amber-50 rounded-lg border border-amber-200">لا توجد صفوف متاحة للمستوى المحدد.</div>
              )
            ) : (
              <div className="text-center py-3 text-slate-500 bg-slate-100 rounded-lg">أدخل المستوى الدراسي لعرض الصفوف.</div>
            )}
          </div>
        </FormSection>

        <div className="flex justify-end gap-4 pt-4">
          <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 bg-white text-slate-700 rounded-lg hover:bg-slate-50 border border-slate-300 flex items-center">
            <ChevronLeft size={20} className="ml-1" /> العودة
          </button>
          <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center disabled:bg-indigo-300 shadow-sm">
            {isSubmitting ? <Loader2 className="animate-spin mr-2" size={20} /> : 'حفظ التعديلات'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditStudentForm;
