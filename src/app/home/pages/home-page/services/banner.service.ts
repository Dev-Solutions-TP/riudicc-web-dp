import { HttpClient } from '@angular/common/http';
import { inject, Injectable, LOCALE_ID, signal } from '@angular/core';

import { map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BannerEntity, BannersResponse, UpdateBannerDto } from '../interfaces/banner.interface';




const API_URL = environment.baseUrl;

interface Options {
    limit?: number;
    offset?: number;

}
const emptyBanner: BannerEntity = {
    createdAt: new Date(),
    updatedAt: new Date(),
    id: 'new',
    slug: '',
    tags: [],
    image: '',
    enlaces: '',
    fechaInicio: '',
    fechaFin: '',
    state: '',
    traducciones: [],
    createdBy: {} as any,
    updatedBy: {} as any,
};


@Injectable({ providedIn: 'root' })
export class BannersService {

    constructor() { }


    private http = inject(HttpClient);

    private bannersCache = new Map<string, BannersResponse>();
    private bannerCache = new Map<string, BannerEntity>();



    getBanners(option: Options): Observable<BannersResponse> {
        const { limit = 8, offset = 0 } = option;

        return this.http.get<BannersResponse>(`${API_URL}/banners/public`, {
            params: {
                limit,
                offset,
            },
        });
    }

    getBannersAdmin(option: Options): Observable<BannersResponse> {
        const { limit = 8, offset = 0 } = option;

        return this.http.get<BannersResponse>(`${API_URL}/banners`, {
            params: {
                limit,
                offset,
            },
        });
    }



    getBannerById(id: string): Observable<BannerEntity> {
        if (id === 'new') {
            return of(emptyBanner);
        }

        if (this.bannerCache.has(id)) {
            return of(this.bannerCache.get(id)!);
        }

        return this.http
            .get<BannerEntity>(`${API_URL}/banners/${id}`)
            .pipe(tap((banner) => this.bannerCache.set(id, banner)));
    }

    createBanner(
        data: Partial<UpdateBannerDto>,
        imageFile?: File
    ): Observable<BannerEntity> {
        console.log('DTO UPDATE con imágenes:', imageFile);

        if (imageFile) {
            return this.uploadEntityImage(imageFile, 'ban').pipe(
                switchMap((imageUrl) => {
                    const dto = { ...data, image: imageUrl };
                    return this.http.post<BannerEntity>(`${API_URL}/banners`, dto);
                }),
                tap((created) => this.bannerCache.set(created.id, created))
            );
        }

        return this.http.post<BannerEntity>(`${API_URL}/banners`, data).pipe(
            tap((created) => this.bannerCache.set(created.id, created))
        );
    }


    updateBanner(
        id: string,
        data: Partial<UpdateBannerDto>,
        imageFile?: File
    ): Observable<BannerEntity> {
        console.log('DTO UPDATE con imágenes:', imageFile);

        if (imageFile) {
            return this.uploadEntityImage(imageFile, 'ban').pipe(
                switchMap((imageUrl) => {
                    const dto = { ...data, image: imageUrl };
                    return this.http.patch<BannerEntity>(`${API_URL}/banners/${id}`, dto);
                }),
                tap((updated) => this.bannerCache.set(updated.id, updated))
            );
        }

        return this.http.patch<BannerEntity>(`${API_URL}/banners/${id}`, data).pipe(
            tap((updated) => this.bannerCache.set(updated.id, updated))
        );
    }



    uploadEntityImage(file: File, folder: string): Observable<string> {
        const formData = new FormData();
        formData.append('file', file);

        console.log('Uploading image to folder: ', formData);
        return this.http.post<{ url: string; public_id: string }>(
            `${API_URL}/files/${folder}`,
            formData
        ).pipe(map((resp) => resp.url));


    }

}