import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { LocalizationService } from '@shared/services/localization.service';
import { PageTitleComponent } from '@home/components/page-title/page-title.component';
import { ObservatorioService } from './observatorio.service';
import { AppText } from '@shared/utils/app-text';
import { ObservatorioMemberCardComponent } from './components/observatorio-member-card/observatorio-member-card.component';

@Component({
  selector: 'app-observatorio-page-component',
  imports: [PageTitleComponent, ObservatorioMemberCardComponent],
  templateUrl: './observatorio-page.component.html',
})
export class ObservatorioPageComponent {
  private service = inject(ObservatorioService);
  private lang = inject(LocalizationService);
  title = this.lang.getText(AppText.observatorio.title);
  subtitle = this.lang.getText(AppText.observatorio.subtitle);
  emptyMessage = this.lang.getText(AppText.observatorio.empty);
  loadErrorMessage = this.lang.getText(AppText.observatorio.loadError);
  members = rxResource({ request: () => ({}), loader: () => this.service.getPublicMembers() });
}
