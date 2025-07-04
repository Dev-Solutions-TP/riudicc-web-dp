import { Component, computed, inject, LOCALE_ID, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { InstitucionesService } from '@home/pages/instituciones/services/instituciones.service';
import { getImagenPrincipal } from '@home/pages/instituciones/utils/institucion.utils';
import { InstitucionPageViewComponent } from './components/institucion-page-view/institucion-page-view.component';
import { PageTitleComponent } from "../../../../components/page-title/page-title.component";
import { LocalizationService } from '@shared/services/localization.service';
import { AppText } from '@shared/utils/app-text';

@Component({
  selector: 'app-institucion',
  imports: [InstitucionPageViewComponent, PageTitleComponent],
  templateUrl: './institucion-page.component.html',
})
export class InstitucionPageComponent {

  private institucionesService = inject(InstitucionesService);
  currentLocale = signal(inject(LOCALE_ID));



  private lang = inject(LocalizationService);

  asociados = this.lang.getText(AppText.instituciones.asociado);
  socio = this.lang.getText(AppText.instituciones.socio);


  activatedRoute = inject(ActivatedRoute);
  param = this.activatedRoute.snapshot.paramMap.get('idSlug') ?? '';

  institucionIdslug = signal(this.param);

  institucionResource = rxResource({
    request: () => ({ idSlug: this.institucionIdslug }),
    loader: ({ request }) => {
      console.log('Cargando institución para:', request.idSlug());
      return this.institucionesService.getInstitucionByIdSlug(request.idSlug());
    }
  });


  sociosTitleText: Record<'es' | 'en' | 'fr', string> = {
    es: 'Socio',
    en: 'Partner',
    fr: 'Partenaire',
  };

  titulo = computed(() => {
    if (this.institucionResource.hasValue()) {
      if (this.institucionResource.value()?.tipo === 'socio') {
        return this.socio();
      }
      return this.asociados();
    } else {
      return this.socio();
    }
  });


}
