import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ObservatorioCargo, ObservatorioList, ObservatorioMember } from './observatorio.interface';

@Injectable({ providedIn: 'root' })
export class ObservatorioService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.baseUrl + '/observatorio';

  getPublicMembers(): Observable<ObservatorioList<ObservatorioMember>> {
    return this.http.get<ObservatorioList<ObservatorioMember>>(`${this.api}/public`);
  }
  getMembers(): Observable<ObservatorioList<ObservatorioMember>> {
    return this.http.get<ObservatorioList<ObservatorioMember>>(`${this.api}/miembros`);
  }
  getPositions(): Observable<ObservatorioCargo[]> {
    return this.http.get<ObservatorioCargo[]>(`${this.api}/cargos`);
  }
  savePosition(payload: Partial<ObservatorioCargo>): Observable<ObservatorioCargo> {
    return payload.id
      ? this.http.patch<ObservatorioCargo>(`${this.api}/cargos/${payload.id}`, payload)
      : this.http.post<ObservatorioCargo>(`${this.api}/cargos`, payload);
  }
  saveMember(payload: Record<string, unknown>, id?: string): Observable<ObservatorioMember> {
    return id
      ? this.http.patch<ObservatorioMember>(`${this.api}/miembros/${id}`, payload)
      : this.http.post<ObservatorioMember>(`${this.api}/miembros`, payload);
  }
  deactivateMember(id: string): Observable<ObservatorioMember> {
    return this.http.delete<ObservatorioMember>(`${this.api}/miembros/${id}`);
  }
}
