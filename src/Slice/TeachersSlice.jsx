import { apiSlice } from "../services/apiSlice";
import Cookies from "js-cookie"
const TeachersSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({


    deleteTeacher: builder.mutation({
  query: (id) => ({
    url: `admin/teachers/${id}`,
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${Cookies.get("token")}`
    }
  }),
  invalidatesTags: ["Teachers"]
}),
  
    getTeachers: builder.query({
      query: () => {
        return {
          url: `admin/teachers`,
          method: "GET",
          headers: {"Authorization" : `Bearer ${Cookies.get("token")} `}
        };
      },
      providesTags:["Teachers"]
    }),

  addTeachers: builder.mutation({
  query: (teachersData) => {
    console.log("teachersData",Cookies.get("token"))
    return {
      
      url: `admin/teachers`,
      method: "POST",
      body: teachersData,
    headers: {
  Authorization: `Bearer ${Cookies.get("token")}`,
  'Content-Type': 'application/json',
  'Accept': 'application/json', 
},
    };
  },
  invalidatesTags: ["Teachers"]
}),



 getTeacherById: builder.query({
      query: (id) => {
        console.log("idrrrrrrrrrrrr", id);
        return {
          url: `admin/teachers/${id}`,
          method: "GET",
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        };
      },

      providesTags: (result, error, id) => [{ type: "Teachers", id }],
    }),




updateTeacher: builder.mutation({
  query: ({ id, ...teacherData }) => ({
    url: `admin/teachers/${id}`,
    method: "PATCH", 
    body: teacherData,
    headers: {
      Authorization: `Bearer ${Cookies.get("token")}`,
      "Content-Type": "application/json",
    },
  }),
  
 
  invalidatesTags: (result, error, { id }) => [
    "Teachers", 
    { type: "Teachers", id }
  ],
}),



   getScheduleByTeacherId: builder.query({
      query: (teacherId) => ({
        url: `admin/teachers/${teacherId}/schedules`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }),
      providesTags: (result, error, teacherId) => [{ type: 'TeacherSchedule', id: teacherId }],
    }),

  }),
});

export const {
useGetTeachersQuery,
  useDeleteTeacherMutation,
  useAddTeachersMutation,
  useGetTeacherByIdQuery,
  useUpdateTeacherMutation,
    useGetScheduleByTeacherIdQuery, 

} = TeachersSlice;
