export default function guest({ next, store }) {
    if (!store.getters['user/isGuest']) {
        return next({
            name: 'index',
        });
    }

    return next();
}
