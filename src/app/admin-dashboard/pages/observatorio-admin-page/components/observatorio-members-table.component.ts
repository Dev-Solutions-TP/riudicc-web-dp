import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ObservatorioMember } from '@home/pages/observatorio/observatorio.interface';

@Component({
  selector: 'app-observatorio-members-table',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './observatorio-members-table.component.html',
})
export class ObservatorioMembersTableComponent {
  @Input({ required: true }) members: ObservatorioMember[] = [];
  @Output() deactivate = new EventEmitter<ObservatorioMember>();

  cargoName(member: ObservatorioMember): string {
    return member.cargo.traducciones?.find(item => item.idioma === 'es')?.nombre ?? member.cargo.codigo;
  }

  institutionName(member: ObservatorioMember): string {
    const translations = member.institucion?.traducciones ?? [];
    return translations.find(item => item.idioma === 'es')?.name
      ?? translations.find(item => item.idioma === 'es')?.nombre
      ?? member.institucion?.id
      ?? '—';
  }
}
