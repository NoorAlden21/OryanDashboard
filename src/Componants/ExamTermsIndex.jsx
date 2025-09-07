// src/Componants/ExamTermsIndex.jsx
import React from "react";
import { Loader2, Plus, X } from "lucide-react";
import { Link } from "react-router-dom";
import {
  useListExamTermsQuery,
  usePublishExamTermMutation,
  useCreateExamTermMutation,
} from "../services/examsApi";
import { Card, PageHeader, Busy } from "./_ui";

export default function ExamTermsIndex() {
  const [page, setPage] = React.useState(1);
  const { data, isLoading, isError, isFetching, refetch } = useListExamTermsQuery({ page });

  const [publishTerm, { isLoading: publishing }] = usePublishExamTermMutation();
  const [createTerm, { isLoading: creating }] = useCreateExamTermMutation();

  const [openCreate, setOpenCreate] = React.useState(false);
  const [form, setForm] = React.useState({
    name: "",
    academic_year: "2024/2025",
    term: "midterm",
    start_date: "",
    end_date: "",
  });
  const [errors, setErrors] = React.useState(null);

  const terms = data?.terms?.data ?? [];
  const meta = data?.terms;

  const onPublish = async (id) => {
    try {
      await publishTerm(id).unwrap();
      refetch();
    } catch (e) {
      alert(e?.data?.message || "تعذّر النشر");
    }
  };

  const onCreate = async (e) => {
    e.preventDefault();
    setErrors(null);
    if (!form.name || !form.academic_year || !form.term) {
      return setErrors({ _msg: "الاسم، السنة، النوع حقول مطلوبة." });
    }
    try {
      await createTerm(form).unwrap();
      setOpenCreate(false);
      setForm({
        name: "",
        academic_year: "2024/2025",
        term: "midterm",
        start_date: "",
        end_date: "",
      });
      refetch();
      alert("تمت إضافة الفترة.");
    } catch (err) {
      if (err?.status === 422) setErrors({ _msg: "تحقق من الحقول", ...err?.data?.errors });
      else setErrors({ _msg: err?.data?.message || "تعذّر الإضافة" });
    }
  };

  return (
    <div dir="rtl">
      <PageHeader
        title="فترات الامتحان"
        subtitle="إدارة وإنشاء فترات الامتحانات"
        right={
          <div className="flex items-center gap-2">
            {isFetching && (
              <div className="flex items-center gap-2 text-slate-500">
                <Loader2 className="animate-spin" size={18} />
                <span className="text-sm">تحديث...</span>
              </div>
            )}
            <button
              onClick={() => setOpenCreate(true)}
              className="px-3 py-2 rounded-lg bg-primary text-white hover:opacity-90 flex items-center gap-2"
            >
              <Plus size={16} /> إضافة فترة
            </button>
          </div>
        }
      />

      <Card className="overflow-hidden">
        <div className="grid grid-cols-12 px-4 py-3 bg-slate-50 text-slate-600 text-sm font-semibold">
          <div className="col-span-1">#</div>
          <div className="col-span-4">الاسم</div>
          <div className="col-span-3">السنة</div>
          <div className="col-span-2">النوع</div>
          <div className="col-span-2 text-left">إجراءات</div>
        </div>

        {isLoading ? (
          <Busy />
        ) : isError ? (
          <div className="p-8 text-center text-error">فشل تحميل البيانات</div>
        ) : terms.length === 0 ? (
          <div className="p-8 text-center text-slate-500">لا توجد فترات</div>
        ) : (
          terms.map((t) => (
            <div
              key={t.id}
              className="grid grid-cols-12 px-4 py-4 border-t border-slate-100 hover:bg-slate-50"
            >
              <div className="col-span-1">{t.id}</div>
              <div className="col-span-4">
                <div className="font-medium text-textMain">{t.name}</div>
                <div className="text-slate-500 text-xs">{t.status}</div>
              </div>
              <div className="col-span-3">{t.academic_year}</div>
              <div className="col-span-2">{t.term}</div>
              <div className="col-span-2 text-left">
                <Link
                    to={`/exam-terms/${t.id}/exams/bulk`}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-sm mr-2"
                  >
                    تخطيط الامتحانات
                </Link>
                <button
                  onClick={() => onPublish(t.id)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm"
                  disabled={publishing}
                >
                  Publish
                </button>
              </div>
            </div>
          ))
        )}
      </Card>

      {meta && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-slate-500">
            الصفحة {meta.current_page} من {meta.last_page}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={meta.current_page <= 1}
              className="px-3 py-2 rounded-lg border border-slate-300 disabled:opacity-50"
            >
              السابق
            </button>
            {/* increment page */}
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={meta.current_page >= meta.last_page}
              className="px-3 py-2 rounded-lg border border-slate-300 disabled:opacity-50"
            >
              التالي
            </button>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {openCreate && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpenCreate(false)}
          />
          <div className="absolute top-0 left-0 right-0 md:left-auto md:w-[520px] h-full bg-white shadow-2xl rounded-l-2xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-textMain">إضافة فترة جديدة</h3>
              <button
                onClick={() => setOpenCreate(false)}
                className="p-2 rounded-lg hover:bg-slate-100"
                aria-label="إغلاق"
              >
                <X size={18} />
              </button>
            </div>

            {errors?._msg && (
              <div className="mb-3 text-sm text-error">{errors._msg}</div>
            )}

            <form onSubmit={onCreate} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">الاسم</label>
                <input
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="مثال: Midterm 2024/2025"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">السنة الأكاديمية</label>
                <input
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  value={form.academic_year}
                  onChange={(e) => setForm((f) => ({ ...f, academic_year: e.target.value }))}
                  placeholder="2024/2025"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">النوع</label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
                  value={form.term}
                  onChange={(e) => setForm((f) => ({ ...f, term: e.target.value }))}
                >
                  <option value="midterm">midterm</option>
                  <option value="final">final</option>
                  <option value="other">other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1">تاريخ البداية</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    value={form.start_date}
                    onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">تاريخ النهاية</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    value={form.end_date}
                    onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpenCreate(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 rounded-lg bg-primary text-white hover:opacity-90"
                >
                  {creating ? "جارِ الإضافة..." : "إضافة"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
