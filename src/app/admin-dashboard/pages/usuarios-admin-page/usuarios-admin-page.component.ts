import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@auth/services/auth.service';
import { environment } from 'src/environments/environment';
import { finalize } from 'rxjs';

interface InstitutionOption {
  id: string;
  traducciones?: Array<{ name: string; idioma: string }>;
  codigo?: string;
}

@Component({
  selector: 'app-usuarios-admin-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h1 class="text-2xl font-bold">Crear usuario</h1>
    <p class="mt-2 text-slate-600">Crea editores o cuentas administradoras de una institución.</p>

    <form class="mt-6 max-w-2xl space-y-4" [formGroup]="form" (ngSubmit)="submit()">
      <label class="form-control w-full">
        <span class="label-text mb-1">Nombre completo</span>
        <input class="input input-bordered" formControlName="fullName" />
      </label>
      <label class="form-control w-full">
        <span class="label-text mb-1">Correo electrónico</span>
        <input class="input input-bordered" type="email" formControlName="email" />
      </label>
      <label class="form-control w-full">
        <span class="label-text mb-1">Contraseña temporal</span>
        <input class="input input-bordered" type="password" formControlName="password" />
      </label>
      <label class="form-control w-full">
        <span class="label-text mb-1">Rol</span>
        <select class="select select-bordered" formControlName="role" (change)="onRoleChange()">
          <option value="editor">Editor</option>
          <option value="user">Usuario de institución</option>
          @if (auth.isSuper()) {
            <option value="admin">Administrador</option>
          }
        </select>
      </label>
      @if (form.controls.role.value === 'user') {
        <label class="form-control w-full">
          <span class="label-text mb-1">Institución</span>
          <select class="select select-bordered" formControlName="institucionId">
            <option value="">Seleccione una institución</option>
            @for (institution of institutions(); track institution.id) {
              <option [value]="institution.id">{{ institutionName(institution) }}</option>
            }
          </select>
        </label>
      }
      @if (message()) {
        <p class="text-sm" [class.text-error]="isError()" [class.text-success]="!isError()">{{ message() }}</p>
      }
      <button class="btn btn-primary" type="submit" [disabled]="form.invalid || saving()">
        {{ saving() ? 'Guardando…' : 'Crear usuario' }}
      </button>
    </form>
  `,
})
export class UsuariosAdminPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  readonly auth = inject(AuthService);
  readonly institutions = signal<InstitutionOption[]>([]);
  readonly message = signal('');
  readonly isError = signal(false);
  readonly saving = signal(false);

  readonly form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['editor', Validators.required],
    institucionId: [''],
  });

  constructor() {
    this.http.get<{ items: InstitutionOption[] }>(`${environment.baseUrl}/instituciones?limit=100`)
      .subscribe(response => this.institutions.set(response.items ?? []));
  }

  onRoleChange(): void {
    const institution = this.form.controls.institucionId;
    if (this.form.controls.role.value === 'user') {
      institution.setValidators(Validators.required);
    } else {
      institution.clearValidators();
      institution.setValue('');
    }
    institution.updateValueAndValidity();
  }

  institutionName(institution: InstitutionOption): string {
    const translation = institution.traducciones?.find(item => item.idioma === 'es') ?? institution.traducciones?.[0];
    return translation?.name ?? institution.codigo ?? institution.id;
  }

  submit(): void {
    if (this.form.invalid) return;
    const { fullName, email, password, role, institucionId } = this.form.getRawValue();
    const body = {
      fullName,
      email,
      password,
      roles: [role],
      ...(role === 'user' ? { institucionId } : {}),
    };
    this.saving.set(true);
    this.message.set('');
    this.http.post(`${environment.baseUrl}/users`, body)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.message.set('Usuario creado correctamente.');
          this.isError.set(false);
          this.form.reset({ fullName: '', email: '', password: '', role: 'editor', institucionId: '' });
        },
        error: error => {
          this.message.set(error?.error?.message ?? 'No se pudo crear el usuario.');
          this.isError.set(true);
        },
      });
  }
}
