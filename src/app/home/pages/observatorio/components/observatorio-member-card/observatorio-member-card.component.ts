import { Component, computed, inject, input } from '@angular/core';
import { ImageNamePipe } from '@shared/pipes/image.pipe';
import { LocalizationService } from '@shared/services/localization.service';
import { LocaleService } from '@shared/services/locale.service';
import { AppText } from '@shared/utils/app-text';
import { ObservatorioMember } from '../../observatorio.interface';

@Component({
  selector: 'app-observatorio-member-card',
  standalone: true,
  imports: [ImageNamePipe],
  templateUrl: './observatorio-member-card.component.html',
})
export class ObservatorioMemberCardComponent {
  readonly member = input.required<ObservatorioMember>();

  private readonly locale = inject(LocaleService).localeSignal;
  private readonly localization = inject(LocalizationService);

  readonly contactEmailText = this.localization.getText(AppText.observatorio.contactEmail);
  readonly contactLinkText = this.localization.getText(AppText.observatorio.contactLink);
  readonly institutionName = computed(() => {
    const translations = this.member().institucion?.traducciones ?? [];
    const language = this.locale();
    return translations.find(item => item.idioma === language)?.name
      ?? translations.find(item => item.idioma === language)?.nombre
      ?? translations.find(item => item.idioma === 'es')?.name
      ?? translations.find(item => item.idioma === 'es')?.nombre
      ?? '';
  });

  readonly cargoName = computed(() => {
    const translations = this.member().cargo?.traducciones ?? [];
    const language = this.locale();
    return translations.find(item => item.idioma === language)?.nombre
      ?? translations.find(item => item.idioma === 'es')?.nombre
      ?? this.member().cargo?.codigo
      ?? '';
  });

  private readonly emailSubject = this.localization.getText(AppText.observatorio.emailSubject);
  private readonly emailBody = this.localization.getText(AppText.observatorio.emailBody);

  mailto(): string {
    const member = this.member();
    const subject = encodeURIComponent(this.emailSubject());
    const body = encodeURIComponent(this.emailBody());
    return 'mailto:' + member.correo + '?subject=' + subject + '&body=' + body;
  }
}
