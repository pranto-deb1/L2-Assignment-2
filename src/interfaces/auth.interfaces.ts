export interface IUserRegister {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IUserMiddleware {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}
