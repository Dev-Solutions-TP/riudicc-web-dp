import { Routes } from '@angular/router';
import { IsAdminGuard, IsAdminOrOwnerGuard } from '@auth/guards/is-admin.guard';
import { AdminDashboardLayoutComponent } from './layouts/admin-dashboard-layout/admin-dashboard-layout.component';
import { NoticiasAdminPageComponent } from './pages/noticias-admin-page/noticias-admin-page.component';
import { BannersAdminPageComponent } from './pages/banners-admin-page/banners-admin-page/banners-admin-page.component';
import { InstitucionesAdminPageComponent } from './pages/instituciones-admin-page/instituciones-admin-page.component';
import { IsOwnerGuard } from '@auth/guards/is-admin-owner.guard';
import { BannerAdminPageComponent } from './pages/banner-admin-page/banner-admin-page/banner-admin-page.component';
import { InstitucionAdminPageComponent } from './pages/institucion-admin-page/institucion-admin-page/institucion-admin-page.component';
import { NoticiaAdminPageComponent } from './pages/noticias/noticia-admin-page/noticia-admin-page.component';
import { UsersAdminPageComponent } from './pages/users-admin-page/users-admin-page.component';
import { UserAdminPageComponent } from './pages/user-admin-page/user-admin-page.component';

export const adminDashboardRoutes: Routes = [
  {
    path: '',
    component: AdminDashboardLayoutComponent,
    canMatch: [IsAdminOrOwnerGuard],
    canDeactivate: [IsOwnerGuard],
    children: [
      { path: 'usuarios', component: UsersAdminPageComponent, canMatch: [IsAdminGuard] },
      // { path: 'usuarios/new', component: UserAdminPageComponent, canMatch: [IsAdminGuard] },
      { path: 'usuarios/:id', component: UserAdminPageComponent, canMatch: [IsAdminGuard] },
      { path: 'banners', component: BannersAdminPageComponent, canMatch: [IsAdminGuard] },
      { path: 'banners/:id', component: BannerAdminPageComponent, canMatch: [IsAdminGuard] },
      { path: 'noticias', component: NoticiasAdminPageComponent, canMatch: [IsAdminOrOwnerGuard] },
      { path: 'noticias/:id', component: NoticiaAdminPageComponent, canMatch: [IsAdminOrOwnerGuard] },
      { path: 'universidades', component: InstitucionesAdminPageComponent, canMatch: [IsAdminOrOwnerGuard] },
      { path: 'universidades/:id', component: InstitucionAdminPageComponent, canMatch: [IsAdminOrOwnerGuard] },
      { path: '**', redirectTo: 'banners' },
    ],
  },
];
export default adminDashboardRoutes;
