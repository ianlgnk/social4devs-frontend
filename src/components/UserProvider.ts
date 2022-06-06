import { reactive, ref, computed } from 'vue';
import {
  IUser, IUserProvider, ILogIn, ICreateReturn,
} from '@/interfaces/interfaces';
import { api } from '@/services/api';
// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode';

// eslint-disable-next-line import/prefer-default-export
export function useUser(): IUserProvider {
  const user = reactive<IUser>({
    email: '',
    name: '',
    bio: '',
    nickname: '',
    password: '',
    githubAccount: '',
    specialties: [],
  });
  const userToken = ref<string | null>(localStorage.getItem('token'));
  const isTokenDefined = computed(() => userToken.value !== null);

  function setUser(newUser: IUser) {
    Object.assign(user, newUser);
  }

  function setToken(token: string) {
    userToken.value = token;
    const decodedToken: IUser = jwt_decode(token);
    api.defaults.headers.common.Authorization = userToken.value;
    // localStorage.setItem('token', userToken.value);
    setUser(decodedToken);
  }

  function removeToken() {
    userToken.value = '';
    api.defaults.headers.common.Authorization = '';
    localStorage.removeItem('token');
    setUser({
      email: '',
      name: '',
      bio: '',
      nickname: '',
      password: '',
      githubAccount: '',
      specialties: [],
    });
  }

  async function logIn(data: ILogIn): Promise<boolean> {
    return api.post('/user/login', data)
      .then((res) => {
        setToken(res.data.token);
        return true;
      })
      .catch(() => false);
  }

  async function logOut() {
    removeToken();
  }

  async function create(data: IUser): Promise<ICreateReturn> {
    return api.post('/user', data)
      .then(() => ({
        isSuccessful: true as boolean,
        feedbackMsg: '' as string,
      }))
      .catch((res) => ({
        isSuccessful: false as boolean,
        feedbackMsg: res.response.data.message as string,
      }));
  }

  // init
  if (isTokenDefined.value) setToken(userToken.value || '');

  return {
    user,
    isTokenDefined: isTokenDefined.value,
    logIn,
    logOut,
    create,
  };
}
