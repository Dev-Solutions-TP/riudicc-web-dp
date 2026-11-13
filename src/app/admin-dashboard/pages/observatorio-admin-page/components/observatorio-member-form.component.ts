import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ObservatorioCargo } from '@home/pages/observatorio/observatorio.interface';

export interface InstitutionOption {
  id: string;
  traducciones?: Array<{ idioma: string; name?: string; nombre?: string }>;
}

export interface NewMemberPayload {
  nombre: string;
  correo: string;
  enlaceContacto: string;
  cargoId: string;
  institucionId: string;
}

@Component({
  selector: 'app-observatorio-member-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './observatorio-member-form.component.html',
})
export class ObservatorioMemberFormComponent {
  @Input({ required: true }) positions: ObservatorioCargo[] = [];
  @Input({ required: true }) institutions: InstitutionOption[] = [];
  @Input() saving = false;
  @Output() save = new EventEmitter<NewMemberPayload>();

  form: NewMemberPayload = this.emptyForm();

  submit(): void {
    this.save.emit({ ...this.form });
    this.form = this.emptyForm();
  }

  cargoName(cargo: ObservatorioCargo): string {
    return cargo.traducciones?.find(item => item.idioma === 'es')?.nombre ?? cargo.codigo;
  }

  institutionName(institution: InstitutionOption): string {
    const translations = institution.traducciones ?? [];
    return translations.find(item => item.idioma === 'es')?.name
      ?? translations.find(item => item.idioma === 'es')?.nombre
      ?? institution.id;
  }

  private emptyForm(): NewMemberPayload {
    return { nombre: '', correo: '', enlaceContacto: '', cargoId: '', institucionId: '' };
  }
}
