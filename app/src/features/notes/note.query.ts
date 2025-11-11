
// export const useNotesInfiniteQuery = ({ debouncedSearch }: { debouncedSearch: string }) =>
//     useInfiniteQuery<
//         any,    // TData: type of a single page
//         Error, // TError
//         // TNote[],   // TQueryFnData: return type of queryFn
//         any,   // TQueryFnData: return type of queryFn
//         readonly unknown[], // TQueryKey
//         number          // TPageParam
//     >({
//         queryKey: ['notes', 'infinite', debouncedSearch],
//         queryFn: async ({ pageParam = 0 }) => {
//             return NoteRepo.getPaginated(pageParam, PAGE_SIZE, debouncedSearch);
//         },
//         getNextPageParam: (lastPage, allPages) => {
//             if (lastPage.length < PAGE_SIZE) return undefined;
//             return allPages.length; // next page index
//         },
//         initialPageParam: 0, // required

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NoteRepo, T_Note } from "./note.repo";

//     })


export const useAddNoteMutation = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ note_title, note_content, color, category_id }: T_Note) => NoteRepo.create({note_title, note_content, color, category_id}),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
        onError: (error) => console.log("ERror", error)
    });
}