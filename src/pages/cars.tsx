import {Grid} from '@material-ui/core';
import {GetServerSideProps} from 'next';
import {useRouter} from 'next/router';
import {stringify} from 'querystring';
import useSWR from "swr";
import deepEqual from "fast-deep-equal";
import {useState} from "react";
import Search from '.';
import {CarModel} from '../../api/Car';
import getMakes, {Make} from '../database/getMakes';
import getModels, {Model} from '../database/getModels';
import {getPaginatedCars} from '../database/getPaginatedCars';
import {getAsString} from '../utils/getAsString';
import {CarPagination} from "../components/CarPagination";
import {CarCard} from "../components/CarCard";


export interface CarsListProps {
    makes: Make[];
    models: Model[];
    cars: CarModel[];
    totalPages: number;
}

export default function CarsList({makes, models, cars, totalPages}: CarsListProps) {
    const {query} = useRouter();
    const page = +getAsString(query.page) || 1; // page could be string or array
    const [serverQuery] = useState(query);
    const {data} = useSWR('/api/cars?' + stringify(query), {
        dedupingInterval: 15000,
        // when first loading, getServerSidePros would be called, then we use initial data here to
        // avoid redundand call. However, when we change to another page, we need to call /api/cars based on the query
        initialData: deepEqual(query, serverQuery)
            ? {cars, totalPages}
            : undefined,
    });
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={5} md={3} lg={2}>
                <Search singleColumn makes={makes} models={models} />
            </Grid>
            <Grid container item xs={12} sm={7} md={9} lg={10} spacing={4}>
                <Grid item xs={12}>
                    <CarPagination totalPages={data?.totalPages} />
                </Grid>
                {(data?.cars || []).map((car) => (
                    <Grid key={car.id} item xs={12} sm={6}>
                        <CarCard car={car} />
                    </Grid>
                ))}
                <Grid item xs={12}>
                    <CarPagination totalPages={data?.totalPages} />
                </Grid>
            </Grid>
        </Grid>
    )
}


export const getServerSideProps: GetServerSideProps = async ctx => {
    const make = getAsString(ctx.query.make);
    const [makes, models, pagination] = await Promise.all([getMakes(), getModels(make), getPaginatedCars(ctx.query)]);
    return {
        props: {makes, models, cars: pagination.cars, totalPages: pagination.totalPages},
    }

}
