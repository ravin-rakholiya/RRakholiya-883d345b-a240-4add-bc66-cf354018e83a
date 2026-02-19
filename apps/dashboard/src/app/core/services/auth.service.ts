import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
  user: { id: string; email: string; role: string };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/auth`;

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.api}/login`, { email, password });
  }

  register(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.api}/register`, {
      email,
      password,
      firstName,
      lastName,
    });
  }
}
