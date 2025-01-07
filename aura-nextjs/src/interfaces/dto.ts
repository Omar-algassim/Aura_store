export interface SignupDTO {
  email?: string;
  phone_number?: string;
  password: string;
  username?: string;
}

export interface SigninDTO {
  provider: string;
  password: string;
}
