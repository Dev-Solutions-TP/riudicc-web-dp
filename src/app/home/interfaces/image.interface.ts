
export interface ImageEntity {
    id: string;
    orden: number;
    url: string;
    altText: string;
    public_id?: string;  // Public ID de Cloudinary para operaciones
}