import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ObservatorioCargo, ObservatorioMember } from '@home/pages/observatorio/observatorio.interface';
import { ObservatorioService } from '@home/pages/observatorio/observatorio.service';

interface Institution { id: string; traducciones?: Array<{ idioma: string; name?: string; nombre?: string }>; }
@Component({
  selector: 'app-observatorio-admin-page',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './observatorio-admin-page.component.html',
})
export class ObservatorioAdminPageComponent {
  private service = inject(ObservatorioService);
  private http = inject(HttpClient);
  private api = environment.baseUrl;
  members = signal<ObservatorioMember[]>([]);
  positions = signal<ObservatorioCargo[]>([]);
  institutions = signal<Institution[]>([]);
  error = signal('');
  success = signal('');
  memberForm = { nombre: '', correo: '', enlaceContacto: '', cargoId: '', institucionId: '' };
  positionForm = { codigo: '', nombreEs: '', nombreEn: '' };

  constructor() { this.reload(); }
  reload() {
    this.error.set('');
    forkJoin([
      this.service.getMembers(), this.service.getPositions(),
      this.http.get<{items: Institution[]}>(`${this.api}/instituciones`, { params: new HttpParams().set('limit', 100).set('offset', 0) }),
    ]).subscribe({
      next: ([members, positions, institutions]) => { this.members.set(members.items); this.positions.set(positions); this.institutions.set(institutions.items); },
      error: () => this.error.set('No se pudieron cargar los datos. Verifica tu sesión y permisos.'),
    });
  }
  institutionName(institution: Institution) {
    const translations = institution.traducciones ?? [];
    return translations.find(t => t.idioma === 'es')?.name ?? translations.find(t => t.idioma === 'es')?.nombre ?? institution.id;
  }
  cargoName(cargo: ObservatorioCargo) { return cargo.traducciones?.find(t => t.idioma === 'es')?.nombre ?? cargo.codigo; }
  savePosition() {
    this.error.set(''); this.success.set('');
    this.service.savePosition({ codigo: this.positionForm.codigo, traducciones: [
      { idioma: 'es', nombre: this.positionForm.nombreEs }, { idioma: 'en', nombre: this.positionForm.nombreEn },
    ] }).subscribe({ next: () => { this.positionForm = { codigo: '', nombreEs: '', nombreEn: '' }; this.success.set('Cargo guardado.'); this.reload(); }, error: e => this.error.set(e.error?.message ?? 'No se pudo guardar el cargo.') });
  }
  saveMember() {
    this.error.set(''); this.success.set('');
    this.service.saveMember({ ...this.memberForm, correo: this.memberForm.correo || null, enlaceContacto: this.memberForm.enlaceContacto || null }).subscribe({
      next: () => { this.memberForm = { nombre: '', correo: '', enlaceContacto: '', cargoId: '', institucionId: '' }; this.success.set('Miembro guardado.'); this.reload(); },
      error: e => this.error.set(e.error?.message ?? 'No se pudo guardar el miembro.'),
    });
  }
  deactivate(member: ObservatorioMember) {
    this.service.deactivateMember(member.id).subscribe({ next: () => { this.success.set('Miembro desactivado.'); this.reload(); }, error: e => this.error.set(e.error?.message ?? 'No se pudo desactivar.') });
  }
}