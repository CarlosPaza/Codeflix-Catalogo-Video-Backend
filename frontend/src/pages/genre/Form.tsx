import { MenuItem, TextField } from '@material-ui/core';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import categoryHttp from "../../util/http/category-http";
import genreHttp from '../../util/http/genre-http';
import { useEffect, useState } from 'react';
import * as yup from '../../util/vendor/yup';
import { useHistory, useParams } from 'react-router';
import { useSnackbar } from 'notistack';
import { Category, Genre } from '../../util/models';
import { DefaultForm } from '../../components/DefaultForm';
import SubmitActions from '../../components/SubmitActions';

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

    const snackbar = useSnackbar();
    const history = useHistory();
    const {id} : any = useParams();
    const [genre, setGenre] = useState<Genre | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const {register, handleSubmit, getValues, errors, watch, setValue, reset, triggerValidation} = useForm<{name, categories_id}>({
        validationSchema,
        defaultValues: {
            categories_id: []
        }
    });

    useEffect(() => {
        let isSubscribed = true;
        (async () => {
            setLoading(true);
            const promises = [categoryHttp.list({queryParams: {all: ''}})];
            if (id) {
                promises.push(genreHttp.get(id));
            }
            try {
                const [categoriesResponse, genreResponse] = await Promise.all(promises);
                if (isSubscribed) {
                    setCategories(categoriesResponse.data.data);
                    if (id) {
                        setGenre(genreResponse.data.data);
                        const categories_id = genreResponse.data.data.categories.map(category => category.id);
                        reset({
                            ...genreResponse.data.data,
                            categories_id
                        });
                    }
                }
            } catch (error) {
                console.error(error);
                snackbar.enqueueSnackbar(
                    'Não foi possível carregar as informações',
                    {variant: 'error',}
                )
            } finally {
                setLoading(false);
            }
        })();
        
        return () => {
            isSubscribed = false;
        }
    }, []);

    useEffect(() => {
        register({name: "categories_id"})
    }, [register]);

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
        <DefaultForm GridItemProps={{xs: 12, md: 6}} onSubmit={handleSubmit(onSubmit)}>
            <TextField
                name="name"
                label="Nome"
                fullWidth
                variant={"outlined"}
                inputRef={register}
                disabled={loading}
                error={errors.name !== undefined}
                helperText={errors.name && errors.name.message}
                InputLabelProps={{shrink: true}}
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
            <SubmitActions
                disabledButtons={loading}
                handleSave={() =>
                    triggerValidation().then(isValid => {
                        isValid && onSubmit(getValues(), null)
                    })
                }
            />
        </DefaultForm>
    );
};