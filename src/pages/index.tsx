import {GetServerSideProps} from "next";
import React from 'react';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {Field, Form, Formik, useField, useFormikContext} from 'formik';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select, {SelectProps} from '@material-ui/core/Select';
import useSWR from 'swr';
import router, {useRouter} from "next/router";
import {Button, Grid, MenuItem, Paper} from "@material-ui/core";
import getMakes, {Make} from "../database/getMakes";
import getModels, {Model} from "../database/getModels";
import {getAsString} from "../utils/getAsString";

const useStyles = makeStyles((theme: Theme) => ({
    paper: {
        margin: "auto",
        maxWidth: 500,
        padding: theme.spacing(3),
    },
}));


export interface searchProps {
    makes: Make[];
    models: Model[];
    singleColumn?: boolean;
}

const ALL = "all";
const PRICES = [500, 1000, 5000, 15000, 25000, 50000, 250000];

export default function Search({makes, models, singleColumn}: searchProps) {
    const classes = useStyles();
    const {query: {make, model, minPrice, maxPrice}} = useRouter();
    const initialValues = {
        make: getAsString(make) || ALL,
        model: getAsString(model) || ALL,
        minPrice: getAsString(minPrice) || ALL,
        maxPrice: getAsString(maxPrice) || ALL,
    }
    const handleSubmit = (values) => {
        router.push({
            pathname: "/cars",
            query: {...values, page: 1},
        }, undefined, {shallow: true});
    };
    const smValue = singleColumn ? 12 : 6;
    return (
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {({values}) => (
                <Form>
                    <Paper elevation={5} className={classes.paper}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={smValue}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel id="search-make">Make</InputLabel>
                                    <Field name="make" as={Select} label="Make" labelId="search-make">
                                        <MenuItem value="all">
                                            <em>All Makes</em>
                                        </MenuItem>
                                        {
                                            makes.map((make) => {
                                                return (
                                                    <MenuItem key={make.make} value={make.make}>
                                                        {`${make.make} (${make.count})`}
                                                    </MenuItem>
                                                );
                                            })
                                        }
                                    </Field>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={smValue}>
                                <ModelSelectField make={values.make} name="model" models={models}/>
                            </Grid>
                            <Grid item xs={12} sm={smValue}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel id="search-min-price">Min Price</InputLabel>
                                    <Field name="minPrice" as={Select} label="Min Price" labelId="search-min-price">
                                        <MenuItem value="all">
                                            <em>No Min</em>
                                        </MenuItem>
                                        {
                                            PRICES.map((price) => {
                                                return (
                                                    <MenuItem key={price + "Min"} value={price}>
                                                        {price}
                                                    </MenuItem>
                                                );
                                            })
                                        }
                                    </Field>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={smValue}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel id="search-max-price">Max Price</InputLabel>
                                    <Field name="maxPrice" as={Select} label="Max Price" labelId="search-Max-price">
                                        <MenuItem value="all">
                                            <em>No Max</em>
                                        </MenuItem>
                                        {
                                            PRICES.map((price) => {
                                                return (
                                                    <MenuItem key={price + "Max"} value={price}>
                                                        {price}
                                                    </MenuItem>
                                                );
                                            })
                                        }
                                    </Field>
                                </FormControl>
                            </Grid>


                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                >
                                    Search
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Form>
            )}
        </Formik>
    );
}

interface ModelSelectProps extends SelectProps {
    name: string;
    models: Model[];
    make: string;
}

export function ModelSelectField({models, name, make, ...props}: ModelSelectProps) {
    const [field] = useField({
        name,
    });
    const {setFieldValue} = useFormikContext();
    const {data} = useSWR<Model[]>(`/api/models?make=${make}`, {
        dedupingInterval: 60 * 1000, // prevent sending same request within 60s
        onSuccess: (newValues) => {
            const isMakeChanged: boolean = !newValues.map(model => model.model).includes(field.value);
            if (isMakeChanged) {
                // make field.value = "all"
                setFieldValue("model", ALL);
            }
        },

    });
    const newModels = data || models;
    return (
        <FormControl fullWidth variant="outlined">
            <InputLabel id="search-max-price">Max Price</InputLabel>
            <Select name={name} label="Model" labelId="search-model" {...field} {...props}>
                <MenuItem value="all">
                    <em>All Models</em>
                </MenuItem>
                {
                    newModels.map((model) => {
                        return (
                            <MenuItem key={model.model} value={model.model}>
                                {`${model.model} (${model.count})`}
                            </MenuItem>
                        );
                    })
                }
            </Select>
        </FormControl>
    )
}


export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const make = getAsString(ctx.query.make);
    // go to db directly.
    const [makes, models] = await Promise.all([getMakes(), getModels(make)]);
    return {props: {makes, models}}
}
