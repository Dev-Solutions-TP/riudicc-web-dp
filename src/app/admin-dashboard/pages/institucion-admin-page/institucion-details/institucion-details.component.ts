import { Component, OnInit, inject, input, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { InstitucionEntity, UpdateInstitucionDto } from '@home/pages/instituciones/interfaces/aliados.interface';
import { InstitucionesService } from '@home/pages/instituciones/services/instituciones.service';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';
import { FormUtils } from '@shared/utils/form-utils';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'institucion-details',
  standalone: true,
  imports: [ReactiveFormsModule, FormErrorLabelComponent],
  templateUrl: './institucion-details.component.html',
})
export class InstitucionDetailsComponent implements OnInit {
  institucion = input.required<InstitucionEntity>();

  fb = inject(FormBuilder);
  router = inject(Router);
  institucionesService = inject(InstitucionesService);


  wasSaved = signal(false);
  formUtils = FormUtils;

  selectedImageFiles: File[] = [];
  previewImageUrls = signal<string[]>([]);


  institucionForm = this.fb.group({
    codigo: ['', Validators.required],
    tipo: ['universidad', Validators.required],
    slug: ['', [Validators.required, Validators.pattern(this.formUtils.slugPattern)]],
    tags: [''],
    paisCode: ['', Validators.required],
    pais: ['', Validators.required],
    ciudad: ['', Validators.required],
    latitud: ['0', Validators.required],
    longitud: ['0', Validators.required],
    state: ['active', Validators.required],
    traducciones: this.fb.array([], Validators.required),
    images: this.fb.array([], Validators.required),
    enlaces: this.fb.array([], Validators.required),
  });


  ngOnInit(): void {
    const data = this.institucion();
    if (data.id !== 'new') {
      this.setFormValues(data);
    } else {
      this.addInitialTranslation();
      this.addInitialImage();
    }
  }

