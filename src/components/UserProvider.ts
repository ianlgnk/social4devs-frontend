import { reactive, ref, computed } from 'vue';
import {
  IUser, IUserProvider, ILogIn, ICreateReturn, IPost, IComment,
} from '@/interfaces/interfaces';
import axios from 'axios';

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
  const userToken = ref('');
  const isTokenDefined = computed(() => (localStorage.getItem('token') !== '' && localStorage.getItem('token') !== null));

  const api = axios.create({
    baseURL: 'http://localhost:3333/',
  });

  function setUser(newUser: IUser) {
    Object.assign(user, newUser);
  }

  function setToken(token: string | null) {
    if (token === null) return;
    const decodedToken: IUser = jwt_decode(token);
    userToken.value = token;
    localStorage.setItem('token', token);
    setUser(decodedToken);
  }

  function removeToken() {
    userToken.value = '';
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

  async function createPost(data: string): Promise<boolean> {
    return api.post('/post', { body: data }, {
      headers: {
        token: userToken.value,
      },
    }).then(() => true).catch(() => false);
  }

  async function fetchPosts():Promise<Array<IPost>> {
    return api.get('/post', {
      headers: {
        token: userToken.value,
      },
    }).then((res) => res.data).catch(() => []);
  }

  async function createComment(data: string, postBody: string): Promise<IComment | boolean> {
    return api.post('/post/commentary', {
      postEmail: user.email,
      postBody,
      commentary: data,
    }, {
      headers: {
        token: userToken.value,
      },
    }).then((res) => res.data)
      .catch(() => false);
  }

  async function listComments(postEmail: string, postBody: string): Promise<Array<IComment>> {
    return api.get(
      '/post/commentary',
      {
        headers: {
          token: userToken.value,
        },
        params: {
          postEmail,
          postBody,
        },
      },
    ).then((res) => res.data)
      .catch(() => []);
  }

  async function createLike(postBody: string) {
    return api.post('/post/like', {
      postEmail: user.email,
      postBody,
    }, {
      headers: {
        token: userToken.value,
      },
    });
  }

  async function deleteLike(postBody: string) {
    return api.delete('/post/like', {
      headers: {
        token: userToken.value,
      },
      data: {
        postEmail: user.email,
        postBody,
      },
    });
  }

  async function searchUser(valueToFind: string): Promise<Array<IUser>> {
    return api.get('/user/search', {
      headers: {
        token: userToken.value,
        name: valueToFind,
        nickname: valueToFind,
      },
    }).then((res) => res.data);
  }

  async function searchUserByEmail(email: string): Promise<IUser> {
    return api.get('/user/search', {
      headers: {
        token: userToken.value,
      },
    }).then((res) => res.data);
  }

  // init
  setToken(localStorage.getItem('token'));

  return {
    user,
    isTokenDefined: isTokenDefined.value,
    logIn,
    logOut,
    create,
    createPost,
    fetchPosts,
    createComment,
    createLike,
    deleteLike,
    listComments,
    searchUser,
    searchUserByEmail,
  };
}
