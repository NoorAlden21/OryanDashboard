// src/services/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: [
    "Complaint",
    // ↓↓↓ جديدة
    "ExamTerms",
    "ExamTerm",
    "Exams",
    "Exam",
    "Grades",
  ],
  baseQuery: fetchBaseQuery({
    baseUrl: "http://192.168.137.234:8000/api/",
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      const token = Cookies.get("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: () => ({}),
});
