import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { LocalizationService } from '@shared/services/localization.service';
import { AppText } from '@shared/utils/app-text';
import { SociedadEuService } from '../sociedad-eu-page/services/sociedad.service';
import { PageTitleComponent } from "@home/components/page-title/page-title.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-observatorio-page-component',
  imports: [PageTitleComponent, RouterLink],
  templateUrl: './observatorio-page.component.html',
})
export class ObservatorioPageComponent {
  private sociedadService = inject(SociedadEuService);
  private lang = inject(LocalizationService);



  sociedadResponse = rxResource({
    request: () => ({}),
    loader: ({ request }) => {

      return this.sociedadService.getSociedad({});
    }
  });

  viewMoreText = this.lang.viewMoreText;
  titulo = this.lang.getText(AppText.observatorio.titleAux);
  descripcion = this.lang.getText(AppText.observatorio.descriptionAux);

  goHomeText = this.lang.getText(AppText.notFound.goHome, 'Go Home');

}
