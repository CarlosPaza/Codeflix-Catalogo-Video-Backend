import {RouteProps} from "react-router-dom";
import CategoryList from "../pages/category/PageList";
import CategoryForm from "../pages/category/PageForm";
import CastMemberForm from "../pages/cast-member/PageForm";
import CastMemberList from "../pages/cast-member/PageList";
import GenreList from "../pages/genre/PageList";
import GenreForm from "../pages/genre/PageForm";
import Dashboard from "../pages/Dashboard";

export interface MyRouteProps extends RouteProps {
    name: string;
    label: string;
}

const routes: MyRouteProps[] = [
    {
        name: 'dashboard',
        label: 'Dashboard',
        path: '/',
        component: Dashboard,
        exact: true
    },
    {
        name: 'categories.list',
        label: 'Listar categorias',
        path: '/categories',
        component: CategoryList,
        exact: true
    },
    {
        name: 'categories.create',
        label: 'Criar categorias',
        path: '/categories/create',
        component: CategoryForm,
        exact: true
    },
    {
        name: 'cast_members.list',
        label: 'Listar membros de elencos',
        path: '/cast_members',
        component: CastMemberList,
        exact: true
    },
    {
        name: 'cast_members.create',
        label: 'Criar membro de elenco',
        path: '/cast_members/create',
        component: CastMemberForm,
        exact: true
    },
    {
        name: 'genres.list',
        label: 'Listar gêneros',
        path: '/genres',
        component: GenreList,
        exact: true
    },
    {
        name: 'genres.create',
        label: 'Criar gêneros',
        path: '/genres/create',
        component: GenreForm,
        exact: true
    }
];

export default routes;