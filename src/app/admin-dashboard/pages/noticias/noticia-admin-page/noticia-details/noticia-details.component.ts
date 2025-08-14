import { Component, inject, input, OnInit, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NoticiaEntity, Traduccion } from '@home/pages/noticias-page/interfaces/noticia.interface';
import { NoticiasService } from '@home/pages/noticias-page/services/noticia.service';
import { InstitucionEntity } from '@home/pages/instituciones/interfaces/aliados.interface';
import { InstitucionesService } from '@home/pages/instituciones/services/instituciones.service';
import { firstValueFrom } from 'rxjs';
import { ImageEntity } from '@home/interfaces/image.interface';
import { Enlace } from '@home/interfaces/enlace.interface';
import { FormUtils } from '@shared/utils/form-utils';
import { traduccionesValidator } from '@dashboard/validators/traducciontes.validator';
import { AlertMessageComponent, AlertType } from '@dashboard/components/alert-message/alert-message.component';
import { environment } from 'src/environments/environment.development';

const API_URL = environment.baseUrl;



@Component({
  selector: 'noticia-details',
  imports: [ReactiveFormsModule, AlertMessageComponent],
  templateUrl: './noticia-details.component.html',
})
export class NoticiaDetailsComponent implements OnInit {
  noticia = input.required<NoticiaEntity>();

  router = inject(Router);
  fb = inject(FormBuilder);
  noticiasService = inject(NoticiasService);
  institucionesService = inject(InstitucionesService);

  wasSaved = signal(false);
  formUtils = FormUtils;

  // Sistema de alertas con el nuevo componente
  loading = signal(true);
  isEditing = signal(false);

  // Alertas
  alertMessage = signal<string>('');
  alertType = signal<AlertType>('success');
  showAlert = signal(false);

  instituciones = signal<InstitucionEntity[]>([]);
  selectedImageFiles: File[] = [];
  previewImageUrls = signal<string[]>([]);
  selectedInstituciones = signal<string[]>([]);

  noticiaForm = this.fb.group({
    slug: ['', [Validators.required, Validators.pattern(this.formUtils.slugPattern)]],
    tags: [''],
    paisCode: [''],
    pais: [''],
    ciudad: [''],
    latitud: [''],
    longitud: [''],
    state: ['active', Validators.required],
    displayDate: ['', Validators.required], // Cambiar a string para input date
    instituciones: this.fb.array([]),
    traducciones: this.fb.array([], Validators.required),
    images: this.fb.array([], Validators.required),
    enlaces: this.fb.array([],),
  });


  ngOnInit(): void {
    const data = this.noticia();
    if (data.id !== 'new') {
      this.setFormValue(data);
    } else {
      // Para noticias nuevas, establecer fecha actual
      const today = new Date().toISOString().split('T')[0];
      this.noticiaForm.patchValue({ displayDate: today });

      this.addInitialTranslation();
      this.addInitialImage();
    }

    this.institucionesService.getInstitucionesUsers({ limit: 100 }).subscribe((resp) => {
      this.instituciones.set(resp.items);
    });
  }

  addInitialTranslation() {
    ['es', 'en'].forEach(idioma => {
      this.traduccionesFormArray.push(
        this.fb.group({
          idioma: [idioma, Validators.required],
          title: ['', Validators.required],
          contentDescription: ['', Validators.required],
          content: ['', Validators.required],
        })
      );
    });
  }

  addInitialImage() {
    this.imagesFormArray.push(
      this.fb.group({
        url: ['', Validators.required],
        altText: ['', Validators.required],
      })
    );
    this.selectedImageFiles.push(undefined as any);
    this.previewImageUrls.set([...this.previewImageUrls(), '']);
  }

  onSingleImageSelected(event: Event, index: number) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.selectedImageFiles[index] = file;

    // Vista previa
    const updatedPreviews = [...this.previewImageUrls()];
    updatedPreviews[index] = URL.createObjectURL(file);
    this.previewImageUrls.set(updatedPreviews);

