import { LocaleObject, setLocale } from "yup";

const ptBR: LocaleObject = {
  mixed: {
    required: ({ path }) => `${path} é requerido`,
    notType: ({ path }) => `${path} é inválido`
  },
  string: {
    max: ({ path, max }) => `${path} precisa ter no máximo ${max} caracteres`,
  },
  number: {
    min: ({ path, min }) => `${path} precisa ser no mínimo ${min}`,
  },
};

setLocale(ptBR);

export * from "yup";