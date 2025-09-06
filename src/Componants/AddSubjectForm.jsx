

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAddSubjectMutation } from '../Slice/SubjectSlice';
import { useGetClassTypeMutation } from '../Slice/ClassTypeSlice'; 
import { Book, GraduationCap, ChevronLeft, Loader2 } from 'lucide-react';

const AddSubjectForm = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [selectedClassTypeIds, setSelectedClassTypeIds] = useState([]);

  const [classTypes, setClassTypes] = useState([]);
  const [isLoadingClassTypes, setIsLoadingClassTypes] = useState(false);

  const [addSubject, { isLoading: isSubmitting }] = useAddSubjectMutation();
  const [getClassType] = useGetClassTypeMutation();

  useEffect(() => {
    const fetchClassTypes = async () => {
      setIsLoadingClassTypes(true);
      try {
        const response = await getClassType().unwrap();
        setClassTypes(response.data || []);
      } catch (error) {
        toast.error("فشل في جلب قائمة الصفوف الدراسية.");
      } finally {
        setIsLoadingClassTypes(false);
      }
    };
    fetchClassTypes();
  }, [getClassType]);

  const handleCheckboxChange = (e) => {
    const classTypeId = parseInt(e.target.value);
    const isChecked = e.target.checked;

    if (isChecked) {
      setSelectedClassTypeIds(prev => [...prev, classTypeId]);
    } else {
      setSelectedClassTypeIds(prev => prev.filter(id => id !== classTypeId));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("يرجى إدخال اسم المادة.");
      return;
    }

    const payload = {
      name: name.trim(),
      class_type_ids: selectedClassTypeIds,
    };

    try {
      await addSubject(payload).unwrap();
      toast.success(`تمت إضافة المادة "${name}" بنجاح.`);
      navigate('/subjects');
    } catch (error) {
      toast.error(error.data?.message || "حدث خطأ أثناء إضافة المادة.");
      console.error("Add subject error:", error);
    }
  };

  return (
    <div className="p-8 bg-neutral min-h-screen">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white shadow-xl rounded-xl space-y-8 border border-slate-200" dir="rtl">
        <header className="text-center">
          <h1 className="text-4xl font-extrabold text-textMain tracking-tight">إضافة مادة جديدة</h1>
          <p className="mt-2 text-lg text-slate-500">أدخل اسم المادة وحدد الصفوف التي تُدرّس فيها.</p>
        </header>

        <section>
          <label htmlFor="name" className="block text-sm font-medium text-slate-600 mb-1">اسم المادة</label>
          <div className="relative">
            <Book className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: الرياضيات، الفيزياء..."
              className="w-full border border-slate-300 p-3 pl-10 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition duration-200 text-right bg-white"
              required
            />
          </div>
        </section>

        <section className="bg-neutral/50 p-5 rounded-lg border border-slate-200">
          <h3 className="text-xl font-bold text-textMain mb-4 flex items-center">
            <GraduationCap className="text-primary ml-2" />
            الصفوف الدراسية (اختياري)
          </h3>
          {isLoadingClassTypes ? (
            <div className="text-center py-5 text-slate-500 flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
              جاري تحميل الصفوف...
            </div>
          ) : classTypes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {classTypes.map((classType) => (
                <div key={classType.id} className="flex items-center bg-white p-3 rounded-md border border-slate-200 hover:bg-primary/5 transition">
                  <input
                    type="checkbox"
                    id={`class-type-${classType.id}`}
                    value={classType.id}
                    checked={selectedClassTypeIds.includes(classType.id)}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded ml-2 cursor-pointer"
                  />
                  <label htmlFor={`class-type-${classType.id}`} className="text-textMain cursor-pointer text-sm font-medium">
                    {classType.name}
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-5 text-slate-500">لا توجد صفوف دراسية متاحة لإضافتها.</p>
          )}
        </section>

        {/* أزرار الإجراءات */}
        <div className="flex justify-end gap-4 pt-4">
          <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 bg-white text-textMain rounded-lg hover:bg-slate-50 border border-slate-300 flex items-center transition-colors">
            <ChevronLeft size={20} className="ml-1" /> العودة
          </button>
          <button type="submit" disabled={isSubmitting || !name.trim()} className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark flex items-center justify-center disabled:bg-primary/50 shadow-sm transition-colors">
            {isSubmitting ? <Loader2 className="animate-spin mr-2" size={20} /> : 'إضافة المادة'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSubjectForm;