    // Setear nombre de archivo en el campo `url`
    const imageGroup = this.imagesFormArray.at(index);
    imageGroup.get('url')?.setValue(file.name);
    imageGroup.get('url')?.markAsDirty();
    imageGroup.get('url')?.updateValueAndValidity();
  }

  isInstitucionSelected(institucionId: string): boolean {
    return this.selectedInstituciones().includes(institucionId);
  }

  onInstitucionChange(event: Event, institucionId: string) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const current = [...this.selectedInstituciones()];

    if (isChecked) {
      if (!current.includes(institucionId)) {
        current.push(institucionId);
      }
    } else {
      const index = current.indexOf(institucionId);
      if (index > -1) {
        current.splice(index, 1);
      }
    }

    this.selectedInstituciones.set(current);
  }

  getInstitucionName(institucion: InstitucionEntity): string {
    return institucion.traducciones[0]?.name || 'Sin nombre';
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
  }  // Getters para usar en HTML
  get imagesFormArray() {
    return this.noticiaForm.get('images') as FormArray<FormGroup>;
  }

  get enlacesFormArray() {
    return this.noticiaForm.get('enlaces') as FormArray<FormGroup>;
  }

  get traduccionesFormArray() {
    return this.noticiaForm.get('traducciones') as FormArray<FormGroup>;
  }

  get institucionesFormArray() {
    return this.noticiaForm.get('instituciones') as FormArray<FormControl>;
  }

  // Métodos para agregar dinámicamente
  addImage() {
    this.imagesFormArray.push(
      this.fb.group({
        url: ['', Validators.required],
        altText: ['', Validators.required],
      })
    );
    this.selectedImageFiles.push(undefined as any);
    this.previewImageUrls.set([...this.previewImageUrls(), '']);
  }

  removeImage(index: number) {
    this.imagesFormArray.removeAt(index);
    this.selectedImageFiles.splice(index, 1);
    const previews = [...this.previewImageUrls()];
    previews.splice(index, 1);
    this.previewImageUrls.set(previews);
  }

  addEnlace() {
    this.enlacesFormArray.push(
      this.fb.group({
        url: ['', Validators.required],
        label: [''],
      })
    );
  }

  addTraduccion() {
    this.traduccionesFormArray.push(
      this.fb.group({
        idioma: ['', Validators.required],
        title: ['', Validators.required],
        contentDescription: [''],
        content: [''],
      })
    );
  }

  addInstitucion(id: string) {
    this.institucionesFormArray.push(new FormControl(id));
  }

  removeEnlace(index: number) {
    this.enlacesFormArray.removeAt(index);
  }

  removeTraduccion(index: number) {
    this.traduccionesFormArray.removeAt(index);
  }

  removeInstitucion(index: number) {
    this.institucionesFormArray.removeAt(index);
  }

  setFormValue(noticia: NoticiaEntity) {
    // Convertir la fecha a formato local para el input date
    const displayDate = noticia.displayDate
      ? new Date(noticia.displayDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];

    this.noticiaForm.patchValue({
      slug: noticia.slug,
      tags: noticia.tags?.join(',') ?? '',
      paisCode: noticia.paisCode,
      pais: noticia.pais,
      ciudad: noticia.ciudad,
      latitud: noticia.latitud,
      longitud: noticia.longitud,
      state: noticia.state ?? '',
      displayDate: displayDate,
    });

    // Limpiar arrays existentes
    this.imagesFormArray.clear();
    this.enlacesFormArray.clear();
    this.traduccionesFormArray.clear();

    // Poblar traducciones
    noticia.traducciones.forEach((t) => {
      this.traduccionesFormArray.push(
        this.fb.group({
          idioma: [t.idioma, Validators.required],
          title: [t.title, Validators.required],
          contentDescription: [t.contentDescription],
          content: [t.content],
        })
      );
    });

    // Poblar imágenes
    noticia.images.forEach((img) => {
      this.imagesFormArray.push(
        this.fb.group({
          url: [img.url, Validators.required],
          altText: [img.altText],
        })
      );
    });

    // Poblar enlaces
    noticia.enlaces.forEach((link) => {
      this.enlacesFormArray.push(
        this.fb.group({
          label: [link.label, Validators.required],
          url: [link.url, Validators.required],
        })
      );
    });

    // Configurar instituciones seleccionadas
    const institucionesIds = noticia.instituciones.map(inst => inst.id);
    this.selectedInstituciones.set(institucionesIds);

    // Inicializar arrays de archivos e imágenes
    this.selectedImageFiles = new Array(noticia.images.length).fill(undefined);

    // Configurar URLs de vista previa - construir URL completa si es necesario
    const previewUrls = noticia.images.map(img => {
      // Si la URL ya es completa (comienza con http), usarla tal como está
      if (img.url && (img.url.startsWith('http') || img.url.startsWith('blob:'))) {
        return img.url;
      }
      // Si es solo un nombre de archivo, construir la URL completa
      if (img.url) {
        return `${API_URL}/files/not/${img.url}`;
      }
      return '';
    });

    this.previewImageUrls.set(previewUrls);
  }

  async onSubmit() {
    console.log('Form values:', this.noticiaForm.value);
    console.log('Selected instituciones:', this.selectedInstituciones());
    console.log('Selected image files:', this.selectedImageFiles);

    // Validaciones básicas
    console.log('Traducciones:', this.traduccionesFormArray.length);
    if (this.traduccionesFormArray.length < 2) {
      this.showCustomAlert('Debe ingresar al menos dos traducciones.', 'error');
      return;
    }

    const idiomasSeleccionados = this.traduccionesFormArray.controls
      .map(ctrl => ctrl.get('idioma')?.value);

    const tieneEspanol = idiomasSeleccionados.includes('es');
    const tieneIngles = idiomasSeleccionados.includes('en');

    if (!tieneEspanol || !tieneIngles) {
      this.showCustomAlert('Debe incluir al menos una traducción en Español y otra en Inglés.', 'error');
      return;
    }

    // validar que la traduccion tenga texto, es decir en cada campo el validador requerido sea comprobado
    for (let i = 0; i < this.traduccionesFormArray.length; i++) {
      const group = this.traduccionesFormArray.at(i);
      if (group.invalid) {
        group.markAllAsTouched();
        this.showCustomAlert(`Por favor completa todos los campos requeridos en la traducción #${i + 1}.`, 'error');
        return;
      }
    }


    if (this.noticiaForm.invalid) {
      this.noticiaForm.markAllAsTouched();
      console.log('Formulario inválido:', this.noticiaForm.errors);
      // Revisión campo por campo
      Object.entries(this.noticiaForm.controls).forEach(([key, control]) => {
        if (control.invalid) {
          console.error(`Campo inválido: ${key}`, control.errors);
          this.showCustomAlert(`Por favor completa todos los campos requeridos en la noticia.`, 'error');

        }
      });
      return;
    }

    const formValue = this.noticiaForm.value;

    // Convertir fecha de string a Date correctamente
    const displayDate = formValue.displayDate
      ? new Date(`${formValue.displayDate}T12:00:00.000Z`) // Agregar tiempo al mediodía UTC
      : new Date();

    // Preparar DTO
    const noticiaLike: Partial<NoticiaEntity> = {
      slug: formValue.slug ?? '',
      tags: formValue.tags?.split(',').map((t: string) => t.trim().toLowerCase()) ?? [],
      paisCode: formValue.paisCode ?? undefined,
      pais: formValue.pais ?? undefined,
      ciudad: formValue.ciudad ?? undefined,
      latitud: formValue.latitud ?? undefined,
      longitud: formValue.longitud ?? undefined,
      state: formValue.state ?? 'borrador',
      displayDate: displayDate,
      traducciones: formValue.traducciones as Traduccion[],
      images: (formValue.images as any[]).map(img => ({
        url: img.url,
        altText: img.altText,
      })) as ImageEntity[],
      enlaces: formValue.enlaces as Enlace[],
    };

    const id = this.noticia().id;
    const isNew = id === 'new';

    // Subir imágenes si hay archivos seleccionados (comentado por ahora)
    /*
    if (this.selectedImageFiles.some(file => file)) {
      try {
        const validFiles = this.selectedImageFiles.filter(file => file);
        if (validFiles.length > 0) {
          const fileNames = await firstValueFrom(this.noticiasService.uploadMultipleImages(validFiles));
          
          // Actualizar URLs de imágenes con las subidas
          let fileIndex = 0;
          noticiaLike.images = this.imagesFormArray.controls.map((group, i) => {
            const url = this.selectedImageFiles[i] ? fileNames[fileIndex++] : group.get('url')?.value;
            return {
              url,
              altText: group.get('altText')?.value || '',
            };
          });
        }
      } catch (error) {
        console.error('Error uploading images:', error);
        alert('Error al subir las imágenes. Por favor, intente nuevamente.');
        return;
      }
    }
    */

    // Agregar instituciones seleccionadas
    const selectedInstitucionesData = this.instituciones()
      .filter(inst => this.selectedInstituciones().includes(inst.id));

    noticiaLike.instituciones = selectedInstitucionesData;

    console.log('DTO final:', noticiaLike);

    try {
      const result = isNew
        ? await firstValueFrom(this.noticiasService.createNoticia(noticiaLike))
        : await firstValueFrom(this.noticiasService.updateNoticia(id, noticiaLike));

      if (isNew) {
        this.router.navigate(['/admin/noticias', result.id]);
      }

      this.showCustomAlert('¡Noticia guardada correctamente!', 'success');
      this.wasSaved.set(true);
      setTimeout(() => this.wasSaved.set(false), 3000);
    } catch (error) {
      console.error('Error saving noticia:', error);
      this.showCustomAlert('Error al guardar la noticia. Por favor, intente nuevamente.', 'error');
    }
  }
}
