



import { apiSlice } from "../services/apiSlice"; 
import Cookies from "js-cookie";

const SchedulesSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllSchedules: builder.query({
      query: () => ({
        url: `admin/schedules`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }),
      providesTags: ["Schedules"], 
    }),

    getSchedulesByClassroom: builder.query({
      query: (classroomId) => ({
        url: `admin/classrooms/${classroomId}/schedules`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }),
      providesTags: (result, error, classroomId) => [{ type: 'Schedules', id: classroomId }],
    }),

    getClassSubjectTeachers: builder.query({
      query: () => ({
        url: `admin/class-subject-teachers`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }),
    }),

    addSchedule: builder.mutation({
      query: (data) => ({
        url: `admin/schedules`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: data,
      }),
      invalidatesTags: ["Schedules"], 
    }),

       deleteSchedule: builder.mutation({
      query: (scheduleId) => ({
        url: `admin/schedules/${scheduleId}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }),
      // عند نجاح الحذف، قم بإلغاء صلاحية الـ cache لجداول الحصص
      // هذا سيؤدي إلى إعادة جلب البيانات تلقائياً وتحديث الواجهة
      invalidatesTags: ['Schedules'], 
    }),




  }),
});

export const {
  useGetAllSchedulesQuery,
  useGetSchedulesByClassroomQuery, 
  useGetClassSubjectTeachersQuery,
  useAddScheduleMutation,
    useDeleteScheduleMutation,

} = SchedulesSlice;
