


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useTeachers } from './TeachersState';
import { useDeleteTeacherMutation } from '../Slice/TeachersSlice';
import { Plus, Search, Eye, Edit, Trash2, Loader2, ShieldAlert, UserCheck } from 'lucide-react';
import { addTeachersRoute } from '../data/data';

const DeleteConfirmationDialog = ({ isOpen, onClose, onConfirm, isLoading = false, itemName }) => {
  if (!isOpen) return null;
  const confirmationMessage = `هل تريد حقًا حذف المعلم "${itemName}"؟ لا يمكن التراجع عن هذا الإجراء.`;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 mx-4 text-center" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-center">
          <div className="h-16 w-16 flex items-center justify-center rounded-full bg-error/10">
            <ShieldAlert size={40} className="text-error" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-textMain mt-4">هل أنت متأكد؟</h3>
        <p className="text-slate-500 mt-2 px-4">{confirmationMessage}</p>
        <div className="flex justify-center gap-4 mt-8">
          <button onClick={onClose} disabled={isLoading} className="px-6 py-2 bg-neutral text-textMain rounded-lg hover:bg-slate-200 disabled:opacity-50">إلغاء</button>
          <button onClick={onConfirm} disabled={isLoading} className="px-6 py-2 bg-error text-white rounded-lg hover:bg-error/90 flex items-center justify-center disabled:bg-error/50">
            {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : 'نعم، احذف'}
          </button>
        </div>
      </div>
    </div>
  );
};

function Home() {
  const navigate = useNavigate();
  
  const { teachersData, isLoading } = useTeachers();
  const [deleteTeacher, { isLoading: isDeleting }] = useDeleteTeacherMutation();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);

  const handleAddClick = () => navigate(addTeachersRoute);
  const handleEditClick = (id) => navigate(`/teachers/edit/${id}`);
  const handleShowClick = (id) => navigate(`/teachers/${id}`);

  const handleDeleteClick = (teacher) => {
    setTeacherToDelete(teacher);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!teacherToDelete) return;
    try {
      await deleteTeacher(teacherToDelete.id).unwrap();
      toast.success(`تم حذف المعلم "${teacherToDelete.name}" بنجاح`);
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف المعلم.");
    } finally {
      setIsDialogOpen(false);
      setTeacherToDelete(null);
    }
  };

  const filteredTeachers = teachersData?.teachers?.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.phone_number.includes(searchTerm)
  ) || [];

  const renderTableContent = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan="4" className="p-10 text-center text-slate-500">
            <div className="flex items-center justify-center">
              {/* استخدام لون التحميل الأساسي */}
              <Loader2 className="h-6 w-6 animate-spin text-primary mr-3" />
              جاري تحميل البيانات...
            </div>
          </td>
        </tr>
      );
    }
    if (filteredTeachers.length === 0) {
      return (
        <tr>
          <td colSpan="4" className="p-10 text-center text-slate-500">
            {searchTerm ? "لا توجد نتائج مطابقة لبحثك." : "لا يوجد معلمون لعرضهم حاليًا."}
          </td>
        </tr>
      );
    }
    return filteredTeachers.map((teacher) => (
      <tr key={teacher.id} className="hover:bg-neutral/50 border-b border-slate-200 last:border-b-0">
        <td className="p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-neutral rounded-full flex items-center justify-center mr-3 border-2 border-primary/20">
              {/* استخدام اللون الأساسي للأيقونة */}
              <UserCheck size={20} className="text-primary" />
            </div>
            {/* استخدام لون النص الرئيسي */}
            <span className="text-textMain pr-2 font-medium">{teacher.name}</span>
          </div>
        </td>
        <td className="p-4 text-slate-600">{teacher.phone_number}</td>
        <td className="p-4">
          <div className="flex items-center gap-2">
            <button onClick={() => handleShowClick(teacher.id)} className="p-2 text-slate-500 hover:text-primary hover:bg-primary/10 rounded-full transition-colors" title="عرض التفاصيل">
              <Eye size={18} />
            </button>
            <button onClick={() => handleEditClick(teacher.id)} className="p-2 text-slate-500 hover:text-accent hover:bg-accent/10 rounded-full transition-colors" title="تعديل">
              <Edit size={18} />
            </button>
            <button onClick={() => handleDeleteClick(teacher)} className="p-2 text-slate-500 hover:text-error hover:bg-error/10 rounded-full transition-colors" title="حذف">
              <Trash2 size={18} />
            </button>
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <>
      <DeleteConfirmationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        itemName={teacherToDelete?.name}
      />

      <div className="p-8 bg-neutral min-h-screen">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h1 className="text-4xl font-extrabold text-textMain tracking-tight">قائمة المعلمين</h1>
                <p className="mt-2 text-lg text-slate-500">عرض وإدارة جميع المعلمين في النظام.</p>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    placeholder="ابحث بالاسم أو رقم الجوال..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 pl-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-right"
                  />
                </div>
                <button onClick={handleAddClick} className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-lg flex items-center transition-colors shadow-sm">
                  <Plus size={20} className="mr-2" />
                  إضافة معلم
                </button>
              </div>
            </div>
          </header>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
            <table className="min-w-full border-collapse text-right">
              <thead>
                <tr className="bg-neutral/60 border-b border-slate-200">
                  <th className="p-4 text-sm font-semibold text-textMain">الاسم</th>
                  <th className="p-4 text-sm font-semibold text-textMain">رقم الجوال</th>
                  <th className="p-4 text-sm font-semibold text-textMain">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {renderTableContent()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
