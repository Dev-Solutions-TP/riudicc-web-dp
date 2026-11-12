import { Component, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { finalize, forkJoin, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ObservatorioCargo, ObservatorioMember } from '@home/pages/observatorio/observatorio.interface';
import { ObservatorioService } from '@home/pages/observatorio/observatorio.service';
import {
  NewMemberPayload,
  ObservatorioMemberFormComponent,
} from './components/observatorio-member-form.component';
import { ObservatorioMembersTableComponent } from './components/observatorio-members-table.component';
import {
  NewPositionPayload,
  ObservatorioPositionsSectionComponent,
} from './components/observatorio-positions-section.component';

interface Institution {
  id: string;
  traducciones?: Array<{ idioma: string; name?: string; nombre?: string }>;
}

@Component({
  selector: 'app-observatorio-admin-page',
  standalone: true,
  imports: [
    ObservatorioMemberFormComponent,
    ObservatorioMembersTableComponent,
    ObservatorioPositionsSectionComponent,
  ],
  templateUrl: './observatorio-admin-page.component.html',
})
export class ObservatorioAdminPageComponent {
  private readonly service = inject(ObservatorioService);
  private readonly http = inject(HttpClient);
  private readonly api = environment.baseUrl;

  readonly members = signal<ObservatorioMember[]>([]);
  readonly positions = signal<ObservatorioCargo[]>([]);
  readonly institutions = signal<Institution[]>([]);
  readonly activeTab = signal<'members' | 'positions'>('members');
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly success = signal('');

  constructor() {
    this.reload();
  }

  reload(): void {
    this.loading.set(true);
    this.error.set('');

    forkJoin([
      this.service.getMembers(),
      this.service.getPositions(),
      this.http.get<{ items: Institution[] }>(this.api + '/instituciones', {
        params: new HttpParams().set('limit', 100).set('offset', 0),
      }),
    ])
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ([members, positions, institutions]) => {
          this.members.set(members.items);
          this.positions.set(positions);
          this.institutions.set(institutions.items);
        },
        error: () => this.error.set('No se pudieron cargar los datos. Verifica tu sesión y permisos.'),
      });
  }

  savePosition(payload: NewPositionPayload): void {
    this.runAction(
      this.service.savePosition({
        codigo: payload.codigo,
        traducciones: [
          { idioma: 'es', nombre: payload.nombreEs },
          { idioma: 'en', nombre: payload.nombreEn },
        ],
      }),
      'Cargo guardado.',
      'No se pudo guardar el cargo.',
    );
  }

  saveMember(payload: NewMemberPayload): void {
    this.runAction(
      this.service.saveMember({
        ...payload,
        correo: payload.correo || null,
        enlaceContacto: payload.enlaceContacto || null,
      }),
      'Miembro guardado.',
      'No se pudo guardar el miembro.',
    );
  }

  deactivate(member: ObservatorioMember): void {
    if (!confirm('¿Finalizar el periodo de ' + member.nombre + '?')) return;

    this.runAction(
      this.service.deactivateMember(member.id),
      'Periodo finalizado.',
      'No se pudo finalizar el periodo.',
    );
  }

  private runAction(
    request: Observable<unknown>,
    successMessage: string,
    errorMessage: string,
  ): void {
    this.error.set('');
    this.success.set('');
    this.saving.set(true);

    request.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => {
        this.success.set(successMessage);
        this.reload();
      },
      error: err => this.error.set(err?.error?.message ?? errorMessage),
    });
  }
}
