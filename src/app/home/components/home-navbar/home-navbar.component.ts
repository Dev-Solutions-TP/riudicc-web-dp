import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Routes } from '@angular/router';
import homeRoutes from '../../home.routes';

import { extractRoutes } from '../../utils/extract-routes.util';
import { LocaleService } from '@shared/services/locale.service';
import { UpperCasePipe } from '@angular/common';
import { ROUTE_TITLES } from 'src/app/constants/route-titles';
import { LocalizationService } from '@shared/services/localization.service';



@Component({
  selector: 'home-navbar',
  imports: [RouterLink, RouterLinkActive, UpperCasePipe],
  templateUrl: './home-navbar.component.html',
})
export class HomeNavbarComponent {


  homeRoutes = extractRoutes(homeRoutes);

  // Inyecta el servicio

  localeService = inject(LocaleService);
  private lang = inject(LocalizationService);


  toggleLocale() {
    this.localeService.changeLocale(
      this.localeService.getLocale === 'es' ? 'en' : 'es'
    );
  }

  about = this.lang.aboutText;

  // Obtiene el título traducido según el key y el idioma actual
  getTitle(key: string) {
    const locale = this.localeService.getLocale;
    return ROUTE_TITLES[key]?.[locale] ?? key;
  }


  // Puedes mapear las rutas aquí si quieres cambiar los nombres fácilmente
  get coFoundedImg() {
    return this.localeService.getLocale === 'es'
      ? 'assets/images/eu/co-founded_es.png'
      : 'assets/images/eu/co-founded_en.png';
  }
}

