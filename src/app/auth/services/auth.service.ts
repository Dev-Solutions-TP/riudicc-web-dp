import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { User } from '@auth/interfaces/user.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';


const BASE_URL = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor() { }

    private _authStatus = signal<AuthStatus>('checking'); // 'checking', 'authenticated', 'unauthenticated'
    private _user = signal<User | null>(null);

    private _token = signal<string | null>(localStorage.getItem('token'));


    private http = inject(HttpClient);


    checkStatusResource = rxResource({
        loader: () => this.checkAuthStatus(),
    });


    authStatus = computed<AuthStatus>(() => {

        if (this._authStatus() === 'checking') return 'checking';


        if (this._user()) {
            return 'authenticated';

        }


        return 'unauthenticated';
    });

    user = computed(() => this._user());
    token = computed(() => this._token());
    isAdmin = computed(() => this._user()?.roles.some(role => role === 'admin' || role === 'super') ?? false);
    isOwner = computed(() => this._user()?.roles.includes('owner') ?? false);



    login(email: string, password: string): Observable<boolean> {
        return this.http.post<AuthResponse>(`${BASE_URL}/auth/login`, {
            email,
            password,

        }).pipe(
            map((resp) => this.handleAuthSuccess(resp)),
            catchError((error: any) => this.handleAuthError(error))
        );
    }


    checkAuthStatus(): Observable<boolean> {

        const token = localStorage.getItem('token');
        console.log('Checking auth status with token:', token);
        if (!token) {
            this.logout();
            return of(false);
        }

        return this.http.get<AuthResponse>(`${BASE_URL}/auth/check-status`,

        ).pipe(
            map((resp) => this.handleAuthSuccess(resp)),
            catchError((error: any) => this.handleAuthError(error))
        );
    }

    logout() {
        this._authStatus.set('unauthenticated');
        this._user.set(null);
        this._token.set(null);
        localStorage.removeItem('token');
    }


    private handleAuthSuccess(resp: AuthResponse) {
        this._authStatus.set('authenticated');
        this._user.set(resp.user);
        this._token.set(resp.token);
        localStorage.setItem('token', resp.token);
        return true;

    }

    private handleAuthError(error: any) {
        this.logout();
        return of(false);
    }

}