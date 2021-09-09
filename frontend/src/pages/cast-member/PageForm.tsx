import * as React from 'react';
import {Form} from "./Form";
import {Page} from "../../components/Page";
import { useParams } from 'react-router';

const PageForm = () => {
    const {id} : any = useParams();
    return (
        <Page title={!id ? 'Criar membro de elenco' : 'Editar membro de elenco'}>
            <Form/>
        </Page>
    );
};

export default PageForm;