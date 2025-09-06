import { apiSlice } from './../services/apiSlice'; 
import Cookies from "js-cookie"
export const LoginSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({ 
    login: builder.mutation({
      query: (loginBody) => {
        return {
          url: `login`,
          method: "POST",
          body: loginBody,
        };
      },
    }),  
  }),
});

// eslint-disable-next-line react-refresh/only-export-components
export const {
useLoginMutation
} = LoginSlice;
