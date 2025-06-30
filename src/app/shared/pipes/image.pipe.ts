import { Pipe, PipeTransform } from '@angular/core';
import { ImageEntity } from '@home/interfaces/image.interface';
import { environment } from 'src/environments/environment';

const API_URL = environment.baseUrl;

@Pipe({
    name: 'imageNamePipe',
})
export class ImageNamePipe implements PipeTransform {
    transform(value: string | ImageEntity | ImageEntity[] | null | undefined, path: string): string {
        // 🛑 Si no hay valor
        if (!value) {
            return './assets/images/no-image.jpg';
        }

        // ✅ Si es string (ej. solo el nombre del archivo)
        if (typeof value === 'string') {
            return `${API_URL}/files/${path}/${value}`;
        }

        // ✅ Si es un objeto único con url
        if (this.isImageEntity(value)) {
            return `${API_URL}/files/${path}/${value.url}`;
        }

        // ✅ Si es un arreglo
        if (Array.isArray(value)) {
            const image = value.find(this.isImageEntity); // toma el primero válido
            return image ? `${API_URL}/files/${path}/${image.url}` : './assets/images/no-image.jpg';
        }

        // 🛑 Valor no reconocido
        return './assets/images/no-image.jpg';
    }

    private isImageEntity(obj: any): obj is ImageEntity {
        return obj && typeof obj === 'object' && typeof obj.url === 'string';
    }
}
