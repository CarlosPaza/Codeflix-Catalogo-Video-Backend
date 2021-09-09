import { ButtonProps } from '@material-ui/core/Button';
import { Box, Button, Checkbox, FormControlLabel, makeStyles, TextField, Theme } from '@material-ui/core';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import categoryHttp from '../../util/http/category-http';
import * as yup from '../../util/vendor/yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useHistory, useParams } from 'react-router';
import { useEffect } from 'react';
import { useState } from 'react';
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
});

export const Form = () => {

    const classes = useStyles();

    const { handleSubmit, getValues, formState: { errors }, control, reset, watch} = useForm<{name, description, is_active}>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            is_active: true
        }
    });

    const snackbar = useSnackbar();
    const history = useHistory();
    const {id} : any = useParams();
    const [category, setCategory] = useState<{id: string} | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

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
        categoryHttp
            .get(id)
            .then(({data}) => {
                setCategory(data.data)
                reset(data.data)
            })
            .finally(() => setLoading(false))
    }, []);

    function onSubmit(formData, event) {
        setLoading(true);
        const http = !category
            ? categoryHttp.create(formData)
            : categoryHttp.update(category.id, formData)
            
            http
                .then(({data}) => {
                    snackbar.enqueueSnackbar(
                        'Categoria salva com sucesso',
                        {variant: 'success'}
                    );
                    setTimeout(() => {
                        event
                            ? (
                                id
                                    ? history.replace(`/categories/${data.data.id}/edit`)
                                    : history.push(`/categories/${data.data.id}/edit`)
                            )
                            : history.push('/categories')
                    });
                })
                .catch((error) => {
                    console.log(error);
                    snackbar.enqueueSnackbar(
                        'Não foi possível salvar a categoria',
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
            <Controller
                name="description"
                control={control}
                render={({ field }) => (
                <TextField
                    label="Descrição"
                    multiline
                    rows="4"
                    fullWidth
                    variant={"outlined"}
                    margin={"normal"}
                    disabled={loading}
                    InputLabelProps={{shrink: true}}
                    {...field}
                />
                )}
            />
            <FormControlLabel
                disabled={loading}
                control={
                    <Controller
                        name="is_active"
                        control={control}
                        render={({ field }) => (
                        <Checkbox
                            color={'primary'}
                            checked={watch('is_active')}
                            {...field}
                        />
                        )}
                    />
                }
                label={'Ativo?'}
                labelPlacement={'end'}
            />
            <Box dir={"rtl"}>
                <Button {...buttonProps} onClick={() => onSubmit(getValues(), null)}>Salvar</Button>
                <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
            </Box>
        </form>
    );
};