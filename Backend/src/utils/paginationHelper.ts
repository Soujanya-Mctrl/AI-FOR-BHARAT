import { ParsedQs } from 'qs';

export const buildPaginationQuery = (query: ParsedQs) => {
    const page = Math.max(1, parseInt(query.page as string) || 1);
    let limit = parseInt(query.limit as string) || 10;
    limit = Math.min(100, Math.max(1, limit)); // Max 100, Min 1

    const skip = (page - 1) * limit;

    // Handle sorting, e.g., ?sort=-createdAt
    let sort: any = { createdAt: -1 }; // Default sort
    if (query.sort && typeof query.sort === 'string') {
        const sortFields = query.sort.split(',').reduce((acc: any, field) => {
            if (field.startsWith('-')) {
                acc[field.substring(1)] = -1;
            } else {
                acc[field] = 1;
            }
            return acc;
        }, {});
        sort = sortFields;
    }

    return { skip, limit, sort, page };
};

export const buildPaginationResponse = (total: number, page: number, limit: number) => {
    const totalPages = Math.ceil(total / limit);
    return {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
    };
};
