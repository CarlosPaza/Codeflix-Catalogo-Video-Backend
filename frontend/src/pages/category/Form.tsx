import { Checkbox, FormControlLabel, TextField } from '@material-ui/core';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import categoryHttp from '../../util/http/category-http';
import * as yup from '../../util/vendor/yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useHistory, useParams } from 'react-router';
import { useEffect } from 'react';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { Category } from '../../util/models';
import SubmitActions from '../../components/SubmitActions';
import { DefaultForm } from '../../components/DefaultForm';

const validationSchema = yup.object().shape({
    name: yup.string()
        .label('Nome')
        .required()
        .max(255),
});

export const Form = () => {

    const { handleSubmit, getValues, formState: { errors }, control, reset, watch, trigger} = useForm<{name, description, is_active}>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            is_active: true
        }
    });

    const snackbar = useSnackbar();
    const history = useHistory();
    const {id} : any = useParams();
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!id) {
            return;
        }
        
        (async function getCategory() {
            setLoading(true);
            try {
                const {data} = await categoryHttp.get(id);
                setCategory(data.data);
                reset(data.data);
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

    }, []);

    async function onSubmit(formData, event) {
        setLoading(true);
        try {
            const http = !category
                ? categoryHttp.create(formData)
                : categoryHttp.update(category.id, formData);
            const {data} = await http;
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
        } catch (error) {
            console.error(error);
            snackbar.enqueueSnackbar(
                'Não foi possível salvar a categoria',
                {variant: 'error'}
            )
        } finally {
            setLoading(false);
        }
    }

    return (
        <DefaultForm GridItemProps={{xs: 12, md: 6}} onSubmit={handleSubmit(onSubmit)}>
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
            <SubmitActions 
                disabledButtons={loading} 
                handleSave={
                    () =>
                    trigger().then(isValid => {
                        isValid && onSubmit(getValues(), null)
                    })
                } />
        </DefaultForm>
    );
};