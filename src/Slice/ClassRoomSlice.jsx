import { apiSlice } from "../services/apiSlice";
import Cookies from "js-cookie";
const ClassRoomSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllClassRoom: builder.mutation({
      query: () => ({
        url: `admin/classrooms`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }),
    }),


     getClassroomTeachers: builder.query({
      
      query: (classroomId) => ({
        url: `admin/classrooms/${classroomId}/assign-teachers`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }),
    }),

       assignTeachersToClassroom: builder.mutation({
      query: ({ classroomId, assignments }) => ({
        url: `admin/classrooms/${classroomId}/assign-teachers`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: { assignments },
      }),
    }),
  

     
    
 
    createClassRoom: builder.mutation({
  query: (data) => ({
    url: `admin/classrooms`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
    body: data,
  }),
  transformResponse: (response) => {
    console.log("استجابة إنشاء الصف:", response);
    return response;
  },
}),
  

  }),
});

export const { useGetAllClassRoomMutation ,useGetClassroomTeachersQuery ,useAssignTeachersToClassroomMutation,useCreateClassRoomMutation} = ClassRoomSlice;
