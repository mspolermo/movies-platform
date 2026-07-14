/** Параметры POST /auth/login. */
export type TLoginParams = {
  email: string;
  password: string;
};

/** Параметры POST /auth/registration. */
export type TRegisterParams = {
  email: string;
  password: string;
  name?: string;
};
