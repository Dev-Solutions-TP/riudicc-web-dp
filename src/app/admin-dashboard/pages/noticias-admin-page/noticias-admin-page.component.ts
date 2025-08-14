import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { RouterLink } from '@angular/router';
import { NoticiasService } from '@home/pages/noticias-page/services/noticia.service';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { ProductTableComponent } from "../noticias/noticia-table/noticia-table.component";

@Component({
  selector: 'app-noticias-admin-page',
  imports: [PaginationComponent, RouterLink, ProductTableComponent],
  templateUrl: './noticias-admin-page.component.html',
})
export class NoticiasAdminPageComponent {
  noticiasSevice = inject(NoticiasService);
  paginationService = inject(PaginationService);

  noticiasPerPage = signal(10);

  noticiasResource = rxResource({
    request: () => ({
      page: this.paginationService.currentPage() - 1,
      limit: this.noticiasPerPage(),
    }),
    loader: ({ request }) => {
      return this.noticiasSevice.getNoticiasUser({
        offset: request.page * 9,
        limit: request.limit,
      });
    },
  });
}
