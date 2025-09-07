// src/Componants/_ui.js
import React from "react";
import { Loader2 } from "lucide-react";

export const statusMap = {
  draft: { label: "مسودة", cls: "bg-slate-100 text-slate-700" },
  published: { label: "منشور", cls: "bg-blue-100 text-blue-800" },
  done: { label: "مكتمل", cls: "bg-emerald-100 text-emerald-800" },
  cancelled: { label: "ملغى", cls: "bg-red-100 text-red-800" },
};

export function StatusBadge({ value }) {
  const s = statusMap[value] || {
    label: value,
    cls: "bg-slate-100 text-slate-700",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${s.cls}`}>
      {s.label}
    </span>
  );
}

export function formatDT(v) {
  if (!v) return "—";
  try {
    const d = new Date(v);
    if (isNaN(d.getTime())) return v;
    return d.toLocaleString("ar-EG", {
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

export function PageHeader({ title, subtitle, right }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-textMain">{title}</h1>
        {subtitle && <p className="text-slate-500 text-sm">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white border border-slate-200 rounded-xl ${className}`}>
      {children}
    </div>
  );
}

export function Busy({ text = "تحميل..." }) {
  return (
    <div className="p-8 flex items-center justify-center text-slate-500">
      <Loader2 className="animate-spin mr-2" /> {text}
    </div>
  );
}
