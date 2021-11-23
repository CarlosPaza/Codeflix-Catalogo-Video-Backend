import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, FormHelperText } from '@material-ui/core';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import castMemberHttp from '../../util/http/cast-member-http';
import * as yup from '../../util/vendor/yup';
import { useHistory, useParams } from 'react-router';
import { useEffect } from 'react';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { CastMember } from '../../util/models';
import { DefaultForm } from '../../components/DefaultForm';
import SubmitActions from '../../components/SubmitActions';

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

    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        errors,
        reset,
        watch,
        triggerValidation
    } = useForm<{name, type}>({
        validationSchema,
    });

    const snackbar = useSnackbar();
    const history = useHistory();
    const {id} : any = useParams();
    const [castMember, setCastMember] = useState<CastMember | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

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

    useEffect(() => {
        register({name: "type"})
    }, [register]);

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
            <FormControl
                margin={"normal"}
                error={errors.type !== undefined}
                disabled={loading}
            >
                <FormLabel component="legend">Tipo</FormLabel>
                <RadioGroup
                    name="type"
                    onChange={(e) => {
                        setValue('type', parseInt(e.target.value));
                    }}
                    value={watch('type') + ""}
                >
                    <FormControlLabel value="1" control={<Radio color={"primary"}/>} label="Diretor"/>
                    <FormControlLabel value="2" control={<Radio color={"primary"}/>} label="Ator"/>
                </RadioGroup>
                {
                    errors.type && <FormHelperText id="type-helper-text">{errors.type.message}</FormHelperText>
                }
            </FormControl>
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