


 

import React, { useState, useEffect, useMemo } from 'react';
import { Search, BookOpen, Trash2, Edit, AlertCircle, CheckCircle, BarChart2, Plus, X, Loader2, ShieldAlert } from 'lucide-react';
import { useGetClassTypeMutation, useAddClassTypeMutation, useDeleteClassTypeMutation } from '../Slice/ClassTypeSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const AddClassTypeDialog = ({ isOpen, onClose, onAddSuccess }) => {
  const [name, setName] = useState('');
  const [addClassType, { isLoading }] = useAddClassTypeMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.warn('يرجى إدخال اسم الصف.');
      return;
    }
    try {
      await addClassType({ name }).unwrap();
      toast.success(`تمت إضافة "${name}" بنجاح!`);
      onAddSuccess();
      handleClose();
    } catch (err) {
      toast.error(err.data?.message || 'حدث خطأ غير متوقع.');
    }
  };

  const handleClose = () => {
    setName('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={handleClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-neutral">
          <h2 className="text-2xl font-bold text-textMain">إضافة نوع صف جديد</h2>
          <button onClick={handleClose} className="p-2 rounded-full text-slate-500 hover:bg-neutral"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="classTypeName" className="block text-sm font-medium text-slate-700 mb-2">اسم الصف <span className="text-error">*</span></label>
            <input id="classTypeName" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: الصف الأول الثانوي" className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={handleClose} className="px-4 py-2 bg-neutral text-textMain rounded-lg hover:bg-slate-200">إلغاء</button>
            <button type="submit" disabled={isLoading} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark flex items-center justify-center disabled:bg-primary/50">
              {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : 'إضافة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


const DeleteConfirmationDialog = ({ isOpen, onClose, onConfirm, isLoading, itemToDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 mx-4 text-center" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-center">
          <div className="h-16 w-16 flex items-center justify-center rounded-full bg-error/10">
            <ShieldAlert size={40} className="text-error" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-textMain mt-4">هل أنت متأكد؟</h3>
        <p className="text-slate-500 mt-2">
          هل تريد حقًا حذف "<strong>{itemToDelete?.name}</strong>"؟ لا يمكن التراجع عن هذا الإجراء.
        </p>
        <div className="flex justify-center gap-4 mt-8">
          <button onClick={onClose} disabled={isLoading} className="px-6 py-2 bg-neutral text-textMain rounded-lg hover:bg-slate-200 disabled:opacity-50">
            إلغاء
          </button>
          <button onClick={onConfirm} disabled={isLoading} className="px-6 py-2 bg-error text-white rounded-lg hover:bg-error/90 flex items-center justify-center disabled:bg-error/50">
            {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : 'نعم، احذف'}
          </button>
        </div>
      </div>
    </div>
  );
};


const StatCard = ({ icon, label, value, colorClass }) => (
  <div className={`flex items-center p-4 bg-white rounded-lg shadow-sm border ${colorClass}`}>
    {icon} 
    <div className="ml-4">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="text-2xl font-bold text-textMain">{value}</p>
    </div>
  </div>
);

const EmptyState = ({ icon, title, message }) => (
  <div className="text-center py-16 px-6 bg-white rounded-xl shadow-sm border border-slate-200">
    <div className="flex justify-center items-center mx-auto w-16 h-16 bg-neutral rounded-full mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-textMain mb-2">{title}</h3>
    <p className="text-slate-500">{message}</p>
  </div>
);


const ClassTypesList = () => {
  const [classTypes, setClassTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [getClassType] = useGetClassTypeMutation();
  const [deleteClassType, { isLoading: isDeleting }] = useDeleteClassTypeMutation();

  const fetchClassTypes = async () => {
    setIsLoading(true);
    try {
      const response = await getClassType().unwrap();
      setClassTypes(response.data || []);
    } catch (error) {
      toast.error('حدث خطأ أثناء جلب أنواع الصفوف.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClassTypes();
  }, []);

  const filteredClassTypes = useMemo(() =>
    classTypes.filter(classType =>
      classType.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [classTypes, searchTerm]);

  const handleAddSuccess = () => {
    fetchClassTypes();
  };

  const handleDeleteClick = (classType) => {
    setItemToDelete(classType);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteClassType(itemToDelete.id).unwrap();
      toast.success(`تم حذف "${itemToDelete.name}" بنجاح.`);
      fetchClassTypes();
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (err) {
      toast.error(err.data?.message || 'فشل حذف العنصر.');
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-[40vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-lg text-slate-500">جاري تحميل البيانات...</p>
        </div>
      );
    }
    if (classTypes.length === 0) {
      return <EmptyState icon={<BookOpen size={32} className="text-primary" />} title="لا توجد أنواع صفوف دراسية" message="ابدأ بإضافة نوع صف جديد." />;
    }
    if (filteredClassTypes.length === 0) {
      return <EmptyState icon={<AlertCircle size={32} className="text-accent" />} title="لا توجد نتائج مطابقة" message="حاول استخدام كلمات بحث مختلفة." />;
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClassTypes.map(classType => (
          <div key={classType.id} className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="p-6 flex-grow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 flex-shrink-0 bg-primary/10 rounded-full flex items-center justify-center">
                  <BookOpen className="text-primary" />
                </div>
                <h3 className="ml-4 text-lg font-bold text-textMain">{classType.name}</h3>
              </div>
              <p className="text-slate-500 text-sm">هذا النوع يمثل مجموعة من الصفوف الدراسية المشتركة في الخصائص.</p>
            </div>
            <div className="bg-neutral/50 px-6 py-4 border-t border-slate-200 flex justify-end space-x-2 space-x-reverse">
              <button onClick={() => handleDeleteClick(classType)} className="p-2 text-slate-500 hover:text-error hover:bg-error/10 rounded-full transition-colors">
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
      <AddClassTypeDialog 
        isOpen={isAddDialogOpen} 
        onClose={() => setIsAddDialogOpen(false)}
        onAddSuccess={handleAddSuccess}
      />
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        itemToDelete={itemToDelete}
      />

      <div className="p-8 bg-neutral min-h-screen">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-extrabold text-textMain tracking-tight">قائمة أنواع الصفوف</h1>
            <p className="mt-2 text-lg text-slate-500">إدارة وتصفح جميع أنواع الصفوف الدراسية المتاحة في النظام.</p>
          </header>

          <div className="mb-8 p-4 bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="relative w-full md:w-1/2 lg:w-1/3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input type="text" placeholder="ابحث بالاسم..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-3 pl-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-right" />
              </div>
              <button onClick={() => setIsAddDialogOpen(true)} className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors">
                <Plus size={20} className="mr-2" />
                إضافة نوع صف جديد
              </button>
            </div>
          </div>
          
          {!isLoading && classTypes.length > 0 && (
              <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <StatCard icon={<BarChart2 size={24} className="text-primary"/>} label="إجمالي الأنواع" value={classTypes.length} colorClass="border-primary/20" />
                  <StatCard icon={<CheckCircle size={24} className="text-success"/>} label="النتائج المعروضة" value={filteredClassTypes.length} colorClass="border-success/20" />
              </div>
          )}

          <main>{renderContent()}</main>
        </div>
      </div>
    </>
  );
};

export default ClassTypesList;
