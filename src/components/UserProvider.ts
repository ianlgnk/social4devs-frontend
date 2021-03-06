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
    followers: [],
    follows: [],
  });
  const userToken = ref('');

  const api = axios.create({
    baseURL: 'http://localhost:3333/',
    // baseURL: 'https://social4devs.herokuapp.com',
  });

  function setUserAfterEdit(res: any) {
    user.bio = res.data.bio;
    user.email = res.data.email;
    user.githubAccount = res.data.githubaccount;
    user.name = res.data.name;
    user.nickname = res.data.nickname;
  }

  function setUser(newUser: IUser) {
    Object.assign(user, newUser);
  }

  function setToken(token: string | null) {
    if (token === null) return;
    const decodedToken: IUser = jwt_decode(token);
    userToken.value = token;
    setUser(decodedToken);
  }

  function removeToken() {
    userToken.value = '';
    setUser({
      email: '',
      name: '',
      bio: '',
      nickname: '',
      password: '',
      githubAccount: '',
      specialties: [],
      followers: [],
      follows: [],
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

  async function editUser(data: IUser): Promise<ICreateReturn> {
    return api.put('/user', {
      name: data.name,
      bio: data.bio,
      nickname: data.nickname,
      password: data.password,
    }, {
      headers: {
        token: userToken.value,
      },
    })
      .then((res) => {
        setUserAfterEdit(res);
        return {
          isSuccessful: true as boolean,
          feedbackMsg: '' as string,
        };
      })
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

  async function deletePost(postBody: string): Promise<boolean> {
    return api.delete('/post', {
      headers: {
        token: userToken.value,
      },
      data: {
        body: postBody,
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

  async function createComment(
    data: string,
    postBody: string,
    postEmail: string,
  ): Promise<IComment | boolean> {
    return api.post('/post/commentary', {
      postEmail,
      postBody,
      commentary: data,
    }, {
      headers: {
        token: userToken.value,
      },
    }).then((res) => res.data)
      .catch(() => false);
  }

  async function deleteComment(
    postEmail: string,
    postBody:string,
    commentary: string,
  ): Promise<boolean> {
    return api.delete('/post/commentary', {
      headers: {
        token: userToken.value,
      },
      data: {
        postEmail,
        postBody,
        commentary,
      },
    }).then(() => true).catch(() => false);
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

  async function createLike(postBody: string, postEmail: string) {
    return api.post('/post/like', {
      postEmail,
      postBody,
    }, {
      headers: {
        token: userToken.value,
      },
    });
  }

  async function deleteLike(postBody: string, postEmail: string) {
    return api.delete('/post/like', {
      headers: {
        token: userToken.value,
      },
      data: {
        postEmail,
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

  async function searchUserByEmail(email: string): Promise<any> {
    return api.get('/user/profile', {
      headers: {
        token: userToken.value,
        email,
      },
    }).then((res) => res.data);
  }

  async function followUser(emailUserFollowed: string) {
    return api.post('/user/follow', {
      emailUserFollowed,
    }, {
      headers: {
        token: userToken.value,
      },
    });
  }

  async function unfollowUser(emailUserUnfollowed: string) {
    return api.delete('/user/follow', {
      headers: {
        token: userToken.value,
      },
      data: {
        emailUserUnfollowed,
      },
    });
  }

  async function listPostsByUser(email: string): Promise<Array<IPost>> {
    return api.get(`post/user/${email}`, {
      headers: {
        token: userToken.value,
      },
    }).then((res) => res.data);
  }

  async function deleteUser() {
    return api.delete('/user', {
      headers: {
        token: userToken.value,
      },
    }).then(() => {
      logOut();
    });
  }

  return {
    user,
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
    followUser,
    unfollowUser,
    listPostsByUser,
    deleteUser,
    editUser,
    deleteComment,
    deletePost,
  };
}
