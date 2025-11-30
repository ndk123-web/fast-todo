export interface SignUpRequest {
  email: string;
  password: string;
  fullName: string;
  googleLogin: boolean;
  idToken: string;
}

interface signUpInside {
  email: string;
  _accessToken: string;
  _refreshToken: string;
  userId: string;
}

export interface signUpResponse {
  response: signUpInside;
}
