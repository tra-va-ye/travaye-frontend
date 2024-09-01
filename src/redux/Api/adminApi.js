import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryForAuth } from "../queryInterceptors";
// import { updateUser, logout } from "../Slices/authSlice";

export const AdminApi = createApi({
    reducerPath: "admin",
    baseQuery: baseQueryForAuth,
    refetchOnReconnect: true,
    tagTypes: ["Profile", "Admin"],
    endpoints: (builder) => ({
        verifyBusiness: builder.mutation({
            query: ({ isVerified, id }) => ({
                url: `admin/business/${id}?isVerified=${isVerified}`,
                method: "PUT"
            }),
            invalidatesTags: ["Businesses"]
        }),
        getAllBusinesses: builder.query({
            query: () => ({
                url: 'admin/business',
                method: "GET"
            }),
            providesTags: ["Businesses"],
        }),
        getBusinessById: builder.query({
            query: ({ id }) => ({
                url: `admin/business/${id}`,
                method: "GET"
            }),
            providesTags: ["Admin"],
        }),
    }),
});

export const {
    useVerifyBusinessMutation,
    useGetAllBusinessesQuery,
    useGetBusinessByIdQuery
} = AdminApi;
