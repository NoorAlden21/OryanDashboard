import React from 'react';
import { ShieldAlert, Loader2 } from 'lucide-react';

/**
 * مكون مجرد وقابل لإعادة الاستخدام لعرض مربع حوار لتأكيد الحذف.
 * 
 * @param {boolean} isOpen - حالة للتحكم في ظهور المربع الحواري.
 * @param {function} onClose - دالة يتم استدعاؤها عند إغلاق المربع الحواري.
 * @param {function} onConfirm - دالة يتم استدعاؤها عند تأكيد الحذف.
 * @param {boolean} isLoading - حالة لتحديد ما إذا كانت عملية الحذف قيد التنفيذ.
 * @param {string} itemName - اسم العنصر المراد حذفه لعرضه في رسالة التأكيد.
 * @param {string} [title="هل أنت متأكد؟"] - عنوان مخصص للمربع الحواري.
 * @param {string} [message] - رسالة مخصصة للمربع الحواري.
 */
const DeleteConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  itemName,
  title = "هل أنت متأكد؟",
  message,
}) => {
  // لا تعرض أي شيء إذا كان المكون غير مفتوح
  if (!isOpen) {
    return null;
  }

  // الرسالة الافتراضية إذا لم يتم توفير رسالة مخصصة
  const confirmationMessage = message || `هل تريد حقًا حذف "${itemName}"؟ لا يمكن التراجع عن هذا الإجراء.`;

  return (
    // الخلفية المظلمة التي تغطي الشاشة
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
      onClick={onClose} // إغلاق المربع عند النقر على الخلفية
    >
      {/* جسم المربع الحواري */}
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 mx-4 text-center"
        onClick={(e) => e.stopPropagation()} // منع إغلاق المربع عند النقر بداخله
      >
        {/* أيقونة التحذير */}
        <div className="flex justify-center">
          <div className="h-16 w-16 flex items-center justify-center rounded-full bg-red-100">
            <ShieldAlert size={40} className="text-red-600" />
          </div>
        </div>

        {/* العنوان والرسالة */}
        <h3 className="text-2xl font-bold text-slate-800 mt-4">{title}</h3>
        <p className="text-slate-500 mt-2 px-4">{confirmationMessage}</p>

        {/* أزرار الإجراءات */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            إلغاء
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center disabled:bg-red-400"
          >
            {isLoading ? (
              <Loader2 className="animate-spin mr-2" size={20} />
            ) : (
              'نعم، احذف'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationDialog;
