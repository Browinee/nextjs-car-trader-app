import {Grid} from '@material-ui/core';
import { PaginationRenderItemParams } from '@material-ui/lab';
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';
import {GetServerSideProps} from 'next';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {ParsedUrlQuery} from 'querystring';
import Search from '.';
import {CarModel} from '../../api/Car';
import getMakes, {Make} from '../database/getMakes';
import getModels, {Model} from '../database/getModels';
import {getPaginatedCars} from '../database/getPaginatedCars';
import {getAsString} from '../utils/getAsString';


export interface CarsListProps {
    makes: Make[];
    models: Model[];
    cars: CarModel[];
    totalPages: number;
}

export default function CarsList({makes, models, cars, totalPages}: CarsListProps) {
    const {query} = useRouter();
    const page = +getAsString(query.page) || 1; // page could be string or array
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={5} md={3} lg={2}>
                <Search singleColumn makes={makes} models={models}/>
            </Grid>
            <Grid item xs={12} sm={7} md={9} lg={10}>
                <pre>{
                    JSON.stringify({
                        cars, totalPages
                    }, null, 4)
                }</pre>
                <Pagination
                    page={page}
                    count={totalPages}
                    renderItem={(item) => (
                        <PaginationItem
                            query={query}
                            component={MaterialLink}
                            item={item}
                            {...item}
                        />
                    )}
                />
            </Grid>
        </Grid>
    )
}

export interface MaterialLinkProps {
    item: PaginationRenderItemParams;
    query: ParsedUrlQuery;
}

export function MaterialLink({item, query, ...props}: MaterialLinkProps) {
    console.log("prpos", {item, query});
    return (
        <Link href={{
            pathname: "/cars",
            query: {
                ...query,
                page: item.page
            }
        }}>
            <a {...props}></a>
        </Link>
    )
}


export const getServerSideProps: GetServerSideProps = async ctx => {
    const make = getAsString(ctx.query.make);
    const [makes, models, pagination] = await Promise.all([getMakes(), getModels(make), getPaginatedCars(ctx.query)]);
    return {
        props: {makes, models, cars: pagination.cars, totalPages: pagination.totalPages},
    }

}
