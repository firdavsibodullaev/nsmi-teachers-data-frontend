import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';
import {sync} from 'vuex-router-sync';
import kernel from './kernel';
import auth from './middleware/auth';
import guest from './middleware/guest';

Vue.use(VueRouter);

export const routes = [
    {
        path: '/',
        name: 'index',
        icon: 'home',
        component: () => import('../views/HomePage'),
        show: false,
        meta: {
            for: ['super_admin', 'admin', 'moderator', 'rector', 'vice_rector', 'dean', 'vice_dean', 'department_head', 'teacher'],
            middleware: [auth],
            title: 'Главная страница'
        }
    },
    {
        path: '/login',
        name: 'login',
        icon: '',
        component: () => import('../views/LoginPage'),
        show: false,
        meta: {
            for: ['super_admin', 'admin', 'moderator', 'rector', 'vice_rector', 'dean', 'vice_dean', 'department_head', 'teacher'],
            middleware: [guest],
            title: 'Авторизация',
        }
    },
    {
        path: '/users',
        name: 'users',
        icon: 'usergroup-add',
        show: true,
        component: () => import('../views/MainIndex.vue'),
        meta: {
            for: ['super_admin', 'admin', 'moderator'],
            middleware: [auth],
            title: 'Пользователи'
        },
        children: [
            {
                path: '',
                name: 'user-list',
                icon: 'user',
                component: () => import('../views/users/List'),
                show: true,
                meta: {
                    for: ['super_admin', 'admin', 'moderator'],
                    middleware: [auth],
                    title: 'Список пользователей'
                }
            },
            {
                path: '/create',
                name: 'user-create',
                icon: 'user-add',
                drawerForm: true,
                component: () => import('../views/users/Create'),
                show: true,
                meta: {
                    for: ['super_admin', 'admin', 'moderator'],
                    middleware: [auth],
                    title: 'Новый пользователь'
                }
            },
            {
                path: '/show',
                name: 'user-show',
                icon: 'user',
                show: false,
                component: () => import('../views/users/Show'),
                meta: {
                    drawerForm: 'UserShow',
                    for: ['super_admin', 'admin', 'moderator'],
                    middleware: [auth],
                    title: 'Пользователь'
                }
            },
            {
                path: '/edit',
                name: 'user-edit',
                icon: 'user',
                show: false,
                component: () => import('../views/users/Edit'),
                meta: {
                    drawerForm: 'UserEdit',
                    for: ['super_admin', 'admin', 'moderator'],
                    middleware: [auth],
                    title: 'Редактирование пользователя'
                }
            },
        ]
    },
    {
        path: '/forbidden',
        name: '403',
        icon: '',
        show: false,
        component: () => import('../views/errors/403'),
        meta: {
            for: ['super_admin', 'admin', 'moderator', 'rector', 'vice_rector', 'dean', 'vice_dean', 'department_head', 'teacher'],
            title: 'Отказано в доступе',
        }
    },
    {
        path: '*',
        name: '404',
        show: false,
        component: () => import('../views/errors/404.vue'),
        meta: {
            for: ['root', 'admin', 'owner', 'guest'],
            title: 'Страница не найдено',
        },
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});
sync(store, router);
router.beforeEach((to, from, next) => {
    const {middleware} = to.meta;
    const user = store.getters['user/user'];
    if (typeof user === 'object' && !to.meta.for.includes(user.Post.KeyName)) {
        return next({name: '403'})
    }
    document.title = to.meta.title;
    if (!middleware) {
        return next();
    }
    const context = {
        to, from, next, store
    };

    return middleware[0]({
        ...context,
        next: kernel(context, middleware, 1),
    });
});

export default router;
