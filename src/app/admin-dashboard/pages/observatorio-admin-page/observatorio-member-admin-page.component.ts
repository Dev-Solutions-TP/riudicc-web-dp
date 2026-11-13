import { Component, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ObservatorioCargo } from '@home/pages/observatorio/observatorio.interface';
import { ObservatorioService } from '@home/pages/observatorio/observatorio.service';
import { InstitutionOption } from './components/observatorio-member-form.component';
import {
  ObservatorioMemberDetailsComponent,
  UpdateMemberPayload,
} from './components/observatorio-member-details.component';

@Component({
  selector: 'app-observatorio-member-admin-page',
  standalone: true,
  imports: [ObservatorioMemberDetailsComponent, RouterLink],
  templateUrl: './observatorio-member-admin-page.component.html',
})
export class ObservatorioMemberAdminPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(ObservatorioService);
  private readonly http = inject(HttpClient);

  readonly memberId = toSignal(
    this.route.paramMap.pipe(map(params => params.get('id') ?? '')),
    { initialValue: '' },
  );
  readonly saving = signal(false);
  readonly actionError = signal('');

  readonly editResource = rxResource({
    request: () => {
      const id = this.memberId();
      return id ? { id } : undefined;
    },
    loader: ({ request }) => forkJoin({
      member: this.service.getMember(request.id),
      positions: this.service.getPositions(),
      institutionResponse: this.http.get<{ items: InstitutionOption[] }>(environment.baseUrl + '/instituciones', {
        params: new HttpParams().set('limit', 100).set('offset', 0),
      }),
    }),
  });

  save(payload: UpdateMemberPayload): void {
    const id = this.memberId();
    if (!id) return;

    this.actionError.set('');
    this.saving.set(true);
    this.service.saveMember(payload, id).subscribe({
      next: () => this.router.navigate(['/admin/observatorio']),
      error: err => {
        this.actionError.set(err?.error?.message ?? 'No se pudieron guardar los cambios.');
        this.saving.set(false);
      },
      complete: () => this.saving.set(false),
    });
  }
}
