import { HttpClient } from '@angular/common/http';
import { inject, Injectable, LOCALE_ID, signal } from '@angular/core';
import { ImageEntity } from "@home/interfaces/image.interface";
import { Enlace } from "@home/interfaces/enlace.interface";
import { InstitucionEntity } from "@home/pages/instituciones/interfaces/aliados.interface";
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NoticiaEntity, NoticiasResponse, Traduccion } from '../interfaces/noticia.interface';
import { User } from '@auth/interfaces/user.interface';




const API_URL = environment.baseUrl;

interface Options {
    limit?: number;
    offset?: number;

}

const emptyNoticia: NoticiaEntity = {
    id: 'new',
    slug: '',
    tags: [],
    paisCode: '',
    pais: '',
    ciudad: '',
    latitud: '',
    longitud: '',
    state: '',
    displayDate: new Date(),
    images: [] as ImageEntity[],
    enlaces: [] as Enlace[],
    traducciones: [] as Traduccion[],
    instituciones: [] as InstitucionEntity[],
    owner: {} as User,
    createdBy: {} as User,
    updatedBy: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
};

// interfaces/create-noticia.dto.ts

export interface CreateNoticiaDto {
    slug: string;
    tags: string[];
    paisCode?: string;
    pais?: string;
    ciudad?: string;
    latitud?: number
    longitud?: number;
    state: string;
    displayDate?: Date;
    instituciones: string[]; // Deben ser IDs (UUID)
    traducciones: {
        idioma: string;
        title: string;
        contentDescription: string;
        content: string;
    }[];
    images: { url: string; altText?: string }[];
    enlaces: { url: string; label?: string }[];
}

const emptyCreateNoticia: CreateNoticiaDto = {
    slug: '',
    tags: [],
    paisCode: '',
    pais: '',
    ciudad: '',
    latitud: 0,
    longitud: 0,
    state: '',
    displayDate: new Date(),
    instituciones: [],
    traducciones: [{
        idioma: 'es',
        title: '',
        contentDescription: '',
        content: '',
    }],
    images: [],
    enlaces: [],
};



@Injectable({ providedIn: 'root' })
export class NoticiasService {
    constructor() { }


    private http = inject(HttpClient);


    private noticiasCache = new Map<string, NoticiasResponse>();
    private noticiaCache = new Map<string, NoticiaEntity>();


    getNoticias(option: Options): Observable<NoticiasResponse> {
        const { limit = 5, offset = 0 } = option;

        const key = `${limit}-${offset}`; // 9-0-''

        if (this.noticiaCache.has(key)) {
            return of(this.noticiasCache.get(key)!);
        }
        return this.http.get<NoticiasResponse>(`${API_URL}/noticias/public`, {
            params: {
                limit,
                offset,
            },
        }).pipe(
            tap((response) => console.log('Noticias Response:', response)),
            tap((resp) => this.noticiasCache.set(key, resp))
        );
    }


    getNoticiasUser(option: Options): Observable<NoticiasResponse> {
        const { limit = 9, offset = 0 } = option;

        console.log('getNoticiasUser', limit, offset);

        return this.http.get<NoticiasResponse>(`${API_URL}/noticias`, {
            params: {
                limit,
                offset,
            },
        }).pipe(
            tap((response) => console.log('Noticias Response:', response)),
        );
    }

    getNoticiaByIdSlug(idSlug: string): Observable<NoticiaEntity> {
        if (this.noticiaCache.has(idSlug)) {
            return of(this.noticiaCache.get(idSlug)!);
        }

        return this.http.get<NoticiaEntity>(`${API_URL}/noticias/public/${idSlug}`,)
            .pipe(tap((noticia) => this.noticiaCache.set(idSlug, noticia)));
        ;
    }

    getNoticiaByIdSlugUser(id: string): Observable<NoticiaEntity> {
        if (id === 'new') {
            return of(emptyNoticia);
        }



        return this.http.get<NoticiaEntity>(`${API_URL}/noticias/${id}`,);

        ;
    }


    getNoticiaById(id: string): Observable<NoticiaEntity> {
        if (id === 'new') {
            return of(emptyNoticia);
        }

        if (this.noticiaCache.has(id)) {
            return of(this.noticiaCache.get(id)!);
        }

        return this.http
            .get<NoticiaEntity>(`${API_URL}/noticia/${id}`)
            .pipe(tap((noticia) => this.noticiaCache.set(id, noticia)));
    }

    createNoticia(data: Partial<NoticiaEntity>, imageFiles?: File[]): Observable<NoticiaEntity> {
        console.log('DTO con imágenes:', data, imageFiles);

        if (imageFiles && imageFiles.length) {
            return this.uploadMultipleImages(imageFiles, 'not').pipe(
                switchMap((uploadResults) => {
                    const dto = {
                        ...data,
                        images: uploadResults.map((result, i) => ({
                            url: result.serverName,
                            altText: data.images?.[i]?.altText || '',
                            orden: i + 1,
                        })),
                    };
                    console.log('DTO con imágenes:', dto);
                    return this.http.post<NoticiaEntity>(`${API_URL}/noticias`, dto);
                })
            );
        }

        return this.http.post<NoticiaEntity>(`${API_URL}/noticias`, data)
    }


    updateNoticia(id: string, data: Partial<NoticiaEntity>, imageFiles?: File[]): Observable<NoticiaEntity> {
        console.log('DTO UPDATE con imágenes:', data, imageFiles);

        if (imageFiles && imageFiles.length) {
            return this.uploadMultipleImages(imageFiles, 'not').pipe(
                switchMap((uploadResults) => {
                    console.log('Resultados de subida:', uploadResults);

                    // Crear una copia de las imágenes originales
                    const finalImages = [...(data.images || [])];

                    // Para cada resultado de subida, buscar en data.images dónde está el nombre original
                    // y reemplazar con el nombre del servidor
                    uploadResults.forEach((result) => {
                        const { originalName, serverName } = result;

                        // Buscar en finalImages donde la url coincida con el nombre original
                        const imageIndex = finalImages.findIndex(img => img.url === originalName);

                        if (imageIndex !== -1) {
                            // Actualizar con el nombre del servidor
                            finalImages[imageIndex] = {
                                ...finalImages[imageIndex],
                                url: serverName,
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
                    return this.http.patch<NoticiaEntity>(`${API_URL}/noticias/${id}`, dto);
                })
            );
        }

        return this.http.patch<NoticiaEntity>(`${API_URL}/noticias/${id}`, data);
    } uploadMultipleImages(images?: File[], folder: string = 'not'): Observable<{ originalName: string, serverName: string }[]> {
        if (!images || images.length === 0) return of([]);

        // Filtrar archivos válidos (no undefined, no null)
        const validImages = images.filter(img => img instanceof File);
        if (validImages.length === 0) return of([]);

        const uploadObservables = validImages.map((imageFile) => this.uploadImage(imageFile, folder));
        return forkJoin(uploadObservables);
    }

    uploadImage(imageFile: File, folder: string): Observable<{ originalName: string, serverName: string }> {
        const formData = new FormData();
        formData.append('file', imageFile);

        return this.http
            .post<{ fileName: string }>(`${API_URL}/files/${folder}`, formData)
            .pipe(
                map((resp) => ({
                    originalName: imageFile.name,
                    serverName: resp.fileName
                }))
            );
    }


}