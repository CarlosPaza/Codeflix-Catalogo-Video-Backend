import * as React from 'react';
import MUIDataTable, { MUIDataTableColumn } from "mui-datatables";
import { useEffect } from 'react';
import { useState } from 'react';
import castMemberHttp from '../../util/http/cast-member-http';
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";

export const CastMemberTypeMap = {
    1: 'Diretor',
    2: 'Ator'
};

const columnsDefinition: MUIDataTableColumn[] = [
    {
        name: "name",
        label: "Nome"
    },
    {
        name: "type",
        label: "Tipo",
        options: {
            customBodyRender: (value, tableMeta, updateValue) => {
                return CastMemberTypeMap[value];
            }
        }
    },
    {
        name: "created_at",
        label: "Criado em",
        options: {
            customBodyRender(value, tableMeta, updateValue) {
                return <span>{format(parseISO(value), 'dd/MM/yyyy')}</span>
            }
        }
    }
];

interface CastMember {
    id: string;
    name: string;
}

const Table = () => {

    const [data, setData] = useState<CastMember[]>([]);

    useEffect(() => {
        castMemberHttp
            .list<{ data: CastMember[] }>()
            .then(({data}) => setData(data.data));
    }, []);

    return (
        <MUIDataTable
            title=""
            columns={columnsDefinition} 
            data={data}
        />
    );
};

export default Table;