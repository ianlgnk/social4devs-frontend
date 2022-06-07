interface ILogIn {
    email: string,
    password: string,
}

interface IUser {
    email: string,
    name: string,
    bio: string,
    nickname: string,
    password: string,
    // avatar: ?
    githubAccount: string,
    specialties: Array<string>,
    followers: Array<IUser>,
    follows: Array<IUser>,
}

interface ICreateReturn {
    isSuccessful: boolean,
    feedbackMsg: string,
}

interface IComment {
    commentary: string;
    createdAt: string;
    name?: string,
    postBody: string;
    postEmail: string;
    userEmail: string;
    nickname: string;
}

interface IPost {
    commentaries: Array<IComment>,
    content: string,
    createdAt: string,
    name: string,
    email: string,
    liked: string,
    // eslint-disable-next-line @typescript-eslint/ban-types
    likes: Array<Object>,
    nickname: string,
    totalLikes: string,
    updatedAt: string,
}

interface IUserProvider {
    user: IUser,
    logIn(data: ILogIn): Promise<boolean>,
    logOut(): void,
    create(data: IUser): Promise<ICreateReturn>,
    createPost(data: string): Promise<boolean>,
    fetchPosts(): Promise<Array<IPost>>,
    createComment(data: string, postBody: string, postEmail: string): Promise<IComment | boolean>,
    createLike(postBody: string, postEmail: string): void,
    deleteLike(postBody: string, postEmail: string): void,
    listComments(postEmail: string, postBody: string): Promise<Array<IComment>>,
    listPostsByUser(email: string): Promise<Array<IPost>>,
    searchUser(valueToFind: string): Promise<Array<IUser>>,
    searchUserByEmail(email: string): Promise<any>,
    followUser(emailUserFollowed: string): void,
    unfollowUser(emailUserFollowed: string): void,
    deleteUser(): void,
    editUser(data: IUser): Promise<ICreateReturn>,
    deleteComment(postEmail: string, postBody:string, commentary: string): Promise<boolean>,
    deletePost(postBody: string): Promise<boolean>,
}

export {
  ILogIn, IUser, IUserProvider, ICreateReturn, IPost, IComment,
};
