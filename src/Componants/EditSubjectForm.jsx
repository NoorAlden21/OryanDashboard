


import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useUpdateSubjectMutation, useGetSubjectByIdQuery } from '../Slice/SubjectSlice';
import { useGetClassTypeMutation } from '../Slice/ClassTypeSlice';
import { Book, GraduationCap, ChevronLeft, Loader2, AlertTriangle } from 'lucide-react';

const EditSubjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [selectedClassTypeIds, setSelectedClassTypeIds] = useState([]);

  const [classTypes, setClassTypes] = useState([]);
  const [isLoadingClassTypes, setIsLoadingClassTypes] = useState(false);

  const { data: subjectData, isLoading: isLoadingSubject, isError } = useGetSubjectByIdQuery(id);
  const [updateSubject, { isLoading: isSubmitting }] = useUpdateSubjectMutation();
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

  useEffect(() => {
    if (subjectData?.data) {
      const { data } = subjectData;
      setName(data.name || '');
      setSelectedClassTypeIds(data.class_types?.map(ct => ct.id) || []);
    }
  }, [subjectData]);

  const handleCheckboxChange = (e) => {
    const classTypeId = parseInt(e.target.value);
    const isChecked = e.target.checked;
    setSelectedClassTypeIds(prev => isChecked ? [...prev, classTypeId] : prev.filter(id => id !== classTypeId));
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
      await updateSubject({ id: Number(id), ...payload }).unwrap();
      toast.success(`تم تحديث المادة "${name}" بنجاح.`);
      navigate('/subjects');
    } catch (error) {
      toast.error(error.data?.message || "حدث خطأ أثناء تحديث المادة.");
      console.error("Update subject error:", error);
    }
  };

  return (
    <div className="p-8 bg-neutral min-h-screen">
      {(() => {
        if (isLoadingSubject) {
          return (
            <div className="flex flex-col items-center justify-center h-[80vh]">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-lg text-slate-500">جاري تحميل بيانات المادة...</p>
            </div>
          );
        }

        if (isError) {
          return (
            <div className="flex flex-col items-center justify-center h-[80vh] bg-error/10 rounded-lg p-8">
              <AlertTriangle className="h-12 w-12 text-error" />
              <h3 className="mt-4 text-xl font-bold text-error">خطأ في التحميل</h3>
              <p className="mt-2 text-error/80">لم نتمكن من العثور على بيانات المادة.</p>
            </div>
          );
        }

        return (
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white shadow-xl rounded-xl space-y-8 border border-slate-200" dir="rtl">
            <header className="text-center">
              <h1 className="text-4xl font-extrabold text-textMain tracking-tight">تعديل المادة الدراسية</h1>
              <p className="mt-2 text-lg text-slate-500">حدّث اسم المادة والصفوف المرتبطة بها.</p>
            </header>

            <section>
              <label htmlFor="name" className="block text-sm font-medium text-slate-600 mb-1">اسم المادة</label>
              <div className="relative">
                <Book className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  id="name" name="name" type="text" value={name}
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
                        type="checkbox" id={`class-type-${classType.id}`} value={classType.id}
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

            <div className="flex justify-end gap-4 pt-4">
              <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 bg-white text-textMain rounded-lg hover:bg-slate-50 border border-slate-300 flex items-center transition-colors">
                <ChevronLeft size={20} className="ml-1" /> العودة
              </button>
              <button type="submit" disabled={isSubmitting || !name.trim()} className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark flex items-center justify-center disabled:bg-primary/50 shadow-sm transition-colors">
                {isSubmitting ? <Loader2 className="animate-spin mr-2" size={20} /> : 'حفظ التعديلات'}
              </button>
            </div>
          </form>
        );
      })()}
    </div>
  );
};

export default EditSubjectForm;
