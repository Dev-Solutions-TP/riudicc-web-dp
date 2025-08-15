
import { Component, computed, inject, input, LOCALE_ID, OnInit, signal } from '@angular/core';
import { NoticiaEntity } from '@home/pages/noticias-page/interfaces/noticia.interface';
import { LocalizationService } from '@shared/services/localization.service';
import { NoticiaImagePipe } from "../../pages/noticias-page/pipes/noticia-project-image.pipe";
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ImageEntity } from '@home/interfaces/image.interface';
import { ImageNamePipe } from "../../../shared/pipes/image.pipe";

@Component({
  selector: 'home-blog',
  imports: [NoticiaImagePipe, DatePipe, RouterLink, ImageNamePipe],
  templateUrl: './news-blog.component.html',
})
export class BlogComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


  noticias = input.required<NoticiaEntity[]>();


  private locale = signal(inject(LOCALE_ID));
  private lang = inject(LocalizationService);

  // traduccion = computed(() => {
  //   const lang = this.locale();
  //   const t = this.noticia().traducciones.find(trad => trad.idioma === lang);
  //   return t ?? this.noticia().traducciones[0];
  // });

  getTraduccion(noticia: NoticiaEntity) {
    const idioma = this.locale();
    const traduccion = noticia.traducciones.find(t => t.idioma === idioma);
    return traduccion ?? noticia.traducciones[0];
  }

  getImage(noticia: NoticiaEntity) {
    return noticia.images?.[0];
  }

  getImagenPrincipal(noticia: NoticiaEntity): ImageEntity | undefined {
    const imagenes = noticia.images ?? [];
    // Si alguna tiene orden = 1, úsala
    const conOrden1 = imagenes.find(img => img.orden === 1);
    // Si no, toma la primera válida
    return conOrden1 ?? imagenes.at(0);
  }

  viewMoreText = this.lang.viewMoreText;


  masNoticias: Record<'es' | 'en' | 'fr', string> = {
    es: 'Más noticias',
    en: 'More news',
    fr: 'Plus de nouvelles',
  };
  moreNews = computed(() => {
    const locale = this.locale() as 'es' | 'en' | 'fr';
    return this.masNoticias[locale] ?? 'News';
  });

}
