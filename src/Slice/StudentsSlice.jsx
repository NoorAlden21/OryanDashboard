import { apiSlice } from "../services/apiSlice";
import Cookies from "js-cookie";
const StudentsSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    deleteStudent: builder.mutation({
      query: (id) => ({
        url: `admin/students/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }),
      invalidatesTags: ["Students"],
    }),

    getStudents: builder.query({
      query: () => {
        return {
          url: `admin/students`,
          method: "GET",
          headers: { Authorization: `Bearer ${Cookies.get("token")} ` },
        };
      },
      providesTags: ["Students"],
    }),

    addStudent: builder.mutation({
      query: (studentData) => ({
        url: `admin/students`,
        method: "POST",
        body: studentData,
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Students"],
    }),

    getStudentById: builder.query({
      query: (id) => {
        console.log("id", id);
        return {
          url: `admin/students/${id}`,
          method: "GET",
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        };
      },

      providesTags: (result, error, id) => [{ type: "Student", id }],
    }),





updateStudent: builder.mutation({
  query: ({ id, ...studentData }) => ({
    url: `admin/students/${id}`,
    method: "PATCH",
    body: studentData,
    headers: {
      Authorization: `Bearer ${Cookies.get("token")}`,
      "Content-Type": "application/json",
    },
  }),
  
  
  invalidatesTags: (result, error, { id }) => [
    { type: "Student", id },
    "Students", 
  ],
}),
  }),




  
});

export const {
  useGetStudentsQuery,
  useAddStudentMutation,
  useGetStudentByIdQuery,
    useDeleteStudentMutation,
    useUpdateStudentMutation
} = StudentsSlice;
