import React from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useGetExamStudentsQuery, useBulkUpsertGradesMutation, usePublishGradesMutation } from "../services/examsApi";
import { Card, PageHeader, Busy, StatusBadge, formatDT } from "./_ui.jsx";

const STATUS_OPTIONS = ["present","absent","excused","cheated","incomplete"];

export default function ExamGradesEntry() {
  const { examId } = useParams();
  const [classId, setClassId] = React.useState("");
  const { data, isLoading, isError, isFetching } = useGetExamStudentsQuery({ examId, class_id: classId || undefined });
  const [rows, setRows] = React.useState([]);
  const [saveGrades, { isLoading: isSaving }] = useBulkUpsertGradesMutation();
  const [publishResults, { isLoading: publishing }] = usePublishGradesMutation();

  React.useEffect(() => {
    const students = data?.students ?? [];
    setRows(
      students.map((s) => ({
        student_profile_id: s.student_profile_id,
        name: s.name,
        status: s.grade?.status ?? "present",
        score: s.grade?.score ?? "",
        remark: s.grade?.remark ?? "",
      }))
    );
  }, [data]);

  const updateCell = (idx, field, value) => {
    setRows((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      if (field === "status" && value !== "present") copy[idx].score = "";
      return copy;
    });
  };

  const submit = async () => {
    try {
      const records = rows.map(({ student_profile_id, status, score, remark }) => ({
        student_profile_id,
        status,
        ...(status === "present" && score !== "" ? { score: Number(score) } : {}),
        ...(remark ? { remark } : {}),
      }));
      await saveGrades({ examId, class_id: classId || undefined, records }).unwrap();
      alert("تم الحفظ");
    } catch (e) {
      alert(e?.data?.message || "فشل الحفظ");
    }
  };

  const doPublish = async () => {
    try {
      await publishResults(examId).unwrap();
      alert("تم نشر النتائج");
    } catch (e) {
      alert(e?.data?.message || "فشل النشر");
    }
  };

  return (
    <div dir="rtl">
      <PageHeader
        title={`درجات الامتحان #${examId}`}
        subtitle="إدخال الدرجات وتحديث حالات الطلاب"
        right={isFetching && (
          <div className="flex items-center gap-2 text-slate-500">
            <Loader2 className="animate-spin" size={18} />
            <span className="text-sm">تحديث...</span>
          </div>
        )}
      />

      {/* Filter */}
      <Card className="p-4 mb-4">
        <div className="flex items-end gap-2">
          <div>
            <label className="block text-sm mb-1">class_id (اختياري)</label>
            <input
              className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              placeholder="مثال: 5"
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
            />
          </div>
          <button
            onClick={() => {}}
            className="px-3 py-2 rounded-lg border border-slate-300 text-sm cursor-default"
            disabled
          >
            تم جلب الطلاب من الصف المحدد
          </button>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="grid grid-cols-12 px-4 py-3 bg-slate-50 text-slate-600 text-sm font-semibold">
          <div className="col-span-4">الطالب</div>
          <div className="col-span-3">الحالة</div>
          <div className="col-span-3">الدرجة</div>
          <div className="col-span-2">ملاحظة</div>
        </div>

        {isLoading ? (
          <Busy />
        ) : isError ? (
          <div className="p-8 text-center text-error">فشل تحميل الطلاب</div>
        ) : rows.length === 0 ? (
          <div className="p-8 text-center text-slate-500">لا يوجد طلاب</div>
        ) : (
          rows.map((r, idx) => (
            <div key={r.student_profile_id} className="grid grid-cols-12 px-4 py-3 border-t border-slate-100">
              <div className="col-span-4 font-medium text-textMain">{r.name}</div>

              <div className="col-span-3">
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
                  value={r.status}
                  onChange={(e) => updateCell(idx, "status", e.target.value)}
                >
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="col-span-3">
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  value={r.score}
                  onChange={(e) => updateCell(idx, "score", e.target.value)}
                  disabled={r.status !== "present"}
                  placeholder={r.status === "present" ? "الدرجة" : "-"}
                />
              </div>

              <div className="col-span-2">
                <input
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  value={r.remark}
                  onChange={(e) => updateCell(idx, "remark", e.target.value)}
                  placeholder="اختياري"
                />
              </div>
            </div>
          ))
        )}
      </Card>

      {/* Sticky actions */}
      <div className="sticky bottom-4 mt-6">
        <div className="bg-white border border-slate-200 shadow-xl rounded-xl p-3 flex items-center justify-between">
          <div className="text-sm text-slate-500">تأكد من الحفظ قبل نشر النتائج.</div>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={submit}
              disabled={isSaving || rows.length === 0}
            >
              {isSaving ? "جارِ الحفظ..." : "حفظ الدرجات"}
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              onClick={doPublish}
              disabled={publishing}
            >
              {publishing ? "جارِ النشر..." : "نشر النتائج"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
