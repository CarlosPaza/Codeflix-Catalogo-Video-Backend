import { ButtonProps } from '@material-ui/core/Button';
import { Box, Button, makeStyles, MenuItem, TextField, Theme } from '@material-ui/core';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import categoryHttp from "../../util/http/category-http";
import genreHttp from '../../util/http/genre-http';
import { useEffect, useState } from 'react';

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

    const [categories, setCategories] = useState<any[]>([]);
    const {register, handleSubmit, getValues, watch, setValue} = useForm<{name, categories_id}>({
        defaultValues: {
            categories_id: []
        }
    });

    useEffect(() => {
        categoryHttp
            .list()
            .then(({data}) => setCategories(data.data));
    }, []);

    function onSubmit(formData) {
        genreHttp
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
                <Button {...buttonProps} onClick={() => onSubmit(getValues())}>Salvar</Button>
                <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
            </Box>
        </form>
    );
};