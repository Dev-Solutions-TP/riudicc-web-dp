import { Component, effect, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { NoticiaDetailsComponent } from './noticia-details/noticia-details.component';
import { NoticiasService } from '@home/pages/noticias-page/services/noticia.service';




@Component({
  selector: 'noticia-admin-page',
  imports: [NoticiaDetailsComponent],
  templateUrl: './noticia-admin-page.component.html',
})
export class NoticiaAdminPageComponent {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  noticiasService = inject(NoticiasService);

  noticiaId = toSignal(
    this.activatedRoute.params.pipe(map((params) => params['id']))
  );

  noticiaResource = rxResource({
    request: () => ({ id: this.noticiaId() }),
    loader: ({ request }) => {
      return this.noticiasService.getNoticiaByIdSlugUser(request.id);
    },
  });

  redirectEffect = effect(() => {
    if (this.noticiaResource.error()) {
      this.router.navigate(['/admin/noticias']);
    }
  });
}
