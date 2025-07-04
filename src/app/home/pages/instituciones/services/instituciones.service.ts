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
            return this.uploadMultipleImages(imageFiles, 'inst').pipe(
                switchMap((imageNames) => {
                    const dto = {
                        ...data,
                        images: imageNames.map((fileName, i) => ({
                            url: fileName,
                            altText: data.images?.[i]?.altText || '',
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
        if (imageFiles && imageFiles.length) {
            return this.uploadMultipleImages(imageFiles, 'inst').pipe(
                switchMap((imageNames) => {
                    const dto = {
                        ...data,
                        images: imageNames.map((fileName, i) => ({
                            url: fileName,
                            altText: data.images?.[i]?.altText || '',
                        })),
                    };
                    return this.http.patch<InstitucionEntity>(`${API_URL}/instituciones/${id}`, dto);
                })
            );
        }

        return this.http.patch<InstitucionEntity>(`${API_URL}/instituciones/${id}`, data);
    }

    uploadMultipleImages(images?: File[], folder: string = 'uni'): Observable<string[]> {
        if (!images) return of([]);
        const uploadObservables = Array.from(images).map((imageFile) => this.uploadImage(imageFile, folder));
        return forkJoin(uploadObservables);
    }

    uploadImage(imageFile: File, folder: string = 'inst'): Observable<string> {
        const formData = new FormData();
        formData.append('file', imageFile);
        return this.http
            .post<{ fileName: string }>(`${API_URL}/files/${folder}`, formData)
            .pipe(map((resp) => resp.fileName));
    }
}