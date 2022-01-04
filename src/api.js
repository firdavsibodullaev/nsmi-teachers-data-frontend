import axios from 'axios';
import Vue from 'vue';
import store from './store';
import router from './router';
import {serializeUrl} from "./helpers";

const api = axios.create({
    baseURL: process.env.VUE_APP_BASE_URL,
    withCredentials: false,
});

const {getters, dispatch} = store;

export default {
    install(vue) {
        vue.prototype.$api = {
            async axiosPost(url, body, onSuccess, onError) {
                await api.post(url, body, {
                    crossDomain: true,
                    headers: this.getHeaders(),
                })
                    .then((response) => {
                        onSuccess(response);
                    })
                    .catch((catchError) => {
                        if (typeof onError === 'function') {
                            onError(catchError.response);
                        }
                    });
            },
            async axiosDelete(url, body, onSuccess, onError) {
                await api.delete(url, {
                    crossDomain: true,
                    headers: this.getHeaders(),
                })
                    .then((response) => {
                        onSuccess(response);
                    })
                    .catch((catchError) => {
                        if (typeof onError === 'function') {
                            onError(catchError.response);
                        }
                    });
            },
            async axiosPut(url, body, onSuccess, onError) {
                await api.put(url, body, {
                    crossDomain: true,
                    headers: this.getHeaders(),
                })
                    .then((response) => {
                        onSuccess(response);
                    })
                    .catch((catchError) => {
                        if (typeof onError === 'function') {
                            onError(catchError.response);
                        }
                    });
            },
            async axiosPostFormData(url, body, onSuccess, onError) {
                await api.post(url, body, {
                    headers: this.getHeaders([
                        {key: 'Content-Type', value: 'multipart/form-data'},
                    ]),
                })
                    .then((response) => {
                        onSuccess(response);
                    })
                    .catch((catchError) => {
                        if (typeof onError === 'function') {
                            onError(catchError.response);
                        }
                    });
            },
            async axiosGet(url, body, onSuccess, onError) {
                await api.get(url, {
                    params: body,
                    headers: this.getHeaders(),
                })
                    .then((response) => {
                        onSuccess(response);
                    })
                    .catch((catchError) => {
                        if (typeof onError === 'function') {
                            onError(catchError.response);
                        }
                    });
            },
            getHeaders(replaceHeaders) {
                const headers = {
                    Accept: 'application/json',
                    ContentType: 'multipart/form-data',
                };

                if (getters['user/isGuest'] === false) {
                    const accessToken = getters['user/accessToken'];
                    headers.Authorization = `Bearer ${accessToken}`;
                }

                if (replaceHeaders) {
                    replaceHeaders.forEach((replace) => {
                        headers[replace.key] = replace.value;
                    });
                }

                return headers;
            },

            login(body, onSuccess, onError) {
                return this.axiosPost('/auth/login', body, onSuccess, onError);
            },
            logout(onSuccess, onError) {
                return this.axiosPost('/auth/logout', null, onSuccess, onError);
            },
            register(body, onSuccess, onError) {
                return this.axiosPost('/auth/register', body, onSuccess, onError);
            },

            // Users
            getUser(userId, onSuccess, onError) {
                return this.axiosGet(`/user/${userId}`, false, onSuccess, onError);
            },
            getUsers(query, onSuccess, onError) {
                return this.axiosGet(`/user/list?${serializeUrl(query)}`, null, onSuccess, onError);
            },
            filterUsers(query, onSuccess, onError) {

                return this.axiosGet(`/user?${serializeUrl(query)}`, false, onSuccess, onError);
            },
            createUser(body, onSuccess, onError) {
                return this.axiosPost('/user', body, onSuccess, onError);
            },
            saveUser(userId, body, onSuccess, onError) {
                return this.axiosPut(`/user/${userId}`, body, onSuccess, onError);
            },
            deleteUser({id}, onSuccess, onError) {
                return this.axiosDelete(`/user/${id}`, null, onSuccess, onError);
            },

            // Должности

            getUserPostsList(onSuccess, onError) {
                return this.axiosGet('/user/posts', null, onSuccess, onError);
            },

            // Факультеты
            getFaculties(body, onSuccess, onError) {
                return this.axiosGet('/faculty', body, onSuccess, onError);
            },
            getFaculty(facultyId, onSuccess, onError) {
                return this.axiosGet(`/faculty/${facultyId}`, false, onSuccess, onError);
            },
            createFaculty(body, onSuccess, onError) {
                return this.axiosPost('/faculty', body, onSuccess, onError);
            },
            saveFaculty(facultyId, body, onSuccess, onError) {
                return this.axiosPut(`/faculty/${facultyId}`, body, onSuccess, onError);
            },
            deleteFaculty({Id}, onSuccess, onError) {
                return this.axiosDelete(`/faculty/${Id}`, null, onSuccess, onError);
            },

            // Кафедры
            getDepartments(body, onSuccess, onError) {
                return this.axiosGet('/department', body, onSuccess, onError);
            },
            getDepartment(departmentId, onSuccess, onError) {
                return this.axiosGet(`/department/${departmentId}`, false, onSuccess, onError);
            },
            createDepartment(body, onSuccess, onError) {
                return this.axiosPost('/department', body, onSuccess, onError);
            },
            saveDepartment(facultyId, body, onSuccess, onError) {
                return this.axiosPut(`/department/${facultyId}`, body, onSuccess, onError);
            },
            deleteDepartment({Id}, onSuccess, onError) {
                return this.axiosDelete(`/department/${Id}`, null, onSuccess, onError);
            },

            // DSc докторы
            getDScDoctors(query, onSuccess, onError) {
                return this.axiosGet(`/dsc-doctor?${serializeUrl(query)}`, null, onSuccess, onError);
            },
            getDScDoctor(id, onSuccess, onError) {
                return this.axiosGet(`/dsc-doctor/${id}`, null, onSuccess, onError);
            },
            saveDScDoctor(id, body, onSuccess, onError) {
                return this.axiosPut(`/dsc-doctor/${id}`, body, onSuccess, onError);
            },
            createDScDoctor(body, onSuccess, onError) {
                return this.axiosPost(`/dsc-doctor`, body, onSuccess, onError);
            },
            deleteDScDoctor(id, onSuccess, onError) {
                return this.axiosDelete(`/dsc-doctor/${id}`, null, onSuccess, onError);
            },

            // Phd докторы
            getPhdDoctors(query, onSuccess, onError) {
                return this.axiosGet(`/phd-doctor?${serializeUrl(query)}`, null, onSuccess, onError);
            },
            getPhdDoctor(id, onSuccess, onError) {
                return this.axiosGet(`/phd-doctor/${id}`, null, onSuccess, onError);
            },
            savePhdDoctor(id, body, onSuccess, onError) {
                return this.axiosPut(`/phd-doctor/${id}`, body, onSuccess, onError);
            },
            createPhdDoctor(body, onSuccess, onError) {
                return this.axiosPost(`/phd-doctor`, body, onSuccess, onError);
            },
            deletePhdDoctor(id, onSuccess, onError) {
                return this.axiosDelete(`/phd-doctor/${id}`, null, onSuccess, onError);
            },


            // articleCitation
            getArticleCitations(query, onSuccess, onError) {
                return this.axiosGet(`scientific-article-citation?${serializeUrl(query)}`, null, onSuccess, onError);
            },
            getArticleCitation(id, onSuccess, onError) {
                return this.axiosGet(`scientific-article-citation/${id}`, null, onSuccess, onError);
            },
            saveArticleCitation(body, onSuccess, onError) {
                return this.axiosPost(`scientific-article-citation`, body, onSuccess, onError);
            },
            getJournals(query, onSuccess, onError) {
                return this.axiosGet(`scientific-article-citation/journals?${serializeUrl(query)}`, null, onSuccess, onError);
            },
            getLanguages(query, onSuccess, onError) {
                return this.axiosGet(`scientific-article-citation/languages?${serializeUrl(query)}`, null, onSuccess, onError);
            },
            deleteArticleCitation(id, onSuccess, onError) {
                return this.axiosDelete(`scientific-article-citation/${id}`, null, onSuccess, onError);
            },

        };
    },
};

api.interceptors.response.use((response) => response, (error) => {
    const {status} = error.response;

    if (status === 401) {
        dispatch('user/logout');
        router.push({name: 'login'});
    }

    if (status === 403) {
        router.push({name: '403'});
    }

    if (status === 500) {
        Vue.prototype.$notification.warning({
            message: 'Серверная ошибка. КОД: 500',
        });
    }

    return Promise.reject(error);
});
