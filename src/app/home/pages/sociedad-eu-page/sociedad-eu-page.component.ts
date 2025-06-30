import { Component, inject } from '@angular/core';
import { PageTitleComponent } from '@home/components/page-title/page-title.component';
import { ProjectCardComponent } from './components/project-card/project-card.component';
import { SociedadEuService } from './services/sociedad.service';

import { rxResource } from '@angular/core/rxjs-interop';
import { LocalizationService } from '@shared/services/localization.service';
import { AppText } from '@shared/utils/app-text';


@Component({
  selector: 'app-socieda-eu-page',
  imports: [PageTitleComponent],
  templateUrl: './sociedad-eu-page.component.html',
})
export class SociedaEuPageComponent {

  private sociedadService = inject(SociedadEuService);
  private lang = inject(LocalizationService);



  sociedadResponse = rxResource({
    request: () => ({}),
    loader: ({ request }) => {

      return this.sociedadService.getSociedad({});
    }
  });

  viewMoreText = this.lang.viewMoreText;
  titulo = this.lang.getText(AppText.ourProject.titleAux);
  descripcion = this.lang.getText(AppText.ourProject.descriptionAux);




}


