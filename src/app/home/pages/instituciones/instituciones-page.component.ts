
import { Component, computed, inject, LOCALE_ID, signal } from '@angular/core';
import { PageTitleComponent } from "../../components/page-title/page-title.component";
import { InstitucionesService } from './services/instituciones.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { InstitucionCardComponent } from "./components/project-card/institucion-card.component";
import { LocalizationService } from '@shared/services/localization.service';
import { AppText } from '@shared/utils/app-text';

@Component({
  selector: 'app-aliados',
  imports: [PageTitleComponent, InstitucionCardComponent],
  templateUrl: './instituciones-page.component.html',
})
export class InstitucionesPageComponent {
  private currentLocale = signal(inject(LOCALE_ID));


  private institucionesServer = inject(InstitucionesService);

  private lang = inject(LocalizationService);

  asociados = this.lang.getText(AppText.instituciones.asociadsos);
  title = this.lang.getText(AppText.instituciones.title);
  subtitle = this.lang.getText(AppText.instituciones.subtitle);



  institucionesResponse = rxResource({
    request: () => ({}),
    loader: ({ request }) => {

      return this.institucionesServer.getInstituciones({});
    }
  });


  institucionesAsociadasResponse = rxResource({
    request: () => ({}),
    loader: ({ request }) => {
      console.log('Loading instituciones asociadas');
      console.log('request', request);
      return this.institucionesServer.getInstitucionesAsociadas({});
    }
  });






}


