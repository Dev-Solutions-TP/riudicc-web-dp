import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { LocalizationService } from '@shared/services/localization.service';
import { PageTitleComponent } from '@home/components/page-title/page-title.component';
import { ObservatorioService } from './observatorio.service';
import { ObservatorioCargo, ObservatorioMember } from './observatorio.interface';

@Component({
  selector: 'app-observatorio-page-component',
  imports: [PageTitleComponent],
  templateUrl: './observatorio-page.component.html',
})
export class ObservatorioPageComponent {
  private service = inject(ObservatorioService);
  private lang = inject(LocalizationService);
  members = rxResource({ request: () => ({}), loader: () => this.service.getPublicMembers() });
  title = () => document.documentElement.lang?.startsWith('en') ? 'Observatory coordination' : 'Quién coordina el observatorio';
  subtitle = () => document.documentElement.lang?.startsWith('en')
    ? 'A team representing every region of the network.'
    : 'Un equipo con representación de cada región de la red.';
  currentLanguage(): string { return document.documentElement.lang?.startsWith('en') ? 'en' : 'es'; }
  cargoName(cargo: ObservatorioCargo): string {
    const language = this.currentLanguage();
    return cargo.traducciones?.find(item => item.idioma === language)?.nombre
      ?? cargo.traducciones?.find(item => item.idioma === 'es')?.nombre ?? cargo.codigo;
  }
  institutionName(member: ObservatorioMember): string {
    const language = this.currentLanguage();
    const translations = member.institucion?.traducciones ?? [];
    return translations.find(item => item.idioma === language)?.name
      ?? translations.find(item => item.idioma === language)?.nombre
      ?? translations.find(item => item.idioma === 'es')?.name
      ?? translations.find(item => item.idioma === 'es')?.nombre ?? '';
  }
  institutionImage(member: ObservatorioMember): string {
    const image = member.institucion?.images?.[0];
    return image?.url ?? image?.image ?? '';
  }
  mailto(member: ObservatorioMember): string {
    const subject = encodeURIComponent('Contacto desde RIUDICC');
    const body = encodeURIComponent('He visto su posición en RIUDICC y necesito poder contactar.\n\n');
    return `mailto:${member.correo}?subject=${subject}&body=${body}`;
  }
}