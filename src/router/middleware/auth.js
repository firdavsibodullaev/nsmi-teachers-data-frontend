export default function auth({ next, to, store }) {
    if (store.getters['user/isGuest']) {
        return next({
            name: 'login',
            query: { backto: to.path },
        });
    }

    return next();
}
