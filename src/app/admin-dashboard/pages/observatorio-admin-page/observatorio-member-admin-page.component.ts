import { Component, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin, map } from 'rxjs';
import { AlertMessageComponent } from '@dashboard/components/alert-message/alert-message.component';
import { LocalizationService } from '@shared/services/localization.service';
import { AppText } from '@shared/utils/app-text';
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
  imports: [ObservatorioMemberDetailsComponent, RouterLink, AlertMessageComponent],
  templateUrl: './observatorio-member-admin-page.component.html',
})
export class ObservatorioMemberAdminPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(ObservatorioService);
  private readonly http = inject(HttpClient);
  private readonly localization = inject(LocalizationService);

  readonly text = {
    back: this.localization.getText(AppText.observatorio.adminBack),
    editTitle: this.localization.getText(AppText.observatorio.adminEditTitle),
    member: this.localization.getText(AppText.observatorio.adminMember),
    loading: this.localization.getText(AppText.observatorio.adminLoading),
    loadError: this.localization.getText(AppText.observatorio.adminLoadError),
    saveError: this.localization.getText(AppText.observatorio.adminSaveError),
  };

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
    loader: ({ request }) => {
      if (!request) {
        throw new Error('No se recibió el ID del miembro.');
      }

      return forkJoin({
        member: this.service.getMember(request.id),
        positions: this.service.getPositions(),
        institutionResponse: this.http.get<{ items: InstitutionOption[] }>(
          environment.baseUrl + '/instituciones',
          {
            params: new HttpParams()
              .set('limit', 100)
              .set('offset', 0),
          },
        ),
      });
    },
  });

  save(payload: UpdateMemberPayload): void {
    const id = this.memberId();
    if (!id) return;

    this.actionError.set('');
    this.saving.set(true);
    this.service.saveMember(payload, id).subscribe({
      next: () => this.router.navigate(['/admin/observatorio']),
      error: err => {
        const message = err?.error?.message;
        this.actionError.set(
          Array.isArray(message) ? message.join('. ') : message ?? this.text.saveError(),
        );
        this.saving.set(false);
      },
      complete: () => this.saving.set(false),
    });
  }
}
