// src/services/examsApi.js
import { apiSlice } from "./apiSlice";

export const examsApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    /* =========================
     * Exam Terms
     * =======================*/
    listExamTerms: build.query({
      query: ({ page = 1 } = {}) => `admin/exam-terms?page=${page}`,
    }),
    createExamTerm: build.mutation({
      query: (body) => ({
        url: "admin/exam-terms",
        method: "POST",
        body,
      }),
    }),
    publishExamTerm: build.mutation({
      query: (id) => ({
        url: `admin/exam-terms/${id}/publish`,
        method: "POST",
      }),
    }),

    /* =========================
     * Exams
     * =======================*/
    listExams: build.query({
      query: (params = {}) => {
        const qs = new URLSearchParams(
          Object.entries(params).reduce((acc, [k, v]) => {
            if (v !== undefined && v !== null && v !== "") acc[k] = v;
            return acc;
          }, {})
        ).toString();
        return `admin/exams${qs ? `?${qs}` : ""}`;
      },
    }),
    publishExam: build.mutation({
      query: (id) => ({
        url: `admin/exams/${id}/publish`,
        method: "POST",
      }),
    }),

    // Bulk upsert exams for a term
    bulkUpsertExams: build.mutation({
      query: ({ termId, class_type_id, exams }) => ({
        url: `admin/exam-terms/${termId}/exams/bulk-upsert`,
        method: "POST",
        body: { class_type_id, exams },
      }),
    }),

    /* =========================
     * Exam Grades
     * =======================*/
    // Fetch students eligible for this exam (optional filter by class_id and/or only_missing)
    getExamStudents: build.query({
      query: ({ examId, class_id, only_missing } = {}) => {
        const params = new URLSearchParams();
        if (class_id !== undefined && class_id !== null && class_id !== "") {
          params.set("class_id", class_id);
        }
        if (only_missing !== undefined && only_missing !== null) {
          params.set("only_missing", only_missing ? 1 : 0);
        }
        const qs = params.toString();
        return `admin/exams/${examId}/students${qs ? `?${qs}` : ""}`;
      },
    }),

    // Insert/update grades in bulk
    bulkUpsertExamGrades: build.mutation({
      // backend accepts: { class_id?: number, records: [...] }
      query: ({ examId, records, class_id }) => ({
        url: `admin/exams/${examId}/grades/bulk-upsert`,
        method: "POST",
        body: class_id ? { class_id, records } : { records },
      }),
    }),

    // Publish grades
    publishExamGrades: build.mutation({
      query: (examId) => ({
        url: `admin/exams/${examId}/grades/publish`,
        method: "POST",
      }),
    }),

    // 🔹 Classrooms that belong to the exam’s class type (for dropdown in grades page)
    listExamClassrooms: build.query({
      query: (examId) => `admin/exams/${examId}/classrooms`,
    }),

    /* =========================
     * Class Types (for bulk-upsert UI dropdowns)
     * =======================*/
    listClassTypes: build.query({
      query: () => `admin/class-types`,
    }),
    listClassTypeSubjects: build.query({
      query: (classTypeId) => `admin/class-types/${classTypeId}/subjects`,
    }),
  }),
});

// ── Hooks ────────────────────────────────────────────────────────────────────
export const {
  // Exam Terms
  useListExamTermsQuery,
  useCreateExamTermMutation,
  usePublishExamTermMutation,

  // Exams
  useListExamsQuery,
  usePublishExamMutation,
  useBulkUpsertExamsMutation,

  // Grades
  useGetExamStudentsQuery,
  useBulkUpsertExamGradesMutation,
  usePublishExamGradesMutation,

  // Classrooms for an exam
  useListExamClassroomsQuery,

  // Class Types + Subjects (for dropdowns in bulk upsert page)
  useListClassTypesQuery,
  useListClassTypeSubjectsQuery,
} = examsApi;
