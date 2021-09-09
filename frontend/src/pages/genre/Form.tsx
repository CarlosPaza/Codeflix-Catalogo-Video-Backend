import { ButtonProps } from '@material-ui/core/Button';
import { Box, Button, makeStyles, MenuItem, TextField, Theme } from '@material-ui/core';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import categoryHttp from "../../util/http/category-http";
import genreHttp from '../../util/http/genre-http';
import { useEffect, useState } from 'react';
import * as yup from '../../util/vendor/yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useHistory, useParams } from 'react-router';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme: Theme) => {
    return {
        submit: {
            margin: theme.spacing(1)
        }
    }
});

const validationSchema = yup.object().shape({
    name: yup.string()
        .label('Nome')
        .required()
        .max(255),
    categories_id: yup.array()
        .label('Categorias')
        .required(),
});

export const Form = () => {

    const classes = useStyles();
    const snackbar = useSnackbar();
    const history = useHistory();
    const {id} : any = useParams();
    const [genre, setGenre] = useState<{id: string} | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [categories, setCategories] = useState<any[]>([]);
    const {handleSubmit, getValues, formState: { errors }, watch, setValue, reset, control} = useForm<{name, categories_id}>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            categories_id: []
        }
    });

    const buttonProps: ButtonProps = {
        className: classes.submit,
        color: "secondary",
        variant: "contained",
        disabled: loading
    };

    useEffect(() => {
        if (!id) {
            return;
        }
        setLoading(true);
        genreHttp
            .get(id)
            .then(({data}) => {
                setGenre(data.data)
                const categories_id = data.data.categories.map(category => category.id);
                reset({...data.data, categories_id})
            })
            .finally(() => setLoading(false))
    }, []);

    useEffect(() => {
        categoryHttp
            .list()
            .then(({data}) => setCategories(data.data));
    }, []);

    function onSubmit(formData, event) {
        setLoading(true);
        const http = !genre
            ? genreHttp.create(formData)
            : genreHttp.update(genre.id, formData)
            
            http
                .then(({data}) => {
                    snackbar.enqueueSnackbar(
                        'Gênero salvo com sucesso',
                        {variant: 'success'}
                    );
                    setTimeout(() => {
                        event
                            ? (
                                id
                                    ? history.replace(`/genres/${data.data.id}/edit`)
                                    : history.push(`/genres/${data.data.id}/edit`)
                            )
                            : history.push('/genres')
                    });
                })
                .catch((error) => {
                    console.log(error);
                    snackbar.enqueueSnackbar(
                        'Não foi possível salvar o gênero',
                        {variant: 'error'}
                    )
                })
                .finally(() => setLoading(false));
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
                name="name"
                control={control}
                render={({ field }) => (
                <TextField
                    label="Nome"
                    fullWidth
                    variant="outlined"
                    disabled={loading}
                    error={errors.name !== undefined}
                    helperText={errors.name && errors.name.message}
                    InputLabelProps={{shrink: true}}
                    {...field}
                />
                )}
            />
            <TextField
                select
                name="categories_id"
                value={watch('categories_id')}
                label="Categorias"
                margin={'normal'}
                variant={'outlined'}
                fullWidth
                onChange={(e) => {
                    setValue('categories_id', e.target.value);
                }}
                SelectProps={{
                    multiple: true
                }}
                disabled={loading}
                error={errors.categories_id !== undefined}
                helperText={errors.categories_id && errors.categories_id.message}
                InputLabelProps={{shrink: true}}
            >
                <MenuItem value="" disabled>
                    <em>Selecione categorias</em>
                </MenuItem>
                {
                    categories.map(
                        (category, key) => (
                            <MenuItem key={key} value={category.id}>{category.name}</MenuItem>
                        )
                    )
                }
            </TextField>
            <Box dir={"rtl"}>
                <Button {...buttonProps} onClick={() => onSubmit(getValues(), null)}>Salvar</Button>
                <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
            </Box>
        </form>
    );
};