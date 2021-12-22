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
            for: ['*'],
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
            for: ['*'],
            middleware: [guest],
            title: 'Авторизация',
        }
    },
    {
        path: '/logout',
        name: 'logout',
        icon: '',
        component: () => import('../views/LoginPage'),
        show: false,
        meta: {
            for: ['*'],
            middleware: [auth],
            title: 'Выход из системы',
        }
    },
    {
        path: '/lists',
        name: 'lists',
        show: true,
        component: () => import('../views/MainIndex.vue'),
        meta: {
            for: ['Админ'],
            title: 'Справочники',
            middleware: [auth],
        },
        children: [
            {
                path: 'users',
                name: 'users',
                icon: 'usergroup-add',
                show: true,
                component: () => import('../views/layouts/PrimaryLayout.vue'),
                meta: {
                    for: ['Админ'],
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
                            for: ['Админ'],
                            middleware: [auth],
                            title: 'Список пользователей'
                        }
                    },
                    {
                        path: 'create',
                        name: 'user-create',
                        icon: 'user-add',
                        drawerForm: true,
                        component: () => import('../views/users/Create'),
                        show: true,
                        meta: {
                            for: ['Админ'],
                            middleware: [auth],
                            title: 'Новый пользователь'
                        }
                    },
                    {
                        path: 'show',
                        name: 'user-show',
                        icon: 'user',
                        show: false,
                        component: () => import('../views/users/Show'),
                        meta: {
                            drawerForm: 'UserShow',
                            for: ['Админ'],
                            middleware: [auth],
                            title: 'Пользователь'
                        }
                    },
                    {
                        path: 'edit/:id',
                        name: 'user-edit',
                        icon: 'user',
                        show: false,
                        component: () => import('../views/users/Edit'),
                        meta: {
                            for: ['Админ'],
                            middleware: [auth],
                            title: 'Редактирование пользователя'
                        }
                    },
                ]
            },
            {
                path: 'faculties',
                name: 'faculties',
                icon: '',
                show: true,
                component: () => import('../views/layouts/PrimaryLayout.vue'),
                meta: {
                    for: ['super_admin', 'admin', 'moderator'],
                    middleware: [auth],
                    title: 'Факультеты'
                },
                children: [
                    {
                        path: '',
                        name: 'faculty-list',
                        show: true,
                        component: () => import('../views/faculties/List'),
                        meta: {
                            for: ['super_admin', 'admin', 'moderator'],
                            middleware: [auth],
                            title: 'Список факультетов'
                        }
                    },
                    {
                        path: 'edit/:id',
                        name: 'faculty-edit',
                        show: false,
                        component: () => import('../views/faculties/Edit'),
                        meta: {
                            for: ['super_admin', 'admin', 'moderator'],
                            middleware: [auth],
                            title: 'Редактирование факультета'
                        }
                    },
                    {
                        path: 'create',
                        name: 'faculty-create',
                        show: true,
                        component: () => import('../views/faculties/Create'),
                        meta: {
                            for: ['super_admin', 'admin', 'moderator'],
                            middleware: [auth],
                            title: 'Новый факультет'
                        }
                    },
                    {
                        path: 'show',
                        name: 'faculty-show',
                        show: false,
                        component: () => import('../views/faculties/Show'),
                        meta: {
                            drawerForm: 'FacultyShow',
                            for: ['super_admin', 'admin', 'moderator'],
                            middleware: [auth],
                            title: 'Факультет'
                        }
                    },
                ]
            },
            {
                path: 'departments',
                name: 'departments',
                icon: '',
                show: true,
                component: () => import('../views/layouts/PrimaryLayout.vue'),
                meta: {
                    for: ['super_admin', 'admin', 'moderator'],
                    middleware: [auth],
                    title: 'Кафедры'
                },
                children: [
                    {
                        path: '',
                        name: 'department-list',
                        icon: '',
                        show: true,
                        component: () => import('../views/departments/List'),
                        meta: {
                            for: ['super_admin', 'admin', 'moderator'],
                            middleware: [auth],
                            title: 'Список кафедр'
                        },
                    },
                    {
                        path: 'create',
                        name: 'department-create',
                        icon: '',
                        show: true,
                        component: () => import('../views/departments/Create'),
                        meta: {
                            for: ['super_admin', 'admin', 'moderator'],
                            middleware: [auth],
                            title: 'Новая кафедра'
                        },
                    },
                    {
                        path: 'show/:id',
                        name: 'department-show',
                        icon: '',
                        show: false,
                        component: () => import('../views/departments/Show'),
                        meta: {
                            drawerForm: 'DepartmentShow',
                            for: ['super_admin', 'admin', 'moderator'],
                            middleware: [auth],
                            title: 'Кафедра'
                        }
                    },
                    {
                        path: 'edit/:id',
                        name: 'department-edit',
                        icon: '',
                        show: false,
                        component: () => import('../views/departments/Edit'),
                        meta: {
                            for: ['super_admin', 'admin', 'moderator'],
                            middleware: [auth],
                            title: 'Редактирование кафедры'
                        }
                    },
                ]
            },
        ]
    },
    {
        path: '/forbidden',
        name: '403',
        icon: '',
        show: false,
        component: () => import('../views/errors/forbidden'),
        meta: {
            for: ['*'],
            title: 'Отказано в доступе',
        }
    },
    {
        path: '*',
        name: '404',
        show: false,
        component: () => import('../views/errors/404.vue'),
        meta: {
            for: ['*'],
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
    if (typeof user === 'object' && !to.meta.for.includes(user.post.name) && !to.meta.for.includes('*')) {
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
