import { Response } from 'express';
import { DocumentQuery } from 'mongoose';

const paginate = (query: DocumentQuery<any, any>, res: Response, page: string, pageSize: string) => {
    const pageParsed = parseInt(page, 10);
    const pageSizeParsed = parseInt(pageSize, 10);
    const queryConstructor = query.toConstructor();

    const countPromise = (new queryConstructor()).count();
    const resultsPromise = (new queryConstructor())
        .skip((pageParsed - 1) * pageSizeParsed)
        .limit(pageSizeParsed);

    Promise.all([
        countPromise,
        resultsPromise,
    ]).then(response => {
        const count = response[0];
        const results = response[1];

        res
            .header('X-Pagination-TotalRecords', count.toString())
            .header('X-Pagination-TotalPages', Math.ceil(count / pageSizeParsed).toString())
            .header('X-Pagination-Page', page)
            .header('X-Pagination-PageSize', pageSize)
            .send(results);
    }, err => {
        res.status(400).send(err);
    });
};

export default paginate;
