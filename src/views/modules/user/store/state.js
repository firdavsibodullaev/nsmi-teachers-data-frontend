import Cookies from 'js-cookie';

export default {
  accessToken: Cookies.get('access_token'),
  user: Cookies.get('user'),
};
