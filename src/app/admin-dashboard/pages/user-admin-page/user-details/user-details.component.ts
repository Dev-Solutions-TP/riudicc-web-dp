import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, of, switchMap } from 'rxjs';
import { AuthService } from '@auth/services/auth.service';
import { CreateUserDto, InstitutionOption, UserEntity } from '../../users-admin-page/interfaces/user-admin.interface';
import { UsersAdminService } from '../../users-admin-page/services/users-admin.service';

@Component({
  selector: 'app-user-details',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-details.component.html',
})
export class UserDetailsComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly usersService = inject(UsersAdminService);
  readonly auth = inject(AuthService);

  readonly user = input.required<UserEntity>();
  readonly isNew = computed(() => this.user().id === 'new');
  readonly institutions = signal<InstitutionOption[]>([]);
  readonly saving = signal(false);
  readonly error = signal('');

  readonly form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: [''],
    role: ['editor', Validators.required],
    institucionId: [''],
  });

  constructor() {
    effect(() => {
      const user = this.user();
      const role = ['super', 'admin', 'editor', 'user'].find(item => user.roles.includes(item)) ?? 'user';
      this.form.patchValue({
        fullName: user.fullName,
        email: user.email,
        password: '',
        role,
        institucionId: '',
      });
      this.form.controls.password.setValidators(
        this.isNew() ? [Validators.required, Validators.minLength(6)] : [Validators.minLength(6)],
      );
      this.form.controls.password.updateValueAndValidity({ emitEvent: false });
      this.error.set('');
    });
  }

  roleOptions(): string[] {
    const userHasInstitutionalRole = this.user().roles.includes('user');
    const options = this.auth.isSuper()
      ? ['editor', 'admin', 'super']
      : ['editor'];
    if (this.isNew() || userHasInstitutionalRole) options.unshift('user');
    return options;
  }

  onRoleChange(): void {
    const roleControl = this.form.controls.role;
    const institutionControl = this.form.controls.institucionId;
    const needsInstitution = this.isNew() && roleControl.value === 'user';

    if (needsInstitution) {
      institutionControl.setValidators(Validators.required);
      if (this.institutions().length === 0) {
        this.usersService.getInstitutions().subscribe({
          next: response => this.institutions.set(response.items ?? []),
          error: err => this.error.set(err?.error?.message ?? 'No se pudieron cargar las instituciones.'),
        });
      }
    } else {
      institutionControl.clearValidators();
      institutionControl.setValue('');
    }
    institutionControl.updateValueAndValidity();
  }

  institutionName(item: InstitutionOption): string {
    const translation = item.traducciones?.find(value => value.idioma === 'es') ?? item.traducciones?.[0];
    return translation?.nombre ?? translation?.name ?? item.codigo ?? item.id;
  }

  cancel(): void {
    this.router.navigate(['/admin/usuarios']);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { fullName, email, password, role, institucionId } = this.form.getRawValue();
    this.saving.set(true);
    this.error.set('');

    if (this.isNew()) {
      const data: CreateUserDto = {
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        roles: [role],
        ...(role === 'user' ? { institucionId } : {}),
      };
      this.usersService.createUser(data)
        .pipe(finalize(() => this.saving.set(false)))
        .subscribe({
          next: () => this.router.navigate(['/admin/usuarios']),
          error: err => this.error.set(err?.error?.message ?? 'No se pudo crear el usuario.'),
        });
      return;
    }

    const current = this.user();
    const nextRoles = [role];
    const roleChanged = [...current.roles].sort().join(',') !== [...nextRoles].sort().join(',');
    if (roleChanged && role === 'user' && !current.roles.includes('user')) {
      this.error.set('Para asignar el rol user, crea la cuenta seleccionando también una institución.');
      this.saving.set(false);
      return;
    }

    this.usersService.updateUser(current.id, {
      fullName: fullName.trim(),
      email: email.trim(),
      ...(password.trim() ? { password } : {}),
    }).pipe(
      switchMap(updated => roleChanged
        ? this.usersService.updateRoles(current.id, nextRoles)
        : of(updated)),
      finalize(() => this.saving.set(false)),
    ).subscribe({
      next: () => this.router.navigate(['/admin/usuarios']),
      error: err => this.error.set(err?.error?.message ?? 'No se pudo actualizar el usuario.'),
    });
  }
}
