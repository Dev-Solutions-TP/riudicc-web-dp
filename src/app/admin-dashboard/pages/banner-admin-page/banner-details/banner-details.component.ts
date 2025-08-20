import { Component, OnInit, inject, input, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
  FormControl
} from '@angular/forms';
import { Router } from '@angular/router';
import { traduccionesValidator } from '@dashboard/validators/traducciontes.validator';
import { BannerEntity, TraduccionBanner, UpdateBannerDto } from '@home/pages/home-page/interfaces/banner.interface';
import { BannersService } from '@home/pages/home-page/services/banner.service';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { FormErrorLabelComponent } from "../../../../shared/components/form-error-label/form-error-label.component";
import { FormUtils } from '@shared/utils/form-utils';
import { AlertMessageComponent, AlertType } from '@dashboard/components/alert-message/alert-message.component';


const API_URL = environment.baseUrl;

@Component({
  selector: 'banner-details',
  standalone: true,
  imports: [ReactiveFormsModule, FormErrorLabelComponent, AlertMessageComponent],
  templateUrl: './banner-details.component.html',
})
export class BannerDetailsComponent implements OnInit {
  banner = input.required<BannerEntity>();

  fb = inject(FormBuilder);
  router = inject(Router);
  bannersService = inject(BannersService);

  wasSaved = signal(false);
  isSaving = signal(false); // Nuevo signal para el estado de guardado
  formUtils = FormUtils;

  // Sistema de alertas
  alertMessage = signal<string>('');
  alertType = signal<AlertType>('success');
  showAlert = signal(false);

  // Método helper para construir URLs de imagen
  private buildImageUrl(imageUrl: string): string {
    if (!imageUrl) return '';

    // Si la URL ya es completa (Cloudinary u otras URLs), usarla tal como está
    if (imageUrl.startsWith('http') || imageUrl.startsWith('blob:')) {
      return imageUrl;
    }

    // Si es solo un nombre de archivo (sistema anterior), construir la URL completa
    return `${API_URL}/files/ban/${imageUrl}`;
  }

  // Método público para usar en el template
  getImageUrl(imageUrl: string): string {
    return this.buildImageUrl(imageUrl);
  }

  bannerForm = this.fb.group({
    slug: ['', [Validators.required, Validators.pattern(this.formUtils.slugPattern)]],
    tags: [''],
    enlaces: [''],
    fechaInicio: ['', Validators.required],
    fechaFin: ['', Validators.required],
    state: ['borrador', Validators.required],
    traducciones: this.fb.array([], { validators: traduccionesValidator }),
  });

  get traduccionesFormArray() {
    return this.bannerForm.get('traducciones') as FormArray<FormGroup>;
  }

  ngOnInit(): void {
    const current = this.banner();
    if (current.id !== 'new') {
      this.setFormValue(current);
    } else {
      this.addInitialTranslations(); // 👈 nueva función
    }
  }


  private addInitialTranslations() {
    const idiomas = ['es', 'en'];
    idiomas.forEach(idioma => {
      this.traduccionesFormArray.push(
        this.fb.group({
          idioma: [idioma, Validators.required],
          altText: ['', Validators.required],
        })
      );
    });
  }

  private formatToDateInput(value: string | Date | undefined | null): string {
    if (!value) return '';
    if (typeof value === 'string') return value.slice(0, 10);
    return value.toISOString().slice(0, 10);
  }

  setFormValue(banner: BannerEntity) {
    console.log('Banner recibido:', banner);
    this.bannerForm.patchValue({
      slug: banner.slug ?? '',
      tags: banner.tags?.join(',') ?? '',

      enlaces: banner.enlaces ?? '',
      fechaInicio: this.formatToDateInput(banner.fechaInicio),
      fechaFin: this.formatToDateInput(banner.fechaFin),
      state: banner.state ?? '',
    });

    // this.traduccionesFormArray.clear();
    // banner.traducciones.forEach(t => {
    //   this.traduccionesFormArray.push(
    //     this.fb.group({
    //       idioma: [t.idioma, Validators.required],
    //       altText: [t.altText, Validators.required],
    //     })
    //   );
    // });
    // 🟢 Mostrar imagen previa si ya existe y no hay una cargada nueva
    if (banner.image) {
      this.originalImageName = banner.image; // 👈 guarda el valor original (puede ser nombre o URL)
      this.originalImageUrl = this.buildImageUrl(banner.image); // 👈 usa el helper para construir la URL
      this.previewImageUrl.set(this.originalImageUrl);
    }

    setTimeout(() => {
      this.traduccionesFormArray.clear();
      banner.traducciones.forEach(t => {
        console.log('Añadiendo traducción:', t);
        this.traduccionesFormArray.push(
          this.fb.group({
            idioma: [t.idioma, Validators.required],
            altText: [t.altText, Validators.required],
          })
        );
      });
    }, 0);

  }




