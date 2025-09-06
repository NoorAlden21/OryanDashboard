import { apiSlice } from "../services/apiSlice";
import Cookies from "js-cookie";

const SubjectSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllSubject: builder.query({
      query: () => ({
        url: `admin/subjects`,
        method: "GET",
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      }),
      providesTags: ["Subjects"],
    }),

    getSubjectById: builder.query({
      query: (id) => ({
        url: `admin/subjects/${id}`,
        method: "GET",
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      }),
      providesTags: (result, error, id) => [{ type: "Subject", id }],
    }),

    addSubject: builder.mutation({
      query: (newSubjectData) => ({
        url: `admin/subjects`,
        method: "POST",
        body: newSubjectData,
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Subjects"],
    }),

   


updateSubject: builder.mutation({
  query: ({ id, ...payload }) => {
    console.log("🚀 body المرسل:", Cookies.get("token"));
        console.log("🚀 body المرسل:", id);
    console.log("🚀 body المرسل:", JSON.stringify(payload));

    return {
      url: `admin/subjects/${id}`,
      method: "PATCH",
      body: JSON.stringify(payload), 
      headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "application/json",
        
      },
    };
  },
  invalidatesTags: (result, error, { id }) => ["Subjects", { type: "Subject", id }],
}),



   
    deleteSubject: builder.mutation({
      query: (id) => ({
        url: `admin/subjects/${id}`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      }),
      invalidatesTags: ["Subjects"],
    }),


  }),
});

export const {
  useGetAllSubjectQuery,
  useDeleteSubjectMutation,
  useGetSubjectByIdQuery,
  useAddSubjectMutation,
  useUpdateSubjectMutation, 
} = SubjectSlice;
