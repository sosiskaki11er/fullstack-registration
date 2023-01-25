import $api from '../http/index'
import { AxiosResponse } from 'axios'
import { AuthResponse } from '../models/response/AuthResponse'

export default class AuthService {
    static async login(email:string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/login',{email, password})
    }

    static async registration(email:string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/registration',{email, password})
    }

    static async logout(): Promise<void> {
        return $api.post('/logout')
    }
    
    static async blockUser(email:string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post('/block',{email})
    }

    static async unblockUser(email:string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post('/unblock',{email})
    }

    static async deleteUser(email:string): Promise<void> {
        return $api.post('/delete', {email})
    }
}