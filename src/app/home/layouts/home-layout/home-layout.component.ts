import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HomeNavbarComponent } from "../../components/home-navbar/home-navbar.component";
import { AppFooterComponent } from "@shared/components/app-footer/app-footer.component";
import { HomeCarouselComponent } from "../../pages/home-page/components/home-carousel/home-carousel.component";
import { BannersService } from '@home/pages/home-page/services/banner.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { Location } from '@angular/common';


@Component({
  selector: 'app-home-layout',
  imports: [RouterOutlet, HomeNavbarComponent, AppFooterComponent, HomeCarouselComponent],
  templateUrl: './home-layout.component.html',
})
export class HomeLayoutComponent {
  private router = inject(Router);
  private location = inject(Location);

  private currentPath = signal(this.location.path());
  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        this.currentPath.set(this.location.path());
      });
  }
  isHome = computed(() => this.currentPath() === '');



  private bannersService = inject(BannersService);
  bannersResponse = rxResource({
    request: () => ({}),
    loader: ({ request }) => {
      return this.bannersService.getBanners({});
    }
  });


}
