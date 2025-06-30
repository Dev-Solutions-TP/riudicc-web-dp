import { Component, computed, inject, LOCALE_ID, signal } from '@angular/core';
import { PageTitleComponent } from "../../components/page-title/page-title.component";
import { NoticiasService } from './services/noticia.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { NoticiaCardComponent } from "./components/noticia-card/noticia-card.component";

@Component({
  selector: 'app-noticias-page',
  imports: [PageTitleComponent, NoticiaCardComponent],
  templateUrl: './noticias-page.component.html',
})
export class NoticiasPageComponent {


  private noticiasService = inject(NoticiasService);
  private currentLocale = signal(inject(LOCALE_ID));


  noticiasResponse = rxResource({
    request: () => ({ limit: 10, offset: 0 }),
    loader: ({ request }) => {
      console.log
      return this.noticiasService.getNoticias(request);
    }
  });



  titulosNoticiaPage: Record<'es' | 'en' | 'fr', string> = {
    es: 'Noticias',
    en: 'News',
    fr: 'Actualité',
  };

  titulo = computed(() => {
    const locale = this.currentLocale() as 'es' | 'en' | 'fr';
    return this.titulosNoticiaPage[locale] ?? 'News';
  });

}