  addInitialTranslation() {
    ['es', 'en'].forEach(idioma => {
      this.traduccionesFormArray.push(
        this.fb.group({
          idioma: [idioma, Validators.required],
          name: ['', Validators.required],
          shortName: [''],
          description: [''],
        })
      );
    });
  }
  // add initial image addInitialImage() 
  addInitialImage() {
    this.imagesFormArray.push(
      this.fb.group({
        url: ['', Validators.required],
        altText: ['', Validators.required],
      })
    );
    this.selectedImageFiles.push(undefined as any); // marcador
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


  // Getters para usar en HTML

  get traduccionesFormArray() {
    return this.institucionForm.get('traducciones') as FormArray<FormGroup>;
  }
  get imagesFormArray() {
    return this.institucionForm.get('images') as FormArray<FormGroup>;
  }
  get enlacesFormArray() {
    return this.institucionForm.get('enlaces') as FormArray<FormGroup>;
  }












  addImage() {
    this.imagesFormArray.push(
      this.fb.group({
        url: ['', Validators.required], // <-- obligatorio
        altText: ['', Validators.required],
      })
    );
    this.selectedImageFiles.push(undefined as any); // marcador de posición
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
        label: ['', Validators.required],
        url: ['', Validators.required],
      })
    );
  }

  removeEnlace(index: number) {
    this.enlacesFormArray.removeAt(index);
  }



  addTraduccion() {
    this.traduccionesFormArray.push(
      this.fb.group({
        idioma: ['', Validators.required],
        name: ['', Validators.required],
        shortName: [''],
        description: [''],
      })
    );
  }

  removeTraduccion(index: number) {
    this.traduccionesFormArray.removeAt(index);
  }

  onFilesSelected(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      this.selectedImageFiles = Array.from(files);
    }
  }

  setFormValues(data: InstitucionEntity) {
    this.institucionForm.patchValue({
      codigo: data.codigo,
      tipo: data.tipo,
      slug: data.slug,
      tags: data.tags?.join(',') ?? '',
      paisCode: data.paisCode,
      pais: data.pais,
      ciudad: data.ciudad,
      latitud: data.latitud,
      longitud: data.longitud,
      state: data.state ?? '',
    });

    this.traduccionesFormArray.clear();
    data.traducciones.forEach(t => {
      this.traduccionesFormArray.push(this.fb.group({
        idioma: [t.idioma, Validators.required],
        name: [t.name, Validators.required],
        shortName: [t.shortName],
        description: [t.description],
      }));
    });

    this.imagesFormArray.clear();
    data.images.forEach(img => {
      this.imagesFormArray.push(this.fb.group({
        url: [img.url, Validators.required],
        altText: [img.altText, Validators.required],
      }));
    });

    this.enlacesFormArray.clear();
    data.enlaces.forEach(link => {
      this.enlacesFormArray.push(this.fb.group({
        label: [link.label, Validators.required],
        url: [link.url, Validators.required],
      }));
    });
  }
  // selectedImageFiles: File[] = [];



  async onSubmit() {

    // minimio una imagen
    console.log('Form values:', this.institucionForm.value);



    const tieneImagenValida = this.imagesFormArray.controls.some(group => {
      const url = group.get('url')?.value;
      return !!url && typeof url === 'string' && url.trim() !== '';
    });

    if (!tieneImagenValida) {
      alert('Debe subir al menos una imagen.');
      return;
    }

    console.log('Selected image files:', this.selectedImageFiles);
    if (this.traduccionesFormArray.length < 2) {
      alert('Debe ingresar al menos dos traducciones.');
      return;
    }
    const idiomasSeleccionados = this.traduccionesFormArray.controls
      .map(ctrl => ctrl.get('idioma')?.value);

    const tieneEspanol = idiomasSeleccionados.includes('es');
    const tieneIngles = idiomasSeleccionados.includes('en');

    console.log('Idiomas seleccionados:', idiomasSeleccionados);
    if (!tieneEspanol || !tieneIngles) {
      alert('Debe incluir al menos una traducción en Español y otra en Inglés.');
      return;
    }

    console.log('Form valid:', this.institucionForm.valid);

    if (this.institucionForm.invalid) {
      this.institucionForm.markAllAsTouched();
      console.log('Formulario inválido:', this.institucionForm.errors);
      // Revisión campo por campo
      Object.entries(this.institucionForm.controls).forEach(([key, control]) => {
        if (control.invalid) {
          console.error(`Campo inválido: ${key}`, control.errors);
        }
      });

      return;
    }

    console.log('Formulario válido, enviando datos...');



    const value = this.institucionForm.value;

    const dto: Partial<UpdateInstitucionDto> = {
      ...value,
      codigo: value.codigo ?? undefined,
      tipo: value.tipo ?? undefined,
      slug: value.slug ?? undefined,
      paisCode: value.paisCode ?? undefined,
      pais: value.pais ?? undefined,
      ciudad: value.ciudad ?? undefined,
      latitud: value.latitud ?? undefined,
      longitud: value.longitud ?? undefined,
      state: value.state ?? undefined,
      tags: value.tags?.split(',').map(t => t.trim()) ?? [],
      traducciones: value.traducciones as UpdateInstitucionDto['traducciones'],
      enlaces: value.enlaces as UpdateInstitucionDto['enlaces'],
      images: value.images as UpdateInstitucionDto['images'],
    };

    console.log('DTO to send:', dto);
    const id = this.institucion().id;
    const isNew = id === 'new';

    if (this.selectedImageFiles.length > 0) {
      const fileNames = await firstValueFrom(this.institucionesService.uploadMultipleImages(this.selectedImageFiles));
      dto.images = fileNames.map((url, i) => ({
        url,
        altText: this.imagesFormArray.at(i).get('altText')?.value || '',
      }));
    }
    console.log('DTO with images:', dto.images);


    const result = isNew
      ? await firstValueFrom(this.institucionesService.createInstitucion(dto))
      : await firstValueFrom(this.institucionesService.updateInstitucion(id, dto));

    if (isNew) {
      this.router.navigate(['/admin/universidades', result.id]);
    }

    this.wasSaved.set(true);
    setTimeout(() => this.wasSaved.set(false), 3000);
  }



}
