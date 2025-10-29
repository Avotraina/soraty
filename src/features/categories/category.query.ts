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



export const useCategoriesInfiniteQuery = () =>
    useInfiniteQuery<
        T_Category[],   // TData: type of a single page
        Error,          // TError
        T_Category[],   // TQueryFnData: return type of queryFn
        readonly unknown[], // TQueryKey
        number          // TPageParam
    >({
        queryKey: ['categories', 'infinite'],
        queryFn: async ({ pageParam = 0 }) => {
            return CategoryRepo.getPaginated(pageParam, PAGE_SIZE);
        },
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length < PAGE_SIZE) return undefined;
            return allPages.length; // next page index
        },
        initialPageParam: 0, // required
    });


export const useAddUserMutation = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ category_name, color }: T_Category) => CategoryRepo.create(category_name, color),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] })
    });
}


// Update user
export const useUpdateUserMutation = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, category_name, color }: T_Category) =>
            CategoryRepo.update(id as string, category_name, color),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['categories', 'infinite'] }),
    });
};


export const useDeleteUserMutation = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => CategoryRepo.remove(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
    });

}