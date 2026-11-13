import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ObservatorioCargo, ObservatorioMember } from '@home/pages/observatorio/observatorio.interface';
import { InstitutionOption } from './observatorio-member-form.component';

export interface UpdateMemberPayload {
  nombre: string;
  correo: string;
  enlaceContacto: string;
  cargoId: string;
  institucionId: string;
  isActive: boolean;
}

@Component({
  selector: 'app-observatorio-member-details',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './observatorio-member-details.component.html',
})
export class ObservatorioMemberDetailsComponent implements OnChanges {
  private readonly formBuilder = inject(FormBuilder);

  @Input({ required: true }) member!: ObservatorioMember;
  @Input({ required: true }) positions: ObservatorioCargo[] = [];
  @Input({ required: true }) institutions: InstitutionOption[] = [];
  @Input() saving = false;
  @Output() save = new EventEmitter<UpdateMemberPayload>();

  readonly form = this.formBuilder.group({
    nombre: ['', [Validators.required, Validators.maxLength(160)]],
    correo: ['', Validators.email],
    enlaceContacto: [''],
    cargoId: ['', Validators.required],
    institucionId: ['', Validators.required],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['member'] && this.member) {
      this.form.reset({
        nombre: this.member.nombre,
        correo: this.member.correo ?? '',
        enlaceContacto: this.member.enlaceContacto ?? '',
        cargoId: this.member.cargo.id,
        institucionId: this.member.institucion.id,
      });
    }
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const values = this.form.getRawValue();
    this.save.emit({
      nombre: values.nombre ?? '',
      correo: values.correo ?? '',
      enlaceContacto: values.enlaceContacto ?? '',
      cargoId: values.cargoId ?? '',
      institucionId: values.institucionId ?? '',
      isActive: this.member.isActive,
    });
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
}
