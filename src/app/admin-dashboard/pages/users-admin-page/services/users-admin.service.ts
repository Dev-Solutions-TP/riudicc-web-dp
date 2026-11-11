import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  CreateUserDto,
  InstitutionOption,
  UpdateUserDto,
  UserEntity,
  UsersResponse,
} from '../interfaces/user-admin.interface';

@Injectable({ providedIn: 'root' })
export class UsersAdminService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.baseUrl;

  getUsers(limit = 10, offset = 0): Observable<UsersResponse> {
    const params = new HttpParams().set('limit', limit).set('offset', offset);
    return this.http.get<UsersResponse>(`${this.apiUrl}/users`, { params });
  }

  getUser(id: string): Observable<UserEntity> {
    return this.http.get<UserEntity>(`${this.apiUrl}/users/${id}`);
  }

  getInstitutions(): Observable<{ items: InstitutionOption[] }> {
    const params = new HttpParams().set('limit', 100).set('offset', 0);
    return this.http.get<{ items: InstitutionOption[] }>(`${this.apiUrl}/instituciones`, { params });
  }

  createUser(data: CreateUserDto): Observable<UserEntity> {
    return this.http.post<UserEntity>(`${this.apiUrl}/users`, data);
  }

  updateUser(id: string, data: UpdateUserDto): Observable<UserEntity> {
    return this.http.patch<UserEntity>(`${this.apiUrl}/users/${id}`, data);
  }

  updateRoles(id: string, roles: string[]): Observable<UserEntity> {
    return this.http.patch<UserEntity>(`${this.apiUrl}/users/${id}/roles`, { roles });
  }

  setActive(id: string, active: boolean): Observable<UserEntity> {
    return active
      ? this.http.patch<UserEntity>(`${this.apiUrl}/users/${id}/reactivate`, {})
      : this.http.delete<UserEntity>(`${this.apiUrl}/users/${id}`);
  }
}
