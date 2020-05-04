import {ValidationError} from 'yup';

interface Erros{
    [key: string]: string;
}

export default function getValidationErros(err: ValidationError): Erros {
    const validationErros: Erros = {};  

    err.inner.forEach(err => {
        validationErros[err.path] = err.message;
    });

    return validationErros;
}