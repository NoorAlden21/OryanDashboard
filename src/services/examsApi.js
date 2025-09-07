import { apiSlice } from "./apiSlice";

export const examsApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    // ===== Exam Terms =====
    listExamTerms: build.query({
      query: (params = {}) => ({ url: "admin/exam-terms", params }),
      providesTags: (result) =>
        result?.terms?.data
          ? [
              ...result.terms.data.map((t) => ({ type: "ExamTerm", id: t.id })),
              { type: "ExamTerms", id: "LIST" },
            ]
          : [{ type: "ExamTerms", id: "LIST" }],
    }),
    createExamTerm: build.mutation({
      query: (body) => ({ url: "admin/exam-terms", method: "POST", body }),
      invalidatesTags: [{ type: "ExamTerms", id: "LIST" }],
    }),
    updateExamTerm: build.mutation({
      query: ({ id, ...body }) => ({
        url: `admin/exam-terms/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (res, err, { id }) => [
        { type: "ExamTerm", id },
        { type: "ExamTerms", id: "LIST" },
      ],
    }),
    publishExamTerm: build.mutation({
      query: (id) => ({
        url: `admin/exam-terms/${id}/publish`,
        method: "POST",
      }),
      invalidatesTags: (res, err, id) => [
        { type: "ExamTerm", id },
        { type: "ExamTerms", id: "LIST" },
      ],
    }),

    // bulk-upsert للامتحانات تحت تيرم
    bulkUpsertExamsForTerm: build.mutation({
      // body: { class_type_id, exams: [{ subject_id, scheduled_at, duration_minutes, room?, max_score?, notes? }] }
      query: ({ examTermId, ...body }) => ({
        url: `admin/exam-terms/${examTermId}/exams/bulk-upsert`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Exams", id: "LIST" }],
    }),

    // ===== Exams =====
    listExams: build.query({
      query: (params = {}) => ({ url: "admin/exams", params }),
      providesTags: (result) =>
        result?.exams?.data
          ? [
              ...result.exams.data.map((e) => ({ type: "Exam", id: e.id })),
              { type: "Exams", id: "LIST" },
            ]
          : [{ type: "Exams", id: "LIST" }],
    }),
    publishExam: build.mutation({
      query: (examId) => ({
        url: `admin/exams/${examId}/publish`,
        method: "POST",
      }),
      invalidatesTags: (res, err, examId) => [
        { type: "Exam", id: examId },
        { type: "Exams", id: "LIST" },
      ],
    }),

    // ===== Grades =====
    getExamStudents: build.query({
      // optional query: ?class_id=
      query: ({ examId, class_id }) => ({
        url: `admin/exams/${examId}/students`,
        params: class_id ? { class_id } : undefined,
      }),
    }),
    bulkUpsertGrades: build.mutation({
      // body: { class_id?, records: [{ student_profile_id, status, score?, remark? }, ...] }
      query: ({ examId, class_id, records }) => ({
        url: `admin/exams/${examId}/grades/bulk-upsert`,
        method: "POST",
        body: { ...(class_id ? { class_id } : {}), records },
      }),
      invalidatesTags: (res, err, { examId }) => [
        { type: "Grades", id: examId },
      ],
    }),
    publishGrades: build.mutation({
      query: (examId) => ({
        url: `admin/exams/${examId}/grades/publish`,
        method: "POST",
      }),
      invalidatesTags: (res, err, examId) => [
        { type: "Grades", id: examId },
        { type: "Exam", id: examId },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListExamTermsQuery,
  useCreateExamTermMutation,
  useUpdateExamTermMutation,
  usePublishExamTermMutation,
  useBulkUpsertExamsForTermMutation,

  useListExamsQuery,
  usePublishExamMutation,

  useGetExamStudentsQuery,
  useBulkUpsertGradesMutation,
  usePublishGradesMutation,
} = examsApi;
