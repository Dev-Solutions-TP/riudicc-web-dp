import { User } from "@auth/interfaces/user.interface";
import { ImageEntity } from "@home/interfaces/image.interface";
import { Enlace } from "@home/interfaces/enlace.interface";

export interface InstitucionResponse {
    count: number;
    pages: number;
    items: InstitucionEntity[];
}

export interface InstitucionEntity {
    createdAt: Date;
    updatedAt: Date;
    id: string;
    codigo: string;
    tipo: string;
    slug: string;
    tags: string[];
    paisCode: string;
    pais: string;
    ciudad: string;
    latitud: string;
    longitud: string;
    state: string;
    images: ImageEntity[];
    enlaces: Enlace[];
    traducciones: Traduccione[];
    owner: User;
    createdBy: User;
    updatedBy: User;
}



export interface Traduccione {
    id: string;
    idioma: string;
    name: string;
    description: string;
    shortName: string;
}


export interface UpdateInstitucionDto {
    codigo?: string;
    slug?: string;
    tipo?: string;
    paisCode?: string;
    pais?: string;
    ciudad?: string;
    latitud?: string;
    longitud?: string;
    tags?: string[];
    state: string;
    traducciones: Traduccione[];
    images?: ImageInput[];
    enlaces: Enlace[];
}export interface ImageInput {
    url: string;
    altText: string;
    public_id?: string;  // Public ID de Cloudinary para operaciones
    orden?: number;      // Orden de la imagen
}