import { apiSlice } from "../services/apiSlice";
import Cookies from "js-cookie";

const AttendanceSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAttendanceClassrooms: builder.query({
      query: () => ({
        url: `admin/attendance/students`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }),
      providesTags: ["Attendance"],
    }),

    getStudentsByClassroom: builder.query({
      query: (classroomId) => ({
        url: `admin/classrooms/${classroomId}/students`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }),
      providesTags: (result, error, classroomId) => [{ type: 'ClassroomStudents', id: classroomId }],
    }),

    recordStudentAttendance: builder.mutation({
      query: (attendanceData) => ({
        url: `admin/attendance/students`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: attendanceData,
      }),
      invalidatesTags: ["Attendance"],
    }),
  }),
});

export const {
  useGetAttendanceClassroomsQuery,
  useGetStudentsByClassroomQuery,
  useRecordStudentAttendanceMutation,
} = AttendanceSlice;