  addTraduccion() {
    this.traduccionesFormArray.push(
      this.fb.group({
        idioma: ['', Validators.required],
        altText: ['', Validators.required],
      })
    );
  }

  removeTraduccion(index: number) {
    this.traduccionesFormArray.removeAt(index);
  }

  // Método para mostrar alertas usando el nuevo componente
  private showCustomAlert(message: string, type: AlertType = 'error') {
    this.alertMessage.set(message);
    this.alertType.set(type);
    this.showAlert.set(true);
  }

  // Método para ocultar alertas
  onAlertClose() {
    this.showAlert.set(false);
  }

  async onSubmit() {
    // Activar estado de guardado al inicio
    this.isSaving.set(true);

    if (!this.imageFile && !this.originalImageName) {
      this.showCustomAlert('Debe subir una imagen.', 'error');
      this.isSaving.set(false);
      return;
    }
    if (this.traduccionesFormArray.length < 2) {
      this.showCustomAlert('Debe ingresar al menos dos traducciones.', 'error');
      this.isSaving.set(false);
      return;
    }
    const idiomasSeleccionados = this.traduccionesFormArray.controls
      .map(ctrl => ctrl.get('idioma')?.value);

    const tieneEspanol = idiomasSeleccionados.includes('es');
    const tieneIngles = idiomasSeleccionados.includes('en');

    if (!tieneEspanol || !tieneIngles) {
      this.showCustomAlert('Debe incluir al menos una traducción en Español y otra en Inglés.', 'error');
      this.isSaving.set(false);
      return;
    }
    if (this.bannerForm.invalid) {
      this.bannerForm.markAllAsTouched();
      console.log('Formulario inválido:', this.bannerForm.errors);
      // Revisión campo por campo
      Object.entries(this.bannerForm.controls).forEach(([key, control]) => {
        if (control.invalid) {
          console.error(`Campo inválido: ${key}`, control.errors);
        }
      });
      this.showCustomAlert('Por favor completa todos los campos requeridos en el banner.', 'error');
      this.isSaving.set(false);
      return;
    }

    console.log('Formulario válido, enviando datos...');

    const value = this.bannerForm.value;

    const dto: Partial<UpdateBannerDto> = {
      slug: value.slug ?? '',
      tags: value.tags?.split(',').map(t => t.trim()) ?? [],

      enlaces: value.enlaces ?? null,
      fechaInicio: value.fechaInicio ? new Date(value.fechaInicio).toISOString() : undefined,
      fechaFin: value.fechaFin ? new Date(value.fechaFin).toISOString() : undefined,
      state: value.state ?? 'borrador',
      traducciones: value.traducciones?.map((t: any) => ({
        idioma: t.idioma,
        altText: t.altText,
      })),
    };


    const bannerId = this.banner().id;
    const isNew = bannerId === 'new';

    try {
      let result: BannerEntity;

      if (isNew) {
        console.log('Creando nuevo banner con datos:', dto);
        result = await firstValueFrom(
          this.bannersService.createBanner(dto, this.imageFile)
        );
        this.router.navigate(['/admin/banners', result.id]);
      } else {
        console.log('Actualizando banner existente con ID:', bannerId, 'y datos:', dto);
        result = await firstValueFrom(
          this.bannersService.updateBanner(bannerId, dto, this.imageFile)
        );
      }

      this.showCustomAlert('¡Banner guardado correctamente!', 'success');
      this.wasSaved.set(true);
      console.log('Operación exitosa, banner guardado:', result);
      setTimeout(() => this.wasSaved.set(false), 3000);
    } catch (error) {
      console.error('Error saving banner:', error);
      this.showCustomAlert('Error al guardar el banner. Por favor, intente nuevamente.', 'error');
    } finally {
      // Desactivar estado de guardado siempre al final
      this.isSaving.set(false);
    }
  }



  originalImageUrl: string | null = null;
  originalImageName: string | null = null; // 👈 para mostrar el nombre actual

  previewImageUrl = signal<string | null>(null);
  imageFile: File | undefined = undefined;


  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.imageFile = file ?? undefined;

    if (file) {
      this.previewImageUrl.set(URL.createObjectURL(file));
      this.originalImageName = file.name; // 👈 actualiza el nombre mostrado
    } else {
      // Si se cancela selección, volvemos a mostrar la imagen original
      this.previewImageUrl.set(this.originalImageUrl);
      // Y dejamos el nombre original tal como estaba
    }
  }

}
