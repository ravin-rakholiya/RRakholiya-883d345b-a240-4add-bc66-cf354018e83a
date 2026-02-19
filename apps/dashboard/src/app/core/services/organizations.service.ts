import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import type { Organization } from '@turbo-vets/data';

@Injectable({ providedIn: 'root' })
export class OrganizationsService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/organizations`;

  getOrganizations(): Observable<Organization[]> {
    return this.http.get<Organization[]>(this.api);
  }

  createOrganization(name: string, parentId?: string): Observable<Organization> {
    return this.http.post<Organization>(this.api, { name, parentId: parentId ?? null });
  }
}
