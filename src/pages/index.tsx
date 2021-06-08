import {GetServerSideProps} from "next";
import React from 'react';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {Formik, Field, Form, FormikHelpers} from 'formik';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {useRouter} from "next/router";
import {Paper, Grid, MenuItem, Button} from "@material-ui/core";
import getMakes, {Make} from "../database/getMakes";
import getModels from "../database/getModels";
import {getAsString} from "../utils/getAsString";

const useStyles = makeStyles((theme: Theme) => ({
    paper: {
        margin: "auto",
        maxWidth: 500,
        padding: theme.spacing(3),
    },
}));


export interface HomeProps {
    makes: Make[];
}

const ALL = "all";
const PRICES = [5000, 10000, 15000, 20000];

export default function Home({makes}: HomeProps) {
    const classes = useStyles();
    const {query: {make, model, minPrice, maxPrice}} = useRouter();
    const initialValues = {
        make: getAsString(make) || ALL,
        model: getAsString(model) || ALL,
        minPrice: getAsString(minPrice) || ALL,
        maxPrice: getAsString(maxPrice) || ALL,
    }

    return (
        <Formik initialValues={initialValues} onSubmit={() => {
        }}>
            <Paper elevation={5} className={classes.paper}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
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
                    <Grid item xs={12} sm={6}>
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
                    <Grid item xs={12} sm={6}>
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
                    <Grid item xs={12} sm={6}>
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
                </Grid>
                <Grid item xs={12}>
                    <Button type="submit" variant="outlined">Search for cars!</Button>
                </Grid>
            </Paper>
        </Formik>);
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const make = getAsString(ctx.query.make);
    // go to db directily.
    const [makes, models] = await Promise.all([getMakes(), getModels(make)]);
    return {props: {makes, models}}
}