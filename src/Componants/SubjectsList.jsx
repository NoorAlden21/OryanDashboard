

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Plus, Search, Edit, Trash2, BookOpen, Loader2, ShieldAlert, AlertTriangle } from 'lucide-react';
import { useGetAllSubjectQuery, useDeleteSubjectMutation } from '../Slice/SubjectSlice'; 

const DeleteConfirmationDialog = ({ isOpen, onClose, onConfirm, isLoading = false, itemName }) => {
  if (!isOpen) return null;
  const confirmationMessage = `هل تريد حقًا حذف المادة "${itemName}"؟ لا يمكن التراجع عن هذا الإجراء.`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 mx-4 text-center" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-center"><div className="h-16 w-16 flex items-center justify-center rounded-full bg-error/10"><ShieldAlert size={40} className="text-error" /></div></div>
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

const SubjectsList = () => {
  const navigate = useNavigate();
  
  const { data: subjectsData, isLoading, isError } = useGetAllSubjectQuery();
  const [deleteSubject, { isLoading: isDeleting }] = useDeleteSubjectMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);

  const handleAddClick = () => navigate('/subjects/add');
  const handleEditClick = (subject) => navigate(`/subjects/edit/${subject.id}`);

  const handleDeleteClick = (subject) => {
    setSubjectToDelete(subject);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!subjectToDelete) return;
    try {
      await deleteSubject(subjectToDelete.id).unwrap();
      toast.success(`تم حذف المادة "${subjectToDelete.name}" بنجاح`);
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف المادة.");
    } finally {
      setIsDialogOpen(false);
      setSubjectToDelete(null);
    }
  };

  const filteredSubjects = subjectsData?.data?.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-[40vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-lg text-slate-500">جاري تحميل المواد...</p>
        </div>
      );
    }
    if (isError) {
      return (
        <div className="flex flex-col items-center justify-center h-[40vh] bg-error/10 rounded-lg p-8">
          <AlertTriangle className="h-12 w-12 text-error" />
          <h3 className="mt-4 text-xl font-bold text-error">حدث خطأ</h3>
          <p className="mt-2 text-error/80">لم نتمكن من تحميل بيانات المواد.</p>
        </div>
      );
    }
    if (filteredSubjects.length === 0) {
      return (
        <div className="p-10 text-center text-slate-500">
          {searchTerm ? "لا توجد نتائج مطابقة لبحثك." : "لا توجد مواد دراسية لعرضها حاليًا."}
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {filteredSubjects.map((subject) => (
         <div 
            key={subject.id} 
            onClick={() => navigate(`/subjects/${subject.id}`)}
            className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer group"
          >
            <div className="p-5 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110">
                <BookOpen size={32} className="text-primary" />
              </div>
              <h3 className="text-lg font-bold text-textMain capitalize">{subject.name}</h3>
            </div>
            <div className="bg-neutral/50 px-4 py-3 border-t border-slate-200 flex justify-center gap-2">
              <button onClick={(e) => { e.stopPropagation(); handleEditClick(subject); }} className="p-2 text-slate-500 hover:text-accent hover:bg-accent/10 rounded-full transition-colors" title="تعديل">
                <Edit size={18} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); handleDeleteClick(subject); }} className="p-2 text-slate-500 hover:text-error hover:bg-error/10 rounded-full transition-colors" title="حذف">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <DeleteConfirmationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        itemName={subjectToDelete?.name}
      />

      <div className="p-8 bg-neutral min-h-screen">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h1 className="text-4xl font-extrabold text-textMain tracking-tight">المواد الدراسية</h1>
                <p className="mt-2 text-lg text-slate-500">إدارة جميع المواد الدراسية في النظام.</p>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    placeholder="ابحث عن مادة..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 pl-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-right"
                  />
                </div>
                <button onClick={handleAddClick} className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-lg flex items-center transition-colors shadow-sm">
                  <Plus size={20} className="mr-2" />
                  إضافة مادة
                </button>
              </div>
            </div>
          </header>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
};

export default SubjectsList;
