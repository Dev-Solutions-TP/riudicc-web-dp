export interface ObservatorioCargoTranslation { id?: string; idioma: 'es' | 'en'; nombre: string; }
export interface ObservatorioCargo { id: string; codigo: string; isActive: boolean; traducciones: ObservatorioCargoTranslation[]; }
export interface ObservatorioInstitucion {
  id: string; slug?: string; pais?: string;
  images?: Array<{ url?: string; image?: string; altText?: string }>;
  traducciones?: Array<{ idioma: string; name?: string; nombre?: string }>;
}
export interface ObservatorioMember {
  id: string; nombre: string; correo?: string | null; enlaceContacto?: string | null;
  isActive: boolean; fechaInicio: string; fechaFin?: string | null;
  cargo: ObservatorioCargo; institucion: ObservatorioInstitucion;
}
export interface ObservatorioList<T> { count: number; items: T[]; }
