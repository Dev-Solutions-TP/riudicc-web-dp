import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { InstitucionesTableComponent } from '@dashboard/pages/instituciones-admin-page/instituciones-table/instituciones-table.component';
import { InstitucionesService } from '@home/pages/instituciones/services/instituciones.service';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PaginationService } from '@shared/components/pagination/pagination.service';

@Component({
  selector: 'app-instituciones-admin-page',
  imports: [PaginationComponent, RouterLink, InstitucionesTableComponent],

  templateUrl: './instituciones-admin-page.component.html',
})
export class InstitucionesAdminPageComponent {

  instService = inject(InstitucionesService);
  paginationService = inject(PaginationService);

  bannersPerPage = signal(10);

  instResource = rxResource({
    request: () => ({
      page: this.paginationService.currentPage() - 1,
      limit: this.bannersPerPage(),
    }),
    loader: ({ request }) => {
      return this.instService.getInstitucionesUsers({
        offset: request.page * 10,
        limit: request.limit,
      });
    },
  });
}
