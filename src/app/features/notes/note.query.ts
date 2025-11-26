
// import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NoteRepo, PAGE_SIZE, T_Note } from "./note.repo";

export const useNotesInfiniteQuery = (filters: {
        search: string;
        color?: string | null | undefined;
        category?: string | null | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
}) =>
    useInfiniteQuery<
        any,    // TData: type of a single page
        Error, // TError
        // TNote[],   // TQueryFnData: return type of queryFn
        any,   // TQueryFnData: return type of queryFn
        readonly unknown[], // TQueryKey
        number          // TPageParam
    >({
        // queryKey: ['notes', 'infinite', debouncedSearch, filters.category, filters.color, filters.endDate, filters.startDate],
        queryKey: ['notes', 'infinite', filters],
        queryFn: async ({ pageParam = 0 }) => {
            return NoteRepo.getPaginated(pageParam, PAGE_SIZE, filters);
        },
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage?.length < PAGE_SIZE) return undefined;
            return allPages.length; // next page index
        },
        initialPageParam: 0, // required



    })


export const useAddNoteMutation = () => {
    const qc = useQueryClient();
    const created_at = new Date().toISOString()
    return useMutation({
        mutationFn: ({ note_title, note_content, color, category_id, reminder_date, reminder_time }: T_Note) => NoteRepo.create({ note_title, note_content, color, category_id, created_at, reminder_date, reminder_time }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
        onError: (error) => console.log("ERror", error)
    });
}