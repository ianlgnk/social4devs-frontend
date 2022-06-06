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
}

interface ICreateReturn {
    isSuccessful: boolean,
    feedbackMsg: string,
}

interface IUserProvider {
    user: IUser,
    isTokenDefined: boolean,
    logIn(data: ILogIn): Promise<boolean>,
    logOut(): void,
    create(data: IUser): Promise<ICreateReturn>,
}

export {
  ILogIn, IUser, IUserProvider, ICreateReturn,
};
