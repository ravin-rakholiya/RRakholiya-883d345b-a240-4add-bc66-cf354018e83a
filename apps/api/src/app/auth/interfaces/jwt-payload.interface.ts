export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export interface JwtTokenResult {
  accessToken: string;
  expiresIn: number;
  user: { id: string; email: string; role: string };
}
