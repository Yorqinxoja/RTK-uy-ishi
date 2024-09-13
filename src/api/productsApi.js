import { api } from "./index"; 


const productsApi = api.injectEndpoints({
  endpoints: (build) => ({

    getProducts: build.query({
      query: () => ({
        url: "/products", 
      }),
      providesTags: ["PRODUCTS"],
    }),

    updateProduct: build.mutation({
      query: ({ id, title }) => ({
        url: `/products/${id}`,
        method: "PUT", 
        body: { title }, 
      }),
      invalidatesTags: ["PRODUCTS"], 
    }),
  }),
});

export const { useUpdateProductMutation, useGetProductsQuery } = productsApi;

export default productsApi;
