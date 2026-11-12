import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { UsersAdminService } from './services/users-admin.service';
import { UserEntity } from './interfaces/user-admin.interface';
import { UsersTableComponent } from './components/users-table.component';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-users-admin-page',
  imports: [PaginationComponent, RouterLink, UsersTableComponent],
  templateUrl: './users-admin-page.component.html',
})
export class UsersAdminPageComponent {
  private readonly usersService = inject(UsersAdminService);
  readonly paginationService = inject(PaginationService);
  readonly authService = inject(AuthService);

  readonly usersPerPage = signal(10);
  private readonly refreshKey = signal(0);
  readonly actionError = signal('');

  readonly usersResource = rxResource({
    request: () => ({
      page: this.paginationService.currentPage() - 1,
      limit: this.usersPerPage(),
      refresh: this.refreshKey(),
    }),
    loader: ({ request }) =>
      this.usersService.getUsers(request.limit, request.page * request.limit),
  });

  onPageSizeChange(value: string): void {
    this.usersPerPage.set(Number(value));
  }

  toggleActive(user: UserEntity): void {
    const action = user.isActive ? 'desactivar' : 'reactivar';
    if (!confirm(`¿Deseas ${action} a ${user.fullName}?`)) return;

    this.actionError.set('');
    this.usersService.setActive(user.id, !user.isActive)
      .pipe(finalize(() => this.refreshKey.update(value => value + 1)))
      .subscribe({
        error: err => this.actionError.set(
          err?.error?.message ?? `No se pudo ${action} el usuario.`,
        ),
      });
  }
}
