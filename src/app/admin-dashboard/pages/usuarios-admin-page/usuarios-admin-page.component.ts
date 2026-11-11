import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '@auth/services/auth.service';
import { UsersAdminService } from './users-admin.service';
import { InstitutionOption, UserEntity } from './user-admin.interface';

@Component({
  selector: 'app-usuarios-admin-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './usuarios-admin-page.component.html',
})
export class UsuariosAdminPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(UsersAdminService);
  readonly auth = inject(AuthService);

  readonly users = signal<UserEntity[]>([]);
  readonly institutions = signal<InstitutionOption[]>([]);
  readonly count = signal(0);
  readonly page = signal(0);
  readonly limit = 10;
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly success = signal('');
  readonly editId = signal<string | null>(null);
  readonly formMode = signal(false);
  readonly editingUser = signal<UserEntity | null>(null);

  readonly form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: [''],
    role: ['editor', Validators.required],
    institucionId: [''],
  });

  constructor() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.formMode.set(id !== null);
      this.editId.set(id && id !== 'new' ? id : null);
      this.error.set('');
      this.success.set('');
      if (id) this.loadForm(id);
      else this.loadUsers();
    });
    this.service.getInstitutions().subscribe({
      next: result => this.institutions.set(result.items ?? []),
    });
  }

  get pages(): number {
    return Math.ceil(this.count() / this.limit);
  }

  loadUsers(): void {
    this.loading.set(true);
    this.service.getUsers(this.limit, this.page() * this.limit)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: result => {
          this.users.set(result.users ?? []);
          this.count.set(result.count ?? 0);
        },
        error: () => this.error.set('No se pudo cargar el listado de usuarios.'),
      });
  }

  loadForm(id: string): void {
    this.form.reset({ fullName: '', email: '', password: '', role: 'editor', institucionId: '' });
    this.editingUser.set(null);
    if (id === 'new') return;

    this.loading.set(true);
    this.service.getUser(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: user => {
          this.editingUser.set(user);
          const role = ['super', 'admin', 'editor', 'user'].find(item => user.roles.includes(item)) ?? 'user';
          this.form.patchValue({ fullName: user.fullName, email: user.email, role });
        },
        error: () => this.error.set('No se pudo cargar el usuario.'),
      });
  }

  onRoleChange(): void {
    const control = this.form.controls.institucionId;
    if (this.form.controls.role.value === 'user' && !this.editId()) {
      control.setValidators(Validators.required);
    } else {
      control.clearValidators();
      if (this.form.controls.role.value !== 'user') control.setValue('');
    }
    control.updateValueAndValidity();
  }

  institutionName(item: InstitutionOption): string {
    const translation = item.traducciones?.find(t => t.idioma === 'es') ?? item.traducciones?.[0];
    return translation?.nombre ?? translation?.name ?? item.codigo ?? item.id;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { fullName, email, password, role, institucionId } = this.form.getRawValue();
    this.saving.set(true);
    this.error.set('');
    this.success.set('');

    if (!this.editId()) {
      this.service.createUser({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        roles: [role],
        ...(role === 'user' ? { institucionId } : {}),
      }).pipe(finalize(() => this.saving.set(false))).subscribe({
        next: () => this.router.navigate(['/admin/usuarios']),
        error: err => this.error.set(err?.error?.message ?? 'No se pudo crear el usuario.'),
      });
      return;
    }

    const current = this.editingUser();
    if (!current) {
      this.saving.set(false);
      return;
    }

    const update = {
      fullName: fullName.trim(),
      email: email.trim(),
      ...(password.trim() ? { password } : {}),
    };
    const nextRoles = [role];
    const roleChange = current.roles.join(',') !== nextRoles.join(',');
    if (roleChange && role === 'user' && !current.roles.includes('user')) {
      this.error.set('La asignación de una institución requiere crear el usuario con esa institución.');
      this.saving.set(false);
      return;
    }

    this.service.updateUser(current.id, update).subscribe({
      next: updated => {
        if (!roleChange) {
          this.success.set('Usuario actualizado.');
          this.editingUser.set(updated);
          this.saving.set(false);
          return;
        }
        this.service.updateRoles(current.id, nextRoles)
          .pipe(finalize(() => this.saving.set(false)))
          .subscribe({
            next: result => {
              this.success.set('Usuario y rol actualizados.');
              this.editingUser.set(result);
            },
            error: err => this.error.set(err?.error?.message ?? 'Se actualizaron los datos, pero no se pudo actualizar el rol.'),
          });
      },
      error: err => {
        this.saving.set(false);
        this.error.set(err?.error?.message ?? 'No se pudo actualizar el usuario.');
      },
    });
  }

  toggleActive(user: UserEntity): void {
    const action = user.isActive ? 'desactivar' : 'reactivar';
    if (!confirm(`¿Deseas ${action} a ${user.fullName}?`)) return;
    this.service.setActive(user.id, !user.isActive).subscribe({
      next: () => this.loadUsers(),
      error: err => this.error.set(err?.error?.message ?? `No se pudo ${action} el usuario.`),
    });
  }

  previousPage(): void {
    if (this.page() === 0) return;
    this.page.update(value => value - 1);
    this.loadUsers();
  }

  nextPage(): void {
    if (this.page() + 1 >= this.pages) return;
    this.page.update(value => value + 1);
    this.loadUsers();
  }

  roleOptions(): string[] {
    return this.auth.isSuper() ? ['user', 'editor', 'admin', 'super'] : ['user', 'editor'];
  }
}
