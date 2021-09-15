export default {
  isGuest: (state) => {
    if (typeof state.accessToken === 'undefined') {
      return true;
    }
    return !state.accessToken;
  },
  accessToken: (state) => state.accessToken,
  user: (state) => {
    if (typeof state.user === 'string') {
      return JSON.parse(state.user);
    }
    return state.user;
  },
};
