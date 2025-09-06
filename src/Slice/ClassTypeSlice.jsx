import { apiSlice } from "../services/apiSlice";
import Cookies from "js-cookie";
const ClassTypeSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getClassType: builder.mutation({
      query: () => ({
        url: `admin/class-types`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }),
    }),

     addClassType: builder.mutation({
          query: (data) => ({
            url: `admin/class-types`,
            method: "POST",
            body: data,
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
              "Content-Type": "application/json",
            },
          }),
        }),


         deleteClassType: builder.mutation({
              query: (id) => ({
                url: `admin/class-types/${id}`,
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${Cookies.get("token")}`,
                },
              }),
            }),






  }),
});

export const { useGetClassTypeMutation , useAddClassTypeMutation , useDeleteClassTypeMutation} = ClassTypeSlice;
