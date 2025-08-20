import { Component, computed, inject, input, LOCALE_ID, signal } from '@angular/core';
import { InstitucionEntity } from '@home/pages/instituciones/interfaces/aliados.interface';

import { abrirEnlace, getCountryCode, getImagenPrincipal, getTraduccion } from '@home/pages/instituciones/utils/institucion.utils';
import { LocalizationService } from '@shared/services/localization.service';
import { AppText } from '@shared/utils/app-text';
import { EnlaceIconPipe } from "../../../../../../../shared/pipes/icon.pipe";
import { ImageNamePipe } from '@shared/pipes/image.pipe';


@Component({
  selector: 'institucion-page-view',
  imports: [ImageNamePipe, EnlaceIconPipe],
  templateUrl: './institucion-page-view.component.html',
})
export class InstitucionPageViewComponent {


  private currentLocale = signal(inject(LOCALE_ID));
  private lang = inject(LocalizationService);

  constructor() { }
  institucion = input.required<InstitucionEntity>();

  traduccion = getTraduccion(this.institucion, this.currentLocale);

  imagenPrincipal =
    getImagenPrincipal(this.institucion);

  abrirEnlace = abrirEnlace;




  enlacesRelacionados = this.lang.getText(AppText.app.enlacesRelacionados);

}
