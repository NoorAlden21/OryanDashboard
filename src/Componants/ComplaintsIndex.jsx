// src/Componants/ComplaintsIndex.jsx
import React, { useMemo, useState } from "react";
import {
  useGetComplaintsQuery,
  useUpdateComplaintStatusMutation,
  useDeleteComplaintMutation,
} from "../Slice/complaintsApi";
import { toast } from "react-toastify";
import {
  Search,
  Filter,
  X,
  CheckCircle2,
  Eye,
  Trash2,
  Loader2,
  Clock3,
} from "lucide-react";

const statusMap = {
  pending: { label: "معلّقة", cls: "bg-yellow-100 text-yellow-800" },
  in_review: { label: "قيد المراجعة", cls: "bg-blue-100 text-blue-800" },
  resolved: { label: "محلولة", cls: "bg-emerald-100 text-emerald-800" },
};

function Badge({ status }) {
  const s = statusMap[status] || { label: status, cls: "bg-slate-100 text-slate-700" };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${s.cls}`}>
      {s.label}
    </span>
  );
}

function formatDT(v) {
  if (!v) return "—";
  try {
    return new Date(v).toLocaleString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return v;
  }
}

export default function ComplaintsIndex() {
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [openItem, setOpenItem] = useState(null);

  const { data, isLoading, isError, refetch, isFetching } = useGetComplaintsQuery(
    { page, per_page: perPage, q, status },
    { refetchOnMountOrArgChange: true }
  );

  const [updateStatus, { isLoading: saving }] = useUpdateComplaintStatusMutation();
  const [deleteComplaint, { isLoading: deleting }] = useDeleteComplaintMutation();

  const complaints = useMemo(() => data?.complaints ?? [], [data]);
  const meta = data?.meta;

  const onReview = async (c) => {
    try {
      await updateStatus({ id: c.id, status: "in_review" }).unwrap();
      toast.success("تم تحويل الشكوى إلى قيد المراجعة");
      refetch();
    } catch (e) {
      toast.error(e?.data?.message || "تعذّر تحديث الحالة");
    }
  };

  const onResolve = async (c) => {
    try {
      await updateStatus({ id: c.id, status: "resolved" }).unwrap();
      toast.success("تم إنهاء الشكوى");
      refetch();
    } catch (e) {
      toast.error(e?.data?.message || "تعذّر تحديث الحالة");
    }
  };

  const onDelete = async (c) => {
    if (!confirm("هل أنت متأكد من حذف هذه الشكوى؟")) return;
    try {
      await deleteComplaint(c.id).unwrap();
      toast.success("تم حذف الشكوى");
      refetch();
    } catch (e) {
      toast.error(e?.data?.message || "تعذّر حذف الشكوى");
    }
  };

  return (
    <div className="p-6" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-textMain">الشكاوى</h1>
          <p className="text-slate-500 text-sm">عرض وإدارة جميع الشكاوى</p>
        </div>
        {isFetching && (
          <div className="flex items-center gap-2 text-slate-500">
            <Loader2 className="animate-spin" size={18} />
            <span className="text-sm">تحديث...</span>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative md:w-1/2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && refetch()}
              placeholder="ابحث بالموضوع/الوصف/الاسم..."
              className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={18} className="text-slate-500" />
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
            >
              <option value="">كل الحالات</option>
              <option value="pending">معلّقة</option>
              <option value="in_review">قيد المراجعة</option>
              <option value="resolved">محلولة</option>
            </select>

            <button
              onClick={() => {
                setQ("");
                setStatus("");
                setPage(1);
                refetch();
              }}
              className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-sm"
            >
              تصفية افتراضية
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {/* Header Row */}
        <div className="grid grid-cols-12 px-4 py-3 bg-slate-50 text-slate-600 text-sm font-semibold">
          <div className="col-span-1">#</div>
          <div className="col-span-3">الموضوع</div>
          <div className="col-span-2">المشتكي</div>
          <div className="col-span-2">المستهدف</div>
          <div className="col-span-2">الحالة</div>
          <div className="col-span-2 text-left">إجراءات</div>
        </div>

        {isLoading ? (
          <div className="p-8 flex items-center justify-center text-slate-500">
            <Loader2 className="animate-spin mr-2" /> تحميل...
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-error">حدث خطأ أثناء جلب البيانات</div>
        ) : complaints.length === 0 ? (
          <div className="p-8 text-center text-slate-500">لا توجد شكاوى</div>
        ) : (
          complaints.map((c) => (
            <div
              key={c.id}
              className="grid grid-cols-12 px-4 py-4 border-t border-slate-100 hover:bg-slate-50"
            >
              <div className="col-span-1">{c.id}</div>
              <div className="col-span-3">
                <div className="font-medium text-textMain">{c.topic}</div>
                <div className="text-slate-500 text-xs line-clamp-1">{c.description}</div>
                <div className="text-slate-400 text-xs flex items-center gap-1 mt-1">
                  <Clock3 size={14} /> {formatDT(c.created_at)}
                </div>
              </div>
              <div className="col-span-2">
                <div className="text-sm font-semibold">{c?.complainant?.name}</div>
                <div className="text-xs text-slate-500">{c?.complainant?.profile_type}</div>
              </div>
              <div className="col-span-2">
                <div className="text-sm font-semibold">{c?.target?.name}</div>
                <div className="text-xs text-slate-500">{c?.target?.profile_type}</div>
              </div>
              <div className="col-span-2">
                <Badge status={c.status} />
                {c?.handled_at && (
                  <div className="text-xs text-slate-400 mt-1">أُغلقت: {formatDT(c.handled_at)}</div>
                )}
              </div>
              <div className="col-span-2 flex items-center justify-end gap-2">
                <button
                  onClick={() => setOpenItem(c)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-sm flex items-center gap-1"
                >
                  <Eye size={16} /> عرض
                </button>

                {c.status !== "in_review" && c.status !== "resolved" && (
                  <button
                    onClick={() => onReview(c)}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm"
                    disabled={saving}
                  >
                    قيد المراجعة
                  </button>
                )}

                {c.status !== "resolved" && (
                  <button
                    onClick={() => onResolve(c)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-sm flex items-center gap-1"
                    disabled={saving}
                  >
                    <CheckCircle2 size={16} /> إنهاء
                  </button>
                )}

                <button
                  onClick={() => onDelete(c)}
                  className="px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm flex items-center gap-1"
                  disabled={deleting}
                >
                  <Trash2 size={16} /> حذف
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {meta && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-slate-500">
            الصفحة {meta.current_page} من {meta.last_page}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-2 rounded-lg border border-slate-300 disabled:opacity-50"
            >
              السابق
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={meta && page >= meta.last_page}
              className="px-3 py-2 rounded-lg border border-slate-300 disabled:opacity-50"
            >
              التالي
            </button>
          </div>
        </div>
      )}

      {/* Drawer */}
      {openItem && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpenItem(null)} />
          <div className="absolute top-0 left-0 right-0 md:left-auto md:w-[520px] h-full bg-white shadow-2xl rounded-l-2xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-textMain">تفاصيل الشكوى #{openItem.id}</h3>
              <button
                onClick={() => setOpenItem(null)}
                className="p-2 rounded-lg hover:bg-slate-100"
                aria-label="إغلاق"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <div className="text-slate-500 mb-1">الموضوع</div>
                <div className="font-semibold">{openItem.topic}</div>
              </div>

              <div>
                <div className="text-slate-500 mb-1">الوصف</div>
                <div className="leading-7">{openItem.description}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-slate-50">
                  <div className="text-slate-500 text-xs">المشتكي</div>
                  <div className="font-semibold">{openItem?.complainant?.name}</div>
                  <div className="text-slate-500 text-xs">{openItem?.complainant?.profile_type}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50">
                  <div className="text-slate-500 text-xs">المستهدف</div>
                  <div className="font-semibold">{openItem?.target?.name}</div>
                  <div className="text-slate-500 text-xs">{openItem?.target?.profile_type}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge status={openItem.status} />
                <span className="text-slate-500 text-xs">أُنشئت: {formatDT(openItem.created_at)}</span>
                {openItem?.handled_at && (
                  <span className="text-slate-500 text-xs">/ أُغلقت: {formatDT(openItem.handled_at)}</span>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                {openItem.status !== "in_review" && openItem.status !== "resolved" && (
                  <button
                    onClick={() => onReview(openItem)}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm"
                  >
                    وضع قيد المراجعة
                  </button>
                )}
                {openItem.status !== "resolved" && (
                  <button
                    onClick={() => onResolve(openItem)}
                    className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-sm"
                  >
                    إنهاء الشكوى
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
