 

            
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useStudents } from './StudentsState'; 
import { useDeleteStudentMutation } from '../Slice/StudentsSlice';
import { Plus, Search, Eye, Edit, Trash2, Loader2, ShieldAlert } from 'lucide-react';
import { addStudentRoute } from '../data/data';

const DeleteConfirmationDialog = ({ isOpen, onClose, onConfirm, isLoading = false, itemName }) => {
  if (!isOpen) return null;
  const confirmationMessage = `هل تريد حقًا حذف الطالب "${itemName}"؟ لا يمكن التراجع عن هذا الإجراء.`;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 mx-4 text-center" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-center"><div className="h-16 w-16 flex items-center justify-center rounded-full bg-red-100"><ShieldAlert size={40} className="text-red-600" /></div></div>
        <h3 className="text-2xl font-bold text-slate-800 mt-4">هل أنت متأكد؟</h3>
        <p className="text-slate-500 mt-2 px-4">{confirmationMessage}</p>
        <div className="flex justify-center gap-4 mt-8">
          <button onClick={onClose} disabled={isLoading} className="px-6 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 disabled:opacity-50">إلغاء</button>
          <button onClick={onConfirm} disabled={isLoading} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center disabled:bg-red-400">
            {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : 'نعم، احذف'}
          </button>
        </div>
      </div>
    </div>
  );
};

function StudentsList() { 
  const navigate = useNavigate();
  
  const { studentsData, isLoading } = useStudents();
  const [deleteStudent, { isLoading: isDeleting }] = useDeleteStudentMutation();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const handleAddClick = () => {
    navigate(addStudentRoute);
  };

  const handleEditClick = (id) => {
    navigate(`/student/edit/${id}`);
  };

  const handleShowClick = (id) => {
    navigate(`/student/${id}`);
  };

  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;
    try {
      await deleteStudent(studentToDelete.id).unwrap();
      toast.success(`تم حذف الطالب "${studentToDelete.name}" بنجاح`);
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف الطالب.");
    } finally {
      setIsDialogOpen(false);
      setStudentToDelete(null);
    }
  };

  const filteredStudents = studentsData?.students?.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.phone_number.includes(searchTerm)
  ) || [];

  const renderTableContent = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan="5" className="p-10 text-center text-slate-500">
            <div className="flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-600 mr-3" />
              جاري تحميل البيانات...
            </div>
          </td>
        </tr>
      );
    }
    if (filteredStudents.length === 0) {
      return (
        <tr>
          <td colSpan="5" className="p-10 text-center text-slate-500">
            {searchTerm ? "لا توجد نتائج مطابقة لبحثك." : "لا يوجد طلاب لعرضهم حاليًا."}
          </td>
        </tr>
      );
    }
    return filteredStudents.map((student) => (
      <tr key={student.id} className="hover:bg-slate-50 border-b border-slate-200 last:border-b-0">
        <td className="p-4 text-slate-800 font-medium">{student.name}</td>
        <td className="p-4 text-slate-600">{student.phone_number}</td>
        <td className="p-4 text-slate-600">{student.level}</td>
        <td className="p-4 text-slate-600">{student.enrollmentYear}</td>
        <td className="p-4">
          <div className="flex items-center gap-2">
            <button onClick={() => handleShowClick(student.id)} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-100 rounded-full transition-colors" title="عرض التفاصيل">
              <Eye size={18} />
            </button>
            <button onClick={() => handleEditClick(student.id)} className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-100 rounded-full transition-colors" title="تعديل">
              <Edit size={18} />
            </button>
            <button onClick={() => handleDeleteClick(student)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors" title="حذف">
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
        itemName={studentToDelete?.name}
      />

      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">قائمة الطلاب</h1>
              <p className="mt-2 text-lg text-slate-500">عرض وإدارة جميع الطلاب في النظام.</p>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="ابحث بالاسم أو رقم الجوال..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 pl-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-right"
                />
              </div>
              <button onClick={handleAddClick} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg flex items-center transition-colors shadow-sm">
                <Plus size={20} className="mr-2" />
                إضافة طالب
              </button>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
          <table className="min-w-full border-collapse text-right">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 text-sm font-semibold text-slate-600">الاسم</th>
                <th className="p-4 text-sm font-semibold text-slate-600">رقم الجوال</th>
                <th className="p-4 text-sm font-semibold text-slate-600">المستوى</th>
                <th className="p-4 text-sm font-semibold text-slate-600">سنة التسجيل</th>
                <th className="p-4 text-sm font-semibold text-slate-600">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {renderTableContent()}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default StudentsList;

