import { Component, computed, inject, input, LOCALE_ID, signal } from '@angular/core';
import { NoticiaEntity } from '../../interfaces/noticia.interface';

import { RouterLink } from '@angular/router';

import { LocalizationService } from '@shared/services/localization.service';
import { DatePipe } from '@angular/common';
import { ImageNamePipe } from '@shared/pipes/image.pipe';

@Component({
  selector: 'noticia-card',
  imports: [RouterLink, DatePipe, ImageNamePipe],
  templateUrl: './noticia-card.component.html',
})
export class NoticiaCardComponent {


  //constructor
  constructor() {

  }

  private locale = signal(inject(LOCALE_ID));
  private lang = inject(LocalizationService);


  noticia = input.required<NoticiaEntity>();
  horizontal = input(false); // true = imagen izquierda, false = imagen abajo

  traduccion = computed(() => {
    const lang = this.locale();
    const t = this.noticia().traducciones.find(trad => trad.idioma === lang);
    return t ?? this.noticia().traducciones[0];
  });

  imagenPrincipal = computed(() => {

    const imagenes = this.noticia().images ?? [];
    // Si alguna tiene orden = 1, úsala
    const conOrden1 = imagenes.find(img => img.orden === 1);
    // Si no, toma la primera válida
    return conOrden1 ?? imagenes.at(0);
  });

  viewMoreText = this.lang.viewMoreText;



}
