import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { ItemBarMenuComponent } from "../../components/item-bar-menu/item-bar-menu.component";

@Component({
  selector: 'app-admin-dashboard-layout',
  imports: [RouterOutlet, RouterLink, ItemBarMenuComponent],
  templateUrl: './admin-dashboard-layout.component.html',
})
export class AdminDashboardLayoutComponent {
  authService = inject(AuthService);

  user = computed(() => this.authService.user());

  isOwner = computed(() => this.authService.isOwner());
  isAdmin = computed(() => this.authService.isAdmin());
  isEditor = computed(() => this.authService.isEditor());
  isSuper = computed(() => this.authService.isSuper());



}
