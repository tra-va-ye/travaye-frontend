import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryForAuth } from "../queryInterceptors";
import { updateUser, logout } from "../Slices/authSlice";

export const AuthApi = createApi({
  reducerPath: "profile",
  baseQuery: baseQueryForAuth,
  refetchOnReconnect: true,
  tagTypes: ["Profile", "User"],
  endpoints: (builder) => ({
    userLogin: builder.mutation({
      query: (body) => ({
        url: "user/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Profile", "User"],
    }),
    businessLogin: builder.mutation({
      query: (body) => ({
        url: "business/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Profile", "User"],
    }),
    userRegister: builder.mutation({
      query: (body) => ({
        url: "user",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),
    businessRegister: builder.mutation({
      query: (body) => ({
        url: "business",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),
    codeVerify: builder.mutation({
      query: ({ code, userType }) => ({
        url: `${userType}/verify`,
        method: "POST",
        body: { code },
      }),
    }),
    getMe: builder.query({
      query: ({ userType }) => ({
        url: userType,
      }),
      providesTags: ["User"],
      onQueryStarted(id, { dispatch, queryFulfilled }) {
        queryFulfilled
          .then((apiResponse) => {
            dispatch(updateUser(apiResponse?.data?.user));
          })
          .catch(() => {
            dispatch(logout());
          });
      },
    }),
    completeBusinessRegistration: builder.mutation({
      query: (body) => ({
        url: "business/complete",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),
    deleteMyProfile: builder.mutation({
      query: ({ userType, id }) => ({
        url: `${userType}/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Profile", "User"],
    }),
    updateProfilePhoto: builder.mutation({
      query: (body) => ({
        url: "user/profile-photo",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Profile", "User"],
    }),
    updateUserProfile: builder.mutation({
      query: (body) => ({
        url: "user/edit-profile",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Profile", "User"],
    }),
    updateBusinessProfile: builder.mutation({
      query: (body) => ({
        url: "business/edit-profile",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Profile", "User"],
    }),
    resendVerificationMail: builder.mutation({
      query: () => ({
        url: "user/resend-verification",
        method: "POST",
        body: {},
      }),
    }),
    forgotPassword: builder.mutation({
      query: (body) => ({
        url: "user/forgot-password",
        body,
        method: "POST",
      }),
    }),
    resetPassword: builder.mutation({
      query: (body) => ({
        url: "user/reset-password",
        body,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetMeQuery,
  useUserLoginMutation,
  useBusinessLoginMutation,
  useUserRegisterMutation,
  useBusinessRegisterMutation,
  useCodeVerifyMutation,
  useCompleteBusinessRegistrationMutation,
  useUpdateProfilePhotoMutation,
  useUpdateUserProfileMutation,
  useUpdateBusinessProfileMutation,
  useResendVerificationMailMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useDeleteMyProfileMutation
} = AuthApi;
