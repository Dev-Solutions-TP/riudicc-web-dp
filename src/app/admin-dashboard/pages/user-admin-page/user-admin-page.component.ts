import { Component, effect, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map, of } from 'rxjs';
import { UsersAdminService } from '../users-admin-page/services/users-admin.service';
import { UserEntity } from '../users-admin-page/interfaces/user-admin.interface';
import { UserDetailsComponent } from './user-details/user-details.component';

const emptyUser: UserEntity = {
  id: 'new',
  email: '',
  fullName: '',
  isActive: true,
  roles: ['editor'],
};

@Component({
  selector: 'app-user-admin-page',
  imports: [UserDetailsComponent],
  templateUrl: './user-admin-page.component.html',
})
export class UserAdminPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly usersService = inject(UsersAdminService);

  readonly userId = toSignal(
    this.route.paramMap.pipe(map(params => params.get('id'))),
    { initialValue: null },
  );

  readonly userResource = rxResource({
    request: () => this.userId(),
    loader: ({ request }) => request === 'new' ? of(emptyUser) : this.usersService.getUser(request!),
  });

  private readonly redirectOnLoadError = effect(() => {
    if (this.userResource.error() && this.userId() !== 'new') {
      this.router.navigate(['/admin/usuarios']);
    }
  });
}
