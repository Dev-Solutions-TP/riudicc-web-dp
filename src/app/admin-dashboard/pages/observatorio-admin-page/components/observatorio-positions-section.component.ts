import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ObservatorioCargo } from '@home/pages/observatorio/observatorio.interface';

export interface NewPositionPayload {
  codigo: string;
  nombreEs: string;
  nombreEn: string;
}

@Component({
  selector: 'app-observatorio-positions-section',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './observatorio-positions-section.component.html',
})
export class ObservatorioPositionsSectionComponent {
  @Input({ required: true }) positions: ObservatorioCargo[] = [];
  @Input() saving = false;
  @Output() save = new EventEmitter<NewPositionPayload>();

  form: NewPositionPayload = this.emptyForm();

  submit(): void {
    this.save.emit({ ...this.form });
    this.form = this.emptyForm();
  }

  cargoName(cargo: ObservatorioCargo, language: 'es' | 'en'): string {
    return cargo.traducciones?.find(item => item.idioma === language)?.nombre ?? '—';
  }

  private emptyForm(): NewPositionPayload {
    return { codigo: '', nombreEs: '', nombreEn: '' };
  }
}
