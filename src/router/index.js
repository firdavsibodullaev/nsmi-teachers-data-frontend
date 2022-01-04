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
        hasVisibleChildren: true,
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
                hasVisibleChildren: true,
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
                hasVisibleChildren: true,
                show: true,
                component: () => import('../views/layouts/PrimaryLayout.vue'),
                meta: {
                    for: ['Админ'],
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
                            for: ['Админ'],
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
                            for: ['Админ'],
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
                            for: ['Админ'],
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
                            for: ['Админ'],
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
                hasVisibleChildren: true,
                show: true,
                component: () => import('../views/layouts/PrimaryLayout.vue'),
                meta: {
                    for: ['Админ'],
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
                            for: ['Админ'],
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
                            for: ['Админ'],
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
                            for: ['Админ'],
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
                            for: ['Админ'],
                            middleware: [auth],
                            title: 'Редактирование кафедры'
                        }
                    },
                ]
            },
        ]
    },
    {
        path: '/table',
        name: 'tables',
        show: true,
        hasVisibleChildren: true,
        component: () => import('../views/MainIndex.vue'),
        meta: {
            for: ['*'],
            title: 'Таблицы',
            middleware: [auth],
        },
        children: [
            {
                path: 'dsc-doctors',
                show: true,
                name: 'dsc-doctors',
                hasVisibleChildren: false,
                component: () => import('../views/DSc-doctor/Index.vue'),
                meta: {
                    for: ['Админ'],
                    middleware: [auth],
                    title: 'DSc-доктор наук'
                },
            },
            {
                path: 'phd-doctors',
                show: true,
                name: 'phd-doctors',
                hasVisibleChildren: false,
                component: () => import('../views/Phd-doctor/Index.vue'),
                meta: {
                    for: ['Админ'],
                    middleware: [auth],
                    title: 'Phd'
                },
            },
            {
                path: 'scientific-article-citation',
                show: true,
                name: 'articleCitation',
                hasVisibleChildren: false,
                component: () => import('../views/articleCitation/AdminList.vue'),
                meta: {
                    for: ['Админ'],
                    middleware: [auth],
                    title: 'Цитаты'
                },
            },
        ]
    },
    {
        path: '/table',
        show: false,
        hasVisibleChildren: false,
        component: () => import('../views/MainIndex.vue'),
        meta: {
            for: ['*'],
            title: 'Таблицы',
            middleware: [auth],
        },
        children: [
            {
                path: 'dsc-doctors',
                icon: 'usergroup-add',
                show: false,
                hasVisibleChildren: false,
                component: () => import('../views/users/Index.vue'),
                meta: {
                    for: ['Админ'],
                    middleware: [auth],
                    title: 'DSc-доктор наук'
                },
                children: [
                    {
                        path: 'create',
                        name: 'dsc_doctors_create',
                        show: false,
                        component: () => import('../views/DSc-doctor/Create'),
                        meta: {
                            for: ['Админ'],
                            middleware: [auth],
                            title: 'Добавить DSc-доктор наук'
                        }
                    },
                    {
                        path: 'edit/:id',
                        name: 'dsc_doctors_edit',
                        show: false,
                        component: () => import('../views/DSc-doctor/Edit'),
                        meta: {
                            for: ['Админ'],
                            middleware: [auth],
                            title: 'Изменение DSc-доктор наук'
                        }
                    }
                ]
            },
            {
                path: 'phd-doctors',
                icon: 'usergroup-add',
                show: false,
                hasVisibleChildren: false,
                component: () => import('../views/users/Index.vue'),
                meta: {
                    for: ['Админ'],
                    middleware: [auth],
                    title: 'Phd'
                },
                children: [
                    {
                        path: 'create',
                        name: 'phd_doctors_create',
                        show: false,
                        component: () => import('../views/Phd-doctor/Create'),
                        meta: {
                            for: ['Админ'],
                            middleware: [auth],
                            title: 'Добавить Phd'
                        }
                    },
                    {
                        path: 'edit/:id',
                        name: 'phd_doctors_edit',
                        show: false,
                        component: () => import('../views/Phd-doctor/Edit'),
                        meta: {
                            for: ['Админ'],
                            middleware: [auth],
                            title: 'Изменение DSc-доктор наук'
                        }
                    }
                ]
            },
            {
                path: 'scientific-article-citation',
                show: false,
                hasVisibleChildren: false,
                component: () => import('../views/users/Index.vue'),
                meta: {
                    for: ['*'],
                    middleware: [auth],
                    title: 'Цитаты'
                },
                children: [
                    {
                        name: 'article_citation_create',
                        path: 'create',
                        component: ()=> import('../views/articleCitation/Create.vue'),
                        meta: {
                            for: ['*'],
                            middleware: [auth],
                            title: 'Добавить запись'
                        }
                    },
                    {
                        name: 'article_citation_edit',
                        path: 'edit/:id',
                        component: ()=> import('../views/articleCitation/Edit.vue'),
                        meta: {
                            for: ['*'],
                            middleware: [auth],
                            title: 'Изменить запись'
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
