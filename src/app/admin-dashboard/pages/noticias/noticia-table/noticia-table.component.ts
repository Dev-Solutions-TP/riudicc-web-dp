import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Component, inject, input, LOCALE_ID, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ImageNamePipe } from '@shared/pipes/image.pipe';
import { NoticiaEntity } from '../../../../home/pages/noticias-page/interfaces/noticia.interface';
import { getTraduccionNoticia, getTraduccionNoticiaFromEntity } from '../../../../home/pages/noticias-page/utils/noticia.utils';
import { LocalizationService } from '@shared/services/localization.service';
import { AppText } from '@shared/utils/app-text';


@Component({
  selector: 'noticias-table',
  imports: [RouterLink, DatePipe, ImageNamePipe, TitleCasePipe],
  templateUrl: './noticia-table.component.html',
})
export class ProductTableComponent {

  noticias = input.required<NoticiaEntity[]>();

  private currentLocale = signal(inject(LOCALE_ID));

  private lang = inject(LocalizationService);

  // constructor que imprima noticias
  // constructor() {
  //   console.log('Noticias:', this.noticias());
  // }


  getTraduccionFrom(noticia: NoticiaEntity) {
    const lang = this.currentLocale();
    return getTraduccionNoticiaFromEntity(noticia, lang);
  }



  enlacesRelacionados = this.lang.getText(AppText.app.enlacesRelacionados);
  sociosRelacionados = this.lang.getText(AppText.app.sociosRelacionados);

  onNavigateToNoticia(noticia: NoticiaEntity) {
    console.log('Navigating to noticia:', noticia);
    console.log('Navigating to noticia:', noticia.id);

  }
}
