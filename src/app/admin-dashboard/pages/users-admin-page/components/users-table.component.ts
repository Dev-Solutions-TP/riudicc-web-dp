import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserEntity } from '../interfaces/user-admin.interface';

@Component({
  selector: 'app-users-table',
  imports: [RouterLink],
  templateUrl: './users-table.component.html',
})
export class UsersTableComponent {
  readonly users = input.required<UserEntity[]>();
  readonly toggleActive = output<UserEntity>();
}
