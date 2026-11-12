import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
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
  authService = inject(AuthService);
  paginationService = inject(PaginationService);

  institucionesPerPage = signal(10);

  instResource = rxResource({
    request: () => ({
      page: this.paginationService.currentPage() - 1,
      limit: this.institucionesPerPage(),
    }),
    loader: ({ request }) => {
      return this.instService.getInstitucionesUsers({
        offset: request.page * request.limit,
        limit: request.limit,
      });
    },
  });
}
