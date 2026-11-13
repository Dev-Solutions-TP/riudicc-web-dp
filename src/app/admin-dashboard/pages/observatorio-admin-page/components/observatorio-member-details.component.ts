import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';
import { LocalizationService } from '@shared/services/localization.service';
import { AppText } from '@shared/utils/app-text';
import { FormUtils } from '@shared/utils/form-utils';
import { ObservatorioCargo, ObservatorioMember } from '@home/pages/observatorio/observatorio.interface';
import { InstitutionOption } from './observatorio-member-form.component';

export interface UpdateMemberPayload {
  nombre: string;
  correo: string | null;
  enlaceContacto: string | null;
  cargoId: string;
  institucionId: string;
  isActive: boolean;
}

@Component({
  selector: 'app-observatorio-member-details',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, FormErrorLabelComponent],
  templateUrl: './observatorio-member-details.component.html',
})
export class ObservatorioMemberDetailsComponent implements OnChanges {
  private readonly formBuilder = inject(FormBuilder);
  private readonly localization = inject(LocalizationService);
  private readonly formUtils = FormUtils;

  readonly text = {
    details: this.localization.getText(AppText.observatorio.adminDetails),
    fullName: this.localization.getText(AppText.observatorio.adminFullName),
    email: this.localization.getText(AppText.observatorio.adminEmail),
    contact: this.localization.getText(AppText.observatorio.adminContact),
    position: this.localization.getText(AppText.observatorio.adminPosition),
    institution: this.localization.getText(AppText.observatorio.adminInstitution),
    period: this.localization.getText(AppText.observatorio.adminPeriod),
    status: this.localization.getText(AppText.observatorio.adminStatus),
    active: this.localization.getText(AppText.observatorio.adminActive),
    inactive: this.localization.getText(AppText.observatorio.adminInactive),
    start: this.localization.getText(AppText.observatorio.adminStart),
    end: this.localization.getText(AppText.observatorio.adminEnd),
    save: this.localization.getText(AppText.observatorio.adminSave),
    contactPlaceholder: this.localization.getText(AppText.observatorio.adminContactPlaceholder),
  };

  @Input({ required: true }) member!: ObservatorioMember;
  @Input({ required: true }) positions: ObservatorioCargo[] = [];
  @Input({ required: true }) institutions: InstitutionOption[] = [];
  @Input() saving = false;
  @Output() save = new EventEmitter<UpdateMemberPayload>();

  readonly form = this.formBuilder.group({
    nombre: ['', [Validators.required, Validators.maxLength(160)]],
    correo: ['', Validators.email],
    enlaceContacto: ['', Validators.pattern(this.formUtils.urlPattern)],
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
      correo: values.correo?.trim() || null,
      enlaceContacto: values.enlaceContacto?.trim() || null,
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
