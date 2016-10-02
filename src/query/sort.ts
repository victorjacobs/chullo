import { DocumentQuery } from 'mongoose';

type SortDirection = "ascending" | "descending" | "asc" | "desc";

const sort = (query: DocumentQuery<any, any>, sortField: string, direction: SortDirection): DocumentQuery<any, any> => {
    const sortOptions = {};
    sortOptions[sortField] = direction;
    return query.
        sort(sortOptions);
};

export default sort;
