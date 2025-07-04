import { Component, inject, input, LOCALE_ID, signal } from '@angular/core';
import { InstitucionEntity, InstitucionResponse } from '../../../../home/pages/instituciones/interfaces/aliados.interface';
import { LocalizationService } from '@shared/services/localization.service';
import { AppText } from '@shared/utils/app-text';
import { ImageNamePipe } from "../../../../shared/pipes/image.pipe";
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'instituciones-table',
  imports: [RouterLink, ImageNamePipe, DatePipe],
  templateUrl: './instituciones-table.component.html',
})
export class InstitucionesTableComponent {

  insituciones = input.required<InstitucionEntity[]>();

  private currentLocale = signal(inject(LOCALE_ID));

  private lang = inject(LocalizationService);



  getTraduccionFrom(institucion: InstitucionEntity) {
    // return getTraduccionNoticiaFromEntity(noticia, lang);
    const lang = this.currentLocale();

    const actual = institucion.traducciones.find(
      t => t.idioma === this.currentLocale()
    );

    return actual ?? institucion.traducciones[0];
  }



  enlacesRelacionados = this.lang.getText(AppText.app.enlacesRelacionados);
  sociosRelacionados = this.lang.getText(AppText.app.sociosRelacionados);
}
