import { ButtonProps } from '@material-ui/core/Button';
import { Box, Button, FormControl, FormControlLabel, FormLabel, makeStyles, Radio, RadioGroup, TextField, Theme, FormHelperText } from '@material-ui/core';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import castMemberHttp from '../../util/http/cast-member-http';
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
    type: yup.number()
        .label('Tipo')
        .required(),
});

export const Form = () => {

    const classes = useStyles();

    const { handleSubmit, getValues, setValue, formState: { errors }, control, reset, watch} = useForm({
        resolver: yupResolver(validationSchema)
    });

    const snackbar = useSnackbar();
    const history = useHistory();
    const {id} : any = useParams();
    const [castMember, setCastMember] = useState<{id: string} | null>(null);
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
        castMemberHttp
            .get(id)
            .then(({data}) => {
                setCastMember(data.data)
                reset(data.data)
            })
            .finally(() => setLoading(false))
    }, []);

    function onSubmit(formData, event) {
        setLoading(true);
        const http = !castMember
            ? castMemberHttp.create(formData)
            : castMemberHttp.update(castMember.id, formData)
            
            http
                .then(({data}) => {
                    snackbar.enqueueSnackbar(
                        'Membro de elenco salvo com sucesso',
                        {variant: 'success'}
                    );
                    setTimeout(() => {
                        event
                            ? (
                                id
                                    ? history.replace(`/cast_members/${data.data.id}/edit`)
                                    : history.push(`/cast_members/${data.data.id}/edit`)
                            )
                            : history.push('/cast_members')
                    });
                })
                .catch((error) => {
                    console.log(error);
                    snackbar.enqueueSnackbar(
                        'Não foi possível salvar o membro de elenco',
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
                    variant={"outlined"}
                    disabled={loading}
                    error={errors.name !== undefined}
                    helperText={errors.name && errors.name.message}
                    InputLabelProps={{shrink: true}}
                    {...field}
                />
                )}
            />
            
           <FormControl 
                margin={"normal"}
                error={errors.type !== undefined}
                disabled={loading}>
                <FormLabel component="legend">Tipo</FormLabel>
                <RadioGroup
                    name="type"
                    onChange={(e) => {
                        setValue('type', parseInt(e.target.value));
                    }}
                    value={watch('type') + ""}>
                    <FormControlLabel value="1" control={<Radio color={"primary"}/>} label="Diretor"/>
                    <FormControlLabel value="2" control={<Radio color={"primary"}/>} label="Ator"/>
                </RadioGroup>
                {
                    errors.type && <FormHelperText id="type-helper-text">{errors.type.message}</FormHelperText>
                }
            </FormControl>
            <Box dir={"rtl"}>
                <Button {...buttonProps} onClick={() => onSubmit(getValues(), null)}>Salvar</Button>
                <Button {...buttonProps} type="submit"> Salvar e continuar editando</Button>
            </Box>
        </form>
    );
};