import { apiSlice } from "../services/apiSlice";
import Cookies from "js-cookie";
const ClassTypeSubjectSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getClassTypeSubject: builder.mutation({
      query: () => ({
        url: `admin/teachers/class-type-subjects/grouped`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }),
    }),
  }),
});

export const { useGetClassTypeSubjectMutation } = ClassTypeSubjectSlice;
