



 


import React, { useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useGetClassTypeMutation } from "../Slice/classTypeSlice";
import { useCreateClassRoomMutation } from "../Slice/ClassRoomSlice";
import { Plus, BookCopy, Users, Calendar, Hash, X, Loader2, AlertTriangle } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useClassRooms } from "./ClassRoomsContext";


const AddClassroomDialog = ({ isOpen, onClose, onAddSuccess }) => {
  const [formData, setFormData] = useState({
    name: "", class_type_id: "", level: "", year: ""
  });

  const [getClassType, { data: classTypesData }] = useGetClassTypeMutation();
  const [createClassRoom, { isLoading: isCreating }] = useCreateClassRoomMutation();

  useEffect(() => {
    if (isOpen) {
      getClassType();
    }
  }, [isOpen, getClassType]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setFormData({ name: "", class_type_id: "", level: "", year: "" });
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createClassRoom(formData).unwrap();
      toast.success(`تم إنشاء الصف "${formData.name}" بنجاح!`);
      
      const newClassroom = {
        id: response.id || response.data?.id || Date.now(),
        name: formData.name,
        class_type: { 
          id: formData.class_type_id, 
          name: classTypesData?.data?.find(t => t.id == formData.class_type_id)?.name || "نوع الصف" 
        },
        level: formData.level,
        year: formData.year,
        studentsCount: 0
      };
      
      onAddSuccess(newClassroom);
      handleClose();
    } catch (err) {
      toast.error(err.data?.message || "حدث خطأ أثناء إنشاء الصف");
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose} dir="rtl">
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center pb-4 border-b border-neutral">
                  {/* استخدام لون النص الرئيسي */}
                  <Dialog.Title as="h3" className="text-xl font-bold leading-6 text-textMain">إضافة صف دراسي جديد</Dialog.Title>
                  <button type="button" className="p-2 rounded-full text-slate-400 hover:bg-neutral" onClick={handleClose}><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1 text-right">اسم الصف</label>
                      {/* استخدام لون التركيز الأساسي */}
                      <input type="text" id="name" name="name" placeholder="مثال: أ / 1" value={formData.name} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required />
                    </div>
                    <div>
                      <label htmlFor="class_type_id" className="block text-sm font-medium text-slate-700 mb-1 text-right">نوع الصف</label>
                      <select id="class_type_id" name="class_type_id" value={formData.class_type_id} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required>
                        <option value="">اختر نوع الصف</option>
                        {classTypesData?.data?.map((type) => (<option key={type.id} value={type.id}>{type.name}</option>))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="level" className="block text-sm font-medium text-slate-700 mb-1 text-right">المستوى</label>
                      <input type="text" id="level" name="level" placeholder="مثال: المستوى الأول" value={formData.level} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required />
                    </div>
                    <div>
                      <label htmlFor="year" className="block text-sm font-medium text-slate-700 mb-1 text-right">السنة الدراسية</label>
                      <input type="text" id="year" name="year" placeholder="مثال: 2024-2025" value={formData.year} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required />
                    </div>
                  </div>
                  <div className="flex justify-center gap-3 pt-4">
                    <button type="button" onClick={handleClose} className="px-4 py-2 bg-neutral text-textMain rounded-lg hover:bg-slate-200">إلغاء</button>
                    {/* استخدام اللون الأساسي لزر الحفظ */}
                    <button type="submit" disabled={isCreating} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark flex items-center justify-center disabled:bg-primary/50">
                      {isCreating ? <Loader2 className="animate-spin mr-2" size={20} /> : 'حفظ الصف'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const ClassroomDashboard = () => {
  const { classroomsData, isLoading, isSuccess, refetchClassrooms, addNewClassroom } = useClassRooms();
  const navigate = useNavigate();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddSuccess = async (newClassroom) => {
    addNewClassroom(newClassroom);
    try {
      await refetchClassrooms();
    } catch (err) {
      toast.warning("تم إضافة الصف ولكن حدث خطأ في المزامنة الكاملة");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-slate-500">جاري تحميل الصفوف الدراسية...</p>
      </div>
    );
  }

  if (!isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] bg-error/10 rounded-lg p-8">
        <AlertTriangle className="h-12 w-12 text-error" />
        <h3 className="mt-4 text-xl font-bold text-error">حدث خطأ</h3>
        <p className="mt-2 text-error/80">لم نتمكن من تحميل بيانات الصفوف.</p>
      </div>
    );
  }

  return (
    <>
      <AddClassroomDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAddSuccess={handleAddSuccess}
      />
      <div className="p-8 bg-neutral min-h-screen">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h1 className="text-4xl font-extrabold text-textMain tracking-tight">الصفوف الدراسية</h1>
                <p className="mt-2 text-lg text-slate-500">إدارة وتعيين المعلمين لجميع الصفوف المتاحة.</p>
              </div>
              <button onClick={() => setIsAddDialogOpen(true)} className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors shadow-sm">
                <Plus size={20} className="mr-2" />
                إضافة صف دراسي
              </button>
            </div>
          </header>

          <main className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {classroomsData.map((classroom) => (
              <div
                key={classroom.id}
                onClick={() => navigate(`assign-teachers/${classroom.id}`)}
                className="group bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
              >
                <div className="p-6 flex-grow">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 flex-shrink-0 bg-primary/10 rounded-full flex items-center justify-center">
                      <BookCopy className="text-primary" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-bold text-textMain group-hover:text-primary transition-colors">{classroom.name}</h3>
                      <p className="text-sm text-slate-500">
                        {classroom.class_type ? classroom.class_type.name : 'نوع غير محدد'}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm mt-4 pt-4 border-t border-neutral">
                    <div className="flex items-center text-slate-600"><Hash size={14} className="mr-2 text-slate-400" /><span>المستوى:</span><span className="mr-auto font-medium text-textMain">{classroom.level}</span></div>
                    <div className="flex items-center text-slate-600"><Calendar size={14} className="mr-2 text-slate-400" /><span>السنة الدراسية:</span><span className="mr-auto font-medium text-textMain">{classroom.year}</span></div>
                    <div className="flex items-center text-slate-600"><Users size={14} className="mr-2 text-slate-400" /><span>عدد الطلاب:</span><span className="mr-auto font-medium text-textMain">{classroom.studentsCount ?? 0}</span></div>
                  </div>
                </div>
                <div className="bg-primary/5 px-6 py-3 border-t border-neutral text-center text-primary font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  تعيين المعلمين
                </div>
              </div>
            ))}
          </main>
        </div>
      </div>
    </>
  );
};

export default ClassroomDashboard;
