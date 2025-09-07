// src/Componants/ExamBulkUpsert.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Trash2, Save, ArrowRight } from "lucide-react";
import { PageHeader, Card } from "./_ui";
import {
  useBulkUpsertExamsMutation,
  useListClassTypesQuery,
  useListClassTypeSubjectsQuery,
} from "../services/examsApi";
import { skipToken } from "@reduxjs/toolkit/query";

// "2025-10-10T09:00" -> "2025-10-10 09:00:00"
function toApiDate(dtLocal) {
  if (!dtLocal) return "";
  const s = dtLocal.replace("T", " ");
  return s.length === 16 ? `${s}:00` : s;
}

export default function ExamBulkUpsert() {
  const { termId } = useParams();
  const navigate = useNavigate();

  // class types
  const { data: ctResp, isLoading: ctLoading, isError: ctError } =
    useListClassTypesQuery();

  // normalize class types array: accept {data:[...]}, {class_types:[...]}, or [...]
  const classTypes = React.useMemo(() => {
    if (!ctResp) return [];
    if (Array.isArray(ctResp)) return ctResp;
    return ctResp.class_types ?? ctResp.data ?? [];
  }, [ctResp]);

  // selected class type
  const [classTypeId, setClassTypeId] = React.useState("");

  // subjects for selected class type
  const { data: subResp, isLoading: subLoading } =
    useListClassTypeSubjectsQuery(classTypeId ? Number(classTypeId) : skipToken);

  const subjects = React.useMemo(() => {
    if (!subResp) return [];
    if (Array.isArray(subResp)) return subResp;
    return subResp.subjects ?? subResp.data ?? [];
  }, [subResp]);

  // reset subject selections when class type changes
  React.useEffect(() => {
    setRows((prev) => prev.map((r) => ({ ...r, subject_id: "" })));
  }, [classTypeId]);

  const [rows, setRows] = React.useState([
    { subject_id: "", scheduled_at: "", duration_minutes: 90, max_score: 100 },
  ]);
  const [errors, setErrors] = React.useState(null);

  const [bulkUpsert, { isLoading }] = useBulkUpsertExamsMutation();

  const addRow = () =>
    setRows((r) => [
      ...r,
      { subject_id: "", scheduled_at: "", duration_minutes: 90, max_score: 100 },
    ]);

  const removeRow = (idx) => setRows((r) => r.filter((_, i) => i !== idx));

  const updateRow = (idx, key, val) =>
    setRows((r) => r.map((row, i) => (i === idx ? { ...row, [key]: val } : row)));

  const validate = () => {
    if (!classTypeId) return "يجب اختيار مسار الصف.";
    if (rows.length === 0) return "أضف صفاً واحداً على الأقل.";
    for (let i = 0; i < rows.length; i++) {
      const it = rows[i];
      if (!it.subject_id) return `اختر مادة في الصف ${i + 1}`;
      if (!it.scheduled_at) return `التاريخ/الوقت مطلوب في الصف ${i + 1}`;
      if (!it.duration_minutes || Number(it.duration_minutes) < 10)
        return `المدة غير صحيحة في الصف ${i + 1}`;
      if (!it.max_score || Number(it.max_score) <= 0)
        return `العلامة العظمى غير صحيحة في الصف ${i + 1}`;
    }
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);

    const v = validate();
    if (v) return setErrors(v);

    const payload = {
      termId: Number(termId),
      class_type_id: Number(classTypeId),
      exams: rows.map((r) => ({
        subject_id: Number(r.subject_id),
        scheduled_at: toApiDate(r.scheduled_at),
        duration_minutes: Number(r.duration_minutes),
        max_score: Number(r.max_score || 100),
      })),
    };

    try {
      await bulkUpsert(payload).unwrap();
      alert("تم حفظ جدول الامتحانات لهذه الفترة.");
      navigate("/exams");
    } catch (err) {
      const msg =
        err?.data?.message ||
        (typeof err?.error === "string" ? err.error : "تعذر الحفظ");
      setErrors(msg);
    }
  };

  return (
    <div dir="rtl">
      <PageHeader
        title={`تخطيط الامتحانات - الفترة #${termId}`}
        subtitle="أدخل مواد وتواريخ الامتحانات لمسار محدد ثم احفظ دفعة واحدة"
        right={
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 flex items-center gap-2"
          >
            <ArrowRight size={16} /> رجوع
          </button>
        }
      />

      <form onSubmit={onSubmit}>
        <Card className="p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">مسار الصف (class_type_id)</label>

              <select
                value={classTypeId}
                onChange={(e) => setClassTypeId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              >
                <option value="">{ctLoading ? "جاري التحميل..." : "اختر المسار"}</option>
                {ctError ? (
                  <option disabled>تعذر تحميل المسارات</option>
                ) : (
                  classTypes.map((ct) => (
                    <option key={ct.id} value={ct.id}>
                      {ct.name ?? `#${ct.id}`}
                    </option>
                  ))
                )}
              </select>

              <p className="text-xs text-slate-500 mt-1">
                سيُستخدَم هذا المسار لجلب المواد الخاصة به ولتطبيق الجدولة على فصول هذا المسار.
              </p>
            </div>

            <div className="md:col-span-1 flex justify-end">
              <button
                type="button"
                onClick={addRow}
                disabled={!classTypeId}
                className="px-3 py-2 rounded-lg bg-primary text-white hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
              >
                <Plus size={16} /> إضافة امتحان
              </button>
            </div>
          </div>
        </Card>

        <Card className="overflow-x-auto">
          <div className="min-w-[980px]">
            <div className="grid grid-cols-12 px-4 py-3 bg-slate-50 text-slate-600 text-sm font-semibold">
              <div className="col-span-2">المادة</div>
              <div className="col-span-4">التاريخ والوقت</div>
              <div className="col-span-2">(دقيقة) المدة</div>
              <div className="col-span-2">العلامة العظمى</div>
              <div className="col-span-2 text-left">إجراء</div>
            </div>

            {rows.length === 0 ? (
              <div className="p-6 text-center text-slate-500">لا توجد صفوف</div>
            ) : (
              rows.map((r, i) => (
                <div
                  key={i}
                  className="grid grid-cols-12 gap-2 px-4 py-3 border-t border-slate-100"
                >
                  {/* Subject select */}
                  <div className="col-span-2">
                    <select
                      disabled={!classTypeId || subLoading}
                      value={r.subject_id}
                      onChange={(e) => updateRow(i, "subject_id", e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none disabled:bg-slate-100"
                    >
                      <option value="">
                        {subLoading
                          ? "جاري تحميل المواد..."
                          : classTypeId
                          ? "اختر المادة"
                          : "اختر المسار أولاً"}
                      </option>
                      {subjects.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name ?? `#${s.id}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Datetime */}
                  <div className="col-span-4">
                    <input
                      type="datetime-local"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                      value={r.scheduled_at}
                      onChange={(e) => updateRow(i, "scheduled_at", e.target.value)}
                    />
                  </div>

                  {/* Duration */}
                  <div className="col-span-2">
                    <input
                      type="number"
                      min="10"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                      value={r.duration_minutes}
                      onChange={(e) => updateRow(i, "duration_minutes", e.target.value)}
                    />
                  </div>

                  {/* Max score */}
                  <div className="col-span-2">
                    <input
                      type="number"
                      min="1"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                      value={r.max_score}
                      onChange={(e) => updateRow(i, "max_score", e.target.value)}
                    />
                  </div>

                  {/* Remove */}
                  <div className="col-span-2 text-left">
                    <button
                      type="button"
                      onClick={() => removeRow(i)}
                      className="px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
                    >
                      <Trash2 size={16} /> حذف
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {errors && <div className="mt-3 text-error text-sm">{errors}</div>}

        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={isLoading || !classTypeId}
            className="px-4 py-2 rounded-lg bg-primary text-white hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
          >
            <Save size={16} />
            {isLoading ? "جارِ الحفظ..." : "حفظ الدفعة"}
          </button>
        </div>
      </form>
    </div>
  );
}
