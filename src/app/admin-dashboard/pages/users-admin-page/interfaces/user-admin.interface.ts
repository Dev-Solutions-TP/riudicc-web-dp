export interface UserEntity {
  id: string;
  email: string;
  fullName: string;
  isActive: boolean;
  roles: string[];
}

export interface UsersResponse {
  users: UserEntity[];
  count: number;
  pages: number;
}

export interface InstitutionOption {
  id: string;
  codigo?: string;
  traducciones?: Array<{ idioma: string; nombre?: string; name?: string }>;
}

export interface CreateUserDto {
  email: string;
  fullName: string;
  password: string;
  roles: string[];
  institucionId?: string;
}

export interface UpdateUserDto {
  email?: string;
  fullName?: string;
  password?: string;
}
