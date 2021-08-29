import { ButtonProps } from '@material-ui/core/Button';
import { Box, Button, FormControl, FormControlLabel, FormLabel, makeStyles, Radio, RadioGroup, TextField, Theme } from '@material-ui/core';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import castMemberHttp from '../../util/http/cast-member-http';

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

    const {register, handleSubmit, getValues, setValue} = useForm();

    function onSubmit(formData) {
        castMemberHttp
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
           <FormControl margin={"normal"}>
                <FormLabel component="legend">Tipo</FormLabel>
                <RadioGroup
                    name="type"
                    onChange={(e) => {
                        setValue('type', parseInt(e.target.value));
                    }}>
                    <FormControlLabel value="1" control={<Radio color={"primary"}/>} label="Diretor"/>
                    <FormControlLabel value="2" control={<Radio color={"primary"}/>} label="Ator"/>
                </RadioGroup>
            </FormControl>
            <Box dir={"rtl"}>
                <Button {...buttonProps} onClick={() => onSubmit(getValues())}>Salvar</Button>
                <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
            </Box>
        </form>
    );
};