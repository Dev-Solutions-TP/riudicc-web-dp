import { Component, computed, inject, input, InputSignal, LOCALE_ID, signal, WritableSignal } from '@angular/core';
import { getTraduccionNoticia } from '../../utils/noticia.utils';
import { NoticiaEntity } from '../../interfaces/noticia.interface';

import { NoticiaCarouselComponent } from "../noticia-carousel/noticia-carousel.component";

import { ImageNamePipe } from '@shared/pipes/image.pipe';
import { RouterLink } from '@angular/router';
import { InstitucionEntity } from '@home/pages/instituciones/interfaces/aliados.interface';
import { DatePipe } from '@angular/common';
import { EnlaceIconPipe } from "../../../../../shared/pipes/icon.pipe";
import { LocalizationService } from '@shared/services/localization.service';
import { AppText } from '@shared/utils/app-text';

@Component({
  selector: 'noticia-page-view',
  imports: [RouterLink, NoticiaCarouselComponent, ImageNamePipe, DatePipe, EnlaceIconPipe],
  templateUrl: './noticia-page-view.component.html',
})
export class NoticiaPageViewComponent {


  noticia = input.required<NoticiaEntity>();
  private currentLocale = signal(inject(LOCALE_ID));

  private lang = inject(LocalizationService);




  traduccion = getTraduccionNoticia(this.noticia, this.currentLocale);

  imagenPrincipal = computed(() => this.noticia().images?.[0]);
  imagenPrincipalInst(inst: InstitucionEntity) {
    return inst.images?.[0];
  }

  getTraduccionInstitucion(inst: InstitucionEntity) {
    const lang = this.currentLocale();
    return inst.traducciones.find(t => t.idioma === lang) ?? inst.traducciones[0];
  }

  enlacesRelacionados = this.lang.getText(AppText.app.enlacesRelacionados);
  sociosRelacionados = this.lang.getText(AppText.app.sociosRelacionados);


}