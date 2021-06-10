import { PaginationRenderItemParams } from '@material-ui/lab';
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { forwardRef } from 'react';
import { getAsString } from '../utils/getAsString';

export function CarPagination({ totalPages }: { totalPages: number }) {
    const { query } = useRouter();

    return (
        <Pagination
            page={parseInt(getAsString(query.page) || '1')}
            count={totalPages}
            renderItem={(item) => (
                <PaginationItem
                    component={MaterialUiLink}
                    query={query}
                    item={item}
                    {...item}
                />
            )}
        />
    );
}

export interface MaterialLinkProps {
    item: PaginationRenderItemParams;
    query: ParsedUrlQuery;
}

const MaterialUiLink = forwardRef<HTMLAnchorElement, MaterialLinkProps>(
    ({ item, query, ...props }, ref) => (
        <Link
            href={{
                pathname: '/cars',
                query: { ...query, page: item.page },
            }}
            // we don't want every page change, we call getServerSideProps again
            // because it call db every time.
            shallow
        >
            <a {...props} ref={ref}></a>
        </Link>
    )
);