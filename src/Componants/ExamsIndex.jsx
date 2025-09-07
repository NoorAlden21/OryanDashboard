import React from "react";
import { Link } from "react-router-dom";
import { Filter, Search, Loader2 } from "lucide-react";
import { useListExamsQuery, usePublishExamMutation } from "../services/examsApi";
import { Card, PageHeader, Busy, StatusBadge, formatDT } from "./_ui.jsx";

export default function ExamsIndex() {
  const [filters, setFilters] = React.useState({ page: 1, term_id: "", class_type_id: "", subject_id: "" });
  const { data, isLoading, isError, refetch, isFetching } = useListExamsQuery(filters);
  const [publishExam, { isLoading: isPublishing }] = usePublishExamMutation();

  const exams = data?.exams?.data ?? [];
  const meta  = data?.exams;

  const onChange = (e) => setFilters((f) => ({ ...f, [e.target.name]: e.target.value }));

  const doPublish = async (id) => {
    try {
      await publishExam(id).unwrap();
      refetch();
    } catch (e) {
      alert(e?.data?.message || "تعذّر النشر");
    }
  };

  return (
    <div dir="rtl">
      <PageHeader
        title="الامتحانات"
        subtitle="عرض وفِلترة جميع الامتحانات"
        right={isFetching && (
          <div className="flex items-center gap-2 text-slate-500">
            <Loader2 className="animate-spin" size={18} />
            <span className="text-sm">تحديث...</span>
          </div>
        )}
      />

      {/* Filters */}
      <Card className="p-4 mb-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative md:w-1/2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              name="subject_id"
              value={filters.subject_id}
              onChange={onChange}
              placeholder="subject_id"
              className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={18} className="text-slate-500" />
            <input
              name="class_type_id"
              value={filters.class_type_id}
              onChange={onChange}
              placeholder="class_type_id"
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
            />
            <input
              name="term_id"
              value={filters.term_id}
              onChange={onChange}
              placeholder="term_id"
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
            />

            <button
              onClick={() => refetch()}
              className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-sm"
            >تطبيق</button>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="grid grid-cols-12 px-4 py-3 bg-slate-50 text-slate-600 text-sm font-semibold">
          <div className="col-span-1">#</div>
          <div className="col-span-2">الحالة</div>
          <div className="col-span-2">التاريخ</div>
          <div className="col-span-1">المدة</div>
          <div className="col-span-2">المادة</div>
          <div className="col-span-2">المسار</div>
          <div className="col-span-2 text-left">إجراءات</div>
        </div>

        {isLoading ? (
          <Busy />
        ) : isError ? (
          <div className="p-8 text-center text-error">فشل تحميل البيانات</div>
        ) : exams.length === 0 ? (
          <div className="p-8 text-center text-slate-500">لا توجد امتحانات</div>
        ) : (
          exams.map((e) => (
            <div key={e.id} className="grid grid-cols-12 px-4 py-4 border-t border-slate-100 hover:bg-slate-50">
              <div className="col-span-1">{e.id}</div>
              <div className="col-span-2"><StatusBadge value={e.status} /></div>
              <div className="col-span-2">
                <div className="font-medium">{formatDT(e.scheduled_at)}</div>
                <div className="text-xs text-slate-500">{e.term?.name}</div>
              </div>
              <div className="col-span-1">د {e.duration_minutes}</div>
              <div className="col-span-2">{e.subject?.name ?? "-"}</div>
              <div className="col-span-2">{e.class_type?.name ?? e.classType?.name ?? "-"}</div>
              <div className="col-span-2 text-left">
                <Link className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-sm mr-2 inline-block" to={`/exams/${e.id}/grades`}>
                  Grades
                </Link>
                <button
                  onClick={() => doPublish(e.id)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm"
                  disabled={isPublishing}
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
          <div className="text-sm text-slate-500">الصفحة {meta.current_page} من {meta.last_page}</div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilters((f) => ({ ...f, page: Math.max(1, (f.page ?? 1) - 1) }))}
              disabled={meta.current_page <= 1}
              className="px-3 py-2 rounded-lg border border-slate-300 disabled:opacity-50"
            >السابق</button>
            <button
              onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
              disabled={meta.current_page >= meta.last_page}
              className="px-3 py-2 rounded-lg border border-slate-300 disabled:opacity-50"
            >التالي</button>
          </div>
        </div>
      )}
    </div>
  );
}
