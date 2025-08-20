import { HttpClient } from '@angular/common/http';
import { inject, Injectable, LOCALE_ID, signal } from '@angular/core';

import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { InstitucionEntity, InstitucionResponse, UpdateInstitucionDto } from '../interfaces/aliados.interface';




const API_URL = environment.baseUrl;

interface Options {
    limit?: number;
    offset?: number;

}

const emptyInstitucion: InstitucionEntity = {
    createdAt: new Date(),
    updatedAt: new Date(),
    id: 'new',
    codigo: '',
    slug: '',
    tipo: 'universidad',
    tags: [],
    owner: {} as any,
    pais: '',
    paisCode: '',
    ciudad: '',
    latitud: '',
    longitud: '',
    images: [],
    enlaces: [],
    traducciones: [],
    state: 'active',
    createdBy: {} as any,
    updatedBy: {} as any,

};


@Injectable({ providedIn: 'root' })
export class InstitucionesService {
    constructor() { }


    private http = inject(HttpClient);
    private bannerCache = new Map<string, InstitucionEntity>();





    getInstituciones(option: Options): Observable<InstitucionResponse> {

        const { limit = 100, offset = 0 } = option;

        return this.http.get<InstitucionResponse>(`${API_URL}/instituciones/public`, {
            params: { limit, offset },
        });
    }

    getInstitucionesAsociadas(option: Options): Observable<InstitucionResponse> {

        const { limit = 100, offset = 0 } = option;

        return this.http.get<InstitucionResponse>(`${API_URL}/instituciones/asociados/public`, {
            params: { limit, offset },
        });
    }

    getInstitucionesUsers(option: Options): Observable<InstitucionResponse> {

        const { limit = 9, offset = 0 } = option;

        console.log('getInstitucionesUsers', limit, offset);
        return this.http.get<InstitucionResponse>(`${API_URL}/instituciones`, {
            params: { limit, offset },
        });

    }


    getInstitucionByIdSlug(idSlug: string): Observable<InstitucionEntity> {


        return this.http.get<InstitucionEntity>(`${API_URL}/instituciones/public/${idSlug}`, {});
    }
    getInstitucionByIdSlugUser(id: string): Observable<InstitucionEntity> {
        if (id === 'new') {
            return of(emptyInstitucion);
        }

        if (this.bannerCache.has(id)) {
            return of(this.bannerCache.get(id)!);
        }

        return this.http.get<InstitucionEntity>(`${API_URL}/instituciones/${id}`)
            .pipe(tap((banner) => this.bannerCache.set(id, banner)));;
    }

    createInstitucion(
        data: Partial<UpdateInstitucionDto>,
        imageFiles?: File[]
    ): Observable<InstitucionEntity> {
        console.log('createInstitucion', data, imageFiles);
        if (imageFiles && imageFiles.length) {
            return this.uploadMultipleImages(imageFiles, 'uni').pipe(
                switchMap((uploadResults) => {
                    const dto = {
                        ...data,
                        images: uploadResults.map((result, i) => ({
                            url: result.serverName,       // URL completa de Cloudinary
                            public_id: result.publicId,   // Public ID para operaciones
                            altText: data.images?.[i]?.altText || '',
                            orden: i + 1,
                        })),
                    };
                    console.log('DTO con imágenes:', dto);
                    return this.http.post<InstitucionEntity>(`${API_URL}/instituciones`, dto);
                })
            );
        }

        return this.http.post<InstitucionEntity>(`${API_URL}/instituciones`, data);
    }

    updateInstitucion(
        id: string,
        data: Partial<UpdateInstitucionDto>,
        imageFiles?: File[]
    ): Observable<InstitucionEntity> {
        console.log('DTO UPDATE con imágenes:', data, imageFiles);

        if (imageFiles && imageFiles.length) {
            return this.uploadMultipleImages(imageFiles, 'uni').pipe(
                switchMap((uploadResults) => {
                    console.log('Resultados de subida:', uploadResults);

                    // Crear una copia de las imágenes originales
                    const finalImages = [...(data.images || [])];

                    // Para cada resultado de subida, buscar en data.images dónde está el nombre original
                    // y reemplazar con el nombre del servidor
                    uploadResults.forEach((result) => {
                        const { originalName, serverName, publicId } = result;

                        // Buscar en finalImages donde la url coincida con el nombre original
                        const imageIndex = finalImages.findIndex(img => img.url === originalName);

                        if (imageIndex !== -1) {
                            // Actualizar con el nombre del servidor y public_id
                            finalImages[imageIndex] = {
                                ...finalImages[imageIndex],
                                url: serverName,           // URL completa de Cloudinary
                                public_id: publicId,       // Public ID para operaciones
                                orden: imageIndex + 1,
                            };
                            console.log(`Imagen ${imageIndex} actualizada: ${originalName} -> ${serverName}`);
                        }
                    });

                    const dto = {
                        ...data,
                        images: finalImages,
                    };

                    console.log('DTO UPDATE con imágenes antes de enviar a servicio:', dto);
                    return this.http.patch<InstitucionEntity>(`${API_URL}/instituciones/${id}`, dto);
                })
            );
        }

        return this.http.patch<InstitucionEntity>(`${API_URL}/instituciones/${id}`, data);
    }

    uploadMultipleImages(images?: File[], folder: string = 'uni'): Observable<{ originalName: string, serverName: string, publicId: string }[]> {
        if (!images || images.length === 0) return of([]);

        // Filtrar archivos válidos (no undefined, no null)
        const validImages = images.filter(img => img instanceof File);
        if (validImages.length === 0) return of([]);

        const uploadObservables = validImages.map((imageFile) => this.uploadImage(imageFile, folder));
        return forkJoin(uploadObservables);
    }

    uploadImage(imageFile: File, folder: string): Observable<{ originalName: string, serverName: string, publicId: string }> {
        const formData = new FormData();
        formData.append('file', imageFile);

        return this.http
            .post<{ url: string, public_id: string }>(`${API_URL}/files/${folder}`, formData)
            .pipe(
                map((resp) => ({
                    originalName: imageFile.name,
                    serverName: resp.url,
                    publicId: resp.public_id
                }))
            );
    }
}