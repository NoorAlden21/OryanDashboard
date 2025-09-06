// src/Slice/complaintsApi.js
import { apiSlice } from "../services/apiSlice";

function extractMeta(obj) {
  if (!obj || typeof obj !== "object") return null;
  // If meta already exists, use it
  if (obj.meta) return obj.meta;

  // Build a meta object from Laravel paginator keys if present
  const keys = [
    "current_page",
    "last_page",
    "per_page",
    "total",
    "from",
    "to",
    "links",
  ];
  const hasPaginatorKeys = keys.some((k) => k in obj);
  if (hasPaginatorKeys) {
    const {
      current_page = 1,
      last_page = 1,
      per_page = undefined,
      total = undefined,
      from = undefined,
      to = undefined,
      links = undefined,
    } = obj;
    return { current_page, last_page, per_page, total, from, to, links };
  }

  return null;
}

function normalizeComplaints(resp) {
  // 1) plain array
  if (Array.isArray(resp)) return { complaints: resp, meta: null };

  // 2) top-level { complaints: [...] } or { data: [...] }
  if (Array.isArray(resp?.complaints)) {
    return { complaints: resp.complaints, meta: extractMeta(resp) };
  }
  if (Array.isArray(resp?.data)) {
    return { complaints: resp.data, meta: extractMeta(resp) };
  }

  // 3) nested paginator: { complaints: { data:[...], ... } } or { data: { data:[...], ... } }
  const container = resp?.complaints || resp?.data;
  if (container && typeof container === "object") {
    const rows = Array.isArray(container.data) ? container.data : [];
    return {
      complaints: rows,
      meta: extractMeta(container) || extractMeta(resp),
    };
  }

  // 4) fallback
  return { complaints: [], meta: extractMeta(resp) };
}

export const complaintsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getComplaints: builder.query({
      // Only send non-empty filters so the backend doesn’t get blank params
      query: (args = {}) => {
        const { page, per_page, q, status } = args;
        const params = {};
        if (page != null) params.page = page;
        if (per_page != null) params.per_page = per_page;
        if (q) params.q = q;
        if (status) params.status = status;

        return { url: "admin/complaints", params };
      },
      transformResponse: (resp) => normalizeComplaints(resp),
      providesTags: (result) =>
        result?.complaints?.length
          ? [
              ...result.complaints.map((c) => ({
                type: "Complaint",
                id: c.id,
              })),
              { type: "Complaint", id: "LIST" },
            ]
          : [{ type: "Complaint", id: "LIST" }],
    }),

    getComplaint: builder.query({
      query: (id) => `admin/complaints/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Complaint", id }],
    }),

    updateComplaintStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `admin/complaints/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Complaint", id },
        { type: "Complaint", id: "LIST" },
      ],
    }),

    deleteComplaint: builder.mutation({
      query: (id) => ({
        url: `admin/complaints/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, id) => [
        { type: "Complaint", id },
        { type: "Complaint", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetComplaintsQuery,
  useGetComplaintQuery,
  useUpdateComplaintStatusMutation,
  useDeleteComplaintMutation,
} = complaintsApi;
