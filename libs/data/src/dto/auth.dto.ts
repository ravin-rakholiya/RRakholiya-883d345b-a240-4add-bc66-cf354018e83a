export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponseDto {
  accessToken: string;
  expiresIn: number;
  user: { id: string; email: string; role: string };
}
