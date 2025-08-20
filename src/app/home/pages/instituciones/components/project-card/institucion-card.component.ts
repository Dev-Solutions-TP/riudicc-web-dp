import { Component, computed, inject, input, LOCALE_ID, signal } from '@angular/core';



import { InstitucionEntity } from '../../interfaces/aliados.interface';
import { RouterLink } from '@angular/router';
import { LocalizationService } from '@shared/services/localization.service';
import { getImagenPrincipal, getTraduccion } from '../../utils/institucion.utils';
import { ImageNamePipe } from '@shared/pipes/image.pipe';


@Component({
  selector: 'institucion-card',
  imports: [ImageNamePipe, RouterLink],
  templateUrl: './institucion-card.component.html',
})
export class InstitucionCardComponent {


  constructor() { }

  private lang = inject(LocalizationService);


  institucion = input.required<InstitucionEntity>();

  // localet = signal('es'); // o 'en', o como quieras gestionar el idioma

  // Obtiene la traducción preferida según idiomaActual, sino la primera


  private currentLocale = signal(inject(LOCALE_ID));

  // Obtiene la imagen principal (puedes usar la primera o una que cumpla algún criterio)
  imagenPrincipal =
    getImagenPrincipal(this.institucion);
  traduccion = getTraduccion(this.institucion, this.currentLocale);


  abrirEnlace(url: string) {
    window.open(url, '_blank');
  }



  viewMoreText = this.lang.viewMoreText;
  showMapText = this.lang.showMapText;



}
