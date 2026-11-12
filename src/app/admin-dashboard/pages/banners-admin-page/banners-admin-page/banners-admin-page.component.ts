import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { RouterLink } from '@angular/router';

import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PaginationService } from '@shared/components/pagination/pagination.service';

import { BannersService } from '@home/pages/home-page/services/banner.service';
import { ProductTableComponent } from "../banners-table/banners-table.component";


@Component({
  selector: 'app-noticias-admin-page',
  imports: [PaginationComponent, RouterLink, ProductTableComponent],
  templateUrl: './banners-admin-page.component.html',
})
export class BannersAdminPageComponent {
  bannersSevice = inject(BannersService);
  paginationService = inject(PaginationService);

  bannersPerPage = signal(10);

  bannersResource = rxResource({
    request: () => ({
      page: this.paginationService.currentPage() - 1,
      limit: this.bannersPerPage(),
    }),
    loader: ({ request }) => {
      return this.bannersSevice.getBannersAdmin({
        offset: request.page * request.limit,
        limit: request.limit,
      });
    },
  });
}
