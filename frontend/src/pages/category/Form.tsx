import { ButtonProps } from '@material-ui/core/Button';
import { Box, Button, Checkbox, makeStyles, TextField, Theme } from '@material-ui/core';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import categoryHttp from '../../util/http/category-http';

const useStyles = makeStyles((theme: Theme) => {
    return {
        submit: {
            margin: theme.spacing(1)
        }
    }
});

export const Form = () => {

    const classes = useStyles();

    const buttonProps: ButtonProps = {
        className: classes.submit,
        variant: "outlined"
    };

    const {register, handleSubmit, getValues} = useForm<{name, description, is_active}>({
        defaultValues: {
            is_active: true
        }
    });

    function onSubmit(formData) {
        categoryHttp
            .create(formData)
            .then((response) => console.log(response));
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
                label="Nome"
                fullWidth
                variant={"outlined"}
                {...register("name")}
            />
            <TextField
                label="Descrição"
                multiline
                rows="4"
                fullWidth
                variant={"outlined"}
                margin={"normal"}
                {...register("description")}
            />
            <Checkbox
                {...register("is_active")}
                defaultChecked
            />
            Ativo?
            <Box dir={"rtl"}>
                <Button {...buttonProps} onClick={() => onSubmit(getValues())}>Salvar</Button>
                <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
            </Box>
        </form>
    );
};