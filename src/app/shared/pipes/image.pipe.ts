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

        // ✅ Si es string (ej. solo el nombre del archivo o URL completa)
        if (typeof value === 'string') {
            return this.buildImageUrl(value, path);
        }

        // ✅ Si es un objeto único con url
        if (this.isImageEntity(value)) {
            return this.buildImageUrl(value.url, path);
        }

        // ✅ Si es un arreglo
        if (Array.isArray(value)) {
            const image = value.find(this.isImageEntity); // toma el primero válido
            return image ? this.buildImageUrl(image.url, path) : './assets/images/no-image.jpg';
        }

        // 🛑 Valor no reconocido
        return './assets/images/no-image.jpg';
    }

    // Método helper para construir URLs - misma lógica que en el componente
    private buildImageUrl(imageUrl: string, path: string): string {
        if (!imageUrl) return './assets/images/no-image.jpg';

        // Si la URL ya es completa (Cloudinary u otras URLs), usarla tal como está
        if (imageUrl.startsWith('http') || imageUrl.startsWith('blob:')) {
            return imageUrl;
        }

        // Si es solo un nombre de archivo (sistema anterior), construir la URL completa
        return `${API_URL}/files/${path}/${imageUrl}`;
    }

    private isImageEntity(obj: any): obj is ImageEntity {
        return obj && typeof obj === 'object' && typeof obj.url === 'string';
    }
}
