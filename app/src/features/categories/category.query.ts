import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CategoryRepo, PAGE_SIZE, T_Category } from "./category.repo";

export const useCategoriesQuery = () =>
    useQuery({
        queryKey: ['categories'],
        queryFn: CategoryRepo.getAll
    })


// // Infinite scroll query
// export const useUsersInfiniteQuery = () =>
//     useInfiniteQuery<T_Category[], Error, InfiniteData<T_Category[]>, [number]>({
//         queryKey: ['categories', 0],
//         initialPageParam: 0,
//         queryFn: async ({ pageParam }) => {
//             return CategoryRepo.getPaginated(pageParam, PAGE_SIZE);
//         },
//         getNextPageParam: (lastPage, allPages) => {
//             // If last page is less than page size, no more pages
//             if (lastPage.length < PAGE_SIZE) return undefined;
//             return allPages.length; // next page index
//         },
//     });



export const useCategoriesInfiniteQuery = (search: string) =>
    useInfiniteQuery<
        // T_Category[],   // TData: type of a single page
        any,   // TData: type of a single page
        Error,          // TError
        // T_Category[],   // TQueryFnData: return type of queryFn
        any,   // TQueryFnData: return type of queryFn
        readonly unknown[], // TQueryKey
        number          // TPageParam
    >({
        queryKey: ['categories', 'infinite', search],
        queryFn: async ({ pageParam = 0 }) => {
            return CategoryRepo.getPaginated(pageParam, PAGE_SIZE, search);
        },
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length < PAGE_SIZE) return undefined;
            return allPages.length; // next page index
        },
        initialPageParam: 0, // required
    });


export const useAddCategoryMutation = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ category_name, color }: Partial<T_Category>) => CategoryRepo.create(category_name as string, color as string),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
        onError: (error) => console.log("ERror", error)
    });
}


// Update user
export const useUpdateCategoryMutation = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, category_name, color }: T_Category) =>
            CategoryRepo.update(id as string, category_name, color),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['categories', 'infinite'] }),
    });
};


export const useDeleteCategoryMutation = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => CategoryRepo.remove(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
    });

}