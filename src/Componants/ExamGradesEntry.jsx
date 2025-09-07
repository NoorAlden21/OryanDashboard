// src/Componants/ExamGradesEntry.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { PageHeader, Card, Busy } from "./_ui";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  useGetExamStudentsQuery,
  useBulkUpsertExamGradesMutation,
  usePublishExamGradesMutation,
  useListExamClassroomsQuery,
} from "../services/examsApi";

const STATUS_OPTIONS = [
  { value: "present", label: "حاضر" },
  { value: "absent", label: "غائب" },
  { value: "excused", label: "معذور" },
  { value: "cheated", label: "مخالف" },
  { value: "incomplete", label: "غير مكتمل" },
];

export default function ExamGradesEntry() {
  const { examId } = useParams();
  const navigate = useNavigate();

  const examIdNum = Number(examId);
  const hasValidExamId = Number.isFinite(examIdNum);

  // Filters
  const [classIdInput, setClassIdInput] = React.useState("");
  const [classId, setClassId] = React.useState(null);
  const [onlyMissing, setOnlyMissing] = React.useState(true);

  // Classrooms for this exam
  const {
    data: crData,
    isLoading: crLoading,
    isError: crError,
  } = useListExamClassroomsQuery(hasValidExamId ? examIdNum : skipToken);

  const classrooms = React.useMemo(() => {
    if (!crData) return [];
    if (Array.isArray(crData)) return crData;
    return crData.classrooms ?? crData.data ?? [];
  }, [crData]);

  React.useEffect(() => {
    if (classId && !classrooms.some((c) => c.id === classId)) {
      setClassId(null);
      setClassIdInput("");
    }
  }, [classrooms, classId]);

  // Students for grading
  const queryArgs = hasValidExamId
    ? {
        examId: examIdNum,
        class_id: classId ?? undefined,
        only_missing: onlyMissing ? 1 : 0,
      }
    : skipToken;

  const { data, isLoading, isError, isFetching, refetch } =
    useGetExamStudentsQuery(queryArgs, { refetchOnMountOrArgChange: true });

  // IMPORTANT: don't do `?? []` here — keep undefined as undefined to avoid a new array every render
  const studentsArr = data?.students;

  // Editable rows + dirty flag
  const [rows, setRows] = React.useState([]);
  const [dirty, setDirty] = React.useState(false);

  // Initialize rows when the actual students array changes
  React.useEffect(() => {
    if (!Array.isArray(studentsArr)) return;

    const initial = studentsArr.map((s) => ({
      student_profile_id: s.student_profile_id,
      name: s.name,
      status: "present",
      score: "",
      remark: "",
    }));

    setRows((prev) => {
      // If nothing really changed, keep prev to avoid re-render loops
      const sameLength = prev.length === initial.length;
      const same =
        sameLength &&
        prev.every((p, i) => {
          const q = initial[i];
          return (
            p.student_profile_id === q.student_profile_id &&
            p.name === q.name &&
            p.status === q.status &&
            String(p.score) === String(q.score) &&
            (p.remark || "") === (q.remark || "")
          );
        });

      return same ? prev : initial;
    });

    setDirty((d) => (d ? false : d));
  }, [studentsArr]);

  const [bulkUpsert, { isLoading: saving }] = useBulkUpsertExamGradesMutation();
  const [publishGrades, { isLoading: publishing }] =
    usePublishExamGradesMutation();

  const updateRow = (idx, key, val) => {
    setRows((old) =>
      old.map((r, i) =>
        i === idx
          ? {
              ...r,
              [key]: val,
              ...(key === "status" && val !== "present" ? { score: "" } : {}),
            }
          : r
      )
    );
    setDirty(true);
  };

  const onApplyFilter = (e) => {
    e.preventDefault();
    setClassId(classIdInput ? Number(classIdInput) : null);
  };

  const onResetFilter = () => {
    setClassIdInput("");
    setClassId(null);
    setOnlyMissing(true);
    refetch?.();
  };

  // Save helper (returns true if ok or nothing to do)
  const doSave = async () => {
    if (!hasValidExamId) return false;
    if (!dirty || rows.length === 0) return true;

    const records = rows.map((r) => ({
      student_profile_id: r.student_profile_id,
      status: r.status,
      score:
        r.status === "present" && r.score !== "" && r.score !== null
          ? Number(r.score)
          : null,
      remark: r.remark || null,
    }));

    await bulkUpsert({ examId: examIdNum, records }).unwrap();
    setDirty(false);
    if (onlyMissing) refetch?.(); // remove just-saved students from view
    return true;
  };

  // Single action: Save (if needed) THEN Publish
  const onSaveThenPublish = async () => {
    try {
      const ok = await doSave();
      if (!ok) return;
      await publishGrades(examIdNum).unwrap();
      alert("تم حفظ الدرجات ونشر النتائج.");
      navigate("/exams");
    } catch (err) {
      alert(err?.data?.message || "تعذّر حفظ/نشر النتائج");
    }
  };

  const busy = saving || publishing;

  return (
    <div dir="rtl">
      <PageHeader
        title={`إدخال الدرجات - اختبار #${hasValidExamId ? examIdNum : "—"}`}
        subtitle="اختر الفصل (اختياري) ثم أدخل حالة/درجة كل طالب"
        right={
          <div className="flex items-center gap-2">
            {isFetching && (
              <span className="flex items-center gap-1 text-slate-500 text-sm">
                <Loader2 size={16} className="animate-spin" />
                تحديث...
              </span>
            )}
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 flex items-center gap-2"
            >
              <ArrowRight size={16} /> رجوع
            </button>
          </div>
        }
      />

      {/* Filters */}
      <Card className="p-4 mb-4">
        <form
          onSubmit={onApplyFilter}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
        >
          <div>
            <label className="block text-sm mb-1">تصفية حسب الفصل</label>
            <select
              value={classIdInput}
              onChange={(e) => setClassIdInput(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              disabled={!hasValidExamId || crLoading || crError}
            >
              <option value="">
                {crLoading
                  ? "جاري تحميل الفصول..."
                  : crError
                  ? "تعذر تحميل الفصول"
                  : "كل الفصول"}
              </option>
              {classrooms.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name ?? `#${c.id}`} {c.year ? `- ${c.year}` : ""}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500 mt-1">
              اتركه فارغًا لجلب جميع طلاب المسار.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="onlyMissing"
              type="checkbox"
              className="w-4 h-4"
              checked={onlyMissing}
              onChange={(e) => setOnlyMissing(e.target.checked)}
            />
            <label htmlFor="onlyMissing" className="text-sm">
              إظهار فقط من لم تُسجّل لهم درجات
            </label>
          </div>

          <div className="flex gap-2 md:justify-end">
            <button
              type="submit"
              className="px-3 py-2 rounded-lg bg-primary text-white hover:opacity-90"
              disabled={!hasValidExamId}
            >
              تطبيق
            </button>
            <button
              type="button"
              onClick={onResetFilter}
              className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50"
            >
              تصفية افتراضية
            </button>
          </div>
        </form>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="grid grid-cols-12 px-4 py-3 bg-slate-50 text-slate-600 text-sm font-semibold">
          <div className="col-span-1">#</div>
          <div className="col-span-3">الطالب</div>
          <div className="col-span-2">الحالة</div>
          <div className="col-span-2">الدرجة</div>
          <div className="col-span-4">ملاحظة</div>
        </div>

        {!hasValidExamId ? (
          <div className="p-8 text-center text-slate-500">رقم الاختبار غير صالح</div>
        ) : isLoading ? (
          <Busy />
        ) : isError ? (
          <div className="p-8 text-center text-error">تعذر تحميل الطلاب</div>
        ) : !Array.isArray(studentsArr) || studentsArr.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            {onlyMissing
              ? "لا يوجد طلاب دون درجات لهذا الاختبار."
              : "لا يوجد طلاب."}
          </div>
        ) : (
          rows.map((r, idx) => (
            <div
              key={r.student_profile_id}
              className="grid grid-cols-12 gap-2 px-4 py-3 border-t border-slate-100"
            >
              <div className="col-span-1">{idx + 1}</div>
              <div className="col-span-3">
                <div className="font-medium text-textMain">{r.name}</div>
                <div className="text-xs text-slate-500">
                  ID: {r.student_profile_id}
                </div>
              </div>

              <div className="col-span-2">
                <select
                  value={r.status}
                  onChange={(e) => updateRow(idx, "status", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                >
                  {STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  disabled={r.status !== "present"}
                  value={r.score}
                  onChange={(e) => updateRow(idx, "score", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none disabled:bg-slate-100 disabled:text-slate-400"
                  placeholder="—"
                />
              </div>

              <div className="col-span-4">
                <input
                  type="text"
                  value={r.remark}
                  onChange={(e) => updateRow(idx, "remark", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  placeholder="ملاحظة (اختياري)"
                />
              </div>
            </div>
          ))
        )}
      </Card>

      {/* Single Action: Save then Publish */}
      <div className="mt-4 flex items-center justify-end">
        <button
          type="button"
          onClick={onSaveThenPublish}
          disabled={!hasValidExamId || busy}
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-2 disabled:opacity-50"
          title="يحفظ التغييرات (إن وجدت) ثم ينشر النتائج"
        >
          {busy ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <CheckCircle2 size={16} />
          )}
          {busy ? "جارِ التنفيذ..." : "حفظ ثم نشر النتائج"}
        </button>
      </div>
    </div>
  );
}
