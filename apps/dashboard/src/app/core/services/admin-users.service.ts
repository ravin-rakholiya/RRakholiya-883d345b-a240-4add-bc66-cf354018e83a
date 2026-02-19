import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organizationId: string;
  roleId: string;
}

@Injectable({ providedIn: 'root' })
export class AdminUsersService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/users`;

  createUser(body: CreateUserRequest): Observable<unknown> {
    return this.http.post(this.api, body);
  }
}
